/* AbiLearn Community CTA – floating social widget + footer strip */
(function () {
  'use strict';

  /* ── CSS ─────────────────────────────────────────────────────────── */
  var css = `
/* community-cta tokens */
:root {
  --cm-accent: #5B47DE;
  --cm-accent-dark: #8474EE;
  --cm-ig: #E1306C;
  --cm-wa: #25D366;
  --cm-radius: 14px;
  --cm-shadow: 0 8px 32px rgba(0,0,0,.18);
  --cm-pill-bg: #5B47DE;
  --cm-pill-fg: #fff;
  --cm-card-bg: #fff;
  --cm-card-border: rgba(91,71,222,.15);
  --cm-card-text: #1a1a2e;
  --cm-card-sub: #6b7280;
  --cm-footer-bg: #f8f7ff;
  --cm-footer-border: rgba(91,71,222,.12);
  --cm-footer-text: #374151;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --cm-pill-bg: #8474EE;
    --cm-card-bg: #1e1b3a;
    --cm-card-border: rgba(132,116,238,.2);
    --cm-card-text: #e2e0f5;
    --cm-card-sub: #9ca3af;
    --cm-footer-bg: #13112a;
    --cm-footer-border: rgba(132,116,238,.15);
    --cm-footer-text: #c4bfee;
  }
}
:root[data-theme="dark"] {
  --cm-pill-bg: #8474EE;
  --cm-card-bg: #1e1b3a;
  --cm-card-border: rgba(132,116,238,.2);
  --cm-card-text: #e2e0f5;
  --cm-card-sub: #9ca3af;
  --cm-footer-bg: #13112a;
  --cm-footer-border: rgba(132,116,238,.15);
  --cm-footer-text: #c4bfee;
}

/* wrapper */
#abl-community-cta {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}
@media (max-width: 600px) {
  #abl-community-cta { bottom: 16px; right: 16px; }
}

/* pill trigger */
#abl-cm-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--cm-pill-bg);
  color: var(--cm-pill-fg);
  border: none;
  border-radius: 50px;
  padding: 11px 20px 11px 14px;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: .01em;
  cursor: pointer;
  box-shadow: var(--cm-shadow);
  transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
  white-space: nowrap;
  outline: none;
}
#abl-cm-pill:hover  { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(91,71,222,.35); }
#abl-cm-pill:focus-visible { outline: 2px solid var(--cm-pill-bg); outline-offset: 3px; }
#abl-cm-pill-icon { width: 22px; height: 22px; flex-shrink: 0; }
#abl-cm-pill-chevron {
  width: 16px; height: 16px; flex-shrink: 0; margin-left: 2px;
  transition: transform .25s ease;
}
#abl-community-cta.open #abl-cm-pill-chevron { transform: rotate(180deg); }

/* panel */
#abl-cm-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  transform-origin: bottom right;
  transform: scale(.92) translateY(12px);
  opacity: 0;
  pointer-events: none;
  transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .18s ease;
}
#abl-community-cta.open #abl-cm-panel {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: auto;
}
@media (prefers-reduced-motion: reduce) {
  #abl-cm-panel, #abl-cm-pill, #abl-cm-pill-chevron { transition: none !important; }
}

/* cards */
.abl-cm-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--cm-card-bg);
  border: 1px solid var(--cm-card-border);
  border-radius: var(--cm-radius);
  padding: 14px 16px;
  min-width: 260px;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,.1);
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease;
}
.abl-cm-card:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.16); }
.abl-cm-card:focus-visible { outline: 2px solid var(--cm-accent); outline-offset: 2px; }
.abl-cm-card-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.abl-cm-card-icon svg { width: 22px; height: 22px; }
.abl-cm-card-ig .abl-cm-card-icon { background: linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888); }
.abl-cm-card-wa .abl-cm-card-icon { background: #25D366; }
.abl-cm-card-body { flex: 1; min-width: 0; }
.abl-cm-card-title { font-size: .875rem; font-weight: 700; color: var(--cm-card-text); margin: 0 0 2px; line-height: 1.3; }
.abl-cm-card-sub   { font-size: .75rem; color: var(--cm-card-sub); margin: 0; line-height: 1.4; }
.abl-cm-card-cta {
  font-size: .75rem; font-weight: 700; white-space: nowrap;
  padding: 5px 10px; border-radius: 20px; text-decoration: none;
  flex-shrink: 0;
}
.abl-cm-card-ig .abl-cm-card-cta { background: linear-gradient(135deg,#e6683c,#bc1888); color: #fff; }
.abl-cm-card-wa .abl-cm-card-cta { background: #25D366; color: #fff; }

/* footer strip */
#abl-cm-footer {
  width: 100%;
  background: var(--cm-footer-bg);
  border-top: 1px solid var(--cm-footer-border);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: .8rem;
  color: var(--cm-footer-text);
}
.abl-cm-footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-weight: 600;
  color: var(--cm-footer-text);
  padding: 6px 12px;
  border-radius: 20px;
  transition: background .15s, color .15s;
}
.abl-cm-footer-link:hover { background: rgba(91,71,222,.1); }
.abl-cm-footer-link:focus-visible { outline: 2px solid var(--cm-accent); outline-offset: 2px; }
.abl-cm-footer-link svg { width: 16px; height: 16px; flex-shrink: 0; }
.abl-cm-footer-ig:hover  { color: #E1306C; }
.abl-cm-footer-wa:hover  { color: #25D366; }
.abl-cm-footer-sep { color: var(--cm-card-border); user-select: none; }
  `;

  /* ── inject CSS ──────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.id = 'abl-community-css';
  style.textContent = css;
  document.head.appendChild(style);

  /* ── SVG helpers ─────────────────────────────────────────────────── */
  var USERS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  var CHEVRON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  var IG_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
  var WA_SVG = '<svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

  /* ── build floating widget ───────────────────────────────────────── */
  var wrap = document.createElement('div');
  wrap.id = 'abl-community-cta';
  wrap.setAttribute('role', 'region');
  wrap.setAttribute('aria-label', 'Join AbiLearn Community');

  /* panel (built first, visually above pill) */
  var panel = document.createElement('div');
  panel.id = 'abl-cm-panel';
  panel.setAttribute('aria-live', 'polite');

  /* Instagram card */
  var igCard = document.createElement('a');
  igCard.className = 'abl-cm-card abl-cm-card-ig';
  igCard.href = 'https://www.instagram.com/abilearn10';
  igCard.target = '_blank';
  igCard.rel = 'noopener noreferrer';
  igCard.setAttribute('aria-label', 'Follow AbiLearn on Instagram');
  igCard.innerHTML =
    '<div class="abl-cm-card-icon">' + IG_SVG + '</div>' +
    '<div class="abl-cm-card-body">' +
      '<p class="abl-cm-card-title">Follow AbiLearn</p>' +
      '<p class="abl-cm-card-sub">Study tips, updates &amp; content</p>' +
    '</div>' +
    '<span class="abl-cm-card-cta" aria-hidden="true">Follow →</span>';

  /* WhatsApp card */
  var waCard = document.createElement('a');
  waCard.className = 'abl-cm-card abl-cm-card-wa';
  waCard.href = 'https://whatsapp.com/channel/0029VbDTWsVGU3BFrD4m6s3O';
  waCard.target = '_blank';
  waCard.rel = 'noopener noreferrer';
  waCard.setAttribute('aria-label', 'Join AbiLearn WhatsApp Channel');
  waCard.innerHTML =
    '<div class="abl-cm-card-icon">' + WA_SVG + '</div>' +
    '<div class="abl-cm-card-body">' +
      '<p class="abl-cm-card-title">Join AbiLearn Channel</p>' +
      '<p class="abl-cm-card-sub">Notes, announcements &amp; study updates</p>' +
    '</div>' +
    '<span class="abl-cm-card-cta" aria-hidden="true">Join →</span>';

  panel.appendChild(igCard);
  panel.appendChild(waCard);

  /* pill */
  var pill = document.createElement('button');
  pill.id = 'abl-cm-pill';
  pill.setAttribute('aria-expanded', 'false');
  pill.setAttribute('aria-controls', 'abl-cm-panel');
  pill.innerHTML =
    '<span id="abl-cm-pill-icon">' + USERS_SVG + '</span>' +
    '<span>Join AbiLearn Community</span>' +
    '<span id="abl-cm-pill-chevron">' + CHEVRON_SVG + '</span>';

  wrap.appendChild(panel);
  wrap.appendChild(pill);
  document.body.appendChild(wrap);

  /* ── toggle logic ────────────────────────────────────────────────── */
  var isOpen = false;

  function openPanel() {
    isOpen = true;
    wrap.classList.add('open');
    pill.setAttribute('aria-expanded', 'true');
    trackEvent('community_cta_open');
  }
  function closePanel() {
    isOpen = false;
    wrap.classList.remove('open');
    pill.setAttribute('aria-expanded', 'false');
  }

  pill.addEventListener('click', function () {
    isOpen ? closePanel() : openPanel();
  });

  /* close on outside click */
  document.addEventListener('click', function (e) {
    if (isOpen && !wrap.contains(e.target)) closePanel();
  });

  /* keyboard: Escape closes */
  document.addEventListener('keydown', function (e) {
    if (isOpen && (e.key === 'Escape' || e.key === 'Esc')) {
      closePanel();
      pill.focus();
    }
  });

  /* ── card analytics ──────────────────────────────────────────────── */
  igCard.addEventListener('click', function () { trackEvent('instagram_follow_click'); });
  waCard.addEventListener('click', function () { trackEvent('whatsapp_channel_click'); });

  /* ── footer strip ────────────────────────────────────────────────── */
  var footer = document.createElement('div');
  footer.id = 'abl-cm-footer';
  footer.innerHTML =
    '<span>Connect with AbiLearn</span>' +
    '<a class="abl-cm-footer-link abl-cm-footer-ig" ' +
       'href="https://www.instagram.com/abilearn10" ' +
       'target="_blank" rel="noopener noreferrer" ' +
       'aria-label="AbiLearn on Instagram">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' +
      'Instagram' +
    '</a>' +
    '<span class="abl-cm-footer-sep">·</span>' +
    '<a class="abl-cm-footer-link abl-cm-footer-wa" ' +
       'href="https://whatsapp.com/channel/0029VbDTWsVGU3BFrD4m6s3O" ' +
       'target="_blank" rel="noopener noreferrer" ' +
       'aria-label="AbiLearn WhatsApp Channel">' +
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>' +
      'WhatsApp Channel' +
    '</a>';

  document.body.appendChild(footer);

  /* footer analytics */
  footer.querySelector('.abl-cm-footer-ig').addEventListener('click', function () {
    trackEvent('footer_instagram_click');
  });
  footer.querySelector('.abl-cm-footer-wa').addEventListener('click', function () {
    trackEvent('footer_whatsapp_click');
  });

  /* ── analytics helper ────────────────────────────────────────────── */
  function trackEvent(name) {
    try {
      if (typeof gtag === 'function')     { gtag('event', name); return; }
      if (typeof ga === 'function')       { ga('send', 'event', 'community', name); return; }
      if (window._cta_events)            { window._cta_events.push({ name: name, ts: Date.now() }); }
    } catch (e) { /* silent */ }
  }

}());
