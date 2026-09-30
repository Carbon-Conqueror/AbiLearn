/* AbiLearn Content Protection v7 */
(function () {
  'use strict';

  /* ── 0. ANTI-IFRAME ──────────────────────────────
   * Bust any attempt to embed this site in another page's iframe.           */
  if (window.top !== window.self) {
    try {
      /* Try to escape the frame by navigating the top context away */
      window.top.location.replace(window.location.href);
    } catch (_) {
      /* Cross-origin parent: just blank out our own document */
      document.documentElement.style.cssText = 'display:none!important';
    }
  }

  /* ── 0b. ANTI-CLONE ──────────────────────────────
   * Redirect to the official domain if the page is being served from an
   * unauthorised hostname (mirrors, clones, offline saves served via a
   * web server).  Localhost / LAN IPs are allowed for development.          */
  (function () {
    var host    = (window.location.hostname || '').toLowerCase();
    var allowed = [
      'abilearn.co.in',
      'www.abilearn.co.in',
      'abilearn-89c92.web.app',
      'abilearn-89c92.firebaseapp.com',
    ];
    var isLocal = host === 'localhost' || host === '127.0.0.1' ||
                  /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(host);
    var isOk    = isLocal || allowed.some(function (a) {
      return host === a || host.endsWith('.' + a);
    });
    if (!isOk) {
      document.documentElement.style.cssText = 'display:none!important';
      window.location.replace(
        'https://www.abilearn.co.in' + window.location.pathname + window.location.search
      );
    }
  }());

  /* ── 1. CONTEXT MENU ─────────────────────────── */
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ── 2. CLIPBOARD / DRAG ─────────────────────── */
  document.addEventListener('copy',      function (e) { e.preventDefault(); });
  document.addEventListener('cut',       function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });

  /* ── 3. TEXT SELECTION ───────────────────────── */
  document.addEventListener('selectstart', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    e.preventDefault();
  });

  /* ── 4. PRINT ────────────────────────────────── */
  window.addEventListener('beforeprint', function (e) { e.stopImmediatePropagation(); });
  window.print = function () {};

  /* ── 5. KEYBOARD SHORTCUTS ───────────────────── */
  function _isPrintScreen(e) {
    return e.key === 'PrintScreen' || e.key === 'PrtSc' ||
           e.key === 'Print' || e.keyCode === 44;
  }
  document.addEventListener('keydown', function (e) {
    var ctrl  = e.ctrlKey || e.metaKey;
    var key   = (e.key || '').toLowerCase();
    var shift = e.shiftKey;

    if (ctrl && ['c','a','s','u','p'].includes(key))      { e.preventDefault(); return; }
    if (ctrl && shift && ['i','j','c','k'].includes(key)) { e.preventDefault(); return; }
    if (e.key === 'F12')                                  { e.preventDefault(); return; }
    if (_isPrintScreen(e)) {
      e.preventDefault(); _flashGuard(); return;
    }
    if (ctrl && shift && ['3','4','5'].includes(e.key)) {
      e.preventDefault(); _flashGuard(); return;
    }
    /* Windows Snipping Tool: Win+Shift+S doesn't fire keydown with Win key
       but the app loses focus → window.blur fires (handled in section 8) */
  });
  /* Also catch PrintScreen on keyup — some tools only fire keyup */
  document.addEventListener('keyup', function (e) {
    if (_isPrintScreen(e)) { _flashGuard(); }
  });

  /* ── 6. SCREENSHOT GUARD ─────────────────────── */
  var _guard = null;
  var _guardTimer = null;

  function _ensureGuard() {
    if (_guard) return;
    _guard = document.createElement('div');
    _guard.id = 'abl-ss-guard';
    _guard.setAttribute('aria-hidden', 'true');
    document.body.appendChild(_guard);
  }

  function _flashGuard() {
    _ensureGuard();
    _guard.classList.add('abl-guard-visible');
    /* Blur all content under the guard */
    document.body.classList.add('abl-ss-active');
    clearTimeout(_guardTimer);
    _guardTimer = setTimeout(function () {
      _guard.classList.remove('abl-guard-visible');
      document.body.classList.remove('abl-ss-active');
    }, 300);
  }

  /* ── 7. VISIBILITY CHANGE ────────────────────── */
  /* Only guard when page is fully hidden (user switched app / locked screen).
   * Do NOT use window.blur — every mobile tap fires blur, causing false flashes. */
  var _lastVisible = true;
  document.addEventListener('visibilitychange', function () {
    _ensureGuard();
    if (document.visibilityState === 'hidden') {
      _lastVisible = false;
      _guard.classList.add('abl-guard-visible');
      document.body.classList.add('abl-ss-active');
    } else {
      _lastVisible = true;
      clearTimeout(_guardTimer);
      _guardTimer = setTimeout(function () {
        _guard.classList.remove('abl-guard-visible');
        document.body.classList.remove('abl-ss-active');
      }, 400);
    }
  });

  /* pagehide fires before unload AND when a page enters the back/forward cache.
   * Showing the guard ensures no content is visible in the bfcache snapshot. */
  window.addEventListener('pagehide', function () {
    _ensureGuard();
    _guard.classList.add('abl-guard-visible');
    document.body.classList.add('abl-ss-active');
  });

  /* freeze fires when the browser puts the page in bfcache (Chrome/Edge). */
  window.addEventListener('freeze', function () { _flashGuard(); });

  /* Pre-create the guard element now so it is already in the DOM when the first
     screenshot event fires. A class-add repaint is faster than DOM insertion +
     repaint, reducing the window between keydown and the black frame appearing. */
  _ensureGuard();

  /* ── 8. DEVTOOLS HEURISTIC (desktop only) ────── */
  /* Skip on touch devices — keyboard open triggers false positives */
  var _isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (!_isTouchDevice) {
    setInterval(function () {
      if ((window.outerWidth  - window.innerWidth  > 160) ||
          (window.outerHeight - window.innerHeight > 160)) {
        _flashGuard();
      }
    }, 2000);
  }


}());
