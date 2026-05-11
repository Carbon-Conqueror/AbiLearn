/* Owlix AI — AbiLearn v6
   Pure Claude AI · Streaming · Vision (image/camera upload) · No local KB */

'use strict';

/* ══ CONVERSATION MEMORY ══ */
const OWLIX_MEMORY = [];
const MAX_MEMORY = 20;
let PENDING_IMAGE = null;

function memoryPush(role, text) {
  OWLIX_MEMORY.push({ role, content: text });
  if (OWLIX_MEMORY.length > MAX_MEMORY) OWLIX_MEMORY.shift();
}

/* ══ SYSTEM PROMPT ══ */
const OWLIX_SYSTEM = `You are Owlix, an AI assistant on AbiLearn — an educational platform for students in India.
You are exactly like Claude — you can answer anything, analyze images, solve math problems shown in photos, explain concepts, write code, check homework, and help with any subject.

For images: carefully describe what you see, solve any problems shown, and explain step by step.
For math: show all working steps clearly.
For CBSE topics: give board-exam relevant explanations.

Format with markdown: **bold** for key terms, numbered lists for steps, bullet lists for facts, \`code\` for formulas. Be clear, accurate, warm, and student-friendly.`;

/* ══ MARKDOWN → HTML ══ */
function mdToHtml(text) {
  return text
    .replace(/^### (.+)$/gm, '<strong style="color:#5B21B6;font-size:0.95rem;display:block;margin:0.5rem 0 0.2rem">$1</strong>')
    .replace(/^## (.+)$/gm, '<strong style="color:#5B21B6;display:block;margin:0.5rem 0 0.2rem">$1</strong>')
    .replace(/^# (.+)$/gm, '<strong style="color:#5B21B6;font-size:1.05rem;display:block;margin:0.5rem 0 0.2rem">$1</strong>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code class="owlix-code">$1</code>')
    .replace(/^[-*] (.+)$/gm, '<span style="display:block;padding-left:0.5rem">• $1</span>')
    .replace(/^(\d+)\. (.+)$/gm, '<span style="display:block;padding-left:0.5rem">$1. $2</span>')
    .replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" style="color:#7C3AED">$1</a>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function escOwlix(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ══ MATH SOLVER (instant arithmetic) ══ */
function tryMath(msg) {
  const clean = msg.trim().replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '**2').replace(/³/g, '**3').replace(/\^/g, '**');
  if (/^[\d\s\+\-\*\/\.\(\)\%\*]+$/.test(clean) && clean.length < 100) {
    try {
      // eslint-disable-next-line no-new-func
      const r = Function('"use strict"; return (' + clean + ')')();
      if (typeof r === 'number' && isFinite(r)) return `**Result:** \`${msg.trim()} = ${+r.toFixed(8)}\``;
    } catch { /* not valid arithmetic */ }
  }
  return null;
}

/* ══ IMAGE HANDLING ══ */
function handleImageSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
  if (file.size > 5 * 1024 * 1024) { alert('Image too large. Please use an image under 5 MB.'); return; }

  const reader = new FileReader();
  reader.onload = ev => {
    const dataUrl = ev.target.result;
    PENDING_IMAGE = {
      base64: dataUrl.split(',')[1],
      mediaType: file.type || 'image/jpeg',
      previewUrl: dataUrl,
      name: file.name || 'photo'
    };
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
      <img src="${PENDING_IMAGE.previewUrl}" style="height:48px;width:48px;object-fit:cover;border-radius:7px;flex-shrink:0;border:1px solid rgba(124,58,237,0.2)">
      <div style="flex:1;min-width:0">
        <div style="font-size:0.75rem;font-weight:700;color:#5B21B6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escOwlix(PENDING_IMAGE.name)}</div>
        <div style="font-size:0.68rem;color:#9CA3AF;margin-top:1px">Image ready — type a question or send now</div>
      </div>
      <button onclick="clearPendingImage()" title="Remove image" style="background:rgba(0,0,0,0.06);border:none;cursor:pointer;color:#6B7280;font-size:0.9rem;padding:0.25rem 0.4rem;border-radius:6px;line-height:1">✕</button>
    </div>`;
}

function clearPendingImage() {
  PENDING_IMAGE = null;
  const p = document.getElementById('owlix-img-preview');
  if (p) { p.style.display = 'none'; p.innerHTML = ''; }
}

/* ══ STREAMING CLAUDE API ══ */
async function streamOwlixAI(apiContent) {
  const key = sessionStorage.getItem('owlix_api_key') || '';
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;

  if (!key) {
    addOwlixMsg('bot', mdToHtml(`## Connect Claude AI to chat! ⚙️\n\nClick the **⚙️** button at the top of this chat to enter your API key.\n\nOnce connected I can:\n- Answer **any question** like ChatGPT\n- **Analyze photos** — photograph your textbook or handwritten problem\n- Solve **math from images**\n- Help with **any subject**\n\n[Get your free Anthropic API key →](https://console.anthropic.com)`));
    return;
  }

  /* Create streaming bubble */
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg bot';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const bubbleId = 'owlix-stream-' + Date.now();
  msgDiv.innerHTML = `<div class="msg-av">🦉</div><div><div class="msg-bbl" id="${bubbleId}"><span class="owlix-cursor"></span></div><div class="msg-time">${now}</div></div>`;
  msgs.appendChild(msgDiv);
  msgs.scrollTop = msgs.scrollHeight;
  const bubble = document.getElementById(bubbleId);

  try {
    /* Build messages array with history */
    const messages = OWLIX_MEMORY
      .filter(m => m.content)
      .map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: apiContent });

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        stream: true,
        system: OWLIX_SYSTEM,
        messages
      })
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      if (res.status === 401) {
        sessionStorage.removeItem('owlix_api_key');
        if (bubble) bubble.innerHTML = mdToHtml(`⚠️ **Invalid API key.** Please re-enter via ⚙️.`);
        return;
      }
      if (bubble) bubble.innerHTML = mdToHtml(`❌ **Error ${res.status}.** ${res.status === 529 ? 'Claude is overloaded — try again in a moment.' : 'Please try again.'}`);
      return;
    }

    const reader = res.body.getReader();
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
        if (!json || json === '[DONE]') continue;
        try {
          const evt = JSON.parse(json);
          if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
            fullText += evt.delta.text;
            if (bubble) {
              bubble.innerHTML = mdToHtml(fullText) + '<span class="owlix-cursor"></span>';
              msgs.scrollTop = msgs.scrollHeight;
            }
          }
        } catch { /* skip malformed */ }
      }
    }

    if (bubble) { bubble.innerHTML = mdToHtml(fullText); msgs.scrollTop = msgs.scrollHeight; }
    memoryPush('assistant', fullText);

  } catch (err) {
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

  /* Show user message bubble */
  let userHtml = '';
  if (image) {
    userHtml += `<img src="${image.previewUrl}" style="max-width:200px;max-height:200px;border-radius:8px;display:block;margin-bottom:0.35rem;object-fit:cover;border:1px solid rgba(255,255,255,0.2)">`;
  }
  if (cleanText) userHtml += escOwlix(cleanText);
  addOwlixMsg('user', userHtml);

  /* Quick math (text only, no image) */
  if (!image && cleanText) {
    const math = tryMath(cleanText);
    if (math) {
      addOwlixMsg('bot', mdToHtml(math));
      memoryPush('user', cleanText);
      memoryPush('assistant', math);
      return;
    }
  }

  /* Build API content */
  const apiContent = [];
  if (image) {
    apiContent.push({ type: 'image', source: { type: 'base64', media_type: image.mediaType, data: image.base64 } });
  }
  const msgText = cleanText || 'Please analyze this image and help me with it.';
  apiContent.push({ type: 'text', text: msgText });

  /* Save to memory (text only — images too large for history) */
  memoryPush('user', image ? `[uploaded image] ${cleanText}`.trim() : cleanText);

  await streamOwlixAI(apiContent);
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

/* ══ SETTINGS PANEL ══ */
function toggleApiKeyPanel(win) {
  let panel = win.querySelector('.owlix-api-panel');
  if (panel) { panel.remove(); return; }
  panel = document.createElement('div');
  panel.className = 'owlix-api-panel';
  const cur = sessionStorage.getItem('owlix_api_key') || '';
  panel.innerHTML = `
    <div style="background:rgba(91,33,182,0.07);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:1rem;margin:0.5rem 0.75rem;font-size:0.82rem">
      <div style="font-weight:700;margin-bottom:0.4rem;color:#5B21B6;font-size:0.88rem">⚙️ Connect Claude AI</div>
      <div style="color:#6B7280;margin-bottom:0.7rem;line-height:1.5;font-size:0.78rem">Enter your Anthropic API key to unlock full AI — answer any question, analyze images & photos.</div>
      <input type="password" id="owlixApiKeyInput" placeholder="sk-ant-api03-..." value="${cur}"
        style="width:100%;padding:0.5rem 0.7rem;border:1px solid rgba(124,58,237,0.3);border-radius:8px;font-size:0.8rem;outline:none;font-family:inherit;margin-bottom:0.5rem;box-sizing:border-box;background:#fff">
      <div style="display:flex;gap:0.5rem">
        <button onclick="saveOwlixKey()" style="flex:1;background:linear-gradient(135deg,#7C3AED,#5B21B6);color:white;border:none;padding:0.45rem;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:700">✅ Connect</button>
        <button onclick="clearOwlixKey()" style="background:none;border:1px solid #D1D5DB;color:#6B7280;padding:0.45rem 0.7rem;border-radius:8px;cursor:pointer;font-size:0.78rem">Clear</button>
      </div>
      <div style="color:#9CA3AF;font-size:0.7rem;margin-top:0.5rem">Stored in session only (not saved to server). <a href="https://console.anthropic.com" target="_blank" style="color:#7C3AED;font-weight:600">Get free API key →</a></div>
    </div>`;
  const qr = win.querySelector('.owlix-qr');
  if (qr) qr.before(panel); else win.querySelector('.owlix-messages')?.after(panel);
}

function saveOwlixKey() {
  const inp = document.getElementById('owlixApiKeyInput');
  if (!inp) return;
  const key = inp.value.trim();
  if (!key.startsWith('sk-')) { inp.style.borderColor = '#EF4444'; inp.focus(); return; }
  sessionStorage.setItem('owlix_api_key', key);
  document.querySelector('.owlix-api-panel')?.remove();
  addOwlixMsg('bot', mdToHtml(`✅ **Claude AI connected!**\n\nI can now:\n- Answer **any question** with real-time streaming\n- **Analyze photos** — just click 📷 to upload\n- Photograph your **textbook or homework** to get it solved\n\nWhat would you like to know? 🦉`));
}

function clearOwlixKey() {
  sessionStorage.removeItem('owlix_api_key');
  document.querySelector('.owlix-api-panel')?.remove();
  addOwlixMsg('bot', mdToHtml(`🔑 API key cleared. Click **⚙️** to reconnect.`));
}

/* ══ INJECT STYLES ══ */
function injectOwlixStyles() {
  if (document.getElementById('owlix-v6-styles')) return;
  const s = document.createElement('style');
  s.id = 'owlix-v6-styles';
  s.textContent = `
    .owlix-cursor {
      display:inline-block;width:2px;height:1.1em;
      background:#7C3AED;margin-left:2px;vertical-align:text-bottom;
      border-radius:1px;animation:owlix-blink 0.6s ease-in-out infinite;
    }
    @keyframes owlix-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .owlix-code {
      background:rgba(124,58,237,0.1);padding:1px 5px;border-radius:4px;
      font-family:'Courier New',monospace;font-size:0.85em;color:#5B21B6;
    }
    .owlix-img-btn {
      background:none;border:none;cursor:pointer;font-size:1.3rem;
      padding:0 0.3rem;opacity:0.65;transition:opacity 0.15s;flex-shrink:0;
      display:flex;align-items:center;
    }
    .owlix-img-btn:hover { opacity:1; }
    #owlix-img-preview { padding:0.4rem 0.6rem 0; }
    .owlix-input-row { display:flex;align-items:center;gap:0.15rem; }
    .msg-bbl img { max-width:100%;border-radius:8px;display:block;margin-bottom:0.3rem; }
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

  /* Update input placeholder */
  if (input) input.placeholder = 'Ask anything or describe your photo...';

  /* Inject image upload button + hidden file input + preview area */
  const inputRow = win.querySelector('.owlix-input-row');
  if (inputRow && !inputRow.querySelector('.owlix-img-btn')) {
    /* Hidden file input — accepts images from gallery AND camera */
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.id = 'owlixFileInput';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', handleImageSelect);

    /* Camera / image button */
    const imgBtn = document.createElement('button');
    imgBtn.className = 'owlix-img-btn';
    imgBtn.type = 'button';
    imgBtn.title = 'Upload photo or use camera';
    imgBtn.innerHTML = '📷';
    imgBtn.addEventListener('click', () => document.getElementById('owlixFileInput').click());

    /* Image preview div — inserted above input row */
    const previewDiv = document.createElement('div');
    previewDiv.id = 'owlix-img-preview';
    previewDiv.style.display = 'none';

    inputRow.before(previewDiv);
    inputRow.prepend(fileInput);
    inputRow.prepend(imgBtn);
  }

  /* Quick replies */
  if (qrWrap) {
    const prompts = ['Solve from photo 📷', 'Quadratic formula', "Explain Ohm's Law", 'Dandi March facts', 'Board exam tips'];
    qrWrap.innerHTML = prompts.map((r, i) =>
      i === 0
        ? `<button class="qr-btn" onclick="document.getElementById('owlixFileInput').click()" style="background:linear-gradient(135deg,#7C3AED22,#5B21B622);border-color:rgba(124,58,237,0.35)">${r}</button>`
        : `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(r)})">${r}</button>`
    ).join('');
  }

  /* Settings gear */
  const header = win.querySelector('.owlix-header');
  if (header && !header.querySelector('.owlix-settings-btn')) {
    const btn = document.createElement('button');
    btn.className = 'owlix-settings-btn';
    btn.title = 'Connect Claude AI';
    btn.innerHTML = '⚙️';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:1rem;padding:0.3rem;border-radius:6px;margin-right:0.25rem;opacity:0.7;transition:opacity 0.2s';
    btn.onmouseenter = () => btn.style.opacity = '1';
    btn.onmouseleave = () => btn.style.opacity = '0.7';
    btn.onclick = () => toggleApiKeyPanel(win);
    const closeBtn = header.querySelector('.owlix-close');
    if (closeBtn) header.insertBefore(btn, closeBtn);
  }

  /* Welcome message */
  const hasKey = !!sessionStorage.getItem('owlix_api_key');
  setTimeout(() => {
    addOwlixMsg('bot', mdToHtml(hasKey
      ? `👋 **Hi! I'm Owlix** — your AI assistant, powered by Claude!\n\n✅ **Claude AI connected** — I can answer anything and analyze photos!\n\nClick **📷** to upload a photo of your textbook, homework, or any problem — I'll solve it for you. 🦉`
      : `👋 **Hi! I'm Owlix** — your AI assistant!\n\nI'm powered by Claude AI (just like ChatGPT but better for studying).\n\n⚙️ Click the **settings button** above to connect your API key and unlock:\n- Answers to **any question**\n- **Photo analysis** — photograph your notes or problems\n- Real-time **streaming responses**\n\n[Get your free Anthropic API key →](https://console.anthropic.com)`));
  }, 500);

  /* Events */
  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    const badge = toggle.querySelector('.owlix-badge');
    if (badge && win.classList.contains('open')) badge.style.display = 'none';
  });
  if (close) close.addEventListener('click', () => win.classList.remove('open'));
  if (send)  send.addEventListener('click', submitOwlix);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) submitOwlix(); });

  /* Paste image support (Ctrl+V) */
  document.addEventListener('paste', e => {
    if (!win.classList.contains('open')) return;
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = ev => {
            const dataUrl = ev.target.result;
            PENDING_IMAGE = { base64: dataUrl.split(',')[1], mediaType: file.type, previewUrl: dataUrl, name: 'pasted-image' };
            renderImagePreview();
          };
          reader.readAsDataURL(file);
        }
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
