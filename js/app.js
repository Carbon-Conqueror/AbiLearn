/* AbiLearn Main Application Logic v73 */

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
    { id: 'formula-sheet', label: 'Formulas' },
    { id: 'maths-qbank',   label: 'Question Bank' },
    { id: 'pyqs',          label: 'PYQ Papers' },
  ],
  science: [
    { id: 'science-qbank',     label: 'Question Bank' },
    { id: 'important-notes',   label: 'Study Notes' },
    { id: 'practice-questions',label: 'MCQ Practice' },
    { id: 'pyqs',              label: 'PYQ Papers' },
    { id: 'most-important',    label: 'Most Important' },
    { id: 'ncert-solutions',   label: 'NCERT Solutions' },
  ],
  english: [
    { id: 'first-flight', label: 'First Flight' },
    { id: 'footprints',   label: 'Footprints' },
    { id: 'grammar',      label: 'Grammar' },
    { id: 'reading',      label: 'Reading' },
    { id: 'writing',      label: 'Writing' },
    { id: 'pyqs',         label: 'PYQ Papers' },
  ],
  social: [
    { id: 'social-notes',       label: 'Notes' },
    { id: 'practice-questions', label: 'MCQ Practice' },
    { id: 'social-qbank',       label: 'Question Bank' },
    { id: 'maps',               label: 'Map Work' },
    { id: 'pyqs',               label: 'PYQ Papers' },
  ]
};

/* ── FIRESTORE PROGRESS CACHE — populated after login by loadUserDataFromFirestore ── */
var _cachedPdfProgress     = {};
var _cachedKnowledgeMap    = {};
var _cachedChapterProgress = {};
var _subjectPageSubject    = null;

function _currentEmail() {
  try {
    var u = (typeof getUser === 'function') ? getUser() : null;
    return u && u.email ? u.email : null;
  } catch (e) { return null; }
}
function getProgress() {
  const email = _currentEmail();
  if (!email) return {};
  try { return JSON.parse(localStorage.getItem('abilearn_progress_' + email) || '{}'); } catch { return {}; }
}
function saveProgress(p) {
  const email = _currentEmail();
  if (!email) return;
  try { localStorage.setItem('abilearn_progress_' + email, JSON.stringify(p)); } catch {}
}

/* Email-free instant chapter-tick cache — readable before auth resolves */
var _AL_CP_KEY = '_al_chprog';
function _cpLoad(){ try{ return JSON.parse(localStorage.getItem(_AL_CP_KEY)||'{}'); }catch(e){ return {}; } }
function _cpSave(key, done){
  try{
    var cp = _cpLoad();
    if(done) cp[key] = 1; else delete cp[key];
    localStorage.setItem(_AL_CP_KEY, JSON.stringify(cp));
  }catch(e){}
}
function getPDFStore() {
  return _cachedPdfProgress;
}
function getSubjectPct(subjectId) {
  // Prefer Firestore knowledge map mastery
  if (typeof DB !== 'undefined' && Object.keys(_cachedKnowledgeMap).length) {
    return DB.computeSubjectPct(subjectId, _cachedKnowledgeMap);
  }
  // Fallback: PDF completion count from Firestore cache
  const subPdfs = PDFS[subjectId] || {};
  const allPdfs = Object.values(subPdfs).flat();
  if (allPdfs.length) {
    const done = allPdfs.filter(p => _cachedPdfProgress[p.url] && _cachedPdfProgress[p.url].completed).length;
    return Math.round((done / allPdfs.length) * 100);
  }
  // Fallback: chapter-based localStorage progress
  const sub = DATA.subjects.find(s => s.id === subjectId);
  if (!sub || !sub.chapters.length) return 0;
  const pr = getProgress();
  const done = sub.chapters.filter(c => pr[subjectId + '_' + c.id]).length;
  return Math.round((done / sub.chapters.length) * 100);
}

/* Real-time chapter progress listener — keeps tick buttons live on subject pages */
var _chapterProgressUnsub = null;
function subscribeChapterProgress(uid) {
  if (_chapterProgressUnsub) { try { _chapterProgressUnsub(); } catch(e){} }
  if (typeof DB === 'undefined' || !DB.listenChapterProgress) return;
  _chapterProgressUnsub = DB.listenChapterProgress(uid, function(cp) {
    _cachedChapterProgress = cp || {};

    /* Sync Firestore → localStorage so next page load is instant.
       Only touch keys that Firestore knows about; local-only keys (pending writes)
       are left untouched so they aren't wiped during in-flight saves. */
    var localCp = _cpLoad();
    var syncChanged = false;
    Object.keys(_cachedChapterProgress).forEach(function(k) {
      var done = !!(_cachedChapterProgress[k] && _cachedChapterProgress[k].done);
      if (done && !localCp[k])  { localCp[k] = 1; syncChanged = true; }
      if (!done && localCp[k])  { delete localCp[k]; syncChanged = true; }
    });
    if (syncChanged) { try { localStorage.setItem(_AL_CP_KEY, JSON.stringify(localCp)); } catch(e){} }

    /* Patch visible tick buttons using getChapterDone — checks Firestore cache
       AND localStorage, so a just-saved tick never flashes off before Firestore confirms. */
    document.querySelectorAll('.chapter-done-btn').forEach(function(btn) {
      var key = btn.dataset.key || (btn.dataset.subject + '_chapter_' + btn.dataset.cid);
      btn.classList.toggle('done', getChapterDone(key));
    });

    /* Refresh progress tab if currently open */
    if (_subjectPageSubject) {
      var activeBtn = document.querySelector('.tab-btn.active');
      if (activeBtn && (activeBtn.dataset.tab === 'my-progress' || activeBtn.dataset.tab === 'progress')) {
        var tc = document.getElementById('tabContent');
        if (tc) tc.innerHTML = buildProgressTab(_subjectPageSubject);
      }
    }
  });
}

/* Called by auth.js onAuthStateChanged after Firebase auth resolves */
async function loadUserDataFromFirestore(uid) {
  if (typeof DB === 'undefined' || !uid) return;
  subscribeChapterProgress(uid);
  try {
    const [pdfProg, km, chProg] = await Promise.all([
      DB.getPdfProgress(uid),
      DB.getKnowledgeMap(uid),
      DB.getChapterProgress(uid)
    ]);
    _cachedPdfProgress     = pdfProg || {};
    _cachedKnowledgeMap    = km      || {};
    _cachedChapterProgress = chProg  || {};
    /* Home page subject cards */
    if (document.getElementById('subjectsGrid')) renderSubjectCards();
    /* Subject tab page — re-render so tick buttons reflect loaded state */
    if (_subjectPageSubject) {
      var activeBtn = document.querySelector('.tab-btn.active');
      var tabId = activeBtn ? activeBtn.dataset.tab : (SUBJECT_TABS[_subjectPageSubject.id] ? SUBJECT_TABS[_subjectPageSubject.id][0].id : null);
      if (tabId) renderTabContent(_subjectPageSubject, tabId);
      /* Also patch any chapter-done-btn already in the DOM in case tab didn't re-render */
      document.querySelectorAll('.chapter-done-btn').forEach(function(btn) {
        var key = btn.dataset.key || (btn.dataset.subject + '_chapter_' + btn.dataset.cid);
        var isDone = !!(_cachedChapterProgress[key] && _cachedChapterProgress[key].done);
        btn.classList.toggle('done', isDone);
      });
    }
    /* Learn page — app shell */
    if (document.getElementById('appSubjectsGrid')) {
      renderAppSubjects();
      renderContinueLearning();
      showMistakeBadge();
    }
  } catch (e) { console.warn('loadUserDataFromFirestore', e); }
}

/* ── MASTERY DISPLAY HELPERS ── */
var _testTimer = null;

function renderMasteryBadge(mastery) {
  var labels = { mastered: 'Mastered', proficient: 'Proficient', developing: 'Developing', learning: 'Learning', not_started: 'Not Started' };
  var m = mastery || 'not_started';
  return '<span class="mastery-badge ' + m + '">' + (labels[m] || m) + '</span>';
}

function getMasteryColor(mastery) {
  return { mastered: '#059669', proficient: '#2563EB', developing: '#D97706', learning: '#EF4444', not_started: '#D1D5DB' }[mastery] || '#D1D5DB';
}

/* ── Focus trap utility (used by modals and slide-in panels) ── */
var _lastModalTrigger = null;

function _installFocusTrap(el) {
  function handler(e) {
    if (e.key !== 'Tab') return;
    var focusable = Array.from(el.querySelectorAll(
      'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter(function(n) { return n.offsetParent !== null; });
    if (!focusable.length) { e.preventDefault(); return; }
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  el._focusTrapHandler = handler;
  el.addEventListener('keydown', handler);
}

function _removeFocusTrap(el) {
  if (el && el._focusTrapHandler) {
    el.removeEventListener('keydown', el._focusTrapHandler);
    delete el._focusTrapHandler;
  }
}

/* 0-100 readiness score derived from knowledge-map mastery levels */
function computeReadinessScore(km) {
  if (typeof DATA === 'undefined') return 0;
  var scoreMap = { mastered: 100, proficient: 75, developing: 50, learning: 25, not_started: 0 };
  var total = 0, sum = 0;
  DATA.subjects.forEach(function(sub) {
    sub.chapters.forEach(function(ch) {
      sum += scoreMap[( (km[sub.id + '_' + ch.id] || {}).mastery ) || 'not_started'];
      total++;
    });
  });
  return total ? Math.round(sum / total) : 0;
}

/* ── SEARCH ── */
function initSearch() {
  const inp = document.getElementById('searchInput');
  const res = document.getElementById('searchResults');
  if (!inp || !res) return;
  inp.addEventListener('input', () => {
    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) { res.classList.remove('show'); return; }
    const scored = [];
    DATA.subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        const title    = (ch.title    || '').toLowerCase();
        const subtitle = (ch.subtitle || '').toLowerCase();
        const kp       = (ch.keyPoints || []).join(' ').toLowerCase();
        let score = 0;
        if (title === q)                        score = 100; // exact title
        else if (title.startsWith(q))           score = 90;  // title starts with query
        else if (title.includes(q))             score = 80;  // title contains query
        else if (subtitle.includes(q))          score = 50;  // subtitle match
        else if (kp.includes(q))                score = 30;  // keyword match
        if (score > 0) scored.push({ sub, ch, score });
      });
    });
    scored.sort((a, b) => b.score - a.score);
    const hits = scored.slice(0, 5);
    res.innerHTML = hits.length === 0
      ? '<div class="search-result-item"><div class="result-title">No results found</div></div>'
      : hits.map(h =>
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
  if (!map[subjectId]) return;
  if (typeof getUser === 'function' && !getUser()) {
    window.location.href = 'auth.html?from=' + encodeURIComponent(location.href);
    return;
  }
  sessionStorage.setItem('openChapter', chapterId);
  window.location.href = map[subjectId];
}

/* ── MOBILE HAMBURGER MENU ── */
function initMobileNav() {
  if (document.getElementById('hamburgerBtn')) return;
  const nav = document.querySelector('.navbar');
  if (!nav) return;

  const ham = document.createElement('button');
  ham.className = 'hamburger';
  ham.id = 'hamburgerBtn';
  ham.setAttribute('aria-label', 'Toggle navigation menu');
  ham.setAttribute('aria-expanded', 'false');
  ham.setAttribute('aria-controls', 'mobileMenu');
  ham.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(ham);

  const menu = document.createElement('div');
  menu.className = 'mobile-menu';
  menu.id = 'mobileMenu';
  menu.innerHTML = `
    <div class="mobile-menu-inner">
      <a href="index.html" class="mobile-nav-link">Home</a>
      <div class="mobile-nav-section">Subjects</div>
      <a href="maths.html" class="mobile-nav-link mobile-sub-link">Mathematics</a>
      <a href="science.html" class="mobile-nav-link mobile-sub-link">Science</a>
      <a href="english.html" class="mobile-nav-link mobile-sub-link">English</a>
      <a href="social.html" class="mobile-nav-link mobile-sub-link">Social Science</a>
      <div class="mobile-menu-actions">
        <button class="btn-login">Log In</button>
        <button class="btn-signup">Sign Up Free</button>
      </div>
    </div>`;
  document.body.appendChild(menu);

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', String(open));
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
    document.querySelectorAll('.progress-fill[data-w],.scard-pfill[data-w]').forEach(el => el.style.width = el.dataset.w + '%');
    initReveal();
  }, 200);
}

function renderSubjectCards() {
  const grid = document.getElementById('subjectsGrid');
  if (!grid) return;
  const map = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
  const chipsMap = {
    maths:   ['Formulas', 'Q-Bank', 'PYQs'],
    science: ['Study Notes', 'MCQs', 'Q-Bank', 'PYQs'],
    english: ['First Flight', 'Grammar', 'PYQs'],
    social:  ['Notes', 'MCQs', 'Q-Bank', 'Maps', 'PYQs']
  };
  grid.innerHTML = DATA.subjects.map((sub, i) => {
    const pct = getSubjectPct(sub.id);
    const chips = chipsMap[sub.id] || [];
    const firstChaps = sub.chapters.slice(0, 3);
    const totalCh = sub.chapters.length;
    const doneCh = sub.chapters.filter(c => getChapterDone(sub.id + '_chapter_' + c.id)).length;
    const chHTML = firstChaps.map(c => {
      const done = getChapterDone(sub.id + '_chapter_' + c.id);
      return `<div class="scard-ch${done ? ' done' : ''}">
        <div class="scard-ch-num nm-${sub.id}">${c.id}</div>
        <div class="scard-ch-title">${c.title}</div>
        <div class="scard-ch-dot"></div>
      </div>`;
    }).join('');
    const remaining = totalCh - 3;
    const doneLabel = doneCh > 0 ? doneCh + ' of ' + totalCh + ' done' : totalCh + ' chapters';
    return `
    <a href="${map[sub.id]}" onclick="return guardNav(event,'${map[sub.id]}')" class="subject-card ${sub.id} reveal reveal-d${i + 1}">
      <div class="scard-top">
        <div class="card-icon-wrap"></div>
        <div>
          <div class="scard-name">${sub.name}</div>
          <div class="scard-count">${totalCh} chapters</div>
        </div>
      </div>
      <div class="scard-chips">${chips.map(c => `<span class="scard-chip">${c}</span>`).join('')}</div>
      <div class="scard-chapters">
        ${chHTML}
        ${remaining > 0 ? `<div class="scard-more">+${remaining} more chapters</div>` : ''}
      </div>
      <div class="scard-footer">
        <div class="scard-pbar-row"><span>${doneLabel}</span><span>${pct}%</span></div>
        <div class="scard-ptrack"><div class="scard-pfill" data-w="${pct}" style="width:0%"></div></div>
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
  _subjectPageSubject = subject;

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
            <a href="index.html">Home</a> / ${subject.name}
          </div>
          <h1>${subject.name}</h1>
          <p>${subject.description} &nbsp;&nbsp; ${subject.chapters.length} chapters</p>
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
          el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el, subject && subject.id);
        }
        break;
      case 'question-gen':      el.innerHTML = buildQuestionGenerator(subject); break;
      case 'questions':         el.innerHTML = buildPracticeQuestions(subject); initMCQHandlers(el, subject && subject.id); break;
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
      { title: 'Ch 1 Real Numbers',                    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch1-real-numbers.pdf' },
      { title: 'Ch 2 Polynomials',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch2-polynomials.pdf' },
      { title: 'Ch 3 Pair of Linear Equations',        desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch3-linear-equations.pdf' },
      { title: 'Ch 4 Quadratic Equations',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch4-quadratic-equations.pdf' },
      { title: 'Ch 5 Arithmetic Progressions',         desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch5-arithmetic-progressions.pdf' },
      { title: 'Ch 7 Coordinate Geometry',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch7-coordinate-geometry.pdf' },
      { title: 'Ch 8 Introduction to Trigonometry',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch8-introduction-to-trigonometry.pdf' },
      { title: 'Ch 9 Some Applications of Trigonometry', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch9-applications-of-trigonometry.pdf' },
      { title: 'Ch 11 Areas Related to Circles',       desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch11-areas-related-to-circles.pdf' },
      { title: 'Ch 12 Surface Areas and Volumes',      desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch12-surface-areas-and-volumes.pdf' },
      { title: 'Ch 13 Statistics',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch13-statistics.pdf' },
      { title: 'Ch 14 Probability',                    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/maths/qbank/ch14-probability.pdf' }
    ],
    formula: [
      { title: '📄 Complete Formula Sheet',                desc: 'All chapters · CBSE Class 10 Maths · PDF',       url: 'pdfs/maths/complete-formula-sheet.pdf' },
      { title: 'Ch 1 Real Numbers',                        desc: 'Number systems, HCF, LCM, Euclid\'s lemma',     url: 'assets/formula/ch01-real-numbers.png' },
      { title: 'Ch 2 Polynomials',                         desc: 'Zeros, factor theorem, division algorithm',      url: 'assets/formula/ch02-polynomials.png' },
      { title: 'Ch 3 Pair of Linear Equations',            desc: 'Methods: graphical, substitution, elimination',  url: 'assets/formula/ch03-linear-equations.png' },
      { title: 'Ch 4 Quadratic Equations',                 desc: 'Discriminant, quadratic formula, nature of roots',url: 'assets/formula/ch04-quadratic-equations.png' },
      { title: 'Ch 5 Arithmetic Progressions',             desc: 'nth term, sum of AP, key formulas',             url: 'assets/formula/ch05-arithmetic-progressions.png' },
      { title: 'Ch 6 Triangles',                           desc: 'Similarity, Thales theorem, Pythagoras',        url: 'assets/formula/ch06-triangles.png' },
      { title: 'Ch 7 Coordinate Geometry',                 desc: 'Distance, section, midpoint, area formulas',    url: 'assets/formula/ch07-coordinate-geometry.png' },
      { title: 'Ch 8 Introduction to Trigonometry',        desc: 'Ratios, identities, standard values',           url: 'assets/formula/ch08-trigonometry.png' },
      { title: 'Ch 9 Applications of Trigonometry',        desc: 'Heights & distances, angle of elevation',       url: 'assets/formula/ch09-applications-trigonometry.png' },
      { title: 'Ch 10 Circles',                            desc: 'Tangent, secant, arc, sector formulas',         url: 'assets/formula/ch10-circles.png' },
      { title: 'Ch 11 Areas Related to Circles',           desc: 'Area of sector, segment, ring formulas',        url: 'assets/formula/ch11-areas-related-to-circles.png' },
      { title: 'Ch 13 Surface Areas and Volumes',          desc: 'Cuboid, cylinder, cone, sphere formulas',       url: 'assets/formula/ch13-surface-areas-volumes.png' },
      { title: 'Ch 14 Statistics',                         desc: 'Mean, median, mode for grouped data',           url: 'assets/formula/ch14-statistics.png' }
    ],
    notes: [],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (30/1/1)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (30/1/2)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (30/1/3)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (30/1/1)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (30/1/2)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (30/1/3)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (30/1/1)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (30/1/2)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (30/1/3)',  desc: 'Mathematics Standard Theory, 80 marks, 3 hrs', url: 'pdfs/maths/pyqs/2023-qp-set3.pdf' },
      // ── 2022 ──────────────────────────────────────────────────────────
      { title: '2022 · Set 1 (30/2/1)',  desc: 'Mathematics Standard Term II, 40 marks, 2 hrs', url: 'pdfs/maths/pyqs/2022-qp-set1.pdf' }
    ]
  },
  science: {
    formula: [],
    notes: [
      { title: 'Ch 2 Acids, Bases and Salts',             desc: 'Complete Notes', url: 'pdfs/science/notes/ch2-acids-bases-salts.pdf' },
      { title: 'Ch 3 Metals and Non-Metals',              desc: 'Complete Notes', url: 'pdfs/science/notes/ch3-metals-and-non-metals.pdf' },
      { title: 'Ch 4 Carbon and Its Compounds',           desc: 'Complete Notes', url: 'pdfs/science/notes/ch4-carbon-and-compounds.pdf' },
      { title: 'Ch 5 Life Processes',                     desc: 'Complete Notes', url: 'pdfs/science/notes/ch5-life-processes.pdf' },
      { title: 'Ch 6 Control and Coordination',           desc: 'Complete Notes', url: 'pdfs/science/notes/ch6-control-and-coordination.pdf' },
      { title: 'Ch 7 How do Organisms Reproduce?',        desc: 'Complete Notes', url: 'pdfs/science/notes/ch7-how-organisms-reproduce.pdf' },
      { title: 'Ch 8 Heredity',                           desc: 'Complete Notes', url: 'pdfs/science/notes/ch8-heredity.pdf' },
      { title: 'Ch 9 Light: Reflection and Refraction',   desc: 'Complete Notes', url: 'pdfs/science/notes/ch9-light-reflection-refraction.pdf' },
      { title: 'Ch 10 The Human Eye and the Colourful World', desc: 'Complete Notes', url: 'pdfs/science/notes/ch10-human-eye-colourful-world.pdf' },
      { title: 'Ch 11 Electricity',                       desc: 'Complete Notes', url: 'pdfs/science/notes/ch11-electricity.pdf' },
      { title: 'Ch 12 Magnetic Effects of Electric Current', desc: 'Complete Notes', url: 'pdfs/science/notes/ch12-magnetic-effects.pdf' },
      { title: 'Ch 13 Our Environment',                   desc: 'Complete Notes', url: 'pdfs/science/notes/ch13-our-environment.pdf' }
    ],
    qbank: [
      { title: 'Ch 1 Chemical Reactions and Equations',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch1-chemical-reactions.pdf' },
      { title: 'Ch 2 Acids, Bases and Salts',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch2-acids-bases-salts.pdf' },
      { title: 'Ch 3 Metals and Non-Metals',              desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch3-metals-and-non-metals.pdf' },
      { title: 'Ch 4 Carbon and Its Compounds',           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch4-carbon-and-compounds.pdf' },
      { title: 'Ch 5 Life Processes',                     desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch5-life-processes.pdf' },
      { title: 'Ch 6 Control and Coordination',           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch6-control-and-coordination.pdf' },
      { title: 'Ch 7 How do Organisms Reproduce?',        desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch7-how-organisms-reproduce.pdf' },
      { title: 'Ch 8 Heredity',                           desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch8-heredity.pdf' },
      { title: 'Ch 9 Light: Reflection and Refraction',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch9-light-reflection-refraction.pdf' },
      { title: 'Ch 10 The Human Eye and the Colourful World', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch10-human-eye-colourful-world.pdf' },
      { title: 'Ch 11 Electricity',                       desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch11-electricity.pdf' },
      { title: 'Ch 12 Magnetic Effects of Electric Current', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch12-magnetic-effects.pdf' },
      { title: 'Ch 13 Our Environment',                   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/science/qbank/ch13-our-environment.pdf' }
    ],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (31/1/1)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (31/1/2)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (31/1/3)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (31/1/1)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (31/1/2)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (31/1/3)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (31/1/1)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (31/1/2)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (31/1/3)', desc: 'Science 80 marks, 3 hrs, 39 questions', url: 'pdfs/science/pyqs/2023-qp-set3.pdf' }
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
      { title: '2024 · Answer Key 1',     desc: 'CBSE Official Set 2/1/1',             url: 'pdfs/english/pyqs/2024-ms-set1.pdf' },
      { title: '2024 · Answer Key 2',     desc: 'CBSE Official Set 2/1/2',             url: 'pdfs/english/pyqs/2024-ms-set2.pdf' },
      { title: '2024 · Answer Key 3',     desc: 'CBSE Official Set 2/1/3',             url: 'pdfs/english/pyqs/2024-ms-set3.pdf' },
      { title: '2024 · Answer Key 4',     desc: 'CBSE Official Set 2/2/3',             url: 'pdfs/english/pyqs/2024-ms-set4.pdf' },
      { title: '2024 · Answer Key 5',     desc: 'CBSE Official Set 2/3/3',             url: 'pdfs/english/pyqs/2024-ms-set5.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set3.pdf' },
      { title: '2023 · Set 4',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set4.pdf' },
      { title: '2023 · Set 5',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2023-qp-set5.pdf' },
      { title: '2023 · Marking Scheme 1', desc: 'Official CBSE Answer Key Set 2/4/1', url: 'pdfs/english/pyqs/2023-ms-set1.pdf' },
      { title: '2023 · Marking Scheme 2', desc: 'Official CBSE Answer Key Set 2/4/3', url: 'pdfs/english/pyqs/2023-ms-set2.pdf' },
      // ── 2022 ──────────────────────────────────────────────────────────
      { title: '2022 · Set 1',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set1.pdf' },
      { title: '2022 · Set 2',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set2.pdf' },
      { title: '2022 · Set 3',            desc: 'CBSE Board Question Paper',             url: 'pdfs/english/pyqs/2022-qp-set3.pdf' }
    ],
    'first-flight': [
      { title: 'Ch 1 A Letter to God',              desc: 'Prose', url: 'pdfs/english/ch1-a-letter-to-god.pdf' },
      { title: 'Ch 2 Nelson Mandela',                desc: 'Prose', url: 'pdfs/english/ch2-nelson-mandela.pdf' },
      { title: 'Ch 3 Two Stories About Flying',      desc: 'Prose', url: 'pdfs/english/ch3-two-stories-about-flying.pdf' },
      { title: 'Ch 4 From the Diary of Anne Frank',  desc: 'Prose', url: 'pdfs/english/ch4-from-diary-of-anne-frank.pdf' },
      { title: 'Ch 6 Mijbil the Otter',              desc: 'Prose', url: 'pdfs/english/ch6-mijbil-the-otter.pdf' },
      { title: 'Ch 9 Madam Rides the Bus',           desc: 'Prose', url: 'pdfs/english/ch9-madam-rides-the-bus.pdf' },
      { title: 'Ch 10 The Sermon at Benares',        desc: 'Prose', url: 'pdfs/english/ch10-the-sermon-at-benares.pdf' },
      { title: 'Ch 11 The Proposal',                 desc: 'Play',  url: 'pdfs/english/ch11-the-proposal.pdf' },
      { title: 'Poem 1 Dust of Snow',                desc: 'Poetry', url: 'pdfs/english/poem1-dust-of-snow.pdf' },
      { title: 'Poem 2 Fire and Ice',                desc: 'Poetry', url: 'pdfs/english/poem2-fire-and-ice.pdf' },
      { title: 'Poem 3 A Tiger in the Zoo',          desc: 'Poetry', url: 'pdfs/english/poem3-a-tiger-in-the-zoo.pdf' },
      { title: 'Poem 4 How to Tell Wild Animals',    desc: 'Poetry', url: 'pdfs/english/poem4-how-to-tell-wild-animals.pdf' },
      { title: 'Poem 5 The Ball Poem',               desc: 'Poetry', url: 'pdfs/english/poem5-the-ball-poem.pdf' },
      { title: 'Poem 6 Amanda!',                     desc: 'Poetry', url: 'pdfs/english/poem6-amanda.pdf' },
      { title: 'Poem 7 The Trees',                   desc: 'Poetry', url: 'pdfs/english/poem7-the-trees.pdf' },
      { title: 'Poem 8 Fog',                         desc: 'Poetry', url: 'pdfs/english/poem8-fog.pdf' },
      { title: 'Poem 9 The Tale of Custard the Dragon', desc: 'Poetry', url: 'pdfs/english/poem9-tale-of-custard-the-dragon.pdf' },
      { title: 'Poem 10 For Anne Gregory',           desc: 'Poetry', url: 'pdfs/english/poem10-for-anne-gregory.pdf' }
    ],
    footprints: [
      { title: 'Ch 1 A Triumph of Surgery',       desc: 'Prose', url: 'pdfs/english/fw-ch1-a-triumph-of-surgery.pdf' },
      { title: 'Ch 2 The Thief\'s Story',         desc: 'Prose', url: 'pdfs/english/fw-ch2-the-thiefs-story.pdf' },
      { title: 'Ch 3 The Midnight Visitor',       desc: 'Prose', url: 'pdfs/english/fw-ch3-the-midnight-visitor.pdf' },
      { title: 'Ch 4 A Question of Trust',        desc: 'Prose', url: 'pdfs/english/fw-ch4-a-question-of-trust.pdf' },
      { title: 'Ch 5 Footprints Without Feet',    desc: 'Prose', url: 'pdfs/english/fw-ch5-footprints-without-feet.pdf' },
      { title: 'Ch 7 The Necklace',               desc: 'Prose', url: 'pdfs/english/fw-ch7-the-necklace.pdf' },
      { title: 'Ch 8 Bholi',                      desc: 'Prose', url: 'pdfs/english/fw-ch8-bholi.pdf' }
    ]
  },
  social: {
    formula: [], notes: [],
    notes_history: [
      { title: 'Ch 1 The Rise of Nationalism in Europe', desc: 'AbiLearn Notes · Proper Big-Font', url: 'pdfs/social/notes/history/ch1-rise-of-nationalism.pdf' },
      { title: 'Ch 2 Nationalism in India',              desc: 'AbiLearn Notes · Clean Structured', url: 'pdfs/social/notes/history/ch2-nationalism-in-india.pdf' },
      { title: 'Ch 3 The Making of a Global World',      desc: 'AbiLearn Notes · 9 Subtopics',     url: 'pdfs/social/notes/history/ch3-making-of-global-world.pdf' }
    ],
    notes_geography: [
      { title: 'Ch 1 Resources and Development',         desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch1-resources-development.pdf' },
      { title: 'Ch 2 Forest and Wildlife Resources',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch2-forest-wildlife.pdf' },
      { title: 'Ch 3 Water Resources',                   desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch3-water-resources.pdf' },
      { title: 'Ch 4 Agriculture',                       desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch4-agriculture.pdf' },
      { title: 'Ch 5 Minerals and Energy Resources',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch5-minerals-energy.pdf' },
      { title: 'Ch 6 Manufacturing Industries',          desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/geography/ch6-manufacturing-industries.pdf' }
    ],
    notes_civics: [
      { title: 'Ch 1 Power-Sharing',                     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/civics/ch1-power-sharing.pdf' },
      { title: 'Ch 2 Federalism',                        desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/civics/ch2-federalism.pdf' }
    ],
    notes_economics: [
      { title: 'Ch 1 Development',                       desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch1-development.pdf' },
      { title: 'Ch 2 Sectors of the Indian Economy',     desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch2-sectors-economy.pdf' },
      { title: 'Ch 3 Money and Credit',                  desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch3-money-credit.pdf' },
      { title: 'Ch 4 Globalisation and the Indian Economy', desc: 'AbiLearn Notes · Deep Structured', url: 'pdfs/social/notes/economics/ch4-globalisation.pdf' }
    ],
    history: [
      { title: 'Ch 1 The Rise of Nationalism in Europe', desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch1-rise-of-nationalism.pdf' },
      { title: 'Ch 2 Nationalism in India',              desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch2-nationalism-in-india.pdf' },
      { title: 'Ch 5 Print Culture and the Modern World',desc: 'Question Bank · 2M + 3M + 5M · PYQ-Based 2020–2024', url: 'pdfs/social/history/ch5-print-culture.pdf' }
    ],
    geography: [
      { title: 'Ch 1 Resources and Development',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch1-resources-and-development.pdf' },
      { title: 'Ch 2 Forest and Wildlife Resources',desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch2-forest-and-wildlife.pdf' },
      { title: 'Ch 3 Water Resources',             desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch3-water-resources.pdf' },
      { title: 'Ch 4 Agriculture',                 desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch4-agriculture.pdf' },
      { title: 'Ch 5 Minerals and Energy Resources',desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch5-minerals-and-energy.pdf' },
      { title: 'Ch 6 Manufacturing Industries',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/geography/ch6-manufacturing-industries.pdf' }
    ],
    civics: [
      { title: 'Ch 1 Power Sharing',            desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch1-power-sharing.pdf' },
      { title: 'Ch 2 Federalism',               desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch2-federalism.pdf' },
      { title: 'Ch 3 Democracy and Diversity',      desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch3-democracy-and-diversity.pdf' },
      { title: 'Ch 4 Gender, Religion and Caste',   desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch4-gender-religion-caste.pdf' },
      { title: 'Ch 5 Popular Struggles',            desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/civics/ch5-popular-struggles.pdf' }
    ],
    economics: [
      { title: 'Ch 1 Development',                      desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch1-development.pdf' },
      { title: 'Ch 2 Sectors of the Indian Economy',    desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch2-sectors-of-economy.pdf' },
      { title: 'Ch 3 Money and Credit',                 desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch3-money-and-credit.pdf' },
      { title: 'Ch 4 Globalisation and the Indian Economy', desc: 'Question Bank · 2M + 3M + 5M', url: 'pdfs/social/economics/ch4-globalisation.pdf' }
    ],
    pyqs: [
      // ── 2025 ──────────────────────────────────────────────────────────
      { title: '2025 · Set 1 (32/1/1)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set1.pdf' },
      { title: '2025 · Set 2 (32/1/2)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set2.pdf' },
      { title: '2025 · Set 3 (32/1/3)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2025-qp-set3.pdf' },
      // ── 2024 ──────────────────────────────────────────────────────────
      { title: '2024 · Set 1 (32/1/1)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set1.pdf' },
      { title: '2024 · Set 2 (32/1/2)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set2.pdf' },
      { title: '2024 · Set 3 (32/1/3)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2024-qp-set3.pdf' },
      // ── 2023 ──────────────────────────────────────────────────────────
      { title: '2023 · Set 1 (32/1/1)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set1.pdf' },
      { title: '2023 · Set 2 (32/1/2)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set2.pdf' },
      { title: '2023 · Set 3 (32/1/3)', desc: 'Social Science 80 marks, 3 hrs, includes map', url: 'pdfs/social/pyqs/2023-qp-set3.pdf' }
    ]
  }
};

/* Resolve PDF URL for iframe local paths pass through, Drive links convert to embed */
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
  var entry = _cachedPdfProgress[url];
  return !!(entry && entry.completed);
}
function togglePDFDone(btn, url) {
  var user = (typeof getUser === 'function') ? getUser() : null;
  if (!user) return;
  var nowDone = !getPDFDone(url);
  _cachedPdfProgress[url] = { url: url, completed: nowDone };
  btn.classList.toggle('done', nowDone);
  btn.title = nowDone ? 'Mark as unread' : 'Mark as read';
  if (typeof DB !== 'undefined') {
    var titleEl = btn.closest('.pdf-card') && btn.closest('.pdf-card').querySelector('.pdf-card-title');
    var title = titleEl ? titleEl.textContent.trim() : url;
    DB.setPdfDone(url, title, nowDone, user.uid);
  }
}

function getChapterDone(key) {
  /* 1. Firestore cache (populated after auth) */
  if (_cachedChapterProgress[key] && _cachedChapterProgress[key].done) return true;
  /* 2. Instant email-free cache (available before auth resolves) */
  if (_cpLoad()[key]) return true;
  return false;
}

function toggleChapterDone(btn, key) {
  var user = (typeof getUser === 'function') ? getUser() : null;
  if (!user) return;
  var nowDone = !getChapterDone(key);
  _cachedChapterProgress[key] = { done: nowDone };
  _cpSave(key, nowDone);
  btn.classList.toggle('done', nowDone);
  btn.title = nowDone ? 'Mark as incomplete' : 'Mark as complete';
  if (typeof DB !== 'undefined') {
    DB.setChapterDone(key, nowDone, user.uid);
  }
  // If the progress tab is currently open, refresh it live
  var activeTab = document.querySelector('.tab-btn.active');
  if (activeTab && activeTab.dataset.tab === 'progress' && _subjectPageSubject) {
    var tc = document.getElementById('tabContent');
    if (tc) tc.innerHTML = buildProgressTab(_subjectPageSubject);
  }
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
        
        <div class="pdf-card-info">
          <div class="pdf-card-title">${escH(p.title)}</div>
          <div class="pdf-card-desc">${escH(p.desc || '')}</div>
        </div>
        <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
      </div>`;
    }).join('')}
  </div>`;
}

/* PDF.js popup renders PDF or image directly, no external viewer */
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
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Document viewer');
    modal.innerHTML = `
      <div class="pdf-modal-box">
        <button class="pdf-float-close" aria-label="Close document" onclick="closePDF()">✕</button>
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
  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() {
    var closeBtn = modal.querySelector('.pdf-float-close');
    if (closeBtn) closeBtn.focus();
  });
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

    // clientWidth can be 0 on mobile before layout settles fall back to innerWidth
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
  if (m) { _removeFocusTrap(m); m.classList.remove('open'); }
  document.body.style.overflow = '';
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
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
      <h2 class="section-title" style="margin-bottom:1.5rem;margin-top:${cards ? '2rem' : '0'}">📐 Formula Sheet ${subject.name}</h2>
      <div class="formula-sheet">
        ${chapters.map(ch => {
          const dk = subject.id + '_formula_' + ch.id;
          const chDone = getChapterDone(dk);
          return `
          <div class="formula-chapter-block reveal">
            <div class="formula-chapter-title">
              <span class="formula-num" style="background:${color}">${ch.id}</span>
              <span style="flex:1;min-width:0">${ch.title}</span>
            </div>
            <div class="formula-grid">
              ${ch.formulas.map(f => `<div class="formula-pill">${escH(f)}</div>`).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>` : ''}`;
}

/* ══════════════════════════════════════
   IMPORTANT NOTES
══════════════════════════════════════ */
function buildImportantNotes(subject) {
  const cards = pdfCards(subject, 'notes');
  if (!cards) return buildComingSoon('Study Notes', 'Chapter PDFs will be added here soon.');
  return `
    <h2 class="section-title" style="margin-bottom:1rem">Study PDFs</h2>
    ${cards}`;
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
        <div class="mcq-card reveal" data-correct="${q.ans}" data-exp="${escH(q.exp || '')}" data-explbl="${escH(q.opts[q.ans])}" data-subject-id="${subject.id}" data-chapter-id="${q.chId}" data-q-idx="${qi}">
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

function initMCQHandlers(container, subjectId) {
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
    // Record attempt in Firestore
    var user = (typeof getUser === 'function') ? getUser() : null;
    if (user && typeof DB !== 'undefined') {
      var subId    = card.dataset.subjectId || subjectId || '';
      var chId     = card.dataset.chapterId || '';
      var qIdx     = card.dataset.qIdx !== undefined ? parseInt(card.dataset.qIdx) : -1;
      var isCorrect = chosen === correct;
      DB.recordAttempt({ subjectId: subId, chapterId: chId, questionIdx: qIdx, chosen: chosen, correct: correct, isCorrect: isCorrect }, user.uid);
      DB.recordStudyActivity(user.uid);
      DB.updateMasteryAfterAttempt(subId, chId, isCorrect, user.uid).then(function(m) {
        if (m) { var k = subId + '_' + chId; _cachedKnowledgeMap[k] = Object.assign(_cachedKnowledgeMap[k] || {}, { mastery: m }); }
      });
      if (!isCorrect && chId && subId) {
        var optTexts = Array.from(card.querySelectorAll('.mcq-opt')).map(function(b) {
          var sp = b.querySelector('.opt-letter');
          return sp ? b.textContent.slice(sp.textContent.length).trim() : b.textContent.trim();
        });
        DB.recordMistake(subId + '_' + chId + '_' + qIdx, {
          subjectId: subId, chapterId: chId, questionIdx: qIdx,
          question: (card.querySelector('.mcq-q') || {}).textContent || '',
          correct: correct, chosen: chosen,
          correctText: optTexts[correct] || '', chosenText: optTexts[chosen] || ''
        }, user.uid);
      }
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
    const mastery = (_cachedKnowledgeMap['science_' + ch.id] || {}).mastery || 'not_started';
    const chDoneKey = 'science_mcq_' + ch.id;
    const chDone = getChapterDone(chDoneKey);
    return `
      <div class="pdf-card">
        <div class="pdf-card-icon">🧪</div>
        <div class="pdf-card-info">
          <div class="pdf-card-title">Ch ${ch.id}: ${escH(ch.title)}</div>
          <div class="pdf-card-desc">${count} MCQs &nbsp;${renderMasteryBadge(mastery)}</div>
        </div>
        <button class="pdf-test-btn" onclick="openTestMode(${ch.id}, '${escH(ch.title)}', 'science')">Test</button>
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
      const mastery = (_cachedKnowledgeMap['social_' + id] || {}).mastery || 'not_started';
      const chDoneKey = 'social_mcq_' + id;
      const chDone = getChapterDone(chDoneKey);
      return `
        <div class="pdf-card">
          <div class="pdf-card-icon">${s.icon}</div>
          <div class="pdf-card-info">
            <div class="pdf-card-title">${escH(ch.title)}</div>
            <div class="pdf-card-desc">${count} MCQs · ${s.key} &nbsp;${renderMasteryBadge(mastery)}</div>
          </div>
          <button class="pdf-test-btn" onclick="openTestMode(${id}, '${escH(ch.title)}', 'social')">Test</button>
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
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'mcqModalTitle');
    modal.innerHTML = `
      <div class="mcq-modal-box">
        <div class="mcq-modal-hdr">
          <div class="mcq-modal-title-wrap">
            <span class="mcq-modal-title" id="mcqModalTitle"></span>
            <span class="mcq-modal-meta" id="mcqModalMeta"></span>
          </div>
          <div style="display:flex;align-items:center;gap:0.6rem">
            <span class="mcq-score-pill" id="mcqScorePill">0 / 0</span>
            <button class="mcq-modal-close" aria-label="Close" onclick="closeMCQModal()">✕</button>
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
      <div class="mcq-card" data-correct="${q.ans}" data-exp="${escH(q.exp || '')}" data-explbl="${escH(q.opts[q.ans])}" data-q-idx="${qi}">
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

  if (body._mcqHandler) body.removeEventListener('click', body._mcqHandler);
  body._mcqHandler = function handler(e) {
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
    // Record attempt in Firestore
    var user = (typeof getUser === 'function') ? getUser() : null;
    if (user && typeof DB !== 'undefined') {
      var isCorr = chosen === correct;
      var qi = card.dataset.qIdx !== undefined ? parseInt(card.dataset.qIdx) : -1;
      DB.recordAttempt({ subjectId: subject, chapterId: String(chId), questionIdx: qi, chosen: chosen, correct: correct, isCorrect: isCorr }, user.uid);
      DB.recordStudyActivity(user.uid);
      DB.updateMasteryAfterAttempt(subject, String(chId), isCorr, user.uid).then(function(m) {
        if (m) { var k = subject + '_' + chId; _cachedKnowledgeMap[k] = Object.assign(_cachedKnowledgeMap[k] || {}, { mastery: m }); }
      });
      if (!isCorr) {
        var optTxts = Array.from(card.querySelectorAll('.mcq-opt')).map(function(b) {
          var sp = b.querySelector('.opt-letter');
          return sp ? b.textContent.slice(sp.textContent.length).trim() : b.textContent.trim();
        });
        DB.recordMistake(subject + '_' + chId + '_' + qi, {
          subjectId: subject, chapterId: String(chId), questionIdx: qi,
          question: (card.querySelector('.mcq-q') || {}).textContent || '',
          correct: correct, chosen: chosen,
          correctText: optTxts[correct] || '', chosenText: optTxts[chosen] || ''
        }, user.uid);
      }
    }
    // update score pill
    const answered = body.querySelectorAll('.mcq-feedback.show').length;
    const correct2 = body.querySelectorAll('.mcq-feedback.correct').length;
    document.getElementById('mcqScorePill').textContent = `${correct2} / ${answered}`;
    // show session summary when all questions answered
    if (answered === mcqs.length && !body.querySelector('.mcq-session-summary')) {
      const accuracy = Math.round((correct2 / mcqs.length) * 100);
      const sm = (accuracy >= 85 && mcqs.length >= 10) ? 'mastered' : accuracy >= 70 ? 'proficient' : accuracy >= 50 ? 'developing' : 'learning';
      const msgs = { mastered: '🏆 Chapter mastered!', proficient: '👍 Great performance!', developing: '📚 Keep practicing.', learning: '🔄 Review and retry.' };
      const summEl = document.createElement('div');
      summEl.className = 'mcq-session-summary';
      summEl.innerHTML =
        '<div class="summary-score-big">' + correct2 + ' / ' + mcqs.length + '</div>' +
        '<div class="summary-accuracy">' + accuracy + '% accuracy</div>' +
        '<div style="margin:0.75rem 0">' + renderMasteryBadge(sm) + '</div>' +
        '<div class="summary-message">' + escH(msgs[sm]) + '</div>' +
        (correct2 < mcqs.length ? '<a href="mistakes.html" class="btn btn-secondary" style="margin-top:1rem;display:inline-block;margin-right:0.5rem">Review Mistakes</a>' : '') +
        '<button class="btn btn-primary" style="margin-top:1rem" onclick="closeMCQModal()">Done</button>';
      body.appendChild(summEl);
      summEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  body.addEventListener('click', body._mcqHandler);

  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() {
    var closeBtn = modal.querySelector('.mcq-modal-close');
    if (closeBtn) closeBtn.focus();
  });
  body.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeMCQModal() {
  const modal = document.getElementById('mcqModal');
  if (modal) {
    modal.classList.remove('open');
    _removeFocusTrap(modal);
    const b = document.getElementById('mcqModalBody');
    if (b) b.innerHTML = '';
  }
  document.body.style.overflow = '';
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
}

// Escape key closes MCQ and Test modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeMCQModal(); if (typeof closeTestModal === 'function') closeTestModal(); }
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
        <h3>PYQs Coming Soon</h3>
        <p>CBSE Board exam question papers will be added here soon.</p>
      </div>`;
  }
  return `
    <div>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
        <h2 class="section-title" style="margin:0">Previous Year Question Papers</h2>
        <span style="font-size:0.78rem;color:var(--muted);background:var(--surface);padding:0.2rem 0.65rem;border-radius:20px">2022 · 2023 · 2024 · 2025</span>
      </div>
      ${cards}
    </div>`;
}

/* ══════════════════════════════════════
   MOST IMPORTANT TOPICS (Science)
══════════════════════════════════════ */
function buildMostImportant(subject) {
  const chapters = [
    {
      id: 1, title: 'Chemical Reactions and Equations',
      items: [
        { tag: 'must know', text: 'Types of reactions Combination, Decomposition, Displacement, Double Displacement, Oxidation-Reduction. Write one balanced equation for each.' },
        { tag: 'concept', text: 'Oxidation = loss of electrons / gain of oxygen. Reduction = gain of electrons / loss of oxygen. OIL RIG remember this.' },
        { tag: 'formula', text: 'Balancing equations: atoms of each element must be equal on both sides. Check H and O last.' },
        { tag: 'definition', text: 'Corrosion metals reacting with air/moisture (rust = Fe₂O₃·xH₂O). Rancidity oxidation of fats/oils in food.' },
        { tag: 'must know', text: 'Exothermic reactions release heat (combustion, respiration). Endothermic reactions absorb heat (photosynthesis, decomposition of CaCO₃).' }
      ]
    },
    {
      id: 2, title: 'Acids, Bases and Salts',
      items: [
        { tag: 'must know', text: 'pH scale: acids < 7, neutral = 7, bases > 7. Universal indicator colour sequence: red → orange → yellow → green → blue → violet.' },
        { tag: 'formula', text: 'Neutralisation: HCl + NaOH → NaCl + H₂O. Acid + Base → Salt + Water. Always remember this.' },
        { tag: 'must know', text: 'Baking soda = NaHCO₃ (used in cooking, antacid). Washing soda = Na₂CO₃·10H₂O (cleaning). Bleaching powder = CaOCl₂. Plaster of Paris = CaSO₄·½H₂O.' },
        { tag: 'concept', text: 'Dry HCl gas does not turn moist litmus red H⁺ ions only form when dissolved in water. Common board question.' },
        { tag: 'definition', text: 'Dilute acid ≠ weak acid. Concentration refers to amount dissolved. Strength refers to degree of ionisation.' }
      ]
    },
    {
      id: 3, title: 'Metals and Non-Metals',
      items: [
        { tag: 'must know', text: 'Reactivity series (high to low): K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au. Metals above H displace H from dilute acids.' },
        { tag: 'concept', text: 'Ionic bond: metal loses electrons → cation; non-metal gains electrons → anion. Example: Na → Na⁺, Cl → Cl⁻ → NaCl.' },
        { tag: 'must know', text: 'Corrosion of iron: 4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O. Prevention: painting, galvanising, alloying, oil/grease.' },
        { tag: 'definition', text: 'Alloys: Brass = Cu + Zn. Bronze = Cu + Sn. Solder = Pb + Sn. Stainless steel = Fe + Cr + Ni.' },
        { tag: 'concept', text: 'Amphoteric metals (Al, Zn) react with both acids and bases. Al + NaOH → NaAlO₂ + H₂.' }
      ]
    },
    {
      id: 4, title: 'Carbon and Its Compounds',
      items: [
        { tag: 'concept', text: 'Carbon has 4 valence electrons → forms 4 covalent bonds → chains, rings, branches. Catenation + tetravalency = huge diversity of compounds.' },
        { tag: 'must know', text: 'Allotropes: Diamond (hard, tetrahedral, non-conductor). Graphite (soft, layered, conducts electricity). Fullerene (C₆₀, ball shape).' },
        { tag: 'must know', text: 'Functional groups: −OH (alcohol), −CHO (aldehyde), −COOH (carboxylic acid), −CO− (ketone), −Cl/−Br (halogens).' },
        { tag: 'formula', text: 'Ethanol oxidised to Ethanoic acid: CH₃CH₂OH → CH₃COOH. Ethanoic acid is vinegar (acetic acid, smells sour, MP 17°C glacial acetic acid).' },
        { tag: 'must know', text: 'Soaps vs Detergents: both have hydrophilic head + hydrophobic tail (micelle). Soaps fail in hard water (Ca²⁺/Mg²⁺ form scum). Detergents work in hard water.' }
      ]
    },
    {
      id: 5, title: 'Life Processes',
      items: [
        { tag: 'formula', text: 'Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (sunlight + chlorophyll). Light reaction in thylakoid; dark reaction in stroma.' },
        { tag: 'formula', text: 'Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (38 ATP). Anaerobic in yeast: glucose → ethanol + CO₂. In muscles: glucose → lactic acid.' },
        { tag: 'diagram', text: 'Human digestive system: mouth (salivary amylase) → oesophagus → stomach (HCl + pepsin) → small intestine (bile + pancreatic juice) → villi (absorption) → large intestine.' },
        { tag: 'diagram', text: 'Human heart: 4 chambers. Right side → deoxygenated blood → lungs. Left side → oxygenated blood → body. Double circulation. SA node = pacemaker.' },
        { tag: 'must know', text: 'Nephron: filtration in glomerulus (Bowman\'s capsule) → reabsorption in tubule → urine. Kidney function: filter 180L/day, produce ~1.5L urine.' }
      ]
    },
    {
      id: 6, title: 'Control and Coordination',
      items: [
        { tag: 'diagram', text: 'Neuron: dendrite → cell body → axon → nerve ending (synapse). Impulse travels as electrical signal; crosses synapse via chemical neurotransmitters.' },
        { tag: 'must know', text: 'Reflex arc: receptor → sensory neuron → spinal cord (relay neuron) → motor neuron → effector. Bypasses brain faster response.' },
        { tag: 'must know', text: 'Endocrine glands: Pituitary (master gland, GH), Thyroid (thyroxin metabolism), Adrenal (adrenaline fight/flight), Pancreas (insulin lowers glucose; glucagon raises glucose).' },
        { tag: 'must know', text: 'Plant hormones: Auxin (promotes elongation on shaded side → bending toward light). Gibberellin (stem growth). Cytokinin (cell division). Abscisic acid (inhibits growth, causes wilting).' },
        { tag: 'concept', text: 'Tropic movements: Phototropism (towards light), Geotropism (root down, stem up), Hydrotropism (roots towards water), Thigmotropism (touch tendrils).' }
      ]
    },
    {
      id: 7, title: 'How do Organisms Reproduce?',
      items: [
        { tag: 'must know', text: 'Asexual reproduction: Binary fission (Amoeba, Paramecium), Budding (Hydra, Yeast), Fragmentation (Spirogyra), Regeneration (Planaria), Spore formation (Rhizopus), Vegetative propagation (plants).' },
        { tag: 'diagram', text: 'Male reproductive system: testes (in scrotum, 2–3°C below body, produce sperm + testosterone) → epididymis → vas deferens → urethra. Accessory glands: seminal vesicle, prostate, Cowper\'s.' },
        { tag: 'diagram', text: 'Female reproductive system: ovaries (produce eggs + oestrogen/progesterone) → fallopian tube (fertilisation here) → uterus (implantation) → vagina.' },
        { tag: 'concept', text: 'Placenta: exchange of nutrients, O₂, CO₂ between mother and foetus. Also secretes hormones. Umbilical cord connects foetus to placenta.' },
        { tag: 'must know', text: 'Contraception: Barrier (condom, diaphragm), Chemical (pills prevent ovulation), IUCD (copper-T), Surgical (vasectomy, tubectomy permanent). All prevent fertilisation or implantation.' }
      ]
    },
    {
      id: 8, title: 'Heredity',
      items: [
        { tag: 'must know', text: 'Mendel\'s Laws: (1) Law of Dominance dominant trait expressed when both alleles present. (2) Law of Segregation alleles separate during gamete formation. (3) Law of Independent Assortment genes on different chromosomes assort independently.' },
        { tag: 'must know', text: 'Monohybrid cross: Tt × Tt → TT : Tt : tt = 1:2:1. Phenotype ratio = 3 Tall : 1 Short. F₁ all Tt (tall); F₂ = 3:1.' },
        { tag: 'must know', text: 'Dihybrid cross: RrYy × RrYy → 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green (9:3:3:1).' },
        { tag: 'must know', text: 'Sex determination: Female = XX, Male = XY. Father determines sex 50% chance of XX or XY. In grasshopper: XO (male), XX (female).' },
        { tag: 'concept', text: 'Acquired traits NOT inherited (cutting a dog\'s tail doesn\'t make offspring born tailless). Inherited traits are present in DNA from birth.' }
      ]
    },
    {
      id: 9, title: 'Light Reflection and Refraction',
      items: [
        { tag: 'formula', text: 'Mirror formula: 1/v + 1/u = 1/f; focal length f = R/2. Magnification m = −v/u = h′/h. Negative m → inverted image. |m| > 1 → magnified.' },
        { tag: 'formula', text: 'Lens formula: 1/v − 1/u = 1/f. Power: P = 1/f (f in metres), unit = dioptre (D). Convex lens: +P. Concave lens: −P.' },
        { tag: 'must know', text: 'Sign convention: all distances from pole (mirror) / optical centre (lens). Incident light goes left to right. Distances in direction of light are positive (+); opposite are negative (−).' },
        { tag: 'must know', text: 'Numericals are guaranteed practise mirror and lens problems. u is always negative for real objects. Always write formula, substitute, and calculate step by step.' },
        { tag: 'concept', text: 'Refractive index: n = c/v = sin i / sin r. Denser medium → lower speed → bends towards normal. n_glass ≈ 1.5, n_water ≈ 1.33.' }
      ]
    },
    {
      id: 10, title: 'The Human Eye and the Colourful World',
      items: [
        { tag: 'must know', text: 'Myopia (near-sightedness): image forms in front of retina, see near objects. Corrected by concave (diverging) lens. Hypermetropia (far-sightedness): image behind retina. Corrected by convex (converging) lens.' },
        { tag: 'diagram', text: 'Human eye parts: Cornea (main refraction), Iris (controls pupil size), Lens (fine focusing power of accommodation), Retina (image formed), Optic nerve (to brain). Ciliary muscles adjust lens shape.' },
        { tag: 'must know', text: 'Dispersion through prism: white light splits into VIBGYOR. Violet bends most (shortest wavelength), Red bends least (longest wavelength). Rainbow is natural dispersion.' },
        { tag: 'concept', text: 'Tyndall effect: scattering of light by colloidal particles. Explains why headlights are visible in fog, why milk looks white.' },
        { tag: 'must know', text: 'Sky is blue: air molecules scatter blue light (short wavelength) more. Sunrise/sunset is red/orange: longer path → blue scattered away, only red/orange reaches eyes.' }
      ]
    },
    {
      id: 11, title: 'Electricity',
      items: [
        { tag: 'formula', text: 'Ohm\'s Law: V = IR. Resistance: R = ρl/A (ρ = resistivity). Series: R = R₁ + R₂ + R₃. Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃.' },
        { tag: 'formula', text: 'Electric power: P = VI = I²R = V²/R. Joule\'s heating: H = I²Rt (joules). Electric energy: E = Pt. 1 kWh = 1 unit = 3.6 × 10⁶ J. Electricity bill = units × rate.' },
        { tag: 'must know', text: 'Numericals are always in the paper resistors in series/parallel, current through each, power consumed, electricity bill calculation. Practise all types.' },
        { tag: 'concept', text: 'Why parallel connection in homes: every device gets full 220V; devices work independently; total resistance decreases so more current can flow; failure of one doesn\'t affect others.' },
        { tag: 'must know', text: 'Potential difference (V) = work done per unit charge = W/Q. Current (I) = charge per second = Q/t. Ampere (A), Ohm (Ω), Volt (V), Watt (W) know all units.' }
      ]
    },
    {
      id: 12, title: 'Magnetic Effects of Electric Current',
      items: [
        { tag: 'must know', text: 'Right-hand thumb rule: if thumb points in direction of current, curled fingers show direction of magnetic field around the wire.' },
        { tag: 'must know', text: 'Fleming\'s Left-hand Rule (motor effect): stretch thumb, index finger, middle finger mutually perpendicular. Index = magnetic field (B), Middle = current (I), Thumb = force/motion (F).' },
        { tag: 'must know', text: 'Fleming\'s Right-hand Rule (generator): same hand setup but for induced current. Thumb = motion of conductor, Index = magnetic field, Middle = induced current direction.' },
        { tag: 'concept', text: 'Electric motor: converts electrical energy → mechanical energy. Uses: fans, mixers, washing machines. Generator (dynamo): mechanical → electrical (Faraday\'s electromagnetic induction).' },
        { tag: 'diagram', text: 'Solenoid: coil of wire → acts as bar magnet when current flows. Used in electromagnets. A fuse wire melts when current exceeds safe limit safety device in circuits.' }
      ]
    },
    {
      id: 13, title: 'Our Environment',
      items: [
        { tag: 'must know', text: '10% law (Lindemann): only 10% of energy at one trophic level passes to the next. 90% lost as heat. This limits food chains to 4–5 trophic levels.' },
        { tag: 'must know', text: 'Food chain example: Grass → Grasshopper → Frog → Snake → Hawk. Producer → Primary consumer → Secondary → Tertiary → Quaternary. Energy decreases at each level.' },
        { tag: 'must know', text: 'Ozone depletion: CFCs (chlorofluorocarbons from ACs/refrigerators) rise to stratosphere → UV breaks them → Cl radicals catalytically destroy O₃. UV radiation reaches earth → skin cancer, cataracts.' },
        { tag: 'must know', text: 'Biodegradable waste: food waste, paper, cotton broken down by microorganisms. Non-biodegradable: plastic, DDT, glass persist in environment, cause biomagnification.' },
        { tag: 'concept', text: 'Ecosystem components: Biotic (producers → consumers → decomposers) + Abiotic (temperature, water, soil, light). Decomposers (bacteria, fungi) recycle nutrients back to soil.' }
      ]
    }
  ];

  const tagColor = {
    'must know': '#EF4444',
    'formula':   '#0EA5E9',
    'concept':   '#7C3AED',
    'diagram':   '#F59E0B',
    'definition':'#10B981'
  };

  return `
    <h2 class="section-title" style="margin-bottom:0.4rem">Most Important</h2>
    <p style="color:var(--muted);margin-bottom:1.75rem;font-size:0.85rem;padding-left:0.9rem">High-probability topics for every chapter board exam focus</p>
    <div style="display:flex;flex-direction:column;gap:1.1rem">
      ${chapters.map(ch => `
        <div class="mi-chapter-block">
          <div class="mi-chapter-hdr">
            <span class="mi-ch-num">${ch.id}</span>
            <span class="mi-ch-title">${ch.title}</span>
          </div>
          <div class="mi-items">
            ${ch.items.map(item => {
              const ci = item.text.indexOf(':');
              const textHtml = ci > 0
                ? `<strong>${escH(item.text.slice(0, ci))}</strong>${escH(item.text.slice(ci))}`
                : escH(item.text);
              return `
              <div class="mi-item">
                <span class="mi-tag" style="background:${tagColor[item.tag] || '#6B7280'}20;color:${tagColor[item.tag] || '#6B7280'};border:1px solid ${tagColor[item.tag] || '#6B7280'}40">${item.tag}</span>
                <span class="mi-text">${textHtml}</span>
              </div>`;
            }).join('')}
          </div>
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
    </div>`;
}

/* ══════════════════════════════════════
   ENGLISH FIRST FLIGHT & FOOTPRINTS
══════════════════════════════════════ */
function buildEnglishReader(subject, type) {
  const title = type === 'ff' ? '✈️ First Flight' : '👣 Footprints Without Feet';
  const pdfTab = type === 'ff' ? 'first-flight' : 'footprints';
  const cards = pdfCards(subject, pdfTab);
  return `<h2 class="section-title" style="margin-bottom:1.5rem">${title}</h2>
    ${cards || buildComingSoon(title, 'PDFs for this section will be added here soon.')}`;
}

function buildChapterAccordionHTML(ch, subjectId, numClass) {
  const chKey = subjectId + '_chapter_' + ch.id;
  /* getChapterDone checks Firestore cache, instant cache, and legacy localStorage */
  const done = getChapterDone(chKey);
  const letters = ['A','B','C','D'];
  const kpHTML = ch.keyPoints?.length
    ? `<div class="kp-section"><h4>🔑 Key Points</h4><ul class="kp-list">${ch.keyPoints.map(k => `<li>${escH(k)}</li>`).join('')}</ul></div>` : '';
  const fmHTML = ch.formulas?.length
    ? `<div class="fm-section"><h4>📌 Key Info</h4>${ch.formulas.map(f => `<div class="fm-pill">${escH(f)}</div>`).join('')}</div>` : '';
  const mcqHTML = ch.mcqs?.length
    ? `<div class="mcq-section"><h4>✏️ Practice MCQs</h4>${ch.mcqs.map((q, qi) => `
        <div class="mcq-card" style="margin-bottom:0.75rem" data-correct="${q.ans}" data-exp="${escH(q.exp||'')}" data-explbl="${escH(q.opts[q.ans])}" data-subject-id="${subjectId}" data-chapter-id="${ch.id}" data-q-idx="${qi}">
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
        <span class="chapter-mastery-badge">${renderMasteryBadge((_cachedKnowledgeMap[subjectId + '_' + ch.id] || {}).mastery || 'not_started')}</span>
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
  initMCQHandlers(container, subjectId);
}

function toggleDone(btn) {
  var user = (typeof getUser === 'function') ? getUser() : null;
  // Firestore key — namespaced so it doesn't collide with formula/qbank/mcq ticks
  var fsKey = btn.dataset.key || (btn.dataset.subject + '_chapter_' + btn.dataset.cid);
  var nowDone = !getChapterDone(fsKey);
  // Update in-memory cache
  _cachedChapterProgress[fsKey] = { done: nowDone };
  // Instant email-free cache — readable before auth resolves on next visit
  _cpSave(fsKey, nowDone);
  // Legacy email-keyed localStorage (backwards compat)
  var legacyKey = btn.dataset.subject + '_' + btn.dataset.cid;
  var p = getProgress();
  p[legacyKey] = nowDone;
  saveProgress(p);
  btn.classList.toggle('done', nowDone);
  // Persist to Firestore
  if (user && typeof DB !== 'undefined') {
    DB.setChapterDone(fsKey, nowDone, user.uid);
  }
  // Live-refresh progress tab if currently open
  var activeTab = document.querySelector('.tab-btn.active');
  if (activeTab && activeTab.dataset.tab === 'my-progress' && _subjectPageSubject) {
    var tc = document.getElementById('tabContent');
    if (tc) tc.innerHTML = buildProgressTab(_subjectPageSubject);
  }
}

/* ══════════════════════════════════════
   GRAMMAR / READING / WRITING
══════════════════════════════════════ */

/* Lazy-load registry: content is built as a string but only injected into DOM
   when the user first opens that accordion section. Keeps initial render fast. */
var _engCache = {};
function _engOpen(el) {
  if (el._alLoaded || !el.open) return;
  var body = el.querySelector('.eng-acc-body');
  var id = el.dataset.alId;
  if (body && _engCache[id]) {
    body.innerHTML = _engCache[id];
    el._alLoaded = true;
    delete _engCache[id]; // free memory after injection
  }
}

function buildGrammar() {
  var _i = 0;
  function acc(title, body) {
    var id = 'gr_' + (_i++);
    _engCache[id] = body;
    return '<details class="eng-acc" data-al-id="' + id + '" ontoggle="_engOpen(this)">' +
      '<summary>' + title + '</summary><div class="eng-acc-body"></div></details>';
  }
  function trow(cells, isHead) {
    var tag = isHead ? 'th' : 'td';
    return '<tr>' + cells.map(function(c){ return '<' + tag + '>' + c + '</' + tag + '>'; }).join('') + '</tr>';
  }

  var tenses = acc('Tenses — All 12 Types',
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Tense','Formula','Signal Words','Example'], true) +
    [
      ['Simple Present','S + V1 / Vs','always, usually, every day, often','She reads the newspaper every morning.'],
      ['Present Continuous','S + is/am/are + V‑ing','now, at present, currently, look!','They are playing cricket right now.'],
      ['Present Perfect','S + has/have + V3','just, already, yet, ever, never, since, for','I have finished all my homework.'],
      ['Present Perfect Continuous','S + has/have + been + V‑ing','for (duration), since (start point)','She has been studying for three hours.'],
      ['Simple Past','S + V2','yesterday, last week/month, ago, in 2010','He played football yesterday evening.'],
      ['Past Continuous','S + was/were + V‑ing','while, when (background action)','She was reading when I called her.'],
      ['Past Perfect','S + had + V3','before, after, by the time, already','They had left before she arrived.'],
      ['Past Perfect Continuous','S + had + been + V‑ing','for, since (before a past moment)','He had been waiting for two hours when I reached.'],
      ['Simple Future','S + will + V1','tomorrow, next week, soon, in future','She will visit us next Sunday.'],
      ['Future Continuous','S + will + be + V‑ing','at this time tomorrow, at 8 pm tonight','I will be studying at 8 pm.'],
      ['Future Perfect','S + will + have + V3','by tomorrow, by the end of, before','They will have finished by noon.'],
      ['Future Perfect Continuous','S + will + have + been + V‑ing','for + duration (future)','She will have been teaching for 20 years by 2026.'],
    ].map(function(r){ return trow(r, false); }).join('') +
    '</table></div>' +
    '<div class="eng-note"><strong>Exam tip:</strong> In gap-filling, look for signal words first — they almost always tell you which tense to use. Present Perfect = just/already/yet/ever/never/since/for. Past Perfect = before/after/by the time (comparing two past events).</div>'
  );

  var articles = acc('Articles &amp; Determiners',
    '<p class="eng-h3">Articles: a / an / the</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Article','When to use','Examples'], true) +
    trow(['a','Before singular countable nouns beginning with a consonant sound','a book, a university (u = /j/ sound), a one-way street (o = /w/ sound)'], false) +
    trow(['an','Before singular countable nouns beginning with a vowel sound','an apple, an honest man (silent H), an hour, an MBA'], false) +
    trow(['the','Specific/particular noun; unique things; second mention; musical instruments; names of rivers/mountain ranges/deserts/oceans','the Sun, the Ganges, the Himalayas, the Pacific, the piano'], false) +
    trow(['Zero (no article)','Proper nouns; uncountable nouns in general sense; plural nouns in general sense','Water is essential. Dogs are loyal. India is a country. She plays chess.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Key Determiners</p>' +
    '<ul class="eng-list"><li><strong>some / any</strong> — some (affirmative), any (negative/questions): <em>I have some milk. Do you have any sugar?</em></li>' +
    '<li><strong>much / many</strong> — much + uncountable, many + countable: <em>much water, many books</em></li>' +
    '<li><strong>little / few</strong> — negative sense (not enough): <em>little hope, few friends</em></li>' +
    '<li><strong>a little / a few</strong> — positive sense (some): <em>a little sugar, a few friends</em></li>' +
    '<li><strong>each / every</strong> — both singular, each = individually, every = all collectively: <em>Each student has a book. Every student passed.</em></li>' +
    '<li><strong>either / neither</strong> — either (one of two), neither (not one of two): <em>Either road leads to the station. Neither answer is correct.</em></li></ul>'
  );

  var modals = acc('Modals — Uses &amp; Examples',
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Modal','Primary Use','Example'], true) +
    [
      ['can','Ability / Permission (informal)','She can speak three languages. / Can I leave early?'],
      ['could','Past ability / Polite request / Possibility','He could run fast as a child. / Could you help me? / It could rain today.'],
      ['may','Formal permission / Possibility','May I come in? / It may snow tonight.'],
      ['might','Remote possibility (less sure than may)','She might be at home. / He might not come.'],
      ['will','Definite future / Willingness','I will call you tomorrow. / I will help you.'],
      ['would','Polite request / Hypothetical / Past habit','Would you close the door? / I would go if I could. / He would visit every Sunday.'],
      ['shall','Formal future (I/We) / Suggestion','I shall return. / Shall we begin?'],
      ['should','Duty / Advice / Expectation','You should exercise daily. / He should have called.'],
      ['must','Strong obligation / Logical certainty','You must wear a seatbelt. / She must be tired.'],
      ['ought to','Moral obligation (weaker than must)','You ought to respect elders.'],
      ['need','Necessity (need not = no obligation)','You need not come early. / Need I attend?'],
      ['dare','Courage to do something','How dare he say that! / She dare not speak.'],
      ['used to','Past habit (no longer done)','He used to wake up at 5 am.'],
    ].map(function(r){ return trow(r, false); }).join('') +
    '</table></div>' +
    '<div class="eng-rule"><strong>Remember:</strong> Modals are always followed by V1 (base form). Never add -s, -ing, or -ed after a modal. ✗ She can goes. ✓ She can go.</div>'
  );

  var sva = acc('Subject-Verb Agreement',
    '<ul class="eng-list">' +
    '<li><strong>Singular subject → singular verb:</strong> The dog <u>barks</u>. She <u>plays</u>.</li>' +
    '<li><strong>Plural subject → plural verb:</strong> The dogs <u>bark</u>. They <u>play</u>.</li>' +
    '<li><strong>Either…or / Neither…nor:</strong> Verb agrees with the nearer subject. <em>Neither the teacher nor the students <u>were</u> present.</em></li>' +
    '<li><strong>Collective nouns:</strong> Singular when acting as one unit, plural when acting individually. <em>The team <u>has</u> won. The team <u>are</u> arguing among themselves.</em></li>' +
    '<li><strong>Indefinite pronouns (always singular):</strong> everyone, everyone, anyone, no one, someone, each, either, neither. <em>Everyone <u>is</u> ready.</em></li>' +
    '<li><strong>Words that look plural but are singular:</strong> news, mathematics, physics, economics, measles, politics. <em>The news <u>is</u> shocking.</em></li>' +
    '<li><strong>Uncountable nouns:</strong> always singular — furniture, information, luggage, advice, knowledge. <em>The information <u>was</u> useful.</em></li>' +
    '<li><strong>"A number of" = plural; "The number of" = singular:</strong> <em>A number of students <u>were</u> absent. The number of students <u>is</u> increasing.</em></li>' +
    '<li><strong>With "as well as", "together with", "along with":</strong> verb agrees with the first subject only. <em>The principal, as well as teachers, <u>was</u> present.</em></li>' +
    '</ul>'
  );

  var voice = acc('Active &amp; Passive Voice',
    '<div class="eng-note" style="margin-bottom:.9rem">Active → Passive: Object becomes subject. Use appropriate form of <strong>to be</strong> + <strong>V3</strong>. Agent (by + doer) is optional.</div>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Tense','Active','Passive'], true) +
    [
      ['Simple Present','She writes a letter.','A letter is written by her.'],
      ['Present Continuous','She is writing a letter.','A letter is being written by her.'],
      ['Present Perfect','She has written a letter.','A letter has been written by her.'],
      ['Simple Past','She wrote a letter.','A letter was written by her.'],
      ['Past Continuous','She was writing a letter.','A letter was being written by her.'],
      ['Past Perfect','She had written a letter.','A letter had been written by her.'],
      ['Simple Future','She will write a letter.','A letter will be written by her.'],
      ['Future Perfect','She will have written a letter.','A letter will have been written by her.'],
      ['Modal (can/may/must…)','She can write a letter.','A letter can be written by her.'],
    ].map(function(r){ return trow(r, false); }).join('') +
    '</table></div>' +
    '<div class="eng-rule"><strong>Pronoun changes in passive:</strong> I→me/by me, we→us, he→him, she→her, they→them. The object pronoun becomes the subject in passive: <em>He helped me → I was helped by him.</em></div>'
  );

  var speech = acc('Direct &amp; Indirect Speech',
    '<p class="eng-h3">Tense Backshift (when reporting verb is in Past)</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Direct Speech Tense','→ Indirect Speech Tense'], true) +
    [
      ['Simple Present (V1/Vs)','→ Simple Past (V2)'],
      ['Present Continuous (is/am/are + V-ing)','→ Past Continuous (was/were + V-ing)'],
      ['Present Perfect (has/have + V3)','→ Past Perfect (had + V3)'],
      ['Simple Past (V2)','→ Past Perfect (had + V3)'],
      ['Past Continuous (was/were + V-ing)','→ Past Perfect Continuous (had been + V-ing)'],
      ['will','→ would'],
      ['can','→ could'],
      ['may','→ might'],
      ['shall','→ should'],
      ['must','→ must / had to'],
    ].map(function(r){ return trow(r, false); }).join('') +
    '</table></div>' +
    '<p class="eng-h3">Pronoun &amp; Time/Place Changes</p>' +
    '<ul class="eng-list">' +
    '<li>I → he/she | we → they | you → he/she/they | my → his/her | our → their</li>' +
    '<li>this → that | these → those | here → there | now → then</li>' +
    '<li>today → that day | yesterday → the previous day | tomorrow → the next day/the following day</li>' +
    '<li>last week → the previous week | next week → the following week | ago → before</li>' +
    '</ul>' +
    '<p class="eng-h3">Question Types in Indirect Speech</p>' +
    '<div class="eng-eg">Yes/No question: He said, "Are you ready?" → He asked if/whether I was ready.<br>' +
    'Wh-question: She said, "Where do you live?" → She asked where I lived.<br>' +
    'Command: She said, "Open the window." → She told/ordered him to open the window.<br>' +
    'Request: She said, "Please help me." → She requested him to help her.<br>' +
    'Exclamation: He said, "What a beautiful painting!" → He exclaimed that it was a very beautiful painting.</div>'
  );

  var clauses = acc('Clauses — Noun, Adjective &amp; Adverb',
    '<p class="eng-h3">Noun Clause</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Functions as Subject, Object, or Complement. Introduced by: <strong>that, if/whether, who, what, when, where, why, how</strong>.</p>' +
    '<div class="eng-eg">That he lied is surprising. (Subject) | She knows <u>that I am right</u>. (Object) | The truth is <u>that nobody came</u>. (Complement)</div>' +
    '<p class="eng-h3">Adjective (Relative) Clause</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Modifies a noun. Introduced by: <strong>who</strong> (persons, subject), <strong>whom</strong> (persons, object), <strong>which</strong> (things), <strong>that</strong> (persons/things), <strong>whose</strong> (possession), <strong>where/when</strong>.</p>' +
    '<div class="eng-eg">The girl <u>who won the prize</u> is my sister. | The book <u>which I read</u> was interesting. | This is the house <u>where he was born</u>.</div>' +
    '<p class="eng-h3">Adverb Clause</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Type','Conjunctions','Example'], true) +
    [
      ['Time','when, while, before, after, since, until, as soon as','She was reading <u>when I entered</u>.'],
      ['Cause/Reason','because, since, as','He stayed home <u>because he was ill</u>.'],
      ['Condition','if, unless, provided that','<u>If it rains</u>, we will stay inside.'],
      ['Concession','although, though, even though','<u>Although she was tired</u>, she worked.'],
      ['Purpose','so that, in order that, lest','Study hard <u>so that you may pass</u>.'],
      ['Result','so…that, such…that','It was <u>so hot that</u> we stayed inside.'],
      ['Comparison','than, as…as','She runs faster <u>than I do</u>.'],
    ].map(function(r){ return trow(r, false); }).join('') +
    '</table></div>'
  );

  var editing = acc('Editing, Omission &amp; Gap Filling — Exam Techniques',
    '<p class="eng-h3">Editing (Spot the Error)</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Each line has exactly one grammatical error. Common errors to watch for:</p>' +
    '<ul class="eng-list">' +
    '<li><strong>Wrong article:</strong> a/an/the confusion, missing article, extra article</li>' +
    '<li><strong>Wrong tense:</strong> inconsistent tense across sentences</li>' +
    '<li><strong>Subject-verb disagreement:</strong> singular/plural mismatch</li>' +
    '<li><strong>Wrong preposition:</strong> in/on/at/by/for/since confusion</li>' +
    '<li><strong>Wrong form of adjective/adverb:</strong> comparative/superlative errors</li>' +
    '<li><strong>Wrong pronoun case:</strong> I/me, he/him, she/her, they/them</li>' +
    '</ul>' +
    '<p class="eng-h3">Omission (Insert Missing Word)</p>' +
    '<p style="font-size:.85rem;line-height:1.65">A word is missing in each line. Common missing words: articles (a, an, the), prepositions (in, on, at, by, of, to), auxiliary verbs (is, are, was, were, has, have, had).</p>' +
    '<div class="eng-eg">He is going __ school. → He is going <strong>to</strong> school.<br>She was standing __ the corner. → She was standing <strong>at</strong> the corner.</div>' +
    '<p class="eng-h3">Gap Filling Tips</p>' +
    '<ul class="eng-list">' +
    '<li>Read the entire sentence before filling — context determines the answer</li>' +
    '<li>Check for signal words (tense), collocations (verb + preposition), and grammar rules</li>' +
    '<li>Common verbs + prepositions: believe <em>in</em>, depend <em>on</em>, consist <em>of</em>, interested <em>in</em>, afraid <em>of</em>, good <em>at</em>, listen <em>to</em></li>' +
    '</ul>'
  );

  var prepositions = acc('Prepositions — In / On / At &amp; Common Collocations',
    '<p class="eng-h3">Time Prepositions</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Preposition','Used For','Examples'], true) +
    trow(['at','Exact time; festivals; night','at 5 pm, at noon, at midnight, at Diwali, at night'], false) +
    trow(['on','Days; dates; specific occasions','on Monday, on 15 August, on my birthday, on New Year\'s Day'], false) +
    trow(['in','Months; years; seasons; parts of day (except night)','in January, in 2024, in summer, in the morning, in the evening'], false) +
    trow(['for','Duration (how long)','I have lived here for 5 years. She studied for 3 hours.'], false) +
    trow(['since','Starting point in time','She has been here since 2019. I have not slept since Monday.'], false) +
    trow(['by','Deadline / not later than','Submit your work by Friday. The train leaves by 6 pm.'], false) +
    trow(['during','Throughout a period','I slept during the lecture. It rained during our trip.'], false) +
    trow(['until / till','Up to a point in time','She worked until midnight. Wait till I come back.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Place Prepositions</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Preposition','Used For','Examples'], true) +
    trow(['at','Specific point / address','at the door, at the station, at 42 MG Road'], false) +
    trow(['on','Surface; floor; specific road','on the table, on the 3rd floor, on MG Road'], false) +
    trow(['in','Enclosed space; city; country','in the room, in Delhi, in India, in the box'], false) +
    trow(['above / below','Higher/lower position (not touching)','The fan is above the table. The bag is below the shelf.'], false) +
    trow(['over / under','Covering / directly below','A bridge over the river. The cat hid under the bed.'], false) +
    trow(['between','Two things/people','Sit between Aman and Priya.'], false) +
    trow(['among','Three or more things/people','She distributed sweets among the children.'], false) +
    trow(['beside / next to','By the side of','Sit beside me. The shop is next to the school.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Common Verb + Preposition Collocations</p>' +
    '<ul class="eng-list">' +
    '<li>agree <strong>with</strong> (a person) / agree <strong>to</strong> (a proposal) / agree <strong>on</strong> (a point)</li>' +
    '<li>apologise <strong>for</strong> / apologise <strong>to</strong> (a person)</li>' +
    '<li>apply <strong>for</strong> (a job) / apply <strong>to</strong> (an institution)</li>' +
    '<li>blame … <strong>for</strong> / believe <strong>in</strong> / belong <strong>to</strong></li>' +
    '<li>care <strong>for</strong> / complain <strong>about</strong> / consist <strong>of</strong></li>' +
    '<li>deal <strong>with</strong> / depend <strong>on</strong> / die <strong>of</strong> (disease) / die <strong>in</strong> (accident)</li>' +
    '<li>good <strong>at</strong> / afraid <strong>of</strong> / interested <strong>in</strong> / proud <strong>of</strong> / satisfied <strong>with</strong></li>' +
    '<li>listen <strong>to</strong> / look <strong>at</strong> (stare) / look <strong>for</strong> (search) / look <strong>after</strong> (care) / look <strong>into</strong> (investigate)</li>' +
    '<li>married <strong>to</strong> / result <strong>in</strong> (leads to) / result <strong>from</strong> (caused by)</li>' +
    '<li>similar <strong>to</strong> / suffer <strong>from</strong> / think <strong>about</strong> / wait <strong>for</strong></li>' +
    '</ul>' +
    '<div class="eng-rule"><strong>Exam tip:</strong> In editing/gap filling, preposition errors are very common. Always check: (1) Is it a time or place context? (2) Is there a fixed verb-preposition or adjective-preposition collocation?</div>'
  );

  var conjunctions = acc('Conjunctions — Coordinating, Subordinating &amp; Correlative',
    '<p class="eng-h3">Coordinating Conjunctions (FANBOYS)</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Conjunction','Use','Example'], true) +
    trow(['For','Reason (formal)','She stayed home, for she was ill.'], false) +
    trow(['And','Addition','He likes cricket and football.'], false) +
    trow(['Nor','Neither alternative (negative)','He neither came nor called.'], false) +
    trow(['But','Contrast','She tried hard, but failed.'], false) +
    trow(['Or','Alternative / Choice','Study now or regret later.'], false) +
    trow(['Yet','Contrast (stronger than but)','He is rich, yet he is unhappy.'], false) +
    trow(['So','Result / Consequence','It was raining, so we stayed inside.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Subordinating Conjunctions (Common in Board Exams)</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Category','Conjunctions'], true) +
    trow(['Time','when, while, before, after, since, until, as soon as, by the time, whenever'], false) +
    trow(['Cause / Reason','because, since, as, now that'], false) +
    trow(['Condition','if, unless, provided that, as long as, in case'], false) +
    trow(['Contrast / Concession','although, though, even though, even if, whereas, while'], false) +
    trow(['Purpose','so that, in order that, lest (+ should/might)'], false) +
    trow(['Result','so…that, such…that'], false) +
    '</table></div>' +
    '<p class="eng-h3">Correlative Conjunctions (Always Paired)</p>' +
    '<ul class="eng-list">' +
    '<li><strong>both…and</strong>: She is both intelligent and hardworking.</li>' +
    '<li><strong>either…or</strong>: Either come early or call ahead.</li>' +
    '<li><strong>neither…nor</strong>: He neither studied nor revised.</li>' +
    '<li><strong>not only…but also</strong>: She is not only a good singer but also an excellent dancer.</li>' +
    '<li><strong>whether…or</strong>: I don\'t know whether to go or stay.</li>' +
    '<li><strong>scarcely/hardly…when</strong>: Scarcely had she left when it started raining.</li>' +
    '<li><strong>no sooner…than</strong>: No sooner did he arrive than the meeting started.</li>' +
    '</ul>' +
    '<div class="eng-note"><strong>Note:</strong> After "scarcely/hardly/no sooner," invert subject and auxiliary: <em>Scarcely had I sat down when…</em> (not "Scarcely I had sat")</div>'
  );

  var degrees = acc('Degrees of Comparison — All Transformation Rules',
    '<div class="eng-note">Three degrees: <strong>Positive</strong> (simple quality), <strong>Comparative</strong> (between two), <strong>Superlative</strong> (among three or more). In board exams, you must transform sentences from one degree to another without changing meaning.</div>' +
    '<p class="eng-h3">Formation Rules</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Type','Formation','Examples'], true) +
    trow(['Short adjectives (1–2 syllables)','Add -er / -est','fast→faster→fastest, tall→taller→tallest, big→bigger→biggest'], false) +
    trow(['Long adjectives (3+ syllables)','more / most + adjective','beautiful→more beautiful→most beautiful'], false) +
    trow(['Irregular','No rule — memorise','good→better→best, bad→worse→worst, much/many→more→most, little→less→least'], false) +
    '</table></div>' +
    '<p class="eng-h3">Transformation: Positive ↔ Comparative ↔ Superlative</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Positive','Comparative','Superlative'], true) +
    trow(['Iron is not as heavy as gold.','Gold is heavier than iron.','Gold is the heaviest of the two.'], false) +
    trow(['No other metal is as heavy as gold. (among many)','Gold is heavier than any other metal.','Gold is the heaviest metal.'], false) +
    trow(['She is as tall as her brother.','Her brother is not taller than her. / She is not shorter than her brother.','—'], false) +
    trow(['Very few countries are as large as Russia.','Russia is larger than most other countries.','Russia is one of the largest countries in the world.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Key Patterns to Remember</p>' +
    '<ul class="eng-list">' +
    '<li><strong>Positive → as…as:</strong> X is as + adj + as Y | Negative → not as/so…as</li>' +
    '<li><strong>Comparative → than:</strong> X is + adj+er + than Y | No other + noun + is as…as | adj+er + than any other</li>' +
    '<li><strong>Superlative → the…of/in:</strong> X is the + adj+est + of/in… | One of the + superlative + plural noun</li>' +
    '<li>When comparing within a group: use "any other" not "any": ✗ She is taller than <u>any</u> girl ✓ She is taller than <u>any other</u> girl</li>' +
    '</ul>'
  );

  var conditionals = acc('Conditionals — All 4 Types',
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Type','Name','Structure','Use','Example'], true) +
    trow(['Zero','Zero Conditional','If + Simple Present, Simple Present','Universal truth / scientific fact','If you heat water to 100°C, it boils.'], false) +
    trow(['First','Real/Possible','If + Simple Present, will + V1','Likely/possible future situation','If it rains, we will cancel the match.'], false) +
    trow(['Second','Unreal/Hypothetical','If + Simple Past, would + V1','Imaginary or unlikely present situation','If I were a bird, I would fly freely.'], false) +
    trow(['Third','Past Unreal','If + Past Perfect, would have + V3','Imaginary past — something that did NOT happen','If she had studied, she would have passed.'], false) +
    '</table></div>' +
    '<p class="eng-h3">Special Points</p>' +
    '<ul class="eng-list">' +
    '<li>In Second Conditional: use <strong>"were"</strong> for all persons (not "was") — <em>If I were you, If he were here</em>. This is the grammatically correct form in formal writing.</li>' +
    '<li>The "if clause" and "result clause" can be swapped: <em>We will cancel the match if it rains.</em> (no comma when if-clause is second)</li>' +
    '<li>Instead of "if not," use <strong>unless</strong>: <em>Unless you study, you will fail. = If you do not study, you will fail.</em></li>' +
    '<li>Mixed Conditional (Past condition + Present result): <em>If she had slept early, she would not be tired now.</em></li>' +
    '</ul>' +
    '<div class="eng-eg"><strong>Common exam transformation:</strong><br>' +
    'Positive statement → Conditional: "She did not study, so she failed." → "If she had studied, she would have passed."<br>' +
    'Advice → Conditional: "Work hard or you will fail." → "Unless you work hard, you will fail." / "If you do not work hard, you will fail."</div>'
  );

  var nonfinites = acc('Non-Finites — Infinitive, Gerund &amp; Participle',
    '<div class="eng-note">Non-finite verbs do not change with the subject or tense. They are: <strong>Infinitive</strong> (to + V1), <strong>Gerund</strong> (V-ing used as noun), and <strong>Participle</strong> (V-ing / V3 used as adjective).</div>' +
    '<p class="eng-h3">Infinitive (to + base form)</p>' +
    '<ul class="eng-list">' +
    '<li><strong>As noun (subject):</strong> <em>To err is human.</em></li>' +
    '<li><strong>As object:</strong> <em>She wants to become a doctor.</em></li>' +
    '<li><strong>To show purpose:</strong> <em>He went to the market to buy vegetables.</em></li>' +
    '<li><strong>After adjectives:</strong> <em>It is easy to learn. She is eager to help.</em></li>' +
    '<li><strong>After certain verbs:</strong> want, wish, hope, decide, refuse, agree, promise, plan, try, fail, manage + to V1</li>' +
    '</ul>' +
    '<p class="eng-h3">Gerund (V-ing as noun)</p>' +
    '<ul class="eng-list">' +
    '<li><strong>As subject:</strong> <em>Swimming is a great exercise.</em></li>' +
    '<li><strong>As object:</strong> <em>She enjoys reading.</em></li>' +
    '<li><strong>After prepositions:</strong> <em>He is good at painting. She left without saying goodbye.</em></li>' +
    '<li><strong>After certain verbs:</strong> enjoy, avoid, consider, keep, suggest, mind, finish, admit, deny, regret + V-ing</li>' +
    '</ul>' +
    '<p class="eng-h3">Participle (V-ing or V3 as adjective)</p>' +
    '<ul class="eng-list">' +
    '<li><strong>Present Participle (V-ing):</strong> <em>The barking dog scared the child. Seeing the fire, she ran away.</em></li>' +
    '<li><strong>Past Participle (V3):</strong> <em>The broken window was repaired. Exhausted after the race, he sat down.</em></li>' +
    '<li><strong>Dangling Participle (common error):</strong> ✗ <em>Walking down the street, the trees looked beautiful.</em> (trees don\'t walk)<br>✓ <em>Walking down the street, she saw beautiful trees.</em></li>' +
    '</ul>' +
    '<p class="eng-h3">Verbs Followed by Infinitive vs Gerund</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Infinitive only','Gerund only','Both (different meaning)'], true) +
    trow(['want, hope, wish, decide, plan, refuse, agree, promise, manage, fail','enjoy, avoid, finish, suggest, consider, keep, deny, regret (past), admit, mind','stop, remember, forget, try, regret'], false) +
    '</table></div>' +
    '<div class="eng-eg"><strong>Meaning changes:</strong><br>Stop <em>to smoke</em> = stop in order to smoke | Stop <em>smoking</em> = quit the habit<br>Remember <em>to lock</em> = don\'t forget (future task) | Remember <em>locking</em> = recall doing it (past action)<br>Try <em>to sleep</em> = attempt | Try <em>sleeping</em> = experiment with it</div>'
  );

  var transformation = acc('Sentence Transformation — Simple ↔ Compound ↔ Complex',
    '<p class="eng-h3">Simple → Compound</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Join two simple sentences with a coordinating conjunction (and, but, or, so, yet).</p>' +
    '<div class="eng-eg">Simple: He was tired. He kept working.<br>Compound: He was tired, <strong>but</strong> he kept working.<br><br>Simple: She studied hard. She passed the exam.<br>Compound: She studied hard, <strong>so</strong> she passed the exam.</div>' +
    '<p class="eng-h3">Simple → Complex</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Turn one idea into a subordinate clause using a subordinating conjunction.</p>' +
    '<div class="eng-eg">Simple: Despite being tired, he kept working.<br>Complex: <strong>Although</strong> he was tired, he kept working.<br><br>Simple: Being a doctor, she knew what to do.<br>Complex: <strong>As</strong>/<strong>Since</strong> she was a doctor, she knew what to do.</div>' +
    '<p class="eng-h3">Other Common Transformations</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Original','Transformation','Result'], true) +
    trow(['He is too weak to walk. (too…to)','So…that','He is so weak that he cannot walk.'], false) +
    trow(['She is so clever that she can solve any problem. (so…that)','too…to','She is not too clever to solve any problem. / She is clever enough to solve any problem.'], false) +
    trow(['She is not clever enough to solve this. (enough to)','too…to','She is too weak to solve this.'], false) +
    trow(['As soon as she arrived, he left. (as soon as)','No sooner…than','No sooner had she arrived than he left.'], false) +
    trow(['He is the best player in the team. (superlative)','Comparative','He is better than any other player in the team.'], false) +
    trow(['Only Riya can do this. (only)','Negative','No one but Riya can do this.'], false) +
    trow(['Everyone respects him. (affirmative)','Negative','Nobody does not respect him. / There is nobody who does not respect him.'], false) +
    '</table></div>' +
    '<div class="eng-rule"><strong>Exam tip:</strong> When transforming, MEANING must not change. Read the transformed sentence and ask: does it say the same thing? Only then is the transformation correct.</div>'
  );

  return '<h2 class="section-title" style="margin-bottom:.25rem">Grammar</h2>' +
    '<p class="eng-sub">Click any topic to open full notes — all rules, tables and examples</p>' +
    '<div class="eng-stack">' + tenses + articles + modals + sva + voice + speech + clauses + editing + prepositions + conjunctions + degrees + conditionals + nonfinites + transformation + '</div>';
}

function buildReading() {
  var _i = 0;
  function acc(title, body) {
    var id = 'rd_' + (_i++);
    _engCache[id] = body;
    return '<details class="eng-acc" data-al-id="' + id + '" ontoggle="_engOpen(this)">' +
      '<summary>' + title + '</summary><div class="eng-acc-body"></div></details>';
  }
  function trow(cells, isHead) {
    var tag = isHead ? 'th' : 'td';
    return '<tr>' + cells.map(function(c){ return '<' + tag + '>' + c + '</' + tag + '>'; }).join('') + '</tr>';
  }

  var pattern = acc('Exam Pattern — Reading Section',
    '<div style="overflow-x:auto"><table class="eng-table">' +
    '<tr><th>Question</th><th>Type</th><th>Marks</th><th>What to do</th></tr>' +
    '<tr><td><strong>Q1</strong></td><td>Factual / Discursive Passage</td><td>10 marks</td><td>Multiple Choice + Short Answer + Vocabulary</td></tr>' +
    '<tr><td><strong>Q2</strong></td><td>Case-based / Data-based Passage</td><td>10 marks</td><td>MCQs based on graph, table, or case study</td></tr>' +
    '</table></div>' +
    '<div class="eng-note"><strong>Time allocation:</strong> Spend ~10 min on Q1 passage, ~10 min on Q2. Always read questions first before the passage — saves time and guides focus.</div>'
  );

  var strategy = acc('How to Attempt Any Passage — Step by Step',
    '<ol class="eng-list" style="padding-left:1.3rem">' +
    '<li><strong>Read all questions first</strong> (2 min) — underline keywords in each question.</li>' +
    '<li><strong>Skim the passage</strong> (1–2 min) — identify topic, tone, and structure.</li>' +
    '<li><strong>Read carefully</strong>, marking portions that answer questions.</li>' +
    '<li><strong>Answer factual questions directly</strong> — copy key phrases, paraphrase slightly. Never invent.</li>' +
    '<li><strong>Inferential questions</strong> — the answer is implied. Look for cause-effect, contrast, or author\'s opinion.</li>' +
    '<li><strong>Vocabulary questions</strong> — use context clues (surrounding words/sentences).</li>' +
    '<li><strong>Check length</strong> — 1-mark answer = 1 sentence, 2-mark = 2–3 sentences.</li>' +
    '</ol>' +
    '<div class="eng-rule"><strong>Never guess from general knowledge.</strong> Every answer must be traceable to the passage — quote the relevant line in your mind before writing.</div>'
  );

  var qtypes = acc('Types of Questions &amp; How to Answer Each',
    '<p class="eng-h3">1. Factual / Direct Questions</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Answer is clearly stated in the passage. Strategy: Locate the relevant sentence, paraphrase in your own words, avoid copying whole sentences.</p>' +
    '<p class="eng-h3">2. Inferential Questions</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Answer is implied but not directly stated. Look for: cause–effect relationships, comparisons, contrasts, author\'s tone (critical, appreciative, neutral).</p>' +
    '<div class="eng-eg">Signal phrases: "It can be inferred…", "The author suggests…", "According to the passage, why…"</div>' +
    '<p class="eng-h3">3. Vocabulary Questions</p>' +
    '<p style="font-size:.85rem;line-height:1.65">Find a word/phrase meaning the same as the given word, or find the meaning of a word used in the passage.</p>' +
    '<ul class="eng-list"><li>Look at the words immediately before and after the target word</li><li>Identify if the word is positive, negative, or neutral in context</li><li>Substitute your answer back in the sentence to verify it makes sense</li></ul>' +
    '<p class="eng-h3">4. Title / Heading Questions</p>' +
    '<p style="font-size:.85rem;line-height:1.65">The title must cover the main idea of the <em>entire</em> passage — not just one paragraph. It should be concise, specific, and not too broad or narrow.</p>' +
    '<p class="eng-h3">5. MCQ Questions (Case-based Passage)</p>' +
    '<ul class="eng-list"><li>Eliminate obviously wrong options first</li><li>Verify your chosen answer against the passage</li><li>For graphs/tables: read the title, axes, legend before answering</li></ul>'
  );

  var notemaking = acc('Note-Making — Format &amp; Complete Guide',
    '<div class="eng-note">Note-making is a structured summary. You must use a specific format with a title, abbreviations, and sub-points. Marks are awarded for format + content.</div>' +
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Title: ________________________\n\n' +
    '1. Main Point\n' +
    '   1.1 Sub-point\n' +
    '   1.2 Sub-point\n' +
    '2. Second Main Point\n' +
    '   2.1 Sub-point\n' +
    '   2.2 Sub-point\n' +
    '3. Third Main Point\n' +
    '   3.1 Sub-point\n\n' +
    'Abbreviations Used:\n' +
    'e.g. = for example    govt. = government    imp. = important\n' +
    'dev. = development    env. = environment    tech. = technology' +
    '</div>' +
    '<p class="eng-h3">Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Use short phrases — not full sentences</li>' +
    '<li>Use at least <strong>4 abbreviations</strong> (list them at the bottom)</li>' +
    '<li>Have a clear heading/title for the entire notes</li>' +
    '<li>Minimum 2 main points, each with at least 2 sub-points</li>' +
    '<li>Do not include personal opinions — only information from the passage</li>' +
    '</ul>'
  );

  var summary = acc('Summary Writing — How to Write',
    '<div class="eng-note">In CBSE board, you may be asked to write a summary of the note-making passage in about 80 words. The summary must be in continuous prose (not bullet points).</div>' +
    '<p class="eng-h3">Steps</p>' +
    '<ol class="eng-list" style="padding-left:1.3rem">' +
    '<li>Use your notes (main points) as the skeleton of the summary.</li>' +
    '<li>Write complete sentences, connecting ideas with linking words.</li>' +
    '<li>Use third person and past/present tense consistently.</li>' +
    '<li>Do NOT add your opinion or examples not in the original passage.</li>' +
    '<li>Stay within 80 words (±10% allowed). Count your words.</li>' +
    '</ol>' +
    '<p class="eng-h3">Useful Linking Words</p>' +
    '<div class="eng-eg">' +
    '<strong>Addition:</strong> furthermore, moreover, in addition, also, besides<br>' +
    '<strong>Contrast:</strong> however, on the other hand, nevertheless, although, yet<br>' +
    '<strong>Cause/Effect:</strong> therefore, consequently, as a result, thus, hence<br>' +
    '<strong>Sequence:</strong> firstly, secondly, finally, then, subsequently' +
    '</div>'
  );

  var databased = acc('Data-Based / Case-Based Passage — Full Strategy',
    '<div class="eng-note">Q2 in the board exam is a <strong>case-based passage</strong> — it includes a graph, table, pie chart, infographic, or a real-world case study. All questions are MCQs. You must read the visual data carefully.</div>' +
    '<p class="eng-h3">Step-by-Step Approach</p>' +
    '<ol class="eng-list" style="padding-left:1.3rem">' +
    '<li><strong>Read the heading / title of the graph or table first.</strong> It tells you what is being measured and compared.</li>' +
    '<li><strong>Read axes labels</strong> (X-axis = horizontal, Y-axis = vertical) and note units (%, years, crore, etc.).</li>' +
    '<li><strong>Read the legend</strong> (if a multi-line or multi-bar graph) — know which colour/pattern represents which category.</li>' +
    '<li><strong>Identify the trend:</strong> Is something increasing, decreasing, fluctuating, or remaining stable?</li>' +
    '<li><strong>Note the highest, lowest, and most dramatic change</strong> — these are almost always asked in MCQs.</li>' +
    '<li><strong>Read the accompanying text/case study paragraph</strong> — some questions are based on this, not the visual.</li>' +
    '</ol>' +
    '<p class="eng-h3">Common Question Patterns</p>' +
    '<ul class="eng-list">' +
    '<li>"In which year was [value] the highest/lowest?" → Look for peak/trough in graph.</li>' +
    '<li>"What was the approximate percentage of…?" → Read the value from the chart, choose closest option.</li>' +
    '<li>"Which statement is TRUE/FALSE according to the data?" → Verify each option against the data carefully.</li>' +
    '<li>"What can be inferred from the data?" → Look for the overall trend, not a single data point.</li>' +
    '<li>"What is the ratio/difference between X and Y?" → Calculate from given values.</li>' +
    '</ul>' +
    '<div class="eng-rule"><strong>Common mistakes:</strong> (1) Confusing Y-axis values — always double-check units. (2) Choosing an option that sounds logically right but isn\'t supported by the data. Every MCQ answer must be traceable to the data given.</div>'
  );

  var tone = acc('Author\'s Tone, Attitude &amp; Purpose — How to Identify',
    '<div class="eng-note">Board exam questions often ask: "What is the author\'s tone?" or "The author\'s attitude towards X is…" This tests your ability to read between the lines.</div>' +
    '<p class="eng-h3">Common Tones &amp; Their Clues</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Tone','What it Means','Clue Words / Signals'], true) +
    trow(['Critical / Disapproving','Author finds fault, expresses dissatisfaction','unfortunately, regrettably, fails, neglects, shameful, alarming, despite, however'], false) +
    trow(['Appreciative / Admiring','Author praises or expresses admiration','commendable, remarkable, exceptional, praise, fortunately, successfully, admirably'], false) +
    trow(['Neutral / Objective','No personal opinion — reports facts','it is observed, studies show, data indicates, according to, reportedly'], false) +
    trow(['Persuasive / Argumentative','Author is trying to convince you','must, should, need to, it is essential, clearly, undoubtedly, there is no doubt'], false) +
    trow(['Sarcastic / Ironic','Saying the opposite of what is meant','seemingly, supposedly, "great" (used for something bad)'], false) +
    trow(['Nostalgic / Reflective','Looking back fondly or thoughtfully','once, used to, I remember, in those days, those were the times'], false) +
    trow(['Humorous / Playful','Light-hearted, witty, amusing','funny, amusing, jokingly, playfully, light remarks'], false) +
    trow(['Anxious / Concerned','Worried about an issue','alarming, dangerous, worrying, serious, urgent, immediate attention'], false) +
    '</table></div>' +
    '<p class="eng-h3">How to Answer "Tone" Questions</p>' +
    '<ul class="eng-list">' +
    '<li>Read the entire passage and note the <strong>overall mood</strong>, not just one sentence.</li>' +
    '<li>Look at the adjectives and adverbs used — they reveal the author\'s feelings.</li>' +
    '<li>Ask: Is the author FOR or AGAINST the topic? Is it emotional or factual? Personal or impersonal?</li>' +
    '<li>If two options both seem correct (e.g., "critical" and "concerned"), pick the one that matches the <strong>primary</strong> emotion of the whole passage.</li>' +
    '</ul>'
  );

  var vocabulary = acc('Vocabulary Building — Prefixes, Suffixes &amp; Word Roots',
    '<p class="eng-h3">Common Prefixes</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Prefix','Meaning','Examples'], true) +
    trow(['un-','Not / Opposite','unhappy, unfair, unable, unusual, unnecessary'], false) +
    trow(['dis-','Not / Reverse','disagree, disappear, dishonest, discourage, disorder'], false) +
    trow(['mis-','Wrongly / Badly','misunderstand, misuse, mislead, misspell, misplace'], false) +
    trow(['pre-','Before','preview, prehistoric, predict, prevent, prepare'], false) +
    trow(['re-','Again / Back','rewrite, review, return, rebuild, remember, recycle'], false) +
    trow(['in- / im-','Not','incomplete, impossible, informal, improper, indirect'], false) +
    trow(['over-','Too much / Above','overwork, overload, overcome, overlook, overconfident'], false) +
    trow(['under-','Too little / Below','underestimate, underprivileged, understand (different meaning)'], false) +
    trow(['inter-','Between / Among','international, interact, interview, interconnect'], false) +
    trow(['sub-','Under / Below','submarine, subway, substandard, subtitle, subcontinent'], false) +
    trow(['super-','Above / Beyond','superior, supernatural, superhero, superfluous'], false) +
    trow(['anti-','Against','antibiotics, antisocial, anti-pollution, anticlimax'], false) +
    '</table></div>' +
    '<p class="eng-h3">Common Suffixes</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Suffix','Meaning / Converts to','Examples'], true) +
    trow(['-tion / -sion',  'Noun (from verb)', 'education, pollution, decision, conclusion, confusion'], false) +
    trow(['-ness',          'Noun (from adjective)', 'happiness, darkness, kindness, weakness, awareness'], false) +
    trow(['-ment',          'Noun (from verb)', 'development, achievement, disappointment, government'], false) +
    trow(['-ful',           'Adjective (having)', 'beautiful, powerful, hopeful, harmful, colourful'], false) +
    trow(['-less',          'Adjective (without)', 'hopeless, careless, useless, fearless, speechless'], false) +
    trow(['-ly',            'Adverb', 'quickly, carefully, beautifully, seriously, clearly'], false) +
    trow(['-ous / -ious',   'Adjective', 'dangerous, famous, serious, glorious, ambitious'], false) +
    trow(['-er / -or',      'Person / Doer', 'teacher, writer, director, actor, inspector'], false) +
    trow(['-ify / -ize',    'Verb', 'classify, simplify, modernize, realize, organize'], false) +
    trow(['-ance / -ence',  'Noun (state/quality)', 'importance, significance, confidence, patience'], false) +
    '</table></div>' +
    '<p class="eng-h3">Useful Word Families (Board Exam Vocabulary)</p>' +
    '<ul class="eng-list">' +
    '<li>pollute (v) → pollution (n) → polluted (adj) → pollutant (n)</li>' +
    '<li>develop (v) → development (n) → developer (n) → developed/developing (adj)</li>' +
    '<li>educate (v) → education (n) → educator (n) → educational (adj) → educationally (adv)</li>' +
    '<li>conserve (v) → conservation (n) → conservative (adj) → conservationist (n)</li>' +
    '<li>achieve (v) → achievement (n) → achiever (n) → achievable (adj)</li>' +
    '</ul>' +
    '<div class="eng-rule"><strong>Strategy for vocabulary MCQs:</strong> If you don\'t know the word, use the prefix/suffix to guess the meaning. Then substitute your guess back in the sentence. If it makes sense, you\'re likely right.</div>'
  );

  var noteEx = acc('Note-Making — Full Worked Example',
    '<p class="eng-h3">Sample Passage</p>' +
    '<p style="font-size:.84rem;line-height:1.72;border-left:3px solid var(--accent);padding:.7rem 1rem;background:rgba(91,71,222,.05);border-radius:var(--radius-sm)">' +
    'Water is one of the most vital natural resources on Earth. Despite covering 71% of the planet\'s surface, only 2.5% of the world\'s water is fresh, and of that, less than 1% is accessible for human use. The growing human population and rapid industrialization have dramatically increased the demand for fresh water, while pollution and mismanagement have reduced its quality and availability. Agriculture consumes nearly 70% of all fresh water used globally, often through inefficient irrigation methods. Climate change is further aggravating the crisis by altering precipitation patterns, causing glaciers to melt, and making extreme droughts more frequent. Immediate steps such as rainwater harvesting, water recycling, drip irrigation, and stricter industrial regulations are urgently needed to ensure water security for future generations.' +
    '</p>' +
    '<p class="eng-h3">Model Notes</p>' +
    '<div class="eng-format-box">' +
    'Title: The Global Water Crisis: Causes and Solutions\n\n' +
    '1. Water as a Resource\n' +
    '   1.1 Covers 71% of Earth\'s surface\n' +
    '   1.2 Only 2.5% fresh; less than 1% accessible\n\n' +
    '2. Causes of Water Crisis\n' +
    '   2.1 Growing pop. + rapid indus. → increased demand\n' +
    '   2.2 Pollution + mismanagement → reduced quality\n' +
    '   2.3 Agri. consumes ~70% of fresh water (inefficient irrig.)\n' +
    '   2.4 Climate change → altered precipitation, glacial melt, droughts\n\n' +
    '3. Solutions Needed\n' +
    '   3.1 Rainwater harvesting\n' +
    '   3.2 Water recycling\n' +
    '   3.3 Drip irrigation\n' +
    '   3.4 Stricter ind. regulations\n\n' +
    'Abbreviations Used:\n' +
    'pop. = population    indus. = industrialisation\n' +
    'agri. = agriculture  irrig. = irrigation\n' +
    'ind. = industrial    approx. = approximately' +
    '</div>' +
    '<p class="eng-h3">Model Summary (80 words)</p>' +
    '<div class="eng-eg">Water is a critical but scarce resource — only 1% of the Earth\'s fresh water is accessible. Rising population, industrialisation, and poor agricultural practices have intensified the crisis. Climate change has worsened the situation through droughts and glacial melting. To address this, governments and individuals must adopt rainwater harvesting, water recycling, drip irrigation, and stricter regulations on industrial effluents. Immediate and collective action is essential to secure fresh water for generations to come.</div>'
  );

  var summaryEx = acc('Summary Writing — Techniques &amp; Worked Example',
    '<div class="eng-note">A summary condenses a passage into about <strong>80 words</strong> in continuous prose. It captures the main idea and key supporting points — no personal opinion, no new examples.</div>' +
    '<p class="eng-h3">The 5-Step Method</p>' +
    '<ol class="eng-list" style="padding-left:1.3rem">' +
    '<li><strong>Identify the theme</strong> — What is the passage mainly about? (1 concept)</li>' +
    '<li><strong>List main points</strong> (from your notes) — 3 to 4 key ideas only; ignore examples and statistics that aren\'t essential.</li>' +
    '<li><strong>Write in your own words</strong> — paraphrase; do not copy sentences from the passage.</li>' +
    '<li><strong>Connect ideas with linking words</strong> — use transitions to make it flow as one paragraph.</li>' +
    '<li><strong>Count words and trim</strong> — if over 90 words, remove adjectives and minor details.</li>' +
    '</ol>' +
    '<p class="eng-h3">What to Include vs. Exclude</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['INCLUDE','EXCLUDE'], true) +
    trow(['Main idea of the whole passage','Personal opinions or judgments'], false) +
    trow(['Key supporting arguments/facts','Direct quotes from the passage'], false) +
    trow(['Logical conclusion from the passage','Repetitive or redundant information'], false) +
    trow(['Cause-effect relationships','Minor examples, statistics (usually)'], false) +
    '</table></div>' +
    '<p class="eng-h3">Linking Word Bank for Summaries</p>' +
    '<div class="eng-eg">' +
    '<strong>Opening:</strong> The passage discusses… / The article highlights… / The text examines…<br>' +
    '<strong>Adding:</strong> furthermore, in addition, additionally, moreover, also<br>' +
    '<strong>Contrast:</strong> however, on the other hand, nevertheless, despite this<br>' +
    '<strong>Cause-Effect:</strong> consequently, as a result, therefore, hence, thus<br>' +
    '<strong>Conclusion:</strong> in conclusion, ultimately, therefore, to sum up' +
    '</div>'
  );

  return '<h2 class="section-title" style="margin-bottom:.25rem">Reading Comprehension</h2>' +
    '<p class="eng-sub">Complete strategies for all passage types in board exam</p>' +
    '<div class="eng-stack">' + pattern + strategy + qtypes + notemaking + summary + databased + tone + vocabulary + noteEx + summaryEx + '</div>';
}

function buildWriting() {
  var _i = 0;
  function acc(title, body) {
    var id = 'wr_' + (_i++);
    _engCache[id] = body;
    return '<details class="eng-acc" data-al-id="' + id + '" ontoggle="_engOpen(this)">' +
      '<summary>' + title + '</summary><div class="eng-acc-body"></div></details>';
  }
  function trow(cells, isHead) {
    var tag = isHead ? 'th' : 'td';
    return '<tr>' + cells.map(function(c){ return '<' + tag + '>' + c + '</' + tag + '>'; }).join('') + '</tr>';
  }

  var formalLetter = acc('Formal Letter — Application / Complaint / Editor',
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Sender\'s Address\n' +
    'Date\n\n' +
    'The Recipient\'s Name/Designation\n' +
    'Organization Name\n' +
    'Address\n\n' +
    'Subject: ________________________\n\n' +
    'Sir/Madam,\n\n' +
    'Opening paragraph: State purpose clearly.\n\n' +
    'Body paragraph(s): Details, facts, reasons, or request.\n\n' +
    'Closing paragraph: Summarize request / express hope for action.\n\n' +
    'Yours faithfully,\n' +
    'Signature\n' +
    'Name (in capitals)' +
    '</div>' +
    '<p class="eng-h3">Key Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Use <strong>Yours faithfully</strong> when you don\'t know the person\'s name; <strong>Yours sincerely</strong> when you do.</li>' +
    '<li>Tone must be formal and polite — never rude even in a complaint.</li>' +
    '<li>Subject line must be clear and specific: "Regarding installation of street lights in Sector 5."</li>' +
    '<li>Paragraphs: Introduction (purpose) → Body (details) → Conclusion (request/action).</li>' +
    '</ul>' +
    '<div class="eng-eg"><strong>Letter to the Editor opening:</strong><br>The Editor<br>The Hindustan Times<br>New Delhi<br><br>Subject: Menace of plastic pollution in urban parks<br><br>Sir,<br>Through the columns of your esteemed newspaper, I wish to draw the attention of the concerned authorities towards the increasing menace of plastic pollution in public parks...</div>'
  );

  var informalLetter = acc('Informal Letter — Friend / Relative',
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Your Address\n' +
    'Date\n\n' +
    'Dear [Name],\n\n' +
    'Opening: Greet and mention why you\'re writing.\n\n' +
    'Body: Main message — news, experience, invitation, advice etc.\n\n' +
    'Closing: Regards to family, end warmly.\n\n' +
    'Yours lovingly/affectionately/sincerely,\n' +
    'Your Name' +
    '</div>' +
    '<p class="eng-h3">Key Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Conversational, warm tone — you may use contractions (I\'m, you\'re, it\'s).</li>' +
    '<li>No subject line needed.</li>' +
    '<li>Address the friend by first name: Dear Priya, Dear Rahul.</li>' +
    '<li>Closing: "Yours lovingly" (close family), "Yours affectionately" (close friend).</li>' +
    '</ul>'
  );

  var analytical = acc('Analytical Paragraph — Based on Outline / Chart / Data',
    '<div class="eng-note">An analytical paragraph is a single, well-organized paragraph (100–120 words) that analyses a given outline, graph, table, or data. It must have a clear topic sentence, supporting details with data, and a conclusion.</div>' +
    '<p class="eng-h3">Structure</p>' +
    '<div class="eng-format-box">' +
    '[Topic Sentence — state what the data/outline is about]\n' +
    '[2–3 Supporting sentences with specific figures/facts from the data]\n' +
    '[Comparison or trend analysis]\n' +
    '[Concluding sentence — inference or summary]' +
    '</div>' +
    '<p class="eng-h3">Useful Language</p>' +
    '<div class="eng-eg">' +
    '<strong>Describing increase:</strong> rose, increased, grew, went up, surged, climbed<br>' +
    '<strong>Describing decrease:</strong> fell, declined, dropped, decreased, plummeted<br>' +
    '<strong>Comparing:</strong> compared to, whereas, while, on the other hand, in contrast<br>' +
    '<strong>Drawing inferences:</strong> this indicates, it is evident that, the data suggests, clearly' +
    '</div>' +
    '<p class="eng-h3">Example Opening Sentences</p>' +
    '<div class="eng-eg">' +
    'The bar graph illustrates the mode of transport used by students to reach school.<br>' +
    'The table depicts the rise in India\'s literacy rate from 2001 to 2021.<br>' +
    'The data reveals a significant shift in the reading habits of urban youth.' +
    '</div>'
  );

  var notice = acc('Notice Writing',
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'NAME OF SCHOOL / ORGANIZATION\n\n' +
    'NOTICE\n\n' +
    'Date:\n\n' +
    'TITLE (e.g., ANNUAL SPORTS DAY)\n\n' +
    'Body: Who, What, When, Where, Why in short sentences.\n' +
    'Additional details: items to bring, registration deadline.\n\n' +
    'Name\n' +
    'Designation' +
    '</div>' +
    '<p class="eng-h3">Key Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Keep within <strong>50 words</strong> (school notices).</li>' +
    '<li>Use formal, impersonal language — passive voice where appropriate.</li>' +
    '<li>NOTICE and TITLE in CAPITALS.</li>' +
    '<li>Must answer: What is happening? When? Where? Who should attend? What should they do?</li>' +
    '</ul>' +
    '<div class="eng-eg"><strong>Model:</strong><br>GREENWOOD PUBLIC SCHOOL<br><br>NOTICE<br>12 March 20XX<br><br>ANNUAL SCIENCE EXHIBITION<br><br>All students of Classes IX and X are informed that the Annual Science Exhibition will be held on 20 March 20XX in the school auditorium from 10:00 a.m. to 2:00 p.m. Interested students must register their project topics with their respective class teachers by 15 March.<br><br>Riya Sharma<br>Head Girl</div>'
  );

  var article = acc('Article Writing',
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Title: ________________________\n' +
    'By: [Author Name]\n\n' +
    'Introduction (Hook + Topic introduction — 2–3 sentences)\n\n' +
    'Body Paragraph 1: First main point with explanation and example\n\n' +
    'Body Paragraph 2: Second main point\n\n' +
    'Body Paragraph 3: Third point / Counterpoint\n\n' +
    'Conclusion: Summary + Call to action / Final thought (2–3 sentences)' +
    '</div>' +
    '<p class="eng-h3">Key Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Word limit: usually <strong>100–120 words</strong> (strictly follow instructions).</li>' +
    '<li>Begin with an interesting hook — a question, quote, or surprising fact.</li>' +
    '<li>Use subheadings within the body if the article is long.</li>' +
    '<li>Write in third person or first person depending on the topic.</li>' +
    '<li>Avoid very casual language; maintain a semi-formal tone.</li>' +
    '</ul>'
  );

  var speech = acc('Speech Writing',
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Respected [Principal/Teachers/Judges], dear [friends/fellow students],\n\n' +
    'Good morning/afternoon! I, [Name], [Class], stand before you to speak on "[Topic]".\n\n' +
    'Introduction: Define or introduce the topic (1–2 sentences).\n\n' +
    'Main Points (2–3 paragraphs):\n' +
    '  — Point 1 with explanation/example\n' +
    '  — Point 2 with example\n' +
    '  — Counter argument / broader perspective\n\n' +
    'Conclusion: Summarize + call to action / inspiring close.\n\n' +
    'Thank you.' +
    '</div>' +
    '<p class="eng-h3">Techniques for an Effective Speech</p>' +
    '<ul class="eng-list">' +
    '<li><strong>Rhetorical questions:</strong> "Have you ever wondered why…?" — engages the audience.</li>' +
    '<li><strong>Tripling:</strong> "We must act now, act together, and act decisively."</li>' +
    '<li><strong>Anaphora (repetition):</strong> "We need cleaner cities. We need cleaner rivers. We need cleaner air."</li>' +
    '<li><strong>Statistics/facts:</strong> Make the speech credible and specific.</li>' +
    '<li><strong>Inclusive language:</strong> "We", "our", "together" — makes audience feel part of the message.</li>' +
    '</ul>'
  );

  var debate = acc('Debate Writing — For &amp; Against',
    '<div class="eng-note">A debate is a formal speech taking a clear position (for or against) on a given topic. You argue one side convincingly. Word limit: usually 150–200 words.</div>' +
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Respected Chair, honourable judges, and dear audience,\n\n' +
    'I, [Name] from [Class], stand firmly [in favour of / against] the motion:\n"[Motion stated exactly as given]".\n\n' +
    'Opening: Define/explain the topic briefly. State your position clearly.\n\n' +
    'Argument 1: [Your strongest point with explanation/example]\n\n' +
    'Argument 2: [Second point]\n\n' +
    'Counter-argument: Acknowledge the opposing view and refute it:\n"While some argue that…, the fact remains that…"\n\n' +
    'Conclusion: Restate position powerfully. End with a call to action or quote.\n\n' +
    'Thank you.' +
    '</div>' +
    '<p class="eng-h3">Language for a Debate</p>' +
    '<div class="eng-eg">' +
    '<strong>Stating position:</strong> I firmly believe… / I am strongly of the opinion… / It is my firm conviction that…<br>' +
    '<strong>Presenting arguments:</strong> To begin with… / Furthermore… / In addition to this… / Most importantly…<br>' +
    '<strong>Refuting opposing views:</strong> While it may be argued… / Contrary to popular belief… / The opponents claim…, however…<br>' +
    '<strong>Concluding:</strong> In conclusion… / For all these reasons… / I urge you all to…<br>' +
    '<strong>Rhetorical questions:</strong> Can we afford to ignore this? / Is this really progress?' +
    '</div>' +
    '<div class="eng-rule"><strong>Marks are given for:</strong> Format (salutation, stance, vote of thanks), Content (at least 3 valid arguments), Language (varied vocabulary, sentence structures), Coherence (logical flow). Never forget to state which SIDE you are arguing.</div>'
  );

  var diary = acc('Diary Entry — Format, Rules &amp; Example',
    '<div class="eng-note">A diary entry is a personal, informal record of your thoughts, experiences, or feelings on a particular day. It is written in first person and reflects the writer\'s emotions honestly.</div>' +
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'Day, Date Month Year\n' +
    'Time (optional): e.g., 9:00 p.m.\n\n' +
    'Dear Diary,\n\n' +
    'Opening line: What happened / where you are / how you feel.\n\n' +
    'Body: Narrate the day\'s events / experience / feelings in detail.\n' +
    'Include: What happened? Who was involved? How did it make you feel?\n' +
    'Why is it significant? What have you learned?\n\n' +
    'Closing: Reflect on the experience or express a wish/hope.\n\n' +
    '[Your Name]' +
    '</div>' +
    '<p class="eng-h3">Key Features</p>' +
    '<ul class="eng-list">' +
    '<li>Always <strong>first person</strong> (I, me, my, we). Never "he/she said."</li>' +
    '<li>Use <strong>past tense</strong> to describe events; present tense for current feelings.</li>' +
    '<li>Informal, personal, honest tone — use contractions (I\'m, couldn\'t, it\'s).</li>' +
    '<li>Show emotions vividly: "I was overwhelmed with joy", "My heart sank", "I couldn\'t believe my eyes".</li>' +
    '<li>Word limit: 100–120 words (strictly follow exam instructions).</li>' +
    '</ul>' +
    '<div class="eng-eg"><strong>Model opening:</strong><br>' +
    'Wednesday, 15 March 20XX, 10:30 p.m.<br>' +
    'Dear Diary,<br>' +
    'Today was perhaps the most memorable day of my school life. When my name was announced as the winner of the National Science Olympiad, I could hardly believe my ears. The hall erupted in applause and I felt a wave of emotions — relief, pride, and immense gratitude for my teachers who had guided me through months of preparation. My parents\' tearful smiles were worth every sleepless night. Today, I truly understood what hard work can achieve.<br>' +
    '[Asha]</div>'
  );

  var email = acc('Formal Email — Format &amp; Complete Guide',
    '<div class="eng-note">Formal emails follow a structure similar to formal letters but are shorter and more direct. In the board exam, you may be asked to write an email to a principal, teacher, editor, or official.</div>' +
    '<p class="eng-h3">Format</p>' +
    '<div class="eng-format-box">' +
    'To: recipient@example.com\n' +
    'From: yourname@example.com\n' +
    'Subject: [Clear, specific subject — e.g., Request for Leave on 20 March]\n\n' +
    'Dear Sir/Madam / Dear [Name],\n\n' +
    'Opening: State who you are and the purpose of the email.\n' +
    '(e.g., "I am a student of Class X, Section A. I am writing to request...")\n\n' +
    'Body: Explain in detail — reason, background, specific request or complaint.\n\n' +
    'Action line: What you want the reader to do.\n' +
    '(e.g., "I would be grateful if you could grant me leave...")\n\n' +
    'Closing: Express gratitude and end politely.\n\n' +
    'Regards / Yours faithfully,\n' +
    '[Your Full Name]\n' +
    '[Class, Section, Roll No.]' +
    '</div>' +
    '<p class="eng-h3">Key Differences from Formal Letter</p>' +
    '<ul class="eng-list">' +
    '<li>No sender\'s postal address at the top — only email addresses.</li>' +
    '<li>Subject line is <strong>mandatory</strong> and must be specific.</li>' +
    '<li>Shorter paragraphs — 3 to 4 sentences each maximum.</li>' +
    '<li>Same formal tone and vocabulary as a letter — no slang, abbreviations, or emojis.</li>' +
    '<li>Closing: "Regards," "Yours faithfully," or "With warm regards," depending on familiarity.</li>' +
    '</ul>' +
    '<div class="eng-eg"><strong>Subject line examples:</strong><br>' +
    '✓ Request for Medical Leave on 18–19 March 20XX<br>' +
    '✓ Complaint Regarding Broken Streetlights in Block C<br>' +
    '✓ Application for Participation in District Science Fair<br>' +
    '✗ Leave (too vague) ✗ URGENT!!! (unprofessional)</div>'
  );

  var report = acc('Report Writing — Newspaper Report &amp; Factual Report',
    '<div class="eng-note">Two types appear in board exams: (1) <strong>Newspaper Report</strong> — journalistic style for an event or incident. (2) <strong>Factual Report</strong> — formal document (submitted to an authority).</div>' +
    '<p class="eng-h3">Newspaper Report Format</p>' +
    '<div class="eng-format-box">' +
    'HEADLINE (in CAPITALS — bold, catchy, present tense)\n\n' +
    'Dateline: City Name, Date — [Reporter Name]\n\n' +
    'Lead Paragraph (most important facts first):\n' +
    '  WHO did WHAT, WHEN, WHERE, WHY in 2–3 sentences.\n\n' +
    'Body Paragraphs:\n' +
    '  Details, quotes from witnesses/officials, statistics.\n' +
    '  Eyewitness account or expert comment.\n\n' +
    'Closing Paragraph:\n' +
    '  Future action / outcome / broader significance.' +
    '</div>' +
    '<p class="eng-h3">Newspaper Report Key Rules</p>' +
    '<ul class="eng-list">' +
    '<li>Headline: Short (5–8 words), present tense, action verb. e.g., <em>FIRE DESTROYS SCHOOL LIBRARY IN DELHI</em></li>' +
    '<li>Third person, past tense for most of the report.</li>' +
    '<li>Inverted pyramid: Most important info first, least important last.</li>' +
    '<li>Include at least one direct quote or eyewitness account.</li>' +
    '<li>Word limit: 100–125 words (check instructions).</li>' +
    '</ul>' +
    '<p class="eng-h3">Factual Report Format</p>' +
    '<div class="eng-format-box">' +
    'REPORT\n\n' +
    'Title: Report on [Topic]\n' +
    'Submitted by: [Name / Designation]\n' +
    'Submitted to: [Name / Authority]\n' +
    'Date: [Date]\n\n' +
    '1. Purpose / Objective\n' +
    '   [What the report is about and why it was prepared]\n\n' +
    '2. Findings / Observations\n' +
    '   [What was found, observed, measured — use bullet points]\n\n' +
    '3. Conclusion / Recommendations\n' +
    '   [What should be done / what was decided]\n\n' +
    '[Signature]\n[Name &amp; Designation]' +
    '</div>' +
    '<div class="eng-eg"><strong>Headline Examples (Newspaper Report):</strong><br>' +
    '✓ STUDENTS PLANT 500 TREES IN DRIVE AGAINST DEFORESTATION<br>' +
    '✓ INTER-SCHOOL SCIENCE FAIR DRAWS RECORD PARTICIPATION IN PUNE<br>' +
    '✓ CITY CELEBRATES WORLD ENVIRONMENT DAY WITH CLEANLINESS DRIVE</div>'
  );

  var writingTips = acc('Writing Skills — Common Errors &amp; Marks Scoring Tips',
    '<p class="eng-h3">Most Common Mistakes That Cost Marks</p>' +
    '<ul class="eng-list">' +
    '<li><strong>Exceeding word limit:</strong> Examiners note it. Stay within ±10% of the given limit.</li>' +
    '<li><strong>Missing format elements:</strong> Forgetting subject line (email), designation (notice/report), or salutation (letter) — each missing element loses marks.</li>' +
    '<li><strong>Informal language in formal writing:</strong> Using "gonna", "wanna", short forms — heavily penalized.</li>' +
    '<li><strong>Copying the question:</strong> Rephrase the topic given in the question; do not repeat it word-for-word as your opening line.</li>' +
    '<li><strong>No coherence:</strong> Jumping between ideas without linking words makes the writing feel disconnected.</li>' +
    '<li><strong>Poor handwriting / spelling:</strong> Affects overall impression. Practice common difficult spellings.</li>' +
    '</ul>' +
    '<p class="eng-h3">Vocabulary to Elevate Your Writing</p>' +
    '<div style="overflow-x:auto"><table class="eng-table">' +
    trow(['Instead of…','Use…'], true) +
    trow(['good','excellent, commendable, remarkable, admirable, praiseworthy'], false) +
    trow(['bad','detrimental, alarming, grave, deplorable, unfortunate'], false) +
    trow(['big / large','enormous, substantial, considerable, vast, massive'], false) +
    trow(['small','negligible, minimal, insignificant, marginal'], false) +
    trow(['important','crucial, vital, indispensable, paramount, significant'], false) +
    trow(['think','believe, opine, contend, hold the view, maintain'], false) +
    trow(['show / prove','demonstrate, illustrate, substantiate, indicate, reveal'], false) +
    trow(['very','extremely, tremendously, remarkably, profoundly, exceptionally'], false) +
    '</table></div>' +
    '<p class="eng-h3">Sentence Variety — Avoid Repetition</p>' +
    '<ul class="eng-list">' +
    '<li>Mix short and long sentences. A short punchy line after several long ones creates impact.</li>' +
    '<li>Begin sentences differently — not always with "I" or "The". Try: "Having considered…", "It is evident that…", "Given the circumstances…"</li>' +
    '<li>Use passive voice occasionally to add variety: "It has been widely acknowledged that…"</li>' +
    '</ul>'
  );

  return '<h2 class="section-title" style="margin-bottom:.25rem">Writing Skills</h2>' +
    '<p class="eng-sub">Complete formats, rules and model examples for every writing type</p>' +
    '<div class="eng-stack">' + formalLetter + informalLetter + analytical + notice + article + speech + debate + diary + email + report + writingTips + '</div>';
}

/* ══════════════════════════════════════
   SOCIAL SCIENCE QUESTION BANK
══════════════════════════════════════ */
function buildScienceQBank() {
  const chapters = [
    { id: 1,  label: 'Ch 1 Chemical Reactions and Equations' },
    { id: 2,  label: 'Ch 2 Acids, Bases and Salts' },
    { id: 3,  label: 'Ch 3 Metals and Non-Metals' },
    { id: 4,  label: 'Ch 4 Carbon and Its Compounds' },
    { id: 5,  label: 'Ch 5 Life Processes' },
    { id: 6,  label: 'Ch 6 Control and Coordination' },
    { id: 7,  label: 'Ch 7 How do Organisms Reproduce?' },
    { id: 8,  label: 'Ch 8 Heredity' },
    { id: 9,  label: 'Ch 9 Light: Reflection and Refraction' },
    { id: 10, label: 'Ch 10 The Human Eye and the Colourful World' },
    { id: 11, label: 'Ch 11 Electricity' },
    { id: 12, label: 'Ch 12 Magnetic Effects of Electric Current' },
    { id: 13, label: 'Ch 13 Our Environment' },
  ];
  const cards = chapters.map(ch => {
    const d = (typeof SCIENCE_QBANK !== 'undefined') ? SCIENCE_QBANK[ch.id] : null;
    const n2 = d ? d.q2m.length : 0, n3 = d ? d.q3m.length : 0, n5 = d ? d.q5m.length : 0;
    const chDoneKey = 'science_qbank_' + ch.id;
    const chDone = getChapterDone(chDoneKey);
    return `
    <div class="pdf-card" style="cursor:pointer" onclick="location.href='qbank.html?s=science&ch=${ch.id}&m=2m'">
      <div class="pdf-card-info">
        <div class="pdf-card-title">${escH(ch.label)}</div>
        <div class="pdf-card-desc">${n2 + n3 + n5} questions</div>
      </div>
      <a class="pdf-open-btn" href="qbank.html?s=science&ch=${ch.id}&m=2m">View</a>
    </div>`;
  }).join('');
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">Question Bank</h2>
      <div class="pdf-cards-grid">${cards}</div>
    </div>`;
}

function _buildQBankBody(d, activeMarks, tabFnPrefix) {
  // tabFnPrefix: string prepended before ,'Xm') in each tab onclick
  // e.g. "openScienceQBankSection(3" → onclick="openScienceQBankSection(3,'2m')"
  const sections = [
    { marks: '2m', label: '2 Marks', cls: 'qbank-badge-2m', activeCls: 'active-2m', qs: d.q2m },
    { marks: '3m', label: '3 Marks', cls: 'qbank-badge-3m', activeCls: 'active-3m', qs: d.q3m },
    { marks: '5m', label: '5 Marks', cls: 'qbank-badge-5m', activeCls: 'active-5m', qs: d.q5m },
  ];
  const active = sections.find(s => s.marks === activeMarks) || sections[0];
  const tabs = sections.map(s => `
    <button class="qbank-tab${s.marks === active.marks ? ' ' + s.activeCls : ''}" onclick="${tabFnPrefix},'${s.marks}')">
      <span class="qbank-tab-label">${s.label}</span>
      <span class="qbank-tab-count">${s.qs.length} Qs</span>
    </button>`).join('');
  const items = active.qs.length ? active.qs.map((q, i) => `
    <div class="qb-item">
      <span class="qb-num">${i + 1}</span>
      <p class="qb-text">${escH(q)}</p>
    </div>`).join('') : '<p style="color:var(--muted);font-size:.88rem;text-align:center;padding:1.5rem 0">No questions yet.</p>';
  return `
    <div class="qbank-tabs">${tabs}</div>
    <div class="qbank-section-hdr">
      <span class="qbank-badge ${active.cls}">${active.label}</span>
      <span class="qbank-count">${active.qs.length} questions</span>
    </div>
    <div class="qbank-list">${items}</div>`;
}

function openScienceQBank(chId) {
  const d = (typeof SCIENCE_QBANK !== 'undefined') ? SCIENCE_QBANK[chId] : null;
  if (!d) return;
  let modal = document.getElementById('qbankModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'qbankModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'qbankModalTitle');
    modal.innerHTML = `
      <div class="mcq-modal-box">
        <div class="mcq-modal-hdr">
          <div class="mcq-modal-title-wrap">
            <span class="mcq-modal-title" id="qbankModalTitle"></span>
            <span class="mcq-modal-meta" id="qbankModalMeta"></span>
          </div>
          <button class="mcq-modal-close" aria-label="Close" onclick="closeQBankModal()">✕</button>
        </div>
        <div class="mcq-modal-body" id="qbankModalBody"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeQBankModal(); });
  }
  document.getElementById('qbankModalTitle').textContent = d.title;
  document.getElementById('qbankModalMeta').textContent = `${d.q2m.length + d.q3m.length + d.q5m.length} questions`;
  document.getElementById('qbankModalBody').innerHTML = _buildQBankBody(d, '2m', `openScienceQBankSection(${chId}`);
  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() { var b = modal.querySelector('.mcq-modal-close'); if (b) b.focus(); });
  document.getElementById('qbankModalBody').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function openScienceQBankSection(chId, marks) {
  const d = (typeof SCIENCE_QBANK !== 'undefined') ? SCIENCE_QBANK[chId] : null;
  if (!d) return;
  const qs = marks === '3m' ? d.q3m : marks === '5m' ? d.q5m : d.q2m;
  document.getElementById('qbankModalMeta').textContent = `${qs.length} questions`;
  document.getElementById('qbankModalBody').innerHTML = _buildQBankBody(d, marks, `openScienceQBankSection(${chId}`);
  document.getElementById('qbankModalBody').scrollTop = 0;
}

function closeQBankModal() {
  const modal = document.getElementById('qbankModal');
  if (modal) { _removeFocusTrap(modal); modal.classList.remove('open'); document.body.style.overflow = ''; }
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
}

function buildMathsQBank() {
  const chapters = [
    { id: 1,  label: 'Ch 1 Real Numbers' },
    { id: 2,  label: 'Ch 2 Polynomials' },
    { id: 3,  label: 'Ch 3 Pair of Linear Equations in Two Variables' },
    { id: 4,  label: 'Ch 4 Quadratic Equations' },
    { id: 5,  label: 'Ch 5 Arithmetic Progressions' },
    { id: 7,  label: 'Ch 7 Coordinate Geometry' },
    { id: 8,  label: 'Ch 8 Introduction to Trigonometry' },
    { id: 9,  label: 'Ch 9 Some Applications of Trigonometry' },
    { id: 11, label: 'Ch 11 Areas Related to Circles' },
    { id: 12, label: 'Ch 12 Surface Areas and Volumes' },
    { id: 13, label: 'Ch 13 Statistics' },
    { id: 14, label: 'Ch 14 Probability' },
  ];
  const cards = chapters.map(ch => {
    const d = (typeof MATHS_QBANK_CH !== 'undefined') ? MATHS_QBANK_CH[ch.id] : null;
    const n2 = d ? d.q2m.length : 0, n3 = d ? d.q3m.length : 0, n5 = d ? d.q5m.length : 0;
    const chDoneKey = 'maths_qbank_' + ch.id;
    const chDone = getChapterDone(chDoneKey);
    return `
    <div class="pdf-card" style="cursor:pointer" onclick="location.href='qbank.html?s=maths&ch=${ch.id}&m=2m'">
      <div class="pdf-card-info">
        <div class="pdf-card-title">${escH(ch.label)}</div>
        <div class="pdf-card-desc">${n2 + n3 + n5} questions</div>
      </div>
      <a class="pdf-open-btn" href="qbank.html?s=maths&ch=${ch.id}&m=2m">View</a>
    </div>`;
  }).join('');
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">Question Bank</h2>
      <div class="pdf-cards-grid">${cards}</div>
    </div>`;
}

function openMathsQBank(chId) {
  const d = (typeof MATHS_QBANK_CH !== 'undefined') ? MATHS_QBANK_CH[chId] : null;
  if (!d) return;
  let modal = document.getElementById('mathsQBankModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'mathsQBankModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'mathsQBankModalTitle');
    modal.innerHTML = `
      <div class="mcq-modal-box">
        <div class="mcq-modal-hdr">
          <div class="mcq-modal-title-wrap">
            <span class="mcq-modal-title" id="mathsQBankModalTitle"></span>
            <span class="mcq-modal-meta" id="mathsQBankModalMeta"></span>
          </div>
          <button class="mcq-modal-close" aria-label="Close" onclick="closeMathsQBankModal()">✕</button>
        </div>
        <div class="mcq-modal-body" id="mathsQBankModalBody"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeMathsQBankModal(); });
  }
  document.getElementById('mathsQBankModalTitle').textContent = d.title;
  document.getElementById('mathsQBankModalMeta').textContent = `${d.q2m.length + d.q3m.length + d.q5m.length} questions`;
  document.getElementById('mathsQBankModalBody').innerHTML = _buildQBankBody(d, '2m', `openMathsQBankSection(${chId}`);
  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() { var b = modal.querySelector('.mcq-modal-close'); if (b) b.focus(); });
  document.getElementById('mathsQBankModalBody').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function openMathsQBankSection(chId, marks) {
  const d = (typeof MATHS_QBANK_CH !== 'undefined') ? MATHS_QBANK_CH[chId] : null;
  if (!d) return;
  const qs = marks === '3m' ? d.q3m : marks === '5m' ? d.q5m : d.q2m;
  document.getElementById('mathsQBankModalMeta').textContent = `${qs.length} questions`;
  document.getElementById('mathsQBankModalBody').innerHTML = _buildQBankBody(d, marks, `openMathsQBankSection(${chId}`);
  document.getElementById('mathsQBankModalBody').scrollTop = 0;
}

function closeMathsQBankModal() {
  const modal = document.getElementById('mathsQBankModal');
  if (modal) { _removeFocusTrap(modal); modal.classList.remove('open'); document.body.style.overflow = ''; }
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
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
      <h2 class="section-title" style="margin-bottom:1.5rem">Chapter Notes</h2>
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
                
                <div class="pdf-card-info">
                  <div class="pdf-card-title">${escH(p.title)}</div>
                  <div class="pdf-card-desc">${escH(p.desc)}</div>
                </div>
                <button class="pdf-open-btn" onclick="openPDF('${escH(p.url)}','${escH(p.title)}')">Open</button>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function buildSocialQBank() {
  const db = (typeof SOCIAL_QBANK_CH !== 'undefined') ? SOCIAL_QBANK_CH : null;
  const sections = [
    { key: 'history',   icon: '📜', label: 'History',   color: '#EF4444' },
    { key: 'geography', icon: '🌍', label: 'Geography',  color: '#10B981' },
    { key: 'civics',    icon: '🏛️', label: 'Civics',    color: '#3B82F6' },
    { key: 'economics', icon: '💰', label: 'Economics',  color: '#F59E0B' }
  ];
  return `
    <div>
      <h2 class="section-title" style="margin-bottom:1.5rem">Question Bank</h2>
      ${sections.map(s => {
        const subj = db ? db[s.key] : null;
        if (!subj) return '';
        const chEntries = Object.entries(subj);
        return `
        <div style="margin-bottom:2rem">
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.9rem">
            <span style="font-size:1.3rem">${s.icon}</span>
            <h3 style="margin:0;font-size:1rem;font-weight:800;color:${s.color}">${s.label}</h3>
            <span style="font-size:0.75rem;color:var(--muted);background:var(--surface);padding:0.15rem 0.55rem;border-radius:20px;border:1px solid var(--border)">${chEntries.length} chapters</span>
          </div>
          <div class="pdf-cards-grid">
            ${chEntries.map(([chKey, d]) => {
              const chDoneKey = 'social_qbank_' + s.key + '_' + chKey.replace(/[^a-zA-Z0-9_-]/g, '_');
              const chDone = getChapterDone(chDoneKey);
              return `
              <div class="pdf-card" style="cursor:pointer" onclick="location.href='qbank.html?s=social&subj=${s.key}&ch=${chKey}&m=2m'">
                <div class="pdf-card-info">
                  <div class="pdf-card-title">${escH(d.title)}</div>
                  <div class="pdf-card-desc">${d.q2m.length + d.q3m.length + d.q5m.length} questions</div>
                </div>
                <a class="pdf-open-btn" href="qbank.html?s=social&subj=${s.key}&ch=${chKey}&m=2m">View</a>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

function openSocialQBank(subj, chKey) {
  const db = (typeof SOCIAL_QBANK_CH !== 'undefined') ? SOCIAL_QBANK_CH : null;
  const d = db && db[subj] ? db[subj][chKey] : null;
  if (!d) return;
  let modal = document.getElementById('socialQBankModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'socialQBankModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'socialQBankModalTitle');
    modal.innerHTML = `
      <div class="mcq-modal-box">
        <div class="mcq-modal-hdr">
          <div class="mcq-modal-title-wrap">
            <span class="mcq-modal-title" id="socialQBankModalTitle"></span>
            <span class="mcq-modal-meta" id="socialQBankModalMeta"></span>
          </div>
          <button class="mcq-modal-close" aria-label="Close" onclick="closeSocialQBankModal()">✕</button>
        </div>
        <div class="mcq-modal-body" id="socialQBankModalBody"></div>
      </div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) closeSocialQBankModal(); });
  }
  document.getElementById('socialQBankModalTitle').textContent = d.title;
  document.getElementById('socialQBankModalMeta').textContent = `${d.q2m.length + d.q3m.length + d.q5m.length} questions`;
  document.getElementById('socialQBankModalBody').innerHTML = _buildQBankBody(d, '2m', `openSocialQBankSection('${subj}','${chKey}'`);
  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() {
    var closeBtn = modal.querySelector('.mcq-modal-close');
    if (closeBtn) closeBtn.focus();
  });
  document.getElementById('socialQBankModalBody').scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function openSocialQBankSection(subj, chKey, marks) {
  const db = (typeof SOCIAL_QBANK_CH !== 'undefined') ? SOCIAL_QBANK_CH : null;
  const d = db && db[subj] ? db[subj][chKey] : null;
  if (!d) return;
  const qs = marks === '3m' ? d.q3m : marks === '5m' ? d.q5m : d.q2m;
  document.getElementById('socialQBankModalMeta').textContent = `${qs.length} questions`;
  document.getElementById('socialQBankModalBody').innerHTML = _buildQBankBody(d, marks, `openSocialQBankSection('${subj}','${chKey}'`);
  document.getElementById('socialQBankModalBody').scrollTop = 0;
}

function closeSocialQBankModal() {
  const modal = document.getElementById('socialQBankModal');
  if (modal) { _removeFocusTrap(modal); modal.classList.remove('open'); document.body.style.overflow = ''; }
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
}

/* ══════════════════════════════════════
   MAPS (Social Science)
══════════════════════════════════════ */
function buildMaps() {
  const maps = [
    { icon: '🗺️', name: 'Historical Maps Nationalism in India', sub: 'Salt March route, Non-Cooperation centres, Partition maps' },
    { icon: '🌾', name: 'Agricultural Map of India', sub: 'Kharif/Rabi crop distribution, Green Revolution states' },
    { icon: '⛏️', name: 'Minerals & Resources Map', sub: 'Iron ore, coal, bauxite, mica, petroleum locations' },
    { icon: '🏭', name: 'Industrial Map of India', sub: 'Cotton, steel, IT, cement, automobile industries' },
    { icon: '🌊', name: 'Water Resources Map', sub: 'Major rivers, dams, multipurpose river projects (Bhakra, Hirakud)' },
    { icon: '🚂', name: 'Lifelines of the Economy', sub: 'National highways, railway zones, major ports and airports' },
    { icon: '🌍', name: 'Europe Rise of Nationalism', sub: 'Map-based questions on unification of Germany & Italy' }
  ];
  return `
    <div class="maps-section">
      <div class="maps-header">
        <h3>🗺️ Map Work Social Science</h3>
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

  return `<h2 class="section-title" style="margin-bottom:1.5rem">📖 Chapter Summaries ${subject.name}</h2>
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
      <h3>${name} Coming Soon</h3>
      <p>${msg}</p>
    </div>`;
}

/* ══════════════════════════════════════
   MY PROGRESS TAB
══════════════════════════════════════ */
/*
 * buildProgressTab — comprehensive progress across ALL resource types.
 *
 * Data sources:
 *   _cachedKnowledgeMap    — MCQ mastery per chapter (from answering MCQs)
 *   _cachedChapterProgress — tick completion per section/chapter (formula, qbank, mcq, chapter)
 *   _cachedPdfProgress     — PDF / resource completion (opened + marked done)
 *
 * Tick key naming convention (written by each section builder):
 *   {subjectId}_formula_{chId}                — formula sheet chapter tick
 *   {subjectId}_qbank_{chId}                  — question bank chapter tick
 *   {subjectId}_mcq_{chId}                    — MCQ section chapter tick
 *   {subjectId}_chapter_{chId}                — "Most Important" chapter tick
 *   social_qbank_{section}_{normalizedChKey}  — social Q-Bank chapter tick
 *
 * Overall % = (done chapter ticks + done PDFs) / (expected ticks + total subject PDFs) × 100
 */
function buildProgressTab(subject) {
  if (!subject) return buildComingSoon('Progress', 'No subject data.');
  var user = (typeof getUser === 'function') ? getUser() : null;
  if (!user) return '<div class="coming-soon"><div class="cs-icon"></div><h3>Login Required</h3><p>Log in to see your progress tracking.</p></div>';

  var sid = subject.id;
  var km  = _cachedKnowledgeMap;
  var cp  = _cachedChapterProgress;
  var pp  = _cachedPdfProgress;

  // ── 1. MCQ MASTERY COUNTS ────────────────────────────────────────────────
  var counts = { mastered: 0, proficient: 0, developing: 0, learning: 0, not_started: 0 };
  var hasMCQData = false;
  subject.chapters.forEach(function(ch) {
    var entry = km[sid + '_' + ch.id] || {};
    var mastery = entry.mastery || 'not_started';
    counts[mastery]++;
    if (mastery !== 'not_started') hasMCQData = true;
  });

  // ── 2. CHAPTER TICK COMPLETIONS ──────────────────────────────────────────
  // What tick types are available per subject (drives the per-chapter pill display)
  var TICK_TYPES = {
    science: [
      { key: 'formula',  label: 'Formulas' },
      { key: 'qbank',    label: 'Q-Bank'   },
      { key: 'mcq',      label: 'MCQ'      },
      { key: 'chapter',  label: 'Key Notes' }
    ],
    maths: [
      { key: 'qbank',    label: 'Q-Bank'   }
    ],
    social: [
      { key: 'mcq',      label: 'MCQ'      }
    ],
    english: []
  };
  var tickTypes = TICK_TYPES[sid] || [];

  // Count expected vs done for chapter-level ticks
  var expectedChTicks = tickTypes.length * subject.chapters.length;
  var doneChTicks = 0;
  subject.chapters.forEach(function(ch) {
    tickTypes.forEach(function(t) {
      var k = sid + '_' + t.key + '_' + ch.id;
      if (cp[k] && cp[k].done) doneChTicks++;
    });
  });

  // Also count social qbank ticks (different key scheme: social_qbank_{section}_{key})
  if (sid === 'social') {
    var socialQbankDone = Object.keys(cp).filter(function(k) {
      return k.startsWith('social_qbank_') && cp[k] && cp[k].done;
    }).length;
    doneChTicks += socialQbankDone;
    // For social, estimate total qbank ticks (history:5, geography:7, civics:5, economics:5 = 22)
    expectedChTicks += 22;
  }

  // ── 3. PDF COMPLETIONS FOR THIS SUBJECT ─────────────────────────────────
  var subjectPdfs = [];
  var pdfsBySubject = (typeof PDFS !== 'undefined' && PDFS[sid]) ? PDFS[sid] : {};
  Object.values(pdfsBySubject).forEach(function(list) {
    if (Array.isArray(list)) subjectPdfs = subjectPdfs.concat(list);
  });
  var donePdfs = subjectPdfs.filter(function(p) {
    return pp[p.url] && pp[p.url].completed;
  }).length;

  // ── 4. OVERALL COMPLETION % ──────────────────────────────────────────────
  var totalResources = expectedChTicks + subjectPdfs.length;
  var doneResources  = doneChTicks + donePdfs;
  var overallPct     = totalResources > 0 ? Math.round((doneResources / totalResources) * 100) : 0;

  // ── 5. PER-CHAPTER CARDS ─────────────────────────────────────────────────
  var cardsHTML = subject.chapters.map(function(ch) {
    var kmKey  = sid + '_' + ch.id;
    var entry  = km[kmKey] || {};
    var mastery = entry.mastery || 'not_started';
    var total   = entry.totalAttempts || 0;
    var correct = entry.correctAttempts || 0;
    var acc     = total ? Math.round((correct / total) * 100) : 0;

    var dueEntry = entry.nextRevisionDue;
    var isDue = dueEntry && (function() {
      var d = dueEntry.toDate ? dueEntry.toDate() : new Date(dueEntry);
      return d.getTime() < Date.now() && mastery !== 'not_started';
    })();

    // Tick pills for this chapter
    var pips = tickTypes.map(function(t) {
      var k     = sid + '_' + t.key + '_' + ch.id;
      var isDone = cp[k] && cp[k].done;
      return '<span class="progress-tick-pip' + (isDone ? ' done' : '') + '">' + escH(t.label) + '</span>';
    }).join('');

    return '<div class="progress-chapter-card' + (isDue ? ' due-for-revision' : '') + '">' +
      '<div class="progress-ch-header">' +
        '<div class="progress-ch-name">Ch ' + ch.id + ': ' + escH(ch.title) + '</div>' +
        (hasMCQData ? renderMasteryBadge(mastery) : '') +
      '</div>' +
      (isDue ? '<div class="revision-due-badge">Due for revision</div>' : '') +
      (pips ? '<div class="progress-tick-pips">' + pips + '</div>' : '') +
      (total ? '<div class="progress-ch-stats"><span>' + total + ' MCQ attempts · ' + acc + '% accuracy</span></div>' : '') +
    '</div>';
  }).join('');

  // ── 6. ASSEMBLE HTML ─────────────────────────────────────────────────────
  var mcqSummaryStrip = hasMCQData
    ? '<div class="progress-summary-strip">' +
        '<div class="progress-summary-stat"><div class="pss-num" style="color:#059669">' + counts.mastered + '</div><div class="pss-lbl">Mastered</div></div>' +
        '<div class="progress-summary-stat"><div class="pss-num" style="color:#2563EB">' + counts.proficient + '</div><div class="pss-lbl">Proficient</div></div>' +
        '<div class="progress-summary-stat"><div class="pss-num" style="color:#D97706">' + counts.developing + '</div><div class="pss-lbl">Developing</div></div>' +
        '<div class="progress-summary-stat"><div class="pss-num" style="color:#EF4444">' + counts.learning + '</div><div class="pss-lbl">Learning</div></div>' +
        '<div class="progress-summary-stat"><div class="pss-num" style="color:var(--muted)">' + counts.not_started + '</div><div class="pss-lbl">Not Started</div></div>' +
      '</div>'
    : '';

  var overallBar =
    '<div class="progress-overall">' +
      '<div class="progress-overall-label">Overall Completion &mdash; <strong>' + doneResources + '&thinsp;/&thinsp;' + totalResources + ' resources done</strong> (' + overallPct + '%)</div>' +
      '<div class="progress-bar-wrap" style="height:10px;margin-top:0.5rem">' +
        '<div class="progress-bar-fill" style="width:' + overallPct + '%;background:var(--accent);transition:width 0.8s ease"></div>' +
      '</div>' +
      '<div style="margin-top:0.55rem;font-size:0.8rem;color:var(--muted);display:flex;flex-wrap:wrap;gap:0.5rem">' +
        (doneChTicks ? '<span>' + doneChTicks + ' section' + (doneChTicks !== 1 ? 's' : '') + ' ticked</span>' : '') +
        (donePdfs    ? '<span>' + (doneChTicks ? '·' : '') + ' ' + donePdfs + ' PDF' + (donePdfs !== 1 ? 's' : '') + ' read</span>' : '') +
        (!doneResources ? '<span>No resources completed yet &mdash; use the tick buttons on each section</span>' : '') +
      '</div>' +
    '</div>';

  return mcqSummaryStrip +
    overallBar +
    '<div style="display:flex;align-items:center;justify-content:space-between;margin:1.5rem 0 0.75rem;flex-wrap:wrap;gap:0.5rem">' +
      '<h3 style="margin:0;font-size:1rem;font-weight:800">Chapter Breakdown</h3>' +
      '<a href="mistakes.html" class="btn btn-secondary" style="font-size:0.82rem;padding:0.35rem 0.9rem">Mistake Bank</a>' +
    '</div>' +
    '<div class="progress-grid">' + cardsHTML + '</div>';
}

/* ══════════════════════════════════════
   TEST MODE (10 random Q + timer)
══════════════════════════════════════ */
function openTestMode(chId, title, subject) {
  var bank = subject === 'social'
    ? (typeof SOCIAL_MCQS !== 'undefined' && SOCIAL_MCQS[chId])
    : (typeof SCIENCE_MCQS !== 'undefined' && SCIENCE_MCQS[chId]);
  var allMCQs = (bank || []);
  if (!allMCQs.length) { alert('No MCQs available for this chapter.'); return; }

  // Shuffle and pick up to 10
  var shuffled = allMCQs.slice().sort(function() { return 0.5 - Math.random(); });
  var testMCQs = shuffled.slice(0, Math.min(10, shuffled.length));
  var letters = ['A', 'B', 'C', 'D'];

  var modal = document.getElementById('testModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'testModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'testModalTitle');
    modal.innerHTML =
      '<div class="mcq-modal-box">' +
        '<div class="mcq-modal-hdr">' +
          '<div class="mcq-modal-title-wrap">' +
            '<span class="mcq-modal-title" id="testModalTitle"></span>' +
            '<span class="mcq-modal-meta" id="testModalMeta"></span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:0.6rem">' +
            '<span class="test-timer" id="testTimer">10:00</span>' +
            '<span class="mcq-score-pill" id="testScorePill">0 / 0</span>' +
            '<button class="mcq-modal-close" aria-label="Close" onclick="closeTestModal()">✕</button>' +
          '</div>' +
        '</div>' +
        '<div class="mcq-modal-body" id="testModalBody"></div>' +
      '</div>';
    document.body.appendChild(modal);
  }

  document.getElementById('testModalTitle').textContent = 'Test: Ch ' + chId + ' — ' + title;
  document.getElementById('testModalMeta').textContent = testMCQs.length + ' Questions · 10 min';
  document.getElementById('testScorePill').textContent = '0 / 0';
  var timerEl = document.getElementById('testTimer');
  if (timerEl) { timerEl.textContent = '10:00'; timerEl.classList.remove('warning'); }

  var body = document.getElementById('testModalBody');
  body.innerHTML = '<div class="mcq-grid">' +
    testMCQs.map(function(q, qi) {
      return '<div class="mcq-card" data-correct="' + q.ans + '" data-exp="' + escH(q.exp || '') + '" data-explbl="' + escH(q.opts[q.ans]) + '" data-q-idx="' + qi + '">' +
        '<div class="mcq-q">Q' + (qi + 1) + '. ' + q.q + '</div>' +
        '<div class="mcq-opts">' +
          q.opts.map(function(opt, i) {
            return '<button class="mcq-opt" data-idx="' + i + '"><span class="opt-letter">' + letters[i] + '</span>' + escH(opt) + '</button>';
          }).join('') +
        '</div>' +
        '<div class="mcq-feedback"></div>' +
      '</div>';
    }).join('') + '</div>';

  // 10-minute countdown
  if (_testTimer) { clearInterval(_testTimer); _testTimer = null; }
  var endTime = Date.now() + 10 * 60 * 1000;
  _testTimer = setInterval(function() {
    var rem = Math.max(0, endTime - Date.now());
    var m = Math.floor(rem / 60000), s = Math.floor((rem % 60000) / 1000);
    var te = document.getElementById('testTimer');
    if (te) { te.textContent = m + ':' + (s < 10 ? '0' : '') + s; if (rem < 60000) te.classList.add('warning'); }
    if (!rem) {
      clearInterval(_testTimer); _testTimer = null;
      var tb = document.getElementById('testModalBody');
      if (tb) tb.querySelectorAll('.mcq-opt:not(.disabled)').forEach(function(b) {
        b.classList.add('disabled');
        if (parseInt(b.dataset.idx) === parseInt(b.closest('.mcq-card').dataset.correct)) b.classList.add('correct');
      });
      showAuthToast('Time up! Test submitted.');
    }
  }, 1000);

  if (body._testHandler) body.removeEventListener('click', body._testHandler);
  body._testHandler = function(e) {
    var btn = e.target.closest('.mcq-opt:not(.disabled)');
    if (!btn) return;
    var card = btn.closest('.mcq-card');
    var chosen = parseInt(btn.dataset.idx), correct = parseInt(card.dataset.correct);
    card.querySelectorAll('.mcq-opt').forEach(function(b, i) {
      b.classList.add('disabled');
      if (i === correct) b.classList.add('correct'); else if (i === chosen) b.classList.add('wrong');
    });
    var fb = card.querySelector('.mcq-feedback');
    if (fb) {
      fb.classList.add('show', chosen === correct ? 'correct' : 'wrong');
      fb.innerHTML = chosen === correct
        ? '✅ <strong>Correct!</strong> ' + escH(card.dataset.exp)
        : '❌ <strong>Wrong.</strong> Correct answer: <strong>' + escH(card.dataset.explbl) + '</strong>. ' + escH(card.dataset.exp);
    }
    // Record to Firestore
    var user = (typeof getUser === 'function') ? getUser() : null;
    if (user && typeof DB !== 'undefined') {
      var isCorr = chosen === correct, qi = parseInt(card.dataset.qIdx) || 0;
      DB.recordAttempt({ subjectId: subject, chapterId: String(chId), questionIdx: qi, chosen: chosen, correct: correct, isCorrect: isCorr }, user.uid);
      DB.recordStudyActivity(user.uid);
      DB.updateMasteryAfterAttempt(subject, String(chId), isCorr, user.uid).then(function(m) {
        if (m) { var k = subject + '_' + chId; _cachedKnowledgeMap[k] = Object.assign(_cachedKnowledgeMap[k] || {}, { mastery: m }); }
      });
      if (!isCorr) {
        var optTxts2 = Array.from(card.querySelectorAll('.mcq-opt')).map(function(b) {
          var sp = b.querySelector('.opt-letter');
          return sp ? b.textContent.slice(sp.textContent.length).trim() : b.textContent.trim();
        });
        DB.recordMistake(subject + '_' + chId + '_' + qi, {
          subjectId: subject, chapterId: String(chId), questionIdx: qi,
          question: (card.querySelector('.mcq-q') || {}).textContent || '',
          correct: correct, chosen: chosen,
          correctText: optTxts2[correct] || '', chosenText: optTxts2[chosen] || ''
        }, user.uid);
      }
    }
    // Score
    var answered = body.querySelectorAll('.mcq-feedback.show').length;
    var correct2 = body.querySelectorAll('.mcq-feedback.correct').length;
    document.getElementById('testScorePill').textContent = correct2 + ' / ' + answered;
    // Completion summary
    if (answered === testMCQs.length && !body.querySelector('.mcq-session-summary')) {
      if (_testTimer) { clearInterval(_testTimer); _testTimer = null; }
      var accuracy = Math.round((correct2 / testMCQs.length) * 100);
      var sm = (accuracy >= 85 && testMCQs.length >= 10) ? 'mastered' : accuracy >= 70 ? 'proficient' : accuracy >= 50 ? 'developing' : 'learning';
      var msgs = { mastered: '🏆 Test passed! Chapter mastered.', proficient: '👍 Solid performance!', developing: '📚 Review weak areas and retest.', learning: '🔄 More practice needed.' };
      var summEl = document.createElement('div');
      summEl.className = 'mcq-session-summary';
      summEl.innerHTML =
        '<div class="summary-score-big">' + correct2 + ' / ' + testMCQs.length + '</div>' +
        '<div class="summary-accuracy">' + accuracy + '% accuracy</div>' +
        '<div style="margin:0.75rem 0">' + renderMasteryBadge(sm) + '</div>' +
        '<div class="summary-message">' + escH(msgs[sm]) + '</div>' +
        (correct2 < testMCQs.length ? '<a href="mistakes.html" class="btn btn-secondary" style="margin-top:1rem;display:inline-block;margin-right:0.5rem">Review Mistakes</a>' : '') +
        '<button class="btn btn-primary" style="margin-top:1rem" onclick="closeTestModal()">Done</button>';
      body.appendChild(summEl);
      summEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };
  body.addEventListener('click', body._testHandler);
  _lastModalTrigger = _lastModalTrigger || document.activeElement;
  modal.classList.add('open');
  _installFocusTrap(modal);
  requestAnimationFrame(function() {
    var closeBtn = modal.querySelector('.mcq-modal-close');
    if (closeBtn) closeBtn.focus();
  });
  body.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeTestModal() {
  if (_testTimer) { clearInterval(_testTimer); _testTimer = null; }
  var modal = document.getElementById('testModal');
  if (modal) {
    modal.classList.remove('open');
    _removeFocusTrap(modal);
    var b = document.getElementById('testModalBody');
    if (b) b.innerHTML = '';
  }
  document.body.style.overflow = '';
  if (_lastModalTrigger) { try { _lastModalTrigger.focus(); } catch(e) {} _lastModalTrigger = null; }
}

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function escH(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ══════════════════════════════════════
   LANDING PAGE (index.html)
══════════════════════════════════════ */
function initLandingPage() {
  /* Auth and nav handled automatically by auth.js.
   * Nothing else needed on the pure landing page. */
}

/* ══════════════════════════════════════
   LEARN PAGE — APP SHELL (learn.html)
══════════════════════════════════════ */
function initLearnPage() {
  renderAppSubjects();
  renderAppTools();
  initAppSearch();

  /* After auth fires and Firestore data loads, try to show Continue Learning.
   * loadUserDataFromFirestore is called by auth.js; we re-render at 600ms and
   * again at 1800ms to catch slow Firestore responses. */
  setTimeout(renderContinueLearning, 600);
  setTimeout(renderContinueLearning, 1800);
}

/* Render 4 subject tiles in learn.html */
function renderAppSubjects() {
  var grid = document.getElementById('appSubjectsGrid');
  if (!grid) return;
  var urlMap = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
  grid.innerHTML = DATA.subjects.map(function(sub) {
    var pct = getSubjectPct(sub.id);
    return '<a href="' + urlMap[sub.id] + '" onclick="return guardNav(event,\'' + urlMap[sub.id] + '\')" class="app-subject-tile ' + sub.id + '">' +
      '<div class="app-tile-icon ' + sub.id + '"><div class="app-tile-icon-mark"></div></div>' +
      '<div class="app-tile-name">' + sub.name + '</div>' +
      '<div class="app-tile-meta">' + sub.chapters.length + ' chapters</div>' +
      '<div class="app-tile-bar"><div class="app-tile-fill" data-w="' + pct + '" style="width:0%"></div></div>' +
    '</a>';
  }).join('');

  setTimeout(function() {
    grid.querySelectorAll('.app-tile-fill[data-w]').forEach(function(el) {
      el.style.width = el.dataset.w + '%';
    });
  }, 100);
}

/* Render 4 study tool cards in learn.html */
function renderAppTools() {
  var grid = document.getElementById('appToolsGrid');
  if (!grid) return;
  var tools = [
    {
      name: 'MCQ Practice',
      desc: 'Science multiple-choice questions, chapter by chapter. Track your mastery as you go.',
      href: 'science.html',
      onclick: 'return guardNav(event,\'science.html\')'
    },
    {
      name: 'Tips & Tricks',
      desc: 'Smart study strategies to help you score 90+ in your board exams.',
      href: 'learn-tips.html',
      onclick: ''
    },
    {
      name: 'Daily Quiz',
      desc: '5 fresh questions every day across all subjects. Build exam habit, one day at a time.',
      href: 'daily-quiz.html',
      onclick: ''
    },
    {
      name: 'Mind Maps',
      desc: 'Visual concept maps for every chapter — see the big picture before diving into details.',
      href: 'mind-maps.html',
      onclick: ''
    }
  ];
  grid.innerHTML = tools.map(function(t) {
    return '<a href="' + t.href + '"' + (t.onclick ? ' onclick="' + t.onclick + '"' : '') + ' class="app-tool-card">' +
      '<div class="app-tool-icon"><div class="app-tool-icon-dot"></div></div>' +
      '<div class="app-tool-body">' +
        '<div class="app-tool-name">' + t.name + '</div>' +
        '<div class="app-tool-desc">' + t.desc + '</div>' +
        (t.badgeId ? '<span class="app-tool-badge" id="' + t.badgeId + '" style="display:none"></span>' : '') +
      '</div>' +
    '</a>';
  }).join('');

}

/* Show the most recently studied chapter as "Continue Learning" */
function renderContinueLearning() {
  var section = document.getElementById('continueSection');
  var wrap    = document.getElementById('continueCardWrap');
  if (!section || !wrap) return;

  var user = (typeof getUser === 'function') ? getUser() : null;
  if (!user) { section.style.display = 'none'; return; }

  var map = _cachedKnowledgeMap;
  if (!map || !Object.keys(map).length) { section.style.display = 'none'; return; }

  /* Find the most recently studied chapter */
  var latest = null, latestTime = 0;
  Object.values(map).forEach(function(entry) {
    var t = 0;
    if (entry.lastStudied) {
      t = entry.lastStudied.toDate ? entry.lastStudied.toDate().getTime()
        : new Date(entry.lastStudied).getTime();
    }
    if (t > latestTime) { latestTime = t; latest = entry; }
  });
  if (!latest) { section.style.display = 'none'; return; }

  var subject = DATA.subjects.find(function(s) { return s.id === latest.subjectId; });
  var chapter = subject && subject.chapters.find(function(c) { return String(c.id) === String(latest.chapterId); });
  if (!subject || !chapter) { section.style.display = 'none'; return; }

  var urlMap = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
  var url = urlMap[subject.id] || 'learn.html';
  var pct = Math.round((latest.accuracy || 0) * 100);
  var masteryLabels = { not_started:'Not started', learning:'Learning', developing:'Developing', proficient:'Proficient', mastered:'Mastered' };
  var masteryLabel = masteryLabels[latest.mastery] || '';

  wrap.innerHTML =
    '<a href="' + url + '" onclick="' +
      'sessionStorage.setItem(\'openChapter\',\'' + chapter.id + '\');return guardNav(event,\'' + url + '\')" ' +
      'class="continue-card">' +
      '<div class="continue-icon"><div class="continue-icon-dot"></div></div>' +
      '<div class="continue-body">' +
        '<div class="continue-label">Continue Learning &nbsp;·&nbsp; ' + subject.name + '</div>' +
        '<div class="continue-title">Ch ' + chapter.id + ' &middot; ' + escH(chapter.title) + '</div>' +
        '<div class="continue-sub">' + (masteryLabel ? masteryLabel + ' · ' : '') + pct + '% accuracy</div>' +
        (pct > 0 ? '<div class="continue-progress"><div class="continue-pfill" style="width:' + pct + '%"></div></div>' : '') +
      '</div>' +
      '<span class="continue-arrow">&#8594;</span>' +
    '</a>';

  section.style.display = '';
}

/* ══════════════════════════════════════
   APP SEARCH (learn.html overlay)
══════════════════════════════════════ */
function initAppSearch() {
  var inp = document.getElementById('appSearchInput');
  var res = document.getElementById('appSearchResults');
  var overlay = document.getElementById('appSearchOverlay');
  if (!inp || !res || !overlay) return;

  inp.addEventListener('input', function() {
    var q = inp.value.trim().toLowerCase();
    if (q.length < 2) { res.innerHTML = ''; return; }
    var hits = [];
    DATA.subjects.forEach(function(sub) {
      sub.chapters.forEach(function(ch) {
        var haystack = (sub.name + ' ' + ch.title + ' ' + (ch.subtitle || '')).toLowerCase();
        if (haystack.includes(q)) {
          hits.push({ sub: sub, ch: ch });
        }
      });
    });
    if (!hits.length) {
      res.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--muted);font-size:.87rem">No results for "' + escH(q) + '"</div>';
      return;
    }
    var urlMap = { maths:'maths.html', science:'science.html', english:'english.html', social:'social.html' };
    res.innerHTML = hits.slice(0, 12).map(function(hit) {
      return '<div class="search-result-item" onclick="' +
        'sessionStorage.setItem(\'openChapter\',\'' + hit.ch.id + '\');' +
        'window.location.href=\'' + urlMap[hit.sub.id] + '\'">' +
        '<div class="result-subject">' + hit.sub.name + '</div>' +
        '<div class="result-title">Ch ' + hit.ch.id + ' &middot; ' + escH(hit.ch.title) + '</div>' +
      '</div>';
    }).join('');
  });

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeAppSearch();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAppSearch();
  });
}

function openAppSearch() {
  var overlay = document.getElementById('appSearchOverlay');
  var inp     = document.getElementById('appSearchInput');
  if (!overlay) return;
  overlay.classList.add('open');
  if (inp) { inp.value = ''; inp.focus(); }
  document.body.style.overflow = 'hidden';
}

function closeAppSearch() {
  var overlay = document.getElementById('appSearchOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

