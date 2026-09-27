/* AbiLearn — Bottom Mobile Navigation v1 */
(function () {
  'use strict';

  var NAV_ID = 'abl-bottom-nav';

  /* SVG icons */
  var ICONS = {
    home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    book: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    pencil: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    bulb: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="3"/><path d="M12 6a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V19a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1.8C7.2 16.1 6 14.2 6 12a6 6 0 0 1 6-6z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>',
    person: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  var TABS = [
    {
      id: 'bn-home',
      label: 'Home',
      href: 'learn.html',
      icon: ICONS.home,
      match: function (p) { return /\/(learn(\.html)?)?$/.test(p) || p.endsWith('learn.html'); }
    },
    {
      id: 'bn-subjects',
      label: 'Subjects',
      href: 'maths.html',
      icon: ICONS.book,
      match: function (p) { return /(maths|science|english|social)\.html/.test(p); }
    },
    {
      id: 'bn-practice',
      label: 'Practice',
      href: 'qbank.html',
      icon: ICONS.pencil,
      match: function (p) { return /(qbank|daily-quiz)\.html/.test(p); }
    },
    {
      id: 'bn-tips',
      label: 'Tips',
      href: 'learn-tips.html',
      icon: ICONS.bulb,
      match: function (p) { return /(learn-tips|mind-maps)\.html/.test(p); }
    },
    {
      id: 'bn-profile',
      label: 'Profile',
      href: 'profile.html',
      icon: ICONS.person,
      match: function (p) { return /profile\.html/.test(p); }
    }
  ];

  function shouldShow() {
    var p = location.pathname;
    return !/(index|auth)(\.html)?$/.test(p) && p !== '/';
  }

  function updateActive() {
    var p = location.pathname;
    /* also check hash for home */
    TABS.forEach(function (tab) {
      var el = document.getElementById(tab.id);
      if (!el) return;
      if (tab.match(p)) {
        el.classList.add('bn-active');
        el.setAttribute('aria-current', 'page');
      } else {
        el.classList.remove('bn-active');
        el.removeAttribute('aria-current');
      }
    });
  }

  function buildNav() {
    if (document.getElementById(NAV_ID)) {
      updateActive();
      return;
    }
    if (!shouldShow()) return;

    var nav = document.createElement('nav');
    nav.id = NAV_ID;
    nav.setAttribute('aria-label', 'Main');
    nav.setAttribute('role', 'navigation');

    TABS.forEach(function (tab) {
      var a = document.createElement('a');
      a.id = tab.id;
      a.href = tab.href;
      a.className = 'bn-tab';
      a.setAttribute('aria-label', tab.label);
      a.innerHTML =
        '<span class="bn-icon" aria-hidden="true">' + tab.icon + '</span>' +
        '<span class="bn-label">' + tab.label + '</span>';
      nav.appendChild(a);
    });

    document.body.appendChild(nav);
    document.body.classList.add('has-bottom-nav');
    updateActive();
  }

  /* Init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

  /* SPA navigation: update active state */
  document.addEventListener('abl-navigate', function (e) {
    var nav = document.getElementById(NAV_ID);
    /* show/hide based on target page */
    var href = (e.detail && e.detail.href) || location.href;
    var isApp = !/(index|auth)(\.html)?($|\?)/.test(href) && href !== location.origin + '/';
    if (!isApp) {
      if (nav) { nav.style.display = 'none'; document.body.classList.remove('has-bottom-nav'); }
      return;
    }
    if (!nav) {
      buildNav();
    } else {
      nav.style.display = '';
      document.body.classList.add('has-bottom-nav');
      /* defer one tick so location.pathname has updated */
      setTimeout(updateActive, 0);
    }
  });

}());
