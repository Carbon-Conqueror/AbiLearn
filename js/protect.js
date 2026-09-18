/* AbiLearn Content Protection v2 */
(function () {
  'use strict';

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
    clearTimeout(_guardTimer);
    _guardTimer = setTimeout(function () {
      _guard.classList.remove('abl-guard-visible');
    }, 500);
  }

  /* ── 7. VISIBILITY CHANGE ────────────────────── */
  document.addEventListener('visibilitychange', function () {
    _ensureGuard();
    if (document.visibilityState === 'hidden') {
      _guard.classList.add('abl-guard-visible');
    } else {
      clearTimeout(_guardTimer);
      _guardTimer = setTimeout(function () {
        _guard.classList.remove('abl-guard-visible');
      }, 200);
    }
  });

  /* ── 8. WINDOW BLUR ──────────────────────────── */
  /* Fires when the browser window loses focus — catches OS snipping tools
   * (Win+Shift+S, Alt-Tab to screenshot app) that steal focus briefly      */
  window.addEventListener('blur', function () { _flashGuard(); });

  /* ── 9. DEVTOOLS HEURISTIC ───────────────────── */
  setInterval(function () {
    if ((window.outerWidth  - window.innerWidth  > 160) ||
        (window.outerHeight - window.innerHeight > 160)) {
      _flashGuard();
    }
  }, 1500);

  /* ── 10. DIAGONAL WATERMARK ──────────────────── */
  /* Renders a tiled watermark over the whole viewport at low opacity.
   * Invisible during normal use; clearly visible in any screenshot.         */
  (function () {
    if (document.getElementById('abl-watermark')) return;
    var wm  = document.createElement('div');
    wm.id   = 'abl-watermark';
    wm.setAttribute('aria-hidden', 'true');

    var text = 'AbiLearn  ·  Confidential  ·  ';
    var html = '';
    for (var i = 0; i < 60; i++) {
      html += '<span>' + text + '</span>';
    }
    wm.innerHTML = html;
    document.body.appendChild(wm);
  }());

}());
