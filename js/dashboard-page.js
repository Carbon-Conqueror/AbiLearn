/* AbiLearn — Exam Dashboard Page
 *
 * Requires: firebase-config.js, db.js, data.js, app.js, auth.js
 * Renders: readiness score, subject bars, today's study plan, revision queue, quick stats
 */
(function () {

  var SUBJECT_META = {
    maths:   { name: 'Mathematics',   icon: '', color: '#EF4444', href: 'maths.html',   mcqHref: null },
    science: { name: 'Science',        icon: '', color: '#0EA5E9', href: 'science.html', mcqHref: 'science.html' },
    english: { name: 'English',        icon: '', color: '#F59E0B', href: 'english.html', mcqHref: null },
    social:  { name: 'Social Science', icon: '', color: '#10B981', href: 'social.html',  mcqHref: 'social.html' }
  };

  var PLAN_TYPE_LABEL = { revise: 'Revise', practice: 'Practice', start: 'Start' };
  var PLAN_TYPE_COLOR = { revise: '#F59E0B', practice: '#3B82F6', start: '#10B981' };

  function escH(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function getChapterTitle(subjectId, chapterId) {
    if (typeof DATA === 'undefined') return 'Chapter ' + chapterId;
    var sub = DATA.subjects.find(function(s) { return s.id === subjectId; });
    if (!sub) return 'Chapter ' + chapterId;
    var ch = sub.chapters.find(function(c) { return String(c.id) === String(chapterId); });
    return ch ? ch.title : 'Chapter ' + chapterId;
  }

  /* ── Readiness Ring ── */
  function buildReadinessRing(score) {
    var r = 52, circ = 2 * Math.PI * r;
    var dash = (score / 100) * circ;
    var color = score >= 70 ? '#059669' : score >= 50 ? '#3B82F6' : score >= 30 ? '#D97706' : '#EF4444';
    var label = score >= 70 ? 'Great shape!' : score >= 50 ? 'Good progress' : score >= 30 ? 'Keep going' : 'Just starting';
    return (
      '<div class="dash-ring-wrap">' +
        '<svg class="dash-ring-svg" viewBox="0 0 120 120" width="160" height="160" role="img" aria-label="Exam readiness ' + score + ' out of 100">' +
          '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="var(--border)" stroke-width="10"/>' +
          '<circle cx="60" cy="60" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="10"' +
            ' stroke-dasharray="' + dash.toFixed(1) + ' ' + circ.toFixed(1) + '"' +
            ' stroke-linecap="round" transform="rotate(-90 60 60)"' +
            ' style="transition:stroke-dasharray 1s ease"/>' +
          '<text x="60" y="54" text-anchor="middle" font-size="24" font-weight="900" fill="' + color + '" font-family="inherit">' + score + '</text>' +
          '<text x="60" y="68" text-anchor="middle" font-size="9" fill="var(--muted)" font-family="inherit">/ 100</text>' +
        '</svg>' +
        '<div class="dash-ring-title">Exam Readiness</div>' +
        '<div class="dash-ring-label" style="color:' + color + '">' + escH(label) + '</div>' +
      '</div>'
    );
  }

  /* ── Subject Bars ── */
  function buildSubjectBars(km) {
    if (typeof DATA === 'undefined') return '<div style="color:var(--muted)">Subject data unavailable.</div>';
    return DATA.subjects.map(function(sub) {
      var meta = SUBJECT_META[sub.id] || { name: sub.name, icon: '', color: '#7C3AED', href: '#' };
      var pct = DB.computeSubjectPct(sub.id, km);
      var entries = sub.chapters.map(function(ch) { return km[sub.id + '_' + ch.id] || {}; });
      var mastered  = entries.filter(function(e) { return e.mastery === 'mastered'; }).length;
      var proficient= entries.filter(function(e) { return e.mastery === 'proficient'; }).length;
      var started   = entries.filter(function(e) { return e.mastery && e.mastery !== 'not_started'; }).length;
      return (
        '<div class="dash-subject-row">' +
          '<div class="dash-subj-info">' +
            '<span class="dash-subj-icon" style="color:' + meta.color + '">' + meta.icon + '</span>' +
            '<a href="' + escH(meta.href) + '" class="dash-subj-name" style="color:' + meta.color + '">' + escH(meta.name) + '</a>' +
          '</div>' +
          '<div class="dash-subj-right">' +
            '<div class="dash-subj-bar"><div class="dash-subj-fill" style="width:' + pct + '%;background:' + meta.color + '"></div></div>' +
            '<span class="dash-subj-pct">' + pct + '%</span>' +
          '</div>' +
          '<div class="dash-subj-detail">' +
            (mastered  ? '<span class="dash-subj-chip" style="background:#D1FAE5;color:#059669">' + mastered  + ' mastered</span>'  : '') +
            (proficient? '<span class="dash-subj-chip" style="background:#EFF6FF;color:#2563EB">' + proficient+ ' proficient</span>': '') +
            '<span class="dash-subj-chip" style="background:var(--surface);color:var(--muted)">' + started + '/' + sub.chapters.length + ' started</span>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ── Smart Study Plan ── */
  async function generateSmartPlan(uid, km) {
    var today = new Date().toISOString().slice(0, 10);
    var existing = await DB.getStudyPlan(today, uid);
    if (existing && existing.items && existing.items.length) return existing.items;

    var items = [];
    var MAX = 6;

    // P1: Due for revision
    DB.getDueForRevision(km).slice(0, 3).forEach(function(e) {
      if (items.length >= MAX) return;
      items.push({ type: 'revise', subjectId: e.subjectId, chapterId: String(e.chapterId), mastery: e.mastery });
    });

    if (typeof DATA !== 'undefined') {
      var added = function(sid, cid) { return items.some(function(i) { return i.subjectId === sid && i.chapterId === String(cid); }); };

      // P2: Learning chapters
      DATA.subjects.forEach(function(sub) {
        sub.chapters.forEach(function(ch) {
          if (items.length >= MAX || added(sub.id, ch.id)) return;
          var e = km[sub.id + '_' + ch.id] || {};
          if (e.mastery === 'learning') items.push({ type: 'practice', subjectId: sub.id, chapterId: String(ch.id), mastery: 'learning' });
        });
      });

      // P3: Developing chapters
      DATA.subjects.forEach(function(sub) {
        sub.chapters.forEach(function(ch) {
          if (items.length >= MAX || added(sub.id, ch.id)) return;
          var e = km[sub.id + '_' + ch.id] || {};
          if (e.mastery === 'developing') items.push({ type: 'practice', subjectId: sub.id, chapterId: String(ch.id), mastery: 'developing' });
        });
      });

      // P4: Not started chapters
      DATA.subjects.forEach(function(sub) {
        sub.chapters.forEach(function(ch) {
          if (items.length >= MAX || added(sub.id, ch.id)) return;
          var e = km[sub.id + '_' + ch.id] || {};
          if (!e.mastery || e.mastery === 'not_started') items.push({ type: 'start', subjectId: sub.id, chapterId: String(ch.id), mastery: 'not_started' });
        });
      });
    }

    if (items.length && uid) { DB.setStudyPlan(today, items, uid); }
    return items;
  }

  function buildPlanHTML(items, km) {
    if (!items || !items.length) {
      return '<div style="color:var(--muted);font-size:0.9rem;padding:1rem 0">No study items to show. Start practicing MCQs to generate your plan!</div>';
    }
    return items.map(function(item, i) {
      var meta = SUBJECT_META[item.subjectId] || { name: item.subjectId, icon: '', color: '#7C3AED', href: '#' };
      var chTitle = getChapterTitle(item.subjectId, item.chapterId);
      var typeLabel = PLAN_TYPE_LABEL[item.type] || 'Study';
      var typeColor = PLAN_TYPE_COLOR[item.type] || '#7C3AED';
      var entry = km[item.subjectId + '_' + item.chapterId] || {};
      var acc = (entry.totalAttempts && entry.correctAttempts !== undefined)
        ? Math.round((entry.correctAttempts / entry.totalAttempts) * 100) + '% accuracy'
        : 'not attempted';
      return (
        '<a href="' + escH(meta.href) + '" class="dash-plan-item" data-idx="' + i + '">' +
          '<div class="dash-plan-left">' +
            '<span class="dash-plan-type" style="color:' + typeColor + ';background:' + typeColor + '18">' + typeLabel + '</span>' +
          '</div>' +
          '<div class="dash-plan-mid">' +
            '<div class="dash-plan-title">' +
              '<span style="color:' + meta.color + '">' + meta.icon + '</span> ' +
              'Ch ' + escH(String(item.chapterId)) + ': ' + escH(chTitle) +
            '</div>' +
            '<div class="dash-plan-sub">' + escH(meta.name) + ' · ' + acc + '</div>' +
          '</div>' +
          '<div class="dash-plan-right">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
          '</div>' +
        '</a>'
      );
    }).join('');
  }

  /* ── Due for Revision ── */
  function buildRevisionHTML(km) {
    var due = DB.getDueForRevision(km);
    if (!due.length) {
      return '<div style="color:var(--muted);font-size:0.9rem;padding:0.75rem 0">Nothing due right now — keep it up!</div>';
    }
    var now = Date.now();
    return due.map(function(e) {
      var meta = SUBJECT_META[e.subjectId] || { name: e.subjectId, icon: '', color: '#7C3AED', href: '#' };
      var chTitle = getChapterTitle(e.subjectId, e.chapterId);
      var dueDate = e.nextRevisionDue
        ? (e.nextRevisionDue.toDate ? e.nextRevisionDue.toDate() : new Date(e.nextRevisionDue))
        : null;
      var hoursAgo = dueDate ? Math.floor((now - dueDate.getTime()) / 3600000) : 0;
      var dueStr = hoursAgo < 1 ? 'Due now' : hoursAgo < 24 ? hoursAgo + 'h overdue' : Math.floor(hoursAgo / 24) + 'd overdue';
      return (
        '<a href="' + escH(meta.href) + '" class="dash-revision-item">' +
          '<span style="font-size:1rem">' + meta.icon + '</span>' +
          '<div class="dash-revision-info">' +
            '<div class="dash-revision-title" style="color:' + meta.color + '">' + escH(meta.name) + ' — Ch ' + escH(String(e.chapterId)) + ': ' + escH(chTitle) + '</div>' +
            '<div class="dash-revision-meta">' +
              '<span class="mastery-badge ' + escH(e.mastery) + '">' + (e.mastery || 'learning') + '</span> ' +
              '<span class="dash-overdue-tag">⏰ ' + escH(dueStr) + '</span>' +
            '</div>' +
          '</div>' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>' +
        '</a>'
      );
    }).join('');
  }

  /* ── Stats Bar ── */
  function buildStatsHTML(stats, profile) {
    var streak = (profile && profile.studyStreak) || 0;
    var streakEl = streak > 0
      ? '<span class="dash-stat-highlight">' + streak + '</span> day streak'
      : 'No streak yet';
    return (
      '<div class="dash-stats-grid">' +
        _tile('Questions Answered', stats.total) +
        _tile('Correct Answers', stats.correct) +
        _tile('Accuracy', stats.accuracy + '%') +
        _tile('Study Streak', streakEl, true) +
      '</div>'
    );
  }

  function _tile(label, value, raw) {
    var val = raw ? value : escH(String(value));
    return (
      '<div class="dash-stat-tile">' +
        '<div class="dash-stat-val">' + val + '</div>' +
        '<div class="dash-stat-lbl">' + escH(label) + '</div>' +
      '</div>'
    );
  }

  var CACHE_KEY = 'al_dash_cache';

  function saveCache(uid, data) {
    try { localStorage.setItem(CACHE_KEY + '_' + uid, JSON.stringify(data)); } catch(e){}
  }
  function loadCache(uid) {
    try { var v = localStorage.getItem(CACHE_KEY + '_' + uid); return v ? JSON.parse(v) : null; } catch(e){ return null; }
  }

  function buildAndInsert(root, km, stats, profile, planItems) {
    var score = (typeof computeReadinessScore === 'function') ? computeReadinessScore(km) : 0;
    var dueCount = DB.getDueForRevision(km).length;
    root.innerHTML =
        /* Readiness + Subjects row */
        '<div class="dash-top-grid">' +
          '<div class="dash-card dash-ring-card">' + buildReadinessRing(score) + '</div>' +
          '<div class="dash-card">' +
            '<div class="dash-card-title">Subject Breakdown</div>' +
            buildSubjectBars(km) +
          '</div>' +
        '</div>' +

        /* Study plan */
        '<div class="dash-card">' +
          '<div class="dash-card-header">' +
            '<div class="dash-card-title">Today\'s Study Plan</div>' +
            (planItems.length ? '<span class="dash-plan-count">' + planItems.length + ' items</span>' : '') +
          '</div>' +
          '<div class="dash-card-body">' + buildPlanHTML(planItems, km) + '</div>' +
        '</div>' +

        /* Revision queue */
        '<div class="dash-card">' +
          '<div class="dash-card-header">' +
            '<div class="dash-card-title">⏰ Due for Revision</div>' +
            (dueCount > 0 ? '<span class="dash-plan-count dash-plan-count-warn">' + dueCount + ' chapters</span>' : '') +
          '</div>' +
          '<div class="dash-card-body">' + buildRevisionHTML(km) + '</div>' +
        '</div>' +

        /* Stats */
        buildStatsHTML(stats, profile) +

        /* Footer link */
        '';
  }

  /* ── Main Render ── */
  async function render(uid) {
    var root = document.getElementById('dashRoot');
    if (!root) return;

    /* Show cached data instantly while fresh data loads */
    var cached = loadCache(uid);
    if (cached) {
      try { buildAndInsert(root, cached.km, cached.stats, cached.profile, cached.planItems); } catch(e){}
    }

    try {
      var [km, stats, profile] = await Promise.all([
        DB.getKnowledgeMap(uid),
        DB.getOverallStats(uid),
        DB.getProfile(uid)
      ]);
      km      = km      || {};
      stats   = stats   || { total: 0, correct: 0, accuracy: 0 };
      profile = profile || {};

      var planItems = await generateSmartPlan(uid, km);

      saveCache(uid, { km: km, stats: stats, profile: profile, planItems: planItems });
      buildAndInsert(root, km, stats, profile, planItems);

    } catch (e) {
      console.warn('dashboard-page: render', e);
      if (!cached && root) root.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--muted)">Could not load dashboard. Please try again.</div>';
    }
  }

  /* ── Bootstrap ── */
  document.addEventListener('DOMContentLoaded', function() {
    if (!window._fauth) {
      document.getElementById('dashRoot').innerHTML =
        '<div style="text-align:center;padding:3rem;color:var(--muted)">Firebase not configured. Please set up credentials in js/firebase-config.js.</div>';
      return;
    }
    window._fauth.onAuthStateChanged(function(fbUser) {
      if (!fbUser) {
        window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
        return;
      }
      render(fbUser.uid);
    });
  });

})();
