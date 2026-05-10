/* AbiLearn - Main Application Logic */

/* ====== PROGRESS STORAGE ====== */
function getProgress() {
  try { return JSON.parse(localStorage.getItem('abilearn_progress') || '{}'); }
  catch { return {}; }
}
function saveProgress(data) {
  try { localStorage.setItem('abilearn_progress', JSON.stringify(data)); } catch {}
}
function getSubjectProgress(subjectId) {
  const p = getProgress();
  const subject = DATA.subjects.find(s => s.id === subjectId);
  if (!subject) return 0;
  const total = subject.chapters.length;
  const done = subject.chapters.filter(ch => p[subjectId + '_' + ch.id]).length;
  return total ? Math.round((done / total) * 100) : 0;
}

/* ====== SEARCH ====== */
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.classList.remove('show'); return; }

    const matches = [];
    DATA.subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        const searchText = (ch.title + ' ' + ch.subtitle + ' ' + (ch.keyPoints || []).join(' ')).toLowerCase();
        if (searchText.includes(q)) {
          matches.push({ subject: sub, chapter: ch });
        }
      });
    });

    if (matches.length === 0) {
      results.innerHTML = '<div class="search-result-item"><div class="result-title">No results found</div></div>';
    } else {
      results.innerHTML = matches.slice(0, 8).map(m =>
        `<div class="search-result-item" onclick="goToChapter('${m.subject.id}', ${m.chapter.id})">
          <div class="result-subject">${m.subject.name}</div>
          <div class="result-title">${m.chapter.title}</div>
        </div>`
      ).join('');
    }
    results.classList.add('show');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar')) results.classList.remove('show');
  });
}

function goToChapter(subjectId, chapterId) {
  const pages = { maths: 'maths.html', science: 'science.html', english: 'english.html', social: 'social.html' };
  if (pages[subjectId]) {
    sessionStorage.setItem('openChapter', chapterId);
    window.location.href = pages[subjectId];
  }
}

/* ====== HAMBURGER ====== */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ====== HOME PAGE ====== */
function initHomePage() {
  initSearch();
  initHamburger();
  renderSubjectCards();
  renderTips();
  setTimeout(() => animateProgressBars(), 300);
}

function renderSubjectCards() {
  const grid = document.getElementById('subjectsGrid');
  if (!grid) return;
  const pages = { maths: 'maths.html', science: 'science.html', english: 'english.html', social: 'social.html' };
  grid.innerHTML = DATA.subjects.map(sub => {
    const progress = getSubjectProgress(sub.id);
    return `
      <a href="${pages[sub.id]}" class="subject-card ${sub.id}" title="Go to ${sub.name}">
        <div class="subject-card-header">
          <div class="subject-icon">${sub.icon}</div>
          <div>
            <h2>${sub.name}</h2>
            <p>${sub.description}</p>
          </div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-label">
            <span>Progress</span><span>${progress}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" data-width="${progress}" style="width:0%"></div>
          </div>
        </div>
        <div class="subject-card-footer">
          <span class="chapter-count">${sub.chapters.length} Chapters</span>
          <div class="card-arrow">›</div>
        </div>
      </a>`;
  }).join('');
}

function animateProgressBars() {
  document.querySelectorAll('.progress-fill[data-width]').forEach(el => {
    el.style.width = el.dataset.width + '%';
  });
}

function renderTips() {
  const grid = document.getElementById('tipsGrid');
  if (!grid) return;
  grid.innerHTML = STUDY_TIPS.map(t => `
    <div class="tip-card">
      <div class="tip-icon">${t.icon}</div>
      <h4>${t.title}</h4>
      <p>${t.text}</p>
    </div>`).join('');
}

/* ====== SUBJECT PAGE ====== */
function initSubjectPage(subjectId) {
  initSearch();
  initHamburger();
  const subject = DATA.subjects.find(s => s.id === subjectId);
  if (!subject) return;
  renderSubjectContent(subject);
  initTabs(subjectId);
  renderChapters(subject);
  renderQuizTab(subject);

  // Auto-open chapter from search
  const openChapter = sessionStorage.getItem('openChapter');
  if (openChapter) {
    sessionStorage.removeItem('openChapter');
    setTimeout(() => {
      const el = document.getElementById('chapter-' + openChapter);
      if (el) { el.click(); el.closest('.chapter-item').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }, 400);
  }
}

function renderSubjectContent(subject) {
  const el = document.getElementById('subjectContent');
  if (!el) return;
  el.innerHTML = `
    <div class="subject-header ${subject.id}">
      <div class="subject-header-content">
        <div class="subject-header-icon">${subject.icon}</div>
        <div>
          <div class="subject-breadcrumb">
            <a href="index.html">🏠 Home</a> › ${subject.name}
          </div>
          <h1>${subject.name}</h1>
          <p>${subject.description} &nbsp;|&nbsp; ${subject.chapters.length} Chapters</p>
        </div>
      </div>
    </div>
    <div class="tabs">
      <div class="tabs-container">
        <button class="tab-btn ${subject.id}-tab active" data-tab="chapters">📚 Chapters</button>
        <button class="tab-btn ${subject.id}-tab" data-tab="quiz">🎯 Full Quiz</button>
        <button class="tab-btn ${subject.id}-tab" data-tab="summary">📋 Summary</button>
      </div>
    </div>
    <div class="container">
      <div class="section">
        <div id="tab-chapters" class="tab-panel active">
          <div class="chapter-filter" id="chapterFilter"></div>
          <div class="chapters-list" id="chaptersList"></div>
        </div>
        <div id="tab-quiz" class="tab-panel">
          <div class="quiz-container" id="quizContainer"></div>
        </div>
        <div id="tab-summary" class="tab-panel">
          <div id="summaryContent"></div>
        </div>
      </div>
    </div>`;
}

function initTabs(subjectId) {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + tabId);
    if (panel) panel.classList.add('active');
    if (tabId === 'summary') renderSummary(subjectId);
  });
}

/* ====== CHAPTERS ====== */
function renderChapters(subject) {
  const list = document.getElementById('chaptersList');
  const filterDiv = document.getElementById('chapterFilter');
  if (!list) return;

  if (filterDiv) {
    filterDiv.innerHTML = `
      <button class="filter-btn active" data-filter="all">All Chapters</button>
      <button class="filter-btn" data-filter="done">✅ Completed</button>
      <button class="filter-btn" data-filter="pending">⏳ Pending</button>`;
    filterDiv.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterDiv.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterChapters(subject, btn.dataset.filter);
    });
  }

  list.innerHTML = subject.chapters.map(ch => buildChapterHTML(subject.id, ch)).join('');

  // Accordion click
  list.addEventListener('click', e => {
    const header = e.target.closest('.chapter-header');
    const doneBtn = e.target.closest('.chapter-done-btn');

    if (doneBtn) {
      e.stopPropagation();
      toggleChapterDone(subject.id, doneBtn.dataset.chapter, doneBtn);
      return;
    }
    if (header) {
      const item = header.closest('.chapter-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.chapter-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }
  });

  // MCQ click handling
  list.addEventListener('click', e => {
    const opt = e.target.closest('.mcq-option:not(.disabled)');
    if (!opt) return;
    const questionDiv = opt.closest('.mcq-question');
    const answerIndex = parseInt(opt.dataset.index);
    const correctIndex = parseInt(questionDiv.dataset.correct);

    questionDiv.querySelectorAll('.mcq-option').forEach((o, i) => {
      o.classList.add('disabled');
      if (i === correctIndex) o.classList.add('correct');
      else if (i === answerIndex) o.classList.add('wrong');
    });

    const feedback = questionDiv.querySelector('.mcq-feedback');
    if (feedback) {
      feedback.classList.add('show', answerIndex === correctIndex ? 'correct' : 'wrong');
      feedback.textContent = answerIndex === correctIndex
        ? '✅ Correct! ' + (questionDiv.dataset.exp || '')
        : '❌ Wrong. The correct answer is: ' + questionDiv.dataset.expLabel + '. ' + (questionDiv.dataset.exp || '');
    }
  });
}

function buildChapterHTML(subjectId, ch) {
  const progress = getProgress();
  const isDone = !!progress[subjectId + '_' + ch.id];
  const numClass = { maths: 'maths-num', science: 'science-num', english: 'english-num', social: 'social-num' }[subjectId] || '';

  const keyPointsHTML = ch.keyPoints?.length
    ? `<div class="key-points"><h4>🔑 Key Points</h4><ul>${ch.keyPoints.map(p => `<li>${p}</li>`).join('')}</ul></div>` : '';

  const formulasHTML = ch.formulas?.length
    ? `<div class="formulas"><h4>📐 Formulas / Key Info</h4>${ch.formulas.map(f => `<div class="formula-box">${f}</div>`).join('')}</div>` : '';

  const mcqsHTML = ch.mcqs?.length
    ? `<div class="mcq-section"><h4>✏️ Quick MCQ Practice</h4>${ch.mcqs.map((q, qi) => buildMCQHTML(q, qi)).join('')}</div>` : '';

  return `
    <div class="chapter-item" id="chapter-item-${ch.id}">
      <div class="chapter-header" id="chapter-${ch.id}">
        <div class="chapter-number ${numClass}">${ch.id}</div>
        <div class="chapter-title-group">
          <div class="chapter-title">${ch.title}</div>
          <div class="chapter-subtitle">${ch.subtitle}</div>
        </div>
        <button class="chapter-done-btn ${isDone ? 'done' : ''}" data-chapter="${ch.id}" title="Mark as done">✓</button>
        <span class="chapter-toggle">▼</span>
      </div>
      <div class="chapter-body">
        <div class="chapter-content">
          ${keyPointsHTML}
          ${formulasHTML}
          ${mcqsHTML}
        </div>
      </div>
    </div>`;
}

function buildMCQHTML(q, qi) {
  const letters = ['A', 'B', 'C', 'D'];
  return `
    <div class="mcq-question" data-correct="${q.ans}" data-exp="${escapeHTML(q.exp || '')}" data-exp-label="${escapeHTML(q.opts[q.ans])}">
      <div class="mcq-q-text">${qi + 1}. ${q.q}</div>
      <div class="mcq-options">
        ${q.opts.map((opt, i) => `
          <div class="mcq-option" data-index="${i}">
            <span class="option-letter">${letters[i]}</span>${opt}
          </div>`).join('')}
      </div>
      <div class="mcq-feedback"></div>
    </div>`;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toggleChapterDone(subjectId, chapterId, btn) {
  const p = getProgress();
  const key = subjectId + '_' + chapterId;
  p[key] = !p[key];
  saveProgress(p);
  btn.classList.toggle('done', !!p[key]);
}

function filterChapters(subject, filter) {
  const p = getProgress();
  document.querySelectorAll('.chapter-item').forEach((el, i) => {
    const ch = subject.chapters[i];
    if (!ch) return;
    const isDone = !!p[society + '_' + ch.id];
    if (filter === 'all') el.style.display = '';
    else if (filter === 'done') el.style.display = isDone ? '' : 'none';
    else el.style.display = !isDone ? '' : 'none';
  });
}

/* ====== FULL QUIZ ====== */
let quizState = {};

function renderQuizTab(subject) {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  // Collect all MCQs with chapter info
  const allQ = [];
  subject.chapters.forEach(ch => {
    (ch.mcqs || []).forEach(q => allQ.push({ ...q, chapter: ch.title }));
  });

  if (allQ.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--gray);padding:2rem">No quiz questions available yet.</p>';
    return;
  }

  quizState = {
    questions: shuffleArray(allQ),
    current: 0,
    score: 0,
    answered: false,
    subjectId: subject.id
  };

  renderQuizQuestion(container);
}

function renderQuizQuestion(container) {
  const { questions, current, score } = quizState;
  const total = questions.length;

  if (current >= total) {
    renderQuizResult(container, score, total);
    return;
  }

  const q = questions[current];
  const letters = ['A', 'B', 'C', 'D'];
  const pct = Math.round((current / total) * 100);

  container.innerHTML = `
    <div class="quiz-header">
      <div>
        <div style="font-weight:700;margin-bottom:0.3rem">Question ${current + 1} of ${total}</div>
        <div style="font-size:0.8rem;color:var(--gray)">${q.chapter}</div>
        <div class="progress-bar" style="width:200px;margin-top:0.4rem">
          <div class="progress-fill" style="width:${pct}%;background:var(--primary);transition:width 0.5s"></div>
        </div>
      </div>
      <div class="quiz-score" style="text-align:right">
        <div class="quiz-score-number">${score}</div>
        <div class="quiz-score-label">Score</div>
      </div>
    </div>
    <div class="quiz-card">
      <div class="question-number">Question ${current + 1}</div>
      <div class="question-text">${q.q}</div>
      <div class="quiz-options">
        ${q.opts.map((opt, i) => `
          <button class="quiz-option-btn" data-index="${i}" onclick="handleQuizAnswer(this, ${i}, ${q.ans}, '${escapeHTML(q.exp || '')}')">
            <span class="option-letter">${letters[i]}</span>${opt}
          </button>`).join('')}
      </div>
      <div id="quizFeedback" style="margin-top:1rem;display:none;padding:0.75rem;border-radius:8px;font-size:0.88rem"></div>
    </div>
    <div class="quiz-nav">
      <button class="btn btn-outline" onclick="skipQuestion()" id="skipBtn">Skip →</button>
      <button class="btn btn-primary" onclick="nextQuestion()" id="nextBtn" disabled>Next Question →</button>
    </div>`;
}

function handleQuizAnswer(btn, chosen, correct, explanation) {
  if (quizState.answered) return;
  quizState.answered = true;

  document.querySelectorAll('.quiz-option-btn').forEach((b, i) => {
    b.classList.add('disabled');
    if (i === correct) b.classList.add('correct');
    else if (i === chosen) b.classList.add('wrong');
  });

  if (chosen === correct) quizState.score++;

  const feedback = document.getElementById('quizFeedback');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.style.background = chosen === correct ? '#f0fff7' : '#fff5f5';
    feedback.style.color = chosen === correct ? '#00875a' : '#c0392b';
    feedback.style.border = `1px solid ${chosen === correct ? '#00b894' : '#ff7675'}`;
    feedback.textContent = (chosen === correct ? '✅ Correct! ' : '❌ Wrong. ') + explanation;
  }

  const nextBtn = document.getElementById('nextBtn');
  if (nextBtn) nextBtn.disabled = false;
}

function nextQuestion() {
  quizState.current++;
  quizState.answered = false;
  const container = document.getElementById('quizContainer');
  if (container) renderQuizQuestion(container);
}

function skipQuestion() {
  quizState.current++;
  quizState.answered = false;
  const container = document.getElementById('quizContainer');
  if (container) renderQuizQuestion(container);
}

function renderQuizResult(container, score, total) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎉' : pct >= 40 ? '👍' : '📚';
  const msg = pct >= 80 ? 'Outstanding! Board exam ready!' : pct >= 60 ? 'Great work! Keep revising.' : pct >= 40 ? 'Good effort! Review weak topics.' : 'Keep practicing — you\'ll get there!';

  container.innerHTML = `
    <div class="quiz-result">
      <div class="result-emoji">${emoji}</div>
      <div class="result-score">${score} / ${total}</div>
      <div style="font-size:1.5rem;font-weight:700;margin:0.5rem 0">${pct}%</div>
      <div class="result-text">${msg}</div>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="location.reload()">🔄 Try Again</button>
        <button class="btn btn-outline" onclick="document.querySelector('[data-tab=chapters]').click()">📚 Review Chapters</button>
      </div>
    </div>`;
}

/* ====== SUMMARY TAB ====== */
function renderSummary(subjectId) {
  const el = document.getElementById('summaryContent');
  if (!el || el.innerHTML.trim()) return;
  const subject = DATA.subjects.find(s => s.id === subjectId);
  if (!subject) return;

  el.innerHTML = `
    <div style="display:grid;gap:1rem">
      ${subject.chapters.map(ch => `
        <div style="background:white;border-radius:16px;padding:1.5rem;box-shadow:var(--shadow-sm)">
          <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.75rem;display:flex;align-items:center;gap:0.5rem">
            <span style="background:var(--${subject.id});color:${['english','social'].includes(subject.id)?'#333':'white'};width:28px;height:28px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0">${ch.id}</span>
            ${ch.title}
          </h3>
          ${ch.keyPoints?.slice(0,4).map(p => `<div style="font-size:0.85rem;padding:0.3rem 0 0.3rem 1rem;border-left:3px solid var(--${subject.id});margin-bottom:0.3rem;color:#444">${p}</div>`).join('') || ''}
        </div>`).join('')}
    </div>`;
}

/* ====== HELPERS ====== */
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fix filterChapters bug — society should be subjectId
function filterChapters(subject, filter) {
  const p = getProgress();
  document.querySelectorAll('.chapter-item').forEach((el, i) => {
    const ch = subject.chapters[i];
    if (!ch) return;
    const isDone = !!p[subject.id + '_' + ch.id];
    if (filter === 'all') el.style.display = '';
    else if (filter === 'done') el.style.display = isDone ? '' : 'none';
    else el.style.display = !isDone ? '' : 'none';
  });
}
