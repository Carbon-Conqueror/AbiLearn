/* AbiLearn PinchZoom v4 — images, PDFs, and all visual content
 *
 * IMAGES / DIAGRAMS
 *   • Two-finger pinch → incremental zoom anchored to live midpoint
 *     spread apart  → scale UP  (zoom in)
 *     pinch together → scale DOWN (zoom out)
 *   • One-finger drag while zoomed → pan in all directions
 *   • Ctrl/Cmd + mouse-wheel or natural trackpad pinch → zoom at cursor
 *   • Double-tap → 2.5× / fit toggle
 *   • Smooth snap-back when released below SNAP_MIN
 *   • Boundary resistance at min/max scale
 *   • GPU-accelerated via translate3d + scale
 *
 * PDF MODAL
 *   • Two-finger pinch → live CSS scale preview
 *   • Ctrl/Cmd + wheel → zoom at cursor
 *   • On release → dispatches `abl-pdf-zoom` so app.js re-renders
 */
(function () {
  'use strict';

  /* ── CONFIG ───────────────────────────────────── */
  var IMG_MIN    = 1.0;
  var IMG_MAX    = 5.0;
  var PDF_MIN    = 0.4;
  var PDF_MAX    = 4.0;
  var DBL_MS     = 270;
  var DBL_ZOOM   = 2.5;
  var SNAP_MIN   = 1.15;
  var EDGE_GUARD = 50;

  /* ── MATH ─────────────────────────────────────── */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* Elastic resistance: value tries to go past limit, returns softened result */
  function resist(v, lo, hi) {
    if (v < lo) return lo + (v - lo) * 0.25;
    if (v > hi) return hi + (v - hi) * 0.25;
    return v;
  }

  function pDist(a, b) {
    var dx = b.clientX - a.clientX, dy = b.clientY - a.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pMid(a, b) {
    return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2 };
  }

  function pList(obj) {
    return Object.keys(obj).map(function (k) { return obj[k]; });
  }

  /* ══════════════════════════════════════════════════
     IMAGE / DIAGRAM ZOOM ENGINE
  ══════════════════════════════════════════════════ */

  var imgData = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;

  function getState(el) {
    if (!imgData) return null;
    if (!imgData.has(el)) {
      imgData.set(el, {
        scale: 1, tx: 0, ty: 0,
        ptrs: {},
        pinching: false,
        prevDist: 0,
        prevMid: null,
        nl: 0, nt: 0,
        _elW: 0, _elH: 0,
        panning: false,
        panSX: 0, panSY: 0, panSTx: 0, panSTy: 0,
        lastTap: 0, ltX: 0, ltY: 0,
        raf: false,
        snapping: false,
      });
    }
    return imgData.get(el);
  }

  function naturalOrigin(s, el) {
    var r = el.getBoundingClientRect();
    return { nl: r.left - s.tx, nt: r.top - s.ty };
  }

  function applyTransform(s, el, snap) {
    s.raf = false;
    if (s.scale <= 1.005) {
      s.scale = 1; s.tx = 0; s.ty = 0;
      if (snap) {
        /* Animate snap-back with a short CSS transition */
        el.style.transition     = 'transform 200ms cubic-bezier(.22,.68,0,1.1)';
        el.style.transform      = 'translate3d(0,0,0) scale(1)';
        el.style.transformOrigin = '0 0';
        /* Clean up transition after it fires */
        setTimeout(function () {
          el.style.transition     = '';
          el.style.transform      = '';
          el.style.transformOrigin = '';
          el.style.zIndex         = '';
          el.style.position       = '';
          el.style.willChange     = '';
          el.style.touchAction    = 'pan-x pan-y';
        }, 220);
      } else {
        el.style.transform       = '';
        el.style.transformOrigin = '';
        el.style.zIndex          = '';
        el.style.position        = '';
        el.style.willChange      = '';
        el.style.touchAction     = 'pan-x pan-y';
      }
    } else {
      el.style.transition      = '';
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
    requestAnimationFrame(function () { applyTransform(s, el, false); });
  }

  /* Clamp tx/ty so EDGE_GUARD px of the image always stays on screen. */
  function constrain(s) {
    var cw = window.innerWidth, ch = window.innerHeight;
    var ew = s._elW * s.scale, eh = s._elH * s.scale;
    s.tx = clamp(s.tx, -(s.nl + ew - EDGE_GUARD), cw - s.nl - EDGE_GUARD);
    s.ty = clamp(s.ty, -(s.nt + eh - EDGE_GUARD), ch - s.nt - EDGE_GUARD);
  }

  /* ── Image pointer handlers ───────────────────── */

  function onImgDown(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;
    /* Cancel any in-flight snap */
    el.style.transition = '';

    el.setPointerCapture(e.pointerId);
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(s.ptrs);

    if (p.length === 1) {
      var now = Date.now();
      var ddx = e.clientX - s.ltX, ddy = e.clientY - s.ltY;
      if (now - s.lastTap < DBL_MS && Math.sqrt(ddx * ddx + ddy * ddy) < 30) {
        e.preventDefault();
        try { el.releasePointerCapture(e.pointerId); } catch (_) {}
        delete s.ptrs[e.pointerId];
        s.lastTap = 0;
        if (s.scale > 1.1) {
          s.scale = 1;
          applyTransform(s, el, true);
        } else {
          var o   = naturalOrigin(s, el);
          var lx  = (e.clientX - o.nl - s.tx) / s.scale;
          var ly  = (e.clientY - o.nt - s.ty) / s.scale;
          s.scale = DBL_ZOOM;
          s.nl    = o.nl; s.nt = o.nt;
          s._elW  = el.offsetWidth; s._elH = el.offsetHeight;
          s.tx    = e.clientX - o.nl - lx * s.scale;
          s.ty    = e.clientY - o.nt - ly * s.scale;
          constrain(s);
          scheduleApply(s, el);
        }
        return;
      }
      s.lastTap = now; s.ltX = e.clientX; s.ltY = e.clientY;

      if (s.scale > 1.05) {
        var o2 = naturalOrigin(s, el);
        s.nl   = o2.nl; s.nt = o2.nt;
        s._elW = el.offsetWidth; s._elH = el.offsetHeight;
        s.panning = true;
        s.panSX   = e.clientX; s.panSY  = e.clientY;
        s.panSTx  = s.tx;      s.panSTy = s.ty;
        e.preventDefault();
      }
    }

    if (p.length === 2) {
      s.panning  = false;
      s.pinching = true;
      var o3 = naturalOrigin(s, el);
      s.nl   = o3.nl; s.nt = o3.nt;
      s._elW = el.offsetWidth; s._elH = el.offsetHeight;
      s.prevDist = pDist(p[0], p[1]);
      s.prevMid  = pMid(p[0], p[1]);
      el.style.touchAction = 'none';
      e.preventDefault();
    }
  }

  function onImgMove(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s || !s.ptrs[e.pointerId]) return;
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(s.ptrs);

    if (p.length >= 2 && s.pinching) {
      e.preventDefault();
      var currDist = pDist(p[0], p[1]);
      var currMid  = pMid(p[0], p[1]);
      if (s.prevDist > 0) {
        var ratio    = currDist / s.prevDist;
        /* Apply elastic resistance when pushing past limits */
        var raw      = s.scale * ratio;
        var newScale = raw < IMG_MIN ? resist(raw, IMG_MIN, IMG_MAX)
                     : raw > IMG_MAX ? resist(raw, IMG_MIN, IMG_MAX)
                     : raw;
        newScale = clamp(newScale, IMG_MIN * 0.85, IMG_MAX * 1.15);

        var cpX = (s.prevMid.x - s.nl - s.tx) / s.scale;
        var cpY = (s.prevMid.y - s.nt - s.ty) / s.scale;
        s.scale = newScale;
        s.tx    = currMid.x - s.nl - cpX * s.scale;
        s.ty    = currMid.y - s.nt - cpY * s.scale;
        constrain(s);
        scheduleApply(s, el);
      }
      s.prevDist = currDist;
      s.prevMid  = currMid;
      return;
    }

    if (p.length === 1 && s.panning) {
      e.preventDefault();
      s.tx = s.panSTx + (e.clientX - s.panSX);
      s.ty = s.panSTy + (e.clientY - s.panSY);
      constrain(s);
      scheduleApply(s, el);
    }
  }

  function onImgUp(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;
    delete s.ptrs[e.pointerId];
    var p = pList(s.ptrs);

    if (p.length < 2 && s.pinching) {
      s.pinching = false;
      s.prevDist = 0;
      s.prevMid  = null;
      /* Snap scale back to hard limits if rubber-banded past them */
      if (s.scale < IMG_MIN) { s.scale = IMG_MIN; }
      if (s.scale > IMG_MAX) { s.scale = IMG_MAX; constrain(s); }

      if (p.length === 1 && s.scale > 1.05) {
        var o  = naturalOrigin(s, el);
        s.nl   = o.nl; s.nt = o.nt;
        s._elW = el.offsetWidth; s._elH = el.offsetHeight;
        s.panning  = true;
        s.panSX    = p[0].clientX; s.panSY  = p[0].clientY;
        s.panSTx   = s.tx;         s.panSTy = s.ty;
      }
    }

    if (p.length === 0) {
      s.panning = false;
      if (s.scale > 1.005 && s.scale < SNAP_MIN) {
        s.scale = 1;
        applyTransform(s, el, true); /* animated snap */
      }
    }
  }

  /* ── Ctrl/Cmd + wheel (desktop mouse + trackpad pinch) ── */
  function onImgWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;

    /* Normalise delta across deltaMode values */
    var dy = e.deltaMode === 1 ? e.deltaY * 20
           : e.deltaMode === 2 ? e.deltaY * 400
           : e.deltaY;
    /* Trackpad: dy > 0 = pinch (zoom out), dy < 0 = spread (zoom in) */
    var factor = Math.pow(1.0015, -dy);
    var o = naturalOrigin(s, el);
    s.nl   = o.nl; s.nt = o.nt;
    s._elW = el.offsetWidth; s._elH = el.offsetHeight;

    var raw      = s.scale * factor;
    var newScale = clamp(raw, IMG_MIN, IMG_MAX);
    var cpX = (e.clientX - s.nl - s.tx) / s.scale;
    var cpY = (e.clientY - s.nt - s.ty) / s.scale;
    s.scale = newScale;
    s.tx    = e.clientX - s.nl - cpX * s.scale;
    s.ty    = e.clientY - s.nt - cpY * s.scale;
    constrain(s);

    /* Snap back if barely zoomed and not actively gesture-zooming */
    if (s.scale <= 1.005) { s.scale = 1; s.tx = 0; s.ty = 0; }

    scheduleApply(s, el);
  }

  /* ── Exclusion list ───────────────────────────── */
  var SKIP_SEL = [
    'button', 'nav', 'header',
    '.nav-logo', '[class*="logo"]', '[class*="icon"]',
    '[class*="avatar"]', '[class*="badge"]',
    '.abl-ss-guard', '#abl-community-cta',
  ].join(',');

  function attachImg(el) {
    if (!el || el._ablZ) return;
    try { if (el.closest(SKIP_SEL)) return; } catch (_) {}
    var cls = (el.className && typeof el.className === 'string') ? el.className : '';
    if (/(icon|logo|avatar|badge|guard)/i.test(cls)) return;
    if (/(icon|logo|avatar)/i.test(el.src || '')) return;

    el._ablZ             = true;
    el.draggable         = false;
    el.style.touchAction = 'pan-x pan-y';
    el.addEventListener('pointerdown',   onImgDown,  { passive: false });
    el.addEventListener('pointermove',   onImgMove,  { passive: false });
    el.addEventListener('pointerup',     onImgUp);
    el.addEventListener('pointercancel', onImgUp);
    el.addEventListener('wheel',         onImgWheel, { passive: false });
  }

  function attachAllImgs() {
    document.querySelectorAll('img').forEach(attachImg);
  }

  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.tagName === 'IMG') attachImg(n);
          else if (n.querySelectorAll) n.querySelectorAll('img').forEach(attachImg);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ══════════════════════════════════════════════════
     PDF MODAL PINCH ZOOM
  ══════════════════════════════════════════════════ */

  var pdfState = {
    ptrs: {}, active: false,
    prevDist: 0, prevMid: null,
    cssScale: 1, startPdfZoom: 1,
  };

  function onPdfDown(e) {
    var body = e.currentTarget;
    body.setPointerCapture(e.pointerId);
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(pdfState.ptrs);
    if (p.length === 2 && !pdfState.active) {
      pdfState.active       = true;
      pdfState.cssScale     = 1;
      pdfState.startPdfZoom = (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1;
      pdfState.prevDist     = pDist(p[0], p[1]);
      pdfState.prevMid      = pMid(p[0], p[1]);
      var bRect = body.getBoundingClientRect();
      var ox    = pdfState.prevMid.x - bRect.left;
      var oy    = pdfState.prevMid.y - bRect.top + body.scrollTop;
      body.style.transformOrigin = ox + 'px ' + oy + 'px';
      body.style.transform       = 'scale(1)';
      body.style.touchAction     = 'none';
      e.preventDefault();
    }
  }

  function onPdfMove(e) {
    if (!pdfState.active) return;
    var body = e.currentTarget;
    if (!pdfState.ptrs[e.pointerId]) return;
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(pdfState.ptrs);
    if (p.length < 2) return;
    e.preventDefault();

    var currDist = pDist(p[0], p[1]);
    var currMid  = pMid(p[0], p[1]);
    if (pdfState.prevDist > 0) {
      var ratio         = currDist / pdfState.prevDist;
      pdfState.cssScale = clamp(pdfState.cssScale * ratio, 0.15, 6.0);
      var bRect = body.getBoundingClientRect();
      var ox    = currMid.x - bRect.left;
      var oy    = currMid.y - bRect.top + body.scrollTop;
      body.style.transformOrigin = ox + 'px ' + oy + 'px';
      body.style.transform       = 'scale(' + pdfState.cssScale + ')';
    }
    pdfState.prevDist = currDist;
    pdfState.prevMid  = currMid;
  }

  function onPdfUp(e) {
    delete pdfState.ptrs[e.pointerId];
    if (pdfState.active && pList(pdfState.ptrs).length < 2) {
      pdfState.active = false;
      var body        = e.currentTarget;
      var newZoom     = clamp(pdfState.startPdfZoom * pdfState.cssScale, PDF_MIN, PDF_MAX);
      var scrollRatio = body.scrollHeight > 0 ? body.scrollTop / body.scrollHeight : 0;
      pdfState.cssScale = 1; pdfState.prevDist = 0; pdfState.prevMid = null;
      body.style.touchAction     = 'pan-y';
      body.style.transform       = '';
      body.style.transformOrigin = '';
      document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
        detail: { zoom: newZoom, scrollRatio: scrollRatio }
      }));
    }
  }

  /* Ctrl+wheel zoom on PDF body */
  function onPdfWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    var body = e.currentTarget;
    var cur  = (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1;
    var dy   = e.deltaMode === 1 ? e.deltaY * 20
             : e.deltaMode === 2 ? e.deltaY * 400
             : e.deltaY;
    var newZoom = clamp(cur * Math.pow(1.0015, -dy), PDF_MIN, PDF_MAX);
    var scrollRatio = body.scrollHeight > 0 ? body.scrollTop / body.scrollHeight : 0;
    document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
      detail: { zoom: newZoom, scrollRatio: scrollRatio }
    }));
  }

  function attachPdf(body) {
    if (!body || body._ablPdfZ) return;
    body._ablPdfZ          = true;
    body.style.touchAction = 'pan-y';
    body.addEventListener('pointerdown',   onPdfDown,  { passive: false });
    body.addEventListener('pointermove',   onPdfMove,  { passive: false });
    body.addEventListener('pointerup',     onPdfUp);
    body.addEventListener('pointercancel', onPdfUp);
    body.addEventListener('wheel',         onPdfWheel, { passive: false });
  }

  /* ══════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════ */

  attachAllImgs();
  document.addEventListener('abl-navigate', attachAllImgs);

  window.ablPinchZoom = {
    attachImg:     attachImg,
    attachAllImgs: attachAllImgs,
    attachPdf:     attachPdf,
  };

}());
