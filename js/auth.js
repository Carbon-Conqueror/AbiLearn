/* AbiLearn — Authentication System v3 (session manager + navbar + homepage gate) */

/* ══ SESSION STATE ══ */
function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem('abilearn_user') ||
      sessionStorage.getItem('abilearn_user') ||
      'null'
    );
  } catch { return null; }
}

function saveUser(u, remember) {
  const s = JSON.stringify(u);
  try {
    if (remember) {
      localStorage.setItem('abilearn_user', s);
      sessionStorage.removeItem('abilearn_user');
    } else {
      sessionStorage.setItem('abilearn_user', s);
      localStorage.removeItem('abilearn_user');
    }
  } catch {}
}

function clearUser() {
  try {
    localStorage.removeItem('abilearn_user');
    sessionStorage.removeItem('abilearn_user');
  } catch {}
}

/* ══ LOGOUT ══ */
function authLogout() {
  clearUser();
  restoreNavbarButtons();
  showAuthToast('Logged out. See you soon!');
}

/* ══ NAVBAR UPDATE ══ */
function updateNavbarForUser(user) {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;
  document.querySelectorAll('.btn-login,.btn-signup').forEach(b => b.style.display = 'none');
  const old = document.getElementById('navUserWidget');
  if (old) old.remove();

  const initials  = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const firstName = user.name.split(' ')[0];
  const widget    = document.createElement('div');
  widget.id        = 'navUserWidget';
  widget.className = 'nav-user-widget';
  widget.innerHTML = `
    <button class="nav-user-btn" id="navAvatar" onclick="toggleUserDropdown()" aria-label="Account menu">
      <div class="nav-avatar">
        ${user.avatar
          ? `<img src="${user.avatar}" alt="${user.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'"><span class="nav-avatar-initials" style="display:none">${initials}</span>`
          : `<span class="nav-avatar-initials">${initials}</span>`}
      </div>
      <span class="nav-user-name">${firstName}</span>
      <svg class="nav-user-chevron" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
    </button>
    <div class="user-dropdown" id="userDropdown">
      <div class="user-dropdown-header">
        <div class="ud-avatar">${initials}</div>
        <div class="ud-details">
          <div class="ud-name">${user.name}</div>
          <div class="ud-email">${user.email}</div>
          <div class="ud-grade-badge">${user.grade}</div>
        </div>
      </div>
      <div class="user-dropdown-links">
        <a href="#" onclick="openDashboard();return false">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a href="#" onclick="openSettings();return false">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Settings
        </a>
        <div class="ud-divider"></div>
        <a href="#" onclick="authLogout();return false" class="ud-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </a>
      </div>
    </div>`;

  const hamburger = navRight.querySelector('.hamburger');
  if (hamburger) navRight.insertBefore(widget, hamburger);
  else navRight.appendChild(widget);

  document.addEventListener('click', function handler(e) {
    if (!e.target.closest('#navUserWidget')) {
      const dd = document.getElementById('userDropdown');
      if (dd) dd.classList.remove('open');
      document.removeEventListener('click', handler);
    }
  });
}

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (!dd) return;
  const isOpen = dd.classList.toggle('open');
  if (isOpen) {
    setTimeout(() => {
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
  document.querySelectorAll('.btn-login,.btn-signup').forEach(b => b.style.display = '');
  const widget = document.getElementById('navUserWidget');
  if (widget) widget.remove();
}

/* ══ TOAST ══ */
function showAuthToast(msg) {
  const existing = document.getElementById('authToast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id        = 'authToast';
  toast.className = 'auth-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ══ FULLSCREEN ══ */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => updateFsIcon(true)).catch(() => {});
  } else {
    document.exitFullscreen().then(() => updateFsIcon(false)).catch(() => {});
  }
}

function updateFsIcon(isFs) {
  const btn = document.getElementById('fsBtn');
  if (!btn) return;
  btn.title   = isFs ? 'Exit full screen' : 'Enter full screen';
  btn.innerHTML = isFs
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
}
document.addEventListener('fullscreenchange', () => updateFsIcon(!!document.fullscreenElement));

/* guardNav — gates navigation behind authentication */
function guardNav(event, url) {
  if (getUser()) return true;
  event.preventDefault();
  window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
  return false;
}

/* ══ HOMEPAGE GATE — intercept ALL clicks on the homepage ══ */
function initHomePageGate() {
  // Only active on the homepage (identified by the subjects grid)
  if (!document.getElementById('subjectsGrid')) return;

  document.addEventListener('click', function(e) {
    if (getUser()) return; // logged in — let everything through

    const anchor = e.target.closest('a[href]');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Skip same-page anchors (#...) and javascript: links
    if (href.startsWith('#') || href.startsWith('javascript')) return;

    // Skip auth.html itself
    if (href.includes('auth.html')) return;

    // Only gate internal .html links (relative paths, no protocol)
    const isInternal = !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('//');
    if (!isInternal) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
  }, true); // capture phase so we intercept before onclick handlers
}

/* ══ INIT ══ */
function initAuth() {
  // Best-effort fullscreen on page load (silent; browsers may block without gesture)
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }

  // Redirect login/signup buttons to auth.html
  document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', () => {
      const from = encodeURIComponent(location.href);
      window.location.href = `auth.html?from=${from}`;
    });
  });
  document.querySelectorAll('.btn-signup').forEach(btn => {
    btn.addEventListener('click', () => {
      const from = encodeURIComponent(location.href);
      window.location.href = `auth.html?tab=signup&from=${from}`;
    });
  });

  // Restore session
  const user = getUser();
  if (user) updateNavbarForUser(user);

  // Go fullscreen automatically on first user interaction (reliable fallback)
  function _autoFs() {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen().catch(()=>{});
    document.removeEventListener('click',     _autoFs);
    document.removeEventListener('keydown',   _autoFs);
    document.removeEventListener('touchstart',_autoFs);
  }
  document.addEventListener('click',     _autoFs);
  document.addEventListener('keydown',   _autoFs);
  document.addEventListener('touchstart',_autoFs, {passive:true});

  // Homepage gate — must run after DOM is ready so subjectsGrid exists
  initHomePageGate();
}
document.addEventListener('DOMContentLoaded', initAuth);

/* ══ DASHBOARD ══ */
function openDashboard() {
  const user = getUser();
  if (!user) return;
  const progress = (() => {
    try { return JSON.parse(localStorage.getItem('abilearn_progress_' + user.email) || '{}'); } catch { return {}; }
  })();
  const subjects = [
    { id: 'maths',   name: 'Mathematics',   total: 15 },
    { id: 'science', name: 'Science',        total: 15 },
    { id: 'english', name: 'English',        total: 10 },
    { id: 'social',  name: 'Social Science', total: 12 }
  ];
  const initials  = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const joinDate  = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const rows = subjects.map(s => {
    const done = Object.keys(progress).filter(k => k.startsWith(s.id + '_') && progress[k]).length;
    const pct  = Math.round((done / s.total) * 100);
    return `<div class="dash-progress-row">
      <span class="dash-subject-name">${s.name}</span>
      <div class="dash-bar-wrap"><div class="dash-bar-fill" style="width:${pct}%"></div></div>
      <span class="dash-count">${done}/${s.total}</span>
    </div>`;
  }).join('');

  let panel = document.getElementById('dashPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id        = 'dashPanel';
    panel.className = 'panel-overlay';
    document.body.appendChild(panel);
  }
  panel.innerHTML = `
    <div class="panel-box">
      <div class="panel-top">
        <span class="panel-title">Dashboard</span>
        <button class="panel-close" onclick="closePanel('dashPanel')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="panel-body">
        <div class="dash-user-row">
          <div class="dash-avatar">${initials}</div>
          <div class="dash-user-info">
            <div class="dash-name">${user.name}</div>
            <div class="dash-grade">${user.grade}${joinDate ? ' · Joined ' + joinDate : ''}</div>
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-section-title">Study Progress</div>
          ${rows}
        </div>
      </div>
    </div>`;
  panel.addEventListener('click', e => { if (e.target === panel) closePanel('dashPanel'); });
  requestAnimationFrame(() => { panel.classList.add('open'); document.body.style.overflow = 'hidden'; });
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

/* ══ SETTINGS ══ */
function openSettings() {
  const user = getUser();
  if (!user) return;
  let panel = document.getElementById('settingsPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id        = 'settingsPanel';
    panel.className = 'panel-overlay';
    document.body.appendChild(panel);
  }
  panel.innerHTML = `
    <div class="panel-box">
      <div class="panel-top">
        <span class="panel-title">Settings</span>
        <button class="panel-close" onclick="closePanel('settingsPanel')">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="panel-body">
        <div class="panel-section">
          <div class="panel-section-title">Profile</div>
          <div class="settings-row"><span class="settings-row-label">Name</span><span class="settings-row-value">${user.name}</span></div>
          <div class="settings-row"><span class="settings-row-label">Email</span><span class="settings-row-value">${user.email}</span></div>
          <div class="settings-row"><span class="settings-row-label">Class</span><span class="settings-row-value">${user.grade}</span></div>
        </div>
        <div class="panel-section">
          <div class="panel-section-title">Data</div>
          <div class="settings-row">
            <span class="settings-row-label">Clear Study Progress</span>
            <button class="settings-btn danger" onclick="clearProgress()">Clear</button>
          </div>
          <div class="settings-row">
            <span class="settings-row-label">Log Out</span>
            <button class="settings-btn" onclick="closePanel('settingsPanel');authLogout()">Log Out</button>
          </div>
        </div>
        <div class="panel-section">
          <div class="panel-section-title">About</div>
          <div class="settings-row"><span class="settings-row-label">Version</span><span class="settings-row-value">AbiLearn v1.0</span></div>
          <div class="settings-row"><span class="settings-row-label">Platform</span><span class="settings-row-value">CBSE Class 10</span></div>
        </div>
      </div>
    </div>`;
  panel.addEventListener('click', e => { if (e.target === panel) closePanel('settingsPanel'); });
  requestAnimationFrame(() => { panel.classList.add('open'); document.body.style.overflow = 'hidden'; });
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

function closePanel(id) {
  const p = document.getElementById(id);
  if (p) { p.classList.remove('open'); document.body.style.overflow = ''; }
}

function clearProgress() {
  if (confirm('Clear all study progress? This cannot be undone.')) {
    const u = getUser();
    if (u) {
      localStorage.removeItem('abilearn_progress_' + u.email);
      localStorage.removeItem('pdf_done_' + u.email);
    }
    closePanel('settingsPanel');
    showAuthToast('Study progress cleared.');
  }
}
