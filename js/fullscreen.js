/* AbiLearn Fullscreen Manager — silently keeps the site fullscreen */
(function () {
  function isFS() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement);
  }

  function enterFS() {
    if (isFS()) return;
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen;
    if (fn) fn.call(el).catch(function () {});
  }

  /* Try immediately — works when page has transient activation from a navigation click */
  enterFS();

  /* Silently re-enter on any click (covers first-load where no transient activation exists) */
  document.addEventListener('click', function () {
    if (!isFS()) enterFS();
  }, { capture: true, passive: true });

  /* When fullscreen exits (ESC), re-enter on the next click */
  function onFSChange() {
    if (!isFS()) {
      document.addEventListener('click', function onc() {
        enterFS();
        document.removeEventListener('click', onc, true);
      }, { capture: true, passive: true });
    }
  }
  document.addEventListener('fullscreenchange', onFSChange);
  document.addEventListener('webkitfullscreenchange', onFSChange);
  document.addEventListener('mozfullscreenchange', onFSChange);
})();
