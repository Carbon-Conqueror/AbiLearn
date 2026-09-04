/* AbiLearn Fullscreen Manager — keeps the site fullscreen at all times */
(function () {
  var OVERLAY_ID = 'abl-fs-overlay';

  function isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
  }

  function requestFS() {
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    if (fn) {
      fn.call(el).catch(function () { showOverlay(); });
    }
  }

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    var div = document.createElement('div');
    div.id = OVERLAY_ID;
    div.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:99999',
      'display:flex', 'flex-direction:column', 'align-items:center', 'justify-content:center',
      'background:rgba(15,23,42,0.93)', 'cursor:pointer', 'user-select:none'
    ].join(';');
    div.innerHTML =
      '<div style="font-size:3rem;margin-bottom:1rem">⛶</div>' +
      '<div style="color:#fff;font-size:1.25rem;font-weight:700;margin-bottom:.5rem">Tap to go fullscreen</div>' +
      '<div style="color:rgba(255,255,255,.6);font-size:.9rem">AbiLearn works best in fullscreen mode</div>';
    div.addEventListener('click', function () {
      div.remove();
      requestFS();
    });
    document.body.appendChild(div);
  }

  function hideOverlay() {
    var el = document.getElementById(OVERLAY_ID);
    if (el) el.remove();
  }

  function onFSChange() {
    if (isFullscreen()) {
      hideOverlay();
    } else {
      /* Try to re-enter — succeeds if triggered by a user gesture in the same chain */
      requestFS();
    }
  }

  document.addEventListener('fullscreenchange', onFSChange);
  document.addEventListener('webkitfullscreenchange', onFSChange);
  document.addEventListener('mozfullscreenchange', onFSChange);

  /* On page load: if not already fullscreen, show the overlay */
  function init() {
    if (!isFullscreen()) showOverlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
