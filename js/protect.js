/* AbiLearn Content Protection v3 */
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
  document.addEventListener('keydown', function (e) {
    var ctrl  = e.ctrlKey || e.metaKey;
    var key   = (e.key || '').toLowerCase();
    var shift = e.shiftKey;

    if (ctrl && ['c','a','s','u','p'].includes(key))      { e.preventDefault(); return; }
    if (ctrl && shift && ['i','j','c','k'].includes(key)) { e.preventDefault(); return; }
    if (e.key === 'F12')                                  { e.preventDefault(); return; }
    if (e.key === 'PrintScreen' || e.key === 'PrtSc') {
      e.preventDefault(); _flashGuard(); return;
    }
    if (ctrl && shift && ['3','4','5'].includes(e.key)) {
      e.preventDefault(); _flashGuard(); return;
    }
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
    }, 1500);
  }

  /* ── 7. VISIBILITY CHANGE ────────────────────── */
  document.addEventListener('visibilitychange', function () {
    _ensureGuard();
    if (document.visibilityState === 'hidden') {
      _guard.classList.add('abl-guard-visible');
      document.body.classList.add('abl-ss-active');
    } else {
      clearTimeout(_guardTimer);
      /* Keep guard up briefly after returning — covers any screenshot-viewer
       * swipe-back animation that might expose the page content             */
      _guardTimer = setTimeout(function () {
        _guard.classList.remove('abl-guard-visible');
        document.body.classList.remove('abl-ss-active');
      }, 600);
    }
  });

  /* ── 8. WINDOW BLUR ──────────────────────────── */
  window.addEventListener('blur', function () { _flashGuard(); });

  /* ── 9. DEVTOOLS HEURISTIC ───────────────────── */
  setInterval(function () {
    if ((window.outerWidth  - window.innerWidth  > 160) ||
        (window.outerHeight - window.innerHeight > 160)) {
      _flashGuard();
    }
  }, 1500);

  /* ── 10. WATERMARK ───────────────────────────────
   * Diagonal tiled overlay — visible in every screenshot.
   * Personalised with the user's email once auth resolves so that any
   * shared screenshot is traceable to the specific account.                  */
  var _wm = null;

  function _wmBuild(text) {
    if (!_wm) return;
    var safe = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var html = '';
    for (var i = 0; i < 60; i++) html += '<span>' + safe + '</span>';
    _wm.innerHTML = html;
  }

  (function () {
    if (document.getElementById('abl-watermark')) return;
    _wm = document.createElement('div');
    _wm.id = 'abl-watermark';
    _wm.setAttribute('aria-hidden', 'true');
    _wmBuild('AbiLearn  ·  Confidential  ·  ');
    document.body.appendChild(_wm);
  }());

  /* Called by app.js once Firebase auth resolves with the signed-in user */
  window._ablSetWatermarkUser = function (email, name) {
    var id = (name || email || '').trim();
    if (!id) return;
    _wmBuild('AbiLearn  ·  ' + id + '  ·  ');
  };

}());
