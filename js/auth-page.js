/* AbiLearn — Auth Page v3 (Firebase Authentication)
 * Standalone: no dependency on auth.js.
 * Handles: login, signup, forgot password, email verification notice.
 */
'use strict';

/* ══ SVG ICONS ══ */
var ICONS = {
  eye: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  circle: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  checkCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  alertCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
};

/* ══ STATE ══ */
var STATE = { screen: 'login', data: {} };

/* ══ HELPERS ══ */
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function delay(ms) { return new Promise(function (r) { return setTimeout(r, ms); }); }

function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }

function pwStrength(pw) {
  if (!pw || pw.length < 8 || !/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) return 1;
  if (pw.length >= 12 && /[^a-zA-Z0-9]/.test(pw)) return 3;
  return 2;
}

function pwStrengthInfo(score) {
  if (score === 1) return { label: 'Weak',   color: '#DC2626' };
  if (score === 2) return { label: 'Good',   color: '#D97706' };
  return               { label: 'Strong', color: '#059669' };
}

/* ══ TOAST ══ */
function showToast(msg, type) {
  var t = document.getElementById('alToast');
  if (t) t.remove();
  t = document.createElement('div');
  t.id = 'alToast';
  t.className = 'al-toast ' + (type || 'success');
  t.innerHTML = '<span class="al-toast-dot"></span>' + escHtml(msg);
  document.body.appendChild(t);
  requestAnimationFrame(function () { requestAnimationFrame(function () { t.classList.add('show'); }); });
  setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 4000);
}

/* ══ STATE NAVIGATION ══ */
function goTo(screen, data) {
  STATE.screen = screen;
  STATE.data   = data || {};
  render();
}

/* ══ BUTTON STATES ══ */
function setLoading(btn, text) {
  if (!btn) return;
  btn._orig    = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="al-spinner"></span>' + escHtml(text);
}
function clearLoading(btn, fallback) {
  if (!btn) return;
  btn.disabled  = false;
  btn.innerHTML = btn._orig || fallback || '';
}

/* ══ FIELD ERRORS ══ */
function setFieldErr(inputId, errId, msg) {
  var inp = document.getElementById(inputId);
  var err = document.getElementById(errId);
  if (inp) inp.classList.add('has-err');
  if (err) { err.textContent = msg; err.classList.add('show'); }
}
function clearFieldErr(inputId, errId) {
  var inp = document.getElementById(inputId);
  var err = document.getElementById(errId);
  if (inp) inp.classList.remove('has-err');
  if (err) { err.textContent = ''; err.classList.remove('show'); }
}
function showFormErr(id, msg, actions) {
  var el = document.getElementById(id);
  if (!el) return;
  var actionsHtml = '';
  if (actions) {
    actionsHtml = '<div class="al-err-actions">';
    if (actions.reset)  actionsHtml += '<button type="button" class="al-err-action" id="errActionReset">Reset password</button>';
    if (actions.signup) actionsHtml += '<button type="button" class="al-err-action" id="errActionSignup">Create an account</button>';
    actionsHtml += '</div>';
  }
  el.innerHTML = ICONS.alertCircle + ' ' + escHtml(msg) + actionsHtml;
  el.classList.add('show');
  if (actions && actions.reset) {
    var rb = document.getElementById('errActionReset');
    if (rb) rb.addEventListener('click', function () { goTo('forgot'); });
  }
  if (actions && actions.signup) {
    var sb = document.getElementById('errActionSignup');
    if (sb) sb.addEventListener('click', function () { goTo('signup'); });
  }
}
function hideFormErr(id) {
  var el = document.getElementById(id);
  if (el) { el.classList.remove('show'); el.innerHTML = ICONS.alertCircle; }
}

/* ══ PASSWORD TOGGLE ══ */
function setupPwToggle(btnId, inputId) {
  var btn = document.getElementById(btnId);
  var inp = document.getElementById(inputId);
  if (!btn || !inp) return;
  btn.addEventListener('click', function () {
    var show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });
}

/* ══ STRENGTH METER ══ */
function setupPwStrength(inputId, barsId, labelId) {
  var inp = document.getElementById(inputId);
  if (!inp) return;
  inp.addEventListener('input', function () {
    var val   = inp.value;
    var score = val ? pwStrength(val) : 0;
    var bars  = document.getElementById(barsId);
    var label = document.getElementById(labelId);
    if (bars) {
      bars.querySelectorAll('.al-pw-bar').forEach(function (b, i) {
        var info = score ? pwStrengthInfo(score) : null;
        b.style.background = (info && i < score) ? info.color : '';
      });
    }
    if (label) {
      if (!val) { label.textContent = ''; label.style.color = ''; }
      else { var inf = pwStrengthInfo(score); label.textContent = inf.label; label.style.color = inf.color; }
    }
    // requirements
    var reqs = [
      { id: 'req-len', met: val.length >= 8 },
      { id: 'req-let', met: /[a-zA-Z]/.test(val) },
      { id: 'req-num', met: /[0-9]/.test(val) }
    ];
    reqs.forEach(function (r) {
      var el   = document.getElementById(r.id);
      var icon = el && el.querySelector('.al-req-icon');
      if (!el) return;
      el.classList.toggle('met', r.met);
      if (icon) icon.innerHTML = r.met ? ICONS.check : ICONS.circle;
    });
  });
}

/* ══ FIREBASE ERROR → USER MESSAGE ══ */
function fbErrorMsg(code) {
  var map = {
    'auth/user-not-found':              'No account found with this email address.',
    'auth/wrong-password':              'The password is incorrect. Please try again.',
    'auth/invalid-credential':          'The email or password is incorrect.',
    'auth/invalid-login-credentials':   'The email or password is incorrect.',
    'auth/email-already-in-use':        'An account with this email already exists.',
    'auth/weak-password':               'Password must be at least 8 characters.',
    'auth/invalid-email':               'Please enter a valid email address.',
    'auth/too-many-requests':           'Too many attempts. Please wait a few minutes before trying again.',
    'auth/network-request-failed':      'Network error. Check your connection and try again.',
    'auth/user-disabled':               'This account has been disabled. Contact support.',
    'auth/popup-closed-by-user':        'Sign-in popup was closed. Please try again.',
    'auth/operation-not-allowed':       'Email sign-in is not enabled. Contact support.',
    'auth/requires-recent-login':       'Please sign in again to continue.',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method.'
  };
  if (!map[code]) console.warn('[AbiLearn] Unhandled Firebase auth error:', code);
  return map[code] || 'An error occurred. Please try again.';
}

/* ══ REDIRECT AFTER LOGIN ══ */
function redirectAfterLogin() {
  var params = new URLSearchParams(location.search);
  var from   = params.get('from');
  var dest   = from ? decodeURIComponent(from) : 'index.html';
  try {
    var u = new URL(dest, location.origin);
    if (u.origin === location.origin) { location.href = u.href; return; }
  } catch (e) { /* invalid URL */ }
  location.href = 'index.html';
}

/* ══ RENDER ══ */
function render() {
  var card = document.getElementById('alCard');
  if (!card) return;
  var html = '';
  switch (STATE.screen) {
    case 'login':       html = renderLogin();      break;
    case 'signup':      html = renderSignup();     break;
    case 'forgot':      html = renderForgot();     break;
    case 'forgot-sent': html = renderForgotSent(); break;
    case 'verify':      html = renderVerify();     break;
    default:            html = renderLogin();
  }
  card.innerHTML = html;
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = '';
  afterRender();
  if (STATE.data.toast) {
    var msg  = STATE.data.toast;
    var type = STATE.data.toastType || 'success';
    delete STATE.data.toast;
    delete STATE.data.toastType;
    requestAnimationFrame(function () { showToast(msg, type); });
  }
}

/* ══ SCREEN RENDERERS ══ */

function renderLogin() {
  var expiredBanner = STATE.data.expired
    ? '<div class="al-expired-banner">' + ICONS.warning + ' Your session expired. Please sign in again.</div>'
    : '';
  return expiredBanner +
    '<div class="al-card-head"><h1>Welcome back</h1><p>Sign in to continue your learning journey.</p></div>' +
    '<form class="al-form" id="loginForm" novalidate>' +
      '<div class="al-field">' +
        '<label class="al-label" for="loginEmail">Email address</label>' +
        '<input class="al-input" type="email" id="loginEmail" name="email" placeholder="you@example.com" autocomplete="email" inputmode="email">' +
        '<span class="al-field-err" id="loginEmailErr"></span>' +
      '</div>' +
      '<div class="al-field">' +
        '<label class="al-label" for="loginPassword">Password</label>' +
        '<div class="al-pw-wrap">' +
          '<input class="al-input" type="password" id="loginPassword" name="password" placeholder="Enter your password" autocomplete="current-password">' +
          '<button type="button" class="al-pw-toggle" id="loginPwToggle" aria-label="Show password">' + ICONS.eye + '</button>' +
        '</div>' +
        '<span class="al-field-err" id="loginPasswordErr"></span>' +
      '</div>' +
      '<div class="al-remember-row">' +
        '<label class="al-check-label"><input type="checkbox" id="loginRemember" checked><span>Keep me signed in</span></label>' +
        '<button type="button" class="al-forgot" id="forgotLink">Forgot password?</button>' +
      '</div>' +
      '<div class="al-form-err" id="loginFormErr">' + ICONS.alertCircle + '</div>' +
      '<button type="submit" class="al-btn al-btn-primary" id="loginBtn">Sign in</button>' +
    '</form>' +
    '<p class="al-switch">New to AbiLearn? <button type="button" id="switchToSignup">Create an account</button></p>';
}

function renderSignup() {
  return '<div class="al-card-head"><h1>Create your account</h1><p>Join AbiLearn and start acing your boards.</p></div>' +
    '<form class="al-form" id="signupForm" novalidate>' +
      '<div class="al-field">' +
        '<label class="al-label" for="signupName">Full name</label>' +
        '<input class="al-input" type="text" id="signupName" name="name" placeholder="Your full name" autocomplete="name">' +
        '<span class="al-field-err" id="signupNameErr"></span>' +
      '</div>' +
      '<div class="al-field">' +
        '<label class="al-label" for="signupEmail">Email address</label>' +
        '<input class="al-input" type="email" id="signupEmail" name="email" placeholder="you@example.com" autocomplete="email" inputmode="email">' +
        '<span class="al-field-err" id="signupEmailErr"></span>' +
      '</div>' +
      '<div class="al-field">' +
        '<label class="al-label" for="signupPassword">Password</label>' +
        '<div class="al-pw-wrap">' +
          '<input class="al-input" type="password" id="signupPassword" name="password" placeholder="At least 8 characters" autocomplete="new-password">' +
          '<button type="button" class="al-pw-toggle" id="signupPwToggle" aria-label="Show password">' + ICONS.eye + '</button>' +
        '</div>' +
        '<span class="al-field-err" id="signupPasswordErr"></span>' +
        '<div class="al-pw-strength">' +
          '<div class="al-pw-bars" id="signupPwBars"><div class="al-pw-bar"></div><div class="al-pw-bar"></div><div class="al-pw-bar"></div></div>' +
          '<span class="al-pw-label" id="signupPwLabel"></span>' +
        '</div>' +
        '<div class="al-reqs" id="signupReqs">' +
          '<div class="al-req" id="req-len"><span class="al-req-icon">' + ICONS.circle + '</span>At least 8 characters</div>' +
          '<div class="al-req" id="req-let"><span class="al-req-icon">' + ICONS.circle + '</span>Contains a letter</div>' +
          '<div class="al-req" id="req-num"><span class="al-req-icon">' + ICONS.circle + '</span>Contains a number</div>' +
        '</div>' +
      '</div>' +
      '<div class="al-field">' +
        '<label class="al-label" for="signupConfirm">Confirm password</label>' +
        '<div class="al-pw-wrap">' +
          '<input class="al-input" type="password" id="signupConfirm" name="confirm" placeholder="Repeat your password" autocomplete="new-password">' +
          '<button type="button" class="al-pw-toggle" id="signupConfirmToggle" aria-label="Show password">' + ICONS.eye + '</button>' +
        '</div>' +
        '<span class="al-field-err" id="signupConfirmErr"></span>' +
      '</div>' +
      '<div class="al-field">' +
        '<label class="al-label" for="signupGrade">Class / Grade</label>' +
        '<div class="al-select-wrap">' +
          '<select class="al-input al-select" id="signupGrade" name="grade">' +
            '<option value="Class 10">Class 10 (CBSE)</option>' +
            '<option value="Class 9">Class 9 (CBSE)</option>' +
            '<option value="Class 11">Class 11 (CBSE)</option>' +
            '<option value="Class 12">Class 12 (CBSE)</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<div class="al-field" style="margin-bottom:1rem">' +
        '<label class="al-check-label terms"><input type="checkbox" id="signupTerms"><span>I agree to the <a href="mailto:hello@abilearn.in">Terms of Service</a> and <a href="mailto:hello@abilearn.in">Privacy Policy</a></span></label>' +
        '<span class="al-field-err" id="signupTermsErr"></span>' +
      '</div>' +
      '<div class="al-form-err" id="signupFormErr">' + ICONS.alertCircle + '</div>' +
      '<button type="submit" class="al-btn al-btn-primary" id="signupBtn">Create account</button>' +
    '</form>' +
    '<p class="al-switch">Already have an account? <button type="button" id="switchToLogin">Sign in</button></p>';
}

function renderForgot() {
  return '<button type="button" class="al-back" id="backToLogin">' + ICONS.arrowLeft + ' Back to sign in</button>' +
    '<div class="al-card-head"><h1>Reset your password</h1><p>Enter your email and we\'ll send you a link to reset your password.</p></div>' +
    '<form class="al-form" id="forgotForm" novalidate>' +
      '<div class="al-field">' +
        '<label class="al-label" for="forgotEmail">Email address</label>' +
        '<input class="al-input" type="email" id="forgotEmail" name="email" placeholder="you@example.com" autocomplete="email" inputmode="email">' +
        '<span class="al-field-err" id="forgotEmailErr"></span>' +
      '</div>' +
      '<div class="al-form-err" id="forgotFormErr">' + ICONS.alertCircle + '</div>' +
      '<button type="submit" class="al-btn al-btn-primary" id="forgotSubmitBtn">Send reset link</button>' +
    '</form>';
}

function renderForgotSent() {
  var email = escHtml(STATE.data.email || 'your email');
  return '<div class="al-centered">' +
    '<div class="al-icon-circle blue">' + ICONS.mail + '</div>' +
    '<div class="al-card-head" style="text-align:center">' +
      '<h1>Check your email</h1>' +
      '<p>If an account exists for <strong>' + email + '</strong>, we\'ve sent a password reset link. Check your inbox and spam folder.</p>' +
    '</div>' +
  '</div>' +
  '<p class="al-switch"><button type="button" id="backToLoginFromSent">Back to sign in</button></p>';
}

function renderVerify() {
  var email = escHtml(STATE.data.email || 'your email');
  return '<div class="al-centered">' +
    '<div class="al-icon-circle purple">' + ICONS.mail + '</div>' +
    '<div class="al-card-head" style="text-align:center">' +
      '<h1>Verify your email</h1>' +
      '<p>We sent a verification link to:</p>' +
      '<div class="al-email-display">' + email + '</div>' +
      '<p style="margin-bottom:0">Click the link in the email to activate your account. Check your spam folder too.</p>' +
    '</div>' +
  '</div>' +
  '<button type="button" class="al-btn al-btn-primary" id="continueAnywayBtn" style="margin-top:1.25rem">Continue to app</button>' +
  '<p class="al-switch" style="margin-top:0.75rem"><button type="button" id="resendVerifyBtn">Resend verification email</button></p>' +
  '<p class="al-switch"><button type="button" id="changeEmailBtn">Use a different email</button></p>';
}

/* ══ AFTER RENDER — wire event listeners ══ */
function afterRender() {
  var screen = STATE.screen;

  if (screen === 'login') {
    setupPwToggle('loginPwToggle', 'loginPassword');
    var fLink = document.getElementById('forgotLink');
    if (fLink) fLink.addEventListener('click', function () { goTo('forgot'); });
    var sw = document.getElementById('switchToSignup');
    if (sw) sw.addEventListener('click', function () { goTo('signup'); });
    var form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', handleLogin);
      var inp = document.getElementById('loginEmail');
      if (inp) requestAnimationFrame(function () { inp.focus(); });
    }
  }

  if (screen === 'signup') {
    setupPwToggle('signupPwToggle', 'signupPassword');
    setupPwToggle('signupConfirmToggle', 'signupConfirm');
    setupPwStrength('signupPassword', 'signupPwBars', 'signupPwLabel');
    var sw2 = document.getElementById('switchToLogin');
    if (sw2) sw2.addEventListener('click', function () { goTo('login'); });
    var form2 = document.getElementById('signupForm');
    if (form2) {
      form2.addEventListener('submit', handleSignup);
      var inp2 = document.getElementById('signupName');
      if (inp2) requestAnimationFrame(function () { inp2.focus(); });
    }
  }

  if (screen === 'forgot') {
    var back = document.getElementById('backToLogin');
    if (back) back.addEventListener('click', function () { goTo('login'); });
    var form3 = document.getElementById('forgotForm');
    if (form3) {
      form3.addEventListener('submit', handleForgot);
      var inp3 = document.getElementById('forgotEmail');
      if (inp3) requestAnimationFrame(function () { inp3.focus(); });
    }
  }

  if (screen === 'forgot-sent') {
    var back2 = document.getElementById('backToLoginFromSent');
    if (back2) back2.addEventListener('click', function () { goTo('login'); });
  }

  if (screen === 'verify') {
    var continueBtn = document.getElementById('continueAnywayBtn');
    if (continueBtn) continueBtn.addEventListener('click', redirectAfterLogin);

    var resendBtn = document.getElementById('resendVerifyBtn');
    if (resendBtn) resendBtn.addEventListener('click', function () {
      var fbUser = window._fauth && window._fauth.currentUser;
      if (fbUser) {
        fbUser.sendEmailVerification().then(function () {
          showToast('Verification email resent. Check your inbox.', 'success');
        }).catch(function () {
          showToast('Could not resend email. Try again in a minute.', 'error');
        });
      }
    });

    var changeBtn = document.getElementById('changeEmailBtn');
    if (changeBtn) changeBtn.addEventListener('click', function () {
      if (window._fauth) window._fauth.signOut();
      goTo('signup');
    });
  }
}

/* ══ FORM HANDLERS ══ */

async function handleLogin(e) {
  e.preventDefault();
  var email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  var password = document.getElementById('loginPassword').value;
  var btn      = document.getElementById('loginBtn');

  clearFieldErr('loginEmail',    'loginEmailErr');
  clearFieldErr('loginPassword', 'loginPasswordErr');
  hideFormErr('loginFormErr');

  var hasErr = false;
  if (!email)              { setFieldErr('loginEmail',    'loginEmailErr',    'Email is required.');             hasErr = true; }
  else if (!isValidEmail(email)) { setFieldErr('loginEmail', 'loginEmailErr', 'Enter a valid email address.'); hasErr = true; }
  if (!password)           { setFieldErr('loginPassword', 'loginPasswordErr', 'Password is required.');         hasErr = true; }
  if (hasErr) return;

  setLoading(btn, 'Signing in…');
  try {
    var remember = document.getElementById('loginRemember') && document.getElementById('loginRemember').checked;
    try {
      var Persistence = firebase.auth.Auth.Persistence;
      await window._fauth.setPersistence(remember ? Persistence.LOCAL : Persistence.SESSION);
    } catch (pe) { console.warn('[AbiLearn] setPersistence failed, continuing:', pe); }
    await window._fauth.signInWithEmailAndPassword(email, password);
    clearLoading(btn, 'Sign in');
    showToast('Welcome back!', 'success');
    await delay(600);
    redirectAfterLogin();
  } catch (err) {
    clearLoading(btn, 'Sign in');
    var credErr = err.code === 'auth/invalid-login-credentials' ||
                  err.code === 'auth/invalid-credential' ||
                  err.code === 'auth/wrong-password' ||
                  err.code === 'auth/user-not-found';
    var noAcct  = err.code === 'auth/user-not-found';
    showFormErr('loginFormErr', fbErrorMsg(err.code),
      credErr ? { reset: true, signup: noAcct } : null);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  var name    = document.getElementById('signupName').value.trim();
  var email   = document.getElementById('signupEmail').value.trim().toLowerCase();
  var pw      = document.getElementById('signupPassword').value;
  var confirm = document.getElementById('signupConfirm').value;
  var grade   = document.getElementById('signupGrade').value;
  var terms   = document.getElementById('signupTerms') && document.getElementById('signupTerms').checked;
  var btn     = document.getElementById('signupBtn');

  ['signupName','signupEmail','signupPassword','signupConfirm'].forEach(function (id) {
    clearFieldErr(id, id + 'Err');
  });
  hideFormErr('signupFormErr');

  var hasErr = false;
  if (!name || name.length < 2) {
    setFieldErr('signupName', 'signupNameErr', 'Enter your full name (at least 2 characters).'); hasErr = true;
  }
  if (!email) {
    setFieldErr('signupEmail', 'signupEmailErr', 'Email is required.'); hasErr = true;
  } else if (!isValidEmail(email)) {
    setFieldErr('signupEmail', 'signupEmailErr', 'Enter a valid email address.'); hasErr = true;
  }
  if (!pw) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password is required.'); hasErr = true;
  } else if (pw.length < 8) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must be at least 8 characters.'); hasErr = true;
  } else if (!/[a-zA-Z]/.test(pw)) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must contain at least one letter.'); hasErr = true;
  } else if (!/[0-9]/.test(pw)) {
    setFieldErr('signupPassword', 'signupPasswordErr', 'Password must contain at least one number.'); hasErr = true;
  }
  if (pw && !confirm) {
    setFieldErr('signupConfirm', 'signupConfirmErr', 'Please confirm your password.'); hasErr = true;
  } else if (pw && confirm && pw !== confirm) {
    setFieldErr('signupConfirm', 'signupConfirmErr', 'Passwords do not match.'); hasErr = true;
  }
  if (!terms) {
    var termsErr = document.getElementById('signupTermsErr');
    if (termsErr) { termsErr.textContent = 'You must agree to continue.'; termsErr.classList.add('show'); }
    hasErr = true;
  }
  if (hasErr) return;

  setLoading(btn, 'Creating account…');
  try {
    var cred = await window._fauth.createUserWithEmailAndPassword(email, pw);
    var fbUser = cred.user;

    // Update Firebase display name
    await fbUser.updateProfile({ displayName: name });

    // Create Firestore profile
    var joinDate = new Date().toISOString();
    await DB.setProfile({
      name:     name,
      email:    email,
      grade:    grade,
      joinDate: joinDate,
      avatar:   null
    }, fbUser.uid);

    // Send email verification
    await fbUser.sendEmailVerification();

    clearLoading(btn, 'Create account');
    goTo('verify', { email: email });
  } catch (err) {
    clearLoading(btn, 'Create account');
    if (err.code === 'auth/email-already-in-use') {
      setFieldErr('signupEmail', 'signupEmailErr', 'An account with this email already exists.');
    } else {
      showFormErr('signupFormErr', fbErrorMsg(err.code));
    }
  }
}

async function handleForgot(e) {
  e.preventDefault();
  var email = document.getElementById('forgotEmail').value.trim().toLowerCase();
  var btn   = document.getElementById('forgotSubmitBtn');

  clearFieldErr('forgotEmail', 'forgotEmailErr');
  hideFormErr('forgotFormErr');

  if (!email)              { setFieldErr('forgotEmail', 'forgotEmailErr', 'Email is required.'); return; }
  if (!isValidEmail(email)){ setFieldErr('forgotEmail', 'forgotEmailErr', 'Enter a valid email address.'); return; }

  setLoading(btn, 'Sending…');
  try {
    // Firebase sends reset email regardless of whether account exists (prevents enumeration)
    await window._fauth.sendPasswordResetEmail(email);
    clearLoading(btn, 'Send reset link');
    goTo('forgot-sent', { email: email });
  } catch (err) {
    clearLoading(btn, 'Send reset link');
    showFormErr('forgotFormErr', fbErrorMsg(err.code));
  }
}

/* ══ URL-DRIVEN INIT ══ */
function parseUrlState() {
  var params  = new URLSearchParams(location.search);
  var tab     = params.get('tab');
  var expired = params.get('expired');
  if (tab === 'signup') {
    STATE.screen = 'signup';
  } else {
    STATE.screen = 'login';
    if (expired === '1') STATE.data = { expired: true };
  }
}

/* ══ INIT ══ */
function init() {
  if (window._firebaseConfigMissing) {
    var card = document.getElementById('alCard');
    if (card) {
      card.innerHTML =
        '<div style="text-align:center;padding:2rem 1rem">' +
          '<div style="font-size:2.5rem;margin-bottom:1rem">⚙️</div>' +
          '<h2 style="margin:0 0 0.5rem;font-size:1.2rem">Firebase not configured</h2>' +
          '<p style="color:#6B7280;font-size:0.875rem;margin:0 0 1.25rem">Set your Firebase credentials in<br>' +
          '<strong>Cloudflare Pages → Settings → Environment variables</strong>.</p>' +
          '<a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" ' +
          'style="display:inline-block;background:#6D28D9;color:#fff;padding:0.6rem 1.25rem;border-radius:8px;font-size:0.875rem;text-decoration:none;font-weight:600">' +
          'Open Firebase Console</a>' +
        '</div>';
    }
    return;
  }

  if (window._fauth) {
    var urlParams = new URLSearchParams(location.search);
    var isExpired = urlParams.get('expired') === '1';

    if (isExpired) {
      // Session genuinely expired — if still logged in, redirect away.
      window._fauth.onAuthStateChanged(function (fbUser) {
        if (fbUser) { redirectAfterLogin(); }
      });
    } else {
      // User navigated to login intentionally (Log In button, direct URL, etc.)
      // Sign out any stale session so the form is always usable.
      window._fauth.signOut().catch(function () {});
    }
  }
  parseUrlState();
  render();
}

document.addEventListener('DOMContentLoaded', init);
