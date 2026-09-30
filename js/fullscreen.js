/* AbiLearn — Focus Mode prompt v5 */
(function () {
  'use strict';

  /* ── Device detection ───────────────────────── */
  var isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isIOSSafari = isIOS &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var isStandalone = !!(navigator.standalone ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches);
  var isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /* Skip on desktop and standalone */
  if (!isMobile) return;
  if (isStandalone) return;

  /* ── Fullscreen API ─────────────────────────── */
  function canFS() {
    var el = document.documentElement;
    return !!(el.requestFullscreen || el.webkitRequestFullscreen ||
              el.mozRequestFullScreen || el.msRequestFullscreen);
  }

  function enterFS() {
    var el = document.documentElement;
    var fn = el.requestFullscreen || el.webkitRequestFullscreen ||
             el.mozRequestFullScreen || el.msRequestFullscreen;
    if (fn) fn.call(el).catch(function () {});
  }

  /* ── Dismiss overlay ────────────────────────── */
  function dismiss() {
    var el = document.getElementById('abl-focus-prompt');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function () { el.remove(); }, 240);
  }

  /* ── Build the prompt ───────────────────────── */
  function showPrompt() {
    if (document.getElementById('abl-focus-prompt')) return;

    var overlay = document.createElement('div');
    overlay.id = 'abl-focus-prompt';
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:99999;' +
      'background:rgba(0,0,0,.62);' +
      'display:flex;align-items:center;justify-content:center;' +
      'padding:1.5rem;box-sizing:border-box;' +
      '-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);' +
      'opacity:0;transition:opacity .22s ease;';

    /* iOS Safari can't enter fullscreen in browser — show Add to Home Screen tip */
    var body = isIOSSafari
      ? '<p style="font-size:.83rem;color:var(--muted,#888);margin:0 0 1.5rem;line-height:1.6;">' +
          'Tap <strong>Share ⬆</strong> then <strong>Add to Home Screen</strong> ' +
          'for a distraction-free experience on iPhone.' +
        '</p>'
      : '<p style="font-size:.83rem;color:var(--muted,#888);margin:0 0 1.5rem;line-height:1.6;">' +
          'Block out distractions and study in full-screen focus mode.' +
        '</p>';

    var yesLabel = isIOSSafari ? 'Got it' : 'Enable Fullscreen';

    overlay.innerHTML =
      '<div style="background:var(--surface,#fff);border-radius:22px;' +
        'padding:2rem 1.75rem 1.75rem;max-width:310px;width:100%;' +
        'text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.38);' +
        'border:1px solid var(--border,#E5E7EB);">' +

        /* Logo */
        '<img src="assets/logo.jpeg" alt="AbiLearn"' +
          ' style="width:56px;height:56px;border-radius:14px;object-fit:cover;' +
          'display:block;margin:0 auto .75rem;box-shadow:0 4px 14px rgba(91,71,222,.25);"' +
          ' onerror="this.style.display=\'none\'">' +

        /* Heading */
        '<h2 style="font-size:1.1rem;font-weight:800;color:var(--text,#111);' +
          'margin:0 0 .55rem;line-height:1.3;">Study without<br>distractions?</h2>' +

        body +

        /* YES */
        '<button id="abl-fp-yes" style="display:block;width:100%;padding:.8rem;' +
          'border-radius:12px;background:#5B47DE;color:#fff;border:none;' +
          'font-size:.92rem;font-weight:700;cursor:pointer;margin-bottom:.55rem;' +
          'font-family:inherit;min-height:48px;touch-action:manipulation;' +
          '-webkit-tap-highlight-color:transparent;">' +
          yesLabel +
        '</button>' +

        /* NO */
        '<button id="abl-fp-no" style="display:block;width:100%;padding:.72rem;' +
          'border-radius:12px;background:transparent;color:var(--muted,#6B7280);' +
          'border:1px solid var(--border,#E5E7EB);font-size:.86rem;font-weight:600;' +
          'cursor:pointer;font-family:inherit;min-height:48px;touch-action:manipulation;' +
          '-webkit-tap-highlight-color:transparent;">Not Now</button>' +

      '</div>';

    document.body.appendChild(overlay);

    /* Fade in */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    });

    document.getElementById('abl-fp-yes').addEventListener('click', function () {
      if (!isIOSSafari && canFS()) enterFS();
      dismiss();
    });
    document.getElementById('abl-fp-no').addEventListener('click', function () {
      dismiss();
    });
    /* Tap backdrop to dismiss */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss();
    });
  }

  /* ── Show after short delay ─────────────────── */
  function init() { setTimeout(showPrompt, 1400); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ── Re-prompt when user exits fullscreen ───── */
  function onFsChange() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      setTimeout(showPrompt, 800);
    }
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

})();
