/* AbiLearn — Focus Mode + Screenshot Layer */
(function () {
  'use strict';

  var FS_KEY = 'abl_fs'; // sessionStorage key — '1' = user has consented

  /* ── Fullscreen helpers ─────────────────────── */
  function isFS() {
    return !!(document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement);
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

  function showOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'abl-fs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="abl-fs-box">' +
        '<img class="abl-fs-logo" src="assets/logo.svg" alt="AbiLearn">' +
        '<h2 class="abl-fs-title">Focus Mode</h2>' +
        '<p class="abl-fs-sub">Study without distractions. Enter fullscreen to continue.</p>' +
        '<button id="abl-fs-btn" class="abl-fs-btn">Enter Fullscreen</button>' +
      '</div>';
    document.body.appendChild(overlay);
    document.getElementById('abl-fs-btn').addEventListener('click', function () {
      enterFS();
      // iOS Safari: fullscreen API not supported — dismiss gracefully
      setTimeout(function () { if (!isFS()) hideOverlay(); }, 800);
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
      // User pressed Escape — show overlay so they can re-enter
      showOverlay();
    }
  }

  ['fullscreenchange', 'webkitfullscreenchange',
   'mozfullscreenchange', 'MSFullscreenChange'].forEach(function (ev) {
    document.addEventListener(ev, onFSChange);
  });

  /* ── Boot: enter as early as possible ──────── */
  // The inline <head> script already attempted enterFS() if consent exists.
  // This call covers the case where fullscreen.js loads before DOMContentLoaded
  // and the head script was absent / consent not yet stored.
  enterFS();

  // Re-enter silently on every click/touch (covers Escape-then-interact flow)
  document.addEventListener('click', function () {
    if (!isFS()) enterFS();
  }, { capture: true, passive: true });

  document.addEventListener('touchstart', function () {
    if (!isFS()) enterFS();
  }, { capture: true, passive: true });

  /* ── Overlay delay logic ────────────────────── */
  // If the user has previously consented (consent flag set), give the auto-entry
  // plenty of time before showing the overlay — it will succeed silently.
  // If this is the very first visit (no consent yet), show overlay sooner.
  var hasConsent = false;
  try { hasConsent = sessionStorage.getItem(FS_KEY) === '1'; } catch (e) {}

  setTimeout(function () {
    if (!isFS()) showOverlay();
  }, hasConsent ? 1500 : 3000);

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
    // Tiny blank transparent webm (inline data URI)
    vid.src = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCFEscoCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZU29mdU1vb1ZvcmJpcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    document.body.appendChild(vid);
    vid.play().catch(function () {});
  });

})();
