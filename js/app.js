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
    { id: 'question-gen',  label: '🎲 Question Generator' },
    { id: 'maths-qbank',   label: '📝 Question Bank' },
    { id: 'questions',     label: '✏️ Questions' },
    { id: 'pyqs',          label: '📋 PYQs' },
    { id: 'summary',       label: '📖 Summary' }
  ],
  science: [
    { id: 'formula-sheet',     label: '⚗️ Formula Sheet' },
    { id: 'science-qbank',     label: '📝 Question Bank' },
    { id: 'important-notes',   label: '📌 Important Notes' },
    { id: 'practice-questions',label: '🧠 MCQs' },
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
    { id: 'social-notes',       label: '📖 Notes' },
    { id: 'practice-questions', label: '🧠 MCQs' },
    { id: 'social-qbank',       label: '📝 Question Bank' },
    { id: 'maps',               label: '🗺️ Maps' },
    { id: 'pyqs',               label: '📋 PYQs' },
    { id: 'summary',            label: '📑 Summary' }
  ]
};

/* ── PROGRESS ── */
function getProgress() {
  try { return JSON.parse(localStorage.getItem('abilearn_progress') || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem('abilearn_progress', JSON.stringify(p)); } catch {}
}
function getPDFStore() {
  try { return JSON.parse(localStorage.getItem('pdf_done') || '{}'); } catch { return {}; }
}
function getSubjectPct(subjectId) {
  // Count all PDFs configured for this subject
  const subPdfs = PDFS[subjectId] || {};
  const allPdfs = Object.values(subPdfs).flat();
  if (allPdfs.length) {
    const store = getPDFStore();
    const done = allPdfs.filter(p => store[p.url]).length;
    return Math.round((done / allPdfs.length) * 100);
  }
  // Fallback: chapter-based (for subjects with no PDFs uploaded yet)
  const sub = DATA.subjects.find(s => s.id === subjectId);
  if (!sub || !sub.chapters.length) return 0;
  const p = getProgress();
  const done = sub.chapters.filter(c => p[subjectId + '_' + c.id]).length;
  return Math.round((done / sub.chapters.length) * 100);
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

/* ── MOBILE HAMBURGER MENU ── */
function initMobileNav() {
  if (document.getElementById('hamburgerBtn')) return;
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const ham = document.createElement('button');
  ham.className = 'hamburger';
  ham.id = 'hamburgerBtn';
  ham.setAttribute('aria-label', 'Menu');
  ham.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(ham);

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.id = 'mobileMenu';
  menu.innerHTML = `
    <div class="mobile-menu-inner">
      <a href="index.html" class="mobile-nav-link">🏠 Home</a>
      <div class="mobile-nav-section">Subjects</div>
      <a href="maths.html" class="mobile-nav-link mobile-sub-link">📐 Mathematics</a>
      <a href="science.html" class="mobile-nav-link mobile-sub-link">🔬 Science</a>
      <a href="english.html" class="mobile-nav-link mobile-sub-link">📖 English</a>
      <a href="social.html" class="mobile-nav-link mobile-sub-link">🌍 Social Science</a>
      <button class="mobile-nav-link" onclick="closeMobileMenu();setTimeout(()=>document.getElementById('owlixToggle').click(),150)">🦉 Ask Owlix AI</button>
      <div class="mobile-menu-actions">
        <button class="btn-login">Log In</button>
        <button class="btn-signup">Sign Up Free</button>
      </div>
    </div>`;
  document.body.appendChild(menu);

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.addEventListener('click', e => {
    if (e.target === menu) closeMobileMenu();
  });
}

function closeMobileMenu() {
  const m = document.getElementById('mobileMenu');
  const h = document.getElementById('hamburgerBtn');
  if (m) m.classList.remove('open');
  if (h) h.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── DROPDOWN (click for touch, hover still works on desktop) ── */
function initDropdowns() {
  document.querySelectorAll('.nav-dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const dd = btn.closest('.nav-dropdown');
      const isOpen = dd.classList.contains('dd-open');
      document.querySelectorAll('.nav-dropdown.dd-open').forEach(d => {
        d.classList.remove('dd-open');
        d.querySelector('.dropdown-arrow').style.transform = '';
      });
      if (!isOpen) {
        dd.classList.add('dd-open');
        dd.querySelector('.dropdown-arrow').style.transform = 'rotate(180deg)';
      }
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.dd-open').forEach(d => {
        d.classList.remove('dd-open');
        d.querySelector('.dropdown-arrow').style.transform = '';
      });
    }
  });
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
  initSearch(); initDropdowns(); initMobileNav();
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
  initSearch(); initDropdowns(); initMobileNav();
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
      case 'practice-questions':
        if (subject && subject.id === 'science' && typeof SCIENCE_MCQS !== 'undefined') {
          el.innerHTML = buildScienceMCQCards(subject);
        } else if (subject && subject.id === 'social') {
          el.innerHTML = buildSocialMCQCards(subject);
        } else {
          el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el);
        }
        break;
      case 'question-gen':      el.innerHTML = buildQuestionGenerator(subject); break;
      case 'questions':         el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el); break;
      case 'pyqs':              el.innerHTML = buildPYQs(subject); break;
      case 'most-important':    el.innerHTML = buildMostImportant(subject); break;
      case 'ncert-solutions':   el.innerHTML = buildNCERT(); break;
      case 'first-flight':      el.innerHTML = buildEnglishReader(subject, 'ff'); break;
      case 'footprints':        el.innerHTML = buildEnglishReader(subject, 'fp'); break;
      case 'grammar':           el.innerHTML = buildGrammar(); break;
      case 'reading':           el.innerHTML = buildReading(); break;
      case 'writing':           el.innerHTML = buildWriting(); break;
      case 'maths-qbank':       el.innerHTML = buildMathsQBank(subject); break;
      case 'science-qbank':     el.innerHTML = buildScienceQBank(subject); break;
      case 'social-notes':      el.innerHTML = buildSocialNotes(subject); break;
      case 'social-qbank':      el.innerHTML = buildSocialQBank(subject); break;
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
    qbank: [
      { title: 'Ch 1 — Real Numbers',                    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch1-real-numbers.pdf' },
      { title: 'Ch 2 — Polynomials',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch2-polynomials.pdf' },
      { title: 'Ch 3 — Pair of Linear Equations',        desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch3-linear-equations.pdf' },
      { title: 'Ch 4 — Quadratic Equations',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch4-quadratic-equations.pdf' },
      { title: 'Ch 5 — Arithmetic Progressions',         desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch5-arithmetic-progressions.pdf' },
      { title: 'Ch 7 — Coordinate Geometry',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch7-coordinate-geometry.pdf' },
      { title: 'Ch 8 — Introduction to Trigonometry',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch8-introduction-to-trigonometry.pdf' },
      { title: 'Ch 9 — Some Applications of Trigonometry', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch9-applications-of-trigonometry.pdf' },
      { title: 'Ch 11 — Areas Related to Circles',       desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch11-areas-related-to-circles.pdf' },
      { title: 'Ch 12 — Surface Areas and Volumes',      desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch12-surface-areas-and-volumes.pdf' },
      { title: 'Ch 13 — Statistics',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch13-statistics.pdf' },
      { title: 'Ch 14 — Probability',                    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch14-probability.pdf' }
    ],
    formula: [
      { title: 'Ch 1 — Real Numbers',                        desc: 'Number systems, HCF, LCM, Euclid\'s lemma',     url: 'assets/formula/ch01-real-numbers.png' },
      { title: 'Ch 2 — Polynomials',                         desc: 'Zeros, factor theorem, division algorithm',      url: 'assets/formula/ch02-polynomials.png' },
      { title: 'Ch 3 — Pair of Linear Equations',            desc: 'Methods: graphical, substitution, elimination',  url: 'assets/formula/ch03-linear-equations.png' },
      { title: 'Ch 4 — Quadratic Equations',                 desc: 'Discriminant, quadratic formula, nature of roots',url: 'assets/formula/ch04-quadratic-equations.png' },
      { title: 'Ch 5 — Arithmetic Progressions',             desc: 'nth term, sum of AP, key formulas',             url: 'assets/formula/ch05-arithmetic-progressions.png' },
      { title: 'Ch 6 — Triangles',                           desc: 'Similarity, Thales theorem, Pythagoras',        url: 'assets/formula/ch06-triangles.png' },
      { title: 'Ch 7 — Coordinate Geometry',                 desc: 'Distance, section, midpoint, area formulas',    url: 'assets/formula/ch07-coordinate-geometry.png' },
      { title: 'Ch 8 — Introduction to Trigonometry',        desc: 'Ratios, identities, standard values',           url: 'assets/formula/ch08-trigonometry.png' },
      { title: 'Ch 9 — Applications of Trigonometry',        desc: 'Heights & distances, angle of elevation',       url: 'assets/formula/ch09-applications-trigonometry.png' },
      { title: 'Ch 10 — Circles',                            desc: 'Tangent, secant, arc, sector formulas',         url: 'assets/formula/ch10-circles.png' },
      { title: 'Ch 13 — Surface Areas and Volumes',          desc: 'Cuboid, cylinder, cone, sphere formulas',       url: 'assets/formula/ch13-surface-areas-volumes.png' },
      { title: 'Ch 14 — Statistics',                         desc: 'Mean, median, mode for grouped data',           url: 'assets/formula/ch14-statistics.png' }
    ],
    notes: [],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (30/1/1)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (30/1/2)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (30/1/3)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (30/1/1)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (30/1/2)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (30/1/3)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (30/1/1)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (30/1/2)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (30/1/3)',  desc: 'Mathematics Standard — Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set3.pdf' },
      // ── 2022 ──────────────────────────────────────────────────────────
      { title: '2022 · Set 1 (30/2/1)',  desc: 'Mathematics Standard — Term II, 40 marks, 2 hrs', url: 'pdfs/maths/pyqs/2022-qp-set1.pdf' }
    ]
  },
  science: {
    formula: [],
    notes: [
      { title: 'Ch 2 — Acids, Bases and Salts',             desc: 'Complete Notes', url: 'pdfs/science/notes/ch2-acids-bases-salts.pdf' },
      { title: 'Ch 3 — Metals and Non-Metals',              desc: 'Complete Notes', url: 'pdfs/science/notes/ch3-metals-and-non-metals.pdf' },
      { title: 'Ch 4 — Carbon and Its Compounds',           desc: 'Complete Notes', url: 'pdfs/science/notes/ch4-carbon-and-compounds.pdf' },
      { title: 'Ch 5 — Life Processes',                     desc: 'Complete Notes', url: 'pdfs/science/notes/ch5-life-processes.pdf' },
      { title: 'Ch 6 — Control and Coordination',           desc: 'Complete Notes', url: 'pdfs/science/notes/ch6-control-and-coordination.pdf' },
      { title: 'Ch 7 — How do Organisms Reproduce?',        desc: 'Complete Notes', url: 'pdfs/science/notes/ch7-how-organisms-reproduce.pdf' },
      { title: 'Ch 8 — Heredity',                           desc: 'Complete Notes', url: 'pdfs/science/notes/ch8-heredity.pdf' },
      { title: 'Ch 9 — Light: Reflection and Refraction',   desc: 'Complete Notes', url: 'pdfs/science/notes/ch9-light-reflection-refraction.pdf' },
      { title: 'Ch 10 — The Human Eye and the Colourful World', desc: 'Complete Notes', url: 'pdfs/science/notes/ch10-human-eye-colourful-world.pdf' },
      { title: 'Ch 11 — Electricity',                       desc: 'Complete Notes', url: 'pdfs/science/notes/ch11-electricity.pdf' },
      { title: 'Ch 12 — Magnetic Effects of Electric Current', desc: 'Complete Notes', url: 'pdfs/science/notes/ch12-magnetic-effects.pdf' },
      { title: 'Ch 13 — Our Environment',                   desc: 'Complete Notes', url: 'pdfs/science/notes/ch13-our-environment.pdf' }
    ],
    qbank: [
      { title: 'Ch 1 — Chemical Reactions and Equations',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch1-chemical-reactions.pdf' },
      { title: 'Ch 2 — Acids, Bases and Salts',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch2-acids-bases-salts.pdf' },
      { title: 'Ch 3 — Metals and Non-Metals',              desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch3-metals-and-non-metals.pdf' },
      { title: 'Ch 4 — Carbon and Its Compounds',           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch4-carbon-and-compounds.pdf' },
      { title: 'Ch 5 — Life Processes',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch5-life-processes.pdf' },
      { title: 'Ch 6 — Control and Coordination',           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch6-control-and-coordination.pdf' },
      { title: 'Ch 7 — How do Organisms Reproduce?',        desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch7-how-organisms-reproduce.pdf' },
      { title: 'Ch 8 — Heredity',                           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch8-heredity.pdf' },
      { title: 'Ch 9 — Light: Reflection and Refraction',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch9-light-reflection-refraction.pdf' },
      { title: 'Ch 10 — The Human Eye and the Colourful World', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch10-human-eye-colourful-world.pdf' },
      { title: 'Ch 11 — Electricity',                       desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch11-electricity.pdf' },
      { title: 'Ch 12 — Magnetic Effects of Electric Current', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch12-magnetic-effects.pdf' },
      { title: 'Ch 13 — Our Environment',                   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch13-our-environment.pdf' }
    ],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (31/1/1)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (31/1/2)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (31/1/3)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (31/1/1)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (31/1/2)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (31/1/3)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (31/1/1)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (31/1/2)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (31/1/3)', desc: 'Science — 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set3.pdf' }
    ]
  },
  english: {
    formula: [], notes: [],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2025-qp-set3.pdf' },
      { title: '2025 · Set 4',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2025-qp-set4.pdf' },
      { title: '2025 · Marking Scheme',   desc: 'Official CBSE Answer Key',              url: 'pdfs/english/pyqs/2025-marking-scheme.pdf' },
      // ── 2024 (Marking Schemes with full Q+A) ──────────────────────────
      { title: '2024 · Answer Key 1',     desc: 'CBSE Official — Set 2/1/1',             url: 'pdfs/english/pyqs/2024-ms-set1.pdf' },
      { title: '2024 · Answer Key 2',     desc: 'CBSE Official — Set 2/1/2',             url: 'pdfs/english/pyqs/2024-ms-set2.pdf' },
      { title: '2024 · Answer Key 3',     desc: 'CBSE Official — Set 2/1/3',             url: 'pdfs/english/pyqs/2024-ms-set3.pdf' },
      { title: '2024 · Answer Key 4',     desc: 'CBSE Official — Set 2/2/3',             url: 'pdfs/english/pyqs/2024-ms-set4.pdf' },
      { title: '2024 · Answer Key 5',     desc: 'CBSE Official — Set 2/3/3',             url: 'pdfs/english/pyqs/2024-ms-set5.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set3.pdf' },
      { title: '2023 · Set 4',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set4.pdf' },
      { title: '2023 · Set 5',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set5.pdf' },
      { title: '2023 · Marking Scheme 1', desc: 'Official CBSE Answer Key — Set 2/4/1', url: 'pdfs/english/pyqs/2023-ms-set1.pdf' },
      { title: '2023 · Marking Scheme 2', desc: 'Official CBSE Answer Key — Set 2/4/3', url: 'pdfs/english/pyqs/2023-ms-set2.pdf' },
      // ── 2022 ──────────────────────────────────────────────────────────
      { title: '2022 · Set 1',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set1.pdf' },
      { title: '2022 · Set 2',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set2.pdf' },
      { title: '2022 · Set 3',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set3.pdf' }
    ],
    'first-flight': [
      { title: 'Ch 1 — A Letter to God',              desc: 'Prose', url: 'pdfs/english/ch1-a-letter-to-god.pdf' },
      { title: 'Ch 2 — Nelson Mandela',                desc: 'Prose', url: 'pdfs/english/ch2-nelson-mandela.pdf' },
      { title: 'Ch 3 — Two Stories About Flying',      desc: 'Prose', url: 'pdfs/english/ch3-two-stories-about-flying.pdf' },
      { title: 'Ch 4 — From the Diary of Anne Frank',  desc: 'Prose', url: 'pdfs/english/ch4-from-diary-of-anne-frank.pdf' },
      { title: 'Ch 6 — Mijbil the Otter',              desc: 'Prose', url: 'pdfs/english/ch6-mijbil-the-otter.pdf' },
      { title: 'Ch 9 — Madam Rides the Bus',           desc: 'Prose', url: 'pdfs/english/ch9-madam-rides-the-bus.pdf' },
      { title: 'Ch 10 — The Sermon at Benares',        desc: 'Prose', url: 'pdfs/english/ch10-the-sermon-at-benares.pdf' },
      { title: 'Ch 11 — The Proposal',                 desc: 'Play',  url: 'pdfs/english/ch11-the-proposal.pdf' },
      { title: 'Poem 1 — Dust of Snow',                desc: 'Poetry', url: 'pdfs/english/poem1-dust-of-snow.pdf' },
      { title: 'Poem 2 — Fire and Ice',                desc: 'Poetry', url: 'pdfs/english/poem2-fire-and-ice.pdf' },
      { title: 'Poem 3 — A Tiger in the Zoo',          desc: 'Poetry', url: 'pdfs/english/poem3-a-tiger-in-the-zoo.pdf' },
      { title: 'Poem 4 — How to Tell Wild Animals',    desc: 'Poetry', url: 'pdfs/english/poem4-how-to-tell-wild-animals.pdf' },
      { title: 'Poem 5 — The Ball Poem',               desc: 'Poetry', url: 'pdfs/english/poem5-the-ball-poem.pdf' },
      { title: 'Poem 6 — Amanda!',                     desc: 'Poetry', url: 'pdfs/english/poem6-amanda.pdf' },
      { title: 'Poem 7 — The Trees',                   desc: 'Poetry', url: 'pdfs/english/poem7-the-trees.pdf' },
      { title: 'Poem 8 — Fog',                         desc: 'Poetry', url: 'pdfs/english/poem8-fog.pdf' },
      { title: 'Poem 9 — The Tale of Custard the Dragon', desc: 'Poetry', url: 'pdfs/english/poem9-tale-of-custard-the-dragon.pdf' },
      { title: 'Poem 10 — For Anne Gregory',           desc: 'Poetry', url: 'pdfs/english/poem10-for-anne-gregory.pdf' }
    ],
    footprints: [
      { title: 'Ch 1 — A Triumph of Surgery',       desc: 'Prose', url: 'pdfs/english/fw-ch1-a-triumph-of-surgery.pdf' },
      { title: 'Ch 2 — The Thief\'s Story',         desc: 'Prose', url: 'pdfs/english/fw-ch2-the-thiefs-story.pdf' },
      { title: 'Ch 3 — The Midnight Visitor',       desc: 'Prose', url: 'pdfs/english/fw-ch3-the-midnight-visitor.pdf' },
      { title: 'Ch 4 — A Question of Trust',        desc: 'Prose', url: 'pdfs/english/fw-ch4-a-question-of-trust.pdf' },
      { title: 'Ch 5 — Footprints Without Feet',    desc: 'Prose', url: 'pdfs/english/fw-ch5-footprints-without-feet.pdf' },
      { title: 'Ch 7 — The Necklace',               desc: 'Prose', url: 'pdfs/english/fw-ch7-the-necklace.pdf' },
      { title: 'Ch 8 — Bholi',                      desc: 'Prose', url: 'pdfs/english/fw-ch8-bholi.pdf' }
    ]
  },
  social: {
    formula: [], notes: [],
    notes_history: [
      { title: 'Ch 1 — The Rise of Nationalism in Europe', desc: 'AbiLearn Notes · Proper Big-Font', url: 'pdfs/social/notes/history/ch1-rise-of-nationalism.pdf' },
      { title: 'Ch 2 — Nationalism in India',              desc: 'AbiLearn Notes · Clean Structured', url: 'pdfs/social/notes/history/ch2-nationalism-in-india.pdf' },
      { title: 'Ch 3 — The Making of a Global World',      desc: 'AbiLearn Notes · 9 Subtopics',     url: 'pdfs/social/notes/history/ch3-making-of-global-world.pdf' }
    ],
    notes_geography: [
      { title: 'Ch 1 — Resources and Development',         desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch1-resources-development.pdf' },
      { title: 'Ch 2 — Forest and Wildlife Resources',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch2-forest-wildlife.pdf' },
      { title: 'Ch 3 — Water Resources',                   desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch3-water-resources.pdf' },
      { title: 'Ch 4 — Agriculture',                       desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch4-agriculture.pdf' },
      { title: 'Ch 5 — Minerals and Energy Resources',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch5-minerals-energy.pdf' },
      { title: 'Ch 6 — Manufacturing Industries',          desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch6-manufacturing-industries.pdf' }
    ],
    notes_civics: [
      { title: 'Ch 1 — Power-Sharing',                     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/civics/ch1-power-sharing.pdf' },
      { title: 'Ch 2 — Federalism',                        desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/civics/ch2-federalism.pdf' }
    ],
    notes_economics: [
      { title: 'Ch 1 — Development',                       desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch1-development.pdf' },
      { title: 'Ch 2 — Sectors of the Indian Economy',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch2-sectors-economy.pdf' },
      { title: 'Ch 3 — Money and Credit',                  desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch3-money-credit.pdf' },
      { title: 'Ch 4 — Globalisation and the Indian Economy', desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch4-globalisation.pdf' }
    ],
    history: [
      { title: 'Ch 1 — The Rise of Nationalism in Europe', desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch1-rise-of-nationalism.pdf' },
      { title: 'Ch 2 — Nationalism in India',              desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch2-nationalism-in-india.pdf' },
      { title: 'Ch 5 — Print Culture and the Modern World',desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch5-print-culture.pdf' }
    ],
    geography: [
      { title: 'Ch 1 — Resources and Development',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch1-resources-and-development.pdf' },
      { title: 'Ch 2 — Forest and Wildlife Resources',desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch2-forest-and-wildlife.pdf' },
      { title: 'Ch 3 — Water Resources',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch3-water-resources.pdf' },
      { title: 'Ch 4 — Agriculture',                 desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch4-agriculture.pdf' },
      { title: 'Ch 5 — Minerals and Energy Resources',desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch5-minerals-and-energy.pdf' },
      { title: 'Ch 6 — Manufacturing Industries',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch6-manufacturing-industries.pdf' }
    ],
    civics: [
      { title: 'Ch 1 — Power Sharing',            desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch1-power-sharing.pdf' },
      { title: 'Ch 2 — Federalism',               desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch2-federalism.pdf' },
      { title: 'Ch 3 — Gender, Religion and Caste',  desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch3-democracy-and-diversity.pdf' },
      { title: 'Ch 4 — Political Parties',            desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch4-gender-religion-caste.pdf' },
      { title: 'Ch 5 — Outcomes of Democracy',        desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch5-popular-struggles.pdf' }
    ],
    economics: [
      { title: 'Ch 1 — Development',                      desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch1-development.pdf' },
      { title: 'Ch 2 — Sectors of the Indian Economy',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch2-sectors-of-economy.pdf' },
      { title: 'Ch 3 — Money and Credit',                 desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch3-money-and-credit.pdf' },
      { title: 'Ch 4 — Globalisation and the Indian Economy', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch4-globalisation.pdf' }
    ],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (32/1/1)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (32/1/2)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (32/1/3)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (32/1/1)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (32/1/2)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (32/1/3)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (32/1/1)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (32/1/2)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (32/1/3)', desc: 'Social Science — 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set3.pdf' }
    ]
  }
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

/* PDF completion helpers */
function getPDFDone(url) {
  try { return !!(JSON.parse(localStorage.getItem('pdf_done') || '{}')[url]); } catch { return false; }
}
function togglePDFDone(btn, url) {
  try {
    const store = getPDFStore();
    store[url] = !store[url];
    localStorage.setItem('pdf_done', JSON.stringify(store));
    btn.classList.toggle('done', !!store[url]);
    btn.title = store[url] ? 'Mark as unread' : 'Mark as read';
  } catch {}
}

/* PDF/image cards with completion circle + Open button */
function pdfCards(subject, tab) {
  const list = (PDFS[subject.id] || {})[tab] || [];
  if (!list.length) return '';
  return `<div class="pdf-cards-grid">
    ${list.map(p => {
      const done = getPDFDone(p.url);
      const isImg = _isImageUrl(p.url);
      return `
      <div class="pdf-card">
        <div class="pdf-card-icon">${isImg ? '🖼️' : '📄'}</div>
        <div class="pdf-card-info">
          <div class="pdf-card-title">${escH(p.title)}</div>
          <div class="pdf-card-desc">${escH(p.desc || '')}</div>
        </div>
        <button class="pdf-done-circle ${done ? 'done' : ''}" onclick="togglePDFDone(this,'${escH(p.url)}')" title="${done ? 'Mark as unread' : 'Mark as read'}">✓</button>
        <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
      </div>`;
    }).join('')}
  </div>`;
}

/* PDF.js popup — renders PDF or image directly, no external viewer */
const PDFJS_SRC    = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const PDFJS_CMAPS  = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/';
const PDFJS_FONTS  = 'fonts/standard/';
let _pdfUrl = '';
let _pdfZoom = 1.0;
let _pdfDoc = null;
let _isImage = false;
let _pdfObserver = null;

function _isImageUrl(url) {
  return /\.(jpe?g|png|webp|gif|svg)(\?.*)?$/i.test(url);
}

function openPDF(url, title) {
  _pdfUrl = url;
  _pdfZoom = 1.0;
  _pdfDoc = null;
  _isImage = _isImageUrl(url);
  if (_pdfObserver) { _pdfObserver.disconnect(); _pdfObserver = null; }

  let modal = document.getElementById('pdfModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pdfModal';
    modal.innerHTML = `
      <div class="pdf-modal-box">
        <button class="pdf-float-close" onclick="closePDF()">✕</button>
        <div class="pdf-float-zoom">
          <button class="pdf-zoom-btn" onclick="zoomPDF(-0.25)">−</button>
          <span id="pdfZoomLevel">100%</span>
          <button class="pdf-zoom-btn" onclick="zoomPDF(0.25)">+</button>
        </div>
        <div class="pdf-modal-body" id="pdfModalBody"></div>
      </div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('pdfZoomLevel').textContent = '100%';
  const body = document.getElementById('pdfModalBody');
  body.innerHTML = '<div class="pdf-loading">Loading…</div>';
  body.style.padding = _isImage ? '0.5rem' : '0';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  if (_isImage) { renderImage(url); return; }
  if (window.pdfjsLib) { renderPDF(url); return; }
  const s = document.createElement('script');
  s.src = PDFJS_SRC;
  s.onload = () => renderPDF(url);
  document.head.appendChild(s);
}

function renderImage(url) {
  const body = document.getElementById('pdfModalBody');
  if (!body) return;
  body.innerHTML = '';
  body.style.padding = '0';
  const img = document.createElement('img');
  img.className = 'pdf-img-view';
  _applyImgZoom(img);
  img.onerror = () => { body.innerHTML = `<div class="pdf-error">Could not load image.</div>`; };
  body.appendChild(img);
  img.src = url;
}

function _applyImgZoom(img) {
  const pct = Math.round(_pdfZoom * 100);
  if (_pdfZoom <= 1) {
    // Height-first: fill the full screen height, let width scale naturally
    img.style.cssText = `display:block;margin:0 auto;height:${pct}%;width:auto;max-width:100%;`;
  } else {
    // Zoomed in: width-based so user can scroll horizontally too
    img.style.cssText = `display:block;margin:0 auto;height:${pct}%;width:auto;max-width:none;`;
  }
}

function zoomPDF(delta) {
  _pdfZoom = Math.round(Math.max(0.5, Math.min(5.0, _pdfZoom + delta)) * 10) / 10;
  const el = document.getElementById('pdfZoomLevel');
  if (el) el.textContent = Math.round(_pdfZoom * 100) + '%';
  if (_isImage) {
    const img = document.querySelector('#pdfModalBody .pdf-img-view');
    _applyImgZoom(img);
    return;
  }
  renderPDF(_pdfUrl);
}

function renderPDF(url) {
  const body = document.getElementById('pdfModalBody');
  if (!body) return;
  if (_pdfObserver) { _pdfObserver.disconnect(); _pdfObserver = null; }
  body.innerHTML = '<div class="pdf-loading">Loading PDF…</div>';
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const base = window.location.href.replace(/\/[^\/]*$/, '/');
  const absUrl = url.startsWith('http') ? url : new URL(url, base).href;

  const load = (_pdfDoc && _pdfUrl === url)
    ? Promise.resolve(_pdfDoc)
    : pdfjsLib.getDocument({
        url: absUrl,
        rangeChunkSize: 65536,
        disableRange: false,
        disableStream: false,
        cMapUrl: PDFJS_CMAPS,
        cMapPacked: true,
        standardFontDataUrl: PDFJS_FONTS
      }).promise.then(doc => { _pdfDoc = doc; return doc; });

  load.then(pdf => {
    body.innerHTML = '';

    // clientWidth can be 0 on mobile before layout settles — fall back to innerWidth
    const rawW = body.clientWidth > 32 ? body.clientWidth : window.innerWidth;
    const containerW = rawW - 16;
    const dpr = window.devicePixelRatio || 1;
    const displayW = Math.max(Math.round(containerW * _pdfZoom), 200);

    function renderPage(w) {
      if (w.dataset.rendered === '1') return;
      w.dataset.rendered = '1';
      pdf.getPage(parseInt(w.dataset.page)).then(page => {
        // Must pass rotation so PDF.js respects the page's own orientation metadata
        const rotation = page.rotate;
        const natVp = page.getViewport({ scale: 1, rotation });
        const scale  = (displayW / natVp.width) * dpr;
        const vp     = page.getViewport({ scale, rotation });
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(vp.width);
        canvas.height = Math.round(vp.height);
        const cssH = Math.round(vp.height / dpr);
        canvas.style.cssText = `display:block;width:${displayW}px;height:${cssH}px;`;
        w.style.cssText = `display:block;margin:0 auto 4px;width:${displayW}px;height:${cssH}px;`;
        w.innerHTML = '';
        w.appendChild(canvas);
        page.render({ canvasContext: canvas.getContext('2d'), viewport: vp });
      });
    }

    const wrappers = [];
    const estH = Math.round(displayW * 1.414);
    for (let n = 1; n <= pdf.numPages; n++) {
      const w = document.createElement('div');
      w.dataset.page = n;
      w.dataset.rendered = '0';
      w.style.cssText = `display:block;margin:0 auto 4px;width:${displayW}px;height:${estH}px;background:#e8e8e8;border-radius:2px;`;
      body.appendChild(w);
      wrappers.push(w);
    }

    renderPage(wrappers[0]);
    if (wrappers[1]) renderPage(wrappers[1]);

    _pdfObserver = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) renderPage(e.target); });
    }, { root: body, rootMargin: '400px 0px', threshold: 0 });
    wrappers.slice(2).forEach(w => _pdfObserver.observe(w));

  }).catch(() => {
    body.innerHTML = `<div class="pdf-error">Could not load PDF.<br><a href="${escH(absUrl)}" target="_blank">Tap to download</a></div>`;
  });
}

function closePDF() {
  if (_pdfObserver) { _pdfObserver.disconnect(); _pdfObserver = null; }
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
    ${cards ? `<h2 class="section-title" style="margin-bottom:1rem">📐 Formula Sheets</h2>${cards}` : ''}
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
  const chapters = subject.chapters.filter(c => c.keyPoints && c.keyPoints.length);

  if (!cards && !chapters.length) return buildComingSoon('Important Notes', 'Notes for all chapters will be added here soon.');

  return `
    ${cards ? `<h2 class="section-title" style="margin-bottom:1rem">📂 Study PDFs</h2>${cards}` : ''}
    ${chapters.length ? `
      <h2 class="section-title" style="margin-bottom:1.5rem;margin-top:${cards ? '2rem' : '0'}">📌 Important Notes — ${subject.name}</h2>
      <div class="notes-grid">
        ${chapters.map(ch => `
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
      </div>` : ''}`;
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
   SCIENCE MCQ CHAPTER CARDS + MODAL
══════════════════════════════════════ */
function buildScienceMCQCards(subject) {
  const chapters = subject.chapters || [];
  const cards = chapters.map(ch => {
    const count = (SCIENCE_MCQS[ch.id] || []).length;
    return `
      <div class="pdf-card">
        <div class="pdf-card-icon">🧪</div>
        <div class="pdf-card-info">
          <div class="pdf-card-title">Ch ${ch.id}: ${escH(ch.title)}</div>
          <div class="pdf-card-desc">${count} MCQs · Medium–Difficult</div>
        </div>
        <button class="pdf-open-btn" onclick="openChapterMCQs(${ch.id}, '${escH(ch.title)}', 'science')">Open</button>
      </div>`;
  }).join('');
  return `
    <h2 class="section-title" style="margin-bottom:0.3rem">🧠 Chapter MCQs</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">100 MCQs per chapter · All topics · High Difficulty</p>
    <div class="pdf-list">${cards}</div>`;
}

/* ══════════════════════════════════════
   SOCIAL SCIENCE MCQ CHAPTER CARDS
══════════════════════════════════════ */
const SOCIAL_SUBJECTS = [
  { key: 'History',   icon: '📜', color: '#EF4444', ids: [1, 2, 11, 12, 13] },
  { key: 'Geography', icon: '🌍', color: '#10B981', ids: [3, 14, 15, 7, 16, 8, 17] },
  { key: 'Civics',    icon: '🏛️', color: '#3B82F6', ids: [4, 18, 19, 9, 20] },
  { key: 'Economics', icon: '💰', color: '#F59E0B', ids: [5, 21, 6, 10, 22] }
];

function buildSocialMCQCards(subject) {
  if (typeof SOCIAL_MCQS === 'undefined') return buildComingSoon('MCQs', 'Social Science MCQs loading...');
  const chMap = {};
  (subject.chapters || []).forEach(ch => chMap[ch.id] = ch);
  const sections = SOCIAL_SUBJECTS.map(s => {
    const cards = s.ids.map(id => {
      const ch = chMap[id]; if (!ch) return '';
      const count = (SOCIAL_MCQS[id] || []).length;
      if (!count) return '';
      return `
        <div class="pdf-card">
          <div class="pdf-card-icon">${s.icon}</div>
          <div class="pdf-card-info">
            <div class="pdf-card-title">${escH(ch.title)}</div>
            <div class="pdf-card-desc">${count} MCQs · ${s.key}</div>
          </div>
          <button class="pdf-open-btn" onclick="openChapterMCQs(${id}, '${escH(ch.title)}', 'social')">Open</button>
        </div>`;
    }).join('');
    if (!cards.trim()) return '';
    return `
      <div style="margin-bottom:1.5rem">
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.75rem">
          <span style="font-size:1.2rem">${s.icon}</span>
          <h3 style="margin:0;font-size:0.95rem;font-weight:800;color:${s.color}">${s.key}</h3>
        </div>
        <div class="pdf-list">${cards}</div>
      </div>`;
  }).join('');
  return `
    <h2 class="section-title" style="margin-bottom:0.3rem">🧠 Chapter MCQs</h2>
    <p style="color:var(--muted);margin-bottom:1.5rem;font-size:0.88rem">100 MCQs per chapter · History, Geography, Civics, Economics · High Difficulty</p>
    ${sections}`;
}

function openChapterMCQs(chId, title, subject) {
  const bank = subject === 'social'
    ? (typeof SOCIAL_MCQS !== 'undefined' && SOCIAL_MCQS[chId])
    : (typeof SCIENCE_MCQS !== 'undefined' && SCIENCE_MCQS[chId]);
  const mcqs = bank || [];
  if (!mcqs.length) return;
  const letters = ['A', 'B', 'C', 'D'];

  let modal = document.getElementById('mcqModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mcqModal';
    modal.innerHTML = `
      <div class="mcq-modal-box">
        <div class="mcq-modal-hdr">
          <div class="mcq-modal-title-wrap">
            <span class="mcq-modal-title" id="mcqModalTitle"></span>
            <span class="mcq-modal-meta" id="mcqModalMeta"></span>
          </div>
          <div style="display:flex;align-items:center;gap:0.6rem">
            <span class="mcq-score-pill" id="mcqScorePill">0 / 0</span>
            <button class="mcq-modal-close" onclick="closeMCQModal()">✕</button>
          </div>
        </div>
        <div class="mcq-modal-body" id="mcqModalBody"></div>
      </div>`;
    document.body.appendChild(modal);
  }

  document.getElementById('mcqModalTitle').textContent = `Ch ${chId}: ${title}`;
  document.getElementById('mcqModalMeta').textContent = `${mcqs.length} MCQs`;
  document.getElementById('mcqScorePill').textContent = '0 / 0';

  const body = document.getElementById('mcqModalBody');
  body.innerHTML = `<div class="mcq-grid">
    ${mcqs.map((q, qi) => `
      <div class="mcq-card" data-correct="${q.ans}" data-exp="${escH(q.exp || '')}" data-explbl="${escH(q.opts[q.ans])}">
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

  body.addEventListener('click', function handler(e) {
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
    // update score pill
    const answered = body.querySelectorAll('.mcq-feedback.show').length;
    const correct2 = body.querySelectorAll('.mcq-feedback.correct').length;
    document.getElementById('mcqScorePill').textContent = `${correct2} / ${answered}`;
  });

  modal.classList.add('open');
  body.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeMCQModal() {
  const modal = document.getElementById('mcqModal');
  if (modal) {
    modal.classList.remove('open');
    // clear body to free memory
    const b = document.getElementById('mcqModalBody');
    if (b) b.innerHTML = '';
  }
  document.body.style.overflow = '';
}

// Escape key closes MCQ modal (in addition to existing PDF modal handler)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMCQModal();
});

/* ══════════════════════════════════════
   PYQs PLACEHOLDER
══════════════════════════════════════ */
function buildPYQs(subject) {
  const cards = subject ? pdfCards(subject, 'pyqs') : '';
  if (!cards) {
    return `
      <div class="coming-soon">
        <div class="cs-icon">📋</div>
        <h3>PYQs — Coming Soon</h3>
        <p>CBSE Board exam question papers will be added here soon.</p>
        <button onclick="document.getElementById('owlixToggle').click()" class="btn btn-primary btn-md">Ask Owlix for PYQ Help →</button>
      </div>`;
  }
  return `
    <div>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <h2 class="section-title" style="margin:0">📋 Previous Year Question Papers</h2>
        <span style="font-size:0.78rem;color:var(--muted);background:var(--surface);padding:0.2rem 0.65rem;border-radius:20px">2022 · 2023 · 2024 · 2025</span>
      </div>
      ${cards}
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
  const title = type === 'ff' ? '✈️ First Flight' : '👣 Footprints Without Feet';
  const pdfTab = type === 'ff' ? 'first-flight' : 'footprints';
  const cards = pdfCards(subject, pdfTab);
  return `<h2 class="section-title" style="margin-bottom:1.5rem">${title}</h2>
    ${cards || buildComingSoon(title, 'PDFs for this section will be added here soon.')}`;
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
   SOCIAL SCIENCE QUESTION BANK
══════════════════════════════════════ */
function buildScienceQBank(subject) {
  const list = PDFS.science.qbank || [];
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">📝 Question Bank — 2M · 3M · 5M</h2>
      <div class="pdf-cards-grid">
        ${list.map(p => {
          const done = getPDFDone(p.url);
          return `
          <div class="pdf-card">
            <div class="pdf-card-icon">📄</div>
            <div class="pdf-card-info">
              <div class="pdf-card-title">${escH(p.title)}</div>
              <div class="pdf-card-desc">${escH(p.desc)}</div>
            </div>
            <button class="pdf-done-circle ${done ? 'done' : ''}" onclick="togglePDFDone(this,'${escH(p.url)}')" title="${done ? 'Mark as unread' : 'Mark as read'}">✓</button>
            <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function buildMathsQBank(subject) {
  const list = PDFS.maths.qbank || [];
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">📝 Question Bank — 2M · 3M · 5M</h2>
      <div class="pdf-cards-grid">
        ${list.map(p => {
          const done = getPDFDone(p.url);
          return `
          <div class="pdf-card">
            <div class="pdf-card-icon">📄</div>
            <div class="pdf-card-info">
              <div class="pdf-card-title">${escH(p.title)}</div>
              <div class="pdf-card-desc">${escH(p.desc)}</div>
            </div>
            <button class="pdf-done-circle ${done ? 'done' : ''}" onclick="togglePDFDone(this,'${escH(p.url)}')" title="${done ? 'Mark as unread' : 'Mark as read'}">✓</button>
            <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function buildSocialNotes(subject) {
  const pdfs = PDFS.social;
  const sections = [
    { key: 'notes_history',   icon: '📜', label: 'History',   color: '#EF4444' },
    { key: 'notes_geography', icon: '🌍', label: 'Geography',  color: '#10B981' },
    { key: 'notes_civics',    icon: '🏛️', label: 'Civics',    color: '#3B82F6' },
    { key: 'notes_economics', icon: '💰', label: 'Economics',  color: '#F59E0B' }
  ];
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">📖 Chapter Notes</h2>
      ${sections.map(s => {
        const list = pdfs[s.key] || [];
        if (!list.length) return '';
        return `
        <div style="margin-bottom:2rem">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.9rem">
            <span style="font-size:1.3rem">${s.icon}</span>
            <h3 style="margin:0;font-size:1rem;font-weight:800;color:${s.color}">${s.label}</h3>
            <span style="font-size:0.75rem;color:var(--muted);background:var(--surface);padding:0.15rem 0.55rem;border-radius:20px;border:1px solid var(--border)">${list.length} chapters</span>
          </div>
          <div class="pdf-cards-grid">
            ${list.map(p => {
              const done = getPDFDone(p.url);
              return `
              <div class="pdf-card">
                <div class="pdf-card-icon">📄</div>
                <div class="pdf-card-info">
                  <div class="pdf-card-title">${escH(p.title)}</div>
                  <div class="pdf-card-desc">${escH(p.desc)}</div>
                </div>
                <button class="pdf-done-circle ${done ? 'done' : ''}" onclick="togglePDFDone(this,'${escH(p.url)}')" title="${done ? 'Mark as unread' : 'Mark as read'}">✓</button>
                <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function buildSocialQBank(subject) {
  const pdfs = PDFS.social;
  const sections = [
    { key: 'history',   icon: '📜', label: 'History',   color: '#EF4444' },
    { key: 'geography', icon: '🌍', label: 'Geography',  color: '#10B981' },
    { key: 'civics',    icon: '🏛️', label: 'Civics',    color: '#3B82F6' },
    { key: 'economics', icon: '💰', label: 'Economics',  color: '#F59E0B' }
  ];
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">📝 Question Bank — 2M · 3M · 5M</h2>
      ${sections.map(s => {
        const list = pdfs[s.key] || [];
        if (!list.length) return '';
        return `
        <div style="margin-bottom:2rem">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.9rem">
            <span style="font-size:1.3rem">${s.icon}</span>
            <h3 style="margin:0;font-size:1rem;font-weight:800;color:${s.color}">${s.label}</h3>
            <span style="font-size:0.75rem;color:var(--muted);background:var(--surface);padding:0.15rem 0.55rem;border-radius:20px;border:1px solid var(--border)">${list.length} chapters</span>
          </div>
          <div class="pdf-cards-grid">
            ${list.map(p => {
              const done = getPDFDone(p.url);
              return `
              <div class="pdf-card">
                <div class="pdf-card-icon">📄</div>
                <div class="pdf-card-info">
                  <div class="pdf-card-title">${escH(p.title)}</div>
                  <div class="pdf-card-desc">${escH(p.desc)}</div>
                </div>
                <button class="pdf-done-circle ${done ? 'done' : ''}" onclick="togglePDFDone(this,'${escH(p.url)}')" title="${done ? 'Mark as unread' : 'Mark as read'}">✓</button>
                <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
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
  const chapters = subject.chapters.filter(c => c.keyPoints && c.keyPoints.length);

  if (!chapters.length) return buildComingSoon('Chapter Summaries', 'Summaries for all chapters will be added here soon.');

  return `<h2 class="section-title" style="margin-bottom:1.5rem">📖 Chapter Summaries — ${subject.name}</h2>
    <div class="summary-grid">
      ${chapters.map(ch => `
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
   QUESTION GENERATOR (Maths)
══════════════════════════════════════ */
function buildQuestionGenerator(subject) {
  if (subject.id !== 'maths') return buildComingSoon('Question Generator', 'Coming soon for this subject!');

  return `
    <div class="qgen-wrap">
      <div class="qgen-controls">
        <div class="qgen-filters">
          <span style="font-weight:700;color:var(--text);font-size:0.9rem">Marks:</span>
          <button class="qgen-filter active" data-m="0">All</button>
          <button class="qgen-filter" data-m="2">2M</button>
          <button class="qgen-filter" data-m="3">3M</button>
          <button class="qgen-filter" data-m="5">5M</button>
        </div>
        <div class="qgen-filters" style="margin-top:0.5rem">
          <span style="font-weight:700;color:var(--text);font-size:0.9rem">Chapter:</span>
          <select class="qgen-ch-sel" id="qgenChapter">
            <option value="0">All Chapters</option>
            ${subject.chapters.map(c => `<option value="${c.id}">Ch ${c.id}: ${c.title}</option>`).join('')}
          </select>
        </div>
        <div style="display:flex;align-items:center;gap:1rem;margin-top:1rem;flex-wrap:wrap">
          <label style="font-size:0.88rem;color:var(--muted)">Questions per set:
            <select class="qgen-ch-sel" id="qgenCount" style="margin-left:0.4rem">
              <option value="5">5</option>
              <option value="8" selected>8</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
          <button class="btn btn-primary btn-sm" onclick="generateQuestions()">🎲 Generate New Set</button>
          <button class="btn btn-sm" onclick="resetQGenSeen()" style="background:var(--surface);color:var(--muted);border:1px solid var(--border)">↺ Reset Seen</button>
        </div>
      </div>
      <div id="qgenOutput" style="margin-top:1.5rem"></div>
    </div>`;
}

// Question Generator state
let _qgenSeenKey = 'qgen_seen_maths';

function getQGenSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(_qgenSeenKey) || '[]')); } catch { return new Set(); }
}
function saveQGenSeen(seen) {
  try { localStorage.setItem(_qgenSeenKey, JSON.stringify([...seen])); } catch {}
}
function resetQGenSeen() {
  try { localStorage.removeItem(_qgenSeenKey); } catch {}
  generateQuestions();
}

function generateQuestions() {
  const out = document.getElementById('qgenOutput');
  if (!out) return;

  // Read filters
  const mFilter = parseInt(document.querySelector('.qgen-filter.active')?.dataset.m || '0');
  const chFilter = parseInt(document.getElementById('qgenChapter')?.value || '0');
  const count = parseInt(document.getElementById('qgenCount')?.value || '8');

  // Filter pool
  let pool = MATHS_QBANK.filter(q =>
    (mFilter === 0 || q.m === mFilter) &&
    (chFilter === 0 || q.ch === chFilter)
  );

  if (!pool.length) {
    out.innerHTML = '<div class="coming-soon"><p>No questions match this filter.</p></div>';
    return;
  }

  // Exclude seen questions; if pool exhausted reset seen for this filter
  let seen = getQGenSeen();
  let unseen = pool.filter(q => !seen.has(q.id));
  if (unseen.length < count) {
    // Remove seen IDs only for this pool to avoid full reset
    pool.forEach(q => seen.delete(q.id));
    saveQGenSeen(seen);
    unseen = pool;
  }

  // Shuffle and pick
  const shuffled = unseen.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  // Mark as seen
  selected.forEach(q => seen.add(q.id));
  saveQGenSeen(seen);

  // Chapter name lookup
  const chMap = {};
  if (typeof DATA !== 'undefined') {
    const sub = DATA.subjects.find(s => s.id === 'maths');
    if (sub) sub.chapters.forEach(c => { chMap[c.id] = c.title; });
  }

  const markColors = { 2: '#10B981', 3: '#3B82F6', 5: '#8B5CF6' };

  out.innerHTML = `
    <div style="font-size:0.82rem;color:var(--muted);margin-bottom:1rem">
      Showing ${selected.length} questions · ${pool.length - selected.length} remaining unseen
    </div>
    ${selected.map((q, i) => `
    <div class="qgen-card" id="qc-${i}">
      <div class="qgen-card-top">
        <span class="qgen-mark-badge" style="background:${markColors[q.m] || '#6366f1'}20;color:${markColors[q.m] || '#6366f1'};border:1px solid ${markColors[q.m] || '#6366f1'}40">${q.m} Marks</span>
        <span class="qgen-ch-badge">Ch ${q.ch} · ${chMap[q.ch] || ''}</span>
      </div>
      <div class="qgen-q">Q${i + 1}. ${escH(q.q)}</div>
      <button class="qgen-ans-btn" onclick="toggleQGenAns(${i})">Show Answer ▾</button>
      <div class="qgen-ans" id="qa-${i}" style="display:none">${escH(q.a)}</div>
    </div>`).join('')}`;
}

function toggleQGenAns(i) {
  const ans = document.getElementById('qa-' + i);
  const btn = ans?.previousElementSibling;
  if (!ans) return;
  const show = ans.style.display === 'none';
  ans.style.display = show ? 'block' : 'none';
  if (btn) btn.textContent = show ? 'Hide Answer ▴' : 'Show Answer ▾';
}

// wire up filter buttons
document.addEventListener('click', e => {
  const f = e.target.closest('.qgen-filter');
  if (!f) return;
  f.closest('.qgen-filters').querySelectorAll('.qgen-filter').forEach(b => b.classList.remove('active'));
  f.classList.add('active');
  generateQuestions();
});
document.addEventListener('change', e => {
  if (e.target.id === 'qgenChapter' || e.target.id === 'qgenCount') generateQuestions();
});

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
