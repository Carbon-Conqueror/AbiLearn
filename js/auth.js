/* AbiLearn — Authentication System v5 (Firebase Auth)
 *
 * Public API (same surface as before so existing code still works):
 *   getUser()            → cached user object | null
 *   guardNav(event, url) → gates navigation behind login
 *   authLogout()         → signs out
 *   showAuthToast(msg)   → toast notification
 *   openDashboard()      → slide-in dashboard panel
 *   openSettings()       → slide-in settings panel
 *   closePanel(id)       → closes any panel
 */

/* ══ CACHED SESSION STATE ══
 * onAuthStateChanged fires asynchronously; we keep a synchronous cache so
 * existing code calling getUser() never blocks.
 */
var _cachedUser = null;

function getUser() { return _cachedUser; }

/* ══ FIREBASE AUTH STATE LISTENER ══ */
document.addEventListener('DOMContentLoaded', function () {
  if (!window._fauth) return; // Firebase not configured yet

  window._fauth.onAuthStateChanged(async function (fbUser) {
    if (fbUser) {
      var profile = await DB.getProfile(fbUser.uid);
      _cachedUser = {
        uid:      fbUser.uid,
        name:     (profile && profile.name)     || fbUser.displayName || 'Student',
        email:    fbUser.email,
        grade:    (profile && profile.grade)    || 'Class 10',
        avatar:   (profile && profile.avatar)   || fbUser.photoURL || null,
        joinDate: (profile && profile.joinDate) || fbUser.metadata.creationTime || null
      };
      updateNavbarForUser(_cachedUser);
      // One-time migration of legacy localStorage PDF progress
      DB.migrateLegacyProgress(fbUser.email, fbUser.uid);
      // Load user data into app caches (PDF progress + knowledge map)
      if (typeof loadUserDataFromFirestore === 'function') {
        loadUserDataFromFirestore(fbUser.uid);
      }
    } else {
      _cachedUser = null;
      restoreNavbarButtons();
    }
  });
});

/* ══ LOGOUT ══ */
function authLogout() {
  if (!window._fauth) return;
  window._fauth.signOut().then(function () {
    _cachedUser = null;
    restoreNavbarButtons();
    showAuthToast('Logged out. See you soon!');
  }).catch(function () {
    showAuthToast('Error signing out. Please try again.');
  });
}

/* ══ NAVBAR — logged-in state ══ */
function updateNavbarForUser(user) {
  var navRight = document.querySelector('.nav-right');
  if (!navRight) return;
  document.querySelectorAll('.btn-login,.btn-signup').forEach(function (b) {
    b.style.display = 'none';
  });
  var old = document.getElementById('navUserWidget');
  if (old) old.remove();

  var initials  = user.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  var firstName = user.name.split(' ')[0];

  var widget = document.createElement('div');
  widget.id        = 'navUserWidget';
  widget.className = 'nav-user-widget';
  widget.innerHTML =
    '<button class="nav-user-btn" id="navAvatar" onclick="toggleUserDropdown()" aria-label="Account menu">' +
      '<div class="nav-avatar">' +
        (user.avatar
          ? '<img src="' + escSafe(user.avatar) + '" alt="' + escSafe(user.name) + '" onerror="this.style.display=\'none\';this.nextSibling.style.display=\'flex\'"><span class="nav-avatar-initials" style="display:none">' + initials + '</span>'
          : '<span class="nav-avatar-initials">' + initials + '</span>') +
      '</div>' +
      '<span class="nav-user-name">' + escSafe(firstName) + '</span>' +
      '<svg class="nav-user-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>' +
    '</button>' +
    '<div class="user-dropdown" id="userDropdown">' +
      '<div class="user-dropdown-header">' +
        '<div class="ud-avatar">' + initials + '</div>' +
        '<div class="ud-details">' +
          '<div class="ud-name">' + escSafe(user.name) + '</div>' +
          '<div class="ud-email">' + escSafe(user.email) + '</div>' +
          '<div class="ud-grade-badge">' + escSafe(user.grade) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="user-dropdown-links">' +
        '<a href="#" onclick="openDashboard();return false">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' +
          'Dashboard' +
        '</a>' +
        '<a href="#" onclick="openSettings();return false">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' +
          'Settings' +
        '</a>' +
        '<a href="mistakes.html">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>' +
          'Mistake Bank' +
        '</a>' +
        '<a href="dashboard.html">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' +
          'Exam Dashboard' +
        '</a>' +
        '<div class="ud-divider"></div>' +
        '<a href="#" onclick="authLogout();return false" class="ud-logout">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
          'Log Out' +
        '</a>' +
      '</div>' +
    '</div>';

  var hamburger = navRight.querySelector('.hamburger');
  if (hamburger) navRight.insertBefore(widget, hamburger);
  else navRight.appendChild(widget);
}

function toggleUserDropdown() {
  var dd = document.getElementById('userDropdown');
  if (!dd) return;
  var isOpen = dd.classList.toggle('open');
  if (isOpen) {
    setTimeout(function () {
      document.addEventListener('click', function handler(e) {
        if (!e.target.closest('#navUserWidget')) {
          dd.classList.remove('open');
          document.removeEventListener('click', handler);
        }
      });
    }, 10);
  }
}

function restoreNavbarButtons() {
  document.querySelectorAll('.btn-login,.btn-signup').forEach(function (b) {
    b.style.display = '';
  });
  var widget = document.getElementById('navUserWidget');
  if (widget) widget.remove();
}

/* ══ SAFE HTML ESCAPE (for inline usage) ══ */
function escSafe(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ══ TOAST ══ */
function showAuthToast(msg) {
  var existing = document.getElementById('authToast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.id        = 'authToast';
  toast.className = 'auth-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(function () { toast.classList.add('show'); });
  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 400);
  }, 3500);
}

/* ══ FULLSCREEN ══ */
function _isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches ||
         (typeof window.navigator.standalone === 'boolean' && window.navigator.standalone);
}

var _wasFullscreen = false;
var _userExitedFs  = false;
document.addEventListener('fullscreenchange', function () {
  if (document.fullscreenElement) {
    _wasFullscreen = true;
  } else if (_wasFullscreen) {
    _userExitedFs = true;
  }
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(function () {});
  } else {
    document.exitFullscreen().catch(function () {});
  }
}

/* ══ NAV GUARDS ══ */
function guardNav(event, url) {
  if (getUser()) return true;
  event.preventDefault();
  window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
  return false;
}

function initHomePageGate() {
  if (!document.getElementById('subjectsGrid')) return;
  document.addEventListener('click', function (e) {
    if (getUser()) return;
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('javascript')) return;
    if (href.includes('auth.html')) return;
    var isInternal = !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//');
    if (!isInternal) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
  }, true);
}

/* ══ AUTH INIT ══ */
function initAuth() {
  if (!_isPWA()) {
    if (!_userExitedFs) {
      document.documentElement.requestFullscreen().catch(function () {});
    }
    function _autoFs() {
      if (!document.fullscreenElement && !_userExitedFs) {
        document.documentElement.requestFullscreen().catch(function () {});
      }
      document.removeEventListener('click',      _autoFs);
      document.removeEventListener('keydown',    _autoFs);
      document.removeEventListener('touchstart', _autoFs);
    }
    document.addEventListener('click',      _autoFs);
    document.addEventListener('keydown',    _autoFs);
    document.addEventListener('touchstart', _autoFs, { passive: true });
  }

  document.querySelectorAll('.btn-login').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
    });
  });
  document.querySelectorAll('.btn-signup').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.location.href = 'auth.html?tab=signup&from=' + encodeURIComponent(location.href);
    });
  });

  initHomePageGate();
}
document.addEventListener('DOMContentLoaded', initAuth);

/* ══ DASHBOARD ══ */
function openDashboard() {
  var user = getUser();
  if (!user) return;

  var panel = document.getElementById('dashPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id        = 'dashPanel';
    panel.className = 'panel-overlay';
    document.body.appendChild(panel);
  }

  var initials = user.name.split(' ').map(function (w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  var joinDate  = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  panel.innerHTML =
    '<div class="panel-box">' +
      '<div class="panel-top">' +
        '<span class="panel-title">Dashboard</span>' +
        '<button class="panel-close" onclick="closePanel(\'dashPanel\')">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="panel-body">' +
        '<div class="dash-user-row">' +
          '<div class="dash-avatar">' + initials + '</div>' +
          '<div class="dash-user-info">' +
            '<div class="dash-name">' + escSafe(user.name) + '</div>' +
            '<div class="dash-grade">' + escSafe(user.grade) + (joinDate ? ' · Joined ' + joinDate : '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="panel-section" id="dashProgressSection">' +
          '<div class="panel-section-title">Study Progress</div>' +
          '<div id="dashProgressRows"><div style="color:var(--muted);font-size:0.85rem;padding:0.5rem 0">Loading progress…</div></div>' +
        '</div>' +
        '<div class="panel-section" id="dashStatsSection">' +
          '<div class="panel-section-title">Overall Stats</div>' +
          '<div id="dashStatsRows"><div style="color:var(--muted);font-size:0.85rem;padding:0.5rem 0">Loading stats…</div></div>' +
        '</div>' +
        '<div class="panel-section">' +
          '<div class="panel-section-title">Quick Actions</div>' +
          '<a href="dashboard.html" class="dash-action-link" style="margin-bottom:0.5rem">' +
            '<span style="font-size:1.1rem">📊</span>' +
            '<span>Exam Dashboard — readiness &amp; study plan</span>' +
          '</a>' +
          '<a href="mistakes.html" class="dash-action-link">' +
            '<span style="font-size:1.1rem">📋</span>' +
            '<span>Mistake Bank — review wrong answers</span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  panel.addEventListener('click', function (e) {
    if (e.target === panel) closePanel('dashPanel');
  });
  requestAnimationFrame(function () {
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  var dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');

  // Load real data from Firestore
  _loadDashboardData(user.uid);
}

async function _loadDashboardData(uid) {
  try {
    var knowledgeMap = await DB.getKnowledgeMap(uid);
    var stats        = await DB.getOverallStats(uid);

    var subjects = [
      { id: 'maths',   name: 'Mathematics',   chapters: 14 },
      { id: 'science', name: 'Science',        chapters: 13 },
      { id: 'english', name: 'English',        chapters: 11 },
      { id: 'social',  name: 'Social Science', chapters: 22 }
    ];

    var MASTERY_LABEL = {
      not_started: 'Not started',
      learning:    'Learning',
      developing:  'Developing',
      proficient:  'Proficient',
      mastered:    'Mastered'
    };

    var rows = subjects.map(function (s) {
      var pct = DB.computeSubjectPct(s.id, knowledgeMap);
      var chapterEntries = Object.values(knowledgeMap).filter(function (e) { return e.subjectId === s.id; });
      var masteredCount  = chapterEntries.filter(function (e) { return e.mastery === 'mastered' || e.mastery === 'proficient'; }).length;
      return '<div class="dash-progress-row">' +
        '<span class="dash-subject-name">' + escSafe(s.name) + '</span>' +
        '<div class="dash-bar-wrap"><div class="dash-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<span class="dash-count">' + masteredCount + '/' + s.chapters + '</span>' +
      '</div>';
    }).join('');

    var dueCount = DB.getDueForRevision(knowledgeMap).length;
    var dueNote  = dueCount > 0
      ? '<div style="color:#F59E0B;font-size:0.82rem;margin-top:0.4rem">⏰ ' + dueCount + ' chapter' + (dueCount === 1 ? '' : 's') + ' due for revision</div>'
      : '';

    var progressEl = document.getElementById('dashProgressRows');
    if (progressEl) progressEl.innerHTML = rows + dueNote;

    var statsHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:0.25rem">' +
        _statTile('Questions Attempted', stats.total) +
        _statTile('Correct Answers', stats.correct) +
        _statTile('Overall Accuracy', stats.accuracy + '%') +
        _statTile('Due for Revision', dueCount) +
      '</div>';

    var statsEl = document.getElementById('dashStatsRows');
    if (statsEl) statsEl.innerHTML = statsHTML;

  } catch (e) {
    var progressEl2 = document.getElementById('dashProgressRows');
    if (progressEl2) progressEl2.innerHTML = '<div style="color:var(--muted);font-size:0.85rem">Could not load progress data.</div>';
  }
}

function _statTile(label, value) {
  return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:0.75rem;text-align:center">' +
    '<div style="font-size:1.35rem;font-weight:800;color:var(--text)">' + escSafe(String(value)) + '</div>' +
    '<div style="font-size:0.75rem;color:var(--muted);margin-top:0.15rem">' + escSafe(label) + '</div>' +
  '</div>';
}

/* ══ SETTINGS ══ */
function openSettings() {
  var user = getUser();
  if (!user) return;

  var panel = document.getElementById('settingsPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id        = 'settingsPanel';
    panel.className = 'panel-overlay';
    document.body.appendChild(panel);
  }

  var fbUser = window._fauth && window._fauth.currentUser;
  var verified = fbUser ? fbUser.emailVerified : true;
  var verifiedBadge = verified
    ? '<span style="color:#10B981;font-size:0.8rem">✓ Verified</span>'
    : '<span style="color:#F59E0B;font-size:0.8rem">⚠ Not verified &nbsp;<button class="settings-btn" onclick="sendVerificationEmail()" style="font-size:0.75rem;padding:0.2rem 0.6rem">Verify</button></span>';

  panel.innerHTML =
    '<div class="panel-box">' +
      '<div class="panel-top">' +
        '<span class="panel-title">Settings</span>' +
        '<button class="panel-close" onclick="closePanel(\'settingsPanel\')">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="panel-body">' +
        '<div class="panel-section">' +
          '<div class="panel-section-title">Profile</div>' +
          '<div class="settings-row"><span class="settings-row-label">Name</span><span class="settings-row-value">' + escSafe(user.name) + '</span></div>' +
          '<div class="settings-row"><span class="settings-row-label">Email</span><span class="settings-row-value">' + escSafe(user.email) + '</span></div>' +
          '<div class="settings-row"><span class="settings-row-label">Class</span><span class="settings-row-value">' + escSafe(user.grade) + '</span></div>' +
          '<div class="settings-row"><span class="settings-row-label">Email status</span><span class="settings-row-value">' + verifiedBadge + '</span></div>' +
        '</div>' +
        '<div class="panel-section">' +
          '<div class="panel-section-title">Account</div>' +
          '<div class="settings-row">' +
            '<span class="settings-row-label">Change Password</span>' +
            '<button class="settings-btn" onclick="sendPasswordResetFromSettings()">Send email</button>' +
          '</div>' +
          '<div class="settings-row">' +
            '<span class="settings-row-label">Log Out</span>' +
            '<button class="settings-btn" onclick="closePanel(\'settingsPanel\');authLogout()">Log Out</button>' +
          '</div>' +
        '</div>' +
        '<div class="panel-section">' +
          '<div class="panel-section-title">About</div>' +
          '<div class="settings-row"><span class="settings-row-label">Version</span><span class="settings-row-value">AbiLearn V2</span></div>' +
          '<div class="settings-row"><span class="settings-row-label">Platform</span><span class="settings-row-value">CBSE Class 10</span></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  panel.addEventListener('click', function (e) {
    if (e.target === panel) closePanel('settingsPanel');
  });
  requestAnimationFrame(function () {
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  var dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

function sendVerificationEmail() {
  var fbUser = window._fauth && window._fauth.currentUser;
  if (!fbUser) return;
  fbUser.sendEmailVerification().then(function () {
    showAuthToast('Verification email sent! Check your inbox.');
  }).catch(function () {
    showAuthToast('Could not send email. Try again shortly.');
  });
}

function sendPasswordResetFromSettings() {
  var user = getUser();
  if (!user) return;
  window._fauth.sendPasswordResetEmail(user.email).then(function () {
    showAuthToast('Password reset email sent to ' + user.email);
  }).catch(function () {
    showAuthToast('Could not send reset email. Try again shortly.');
  });
}

function closePanel(id) {
  var p = document.getElementById(id);
  if (p) { p.classList.remove('open'); document.body.style.overflow = ''; }
}
