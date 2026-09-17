/* AbiLearn — Focus Mode + Screenshot Layer */
(function () {
  'use strict';

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

  /* ── Focus overlay ──────────────────────────── */
  var overlay = null;

  function showOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'abl-fs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML =
      '<div class="abl-fs-box">' +
        '<div class="abl-fs-icon">📚</div>' +
        '<h2 class="abl-fs-title">Focus Mode</h2>' +
        '<p class="abl-fs-sub">Tap to enter fullscreen and study without distractions.</p>' +
        '<button id="abl-fs-btn" class="abl-fs-btn">Enter Fullscreen</button>' +
      '</div>';
    document.body.appendChild(overlay);
    document.getElementById('abl-fs-btn').addEventListener('click', function () {
      enterFS();
      // On iOS Safari fullscreen is not supported — dismiss overlay anyway
      setTimeout(function () { if (!isFS()) hideOverlay(); }, 600);
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
      hideOverlay();
    } else if (enteredOnce) {
      showOverlay();
    }
  }

  ['fullscreenchange','webkitfullscreenchange',
   'mozfullscreenchange','MSFullscreenChange'].forEach(function (ev) {
    document.addEventListener(ev, onFSChange);
  });

  /* Try immediately (works when page loaded via navigation click) */
  enterFS();

  /* Re-enter / show overlay on any interaction if not fullscreen */
  document.addEventListener('click', function () {
    if (!isFS()) { enterFS(); }
  }, { capture: true, passive: true });

  document.addEventListener('touchstart', function () {
    if (!isFS()) { enterFS(); }
  }, { capture: true, passive: true });

  /* Show focus overlay after 3 s if still not fullscreen */
  setTimeout(function () {
    if (!isFS()) showOverlay();
  }, 3000);

  /* ── Screenshot video-layer deterrent ──────── */
  /* A near-invisible autoplay video overlaid on the page causes many
     system-level screenshot tools (Win DXGI, OBS game capture) to capture
     the video layer as a black frame instead of the page content. */
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
    // Tiny blank 1×1 transparent webm (inline data URI, ~80 bytes)
    vid.src = 'data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCFEscoCkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZU29mdU1vb1ZvcmJpcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    document.body.appendChild(vid);
    vid.play().catch(function () {});
  });

})();
