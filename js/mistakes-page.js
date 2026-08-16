/* AbiLearn — Mistake Bank Page v4
 *
 * Requires: firebase-config.js, db.js, auth.js (already loaded in mistakes.html)
 * Exported: window.resolveMistakeItem(key), window.resolveAllMistakes()
 *
 * Loading lifecycle:
 *   1. DOMContentLoaded: show spinner, try cached user immediately
 *   2. loadMistakes(uid): show spinner → fetch → render (success) or error+retry (failure)
 *   3. onAuthStateChanged: redirect if signed out; refresh if different user
 *   4. Timeout: if neither cached user nor Firebase resolves in 10s, show retry UI
 */
(function () {

  var SUBJECT_META = {
    maths:   { name: 'Mathematics',   color: '#EF4444', href: 'maths.html' },
    science: { name: 'Science',        color: '#0EA5E9', href: 'science.html' },
    english: { name: 'English',        color: '#F59E0B', href: 'english.html' },
    social:  { name: 'Social Science', color: '#10B981', href: 'social.html' }
  };

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

  function showSpinner() {
    var c = document.getElementById('mistakesContent');
    if (c) c.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--muted)">Loading your mistakes…</div>';
  }

  function showError(msg) {
    var c = document.getElementById('mistakesContent');
    if (c) c.innerHTML =
      '<div style="text-align:center;padding:3rem">' +
        '<div style="color:var(--muted);margin-bottom:1.25rem">' + escH(msg) + '</div>' +
        '<button class="btn btn-primary" onclick="location.reload()">Retry</button>' +
      '</div>';
  }

  function renderMistakeCard(key, m) {
    var subMeta = SUBJECT_META[m.subjectId] || { name: m.subjectId, color: '#7C3AED' };
    var chTitle = getChapterTitle(m.subjectId, m.chapterId);
    var wrongText   = m.chosenText  || ('Option ' + (m.chosen  !== undefined ? ['A','B','C','D'][m.chosen]  : '?'));
    var correctText = m.correctText || ('Option ' + (m.correct !== undefined ? ['A','B','C','D'][m.correct] : '?'));
    var occText = m.occurrences > 1 ? ' · Got wrong ' + m.occurrences + 'x' : '';

    return '<div class="mistake-card" id="mk-' + escH(key) + '">' +
      '<div class="mistake-card-header">' +
        '<span class="mistake-subject-tag" style="background:' + subMeta.color + '20;color:' + subMeta.color + '">' + escH(subMeta.name) + '</span>' +
        '<span class="mistake-count">Ch ' + escH(String(m.chapterId)) + ': ' + escH(chTitle) + occText + '</span>' +
      '</div>' +
      '<div class="mistake-q">' + escH(m.question || 'Question not available') + '</div>' +
      '<div class="mistake-answers">' +
        '<span class="mistake-wrong">✗ Your answer: ' + escH(wrongText) + '</span>' +
        '<span class="mistake-correct">✓ Correct: ' + escH(correctText) + '</span>' +
      '</div>' +
      '<button class="mistake-resolve-btn" onclick="resolveMistakeItem(\'' + escH(key) + '\',\'' + escH(m.subjectId) + '\')" data-key="' + escH(key) + '">Mark as Resolved</button>' +
    '</div>';
  }

  function renderMistakes(mistakes) {
    var container = document.getElementById('mistakesContent');
    if (!container) return;

    var keys = Object.keys(mistakes);
    if (!keys.length) {
      container.innerHTML =
        '<div class="mistakes-empty">' +
          '<h3 style="font-size:1.2rem;font-weight:800;margin-bottom:0.4rem">No active mistakes</h3>' +
          '<p>Questions you answer incorrectly will appear here so you can review them.</p>' +
          '<a href="science.html" class="btn btn-primary" style="margin-top:1.25rem;display:inline-block">Practice MCQs</a>' +
        '</div>';
      return;
    }

    var grouped = {};
    keys.forEach(function(k) {
      var m = mistakes[k];
      var sid = m.subjectId || 'unknown';
      if (!grouped[sid]) grouped[sid] = [];
      grouped[sid].push({ key: k, data: m });
    });

    var subjectOrder = ['science', 'social', 'maths', 'english'];
    var allSubjects = subjectOrder.concat(Object.keys(grouped).filter(function(s) { return subjectOrder.indexOf(s) === -1; }));

    var totalCount = keys.length;
    var html =
      '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem;margin-bottom:1.5rem">' +
        '<div style="font-size:0.88rem;color:var(--muted)">' + totalCount + ' active mistake' + (totalCount === 1 ? '' : 's') + ' — click “Mark as Resolved” when you understand the concept</div>' +
        '<button class="btn btn-secondary" style="font-size:0.82rem;padding:0.35rem 0.9rem" onclick="resolveAllMistakes()">Resolve All</button>' +
      '</div>';

    allSubjects.forEach(function(sid) {
      var items = grouped[sid];
      if (!items || !items.length) return;
      var subMeta = SUBJECT_META[sid] || { name: sid, color: '#7C3AED' };
      html += '<div class="mistake-subject-section">' +
        '<div class="mistake-subject-heading">' +
          '<span style="color:' + subMeta.color + '">' + escH(subMeta.name) + '</span>' +
          '<span class="mastery-badge not_started" style="margin-left:auto">' + items.length + ' mistake' + (items.length === 1 ? '' : 's') + '</span>' +
        '</div>';
      items.forEach(function(item) {
        html += renderMistakeCard(item.key, item.data);
      });
      html += '</div>';
    });

    container.innerHTML = html;
  }

  function loadMistakes(uid) {
    showSpinner();

    // Timeout: show error + retry if Firestore takes more than 12 seconds
    var fetchTimeout = setTimeout(function() {
      showError('Loading took too long. Check your connection and try again.');
    }, 12000);

    DB.getMistakes(uid).then(function(mistakes) {
      clearTimeout(fetchTimeout);
      renderMistakes(mistakes);
    }).catch(function(e) {
      clearTimeout(fetchTimeout);
      console.warn('[AbiLearn] mistakes-page loadMistakes:', e);
      showError('Could not load your mistakes. Check your connection and try again.');
    });
  }

  // Global resolve function — called from onclick attributes in card HTML
  window.resolveMistakeItem = function(key, subjectId) {
    var user = (typeof getUser === 'function') ? getUser() : null;
    if (!user) return;
    if (typeof DB === 'undefined') return;

    var card = document.getElementById('mk-' + key);
    if (card) {
      card.style.opacity = '0.4';
      card.style.pointerEvents = 'none';
    }

    DB.resolveMistake(key, user.uid).then(function() {
      if (card) {
        card.style.transition = 'opacity 0.3s,max-height 0.4s';
        card.style.opacity = '0';
        card.style.maxHeight = card.offsetHeight + 'px';
        setTimeout(function() {
          card.style.maxHeight = '0';
          card.style.marginBottom = '0';
          card.style.padding = '0';
          card.style.overflow = 'hidden';
        }, 300);
        setTimeout(function() { if (card.parentNode) card.parentNode.removeChild(card); }, 700);
      }
      if (typeof showAuthToast === 'function') showAuthToast('Mistake resolved.');
    }).catch(function() {
      if (card) { card.style.opacity = ''; card.style.pointerEvents = ''; }
      if (typeof showAuthToast === 'function') showAuthToast('Could not resolve. Try again.');
    });
  };

  window.resolveAllMistakes = function() {
    var user = (typeof getUser === 'function') ? getUser() : null;
    if (!user || typeof DB === 'undefined') return;
    if (!confirm('Mark all mistakes as resolved? This cannot be undone.')) return;

    var cards = document.querySelectorAll('.mistake-card[id^="mk-"]');
    var promises = [];
    cards.forEach(function(card) {
      var key = card.id.replace('mk-', '');
      if (key) promises.push(DB.resolveMistake(key, user.uid));
    });

    Promise.all(promises).then(function() {
      loadMistakes(user.uid);
      if (typeof showAuthToast === 'function') showAuthToast('All mistakes resolved!');
    }).catch(function() {
      if (typeof showAuthToast === 'function') showAuthToast('Some mistakes could not be resolved.');
    });
  };

  // ── Bootstrap ────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    if (!window._fauth) {
      var c = document.getElementById('mistakesContent');
      if (c) c.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--muted)">Firebase not configured. Please set up credentials in js/firebase-config.js.</div>';
      return;
    }

    var authResolved = false;

    // Auth timeout: if Firebase hasn't resolved in 10 seconds, show error + retry
    var authTimeout = setTimeout(function() {
      if (!authResolved) {
        showError('Session check timed out. Please refresh the page.');
      }
    }, 10000);

    // Try cached user immediately — avoids waiting for Firebase round-trip
    var initialUser = (typeof getUser === 'function') ? getUser() : null;
    if (initialUser) {
      authResolved = true;
      clearTimeout(authTimeout);
      loadMistakes(initialUser.uid);
    }

    // onAuthStateChanged: authoritative check (fires ~500ms–2s after page load)
    window._fauth.onAuthStateChanged(function(fbUser) {
      clearTimeout(authTimeout);
      authResolved = true;

      if (!fbUser) {
        // Not signed in — redirect to login
        window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
        return;
      }

      // If initial cached user was wrong UID (stale cache), reload with real data
      if (!initialUser || fbUser.uid !== initialUser.uid) {
        loadMistakes(fbUser.uid);
      }
    });
  });

})();
