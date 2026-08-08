/* AbiLearn — Authentication System v2 */

/* ══ AUTH STATE ══ */
function getUser() {
  try {
    return JSON.parse(localStorage.getItem('abilearn_user') || sessionStorage.getItem('abilearn_user') || 'null');
  } catch { return null; }
}
function saveUser(u, remember) {
  const s = JSON.stringify(u);
  try {
    if (remember) { localStorage.setItem('abilearn_user', s); sessionStorage.removeItem('abilearn_user'); }
    else { sessionStorage.setItem('abilearn_user', s); localStorage.removeItem('abilearn_user'); }
  } catch {}
}
function clearUser() {
  try { localStorage.removeItem('abilearn_user'); sessionStorage.removeItem('abilearn_user'); } catch {}
}

/* ══ REGISTERED USERS DB ══ */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('abilearn_users') || '{}'); } catch { return {}; }
}
function saveUsers(db) {
  try { localStorage.setItem('abilearn_users', JSON.stringify(db)); } catch {}
}

/* ══ SVG ICONS ══ */
const EYE_OPEN = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_SHUT = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

/* ══ MODAL HTML ══ */
function createAuthModal() {
  if (document.getElementById('authModal')) return;
  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal" id="authModalBox">
      <button class="auth-close" id="authClose" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="auth-brand">
        <img src="assets/logo.jpeg" alt="AbiLearn" class="auth-logo">
        <span class="auth-brand-text">Abi<span>Learn</span></span>
      </div>
      <div class="auth-tabs">
        <button class="auth-tab active" id="tabLogin" onclick="authSwitchTab('login')">Log In</button>
        <button class="auth-tab" id="tabSignup" onclick="authSwitchTab('signup')">Sign Up</button>
      </div>

      <!-- LOGIN FORM -->
      <form class="auth-form" id="loginForm" onsubmit="authLogin(event)">
        <div class="auth-field">
          <label for="loginEmail">Email address</label>
          <input type="email" id="loginEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="loginPassword">Password</label>
          <div class="auth-pw-wrap">
            <input type="password" id="loginPassword" placeholder="Enter your password" required autocomplete="current-password">
            <button type="button" class="auth-pw-toggle" onclick="authTogglePw('loginPassword',this)" aria-label="Show password">${EYE_OPEN}</button>
          </div>
        </div>
        <div class="auth-remember-row">
          <label class="auth-remember">
            <input type="checkbox" id="loginRemember" checked>
            <span>Remember me</span>
          </label>
          <button type="button" class="auth-forgot" onclick="authForgotPassword()">Forgot password?</button>
        </div>
        <div class="auth-error" id="loginError"></div>
        <button type="submit" class="auth-submit-btn" id="loginBtn">Log In</button>
        <p class="auth-switch-link">Don't have an account? <button type="button" onclick="authSwitchTab('signup')">Sign Up Free</button></p>
      </form>

      <!-- SIGNUP FORM -->
      <form class="auth-form hidden" id="signupForm" onsubmit="authSignup(event)">
        <div class="auth-field">
          <label for="signupName">Full Name</label>
          <input type="text" id="signupName" placeholder="Your full name" required autocomplete="name">
        </div>
        <div class="auth-field">
          <label for="signupEmail">Email address</label>
          <input type="email" id="signupEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="signupPassword">Password</label>
          <div class="auth-pw-wrap">
            <input type="password" id="signupPassword" placeholder="At least 6 characters" required minlength="6" autocomplete="new-password" oninput="updatePwStrength(this.value)">
            <button type="button" class="auth-pw-toggle" onclick="authTogglePw('signupPassword',this)" aria-label="Show password">${EYE_OPEN}</button>
          </div>
          <div class="auth-pw-strength">
            <div class="auth-pw-bar" id="pwBar"></div>
          </div>
          <span class="auth-pw-label" id="pwLabel"></span>
        </div>
        <div class="auth-field">
          <label for="signupClass">Class / Grade</label>
          <select id="signupClass">
            <option value="Class 10">Class 10 (CBSE)</option>
            <option value="Class 9">Class 9 (CBSE)</option>
            <option value="Class 11">Class 11 (CBSE)</option>
            <option value="Class 12">Class 12 (CBSE)</option>
          </select>
        </div>
        <div class="auth-error" id="signupError"></div>
        <button type="submit" class="auth-submit-btn" id="signupBtn">Create Account</button>
        <p class="auth-switch-link">Already have an account? <button type="button" onclick="authSwitchTab('login')">Log In</button></p>
      </form>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) closeAuthModal(); });
  document.getElementById('authClose').addEventListener('click', closeAuthModal);
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeAuthModal(); document.removeEventListener('keydown', esc); }
  });
}

/* ══ PASSWORD STRENGTH ══ */
function updatePwStrength(val) {
  const bar   = document.getElementById('pwBar');
  const label = document.getElementById('pwLabel');
  if (!bar || !label) return;
  const len   = val.length;
  const hasUp = /[A-Z]/.test(val);
  const hasNum= /[0-9]/.test(val);
  const hasSym= /[^A-Za-z0-9]/.test(val);
  const score = (len >= 6 ? 1 : 0) + (len >= 10 ? 1 : 0) + (hasUp ? 1 : 0) + (hasNum ? 1 : 0) + (hasSym ? 1 : 0);
  const levels = [
    { w: '0%',   color: 'transparent', text: '' },
    { w: '25%',  color: '#EF4444',     text: 'Weak' },
    { w: '50%',  color: '#F59E0B',     text: 'Fair' },
    { w: '75%',  color: '#0EA5E9',     text: 'Good' },
    { w: '100%', color: '#10B981',     text: 'Strong' },
  ];
  const lv = levels[Math.min(score, 4)];
  bar.style.width = len ? lv.w : '0%';
  bar.style.background = lv.color;
  label.textContent = len ? lv.text : '';
  label.style.color = lv.color;
}

/* ══ OPEN / CLOSE ══ */
function openAuthModal(tab) {
  createAuthModal();
  authSwitchTab(tab || 'login');
  requestAnimationFrame(() => {
    const m = document.getElementById('authModal');
    if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
  });
}
function closeAuthModal() {
  const m = document.getElementById('authModal');
  if (m) { m.classList.remove('open'); setTimeout(() => m.remove(), 300); }
  document.body.style.overflow = '';
}
function authSwitchTab(tab) {
  const lf = document.getElementById('loginForm');
  const sf = document.getElementById('signupForm');
  const tl = document.getElementById('tabLogin');
  const ts = document.getElementById('tabSignup');
  if (!lf) return;
  clearAuthErrors();
  if (tab === 'login') {
    lf.classList.remove('hidden'); sf.classList.add('hidden');
    tl.classList.add('active'); ts.classList.remove('active');
    document.getElementById('loginEmail')?.focus();
  } else {
    lf.classList.add('hidden'); sf.classList.remove('hidden');
    tl.classList.remove('active'); ts.classList.add('active');
    document.getElementById('signupName')?.focus();
  }
}
function clearAuthErrors() {
  ['loginError','signupError'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ''; });
}
function authTogglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.innerHTML = show ? EYE_SHUT : EYE_OPEN;
}

/* ══ FORGOT PASSWORD ══ */
function authForgotPassword() {
  const errEl = document.getElementById('loginError');
  if (errEl) {
    errEl.style.color = '#0EA5E9';
    errEl.textContent = 'To reset your password, create a new account with the same email.';
    setTimeout(() => { if (errEl) { errEl.style.color = ''; errEl.textContent = ''; } }, 4000);
  }
}

/* ══ LOGIN ══ */
function authLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('loginRemember')?.checked !== false;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = 'Logging in...';
  setTimeout(() => {
    const users = getUsers();
    const user  = users[email];
    if (!user) {
      errEl.textContent = 'No account found with this email.';
      btn.disabled = false; btn.textContent = 'Log In'; return;
    }
    if (user.password !== btoa(password)) {
      errEl.textContent = 'Incorrect password. Please try again.';
      btn.disabled = false; btn.textContent = 'Log In'; return;
    }
    const sessionUser = { name: user.name, email: user.email, grade: user.grade, avatar: user.avatar || null, joinDate: user.joinDate };
    saveUser(sessionUser, remember);
    closeAuthModal();
    updateNavbarForUser(sessionUser);
    showAuthToast(`Welcome back, ${user.name.split(' ')[0]}!`);
  }, 500);
}

/* ══ SIGNUP ══ */
function authSignup(e) {
  e.preventDefault();
  const name     = document.getElementById('signupName').value.trim();
  const email    = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;
  const grade    = document.getElementById('signupClass').value;
  const errEl    = document.getElementById('signupError');
  const btn      = document.getElementById('signupBtn');
  if (name.length < 2) { errEl.textContent = 'Please enter your full name.'; return; }
  if (!/\S+@\S+\.\S+/.test(email)) { errEl.textContent = 'Please enter a valid email address.'; return; }
  if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; return; }
  btn.disabled = true; btn.textContent = 'Creating account...';
  setTimeout(() => {
    const users = getUsers();
    if (users[email]) {
      errEl.textContent = 'An account with this email already exists.';
      btn.disabled = false; btn.textContent = 'Create Account'; return;
    }
    const newUser = { name, email, password: btoa(password), grade, joinDate: new Date().toISOString(), avatar: null };
    users[email] = newUser;
    saveUsers(users);
    const sessionUser = { name, email, grade, avatar: null, joinDate: newUser.joinDate };
    saveUser(sessionUser, true);
    closeAuthModal();
    updateNavbarForUser(sessionUser);
    showAuthToast(`Welcome to AbiLearn, ${name.split(' ')[0]}!`);
  }, 700);
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
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const firstName = user.name.split(' ')[0];
  const widget = document.createElement('div');
  widget.id = 'navUserWidget';
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
  toast.id = 'authToast';
  toast.className = 'auth-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

/* ══ FULLSCREEN ══ */
function toggleFullscreen() {
  const btn = document.getElementById('fsBtn');
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      if (btn) btn.title = 'Exit full screen';
      btn && btn.querySelector('svg')?.setAttribute('data-fs', 'on');
      updateFsIcon(true);
    }).catch(() => {});
  } else {
    document.exitFullscreen().then(() => {
      updateFsIcon(false);
    }).catch(() => {});
  }
}
function updateFsIcon(isFs) {
  const btn = document.getElementById('fsBtn');
  if (!btn) return;
  btn.title = isFs ? 'Exit full screen' : 'Enter full screen';
  btn.innerHTML = isFs
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
}
document.addEventListener('fullscreenchange', () => updateFsIcon(!!document.fullscreenElement));

function initFullscreenBtn() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight || document.getElementById('fsBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'fsBtn';
  btn.className = 'fs-btn';
  btn.title = 'Enter full screen';
  btn.onclick = toggleFullscreen;
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
  const loginBtn = navRight.querySelector('.btn-login');
  if (loginBtn) navRight.insertBefore(btn, loginBtn);
  else navRight.appendChild(btn);
}

/* ══ INIT ══ */
function initAuth() {
  document.querySelectorAll('.btn-login').forEach(btn => btn.addEventListener('click', () => openAuthModal('login')));
  document.querySelectorAll('.btn-signup').forEach(btn => btn.addEventListener('click', () => openAuthModal('signup')));
  const user = getUser();
  if (user) updateNavbarForUser(user);
  initFullscreenBtn();
}
document.addEventListener('DOMContentLoaded', initAuth);

/* ══ DASHBOARD ══ */
function openDashboard() {
  const user = getUser(); if (!user) return;
  const progress = (() => { try { return JSON.parse(localStorage.getItem('abilearn_progress') || '{}'); } catch { return {}; } })();
  const subjects = [
    { id:'maths',   name:'Mathematics',   total:15 },
    { id:'science', name:'Science',        total:15 },
    { id:'english', name:'English',        total:10 },
    { id:'social',  name:'Social Science', total:12 }
  ];
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '';
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
  if (!panel) { panel = document.createElement('div'); panel.id = 'dashPanel'; panel.className = 'panel-overlay'; document.body.appendChild(panel); }
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
  const dd = document.getElementById('userDropdown'); if (dd) dd.classList.remove('open');
}

/* ══ SETTINGS ══ */
function openSettings() {
  const user = getUser(); if (!user) return;
  let panel = document.getElementById('settingsPanel');
  if (!panel) { panel = document.createElement('div'); panel.id = 'settingsPanel'; panel.className = 'panel-overlay'; document.body.appendChild(panel); }
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
  const dd = document.getElementById('userDropdown'); if (dd) dd.classList.remove('open');
}

function closePanel(id) {
  const p = document.getElementById(id);
  if (p) { p.classList.remove('open'); document.body.style.overflow = ''; }
}
function clearProgress() {
  if (confirm('Clear all study progress? This cannot be undone.')) {
    localStorage.removeItem('abilearn_progress');
    closePanel('settingsPanel');
    showAuthToast('Study progress cleared.');
  }
}
