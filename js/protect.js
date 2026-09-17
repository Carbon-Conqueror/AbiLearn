/* AbiLearn Content Protection + Focus Mode */
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

    // Ctrl/Cmd + C A S U P
    if (ctrl && ['c','a','s','u','p'].includes(key))      { e.preventDefault(); return; }
    // Ctrl/Cmd + Shift + I J C K (DevTools)
    if (ctrl && shift && ['i','j','c','k'].includes(key)) { e.preventDefault(); return; }
    // F12
    if (e.key === 'F12')                                  { e.preventDefault(); return; }
    // PrintScreen (Windows/Linux)
    if (e.key === 'PrintScreen' || e.key === 'PrtSc')     { e.preventDefault(); _flashGuard(); return; }
    // Mac screenshot: Cmd+Shift+3 / 4 / 5
    if (ctrl && shift && ['3','4','5'].includes(e.key))   { e.preventDefault(); _flashGuard(); return; }
    // Windows Snipping: Win+Shift+S (can't reliably catch but try)
    if (e.key === 'F1') return; // leave F1 for help
  });

  /* ── 6. SCREENSHOT GUARD OVERLAY ────────────── */
  var _guard = null;
  var _guardTimer = null;

  function _ensureGuard() {
    if (_guard) return;
    _guard = document.createElement('div');
    _guard.id = 'abl-ss-guard';
    _guard.setAttribute('aria-hidden', 'true');
    document.body.appendChild(_guard);
  }

  // Flash the opaque guard (covers content for 400ms when screenshot key detected)
  function _flashGuard() {
    _ensureGuard();
    _guard.classList.add('abl-guard-visible');
    clearTimeout(_guardTimer);
    _guardTimer = setTimeout(function () {
      _guard.classList.remove('abl-guard-visible');
    }, 400);
  }

  // On visibility change (tab switch / screen share / recording) — cover content
  document.addEventListener('visibilitychange', function () {
    _ensureGuard();
    if (document.visibilityState === 'hidden') {
      _guard.classList.add('abl-guard-visible');
    } else {
      clearTimeout(_guardTimer);
      _guardTimer = setTimeout(function () {
        _guard.classList.remove('abl-guard-visible');
      }, 250);
    }
  });

  // DevTools open heuristic — size-based check
  (function _devtoolsCheck() {
    var threshold = 160;
    setInterval(function () {
      if ((window.outerWidth - window.innerWidth > threshold) ||
          (window.outerHeight - window.innerHeight > threshold)) {
        _flashGuard();
      }
    }, 1500);
  })();

  /* ── 7. FULLSCREEN FOCUS MODE ────────────────── */
  var _isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  var _fsOverlay = null;
  var _hasEnteredFS = false;

  function _isFullscreen() {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement);
  }

  function _requestFullscreen() {
    var el = document.documentElement;
    try {
      if (el.requestFullscreen)       el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
      else if (el.msRequestFullscreen)     el.msRequestFullscreen();
    } catch (err) { /* silently ignore */ }
  }

  function _showFSOverlay() {
    if (_fsOverlay) return;
    _fsOverlay = document.createElement('div');
    _fsOverlay.id = 'abl-fs-overlay';
    _fsOverlay.setAttribute('role', 'dialog');
    _fsOverlay.setAttribute('aria-modal', 'true');
    _fsOverlay.innerHTML =
      '<div class="abl-fs-box">' +
        '<div class="abl-fs-icon">📚</div>' +
        '<h2 class="abl-fs-title">Focus Mode</h2>' +
        '<p class="abl-fs-sub">AbiLearn is designed for distraction-free fullscreen study.</p>' +
        '<button id="abl-fs-btn" class="abl-fs-btn">Enter Fullscreen</button>' +
      '</div>';
    document.body.appendChild(_fsOverlay);
    document.getElementById('abl-fs-btn').addEventListener('click', function () {
      _requestFullscreen();
    });
  }

  function _hideFSOverlay() {
    if (_fsOverlay) {
      _fsOverlay.remove();
      _fsOverlay = null;
    }
  }

  function _onFSChange() {
    if (_isFullscreen()) {
      _hasEnteredFS = true;
      _hideFSOverlay();
    } else if (_hasEnteredFS) {
      // User exited fullscreen — bring overlay back
      _showFSOverlay();
    }
  }

  if (!_isMobile) {
    document.addEventListener('fullscreenchange',       _onFSChange);
    document.addEventListener('webkitfullscreenchange', _onFSChange);
    document.addEventListener('mozfullscreenchange',    _onFSChange);
    document.addEventListener('MSFullscreenChange',     _onFSChange);

    // Trigger fullscreen on first user gesture (browsers require it)
    function _onFirstGesture() {
      if (!_isFullscreen()) _requestFullscreen();
      document.removeEventListener('click',      _onFirstGesture);
      document.removeEventListener('touchstart', _onFirstGesture);
      document.removeEventListener('keydown',    _onFirstGesture);
    }
    document.addEventListener('click',      _onFirstGesture, { once: true });
    document.addEventListener('touchstart', _onFirstGesture, { once: true });
    document.addEventListener('keydown',    _onFirstGesture, { once: true });

    // Show overlay after 3 s if still not fullscreen
    setTimeout(function () {
      if (!_isFullscreen()) _showFSOverlay();
    }, 3000);
  }

}());
