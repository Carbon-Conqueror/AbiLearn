/* AbiLearn — Focus Mode + Screenshot Layer */
(function () {
  'use strict';

  var FS_KEY = 'abl_fs';

  /* ── Browser / device detection ────────────── */
  var isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isSafariBrowser = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isIOSSafari = isIOS && isSafariBrowser;
  /* iOS 16.4+ supports fullscreen in standalone/PWA mode but not in browser */
  var isStandalone = !!(navigator.standalone || window.matchMedia('(display-mode: standalone)').matches);

  /* ── Fullscreen API helpers ─────────────────── */
  function canFullscreen() {
    var el = document.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen ||
              el.mozRequestFullScreen || el.msRequestFullscreen);
  }

  function isFS() {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement ||
              isStandalone);
  }

  function enterFS() {
    if (isFS()) return;
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen ||
             el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fn) fn.call(el).catch(function () {});
  }

  /* ── Overlay ────────────────────────────────── */
  var overlay = null;

  function showOverlay(iosFallback) {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'abl-fs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    var content;
    if (iosFallback) {
      /* iOS Safari cannot enter fullscreen — show Add to Home Screen guide */
      content =
        '<div class="abl-fs-box">' +
          '<img class="abl-fs-logo" src="assets/logo.svg" alt="AbiLearn">' +
          '<h2 class="abl-fs-title">Focus Mode</h2>' +
          '<p class="abl-fs-sub">For the best fullscreen experience on iPhone or iPad, add AbiLearn to your Home Screen:</p>' +
          '<ol class="abl-fs-steps">' +
            '<li>Tap <strong>Share</strong> <span class="abl-fs-share-icon">⬆</span></li>' +
            '<li>Tap <strong>Add to Home Screen</strong></li>' +
            '<li>Open the AbiLearn icon from your Home Screen</li>' +
          '</ol>' +
          '<button id="abl-fs-btn" class="abl-fs-btn">Continue Anyway</button>' +
        '</div>';
    } else {
      content =
        '<div class="abl-fs-box">' +
          '<img class="abl-fs-logo" src="assets/logo.svg" alt="AbiLearn">' +
          '<h2 class="abl-fs-title">Focus Mode</h2>' +
          '<p class="abl-fs-sub">Study without distractions. Enter fullscreen to continue.</p>' +
          '<button id="abl-fs-btn" class="abl-fs-btn">Enter Fullscreen</button>' +
        '</div>';
    }
    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    document.getElementById('abl-fs-btn').addEventListener('click', function () {
      if (iosFallback) {
        hideOverlay();
      } else {
        enterFS();
        setTimeout(function () { if (!isFS()) hideOverlay(); }, 800);
      }
    });
  }

  function hideOverlay() {
    if (overlay) { overlay.remove(); overlay = null; }
  }

  /* ── Fullscreen lifecycle ───────────────────── */
  var enteredOnce = false;

  function onFSChange() {
    if (isFS()) {
      enteredOnce = true;
      try { sessionStorage.setItem(FS_KEY, '1'); } catch (e) {}
      hideOverlay();
    } else if (enteredOnce) {
      showOverlay(false);
    }
  }

  ['fullscreenchange', 'webkitfullscreenchange',
   'mozfullscreenchange', 'MSFullscreenChange'].forEach(function (ev) {
    document.addEventListener(ev, onFSChange);
  });

  /* ── Boot ───────────────────────────────────── */
  if (!isIOSSafari) {
    /* All non-iOS-Safari browsers: attempt fullscreen immediately */
    enterFS();

    document.addEventListener('click', function () {
      if (!isFS()) enterFS();
    }, { capture: true, passive: true });

    document.addEventListener('touchstart', function () {
      if (!isFS()) enterFS();
    }, { capture: true, passive: true });

    var hasConsent = false;
    try { hasConsent = sessionStorage.getItem(FS_KEY) === '1'; } catch (e) {}
    setTimeout(function () {
      if (!isFS()) showOverlay(false);
    }, hasConsent ? 1500 : 3000);

  } else if (!isStandalone) {
    /* iOS Safari in browser — can't do fullscreen, show Add to Home Screen guide */
    setTimeout(function () {
      showOverlay(true);
    }, 4000);
  }
  /* iOS standalone (PWA) — already fullscreen, no overlay needed */

  /* ── Screenshot video-layer deterrent ──────── */
  window.addEventListener('DOMContentLoaded', function () {
    var vid = document.createElement('video');
    vid.setAttribute('autoplay', '');
    vid.setAttribute('loop', '');
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('aria-hidden', 'true');
    vid.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'z-index:2147483640;pointer-events:none;' +
      'opacity:0.004;object-fit:cover;';
    vid.src = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCFEscoCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZU29mdU1vb1ZvcmJpcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    document.body.appendChild(vid);
    vid.play().catch(function () {});
  });

})();
