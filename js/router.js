/* AbiLearn SPA Router
 * Intercepts internal <a> navigation and swaps <body> content via fetch()
 * so document.documentElement (the fullscreen root) is never destroyed.
 * Persistent UI elements (community CTA, fullscreen overlay, screenshot guard,
 * progress bar) are detached before the swap and re-attached after.
 */
(function () {
  'use strict';

  /* ── Persistent element IDs ─────────────────────────────────────── */
  /* These elements are created by other scripts and must survive swaps */
  var PERSIST_IDS = [
    'abl-community-cta',   // community.js  — floating widget
    'abl-fs-overlay',      // fullscreen.js — focus mode overlay
    'abl-ss-guard',        // protect.js    — screenshot guard
    'abl-fs-exit-btn',     // fullscreen.js — exit fullscreen button
    'abl-watermark',       // watermark.js  — repeating watermark overlay
    'abl-copyright',       // watermark.js  — copyright footer notice
    'abl-print-notice',    // watermark.js  — print shield
    'abl-spa-bar'          // router.js     — progress bar (self)
  ];

  /* ── Route classification ───────────────────────────────────────── */
  function isSPATarget(href) {
    if (!href) return false;
    try {
      var url = new URL(href, location.origin);
      if (url.origin !== location.origin) return false;          // external
      var p = url.pathname;
      if (/auth\.html($|\?)/.test(p)) return false;             // auth: full reload
      if (!/\.(html?)$/.test(p) && p !== '/') return false;     // non-html
      return true;
    } catch (e) { return false; }
  }

  /* ── Progress bar ───────────────────────────────────────────────── */
  var _bar = document.createElement('div');
  _bar.id = 'abl-spa-bar';
  document.body.appendChild(_bar);

  var _barTimer;
  function progress(pct) {
    clearTimeout(_barTimer);
    _bar.style.width = pct + '%';
    _bar.style.opacity = '1';
    if (pct >= 100) {
      _barTimer = setTimeout(function () {
        _bar.style.opacity = '0';
        setTimeout(function () { _bar.style.width = '0'; _bar.style.opacity = ''; }, 300);
      }, 200);
    }
  }

  /* ── Persistent element save / restore ─────────────────────────── */
  function detach() {
    var saved = [];
    PERSIST_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { saved.push(el); el.remove(); }
    });
    /* Screenshot-deterrent video — no stable ID, identified by position */
    document.querySelectorAll('body > video[aria-hidden="true"]').forEach(function (v) {
      saved.push(v); v.remove();
    });
    return saved;
  }

  function reattach(saved) {
    saved.forEach(function (el) { document.body.appendChild(el); });
  }

  /* ── Inline script re-execution ─────────────────────────────────── */
  /* External scripts shared across all pages (app.js, community.js, …) are
   * already in memory — skip them.  Page-specific data scripts (maths-mcqs.js,
   * science-mcqs.js, social-mcqs-final.js, …) are NOT present on every page,
   * so we load any that are missing before running the inline init call. */
  function _loadedSrcs() {
    var set = {};
    document.querySelectorAll('script[src]').forEach(function (s) {
      set[s.getAttribute('src').split('?')[0]] = true;
    });
    return set;
  }

  function runScripts(parsedBody, done) {
    /* Collect external srcs that are new to this page */
    var loaded = _loadedSrcs();
    var toLoad = [];
    parsedBody.querySelectorAll('script[src]').forEach(function (s) {
      var src = s.getAttribute('src');
      if (!loaded[src.split('?')[0]]) toLoad.push(src);
    });

    function runInline() {
      parsedBody.querySelectorAll('script:not([src])').forEach(function (s) {
        var ns = document.createElement('script');
        if (s.type) ns.type = s.type;
        ns.textContent = s.textContent;
        document.body.appendChild(ns);
        ns.remove();
      });
      done();
    }

    if (!toLoad.length) { runInline(); return; }

    var remaining = toLoad.length;
    toLoad.forEach(function (src) {
      var ns = document.createElement('script');
      ns.src = src;
      ns.onload = ns.onerror = function () {
        remaining--;
        if (remaining === 0) runInline();
      };
      document.head.appendChild(ns);
    });
  }

  /* ── Core navigate ──────────────────────────────────────────────── */
  var _busy = false;
  var _currentHref = location.href;

  function navigate(href, push) {
    if (_busy) return;
    try { href = new URL(href, location.origin).href; } catch (e) { return; }
    if (href === _currentHref && push) return;

    _busy = true;
    progress(20);

    fetch(href, { credentials: 'same-origin', cache: 'default' })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        progress(55);
        return r.text();
      })
      .then(function (html) {
        var nd = new DOMParser().parseFromString(html, 'text/html');

        /* ① Update <title> */
        document.title = nd.title;

        /* ② Swap page-specific <style> blocks from <head>
         * Skip persistent styles injected at runtime (community CSS, protect
         * inline style) — they don't appear in the fetched page HTML so
         * removing them would strip the community widget's position:fixed. */
        var PERSIST_STYLE_IDS = ['abl-community-css', 'abl-protect', 'abl-print-css'];
        document.querySelectorAll('head style').forEach(function (s) {
          if (PERSIST_STYLE_IDS.indexOf(s.id) === -1) s.remove();
        });
        nd.querySelectorAll('head style').forEach(function (s) {
          if (PERSIST_STYLE_IDS.indexOf(s.id) !== -1) return; // already present
          var ns = document.createElement('style');
          if (s.id) ns.id = s.id;
          ns.textContent = s.textContent;
          document.head.appendChild(ns);
        });

        progress(75);

        /* ③ Save persistent elements before touching <body> */
        var saved = detach();

        /* ④ Swap <body> content */
        var nb = nd.body;
        document.body.innerHTML = nb.innerHTML;
        document.body.className = nb.className;
        document.body.removeAttribute('id');
        if (nb.id) document.body.id = nb.id;

        /* ⑤ Restore persistent elements */
        reattach(saved);

        /* ⑥ Load page-specific external scripts then run inline init */
        runScripts(nb, function () {
          /* ⑦ Push / replace history */
          if (push) history.pushState({ href: href }, document.title, href);
          _currentHref = href;

          /* ⑧ Scroll to top unless URL has a hash anchor */
          try { if (!new URL(href).hash) window.scrollTo(0, 0); }
          catch (e) { window.scrollTo(0, 0); }

          /* ⑨ Notify other scripts (watermark, etc.) of route change */
          try {
            document.dispatchEvent(new CustomEvent('abl-navigate', { detail: { href: href } }));
          } catch (e) {}

          progress(100);
          _busy = false;
        });
      })
      .catch(function () {
        /* Network error or unexpected response — fall back gracefully */
        location.href = href;
      });
  }

  /* ── Redefine guardNav to use the SPA router ────────────────────── */
  /* auth-stub.js defines guardNav as `location.href = url; return false`
   * which causes a full reload. We override it here (router.js loads last)
   * to route internal pages through the SPA and keep external / auth links
   * as real navigation. */
  window.guardNav = function (event, url) {
    if (!url) return false;
    if (isSPATarget(url)) {
      event.preventDefault();
      navigate(new URL(url, location.origin).href, true);
    } else {
      location.href = url;
    }
    return false;
  };

  /* ── Global click interceptor ───────────────────────────────────── */
  /* Catches plain <a href> links (those without onclick="guardNav(...)") */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;           // guardNav or other handler ran
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]');
    if (!a) return;
    if (a.target === '_blank' || a.target === '_top') return;
    if (!isSPATarget(a.href)) return;
    e.preventDefault();
    navigate(a.href, true);
  }, false);

  /* ── Browser Back / Forward ─────────────────────────────────────── */
  window.addEventListener('popstate', function () {
    navigate(location.href, false);
  });

  /* ── Expose for other scripts ───────────────────────────────────── */
  window.ablRouter = { navigate: navigate };

}());
