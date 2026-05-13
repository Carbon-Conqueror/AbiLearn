/* AbiLearn — Authentication System
   Local auth with localStorage + Google Sign-In ready */

/* ══ AUTH STATE ══ */
function getUser() {
  try { return JSON.parse(localStorage.getItem('abilearn_user') || 'null'); } catch { return null; }
}
function saveUser(u) {
  try { localStorage.setItem('abilearn_user', JSON.stringify(u)); } catch {}
}
function clearUser() {
  try { localStorage.removeItem('abilearn_user'); } catch {}
}

/* ══ REGISTERED USERS DB (localStorage) ══ */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('abilearn_users') || '{}'); } catch { return {}; }
}
function saveUsers(db) {
  try { localStorage.setItem('abilearn_users', JSON.stringify(db)); } catch {}
}

/* ══ MODAL HTML ══ */
function createAuthModal() {
  const existing = document.getElementById('authModal');
  if (existing) return;

  const modal = document.createElement('div');
  modal.id = 'authModal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal" id="authModalBox">
      <button class="auth-close" id="authClose" aria-label="Close">✕</button>

      <!-- Branding -->
      <div class="auth-brand">
        <img src="assets/logo.jpeg" alt="AbiLearn" class="auth-logo">
        <span class="auth-brand-text">Abi<span>Learn</span></span>
      </div>

      <!-- Tab toggle -->
      <div class="auth-tabs">
        <button class="auth-tab active" id="tabLogin" onclick="authSwitchTab('login')">Log In</button>
        <button class="auth-tab" id="tabSignup" onclick="authSwitchTab('signup')">Sign Up</button>
      </div>

      <!-- Google button -->
      <button class="auth-google-btn" onclick="authWithGoogle()">
        <svg width="18" height="18" viewBox="0 0 48 48" style="flex-shrink:0">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>

      <div class="auth-divider"><span>or</span></div>

      <!-- LOGIN FORM -->
      <form class="auth-form" id="loginForm" onsubmit="authLogin(event)">
        <div class="auth-field">
          <label>Email address</label>
          <input type="email" id="loginEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <div class="auth-pw-wrap">
            <input type="password" id="loginPassword" placeholder="Your password" required autocomplete="current-password">
            <button type="button" class="auth-pw-toggle" onclick="authTogglePw('loginPassword',this)">👁️</button>
          </div>
        </div>
        <div class="auth-error" id="loginError"></div>
        <button type="submit" class="auth-submit-btn" id="loginBtn">Log In</button>
        <p class="auth-switch-link">Don't have an account? <button type="button" onclick="authSwitchTab('signup')">Sign Up Free</button></p>
      </form>

      <!-- SIGNUP FORM -->
      <form class="auth-form hidden" id="signupForm" onsubmit="authSignup(event)">
        <div class="auth-field">
          <label>Full Name</label>
          <input type="text" id="signupName" placeholder="Your name" required autocomplete="name">
        </div>
        <div class="auth-field">
          <label>Email address</label>
          <input type="email" id="signupEmail" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label>Password</label>
          <div class="auth-pw-wrap">
            <input type="password" id="signupPassword" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password">
            <button type="button" class="auth-pw-toggle" onclick="authTogglePw('signupPassword',this)">👁️</button>
          </div>
        </div>
        <div class="auth-field">
          <label>Class / Grade</label>
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

  // Close on overlay click
  modal.addEventListener('click', e => { if (e.target === modal) closeAuthModal(); });
  document.getElementById('authClose').addEventListener('click', closeAuthModal);

  // ESC key
  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') { closeAuthModal(); document.removeEventListener('keydown', escHandler); }
  });
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
  const loginForm   = document.getElementById('loginForm');
  const signupForm  = document.getElementById('signupForm');
  const tabLogin    = document.getElementById('tabLogin');
  const tabSignup   = document.getElementById('tabSignup');
  if (!loginForm) return;

  clearAuthErrors();
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    document.getElementById('loginEmail')?.focus();
  } else {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    tabLogin.classList.remove('active');
    tabSignup.classList.add('active');
    document.getElementById('signupName')?.focus();
  }
}

function clearAuthErrors() {
  const le = document.getElementById('loginError');
  const se = document.getElementById('signupError');
  if (le) le.textContent = '';
  if (se) se.textContent = '';
}

function authTogglePw(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  const isText = inp.type === 'text';
  inp.type = isText ? 'password' : 'text';
  btn.textContent = isText ? '👁️' : '🙈';
}

/* ══ LOGIN ══ */
function authLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  const btn      = document.getElementById('loginBtn');

  btn.disabled = true; btn.textContent = 'Logging in...';

  setTimeout(() => {
    const users = getUsers();
    const user  = users[email];

    if (!user) {
      errEl.textContent = 'No account found with this email. Please sign up.';
      btn.disabled = false; btn.textContent = 'Log In'; return;
    }
    if (user.password !== btoa(password)) {
      errEl.textContent = 'Incorrect password. Please try again.';
      btn.disabled = false; btn.textContent = 'Log In'; return;
    }

    const sessionUser = { name: user.name, email: user.email, grade: user.grade, avatar: user.avatar || null, joinDate: user.joinDate };
    saveUser(sessionUser);
    closeAuthModal();
    updateNavbarForUser(sessionUser);
    showAuthToast(`Welcome back, ${user.name.split(' ')[0]}! 🎉`);
  }, 600);
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
  if (password.length < 6) { errEl.textContent = 'Password must be at least 6 characters.'; return; }

  btn.disabled = true; btn.textContent = 'Creating account...';

  setTimeout(() => {
    const users = getUsers();
    if (users[email]) {
      errEl.textContent = 'An account with this email already exists. Please log in.';
      btn.disabled = false; btn.textContent = 'Create Account'; return;
    }

    const newUser = { name, email, password: btoa(password), grade, joinDate: new Date().toISOString(), avatar: null };
    users[email] = newUser;
    saveUsers(users);

    const sessionUser = { name, email, grade, avatar: null, joinDate: newUser.joinDate };
    saveUser(sessionUser);
    closeAuthModal();
    updateNavbarForUser(sessionUser);
    showAuthToast(`Account created! Welcome to AbiLearn, ${name.split(' ')[0]}! 🎓`);
  }, 800);
}

/* ══ GOOGLE SIGN-IN — Google Identity Services ══ */
const GOOGLE_CLIENT_ID = ''; // Paste your Client ID from console.cloud.google.com → APIs & Services → Credentials

function authWithGoogle() {
  if (!GOOGLE_CLIENT_ID) {
    const errEl = document.getElementById('loginError') || document.getElementById('signupError');
    if (errEl) errEl.textContent = 'Google Sign-In is not set up yet. Please use email login.';
    return;
  }
  const load = cb => {
    if (window.google?.accounts?.id) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.onload = cb;
    document.head.appendChild(s);
  };
  load(() => {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    google.accounts.id.prompt(n => {
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        const errEl = document.getElementById('loginError') || document.getElementById('signupError');
        if (errEl) errEl.textContent = 'Google Sign-In was dismissed. Try again or use email.';
      }
    });
  });
}

function handleGoogleCredential(response) {
  try {
    const b64 = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const p = JSON.parse(atob(b64));
    const user = { name: p.name, email: p.email, avatar: p.picture, grade: 'Class 10', joinDate: new Date().toISOString() };
    saveUser(user);
    closeAuthModal();
    updateNavbarForUser(user);
    showAuthToast(`Welcome, ${(p.given_name || p.name).split(' ')[0]}! 🎉`);
  } catch {
    showAuthToast('Google Sign-In failed. Please try again.');
  }
}

/* ══ LOGOUT ══ */
function authLogout() {
  clearUser();
  const dd = document.getElementById('userDropdown');
  if (dd) dd.remove();
  restoreNavbarButtons();
  showAuthToast('Logged out successfully. See you soon! 👋');
}

/* ══ NAVBAR UPDATE ══ */
function updateNavbarForUser(user) {
  const loginBtn  = document.querySelector('.btn-login');
  const signupBtn = document.querySelector('.btn-signup');
  const navRight  = document.querySelector('.nav-right');
  if (!navRight) return;

  // Hide all login/signup buttons (desktop + mobile hamburger)
  document.querySelectorAll('.btn-login,.btn-signup').forEach(b => b.style.display = 'none');

  // Remove existing user widget if any
  const old = document.getElementById('navUserWidget');
  if (old) old.remove();

  // Get initials for avatar
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const widget = document.createElement('div');
  widget.id = 'navUserWidget';
  widget.className = 'nav-user-widget';
  widget.innerHTML = `
    <div class="nav-avatar" id="navAvatar" onclick="toggleUserDropdown()" title="${user.name}">
      ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}" onerror="this.style.display='none';this.nextSibling.style.display='flex'"><span class="nav-avatar-initials" style="display:none">${initials}</span>` : `<span class="nav-avatar-initials">${initials}</span>`}
    </div>
    <div class="user-dropdown" id="userDropdown">
      <div class="user-dropdown-header">
        <div class="ud-name">${user.name}</div>
        <div class="ud-email">${user.email}</div>
        <div class="ud-grade">${user.grade}</div>
      </div>
      <div class="user-dropdown-links">
        <a href="#" onclick="openDashboard();return false">📊 My Dashboard</a>
        <a href="#" onclick="openSettings();return false">⚙️ Settings</a>
        <a href="#" onclick="authLogout();return false" class="ud-logout">🚪 Log Out</a>
      </div>
    </div>`;

  // Insert before hamburger
  const hamburger = navRight.querySelector('.hamburger');
  if (hamburger) navRight.insertBefore(widget, hamburger);
  else navRight.appendChild(widget);

  // Close dropdown on outside click
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
  dd.classList.toggle('open');
  // Re-attach outside click listener
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!e.target.closest('#navUserWidget')) {
        dd.classList.remove('open');
        document.removeEventListener('click', handler);
      }
    });
  }, 10);
}

function restoreNavbarButtons() {
  document.querySelectorAll('.btn-login,.btn-signup').forEach(b => b.style.display = '');
  const widget = document.getElementById('navUserWidget');
  if (widget) widget.remove();
}

/* ══ TOAST NOTIFICATION ══ */
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

/* ══ INIT ══ */
function initAuth() {
  // Wire up navbar buttons
  document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', () => openAuthModal('login'));
  });
  document.querySelectorAll('.btn-signup').forEach(btn => {
    btn.addEventListener('click', () => openAuthModal('signup'));
  });

  // Restore session if logged in
  const user = getUser();
  if (user) updateNavbarForUser(user);
}

document.addEventListener('DOMContentLoaded', initAuth);

/* ══ DASHBOARD ══ */
function openDashboard() {
  const user = getUser(); if (!user) return;
  const progress = (() => { try { return JSON.parse(localStorage.getItem('abilearn_progress') || '{}'); } catch { return {}; } })();
  const subjects = [
    { id:'maths',   icon:'📐', name:'Mathematics',   total:15 },
    { id:'science', icon:'🔬', name:'Science',        total:15 },
    { id:'english', icon:'📖', name:'English',        total:10 },
    { id:'social',  icon:'🌍', name:'Social Science', total:12 }
  ];
  const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—';
  const rows = subjects.map(s => {
    const done = Object.keys(progress).filter(k => k.startsWith(s.id + '_') && progress[k]).length;
    const pct = Math.round((done / s.total) * 100);
    return `<div class="dash-progress-row">
      <span class="dash-subject-name">${s.icon} ${s.name}</span>
      <div class="dash-bar-wrap"><div class="dash-bar-fill" style="width:${pct}%"></div></div>
      <span class="dash-count">${done}/${s.total}</span>
    </div>`;
  }).join('');

  let panel = document.getElementById('dashPanel');
  if (!panel) { panel = document.createElement('div'); panel.id = 'dashPanel'; panel.className = 'panel-overlay'; document.body.appendChild(panel); }
  panel.innerHTML = `
    <div class="panel-box">
      <div class="panel-top">
        <span class="panel-title">📊 My Dashboard</span>
        <button class="panel-close" onclick="closePanel('dashPanel')">✕</button>
      </div>
      <div class="panel-body">
        <div class="dash-user-row">
          <div class="dash-avatar">${initials}</div>
          <div class="dash-user-info">
            <div class="dash-name">${user.name}</div>
            <div class="dash-grade">${user.grade} • Joined ${joinDate}</div>
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
        <span class="panel-title">⚙️ Settings</span>
        <button class="panel-close" onclick="closePanel('settingsPanel')">✕</button>
      </div>
      <div class="panel-body">
        <div class="panel-section">
          <div class="panel-section-title">Profile</div>
          <div class="settings-row"><span class="settings-row-label">Name</span><span class="settings-row-value">${user.name}</span></div>
          <div class="settings-row"><span class="settings-row-label">Email</span><span class="settings-row-value">${user.email}</span></div>
          <div class="settings-row"><span class="settings-row-label">Class</span><span class="settings-row-value">${user.grade}</span></div>
        </div>
        <div class="panel-section">
          <div class="panel-section-title">App</div>
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
    showAuthToast('Study progress cleared ✓');
  }
}
