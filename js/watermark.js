/* AbiLearn — Watermark, Copyright Notice & Print Shield
 *
 * Three persistent layers injected on educational pages:
 *   #abl-watermark     — repeating diagonal canvas pattern, position:fixed
 *   #abl-copyright     — slim fixed footer attribution line
 *   #abl-print-notice  — full-page overlay shown only when printing
 *
 * All are pointer-events:none so they never block interaction.
 * The SPA router persists them across page navigations.
 * An abl-navigate event (fired by router.js) shows/hides based on route.
 */
(function () {
  'use strict';

  /* ── Pages that do NOT need a watermark ─────── */
  var NO_WM_PAGES = ['/', '/index.html', '/about.html', '/auth.html'];

  function _needsWatermark(href) {
    try {
      var p = new URL(href, location.origin).pathname;
      return !NO_WM_PAGES.some(function (x) { return p === x || p.endsWith(x); });
    } catch (e) { return true; }
  }

  /* ── Canvas watermark tile ───────────────────── */
  function _buildTile(dark) {
    var canvas = document.createElement('canvas');
    var W = 320, H = 130;
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var alpha = dark ? 0.038 : 0.048;
    var color = dark
      ? 'rgba(200,190,255,' + alpha + ')'
      : 'rgba(45,28,115,' + alpha + ')';

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-22 * Math.PI / 180);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = 'bold 13px system-ui,sans-serif';
    ctx.fillText('AbiLearn', 0, -9);
    ctx.font = '11px system-ui,sans-serif';
    ctx.fillText('Educational Content', 0, 9);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  /* ── Watermark overlay ───────────────────────── */
  var _wm = null;
  var _isDark = !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  function _setWmBg(dark) {
    if (!_wm) return;
    _wm.style.backgroundImage = 'url(' + _buildTile(dark) + ')';
  }

  function _initWatermark() {
    if (_wm) return;
    _wm = document.createElement('div');
    _wm.id = 'abl-watermark';
    _wm.setAttribute('aria-hidden', 'true');
    _wm.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background-repeat:repeat;background-size:320px 130px;' +
      'pointer-events:none;z-index:2000;' +
      'user-select:none;-webkit-user-select:none;';
    _setWmBg(_isDark);
    document.body.appendChild(_wm);

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        _isDark = e.matches;
        _setWmBg(_isDark);
      });
    }
  }

  /* ── Copyright notice ────────────────────────── */
  var _cr = null;

  function _initCopyright() {
    if (_cr) return;
    _cr = document.createElement('div');
    _cr.id = 'abl-copyright';
    _cr.setAttribute('aria-hidden', 'true');
    _cr.textContent =
      '© AbiLearn • All rights reserved • ' +
      'Educational content may not be reproduced or redistributed';
    _cr.style.cssText =
      'position:fixed;bottom:.3rem;left:50%;transform:translateX(-50%);' +
      'font-size:.58rem;letter-spacing:.04em;white-space:nowrap;' +
      'color:rgba(70,50,150,.3);' +
      'pointer-events:none;z-index:2001;' +
      'user-select:none;-webkit-user-select:none;';
    document.body.appendChild(_cr);
  }

  /* ── Print shield ────────────────────────────── */
  /* Overrides the existing @media print { body { display:none } } from
   * the per-page abl-protect style so we can show a notice instead of
   * a completely blank page when the user tries to print. */
  function _initPrintShield() {
    if (document.getElementById('abl-print-css')) return;

    var ps = document.createElement('style');
    ps.id = 'abl-print-css';
    ps.textContent =
      '@media print{' +
        'body{display:block!important;}' +
        'body>*:not(#abl-print-notice){display:none!important;}' +
        '#abl-print-notice{display:flex!important;}' +
      '}';
    document.head.appendChild(ps);

    var pn = document.createElement('div');
    pn.id = 'abl-print-notice';
    pn.setAttribute('aria-hidden', 'true');
    pn.style.cssText =
      'display:none;' +
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:#fff;z-index:2147483646;' +
      'align-items:center;justify-content:center;flex-direction:column;' +
      'font-family:system-ui,sans-serif;color:#333;text-align:center;' +
      'padding:3rem;box-sizing:border-box;';
    pn.innerHTML =
      '<div style="font-size:3rem;margin-bottom:1rem">🔒</div>' +
      '<h1 style="font-size:1.4rem;margin:0 0 .75rem;color:#3b28cc">' +
        '© AbiLearn — All Rights Reserved' +
      '</h1>' +
      '<p style="font-size:.95rem;color:#555;max-width:480px;line-height:1.65;margin:0 0 .5rem">' +
        'This educational content is protected by copyright.<br>' +
        'Printing or reproducing AbiLearn material is not permitted.' +
      '</p>' +
      '<p style="font-size:.8rem;color:#999;margin-top:.75rem">www.abilearn.co.in</p>';
    document.body.appendChild(pn);
  }

  /* ── Show / hide based on current route ─────── */
  function _update(href) {
    var show = _needsWatermark(href || location.href);
    if (_wm)  _wm.style.display  = show ? '' : 'none';
    if (_cr)  _cr.style.display  = show ? '' : 'none';
  }

  /* Listen for SPA route changes dispatched by router.js */
  document.addEventListener('abl-navigate', function (e) {
    _update(e.detail && e.detail.href);
  });

  /* ── Boot ────────────────────────────────────── */
  function _init() {
    _initWatermark();
    _initCopyright();
    _initPrintShield();
    _update();
  }

  if (document.body) {
    _init();
  } else {
    document.addEventListener('DOMContentLoaded', _init);
  }

}());
