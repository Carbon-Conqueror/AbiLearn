/* AbiLearn PinchZoom v2 — global gesture system
 * Provides native pinch-to-zoom + pan for all images and the PDF modal.
 * No visible controls; gesture-only, GPU-accelerated via transform3d.
 *
 * IMAGES
 *   • Two-finger pinch → zoom in/out, anchored to the pinch midpoint
 *   • One-finger drag when scale > 1 → pan the zoomed image
 *   • Double-tap → toggle between 2.5× zoom and fit view
 *   • Scale < 1.2 on release → snaps back to 1× (prevents tiny mis-zooms)
 *   • touch-action: none while zoomed; restored on reset
 *
 * PDF MODAL
 *   • Two-finger pinch on the PDF modal body → live CSS transform preview
 *   • On release → dispatches `abl-pdf-zoom` event so app.js re-renders
 *     the canvases at the new _pdfZoom value (scroll position preserved)
 */
(function () {
  'use strict';

  /* ── CONFIG ────────────────────────────────────── */
  var IMG_MIN    = 1.0;
  var IMG_MAX    = 5.0;
  var PDF_MIN    = 0.4;
  var PDF_MAX    = 4.0;
  var DBL_MS     = 270;    // double-tap detection window (ms)
  var DBL_ZOOM   = 2.5;    // zoom level applied by a double-tap
  var SNAP_MIN   = 1.2;    // scale below this snaps back to 1 on release
  var EDGE_GUARD = 60;     // minimum pixels of image that must stay on screen

  /* ── MATH HELPERS ──────────────────────────────── */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function pDist(a, b) {
    var dx = b.clientX - a.clientX, dy = b.clientY - a.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pMid(a, b) {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  function mapVals(obj) {
    return Object.keys(obj).map(function (k) { return obj[k]; });
  }

  /* ══════════════════════════════════════════════════
     IMAGE ZOOM ENGINE
  ══════════════════════════════════════════════════ */

  /* Per-element zoom state, keyed by the <img> element itself. */
  var imgData = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;

  function getState(el) {
    if (!imgData) return null;
    if (!imgData.has(el)) {
      imgData.set(el, {
        scale: 1, tx: 0, ty: 0,
        ptrs:  {},        /* active pointer map: id → {clientX, clientY} */
        gs:    null,      /* gesture-start snapshot (set when pinch begins) */
        panning: false,
        panSX: 0, panSY: 0, panSTx: 0, panSTy: 0,
        lastTap: 0, ltX: 0, ltY: 0,
        raf: false,
      });
    }
    return imgData.get(el);
  }

  /* Apply the current state to the DOM element (called via rAF). */
  function applyTransform(s, el) {
    s.raf = false;
    if (s.scale <= 1.005) {
      s.scale = 1; s.tx = 0; s.ty = 0;
      el.style.transform      = '';
      el.style.transformOrigin = '';
      el.style.zIndex          = '';
      el.style.position        = '';
      el.style.willChange      = '';
      el.style.touchAction     = 'pan-x pan-y';
    } else {
      el.style.transform       = 'translate3d(' + s.tx + 'px,' + s.ty + 'px,0) scale(' + s.scale + ')';
      el.style.transformOrigin = '0 0';
      el.style.zIndex          = '500';
      el.style.position        = 'relative';
      el.style.willChange      = 'transform';
      el.style.touchAction     = 'none';
    }
  }

  function scheduleApply(s, el) {
    if (s.raf) return;
    s.raf = true;
    requestAnimationFrame(function () { applyTransform(s, el); });
  }

  /* Constrain tx/ty so the image stays partly within the viewport. */
  function constrain(s, el) {
    var cw = window.innerWidth, ch = window.innerHeight;
    /* Natural position of the element origin (without our translation) */
    var nl = s.gs ? s.gs.nl : (el.getBoundingClientRect().left - s.tx);
    var nt = s.gs ? s.gs.nt : (el.getBoundingClientRect().top  - s.ty);
    var ew = el.offsetWidth  * s.scale;
    var eh = el.offsetHeight * s.scale;
    s.tx = clamp(s.tx, -(nl + ew - EDGE_GUARD), cw - nl - EDGE_GUARD);
    s.ty = clamp(s.ty, -(nt + eh - EDGE_GUARD), ch - nt - EDGE_GUARD);
  }

  /* ── Image event handlers ───────────────────────── */

  function onImgDown(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;

    el.setPointerCapture(e.pointerId);
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var pts   = mapVals(s.ptrs);
    var count = pts.length;

    if (count === 1) {
      /* Double-tap detection */
      var now = Date.now();
      var ddx = e.clientX - s.ltX, ddy = e.clientY - s.ltY;
      var tapDist = Math.sqrt(ddx * ddx + ddy * ddy);
      if (now - s.lastTap < DBL_MS && tapDist < 30) {
        e.preventDefault();
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        delete s.ptrs[e.pointerId];
        s.lastTap = 0;
        if (s.scale > 1.1) {
          /* Reset to fit */
          s.scale = 1;
        } else {
          /* Zoom into tap point */
          var rect  = el.getBoundingClientRect();
          var nl    = rect.left - s.tx;
          var nt    = rect.top  - s.ty;
          var lx    = (e.clientX - nl - s.tx) / s.scale;
          var ly    = (e.clientY - nt - s.ty) / s.scale;
          s.scale   = DBL_ZOOM;
          s.tx      = e.clientX - nl - lx * s.scale;
          s.ty      = e.clientY - nt - ly * s.scale;
          s.gs      = { nl: nl, nt: nt };
          constrain(s, el);
        }
        scheduleApply(s, el);
        return;
      }
      s.lastTap = now;
      s.ltX     = e.clientX;
      s.ltY     = e.clientY;

      /* Start single-finger pan if already zoomed in */
      if (s.scale > 1.05) {
        s.panning = true;
        s.panSX   = e.clientX; s.panSY  = e.clientY;
        s.panSTx  = s.tx;      s.panSTy = s.ty;
        e.preventDefault();
      }
    }

    if (count === 2) {
      s.panning = false;
      var rect2 = el.getBoundingClientRect();
      s.gs = {
        d:     pDist(pts[0], pts[1]),
        scale: s.scale,
        mid:   pMid(pts[0], pts[1]),
        tx0:   s.tx,  ty0: s.ty,
        nl:    rect2.left - s.tx,
        nt:    rect2.top  - s.ty,
      };
      /* Prevent browser scroll / native zoom for this gesture */
      el.style.touchAction = 'none';
      e.preventDefault();
    }
  }

  function onImgMove(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s || !s.ptrs[e.pointerId]) return;
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var pts = mapVals(s.ptrs);

    if (pts.length >= 2 && s.gs && s.gs.d) {
      /* ── Pinch ── */
      e.preventDefault();
      var currD = pDist(pts[0], pts[1]);
      var currM = pMid(pts[0], pts[1]);
      var ns    = clamp(s.gs.scale * (currD / s.gs.d), IMG_MIN, IMG_MAX);

      /*
       * Anchor math (transform-origin: 0 0):
       *   screen(lx,ly) = naturalOrigin + (tx,ty) + (lx,ly)*scale
       * Content point under gesture-start midpoint:
       *   lx0 = (smx - nl - tx0) / scale0
       * New translation so that point appears under current midpoint:
       *   tx1 = currM.x - nl - lx0 * newScale
       */
      var lx0 = (s.gs.mid.x - s.gs.nl - s.gs.tx0) / s.gs.scale;
      var ly0 = (s.gs.mid.y - s.gs.nt - s.gs.ty0) / s.gs.scale;
      s.scale  = ns;
      s.tx     = currM.x - s.gs.nl - lx0 * ns;
      s.ty     = currM.y - s.gs.nt - ly0 * ns;
      constrain(s, el);
      scheduleApply(s, el);

    } else if (pts.length === 1 && s.panning) {
      /* ── One-finger pan (while zoomed) ── */
      e.preventDefault();
      s.tx = s.panSTx + (e.clientX - s.panSX);
      s.ty = s.panSTy + (e.clientY - s.panSY);
      constrain(s, el);
      scheduleApply(s, el);
    }
  }

  function onImgUp(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;
    delete s.ptrs[e.pointerId];
    var pts = mapVals(s.ptrs);
    if (pts.length < 2) s.gs = null;
    if (pts.length === 0) {
      s.panning = false;
      /* Snap back to 1 if barely zoomed */
      if (s.scale < SNAP_MIN) {
        s.scale = 1;
        scheduleApply(s, el);
      }
    }
  }

  /* ── Exclude UI chrome from zoom ─────────────────── */
  var SKIP_SEL = [
    'button', 'nav', 'header',
    '.nav-logo', '[class*="logo"]', '[class*="icon"]',
    '[class*="avatar"]', '[class*="badge"]',
    '.abl-ss-guard', '#abl-watermark', '#abl-community-cta',
  ].join(',');

  function attachImg(el) {
    if (!el || el._ablZ) return;
    /* Skip navigation chrome, icons, logos */
    try { if (el.closest(SKIP_SEL)) return; } catch (_) {}
    var cls = (el.className && typeof el.className === 'string') ? el.className : '';
    if (/(icon|logo|avatar|badge|guard|watermark)/i.test(cls)) return;
    if (/(icon|logo|avatar)/i.test(el.src || '')) return;

    el._ablZ      = true;
    el.draggable  = false;
    el.style.touchAction = 'pan-x pan-y';
    el.addEventListener('pointerdown',   onImgDown, { passive: false });
    el.addEventListener('pointermove',   onImgMove, { passive: false });
    el.addEventListener('pointerup',     onImgUp);
    el.addEventListener('pointercancel', onImgUp);
  }

  function attachAllImgs() {
    document.querySelectorAll('img').forEach(attachImg);
  }

  /* Watch for images added dynamically (SPA navigations, lazy-loaded content). */
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') {
            attachImg(n);
          } else if (n.querySelectorAll) {
            n.querySelectorAll('img').forEach(attachImg);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ══════════════════════════════════════════════════
     PDF MODAL PINCH ZOOM
  ══════════════════════════════════════════════════ */

  var pdfState = {
    ptrs:     {},
    gs:       null,   /* gesture-start snapshot */
    active:   false,
    cssRatio: 1,      /* current CSS scale ratio (relative to _pdfZoom) */
  };

  function onPdfDown(e) {
    var body = e.currentTarget;
    body.setPointerCapture(e.pointerId);
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var pts = mapVals(pdfState.ptrs);

    if (pts.length === 2 && !pdfState.active) {
      pdfState.active = true;
      var bRect = body.getBoundingClientRect();
      pdfState.gs = {
        d:         pDist(pts[0], pts[1]),
        mid:       pMid(pts[0], pts[1]),
        bLeft:     bRect.left,
        bTop:      bRect.top,
        scrollTop: body.scrollTop,
        scrollH:   body.scrollHeight,
        /* Capture current PDF zoom level from app.js global */
        zoomVal:   (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1,
      };
      pdfState.cssRatio = 1;
      body.style.touchAction = 'none';
      e.preventDefault();
    }
  }

  function onPdfMove(e) {
    if (!pdfState.active || !pdfState.gs) return;
    var body = e.currentTarget;
    if (!pdfState.ptrs[e.pointerId]) return;
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var pts = mapVals(pdfState.ptrs);
    if (pts.length < 2) return;
    e.preventDefault();

    var currD = pDist(pts[0], pts[1]);
    var currM = pMid(pts[0], pts[1]);
    var ratio  = clamp(currD / pdfState.gs.d, 0.2, 5.0);
    pdfState.cssRatio = ratio;

    /*
     * Set transform-origin to the CURRENT pinch midpoint (not just the
     * gesture-start midpoint) so the view re-anchors as fingers move.
     * The origin is relative to the body element, accounting for scroll.
     */
    var ox = currM.x - pdfState.gs.bLeft;
    var oy = currM.y - pdfState.gs.bTop + body.scrollTop;
    body.style.transformOrigin = ox + 'px ' + oy + 'px';
    body.style.transform       = 'scale(' + ratio + ')';
  }

  function onPdfUp(e) {
    delete pdfState.ptrs[e.pointerId];
    var remaining = mapVals(pdfState.ptrs).length;

    /* End gesture when fewer than 2 fingers remain */
    if (pdfState.active && remaining < 2) {
      pdfState.active = false;
      var body = e.currentTarget;
      var gs   = pdfState.gs;
      pdfState.gs = null;

      var ratio       = pdfState.cssRatio;
      pdfState.cssRatio = 1;
      body.style.touchAction = 'pan-y';

      if (!gs) {
        body.style.transform      = '';
        body.style.transformOrigin = '';
        return;
      }

      /* Compute target zoom and fractional scroll position to preserve */
      var newZoom     = clamp(gs.zoomVal * ratio, PDF_MIN, PDF_MAX);
      var scrollRatio = gs.scrollH > 0 ? gs.scrollTop / gs.scrollH : 0;

      /* Remove CSS transform then ask app.js to re-render */
      body.style.transform       = '';
      body.style.transformOrigin = '';

      document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
        detail: { zoom: newZoom, scrollRatio: scrollRatio }
      }));
    }
  }

  function attachPdf(body) {
    if (!body || body._ablPdfZ) return;
    body._ablPdfZ = true;
    body.style.touchAction = 'pan-y';
    body.addEventListener('pointerdown',   onPdfDown, { passive: false });
    body.addEventListener('pointermove',   onPdfMove, { passive: false });
    body.addEventListener('pointerup',     onPdfUp);
    body.addEventListener('pointercancel', onPdfUp);
  }

  /* ══════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════ */

  attachAllImgs();

  /* Re-scan images after SPA page transitions */
  document.addEventListener('abl-navigate', attachAllImgs);

  /* Public API consumed by app.js */
  window.ablPinchZoom = {
    attachImg:     attachImg,
    attachAllImgs: attachAllImgs,
    attachPdf:     attachPdf,
  };

}());
