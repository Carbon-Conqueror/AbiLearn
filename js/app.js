/* AbiLearn — Main Application Logic v2 */

/* ── SCROLL-HIDE HEADER ── */
(function() {
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    const tabs = document.querySelector('.tabs-bar');
    const y = window.scrollY;
    const navH = nav ? nav.offsetHeight : 72;
    if (y > lastY && y > navH) {
      if (nav) nav.style.transform = 'translateY(-100%)';
      if (tabs) tabs.style.top = '0';
    } else {
      if (nav) nav.style.transform = '';
      if (tabs) tabs.style.top = '';
    }
    lastY = y;
  }, { passive: true });
})();

/* ── SUBJECT TAB CONFIGS ── */
const SUBJECT_TABS = {
  maths: [
    { id: 'formula-sheet', label: '📐 Formula Sheet' },
    { id: 'question-bank', label: '📝 Question Bank' },
    { id: 'questions',     label: '✏️ Questions' },
    { id: 'pyqs',          label: '📋 PYQs' },
    { id: 'summary',       label: '📖 Summary' }
  ],
  science: [
    { id: 'formula-sheet',     label: '⚗️ Formula Sheet' },
    { id: 'important-notes',   label: '📌 Important Notes' },
    { id: 'practice-questions',label: '✏️ Practice Questions' },
    { id: 'pyqs',              label: '📋 PYQs' },
    { id: 'most-important',    label: '🎯 Most Important' },
    { id: 'ncert-solutions',   label: '📗 NCERT Solutions' },
    { id: 'summary',           label: '📖 Summary' }
  ],
  english: [
    { id: 'first-flight', label: '✈️ First Flight' },
    { id: 'footprints',   label: '👣 Footprints Without Feet' },
    { id: 'grammar',      label: '📝 Grammar' },
    { id: 'reading',      label: '📖 Reading' },
    { id: 'writing',      label: '✍️ Writing' },
    { id: 'pyqs',         label: '📋 PYQs' },
    { id: 'summary',      label: '📑 Summary' }
  ],
  social: [
    { id: 'important-notes',    label: '📌 Important Notes' },
    { id: 'practice-questions', label: '✏️ Practice Questions' },
    { id: 'maps',               label: '🗺️ Maps' },
    { id: 'pyqs',               label: '📋 PYQs' },
    { id: 'summary',            label: '📖 Summary' }
  ]
};

/* ── PROGRESS ── */
function getProgress() {
  try { return JSON.parse(localStorage.getItem('abilearn_progress') || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem('abilearn_progress', JSON.stringify(p)); } catch {}
}
function getSubjectPct(subjectId) {
  const sub = DATA.subjects.find(s => s.id === subjectId);
  if (!sub) return 0;
  const p = getProgress();
  const done = sub.chapters.filter(c => p[subjectId + '_' + c.id]).length;
  return sub.chapters.length ? Math.round((done / sub.chapters.length) * 100) : 0;
}

/* ── SEARCH ── */
function initSearch() {
  const inp = document.getElementById('searchInput');
  const res = document.getElementById('searchResults');
  if (!inp || !res) return;
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) { res.classList.remove('show'); return; }
    const hits = [];
    DATA.subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        if ((ch.title + ch.subtitle + (ch.keyPoints || []).join(' ')).toLowerCase().includes(q))
          hits.push({ sub, ch });
      });
    });
    res.innerHTML = hits.length === 0
      ? '<div class="search-result-item"><div class="result-title">No results found</div></div>'
      : hits.slice(0, 7).map(h =>
          `<div class="search-result-item" onclick="goTo('${h.sub.id}','${h.ch.id}')">
            <div class="result-subject">${h.sub.name}</div>
            <div class="result-title">${h.ch.title}</div>
          </div>`).join('');
    res.classList.add('show');
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search-bar')) res.classList.remove('show'); });
}

function goTo(subjectId, chapterId) {
  const map = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
  if (map[subjectId]) { sessionStorage.setItem('openChapter', chapterId); window.location.href = map[subjectId]; }
}

/* ── HAMBURGER ── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ══════════════════════════════════════
   HOME PAGE
══════════════════════════════════════ */
function initHomePage() {
  initSearch(); initHamburger();
  renderSubjectCards();
  renderTips();
  setTimeout(() => {
    document.querySelectorAll('.progress-fill[data-w]').forEach(el => el.style.width = el.dataset.w + '%');
    initReveal();
  }, 200);
}

function renderSubjectCards() {
  const grid = document.getElementById('subjectsGrid');
  if (!grid) return;
  const map = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
  grid.innerHTML = DATA.subjects.map((sub, i) => {
    const pct = getSubjectPct(sub.id);
    const qCount = sub.chapters.reduce((a, c) => a + (c.mcqs ? c.mcqs.length : 0), 0);
    return `
    <a href="${map[sub.id]}" class="subject-card ${sub.id} reveal reveal-d${i + 1}">
      <div class="card-top">
        <div class="card-icon-wrap">${sub.icon}</div>
        <div class="card-title">${sub.name}</div>
        <div class="card-desc">${sub.description}</div>
      </div>
      <div class="card-meta">
        <span class="meta-pill">${sub.chapters.length} Chapters</span>
        <span class="meta-pill">${qCount} MCQs</span>
      </div>
      <div class="card-progress">
        <div class="progress-row"><span>Your Progress</span><span>${pct}%</span></div>
        <div class="progress-track"><div class="progress-fill" data-w="${pct}" style="width:0%"></div></div>
      </div>
      <div class="card-footer">
        <span class="card-chapters">CBSE 2025</span>
        <button class="continue-btn">${pct > 0 ? 'Continue' : 'Start'} Learning →</button>
      </div>
    </a>`;
  }).join('');
}

function renderTips() {
  const g = document.getElementById('tipsGrid');
  if (!g) return;
  g.innerHTML = STUDY_TIPS.map(t => `
    <div class="tip-card reveal">
      <div class="tip-icon">${t.icon}</div>
      <h4>${t.title}</h4>
      <p>${t.text}</p>
    </div>`).join('');
}

/* ══════════════════════════════════════
   SUBJECT PAGE
══════════════════════════════════════ */
function initSubjectPage(subjectId) {
  initSearch(); initHamburger();
  const subject = DATA.subjects.find(s => s.id === subjectId);
  if (!subject) return;

  renderSubjectShell(subject);
  renderTabContent(subject, SUBJECT_TABS[subjectId][0].id);

  // Auto-open from search
  const oc = sessionStorage.getItem('openChapter');
  if (oc) {
    sessionStorage.removeItem('openChapter');
    setTimeout(() => {
      const el = document.querySelector(`[data-chapter-id="${oc}"]`);
      if (el) { el.click(); el.closest('.chapter-item')?.scrollIntoView({ behavior: 'smooth' }); }
    }, 400);
  }
  setTimeout(initReveal, 200);
}

function renderSubjectShell(subject) {
  const el = document.getElementById('subjectContent');
  if (!el) return;
  const tabs = SUBJECT_TABS[subject.id];
  const cls = subject.id + '-t';
  el.innerHTML = `
    <div class="subject-header ${subject.id}">
      <div class="subject-header-inner">
        <div class="subject-header-icon">${subject.icon}</div>
        <div>
          <div class="subject-breadcrumb">
            <a href="index.html">🏠 Home</a> › ${subject.name}
          </div>
          <h1>${subject.name}</h1>
          <p>${subject.description} &nbsp;·&nbsp; ${subject.chapters.length} Chapters</p>
        </div>
      </div>
    </div>
    <div class="tabs-bar">
      <div class="tabs-scroll" id="tabsScroll">
        ${tabs.map((t, i) => `
          <button class="tab-btn ${cls} ${i === 0 ? 'active' : ''}"
            data-tab="${t.id}" onclick="handleTabClick(this,'${subject.id}')">
            ${t.label}
          </button>`).join('')}
      </div>
    </div>
    <div class="container">
      <div class="section" id="tabContent"></div>
    </div>`;
}

function handleTabClick(btn, subjectId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const subject = DATA.subjects.find(s => s.id === subjectId);
  renderTabContent(subject, btn.dataset.tab);
}

/* ══════════════════════════════════════
   TAB CONTENT ROUTER
══════════════════════════════════════ */
function renderTabContent(subject, tabId) {
  const el = document.getElementById('tabContent');
  if (!el) return;
  el.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--muted)">Loading...</div>';

  setTimeout(() => {
    switch (tabId) {
      case 'formula-sheet':     el.innerHTML = buildFormulaSheet(subject); break;
      case 'important-notes':   el.innerHTML = buildImportantNotes(subject); break;
      case 'practice-questions':el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el); break;
      case 'question-bank':     el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el); break;
      case 'questions':         el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el); break;
      case 'pyqs':              el.innerHTML = buildPYQs(); break;
      case 'most-important':    el.innerHTML = buildMostImportant(subject); break;
      case 'ncert-solutions':   el.innerHTML = buildNCERT(); break;
      case 'first-flight':      el.innerHTML = buildEnglishReader(subject, 'ff'); initChapterAccordion(el, subject.id); break;
      case 'footprints':        el.innerHTML = buildEnglishReader(subject, 'fp'); initChapterAccordion(el, subject.id); break;
      case 'grammar':           el.innerHTML = buildGrammar(); break;
      case 'reading':           el.innerHTML = buildReading(); break;
      case 'writing':           el.innerHTML = buildWriting(); break;
      case 'maps':              el.innerHTML = buildMaps(); break;
      case 'summary':           el.innerHTML = buildSummary(subject); break;
      default:                  el.innerHTML = buildComingSoon('This section', 'Content coming soon!'); break;
    }
    initReveal();
  }, 80);
}

/* ══════════════════════════════════════
   PDF CONFIG
   How to add a PDF:
   1. Upload to Google Drive
   2. Share → "Anyone with the link" → Copy link
   3. Paste under the right subject + tab below
══════════════════════════════════════ */
const PDFS = {
  maths: {
    formula: [
      { title: 'Ch 1 — Real Numbers', desc: 'Important Formula Sheet', url: 'pdfs/maths/ch1-real-numbers-formula.pdf' }
    ],
    notes: []
  },
  science:  { formula: [], notes: [] },
  english:  { formula: [], notes: [] },
  social:   { formula: [], notes: [] }
};

/* Resolve PDF URL for iframe — local paths pass through, Drive links convert to embed */
function toDriveEmbed(url) {
  if (url.startsWith('http')) {
    const m = url.match(/drive\.google\.com\/file\/d\/([^\/\?]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  // Local path: build absolute URL so Google Docs Viewer can fetch it
  const base = window.location.href.replace(/\/[^\/]*$/, '/');
  const abs = new URL(url, base).href;
  return `https://docs.google.com/viewer?url=${encodeURIComponent(abs)}&embedded=true`;
}

/* PDF cards with Open PDF button — opens popup modal */
function pdfCards(subject, tab) {
  const list = (PDFS[subject.id] || {})[tab] || [];
  if (!list.length) return '';
  return `<div class="pdf-cards-grid">
    ${list.map(p => `
      <div class="pdf-card">
        <div class="pdf-card-icon">📄</div>
        <div class="pdf-card-info">
          <div class="pdf-card-title">${escH(p.title)}</div>
          <div class="pdf-card-desc">${escH(p.desc || '')}</div>
        </div>
        <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open PDF</button>
      </div>`).join('')}
  </div>`;
}

/* PDF.js popup — renders PDF directly, no external viewer */
const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

function openPDF(url, title) {
  let modal = document.getElementById('pdfModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pdfModal';
    modal.innerHTML = `
      <div class="pdf-modal-overlay" onclick="closePDF()"></div>
      <div class="pdf-modal-box">
        <div class="pdf-modal-header">
          <span class="pdf-modal-title" id="pdfModalTitle"></span>
          <button class="pdf-modal-close" onclick="closePDF()">✕</button>
        </div>
        <div class="pdf-modal-body" id="pdfModalBody">
          <div class="pdf-loading">Loading PDF…</div>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('pdfModalTitle').textContent = title;
  document.getElementById('pdfModalBody').innerHTML = '<div class="pdf-loading">Loading PDF…</div>';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Go fullscreen
  const box = modal.querySelector('.pdf-modal-box') || modal;
  const fsEl = box.requestFullscreen ? box : (box.webkitRequestFullscreen ? box : null);
  if (fsEl) {
    (fsEl.requestFullscreen || fsEl.webkitRequestFullscreen).call(fsEl).catch(() => {});
  }

  if (window.pdfjsLib) { renderPDF(url); return; }
  const s = document.createElement('script');
  s.src = PDFJS_SRC;
  s.onload = () => renderPDF(url);
  document.head.appendChild(s);
}

function renderPDF(url) {
  const body = document.getElementById('pdfModalBody');
  if (!body) return;
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const base = window.location.href.replace(/\/[^\/]*$/, '/');
  const absUrl = url.startsWith('http') ? url : new URL(url, base).href;

  pdfjsLib.getDocument(absUrl).promise.then(pdf => {
    body.innerHTML = '';
    for (let n = 1; n <= pdf.numPages; n++) {
      pdf.getPage(n).then(page => {
        const vp = page.getViewport({ scale: Math.min(body.clientWidth / page.getViewport({ scale: 1 }).width, 2) });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        canvas.style.cssText = 'width:100%;display:block;margin-bottom:2px';
        body.appendChild(canvas);
        page.render({ canvasContext: canvas.getContext('2d'), viewport: vp });
      });
    }
  }).catch(() => {
    body.innerHTML = `<div class="pdf-error">Could not load PDF.<br><a href="${escH(absUrl)}" target="_blank">Tap to download</a></div>`;
  });
}

function closePDF() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else if (document.webkitFullscreenElement) document.webkitExitFullscreen();
  const m = document.getElementById('pdfModal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePDF(); });

/* ══════════════════════════════════════
   FORMULA SHEET
══════════════════════════════════════ */
function buildFormulaSheet(subject) {
  const colorMap = { maths:'var(--maths)', science:'var(--science)', english:'var(--english)', social:'var(--social)' };
  const color = colorMap[subject.id] || 'var(--purple-600)';
  const chapters = subject.chapters.filter(c => c.formulas && c.formulas.length);
  const cards = pdfCards(subject, 'formula');

  if (!chapters.length && !cards) return buildComingSoon('Formula Sheet', 'Formulas will be added here soon.');

  return `
    ${cards ? `<h2 class="section-title" style="margin-bottom:1rem">📂 Formula PDFs</h2>${cards}` : ''}
    ${chapters.length ? `
      <h2 class="section-title" style="margin-bottom:1.5rem;margin-top:${cards ? '2rem' : '0'}">📐 Formula Sheet — ${subject.name}</h2>
      <div class="formula-sheet">
        ${chapters.map(ch => `
          <div class="formula-chapter-block reveal">
            <div class="formula-chapter-title">
              <span class="formula-num" style="background:${color}">${ch.id}</span>
              ${ch.title}
            </div>
            <div class="formula-grid">
              ${ch.formulas.map(f => `<div class="formula-pill">${escH(f)}</div>`).join('')}
            </div>
          </div>`).join('')}
      </div>` : ''}`;
}

/* ══════════════════════════════════════
   IMPORTANT NOTES
══════════════════════════════════════ */
function buildImportantNotes(subject) {
  const colorMap = { maths:'var(--maths)', science:'var(--science)', english:'var(--english)', social:'var(--social)' };
  const color = colorMap[subject.id] || 'var(--purple-600)';
  const cards = pdfCards(subject, 'notes');
  return `
    ${cards ? `<h2 class="section-title" style="margin-bottom:1rem">📂 Study PDFs</h2>${cards}` : ''}
    <h2 class="section-title" style="margin-bottom:1.5rem;margin-top:${cards ? '2rem' : '0'}">📌 Important Notes — ${subject.name}</h2>
    <div class="notes-grid">
      ${subject.chapters.map(ch => `
        <div class="notes-block reveal">
          <div class="notes-chapter-title">
            <span class="formula-num" style="background:${color};min-width:28px">${ch.id}</span>
            ${ch.title}
            <span style="font-size:0.72rem;color:var(--muted);font-weight:400;margin-left:auto">${ch.subtitle}</span>
          </div>
          <ul class="notes-list">
            ${(ch.keyPoints || []).map(kp => `<li>${escH(kp)}</li>`).join('')}
          </ul>
        </div>`).join('')}
    </div>`;
}

/* ══════════════════════════════════════
   PRACTICE QUESTIONS / QUESTION BANK
══════════════════════════════════════ */
function buildPracticeQuestions(subject) {
  const allMCQs = [];
  subject.chapters.forEach(ch => {
    (ch.mcqs || []).forEach(q => allMCQs.push({ ...q, chapter: ch.title, chId: ch.id }));
  });
  if (!allMCQs.length) return buildComingSoon('Practice Questions', 'Questions will be added here soon.');
  const letters = ['A', 'B', 'C', 'D'];
  return `<h2 class="section-title" style="margin-bottom:0.5rem">✏️ Practice Questions</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">Tap an option to check your answer</p>
    <div class="mcq-grid">
      ${allMCQs.map((q, qi) => `
        <div class="mcq-card reveal" data-correct="${q.ans}" data-exp="${escH(q.exp || '')}" data-explbl="${escH(q.opts[q.ans])}">
          <div class="mcq-chapter-label">Ch ${q.chId} · ${q.chapter}</div>
          <div class="mcq-q">Q${qi + 1}. ${q.q}</div>
          <div class="mcq-opts">
            ${q.opts.map((opt, i) => `
              <button class="mcq-opt" data-idx="${i}">
                <span class="opt-letter">${letters[i]}</span>${escH(opt)}
              </button>`).join('')}
          </div>
          <div class="mcq-feedback"></div>
        </div>`).join('')}
    </div>`;
}

function initMCQHandlers(container) {
  container.addEventListener('click', e => {
    const btn = e.target.closest('.mcq-opt:not(.disabled)');
    if (!btn) return;
    const card = btn.closest('.mcq-card');
    const chosen = parseInt(btn.dataset.idx);
    const correct = parseInt(card.dataset.correct);
    card.querySelectorAll('.mcq-opt').forEach((b, i) => {
      b.classList.add('disabled');
      if (i === correct) b.classList.add('correct');
      else if (i === chosen) b.classList.add('wrong');
    });
    const fb = card.querySelector('.mcq-feedback');
    if (fb) {
      fb.classList.add('show', chosen === correct ? 'correct' : 'wrong');
      fb.innerHTML = chosen === correct
        ? `✅ <strong>Correct!</strong> ${escH(card.dataset.exp)}`
        : `❌ <strong>Wrong.</strong> Correct answer: <strong>${escH(card.dataset.explbl)}</strong>. ${escH(card.dataset.exp)}`;
    }
  });
}

/* ══════════════════════════════════════
   PYQs PLACEHOLDER
══════════════════════════════════════ */
function buildPYQs() {
  return `
    <div class="coming-soon">
      <div class="cs-icon">📋</div>
      <h3>Previous Year Questions (PYQs)</h3>
      <p>CBSE Board exam PYQs from 2019–2024 are being added. Check back soon — or ask Owlix AI for PYQ-style questions!</p>
      <button onclick="document.getElementById('owlixToggle').click()" class="btn btn-primary btn-md">Ask Owlix for PYQ Help →</button>
    </div>`;
}

/* ══════════════════════════════════════
   MOST IMPORTANT TOPICS (Science)
══════════════════════════════════════ */
function buildMostImportant(subject) {
  const topics = [
    { badge: '⚡ Physics', text: 'Ohm\'s Law, Series & Parallel Circuits, Electric Power — appear in every board exam' },
    { badge: '🔭 Optics', text: 'Mirror formula (1/v + 1/u = 1/f), Lens formula, Power of lens — numericals always asked' },
    { badge: '🌱 Biology', text: 'Photosynthesis equation, Reflex arc, Mendel\'s laws — 3-5 marks in boards' },
    { badge: '⚗️ Chemistry', text: 'Types of chemical reactions with examples — definition + example questions common' },
    { badge: '🧪 Acids & Bases', text: 'pH scale, neutralisation, indicators, baking soda vs washing soda' },
    { badge: '🌍 Environment', text: '10% energy law, ozone depletion (CFCs), biodegradable vs non-biodegradable' },
    { badge: '⚙️ Electricity', text: 'Joule\'s law of heating (H = I²Rt), numerical on power and energy consumption' },
    { badge: '🔬 Heredity', text: 'Monohybrid cross ratio (3:1), dihybrid (9:3:3:1), Mendel\'s laws — must know' },
    { badge: '💡 Magnetism', text: 'Fleming\'s Left-hand Rule (motor) vs Right-hand Rule (generator) — always confused' },
    { badge: '🧬 Reproduction', text: 'Difference between asexual and sexual reproduction with examples' }
  ];
  return `<h2 class="section-title" style="margin-bottom:0.5rem">🎯 Most Important Topics</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">High-probability topics for CBSE Board Exam</p>
    <div class="important-topics">
      ${topics.map((t, i) => `
        <div class="topic-card reveal reveal-d${(i % 4) + 1}">
          <div class="topic-badge">${t.badge}</div>
          <div class="topic-text">${t.text}</div>
        </div>`).join('')}
    </div>`;
}

/* ══════════════════════════════════════
   NCERT SOLUTIONS PLACEHOLDER
══════════════════════════════════════ */
function buildNCERT() {
  return `
    <div class="coming-soon">
      <div class="cs-icon">📗</div>
      <h3>NCERT Solutions</h3>
      <p>Step-by-step NCERT textbook solutions for all chapters are being prepared. Your teacher's notes will also be added here.</p>
      <button onclick="document.getElementById('owlixToggle').click()" class="btn btn-primary btn-md">Ask Owlix for Help →</button>
    </div>`;
}

/* ══════════════════════════════════════
   ENGLISH — FIRST FLIGHT & FOOTPRINTS
══════════════════════════════════════ */
function buildEnglishReader(subject, type) {
  // type: 'ff' = First Flight (ch 1-8), 'fp' = Footprints (ch 9-11)
  const ffChapters = subject.chapters.filter((_, i) => i < 8);
  const fpChapters = subject.chapters.filter((_, i) => i >= 8);
  const chapters = type === 'ff' ? ffChapters : fpChapters;
  const title = type === 'ff' ? '✈️ First Flight' : '👣 Footprints Without Feet';

  return `<h2 class="section-title" style="margin-bottom:1.5rem">${title}</h2>
    <div class="chapters-list" id="chaptersList">
      ${chapters.map(ch => buildChapterAccordionHTML(ch, subject.id, type === 'ff' ? 'nm-ff' : 'nm-fp')).join('')}
    </div>`;
}

function buildChapterAccordionHTML(ch, subjectId, numClass) {
  const p = getProgress();
  const done = !!p[subjectId + '_' + ch.id];
  const letters = ['A','B','C','D'];
  const kpHTML = ch.keyPoints?.length
    ? `<div class="kp-section"><h4>🔑 Key Points</h4><ul class="kp-list">${ch.keyPoints.map(k => `<li>${escH(k)}</li>`).join('')}</ul></div>` : '';
  const fmHTML = ch.formulas?.length
    ? `<div class="fm-section"><h4>📌 Key Info</h4>${ch.formulas.map(f => `<div class="fm-pill">${escH(f)}</div>`).join('')}</div>` : '';
  const mcqHTML = ch.mcqs?.length
    ? `<div class="mcq-section"><h4>✏️ Practice MCQs</h4>${ch.mcqs.map((q, qi) => `
        <div class="mcq-card" style="margin-bottom:0.75rem" data-correct="${q.ans}" data-exp="${escH(q.exp||'')}" data-explbl="${escH(q.opts[q.ans])}">
          <div class="mcq-q">${qi + 1}. ${q.q}</div>
          <div class="mcq-opts">${q.opts.map((o, i) => `<button class="mcq-opt" data-idx="${i}"><span class="opt-letter">${letters[i]}</span>${escH(o)}</button>`).join('')}</div>
          <div class="mcq-feedback"></div>
        </div>`).join('')}</div>` : '';
  return `
    <div class="chapter-item">
      <div class="chapter-header" data-chapter-id="${ch.id}">
        <div class="chapter-num ${numClass}">${ch.id}</div>
        <div class="chapter-info">
          <div class="chapter-title">${ch.title}</div>
          <div class="chapter-sub">${ch.subtitle}</div>
        </div>
        <button class="chapter-done-btn ${done ? 'done' : ''}" data-subject="${subjectId}" data-cid="${ch.id}" title="Mark done" onclick="event.stopPropagation();toggleDone(this)">✓</button>
        <span class="chapter-toggle">▼</span>
      </div>
      <div class="chapter-body">
        <div class="chapter-content">${kpHTML}${fmHTML}${mcqHTML}</div>
      </div>
    </div>`;
}

function initChapterAccordion(container, subjectId) {
  container.addEventListener('click', e => {
    const header = e.target.closest('.chapter-header');
    const doneBtn = e.target.closest('.chapter-done-btn');
    if (doneBtn) return; // handled by onclick
    if (!header) return;
    const item = header.closest('.chapter-item');
    const isOpen = item.classList.contains('open');
    container.querySelectorAll('.chapter-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
  initMCQHandlers(container);
}

function toggleDone(btn) {
  const p = getProgress();
  const key = btn.dataset.subject + '_' + btn.dataset.cid;
  p[key] = !p[key];
  saveProgress(p);
  btn.classList.toggle('done', !!p[key]);
}

/* ══════════════════════════════════════
   GRAMMAR / READING / WRITING
══════════════════════════════════════ */
function buildGrammar() {
  const topics = [
    { title: 'Tenses', desc: 'Present, Past, Future — Simple, Continuous, Perfect, Perfect Continuous. Tense rules with examples.' },
    { title: 'Determiners & Articles', desc: 'Use of a, an, the, some, any, each, every, much, many — with rules and exercises.' },
    { title: 'Modals', desc: 'Can, could, may, might, shall, should, will, would, must, need, dare, used to, ought to.' },
    { title: 'Subject-Verb Agreement', desc: 'Rules for singular and plural verbs with different subjects including collective nouns.' },
    { title: 'Active and Passive Voice', desc: 'Transformations across all tenses with rules, exceptions and practice sentences.' },
    { title: 'Direct & Indirect Speech', desc: 'Reporting statements, questions, commands. Changes in pronouns and tenses.' },
    { title: 'Clauses', desc: 'Noun clause, Adjective clause, Adverb clause — identification and usage in sentences.' },
    { title: 'Editing / Omission / Gap Filling', desc: 'Board exam question types — spotting errors, filling blanks with correct forms.' }
  ];
  return `<h2 class="section-title" style="margin-bottom:0.5rem">📝 Grammar</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">CBSE Class 10 English Grammar Topics</p>
    <div style="display:grid;gap:1rem">
      ${topics.map(t => `
        <div class="skill-card reveal">
          <h3>${t.title}</h3>
          <p>${t.desc}</p>
          <div style="margin-top:1rem">
            <button onclick="sendOwlixMessage('Explain ${t.title} in English grammar with examples')" class="btn btn-outline-purple btn-sm">Ask Owlix →</button>
          </div>
        </div>`).join('')}
    </div>`;
}

function buildReading() {
  return `
    <h2 class="section-title" style="margin-bottom:0.5rem">📖 Reading Comprehension</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">Strategies and practice for CBSE Board reading passages</p>
    <div style="display:grid;gap:1rem">
      <div class="skill-card reveal">
        <h3>🎯 How to Attempt Reading Passages</h3>
        <p>1. Read the questions FIRST before reading the passage.<br>
        2. Skim the passage to understand the main idea (30 seconds).<br>
        3. Read carefully, underlining key information related to questions.<br>
        4. Answers are ALWAYS in the passage — never guess from outside knowledge.<br>
        5. Use your own words for "In your own words" questions.<br>
        6. Check spelling and grammar in your answers.</p>
      </div>
      <div class="skill-card reveal reveal-d2">
        <h3>📋 Types of Questions in CBSE Board</h3>
        <p>• <strong>Factual questions</strong> — directly from the passage<br>
        • <strong>Inferential questions</strong> — reading between the lines<br>
        • <strong>Vocabulary questions</strong> — find word similar in meaning<br>
        • <strong>Title/Heading</strong> — summarize in a few words<br>
        • <strong>Note-making</strong> — organized point format</p>
      </div>
      <div class="coming-soon" style="margin-top:0.5rem">
        <div class="cs-icon">📄</div>
        <h3>Practice Passages</h3>
        <p>CBSE-style reading passages with questions and model answers will be added here. Check back soon!</p>
      </div>
    </div>`;
}

function buildWriting() {
  const types = [
    { title: '📝 Formal Letter', desc: 'Letter to editor, principal, authority. Format: Sender → Date → Receiver → Subject → Body → Closing.' },
    { title: '📰 Article Writing', desc: 'Format: Title → By (name) → Introduction → Body paragraphs → Conclusion. Use subheadings.' },
    { title: '📣 Notice Writing', desc: 'Short, formal announcement. Format: Organization Name → NOTICE → Date → Title → Body → Name/Designation.' },
    { title: '✉️ Informal Letter', desc: 'Letter to friend/relative. Casual tone, sharing news/experiences. No strict format needed.' },
    { title: '🗣️ Speech Writing', desc: 'Respectful opening → Main points → Examples → Conclusion. Engaging, persuasive language.' },
    { title: '📖 Story Writing', desc: 'Plot (beginning-middle-end), character development, moral. Use vivid language and dialogue.' }
  ];
  return `<h2 class="section-title" style="margin-bottom:0.5rem">✍️ Writing Skills</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">CBSE Board exam writing formats and tips</p>
    <div style="display:grid;gap:1rem">
      ${types.map(t => `
        <div class="skill-card reveal">
          <h3>${t.title}</h3>
          <p>${t.desc}</p>
          <button onclick="sendOwlixMessage('How to write a ${t.title.replace(/[📝📰📣✉️🗣️📖]/g,'').trim()} for CBSE boards?')" class="btn btn-outline-purple btn-sm" style="margin-top:0.75rem">Get tips from Owlix →</button>
        </div>`).join('')}
    </div>`;
}

/* ══════════════════════════════════════
   MAPS (Social Science)
══════════════════════════════════════ */
function buildMaps() {
  const maps = [
    { icon: '🗺️', name: 'Historical Maps — Nationalism in India', sub: 'Salt March route, Non-Cooperation centres, Partition maps' },
    { icon: '🌾', name: 'Agricultural Map of India', sub: 'Kharif/Rabi crop distribution, Green Revolution states' },
    { icon: '⛏️', name: 'Minerals & Resources Map', sub: 'Iron ore, coal, bauxite, mica, petroleum locations' },
    { icon: '🏭', name: 'Industrial Map of India', sub: 'Cotton, steel, IT, cement, automobile industries' },
    { icon: '🌊', name: 'Water Resources Map', sub: 'Major rivers, dams, multipurpose river projects (Bhakra, Hirakud)' },
    { icon: '🚂', name: 'Lifelines of the Economy', sub: 'National highways, railway zones, major ports and airports' },
    { icon: '🌍', name: 'Europe — Rise of Nationalism', sub: 'Map-based questions on unification of Germany & Italy' }
  ];
  return `
    <div class="maps-section">
      <div class="maps-header">
        <h3>🗺️ Map Work — Social Science</h3>
        <p>Important maps for CBSE Class 10 Board Exam</p>
      </div>
      <div class="maps-list">
        ${maps.map(m => `
          <div class="map-item reveal">
            <div class="map-icon">${m.icon}</div>
            <div>
              <div class="map-name">${m.name}</div>
              <div class="map-sub">${m.sub}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div style="margin-top:1.5rem">
      ${buildComingSoon('Interactive Maps', 'Labeled, clickable maps for practice are coming soon. Use the list above to guide your atlas practice!')}
    </div>`;
}

/* ══════════════════════════════════════
   SUMMARY
══════════════════════════════════════ */
function buildSummary(subject) {
  const colorMap = { maths:'var(--maths)', science:'var(--science)', english:'var(--english)', social:'var(--social)' };
  const color = colorMap[subject.id] || 'var(--purple-600)';
  return `<h2 class="section-title" style="margin-bottom:1.5rem">📖 Chapter Summaries — ${subject.name}</h2>
    <div class="summary-grid">
      ${subject.chapters.map(ch => `
        <div class="summary-card reveal">
          <div class="summary-card-title">
            <span class="formula-num" style="background:${color};min-width:28px">${ch.id}</span>
            ${ch.title}
          </div>
          <div class="summary-points">
            ${(ch.keyPoints || []).slice(0, 4).map(k => `<div class="summary-point">${escH(k)}</div>`).join('')}
          </div>
        </div>`).join('')}
    </div>`;
}

/* ══════════════════════════════════════
   COMING SOON
══════════════════════════════════════ */
function buildComingSoon(name, msg) {
  return `
    <div class="coming-soon">
      <div class="cs-icon">🚀</div>
      <h3>${name} — Coming Soon</h3>
      <p>${msg}</p>
      <button onclick="document.getElementById('owlixToggle').click()" class="btn btn-primary btn-md">Ask Owlix Instead →</button>
    </div>`;
}

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function escH(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
