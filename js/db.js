/* AbiLearn — Firestore Data Access Layer v1
 *
 * All student data is stored under /users/{uid}/.
 * This module is the single point of contact with Firestore — nothing
 * else in the codebase calls _fdb directly.
 *
 * Exported as window.DB (object).
 */
var DB = (function () {

  /* ── helpers ── */
  function fs()  { return window._fdb; }
  function auth(){ return window._fauth; }
  function uid() {
    var u = auth() && auth().currentUser;
    return u ? u.uid : null;
  }
  function userRef(id) {
    return fs().collection('users').doc(id || uid());
  }
  function subCol(col, id) {
    return userRef(id).collection(col);
  }
  function pdfKey(url) {
    return url.replace(/[^a-zA-Z0-9]/g, '_').slice(-120);
  }

  /* ══ USER PROFILE ══ */
  async function getProfile(id) {
    if (!fs()) return null;
    try {
      var doc = await userRef(id).get();
      return doc.exists ? doc.data() : null;
    } catch (e) { console.warn('DB.getProfile', e); return null; }
  }

  async function setProfile(data, id) {
    if (!fs()) return;
    try { await userRef(id).set(data, { merge: true }); }
    catch (e) { console.warn('DB.setProfile', e); }
  }

  /* ══ KNOWLEDGE MAP ══
   * Each document key: "{subjectId}_{chapterId}"
   * Fields: subjectId, chapterId, mastery, totalAttempts,
   *         correctAttempts, accuracy, lastStudied, nextRevisionDue
   */
  async function getKnowledgeMap(id) {
    if (!fs()) return {};
    try {
      var snap = await subCol('knowledgeMap', id).get();
      var map = {};
      snap.forEach(function(doc) { map[doc.id] = doc.data(); });
      return map;
    } catch (e) { console.warn('DB.getKnowledgeMap', e); return {}; }
  }

  /* ── mastery helpers ── */
  function computeMastery(total, correct) {
    if (!total) return 'not_started';
    var acc = correct / total;
    if (acc >= 0.85 && total >= 10) return 'mastered';
    if (acc >= 0.70) return 'proficient';
    if (acc >= 0.50) return 'developing';
    return 'learning';
  }

  function nextRevisionDate(mastery) {
    var DAY = 86400000;
    var now = Date.now();
    switch (mastery) {
      case 'mastered':   return new Date(now + 7 * DAY);
      case 'proficient': return new Date(now + 3 * DAY);
      case 'developing': return new Date(now + DAY);
      case 'learning':   return new Date(now + 4 * 60 * 60 * 1000);
      default:           return null;
    }
  }

  /* Updates knowledge map entry after one MCQ attempt */
  async function updateMasteryAfterAttempt(subjectId, chapterId, correct, id) {
    if (!fs()) return null;
    var key = subjectId + '_' + chapterId;
    try {
      var ref  = subCol('knowledgeMap', id).doc(key);
      var doc  = await ref.get();
      var prev = doc.exists ? doc.data() : { totalAttempts: 0, correctAttempts: 0 };
      var total   = (prev.totalAttempts   || 0) + 1;
      var correct2= (prev.correctAttempts || 0) + (correct ? 1 : 0);
      var mastery = computeMastery(total, correct2);
      var data = {
        subjectId:      subjectId,
        chapterId:      chapterId,
        mastery:        mastery,
        totalAttempts:  total,
        correctAttempts:correct2,
        accuracy:       correct2 / total,
        lastStudied:    firebase.firestore.FieldValue.serverTimestamp(),
        nextRevisionDue:nextRevisionDate(mastery)
      };
      if (!prev.firstStudied) {
        data.firstStudied = firebase.firestore.FieldValue.serverTimestamp();
      }
      await ref.set(data, { merge: true });
      return mastery;
    } catch (e) { console.warn('DB.updateMasteryAfterAttempt', e); return null; }
  }

  /* ══ QUESTION ATTEMPTS ══ */
  async function recordAttempt(data, id) {
    if (!fs()) return;
    try {
      await subCol('questionAttempts', id).add(Object.assign({}, data, {
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }));
    } catch (e) { console.warn('DB.recordAttempt', e); }
  }

  async function getRecentAttempts(limitN, id) {
    if (!fs()) return [];
    try {
      var snap = await subCol('questionAttempts', id)
        .orderBy('timestamp', 'desc').limit(limitN || 100).get();
      return snap.docs.map(function(d) { return Object.assign({ id: d.id }, d.data()); });
    } catch (e) { console.warn('DB.getRecentAttempts', e); return []; }
  }

  /* ══ MISTAKE BANK ══
   * Key: "{subjectId}_{chapterId}_{qIdx}"
   */
  async function getMistakes(id) {
    if (!fs()) return {};
    try {
      var snap = await subCol('mistakes', id).where('status', '==', 'active').get();
      var out = {};
      snap.forEach(function(doc) { out[doc.id] = doc.data(); });
      return out;
    } catch (e) { console.warn('DB.getMistakes', e); return {}; }
  }

  async function recordMistake(key, data, id) {
    if (!fs()) return;
    try {
      var ref = subCol('mistakes', id).doc(key);
      var doc = await ref.get();
      if (doc.exists) {
        await ref.update({
          occurrences: firebase.firestore.FieldValue.increment(1),
          lastOccurred: firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        await ref.set(Object.assign({}, data, {
          occurrences:  1,
          status:       'active',
          firstOccurred: firebase.firestore.FieldValue.serverTimestamp(),
          lastOccurred:  firebase.firestore.FieldValue.serverTimestamp()
        }));
      }
    } catch (e) { console.warn('DB.recordMistake', e); }
  }

  async function resolveMistake(key, id) {
    if (!fs()) return;
    try {
      await subCol('mistakes', id).doc(key).update({ status: 'resolved' });
    } catch (e) { console.warn('DB.resolveMistake', e); }
  }

  /* ══ PDF PROGRESS ══ */
  async function getPdfProgress(id) {
    if (!fs()) return {};
    try {
      var snap = await subCol('pdfProgress', id).get();
      var out = {};
      snap.forEach(function(doc) {
        var d = doc.data();
        out[d.url] = d;
      });
      return out;
    } catch (e) { console.warn('DB.getPdfProgress', e); return {}; }
  }

  async function setPdfDone(url, title, done, id) {
    if (!fs()) return;
    try {
      var key = pdfKey(url);
      await subCol('pdfProgress', id).doc(key).set({
        url:         url,
        title:       title || url,
        completed:   !!done,
        completedAt: done ? firebase.firestore.FieldValue.serverTimestamp() : null
      }, { merge: true });
    } catch (e) { console.warn('DB.setPdfDone', e); }
  }

  /* ══ STUDY PLANS ══
   * Keyed by date string "YYYY-MM-DD"
   */
  async function getStudyPlan(date, id) {
    if (!fs()) return null;
    try {
      var doc = await subCol('studyPlans', id).doc(date).get();
      return doc.exists ? doc.data() : null;
    } catch (e) { console.warn('DB.getStudyPlan', e); return null; }
  }

  async function setStudyPlan(date, items, id) {
    if (!fs()) return;
    try {
      await subCol('studyPlans', id).doc(date).set({
        date:        date,
        items:       items,
        generatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (e) { console.warn('DB.setStudyPlan', e); }
  }

  /* ══ ANALYTICS HELPERS ══ */

  /* Returns 0-100 pct: chapters where mastery is proficient or mastered */
  function computeSubjectPct(subjectId, knowledgeMap) {
    if (typeof DATA === 'undefined') return 0;
    var sub = DATA.subjects.find(function(s) { return s.id === subjectId; });
    if (!sub || !sub.chapters.length) return 0;
    var advanced = sub.chapters.filter(function(ch) {
      var entry = knowledgeMap[subjectId + '_' + ch.id];
      return entry && (entry.mastery === 'proficient' || entry.mastery === 'mastered');
    }).length;
    return Math.round((advanced / sub.chapters.length) * 100);
  }

  /* Chapters that are due for revision (nextRevisionDue has passed) */
  function getDueForRevision(knowledgeMap) {
    var now = Date.now();
    return Object.values(knowledgeMap).filter(function(e) {
      if (!e.nextRevisionDue) return false;
      var due = e.nextRevisionDue.toDate ? e.nextRevisionDue.toDate() : new Date(e.nextRevisionDue);
      return due.getTime() < now && e.mastery !== 'not_started';
    });
  }

  /* Overall accuracy across all question attempts */
  async function getOverallStats(id) {
    if (!fs()) return { total: 0, correct: 0, accuracy: 0 };
    try {
      var map = await getKnowledgeMap(id);
      var entries = Object.values(map);
      if (!entries.length) return { total: 0, correct: 0, accuracy: 0 };
      var total   = entries.reduce(function(s, e) { return s + (e.totalAttempts || 0); }, 0);
      var correct = entries.reduce(function(s, e) { return s + (e.correctAttempts || 0); }, 0);
      return {
        total:    total,
        correct:  correct,
        accuracy: total ? Math.round((correct / total) * 100) : 0
      };
    } catch (e) { return { total: 0, correct: 0, accuracy: 0 }; }
  }

  /* ══ STUDY STREAK ══
   * Idempotent per-day: first attempt of each day updates studyStreak / lastStudyDate.
   */
  async function recordStudyActivity(id) {
    if (!fs() || !id) return;
    try {
      var today = new Date().toISOString().slice(0, 10);
      var profile = await getProfile(id);
      if (profile && profile.lastStudyDate === today) return;
      var yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      var streak = (profile && profile.studyStreak) || 0;
      var newStreak = (profile && profile.lastStudyDate === yesterday) ? streak + 1 : 1;
      await setProfile({ lastStudyDate: today, studyStreak: newStreak }, id);
    } catch (e) { console.warn('DB.recordStudyActivity', e); }
  }

  /* ══ LEGACY MIGRATION ══
   * One-time: copies pdf_done_<email> from localStorage to Firestore.
   */
  async function migrateLegacyProgress(email, id) {
    if (!fs() || !id || !email) return;
    try {
      var profile = await getProfile(id);
      if (profile && profile.legacyMigrated) return;
    } catch (e) { return; }

    try {
      var raw = localStorage.getItem('pdf_done_' + email);
      var store = raw ? JSON.parse(raw) : {};
      var entries = Object.entries(store).filter(function(e) { return e[1]; });
      if (entries.length) {
        var batch = fs().batch();
        entries.forEach(function(pair) {
          var url = pair[0];
          var key = pdfKey(url);
          var ref = subCol('pdfProgress', id).doc(key);
          batch.set(ref, {
            url:         url,
            title:       url,
            completed:   true,
            completedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        });
        await batch.commit();
      }
    } catch (e) { console.warn('DB.migrateLegacyProgress', e); }

    try {
      await setProfile({ legacyMigrated: true }, id);
    } catch (e) { /* non-fatal */ }
  }

  /* public API */
  return {
    getProfile:                getProfile,
    setProfile:                setProfile,
    getKnowledgeMap:           getKnowledgeMap,
    updateMasteryAfterAttempt: updateMasteryAfterAttempt,
    computeMastery:            computeMastery,
    computeSubjectPct:         computeSubjectPct,
    getDueForRevision:         getDueForRevision,
    getOverallStats:           getOverallStats,
    recordAttempt:             recordAttempt,
    getRecentAttempts:         getRecentAttempts,
    getMistakes:               getMistakes,
    recordMistake:             recordMistake,
    resolveMistake:            resolveMistake,
    getPdfProgress:            getPdfProgress,
    setPdfDone:                setPdfDone,
    getStudyPlan:              getStudyPlan,
    setStudyPlan:              setStudyPlan,
    recordStudyActivity:       recordStudyActivity,
    migrateLegacyProgress:     migrateLegacyProgress
  };
})();
