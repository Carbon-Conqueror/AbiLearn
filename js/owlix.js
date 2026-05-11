/* Owlix AI — AbiLearn v7
   Powered by Google Gemini · Free · No user key needed · Image/Camera support */

'use strict';

/* ─────────────────────────────────────────────────────────────
   🔑 SITE OWNER: Get your FREE Gemini key at
      https://aistudio.google.com/apikey
   Then replace the string below with your key.
   ───────────────────────────────────────────────────────────── */
const GEMINI_KEY = 'AIzaSyAyYmORal6QD9fsDq7ceS31jPV2D6-8TKs';
const GEMINI_MODEL = 'gemini-2.0-flash';

/* ══ CONVERSATION MEMORY (Gemini format) ══ */
const OWLIX_MEMORY = [];   /* [{role:'user'|'model', parts:[{text}]}] */
const MAX_MEMORY   = 20;

function memoryPush(role, text) {
  OWLIX_MEMORY.push({ role, parts: [{ text }] });
  if (OWLIX_MEMORY.length > MAX_MEMORY) OWLIX_MEMORY.shift();
}

/* ══ PENDING IMAGE ══ */
let PENDING_IMAGE = null;  /* {base64, mediaType, previewUrl, name} */

/* ══ SYSTEM PROMPT ══ */
const OWLIX_SYSTEM = `You are Owlix, an expert AI doubt-solving tutor on AbiLearn for CBSE Class 10 students in India. You work exactly like Vedantu's Ved AI — you solve every doubt completely, step by step, with full explanations.

BEHAVIOR:
- Solve every question fully — never give partial answers
- For MATHS: write every step clearly, show all workings, state the formula first, then solve
- For SCIENCE: explain the concept, then apply it; give diagrams in text form when helpful
- For images/photos: read everything in the image carefully, identify the question, and solve it completely
- For English: explain meaning, context, themes, characters with board-exam relevant points
- For Social Science: give timeline, key facts, causes-effects, and important dates
- Always end with: a memory tip, common mistake warning, or board-exam tip
- If a student seems confused, simplify with a real-life analogy
- Encourage students warmly — they are working hard for their board exams

FORMAT (use markdown):
- **bold** for formulas, key terms, answers
- Numbered steps (1. 2. 3.) for solutions
- Bullet points for lists of facts
- \`inline code\` for equations and formulas
- ## for section headers in long answers

Be like the best tutor a student could have — patient, clear, encouraging, and complete.`;


/* ══ MARKDOWN → HTML ══ */
function mdToHtml(text) {
  return text
    .replace(/^### (.+)$/gm, '<strong style="color:#5B21B6;font-size:0.95rem;display:block;margin:0.4rem 0 0.1rem">$1</strong>')
    .replace(/^## (.+)$/gm,  '<strong style="color:#5B21B6;display:block;margin:0.4rem 0 0.1rem">$1</strong>')
    .replace(/^# (.+)$/gm,   '<strong style="color:#5B21B6;font-size:1.05rem;display:block;margin:0.4rem 0 0.1rem">$1</strong>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,     '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,         '<em>$1</em>')
    .replace(/`([^`\n]+)`/g,       '<code class="owlix-code">$1</code>')
    .replace(/^[-*] (.+)$/gm, '<span style="display:block;padding-left:0.5rem">• $1</span>')
    .replace(/^(\d+)\. (.+)$/gm, '<span style="display:block;padding-left:0.5rem">$1. $2</span>')
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" style="color:#7C3AED">$1</a>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function escOwlix(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ══ INSTANT MATH SOLVER ══ */
function tryMath(msg) {
  const clean = msg.trim().replace(/×/g,'*').replace(/÷/g,'/').replace(/²/g,'**2').replace(/³/g,'**3').replace(/\^/g,'**');
  if (/^[\d\s\+\-\*\/\.\(\)\%\*]+$/.test(clean) && clean.length < 80) {
    try {
      // eslint-disable-next-line no-new-func
      const r = Function('"use strict"; return (' + clean + ')')();
      if (typeof r === 'number' && isFinite(r)) return '**Result:** `' + msg.trim() + ' = ' + (+r.toFixed(8)) + '`';
    } catch { /* not arithmetic */ }
  }
  return null;
}

/* ══ IMAGE HANDLING ══ */
function handleImageSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
  if (file.size > 8 * 1024 * 1024) { alert('Image too large — please use under 8 MB.'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const dataUrl = ev.target.result;
    PENDING_IMAGE = { base64: dataUrl.split(',')[1], mediaType: file.type || 'image/jpeg', previewUrl: dataUrl, name: file.name || 'photo' };
    renderImagePreview();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function renderImagePreview() {
  if (!PENDING_IMAGE) return;
  const p = document.getElementById('owlix-img-preview');
  if (!p) return;
  p.style.display = 'block';
  p.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.6rem;background:rgba(124,58,237,0.07);border:1px solid rgba(124,58,237,0.18);border-radius:10px;padding:0.5rem 0.7rem">
      <img src="${PENDING_IMAGE.previewUrl}" style="height:44px;width:44px;object-fit:cover;border-radius:7px;flex-shrink:0">
      <div style="flex:1;min-width:0">
        <div style="font-size:0.75rem;font-weight:700;color:#5B21B6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escOwlix(PENDING_IMAGE.name)}</div>
        <div style="font-size:0.68rem;color:#9CA3AF">Ready to send — type a question or just press send</div>
      </div>
      <button onclick="clearPendingImage()" style="background:rgba(0,0,0,0.05);border:none;cursor:pointer;color:#6B7280;font-size:0.85rem;padding:0.2rem 0.5rem;border-radius:6px">✕</button>
    </div>`;
}

function clearPendingImage() {
  PENDING_IMAGE = null;
  const p = document.getElementById('owlix-img-preview');
  if (p) { p.style.display = 'none'; p.innerHTML = ''; }
}

/* ══ GEMINI STREAMING API ══ */
async function streamGemini(contents) {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;

  /* Show streaming bubble */
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg bot';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const bubbleId = 'owlix-stream-' + Date.now();
  msgDiv.innerHTML = `<div class="msg-av">🦉</div><div><div class="msg-bbl" id="${bubbleId}"><span class="owlix-cursor"></span></div><div class="msg-time">${now}</div></div>`;
  msgs.appendChild(msgDiv);
  msgs.scrollTop = msgs.scrollHeight;
  const bubble = document.getElementById(bubbleId);

  /* Key guard */
  if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_GEMINI_KEY_HERE') {
    if (bubble) bubble.innerHTML = mdToHtml(`⚠️ **Owlix AI not configured yet.**\n\nThe site owner needs to add a free Gemini API key in \`js/owlix.js\`.\n\nGet one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)`);
    return;
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?key=${GEMINI_KEY}&alt=sse`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: OWLIX_SYSTEM }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048, topK: 40, topP: 0.95 }
      })
    });

    if (!res.ok) {
      let msg = `Error ${res.status}.`;
      try { const j = await res.json(); msg = j.error?.message || msg; } catch { /* skip */ }
      if (bubble) bubble.innerHTML = mdToHtml(`❌ **${msg}**\n\nPlease try again.`);
      return;
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buf = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const json = line.slice(6).trim();
        if (!json) continue;
        try {
          const evt = JSON.parse(json);
          const chunk = evt.candidates?.[0]?.content?.parts?.[0]?.text;
          if (chunk) {
            fullText += chunk;
            if (bubble) {
              bubble.innerHTML = mdToHtml(fullText) + '<span class="owlix-cursor"></span>';
              msgs.scrollTop = msgs.scrollHeight;
            }
          }
        } catch { /* skip malformed */ }
      }
    }

    if (bubble) { bubble.innerHTML = mdToHtml(fullText); msgs.scrollTop = msgs.scrollHeight; }
    memoryPush('model', fullText);

  } catch {
    if (bubble) bubble.innerHTML = mdToHtml(`❌ **Connection error.** Check your internet and try again.`);
  }
}

/* ══ MAIN SEND ══ */
async function sendOwlixMessage(text) {
  const win = document.getElementById('owlixWindow');
  if (win && !win.classList.contains('open')) win.classList.add('open');

  const cleanText = (text || '').trim();
  const image = PENDING_IMAGE;
  if (image) clearPendingImage();
  if (!cleanText && !image) return;

  /* Show user bubble */
  let userHtml = '';
  if (image) userHtml += `<img src="${image.previewUrl}" style="max-width:200px;max-height:200px;border-radius:8px;display:block;margin-bottom:0.35rem;object-fit:cover">`;
  if (cleanText) userHtml += escOwlix(cleanText);
  addOwlixMsg('user', userHtml);

  /* Instant math (text only) */
  if (!image && cleanText) {
    const math = tryMath(cleanText);
    if (math) {
      addOwlixMsg('bot', mdToHtml(math));
      memoryPush('user', cleanText);
      memoryPush('model', math);
      return;
    }
  }

  /* Build Gemini contents (history + current message) */
  const userParts = [];
  if (image) userParts.push({ inline_data: { mime_type: image.mediaType, data: image.base64 } });
  const msgText = cleanText || 'Please analyze this image and help me with it.';
  userParts.push({ text: msgText });

  memoryPush('user', image ? `[image] ${cleanText}`.trim() : cleanText);

  const contents = [
    ...OWLIX_MEMORY.slice(0, -1),              /* history without the last user push */
    { role: 'user', parts: userParts }          /* current message with optional image */
  ];

  await streamGemini(contents);
}

/* ══ UI HELPERS ══ */
function addOwlixMsg(type, html) {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `<div class="msg-av">${type === 'bot' ? '🦉' : '👤'}</div><div><div class="msg-bbl">${html}</div><div class="msg-time">${now}</div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ══ INJECT STYLES ══ */
function injectOwlixStyles() {
  if (document.getElementById('owlix-v7-styles')) return;
  const s = document.createElement('style');
  s.id = 'owlix-v7-styles';
  s.textContent = `
    .owlix-cursor{display:inline-block;width:2px;height:1.1em;background:#7C3AED;margin-left:2px;
      vertical-align:text-bottom;border-radius:1px;animation:owlix-blink 0.6s ease-in-out infinite;}
    @keyframes owlix-blink{0%,100%{opacity:1}50%{opacity:0}}
    .owlix-code{background:rgba(124,58,237,0.1);padding:1px 5px;border-radius:4px;
      font-family:'Courier New',monospace;font-size:0.85em;color:#5B21B6;}
    .owlix-img-btn{background:none;border:none;cursor:pointer;font-size:1.25rem;
      padding:0 0.35rem;opacity:0.65;transition:opacity 0.15s;flex-shrink:0;}
    .owlix-img-btn:hover{opacity:1;}
    #owlix-img-preview{padding:0.4rem 0.6rem 0;}
    .msg-bbl img{max-width:100%;border-radius:8px;display:block;margin-bottom:0.3rem;}
  `;
  document.head.appendChild(s);
}

/* ══ INIT ══ */
function initOwlix() {
  const toggle = document.getElementById('owlixToggle');
  const win    = document.getElementById('owlixWindow');
  const close  = document.getElementById('owlixClose');
  const input  = document.getElementById('owlixInput');
  const send   = document.getElementById('owlixSend');
  const qrWrap = document.getElementById('quickReplies');
  if (!toggle || !win) return;

  injectOwlixStyles();

  if (input) input.placeholder = 'Ask anything or describe your photo...';

  /* Inject 📷 button + file input + preview div */
  const inputRow = win.querySelector('.owlix-input-row');
  if (inputRow && !inputRow.querySelector('.owlix-img-btn')) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*';
    fileInput.id = 'owlixFileInput'; fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleImageSelect);

    const imgBtn = document.createElement('button');
    imgBtn.className = 'owlix-img-btn'; imgBtn.type = 'button';
    imgBtn.title = 'Upload photo or use camera';
    imgBtn.innerHTML = '📷';
    imgBtn.addEventListener('click', () => document.getElementById('owlixFileInput').click());

    const previewDiv = document.createElement('div');
    previewDiv.id = 'owlix-img-preview'; previewDiv.style.display = 'none';

    inputRow.before(previewDiv);
    inputRow.prepend(fileInput);
    inputRow.prepend(imgBtn);
  }

  /* Quick reply chips */
  if (qrWrap) {
    const chips = [
      { label: '📷 Photo se solve karo', action: () => document.getElementById('owlixFileInput').click() },
      { label: '📐 Maths problem solve',  action: () => sendOwlixMessage('Solve: x² - 5x + 6 = 0 step by step') },
      { label: '🔬 Science doubt',        action: () => sendOwlixMessage('Explain Ohm\'s Law with formula and example') },
      { label: '📖 English chapter help', action: () => sendOwlixMessage('Explain the story A Letter to God — themes and board important points') },
      { label: '🌍 History quick notes',  action: () => sendOwlixMessage('Key points of Dandi March for board exam') }
    ];
    qrWrap.innerHTML = chips.map((c, i) =>
      `<button class="qr-btn" ${i === 0 ? 'style="border-color:rgba(124,58,237,0.4);background:rgba(124,58,237,0.07)"' : ''}
        onclick="owlixChips[${i}]()">${c.label}</button>`
    ).join('');
    window.owlixChips = chips.map(c => c.action);
  }

  /* Welcome message */
  setTimeout(() => {
    const ready = GEMINI_KEY && GEMINI_KEY !== 'YOUR_GEMINI_KEY_HERE';
    addOwlixMsg('bot', mdToHtml(ready
      ? `👋 **Hi! I'm Owlix — your personal doubt-solving tutor!**\n\nI work just like **Vedantu's Ved AI** — send me any doubt and I'll solve it completely:\n\n- 📷 **Photo upload** — click 📷 to photograph your textbook or question paper\n- 📐 **Maths** — step-by-step solutions with full working\n- 🔬 **Science** — Physics, Chemistry, Biology explained simply\n- 📖 **English + Social** — chapter explanations, board-exam points\n\nKuch bhi poochho — main hoon na! 🦉`
      : `👋 **Hi! I'm Owlix!**\n\n⚠️ I'm not fully set up yet.\n\nThe site owner needs to add a Gemini API key in \`js/owlix.js\`.\nGet one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)`));
  }, 500);

  /* Events */
  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    const badge = toggle.querySelector('.owlix-badge');
    if (badge && win.classList.contains('open')) badge.style.display = 'none';
  });
  if (close)  close.addEventListener('click', () => win.classList.remove('open'));
  if (send)   send.addEventListener('click', submitOwlix);
  if (input)  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) submitOwlix(); });

  /* Paste image support (Ctrl+V) */
  document.addEventListener('paste', e => {
    if (!win.classList.contains('open')) return;
    for (const item of (e.clipboardData?.items || [])) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = ev => {
          const dataUrl = ev.target.result;
          PENDING_IMAGE = { base64: dataUrl.split(',')[1], mediaType: file.type, previewUrl: dataUrl, name: 'pasted-image' };
          renderImagePreview();
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  });
}

function submitOwlix() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  input.value = '';
  sendOwlixMessage(text);
}

document.addEventListener('DOMContentLoaded', initOwlix);
