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
        <img src="assets/logo.svg" alt="AbiLearn" class="auth-logo">
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

/* ══ GOOGLE SIGN-IN (Firebase-ready placeholder) ══ */
function authWithGoogle() {
  // If Firebase is configured, use it. Otherwise show friendly message.
  if (typeof firebase !== 'undefined' && firebase.auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      const u = result.user;
      const sessionUser = { name: u.displayName, email: u.email, grade: 'Class 10', avatar: u.photoURL, joinDate: new Date().toISOString() };
      saveUser(sessionUser);
      closeAuthModal();
      updateNavbarForUser(sessionUser);
      showAuthToast(`Welcome, ${u.displayName.split(' ')[0]}! 🎉`);
    }).catch(err => {
      const errEl = document.getElementById('loginError') || document.getElementById('signupError');
      if (errEl) errEl.textContent = err.message;
    });
  } else {
    // Demo mode: create a guest account
    const guestUser = { name: 'Google Student', email: 'google@demo.com', grade: 'Class 10', avatar: null, joinDate: new Date().toISOString(), isGuest: true };
    saveUser(guestUser);
    closeAuthModal();
    updateNavbarForUser(guestUser);
    showAuthToast('Signed in as Google Student (demo mode) 🎓');
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

  // Hide login/signup buttons
  if (loginBtn)  loginBtn.style.display  = 'none';
  if (signupBtn) signupBtn.style.display = 'none';

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
        <a href="#" onclick="showAuthToast('Dashboard coming soon! 🚀');return false">📊 My Dashboard</a>
        <a href="#" onclick="showAuthToast('Profile settings coming soon!');return false">⚙️ Settings</a>
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
  const loginBtn  = document.querySelector('.btn-login');
  const signupBtn = document.querySelector('.btn-signup');
  if (loginBtn)  loginBtn.style.display  = '';
  if (signupBtn) signupBtn.style.display = '';
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
