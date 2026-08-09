/* ═══════════════════════════════════════════
   AbiLearn — Auth Page State Machine v1.0
   Standalone: no dependency on auth.js
   ═══════════════════════════════════════════ */

'use strict';

/* ══ SVG ICONS ══ */
const ICONS = {
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  circle: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

/* ══ STATE ══ */
let STATE = {
  screen: 'login',   // login | signup | forgot | forgot-sent | verify | reset | reset-success
  data:   {},        // screen-specific data
  showExpired: false
};

/* ══ HELPERS ══ */
function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function hashPassword(pw) {
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey(
    'raw', enc.encode(pw), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode('AbiLearn_v2_salt'), iterations: 100000, hash: 'SHA-256' },
    keyMat, 256
  );
  return Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateToken(len = 32) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ══ USER DB (localStorage 'abilearn_users') ══ */
function getUsers() {
  try { return JSON.parse(localStorage.getItem('abilearn_users') || '{}'); } catch { return {}; }
}
function saveUsers(db) {
  try { localStorage.setItem('abilearn_users', JSON.stringify(db)); } catch {}
}

/* ══ SESSION ══ */
function saveSession(user, remember) {
  const s = JSON.stringify(user);
  try {
    if (remember) { localStorage.setItem('abilearn_user', s); sessionStorage.removeItem('abilearn_user'); }
    else { sessionStorage.setItem('abilearn_user', s); localStorage.removeItem('abilearn_user'); }
  } catch {}
}

/* ══ RATE LIMITING ══ */
function rlKey(email) {
  const bytes = new TextEncoder().encode(email.toLowerCase());
  return 'al_rl_' + Array.from(bytes).slice(0, 16).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getRlRecord(email) {
  try { return JSON.parse(localStorage.getItem(rlKey(email)) || 'null'); } catch { return null; }
}

function setRlRecord(email, rec) {
  try { localStorage.setItem(rlKey(email), JSON.stringify(rec)); } catch {}
}

function isRateLimited(email) {
  const rec = getRlRecord(email);
  if (!rec) return false;
  if (rec.until && Date.now() < rec.until) return rec.until;
  if (rec.until && Date.now() >= rec.until) { localStorage.removeItem(rlKey(email)); return false; }
  return false;
}

function recordFailedAttempt(email) {
  const rec = getRlRecord(email) || { count: 0, until: null };
  if (rec.until && Date.now() >= rec.until) { rec.count = 0; rec.until = null; }
  rec.count = (rec.count || 0) + 1;
  if (rec.count >= 5) { rec.until = Date.now() + 15 * 60 * 1000; }
  setRlRecord(email, rec);
  return rec;
}

function clearRlRecord(email) {
  try { localStorage.removeItem(rlKey(email)); } catch {}
}

function formatRlTime(until) {
  const secs = Math.ceil((until - Date.now()) / 1000);
  const mins = Math.ceil(secs / 60);
  return mins > 1 ? `${mins} minutes` : `${secs} seconds`;
}

/* ══ EMAIL VALIDATION ══ */
function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }

/* ══ PASSWORD STRENGTH ══ */
function pwStrength(pw) {
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSym    = /[^a-zA-Z0-9]/.test(pw);
  if (!pw || pw.length < 8 || !hasLetter || !hasNumber) return 1; // Weak
  if (pw.length >= 12 && hasLetter && hasNumber && hasSym) return 3; // Strong
  if (pw.length >= 16) return 3;                                      // Strong
  return 2;                                                           // Good
}

function pwStrengthInfo(score) {
  if (score === 1) return { label: 'Weak',   color: '#DC2626' };
  if (score === 2) return { label: 'Good',   color: '#D97706' };
  return               { label: 'Strong', color: '#059669' };
}

/* ══ TOAST ══ */
function showToast(msg, type = 'success') {
  let t = document.getElementById('alToast');
  if (t) { t.remove(); }
  t = document.createElement('div');
  t.id = 'alToast';
  t.className = `al-toast ${type}`;
  t.innerHTML = `<span class="al-toast-dot"></span>${escHtml(msg)}`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3500);
}

/* ══ STATE NAVIGATION ══ */
function goTo(screen, data = {}) {
  STATE.screen = screen;
  STATE.data   = data;
  render();
}

/* ══ BUTTON LOADING ══ */
function setLoading(btn, text) {
  if (!btn) return;
  btn._origText = btn.innerHTML;
  btn.disabled  = true;
  btn.innerHTML = `<span class="al-spinner"></span>${escHtml(text)}`;
}

function clearLoading(btn, text) {
  if (!btn) return;
  btn.disabled  = false;
  btn.innerHTML = btn._origText || text || '';
}

/* ══ FIELD ERROR ══ */
function setFieldErr(inputId, errId, msg) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.classList.add('has-err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}

function clearFieldErr(inputId, errId) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (inp) inp.classList.remove('has-err');
  if (err) { err.textContent = ''; err.classList.remove('show'); }
}

/* ══ PASSWORD TOGGLE ══ */
function setupPwToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  btn.addEventListener('click', () => {
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
}

/* ══ STRENGTH + REQUIREMENTS LIVE UPDATE ══ */
function setupPwStrength(inputId, barsId, labelId, reqsId) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.addEventListener('input', () => updatePwStrengthUI(inp.value, barsId, labelId, reqsId));
}

function updatePwStrengthUI(val, barsId, labelId, reqsId) {
  const score = val ? pwStrength(val) : 0;
  const bars  = document.getElementById(barsId);
  const label = document.getElementById(labelId);
  if (bars) {
    const all = bars.querySelectorAll('.al-pw-bar');
    const info = score ? pwStrengthInfo(score) : null;
    all.forEach((b, i) => {
      b.style.background = (info && i < score) ? info.color : '';
    });
  }
  if (label) {
    if (!val) { label.textContent = ''; label.style.color = ''; }
    else {
      const info = pwStrengthInfo(score);
      label.textContent  = info.label;
      label.style.color  = info.color;
    }
  }
  if (reqsId) {
    const hasLetter = /[a-zA-Z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const reqs = [
      { id: 'req-len', met: val.length >= 8 },
      { id: 'req-let', met: hasLetter },
      { id: 'req-num', met: hasNumber }
    ];
    reqs.forEach(r => {
      const el = document.getElementById(r.id);
      if (!el) return;
      const icon = el.querySelector('.al-req-icon');
      if (r.met) {
        el.classList.add('met');
        if (icon) icon.innerHTML = ICONS.check;
      } else {
        el.classList.remove('met');
        if (icon) icon.innerHTML = ICONS.circle;
      }
    });
  }
}

/* ══ RESET TOKEN ══ */
function validateResetToken(token) {
  try {
    const rec = JSON.parse(localStorage.getItem('al_reset') || 'null');
    if (!rec || !rec.token || !rec.email || !rec.expires) return null;
    if (rec.token !== token) return null;
    if (Date.now() > rec.expires) return null;
    return rec.email;
  } catch { return null; }
}

function storeResetToken(email, token) {
  const rec = { email, token, expires: Date.now() + 60 * 60 * 1000 }; // 1h
  try { localStorage.setItem('al_reset', JSON.stringify(rec)); } catch {}
}

function invalidateResetToken() {
  try { localStorage.removeItem('al_reset'); } catch {}
}

/* ══ SIMULATE ACTIONS ══ */
function simulateReset() {
  const emailForReset = STATE.data.email || '';
  const token = generateToken(32);
  storeResetToken(emailForReset, token);
  goTo('reset', { token });
}

function simulateVerify() {
  const email = STATE.data.email;
  if (email) {
    const users = getUsers();
    if (users[email]) {
      users[email].verified = true;
      saveUsers(users);
    }
  }
  goTo('login', { toast: 'Email verified! You can now sign in.', toastType: 'success' });
}

function resendVerification() {
  showToast('Verification email resent.', 'info');
}

/* ══ URL PARSING ══ */
function parseUrlState() {
  const params = new URLSearchParams(location.search);
  const tab    = params.get('tab');
  const action = params.get('action');
  const token  = params.get('token');
  const expired = params.get('expired');

  if (action === 'reset' && token) {
    STATE.screen = 'reset';
    STATE.data   = { token };
  } else if (tab === 'signup') {
    STATE.screen = 'signup';
  } else {
    STATE.screen = 'login';
    if (expired === '1') STATE.showExpired = true;
  }
}

/* ══ REDIRECT AFTER LOGIN ══ */
function redirectAfterLogin() {
  const params = new URLSearchParams(location.search);
  const from   = params.get('from');
  const dest   = from ? decodeURIComponent(from) : 'index.html';
  // Safety: only allow same-origin redirects
  try {
    const u = new URL(dest, location.origin);
    if (u.origin === location.origin) { location.href = u.href; return; }
  } catch {}
  location.href = 'index.html';
}

/* ══ RENDER ══ */
function render() {
  const card = document.getElementById('alCard');
  if (!card) return;
  switch (STATE.screen) {
    case 'login':        card.innerHTML = renderLogin();         break;
    case 'signup':       card.innerHTML = renderSignup();        break;
    case 'forgot':       card.innerHTML = renderForgot();        break;
    case 'forgot-sent':  card.innerHTML = renderForgotSent();    break;
    case 'verify':       card.innerHTML = renderVerify();        break;
    case 'reset':        card.innerHTML = renderReset();         break;
    case 'reset-success': card.innerHTML = renderResetSuccess(); break;
    default:             card.innerHTML = renderLogin();
  }
  // Re-trigger fade animation
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';
  afterRender();
  // Handle post-navigation toasts
  if (STATE.data.toast) {
    const msg  = STATE.data.toast;
    const type = STATE.data.toastType || 'success';
    delete STATE.data.toast;
    delete STATE.data.toastType;
    requestAnimationFrame(() => showToast(msg, type));
  }
}

/* ══ SCREEN RENDERERS ══ */

function renderLogin() {
  const expiredBanner = STATE.showExpired
    ? `<div class="al-expired-banner">${ICONS.warning} Your session expired. Please sign in again.</div>`
    : '';
  return `
    ${expiredBanner}
    <div class="al-card-head">
      <h1>Welcome back</h1>
      <p>Sign in to continue your learning journey.</p>
    </div>
    <form class="al-form" id="loginForm" novalidate>
      <div class="al-field">
        <label class="al-label" for="loginEmail">Email address</label>
        <input class="al-input" type="email" id="loginEmail" name="email"
               placeholder="you@example.com" autocomplete="email" inputmode="email">
        <span class="al-field-err" id="loginEmailErr"></span>
      </div>
      <div class="al-field">
        <label class="al-label" for="loginPassword">Password</label>
        <div class="al-pw-wrap">
          <input class="al-input" type="password" id="loginPassword" name="password"
                 placeholder="Enter your password" autocomplete="current-password">
          <button type="button" class="al-pw-toggle" id="loginPwToggle" aria-label="Show password">
            ${ICONS.eye}
          </button>
        </div>
        <span class="al-field-err" id="loginPasswordErr"></span>
      </div>
      <div class="al-remember-row">
        <label class="al-check-label">
          <input type="checkbox" id="loginRemember" checked>
          <span>Keep me signed in</span>
        </label>
        <button type="button" class="al-forgot" id="forgotBtn">Forgot password?</button>
      </div>
      <div class="al-form-err" id="loginFormErr">${ICONS.alertCircle}</div>
      <button type="submit" class="al-btn al-btn-primary" id="loginBtn">Sign in</button>
    </form>
    <p class="al-switch">New to AbiLearn?
      <button type="button" id="switchToSignup">Create an account</button>
    </p>`;
}

function renderSignup() {
  return `
    <div class="al-card-head">
      <h1>Create your account</h1>
      <p>Join AbiLearn and start acing your boards.</p>
    </div>
    <form class="al-form" id="signupForm" novalidate>
      <div class="al-field">
        <label class="al-label" for="signupName">Full name</label>
        <input class="al-input" type="text" id="signupName" name="name"
               placeholder="Your full name" autocomplete="name">
        <span class="al-field-err" id="signupNameErr"></span>
      </div>
      <div class="al-field">
        <label class="al-label" for="signupEmail">Email address</label>
        <input class="al-input" type="email" id="signupEmail" name="email"
               placeholder="you@example.com" autocomplete="email" inputmode="email">
        <span class="al-field-err" id="signupEmailErr"></span>
      </div>
      <div class="al-field">
        <label class="al-label" for="signupPassword">Password</label>
        <div class="al-pw-wrap">
          <input class="al-input" type="password" id="signupPassword" name="password"
                 placeholder="At least 8 characters" autocomplete="new-password">
          <button type="button" class="al-pw-toggle" id="signupPwToggle" aria-label="Show password">
            ${ICONS.eye}
          </button>
        </div>
        <span class="al-field-err" id="signupPasswordErr"></span>
        <div class="al-pw-strength">
          <div class="al-pw-bars" id="signupPwBars">
            <div class="al-pw-bar"></div>
            <div class="al-pw-bar"></div>
            <div class="al-pw-bar"></div>
          </div>
          <span class="al-pw-label" id="signupPwLabel"></span>
        </div>
        <div class="al-reqs" id="signupReqs">
          <div class="al-req" id="req-len"><span class="al-req-icon">${ICONS.circle}</span>At least 8 characters</div>
          <div class="al-req" id="req-let"><span class="al-req-icon">${ICONS.circle}</span>Contains a letter</div>
          <div class="al-req" id="req-num"><span class="al-req-icon">${ICONS.circle}</span>Contains a number</div>
        </div>
      </div>
      <div class="al-field">
        <label class="al-label" for="signupConfirm">Confirm password</label>
        <div class="al-pw-wrap">
          <input class="al-input" type="password" id="signupConfirm" name="confirm"
                 placeholder="Repeat your password" autocomplete="new-password">
          <button type="button" class="al-pw-toggle" id="signupConfirmToggle" aria-label="Show password">
            ${ICONS.eye}
          </button>
        </div>
        <span class="al-field-err" id="signupConfirmErr"></span>
      </div>
      <div class="al-field">
        <label class="al-label" for="signupGrade">Class / Grade</label>
        <div class="al-select-wrap">
          <select class="al-input al-select" id="signupGrade" name="grade">
            <option value="Class 10">Class 10 (CBSE)</option>
            <option value="Class 9">Class 9 (CBSE)</option>
            <option value="Class 11">Class 11 (CBSE)</option>
            <option value="Class 12">Class 12 (CBSE)</option>
          </select>
        </div>
      </div>
      <div class="al-field" style="margin-bottom:1rem">
        <label class="al-check-label terms">
          <input type="checkbox" id="signupTerms">
          <span>I agree to the <a href="mailto:hello@abilearn.in">Terms of Service</a> and <a href="mailto:hello@abilearn.in">Privacy Policy</a></span>
        </label>
        <span class="al-field-err" id="signupTermsErr"></span>
      </div>
      <div class="al-form-err" id="signupFormErr">${ICONS.alertCircle}</div>
      <button type="submit" class="al-btn al-btn-primary" id="signupBtn">Create account</button>
    </form>
    <p class="al-switch">Already have an account?
      <button type="button" id="switchToLogin">Sign in</button>
    </p>`;
}

function renderForgot() {
  return `
    <button type="button" class="al-back" id="backToLogin">${ICONS.arrowLeft} Back to sign in</button>
    <div class="al-card-head">
      <h1>Reset your password</h1>
      <p>Enter the email associated with your AbiLearn account and we'll send you a link to reset your password.</p>
    </div>
    <form class="al-form" id="forgotForm" novalidate>
      <div class="al-field">
        <label class="al-label" for="forgotEmail">Email address</label>
        <input class="al-input" type="email" id="forgotEmail" name="email"
               placeholder="you@example.com" autocomplete="email" inputmode="email">
        <span class="al-field-err" id="forgotEmailErr"></span>
      </div>
      <div class="al-form-err" id="forgotFormErr">${ICONS.alertCircle}</div>
      <button type="submit" class="al-btn al-btn-primary" id="forgotBtn">Send reset link</button>
    </form>`;
}

function renderForgotSent() {
  const email = escHtml(STATE.data.email || 'your email');
  return `
    <div class="al-centered">
      <div class="al-icon-circle blue">${ICONS.mail}</div>
      <div class="al-card-head" style="text-align:center">
        <h1>Check your email</h1>
        <p>If an account exists for <strong>${email}</strong>, we've sent password reset instructions. Check your inbox and spam folder.</p>
      </div>
    </div>
    <p class="al-switch"><button type="button" id="backToLoginFromSent">Back to sign in</button></p>`;
}

function renderVerify() {
  const email = escHtml(STATE.data.email || 'your email');
  return `
    <div class="al-centered">
      <div class="al-icon-circle purple">${ICONS.mail}</div>
      <div class="al-card-head" style="text-align:center">
        <h1>Verify your email</h1>
        <p>We sent a verification link to:</p>
        <div class="al-email-display">${email}</div>
        <p style="margin-bottom:0">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
      </div>
    </div>
    <p class="al-switch"><button type="button" id="changeEmailBtn">Change email address</button></p>`;
}

function renderReset() {
  const token = STATE.data.token || '';
  const email = validateResetToken(token);

  if (!email) {
    return `
      <div class="al-token-err">
        <div class="al-icon-circle" style="background:#FEF2F2;color:#DC2626;margin:0 auto 1.25rem;">
          ${ICONS.shield}
        </div>
        <h2>Link expired or invalid</h2>
        <p>This password reset link has expired or is invalid. Reset links are valid for 1 hour.</p>
        <button type="button" class="al-btn al-btn-primary" id="requestNewResetBtn">Request a new reset link</button>
      </div>`;
  }

  return `
    <div class="al-card-head">
      <h1>Create a new password</h1>
      <p>Choose a strong password for <strong>${escHtml(email)}</strong>.</p>
    </div>
    <form class="al-form" id="resetForm" novalidate>
      <div class="al-field">
        <label class="al-label" for="resetPassword">New password</label>
        <div class="al-pw-wrap">
          <input class="al-input" type="password" id="resetPassword" name="password"
                 placeholder="At least 8 characters" autocomplete="new-password">
          <button type="button" class="al-pw-toggle" id="resetPwToggle" aria-label="Show password">
            ${ICONS.eye}
          </button>
        </div>
        <span class="al-field-err" id="resetPasswordErr"></span>
        <div class="al-pw-strength">
          <div class="al-pw-bars" id="resetPwBars">
            <div class="al-pw-bar"></div>
            <div class="al-pw-bar"></div>
            <div class="al-pw-bar"></div>
          </div>
          <span class="al-pw-label" id="resetPwLabel"></span>
        </div>
        <div class="al-reqs" id="signupReqs">
          <div class="al-req" id="req-len"><span class="al-req-icon">${ICONS.circle}</span>At least 8 characters</div>
          <div class="al-req" id="req-let"><span class="al-req-icon">${ICONS.circle}</span>Contains a letter</div>
          <div class="al-req" id="req-num"><span class="al-req-icon">${ICONS.circle}</span>Contains a number</div>
        </div>
      </div>
      <div class="al-field">
        <label class="al-label" for="resetConfirm">Confirm new password</label>
        <div class="al-pw-wrap">
          <input class="al-input" type="password" id="resetConfirm" name="confirm"
                 placeholder="Repeat your password" autocomplete="new-password">
          <button type="button" class="al-pw-toggle" id="resetConfirmToggle" aria-label="Show password">
            ${ICONS.eye}
          </button>
        </div>
        <span class="al-field-err" id="resetConfirmErr"></span>
      </div>
      <div class="al-form-err" id="resetFormErr">${ICONS.alertCircle}</div>
      <button type="submit" class="al-btn al-btn-primary" id="resetBtn">Update password</button>
    </form>`;
}

function renderResetSuccess() {
  return `
    <div class="al-centered">
      <div class="al-icon-circle green">${ICONS.checkCircle}</div>
      <div class="al-card-head" style="text-align:center">
        <h1>Password updated</h1>
        <p>Your password has been reset successfully. You can now sign in with your new password.</p>
      </div>
    </div>
    <button type="button" class="al-btn al-btn-primary" id="continueToSigninBtn">Continue to sign in</button>`;
}

/* ══ AFTER RENDER — WIRE UP LISTENERS ══ */
function afterRender() {
  const screen = STATE.screen;

  if (screen === 'login') {
    setupPwToggle('loginPwToggle', 'loginPassword');

    const forgotBtn = document.getElementById('forgotBtn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => goTo('forgot'));
    }

    const switchBtn = document.getElementById('switchToSignup');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => goTo('signup'));
    }

    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', handleLogin);
      // Focus first field
      const emailInput = document.getElementById('loginEmail');
      if (emailInput) requestAnimationFrame(() => emailInput.focus());
    }
  }

  if (screen === 'signup') {
    setupPwToggle('signupPwToggle', 'signupPassword');
    setupPwToggle('signupConfirmToggle', 'signupConfirm');
    setupPwStrength('signupPassword', 'signupPwBars', 'signupPwLabel', 'signupReqs');

    const switchBtn = document.getElementById('switchToLogin');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => goTo('login'));
    }

    const form = document.getElementById('signupForm');
    if (form) {
      form.addEventListener('submit', handleSignup);
      const nameInput = document.getElementById('signupName');
      if (nameInput) requestAnimationFrame(() => nameInput.focus());
    }
  }

  if (screen === 'forgot') {
    const backBtn = document.getElementById('backToLogin');
    if (backBtn) {
      backBtn.addEventListener('click', () => goTo('login'));
    }

    const form = document.getElementById('forgotForm');
    if (form) {
      form.addEventListener('submit', handleForgot);
      const emailInput = document.getElementById('forgotEmail');
      if (emailInput) requestAnimationFrame(() => emailInput.focus());
    }
  }

  if (screen === 'forgot-sent') {
    const resendBtn = document.getElementById('resendResetBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', () => {
        showToast('Reset email resent.', 'info');
      });
    }

    const backBtn = document.getElementById('backToLoginFromSent');
    if (backBtn) {
      backBtn.addEventListener('click', () => goTo('login'));
    }
  }

  if (screen === 'verify') {
    const resendBtn = document.getElementById('resendVerifyBtn');
    if (resendBtn) {
      resendBtn.addEventListener('click', resendVerification);
    }

    const changeBtn = document.getElementById('changeEmailBtn');
    if (changeBtn) {
      changeBtn.addEventListener('click', () => goTo('signup'));
    }
  }

  if (screen === 'reset') {
    const token = STATE.data.token || '';
    const email = validateResetToken(token);

    if (!email) {
      const requestBtn = document.getElementById('requestNewResetBtn');
      if (requestBtn) {
        requestBtn.addEventListener('click', () => goTo('forgot'));
      }
      return;
    }

    setupPwToggle('resetPwToggle', 'resetPassword');
    setupPwToggle('resetConfirmToggle', 'resetConfirm');
    setupPwStrength('resetPassword', 'resetPwBars', 'resetPwLabel', 'signupReqs');

    const form = document.getElementById('resetForm');
    if (form) {
      form.addEventListener('submit', (e) => handleReset(e, email, token));
      const pwInput = document.getElementById('resetPassword');
      if (pwInput) requestAnimationFrame(() => pwInput.focus());
    }
  }

  if (screen === 'reset-success') {
    const continueBtn = document.getElementById('continueToSigninBtn');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => goTo('login'));
    }
  }
}

/* ══ FORM HANDLERS ══ */

async function handleLogin(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  const remember = document.getElementById('loginRemember')?.checked !== false;
  const errEl    = document.getElementById('loginFormErr');
  const btn      = document.getElementById('loginBtn');

  // Clear previous errors
  clearFieldErr('loginEmail', 'loginEmailErr');
  clearFieldErr('loginPassword', 'loginPasswordErr');
  if (errEl) { errEl.classList.remove('show'); errEl.innerHTML = ICONS.alertCircle; }

  // Validate
  if (!email) { setFieldErr('loginEmail', 'loginEmailErr', 'Email is required.'); return; }
  if (!isValidEmail(email)) { setFieldErr('loginEmail', 'loginEmailErr', 'Enter a valid email address.'); return; }
  if (!password) { setFieldErr('loginPassword', 'loginPasswordErr', 'Password is required.'); return; }

  // Rate limit check
  const lockedUntil = isRateLimited(email);
  if (lockedUntil) {
    if (errEl) {
      errEl.innerHTML = `${ICONS.alertCircle} Too many failed attempts. Try again in ${formatRlTime(lockedUntil)}.`;
      errEl.classList.add('show');
    }
    return;
  }

  setLoading(btn, 'Signing in...');
  await delay(650);

  const users = getUsers();
  const user  = users[email];

  // Ambiguous error helper
  function badCredentials() {
    const rec = recordFailedAttempt(email);
    const remaining = 5 - (rec.count || 0);
    let msg = 'The email or password you entered is incorrect.';
    if (rec.until) {
      msg = 'Too many failed attempts. Your account is temporarily locked for 15 minutes.';
    } else if (remaining <= 2 && remaining > 0) {
      msg = `The email or password you entered is incorrect. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before lockout.`;
    }
    clearLoading(btn, 'Sign in');
    if (errEl) { errEl.innerHTML = `${ICONS.alertCircle} ${escHtml(msg)}`; errEl.classList.add('show'); }
  }

  if (!user) { badCredentials(); return; }

  // Try PBKDF2 first
  let matched = false;
  try {
    const hashed = await hashPassword(password);
    if (user.password === hashed) matched = true;
  } catch {}

  // Backward compat: try btoa for old accounts
  if (!matched && user.password === btoa(password)) {
    matched = true;
    // Migrate to PBKDF2
    try {
      const newHash = await hashPassword(password);
      users[email].password = newHash;
      saveUsers(users);
    } catch {}
  }

  if (!matched) { badCredentials(); return; }

  // Success
  clearRlRecord(email);
  const sessionUser = {
    name:     user.name,
    email:    user.email,
    grade:    user.grade,
    avatar:   user.avatar || null,
    joinDate: user.joinDate
  };
  saveSession(sessionUser, remember);
  clearLoading(btn, 'Sign in');
  STATE.showExpired = false;
  showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
  await delay(600);
  redirectAfterLogin();
}

async function handleSignup(e) {
  e.preventDefault();
  const name    = document.getElementById('signupName').value.trim();
  const email   = document.getElementById('signupEmail').value.trim().toLowerCase();
  const pw      = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;
  const grade   = document.getElementById('signupGrade').value;
  const terms   = document.getElementById('signupTerms')?.checked;
  const errEl   = document.getElementById('signupFormErr');
  const btn     = document.getElementById('signupBtn');

  // Clear errors
  ['signupName','signupEmail','signupPassword','signupConfirm'].forEach(id => {
    clearFieldErr(id, id + 'Err');
  });
  if (errEl) { errEl.classList.remove('show'); errEl.innerHTML = ICONS.alertCircle; }

  // Validate
  let hasErr = false;
  if (!name || name.length < 2) {
    setFieldErr('signupName', 'signupNameErr', 'Please enter your full name (at least 2 characters).');
    hasErr = true;
  }
  if (!email) {
    setFieldErr('signupEmail', 'signupEmailErr', 'Email is required.');
    hasErr = true;
  } else if (!isValidEmail(email)) {
    setFieldErr('signupEmail', 'signupEmailErr', 'Enter a valid email address.');
    hasErr = true;
  }
  if (!pw) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password is required.');
    hasErr = true;
  } else if (pw.length < 8) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must be at least 8 characters.');
    hasErr = true;
  } else if (!/[a-zA-Z]/.test(pw)) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must contain at least one letter.');
    hasErr = true;
  } else if (!/[0-9]/.test(pw)) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must contain at least one number.');
    hasErr = true;
  }
  if (pw && confirm && pw !== confirm) {
    setFieldErr('signupConfirm', 'signupConfirmErr', 'Passwords do not match.');
    hasErr = true;
  } else if (pw && !confirm) {
    setFieldErr('signupConfirm', 'signupConfirmErr', 'Please confirm your password.');
    hasErr = true;
  }
  if (!terms) {
    const termsErr = document.getElementById('signupTermsErr');
    if (termsErr) { termsErr.textContent = 'You must agree to the terms to continue.'; termsErr.classList.add('show'); }
    hasErr = true;
  }
  if (hasErr) return;

  setLoading(btn, 'Creating account...');
  await delay(750);

  const users = getUsers();
  if (users[email]) {
    clearLoading(btn, 'Create account');
    if (errEl) {
      errEl.innerHTML = `${ICONS.alertCircle} An account with this email already exists.`;
      errEl.classList.add('show');
    }
    return;
  }

  let hashed;
  try { hashed = await hashPassword(pw); }
  catch { hashed = btoa(pw); }

  const newUser = {
    name,
    email,
    password: hashed,
    grade,
    joinDate: new Date().toISOString(),
    avatar: null,
    verified: true
  };
  users[email] = newUser;
  saveUsers(users);

  clearLoading(btn, 'Create account');
  goTo('login', { toast: 'Account created! You can now sign in.', toastType: 'success' });
}

async function handleForgot(e) {
  e.preventDefault();
  const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  const errEl = document.getElementById('forgotFormErr');
  const btn   = document.getElementById('forgotBtn');

  clearFieldErr('forgotEmail', 'forgotEmailErr');
  if (errEl) { errEl.classList.remove('show'); errEl.innerHTML = ICONS.alertCircle; }

  if (!email) { setFieldErr('forgotEmail', 'forgotEmailErr', 'Email is required.'); return; }
  if (!isValidEmail(email)) { setFieldErr('forgotEmail', 'forgotEmailErr', 'Enter a valid email address.'); return; }

  setLoading(btn, 'Verifying...');
  await delay(600);

  const users = getUsers();
  if (!users[email]) {
    clearLoading(btn, 'Send reset link');
    setFieldErr('forgotEmail', 'forgotEmailErr', 'No account found with this email.');
    return;
  }

  const token = generateToken(32);
  storeResetToken(email, token);
  clearLoading(btn, 'Send reset link');
  goTo('reset', { token, email });
}

async function handleReset(e, email, token) {
  e.preventDefault();
  const pw      = document.getElementById('resetPassword').value;
  const confirm = document.getElementById('resetConfirm').value;
  const errEl   = document.getElementById('resetFormErr');
  const btn     = document.getElementById('resetBtn');

  clearFieldErr('resetPassword', 'resetPasswordErr');
  clearFieldErr('resetConfirm', 'resetConfirmErr');
  if (errEl) { errEl.classList.remove('show'); errEl.innerHTML = ICONS.alertCircle; }

  let hasErr = false;
  if (!pw) {
    setFieldErr('resetPassword', 'resetPasswordErr', 'Password is required.'); hasErr = true;
  } else if (pw.length < 8) {
    setFieldErr('resetPassword', 'resetPasswordErr', 'Password must be at least 8 characters.'); hasErr = true;
  } else if (!/[a-zA-Z]/.test(pw)) {
    setFieldErr('resetPassword', 'resetPasswordErr', 'Password must contain at least one letter.'); hasErr = true;
  } else if (!/[0-9]/.test(pw)) {
    setFieldErr('resetPassword', 'resetPasswordErr', 'Password must contain at least one number.'); hasErr = true;
  }
  if (pw && !confirm) {
    setFieldErr('resetConfirm', 'resetConfirmErr', 'Please confirm your password.'); hasErr = true;
  } else if (pw && confirm && pw !== confirm) {
    setFieldErr('resetConfirm', 'resetConfirmErr', 'Passwords do not match.'); hasErr = true;
  }
  if (hasErr) return;

  setLoading(btn, 'Updating...');
  await delay(700);

  // Re-validate token (may have expired during form fill)
  const validEmail = validateResetToken(token);
  if (!validEmail || validEmail !== email) {
    clearLoading(btn, 'Update password');
    if (errEl) {
      errEl.innerHTML = `${ICONS.alertCircle} This link has expired. Please request a new one.`;
      errEl.classList.add('show');
    }
    return;
  }

  let hashed;
  try { hashed = await hashPassword(pw); }
  catch { hashed = btoa(pw); }

  const users = getUsers();
  if (users[email]) {
    users[email].password = hashed;
    saveUsers(users);
  }

  invalidateResetToken();
  clearLoading(btn, 'Update password');
  goTo('reset-success');
}

/* ══ INIT ══ */
function init() {
  parseUrlState();
  render();
}

window.resendVerification = resendVerification;

document.addEventListener('DOMContentLoaded', init);
