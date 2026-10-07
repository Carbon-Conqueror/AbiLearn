/* AbiLearn PinchZoom v6 — images, PDFs, and all visual content
 *
 * IMAGES / DIAGRAMS
 *   • Two-finger pinch → stable-anchor zoom with elastic resistance
 *   • One-finger drag while zoomed → pan with inertia/momentum
 *   • Ctrl/Cmd + mouse-wheel or natural trackpad pinch → zoom at cursor
 *   • Double-tap → 2.5× / fit toggle anchored to tap point
 *   • Smooth snap-back when released below SNAP_MIN
 *   • GPU-accelerated via translate3d + scale (transformOrigin: 0 0 always)
 *   • touch-action:none during 1-finger pan — no accidental page scroll
 *
 * PDF MODAL  (same feel as images)
 *   • Two-finger pinch → stable anchor + elastic resistance + CSS preview
 *   • Mid-point drift handled — pinch + pan simultaneously
 *   • One-finger pan after one pinch finger lifts (seamless transition)
 *   • Double-tap → 2.5× anchored to tap point + immediate CSS preview
 *   • Ctrl/Cmd + wheel → re-render at new zoom
 *   • On last finger release → dispatches `abl-pdf-zoom` for app.js re-render
 */
(function () {
  'use strict';

  /* ── CONFIG ───────────────────────────────────── */
  var IMG_MIN    = 1.0;
  var IMG_MAX    = 5.0;
  var PDF_MIN    = 0.4;
  var PDF_MAX    = 4.0;
  var DBL_MS     = 270;   /* ms window for double-tap */
  var DBL_ZOOM   = 2.5;
  var SNAP_MIN   = 1.15;  /* snap back to 1× if released below this */
  var EDGE_GUARD = 40;    /* px of element always kept on screen */

  /* ── MATH ─────────────────────────────────────── */
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function resist(v, lo, hi) {
    if (v < lo) return lo + (v - lo) * 0.25;
    if (v > hi) return hi + (v - hi) * 0.25;
    return v;
  }

  function pDist(a, b) {
    var dx = b.clientX - a.clientX, dy = b.clientY - a.clientY;
    return Math.sqrt(dx * dx + dy * dy);
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
        nl: 0, nt: 0,
        _elW: 0, _elH: 0,
        ptrs: {},
        pinching: false,
        prevDist: 0,
        prevMid: null,
        startDist: 0,
        startScale: 1,
        panning: false,
        panSX: 0, panSY: 0, panSTx: 0, panSTy: 0,
        /* Inertia */
        vx: 0, vy: 0,
        prevPanTx: 0, prevPanTy: 0,
        prevPanTime: 0,
        inertiaRaf: 0,
        /* Double-tap */
        lastTap: 0, ltX: 0, ltY: 0,
        raf: false,
      });
    }
    return imgData.get(el);
  }

  function captureNatural(s, el) {
    var r  = el.getBoundingClientRect();
    s.nl   = r.left - s.tx;   /* viewport left WITHOUT transform */
    s.nt   = r.top  - s.ty;   /* viewport top  WITHOUT transform */
    s._elW = el.offsetWidth;
    s._elH = el.offsetHeight;
  }

  /* Constrain tx/ty so EDGE_GUARD px of the element always stays visible */
  function constrain(s) {
    var cw = window.innerWidth, ch = window.innerHeight;
    var ew = s._elW * s.scale, eh = s._elH * s.scale;
    s.tx = clamp(s.tx, -(s.nl + ew - EDGE_GUARD), cw - s.nl - EDGE_GUARD);
    s.ty = clamp(s.ty, -(s.nt + eh - EDGE_GUARD), ch - s.nt - EDGE_GUARD);
  }

  function applyTransform(s, el, snap) {
    s.raf = false;
    if (s.scale <= 1.005) {
      s.scale = 1; s.tx = 0; s.ty = 0;
      if (snap) {
        el.style.transition      = 'transform 200ms cubic-bezier(.22,.68,0,1.1)';
        el.style.transform       = 'translate3d(0,0,0) scale(1)';
        el.style.transformOrigin = '0 0';
        setTimeout(function () {
          el.style.transition      = '';
          el.style.transform       = '';
          el.style.transformOrigin = '';
          el.style.zIndex          = '';
          el.style.position        = '';
          el.style.willChange      = '';
          el.style.touchAction     = 'pan-x pan-y';
        }, 220);
      } else {
        el.style.transition      = '';
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
      el.style.touchAction     = 'none';  /* prevent scroll during pan */
    }
  }

  function scheduleApply(s, el) {
    if (s.raf) return;
    s.raf = true;
    requestAnimationFrame(function () { applyTransform(s, el, false); });
  }

  /* ── Inertia ──────────────────────────────────── */
  function stopInertia(s) {
    if (s.inertiaRaf) { cancelAnimationFrame(s.inertiaRaf); s.inertiaRaf = 0; }
  }

  function startInertia(s, el) {
    stopInertia(s);
    var DECAY = 0.92;
    var STOP  = 0.5;  /* px/frame cutoff */
    if (Math.abs(s.vx) < STOP && Math.abs(s.vy) < STOP) return;

    function tick() {
      if (s.pinching || s.panning) { s.inertiaRaf = 0; return; }
      s.vx *= DECAY; s.vy *= DECAY;
      if (Math.abs(s.vx) < STOP && Math.abs(s.vy) < STOP) {
        s.vx = 0; s.vy = 0; s.inertiaRaf = 0; return;
      }
      s.tx += s.vx; s.ty += s.vy;
      constrain(s);
      if (s.scale < SNAP_MIN) {
        s.scale = 1; s.vx = 0; s.vy = 0;
        applyTransform(s, el, true);
        s.inertiaRaf = 0; return;
      }
      scheduleApply(s, el);
      s.inertiaRaf = requestAnimationFrame(tick);
    }
    s.inertiaRaf = requestAnimationFrame(tick);
  }

  /* ── Image pointer handlers ───────────────────── */

  function onImgDown(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;
    stopInertia(s);
    el.style.transition = '';
    /* Do NOT unconditionally capture — capturing on a plain tap prevents
     * click events from reaching parent <a> or <button> elements.
     * We only capture when we know we need it (pan, pinch, double-tap). */
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(s.ptrs);

    /* ── 1-finger ── */
    if (p.length === 1) {
      var now = Date.now();
      var ddx = e.clientX - s.ltX, ddy = e.clientY - s.ltY;

      /* Double-tap: capture and handle */
      if (now - s.lastTap < DBL_MS && Math.sqrt(ddx * ddx + ddy * ddy) < 30) {
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        delete s.ptrs[e.pointerId];
        s.lastTap = 0;
        captureNatural(s, el);
        if (s.scale > 1.1) {
          s.scale = 1; s.tx = 0; s.ty = 0;
          applyTransform(s, el, true);
        } else {
          var cpX = (e.clientX - s.nl - s.tx) / s.scale;
          var cpY = (e.clientY - s.nt - s.ty) / s.scale;
          s.scale = DBL_ZOOM;
          s.tx    = e.clientX - s.nl - cpX * s.scale;
          s.ty    = e.clientY - s.nt - cpY * s.scale;
          constrain(s);
          scheduleApply(s, el);
        }
        return;
      }
      s.lastTap = now; s.ltX = e.clientX; s.ltY = e.clientY;

      /* Pan when zoomed: capture so pointer tracked outside element */
      if (s.scale > 1.05) {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
        captureNatural(s, el);
        s.panning      = true;
        s.panSX        = e.clientX; s.panSY    = e.clientY;
        s.panSTx       = s.tx;      s.panSTy   = s.ty;
        s.prevPanTx    = s.tx;      s.prevPanTy = s.ty;
        s.prevPanTime  = now;
        s.vx = 0; s.vy = 0;
        el.style.touchAction = 'none'; /* block page scroll during pan */
        e.preventDefault();
      }
      /* Scale = 1 single tap: do nothing — let click bubble to parent */
    }

    /* ── 2-finger: start pinch, capture both pointers ── */
    if (p.length === 2) {
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      s.panning  = false;
      s.pinching = true;
      captureNatural(s, el);
      s.prevDist   = pDist(p[0], p[1]);
      s.startDist  = s.prevDist;
      s.startScale = s.scale;
      s.prevMid  = { x: (p[0].clientX + p[1].clientX) * 0.5,
                     y: (p[0].clientY + p[1].clientY) * 0.5 };
      el.style.touchAction = 'none';
      e.preventDefault();
    }

    /* Ignore 3rd+ fingers silently */
  }

  function onImgMove(e) {
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s || !s.ptrs[e.pointerId]) return;
    s.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(s.ptrs);

    /* ── Pinch ── */
    if (p.length >= 2 && s.pinching) {
      e.preventDefault();
      var currDist = pDist(p[0], p[1]);
      var currMid  = { x: (p[0].clientX + p[1].clientX) * 0.5,
                       y: (p[0].clientY + p[1].clientY) * 0.5 };

      if (s.prevDist > 0) {
        var rawScale = (s.startDist > 0)
          ? s.startScale * (currDist / s.startDist)
          : s.scale * (currDist / s.prevDist);
        /* Elastic resistance past limits */
        var newScale = (rawScale < IMG_MIN || rawScale > IMG_MAX)
                     ? resist(rawScale, IMG_MIN, IMG_MAX)
                     : rawScale;
        newScale = clamp(newScale, IMG_MIN * 0.82, IMG_MAX * 1.18);

        /* Anchor formula: content under prevMid appears at currMid
         * tx_new = currMid.x - (newScale/prevScale) * (prevMid.x - tx) */
        var r = newScale / s.scale;
        s.tx    = currMid.x - r * (s.prevMid.x - s.tx);
        s.ty    = currMid.y - r * (s.prevMid.y - s.ty);
        s.scale = newScale;
        constrain(s);
        scheduleApply(s, el);
      }
      s.prevDist = currDist;
      s.prevMid  = currMid;
      return;
    }

    /* ── Pan ── */
    if (p.length === 1 && s.panning) {
      e.preventDefault();
      var now  = Date.now();
      var dt   = now - s.prevPanTime;
      s.tx     = s.panSTx + (e.clientX - s.panSX);
      s.ty     = s.panSTy + (e.clientY - s.panSY);
      /* Track velocity for inertia (px/frame at 60fps) */
      if (dt > 0 && dt < 100) {
        s.vx = (s.tx - s.prevPanTx) / dt * 16;
        s.vy = (s.ty - s.prevPanTy) / dt * 16;
      }
      s.prevPanTx   = s.tx; s.prevPanTy   = s.ty;
      s.prevPanTime = now;
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

    /* ── Pinch ended ── */
    if (p.length < 2 && s.pinching) {
      s.pinching = false;
      s.prevDist = 0;
      s.prevMid  = null;
      /* Snap hard limits (elastic may have gone past them) */
      if (s.scale < IMG_MIN) { s.scale = IMG_MIN; }
      if (s.scale > IMG_MAX) { s.scale = IMG_MAX; constrain(s); }

      /* Transition seamlessly to pan if one finger remains */
      if (p.length === 1 && s.scale > 1.05) {
        captureNatural(s, el);
        s.panning     = true;
        s.panSX       = p[0].clientX; s.panSY    = p[0].clientY;
        s.panSTx      = s.tx;         s.panSTy   = s.ty;
        s.prevPanTx   = s.tx;         s.prevPanTy = s.ty;
        s.prevPanTime = Date.now();
        s.vx = 0; s.vy = 0;
        el.style.touchAction = 'none';
      }
    }

    /* ── Last finger lifted ── */
    if (p.length === 0) {
      if (s.panning) {
        s.panning = false;
        s.vx = clamp(s.vx, -28, 28);
        s.vy = clamp(s.vy, -28, 28);
        startInertia(s, el);
      }
      /* Snap back if barely zoomed */
      if (s.scale > 1.005 && s.scale < SNAP_MIN && !s.inertiaRaf) {
        s.scale = 1; s.tx = 0; s.ty = 0;
        applyTransform(s, el, true);
      }
    }
  }

  /* ── Ctrl/Cmd + wheel (desktop mouse + trackpad) ── */
  function onImgWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    var el = e.currentTarget;
    var s  = getState(el);
    if (!s) return;
    stopInertia(s);
    captureNatural(s, el);

    var dy = e.deltaMode === 1 ? e.deltaY * 20
           : e.deltaMode === 2 ? e.deltaY * 400
           : e.deltaY;
    var factor   = Math.pow(1.0015, -dy);
    var rawScale = s.scale * factor;
    var newScale = clamp(rawScale, IMG_MIN, IMG_MAX);

    var cpX = (e.clientX - s.nl - s.tx) / s.scale;
    var cpY = (e.clientY - s.nt - s.ty) / s.scale;
    var r   = newScale / s.scale;
    s.tx    = e.clientX - s.nl - cpX * newScale;
    s.ty    = e.clientY - s.nt - cpY * newScale;
    s.scale = newScale;
    constrain(s);

    if (s.scale <= 1.005) { s.scale = 1; s.tx = 0; s.ty = 0; }
    scheduleApply(s, el);
  }

  /* ── Exclusion list ───────────────────────────── */
  var SKIP_SEL = [
    'button', 'a', 'nav', 'header',
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

  /* One shared state object for the PDF modal body */
  var pdfState = {
    ptrs: {}, active: false,
    prevDist: 0, prevMid: null,
    cssScale: 1, tx: 0, ty: 0,
    startPdfZoom: 1,
    lastTap: 0, ltX: 0, ltY: 0,
    /* Stable pinch anchor (mirrors image engine) */
    startDist: 0, startCssScale: 1,
    /* 1-finger pan after one pinch finger lifts */
    panning: false,
    panSX: 0, panSY: 0, panSTx: 0, panSTy: 0,
  };

  function applyPdfTransform(body) {
    body.style.transformOrigin = '0 0';
    body.style.transform = 'translate3d(' + pdfState.tx + 'px,' + pdfState.ty + 'px,0) scale(' + pdfState.cssScale + ')';
  }

  function pdfConstrainTx(body) {
    var s  = pdfState.cssScale;
    var bw = body.clientWidth  || window.innerWidth;
    var bh = body.clientHeight || window.innerHeight;
    pdfState.tx = clamp(pdfState.tx, s > 1 ? -(s - 1) * bw : 0, 0);
    pdfState.ty = clamp(pdfState.ty, s > 1 ? -(s - 1) * bh : 0, 0);
  }

  function onPdfDown(e) {
    var body = e.currentTarget;
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(pdfState.ptrs);

    /* ── Double-tap: 2.5× anchored to tap point, or reset to 1× ── */
    if (p.length === 1 && !pdfState.active && !pdfState.panning) {
      var now = Date.now();
      var dx  = e.clientX - pdfState.ltX;
      var dy  = e.clientY - pdfState.ltY;
      if (now - pdfState.lastTap < DBL_MS && Math.sqrt(dx * dx + dy * dy) < 40) {
        pdfState.lastTap = 0;
        delete pdfState.ptrs[e.pointerId];
        e.preventDefault();
        var cur     = (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1;
        var isIn    = cur > 1.1;
        var newZoom = isIn ? 1.0 : 2.5;
        if (!isIn) {
          /* Immediate CSS preview anchored to tap point (transformOrigin 0 0) */
          var ratio = newZoom / cur;
          pdfState.cssScale = ratio;
          pdfState.tx = e.clientX * (1 - ratio);
          pdfState.ty = e.clientY * (1 - ratio);
          body.style.transformOrigin = '0 0';
          body.style.transform = 'translate3d(' + pdfState.tx + 'px,' + pdfState.ty + 'px,0) scale(' + ratio + ')';
        }
        var scrollRatio = body.scrollHeight > 0
          ? (body.scrollTop + body.clientHeight * 0.5) / body.scrollHeight : 0;
        document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
          detail: { zoom: newZoom, scrollRatio: scrollRatio }
        }));
        return;
      }
      pdfState.lastTap = now;
      pdfState.ltX = e.clientX;
      pdfState.ltY = e.clientY;
    }

    /* ── 2-finger: start pinch ── */
    if (p.length === 2 && !pdfState.active) {
      try { body.setPointerCapture(e.pointerId); } catch (_) {}
      pdfState.panning      = false;
      pdfState.active       = true;
      pdfState.cssScale     = 1;
      pdfState.tx           = 0;
      pdfState.ty           = 0;
      pdfState.startPdfZoom = (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1;
      var d = pDist(p[0], p[1]);
      pdfState.prevDist      = d;
      pdfState.startDist     = d;
      pdfState.startCssScale = 1;
      pdfState.prevMid = { x: (p[0].clientX + p[1].clientX) * 0.5,
                           y: (p[0].clientY + p[1].clientY) * 0.5 };
      body.style.transformOrigin = '0 0';
      body.style.transform       = 'translate3d(0,0,0) scale(1)';
      body.style.touchAction     = 'none';
      e.preventDefault();
    }
  }

  function onPdfMove(e) {
    var body = e.currentTarget;
    if (!pdfState.ptrs[e.pointerId]) return;
    pdfState.ptrs[e.pointerId] = { clientX: e.clientX, clientY: e.clientY };
    var p = pList(pdfState.ptrs);

    /* ── Pan (1-finger after one pinch finger lifts) ── */
    if (pdfState.panning && p.length === 1) {
      e.preventDefault();
      pdfState.tx = pdfState.panSTx + (e.clientX - pdfState.panSX);
      pdfState.ty = pdfState.panSTy + (e.clientY - pdfState.panSY);
      pdfConstrainTx(body);
      applyPdfTransform(body);
      return;
    }

    /* ── Pinch ── */
    if (!pdfState.active || p.length < 2) return;
    e.preventDefault();

    var currDist = pDist(p[0], p[1]);
    var currMid  = { x: (p[0].clientX + p[1].clientX) * 0.5,
                     y: (p[0].clientY + p[1].clientY) * 0.5 };

    if (pdfState.prevDist > 0) {
      /* Stable anchor: scale relative to startDist/startCssScale */
      var rawScale = (pdfState.startDist > 0)
        ? pdfState.startCssScale * (currDist / pdfState.startDist)
        : pdfState.cssScale * (currDist / pdfState.prevDist);
      /* Elastic resistance at pinch limits */
      var newCssScale = (rawScale < 0.1 || rawScale > 8.0)
        ? resist(rawScale, 0.1, 8.0)
        : rawScale;
      newCssScale = clamp(newCssScale, 0.082, 9.44);

      var r = newCssScale / pdfState.cssScale;
      pdfState.tx       = currMid.x - r * (pdfState.prevMid.x - pdfState.tx);
      pdfState.ty       = currMid.y - r * (pdfState.prevMid.y - pdfState.ty);
      pdfState.cssScale = newCssScale;
      applyPdfTransform(body);
    }
    pdfState.prevDist = currDist;
    pdfState.prevMid  = currMid;
  }

  function onPdfUp(e) {
    delete pdfState.ptrs[e.pointerId];
    var body = e.currentTarget;
    var p    = pList(pdfState.ptrs);

    /* ── Pan ended ── */
    if (pdfState.panning) {
      if (p.length === 0) {
        /* Last finger lifted — commit zoom */
        pdfState.panning = false;
        pdfState.active  = false;
        var newZoom = clamp(pdfState.startPdfZoom * pdfState.cssScale, PDF_MIN, PDF_MAX);
        var scrollRatio = body.scrollHeight > 0
          ? (body.scrollTop + body.clientHeight * 0.5) / body.scrollHeight : 0;
        pdfState.cssScale = 1; pdfState.tx = 0; pdfState.ty = 0;
        pdfState.prevDist = 0; pdfState.prevMid = null;
        body.style.touchAction = 'pan-x pan-y';
        document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
          detail: { zoom: newZoom, scrollRatio: scrollRatio }
        }));
      } else {
        pdfState.panning = false;
      }
      return;
    }

    if (!pdfState.active || p.length >= 2) return;

    /* ── Pinch: seamless transition to 1-finger pan ── */
    if (p.length === 1) {
      var rem = p[0];
      pdfState.panning = true;
      pdfState.panSX   = rem.clientX; pdfState.panSY   = rem.clientY;
      pdfState.panSTx  = pdfState.tx; pdfState.panSTy  = pdfState.ty;
      return;
    }

    /* ── Last finger lifted ── */
    pdfState.active = false;
    var newZoom2 = clamp(pdfState.startPdfZoom * pdfState.cssScale, PDF_MIN, PDF_MAX);
    var scrollRatio2 = body.scrollHeight > 0
      ? (body.scrollTop + body.clientHeight * 0.5) / body.scrollHeight : 0;
    pdfState.cssScale = 1; pdfState.tx = 0; pdfState.ty = 0;
    pdfState.prevDist = 0; pdfState.prevMid = null;
    body.style.touchAction = 'pan-x pan-y';
    document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
      detail: { zoom: newZoom2, scrollRatio: scrollRatio2 }
    }));
  }

  /* Ctrl+wheel zoom on PDF body — CSS preview during scroll, single re-render on idle */
  var _wt = null;       // debounce timer
  var _wzBase = null;   // rendered zoom at start of wheel session
  var _wzTarget = 1;    // accumulating target zoom
  var _wbody = null;    // body element reference

  function onPdfWheel(e) {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    var body = e.currentTarget;
    var cur  = (typeof _pdfZoom !== 'undefined') ? _pdfZoom : 1;
    var dy   = e.deltaMode === 1 ? e.deltaY * 20
             : e.deltaMode === 2 ? e.deltaY * 400
             : e.deltaY;

    if (!_wt) {
      /* First tick of a new wheel session — anchor to currently-rendered zoom */
      _wzBase   = cur;
      _wzTarget = cur;
      _wbody    = body;
    }

    _wzTarget = clamp(_wzTarget * Math.pow(1.003, -dy), PDF_MIN, PDF_MAX);

    /* Immediate CSS preview — scale relative to what's already on-screen */
    var cssScale = _wzTarget / _wzBase;
    body.style.transformOrigin = '50% 50%';
    body.style.transform       = 'scale(' + cssScale + ')';

    clearTimeout(_wt);
    _wt = setTimeout(function () {
      var b    = _wbody;
      var zoom = _wzTarget;
      var ratio = b && b.scrollHeight > 0
        ? (b.scrollTop + b.clientHeight * 0.5) / b.scrollHeight : 0;
      _wt = null; _wzBase = null; _wzTarget = 1; _wbody = null;
      document.dispatchEvent(new CustomEvent('abl-pdf-zoom', {
        detail: { zoom: zoom, scrollRatio: ratio }
      }));
    }, 220);
  }

  function attachPdf(body) {
    if (!body || body._ablPdfZ) return;
    body._ablPdfZ          = true;
    /* pan-x pan-y: allow natural scroll in both directions when PDF is wide */
    body.style.touchAction = 'pan-x pan-y';
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
