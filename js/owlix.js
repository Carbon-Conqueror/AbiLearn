/* Owlix AI — AbiLearn v5
   Streaming · Claude-First · Markdown · Conversation Memory · 200+ Topics */

'use strict';

/* ══ CONVERSATION MEMORY ══ */
const OWLIX_MEMORY = [];
const MAX_MEMORY = 20;

function memoryPush(role, text) {
  OWLIX_MEMORY.push({ role, content: text });
  if (OWLIX_MEMORY.length > MAX_MEMORY) OWLIX_MEMORY.shift();
}

/* ══ SYSTEM PROMPT ══ */
const OWLIX_SYSTEM = `You are Owlix, an AI study assistant on AbiLearn — a CBSE Class 10 educational platform for students in India.
Answer ANY question asked — CBSE academics, general knowledge, science, maths, history, coding, current events, and absolutely anything.

FORMATTING:
- Use **bold** for key terms, formulas, and important facts
- Use numbered lists (1. 2. 3.) for steps
- Use bullet lists (- item) for unordered info
- Use ## for section headers when organizing long answers
- Use \`inline code\` for formulas, equations, and code
- Keep responses clear and student-friendly (150-300 words usually)
- For CBSE topics: mention board exam relevance and tips
- For maths/science: formula first, then a worked example
- End with a memory trick or encouragement when helpful
- Be warm, conversational, and friendly — like a great tutor

You have full conversation history. Use it for contextual follow-up answers.`;

/* ══ MARKDOWN → HTML CONVERTER ══ */
function mdToHtml(text) {
  return text
    .replace(/^### (.+)$/gm, '<strong style="color:#5B21B6;font-size:0.95rem">$1</strong>')
    .replace(/^## (.+)$/gm, '<strong style="color:#5B21B6">$1</strong>')
    .replace(/^# (.+)$/gm, '<strong style="color:#5B21B6;font-size:1.05rem">$1</strong>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`\n]+)`/g, '<code class="owlix-code">$1</code>')
    .replace(/^[-*] (.+)$/gm, '• $1')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

/* ══ MATH SOLVER ══ */
function tryMath(msg) {
  const clean = msg.trim()
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '**2').replace(/³/g, '**3')
    .replace(/\^/g, '**');
  if (/^[\d\s\+\-\*\/\.\(\)\%\*]+$/.test(clean)) {
    try {
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + clean + ')')();
      if (typeof result === 'number' && isFinite(result)) {
        return `**Calculator** 🔢\n\n\`${escOwlix(msg.trim())} = ${+result.toFixed(8)}\`\n\nNeed help with algebra or formulas? Just ask!`;
      }
    } catch { /* not a valid expression */ }
  }
  return null;
}

/* ══ STREAMING CLAUDE API ══ */
async function streamOwlixAI(message) {
  const key = sessionStorage.getItem('owlix_api_key') || '';
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return false;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg bot';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const bubbleId = 'owlix-stream-' + Date.now();
  msgDiv.innerHTML = `<div class="msg-av">🦉</div><div><div class="msg-bbl" id="${bubbleId}"><span class="owlix-cursor"></span></div><div class="msg-time">${now}</div></div>`;
  msgs.appendChild(msgDiv);
  msgs.scrollTop = msgs.scrollHeight;

  const bubble = document.getElementById(bubbleId);

  try {
    const messages = OWLIX_MEMORY.map(m => ({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: message });

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
        max_tokens: 1024,
        stream: true,
        system: OWLIX_SYSTEM,
        messages
      })
    });

    if (!res.ok) {
      if (res.status === 401) {
        sessionStorage.removeItem('owlix_api_key');
        if (bubble) bubble.innerHTML = `⚠️ <strong>Invalid API key.</strong> Please re-enter via ⚙️.`;
        return false;
      }
      if (bubble) bubble.innerHTML = `❌ <strong>Error ${res.status}.</strong> Please try again.`;
      return false;
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

    if (bubble) {
      bubble.innerHTML = mdToHtml(fullText);
      msgs.scrollTop = msgs.scrollHeight;
    }
    memoryPush('assistant', fullText);
    return true;

  } catch {
    if (bubble) bubble.innerHTML = `❌ <strong>Connection error.</strong> Check your internet and try again.`;
    return false;
  }
}

/* ══ KNOWLEDGE BASE (fallback when no API key) ══ */
const OWLIX_KB = [
  { keys:['quadratic','sridharacharya','quadratic formula','discriminant'],
    response:`**Quadratic Formula** 📐\n\n**ax² + bx + c = 0** → x = [−b ± √(b² − 4ac)] / 2a\n\n**Discriminant D = b² − 4ac:**\n- D > 0 → 2 distinct real roots\n- D = 0 → 2 equal roots\n- D < 0 → no real roots\n\n**Example:** x² − 5x + 6 = 0 → D = 25−24 = 1 → **x = 3 or x = 2** ✅` },

  { keys:['pythagoras','right triangle','hypotenuse'],
    response:`**Pythagoras Theorem** 📐\n\n**H² = B² + P²**\n\n- Hypotenuse = longest side (opposite 90°)\n- Common triplets: 3-4-5, 5-12-13, 8-15-17\n\n**Example:** B=3, P=4 → H = √(9+16) = **5** ✅` },

  { keys:['trigonometry','sin','cos','tan','trig','sine','cosine'],
    response:`**Trigonometry** 📐\n\n- sin θ = P/H | cos θ = B/H | tan θ = P/B\n- sin²θ + cos²θ = 1\n- 1 + tan²θ = sec²θ\n\n**Table:**\n- 0°: sin=0, cos=1, tan=0\n- 30°: sin=½, cos=√3/2, tan=1/√3\n- 45°: sin=1/√2, cos=1/√2, tan=1\n- 60°: sin=√3/2, cos=½, tan=√3\n- 90°: sin=1, cos=0, tan=∞` },

  { keys:['arithmetic progression','ap','nth term of ap','sum of ap'],
    response:`**Arithmetic Progression (AP)** 📐\n\n- **nth term:** aₙ = a + (n−1)d\n- **Sum:** Sₙ = n/2[2a + (n−1)d]\n- **Common difference:** d = a₂ − a₁\n\n**Example:** 2, 5, 8, 11... → a=2, d=3\n- 10th term = 2 + 9×3 = **29**\n- S₁₀ = 5×(4+27) = **155** ✅` },

  { keys:['probability','chance','sample space','favourable outcomes'],
    response:`**Probability** 🎲\n\n**P(E) = Favourable outcomes / Total outcomes**\n\n- 0 ≤ P(E) ≤ 1 always\n- P(E) + P(Ē) = 1\n\n**Examples:**\n- Die → P(even) = 3/6 = **1/2**\n- Cards → P(ace) = 4/52 = **1/13**\n- 2 coins → P(both heads) = **1/4**` },

  { keys:["ohm's law",'ohm','resistance','current','voltage','electric circuit'],
    response:`**Electricity** ⚡\n\n**V = IR** (Ohm's Law)\n\n- R = ρL/A | P = VI = I²R = V²/R\n- **Series:** R_total = R₁+R₂+R₃ (same current)\n- **Parallel:** 1/R = 1/R₁+1/R₂+1/R₃ (same voltage)\n- Joule's heating: H = I²Rt\n- 1 kWh = 3.6×10⁶ J\n\n**Example:** V=10V, R=5Ω → I = 2A ✅` },

  { keys:['mirror','lens','reflection','refraction','focal length','concave','convex'],
    response:`**Light — Mirrors & Lenses** 🔭\n\n- **Mirror formula:** 1/v + 1/u = 1/f\n- **Lens formula:** 1/v − 1/u = 1/f\n- **Magnification (mirror):** m = −v/u\n- **Power of lens:** P = 1/f (metres) in Dioptres (D)\n\nConcave mirror/lens → converging\nConvex mirror → always virtual, erect → rear-view mirrors` },

  { keys:['photosynthesis','chlorophyll','glucose','stomata'],
    response:`**Photosynthesis** 🌱\n\n**6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂** (Sunlight + Chlorophyll)\n\n- Site: **Chloroplasts**\n- Inputs: CO₂ (stomata) + H₂O (roots) + light\n- Outputs: Glucose (food) + O₂ (released)\n\n**Factors affecting rate:** Light intensity, CO₂ concentration, Temperature` },

  { keys:['acid','base','ph','indicator','neutralisation','salt','litmus'],
    response:`**Acids, Bases & Salts** 🧪\n\n- Acid: pH < 7, Blue litmus → Red, releases H⁺\n- Base: pH > 7, Red litmus → Blue, releases OH⁻\n- Neutral: pH = 7\n\n**Important salts:**\n- Baking soda: NaHCO₃\n- Washing soda: Na₂CO₃\n- Common salt: NaCl\n- POP: CaSO₄·½H₂O` },

  { keys:['heredity','mendel','genetics','dominant','recessive','dna','chromosome'],
    response:`**Heredity & Genetics** 🧬\n\n**Mendel's Laws:**\n- Law of Segregation\n- Law of Independent Assortment\n\n**Monohybrid cross (Tt×Tt):** 3:1 ratio\n**Dihybrid cross:** 9:3:3:1 ratio\n\n- Dominant = expressed with 1 copy (T)\n- Recessive = only expressed as (tt)\n- Plant used: **Garden pea (Pisum sativum)**` },

  { keys:['dandi','salt march','civil disobedience','gandhi','1930'],
    response:`**Civil Disobedience / Dandi March** 🇮🇳\n\n- **Date:** 12 March – 6 April 1930\n- **Route:** Sabarmati Ashram → Dandi (~380 km)\n- **Purpose:** Protest British salt tax\n- Started with 78 volunteers\n\n**Timeline:**\n- 1920: Non-Cooperation Movement\n- 1930: Civil Disobedience (Dandi March)\n- 1942: Quit India — "Do or Die"\n- 1947: Independence (15 August)` },

  { keys:['nationalism europe','french revolution','napoleon','zollverein','bismarck','garibaldi'],
    response:`**Nationalism in Europe** 🏛️\n\n1. French Revolution (1789) — liberty, equality, fraternity\n2. Napoleon — spread revolutionary ideas\n3. Romanticism — folk culture for national identity\n4. Zollverein (1834) — German customs union\n5. 1848 — Spring of Nations (revolutions across Europe)\n6. Germany unified (1866–71) — Bismarck "Blood and Iron"\n7. Italy — Mazzini + Garibaldi + Cavour\n\n*"When France sneezes, Europe catches cold" — Metternich*` },

  { keys:['soil','alluvial','black soil','laterite','red soil'],
    response:`**Soil Types in India** 🌱\n\n1. **Alluvial:** Most fertile, Indo-Gangetic plains → rice/wheat\n2. **Black (Regur):** Deccan, retains moisture → **COTTON**\n3. **Red & Yellow:** Odisha, TN, Andhra\n4. **Laterite:** Kerala, Karnataka → tea, coffee\n5. **Arid:** Rajasthan — sandy, low humus\n\nMemory tip: **ABRLAF**` },

  { keys:['gdp','per capita','hdi','development','undp'],
    response:`**Development & Economy** 💰\n\n- **Per capita income = National income / Population**\n- **GDP:** Total value of goods & services in one year\n- **HDI:** Per capita income + Life expectancy + Education (published by UNDP)\n\n**LPG Reforms (1991):**\n- **L**iberalisation + **P**rivatisation + **G**lobalisation\n- PM: Narasimha Rao | Finance Minister: Manmohan Singh\n\nKey insight: Kerala has lower income than Punjab but higher HDI!` },

  { keys:['letter to god','lencho','g.l. fuentes','hailstorm','pesos'],
    response:`**A Letter to God** 📖\n\n- **Author:** G.L. Fuentes (Mexican)\n- Lencho — farmer, crops destroyed by hailstorm\n- Writes to God asking for **100 pesos**\n- Post office staff collect **70 pesos** and send\n- Lencho calls helpers "crooks" — dramatic irony!\n\n**Themes:** Unshakeable faith | Irony | Ingratitude\n\n**Board Q:** Why did Lencho call helpers crooks?\nBecause he believed God sent 100 but received only 70.` },

  { keys:['nelson mandela','apartheid','robben island','inauguration','south africa'],
    response:`**Nelson Mandela — Long Walk to Freedom** 📖\n\n- Inauguration as first Black President: **10 May 1994**\n- Imprisoned for **27 years** on Robben Island (1964–1990)\n- **Apartheid:** racial segregation system (1948–1994)\n\n**Key ideas:**\n- Both oppressor & oppressed lose humanity\n- Courage = overcoming fear, not its absence\n- "Greatest glory = rising every time we fall"` },

  { keys:['footprints without feet','griffin','invisible','h.g. wells','iping'],
    response:`**Footprints Without Feet — H.G. Wells** 📖\n\n- Griffin — brilliant but *lawless* scientist\n- Discovers how to make body **invisible**\n- Burns landlord's house → homeless wanderer\n- Hides at Mrs. Hall's inn in Iping village\n- Eventually exposed → runs away invisible\n\n**Theme:** Science without ethics is dangerous.\nPower without responsibility → misuse & destruction` },

  { keys:['planets','solar system','jupiter','saturn','mercury'],
    response:`**Solar System** 🪐\n\n**My Very Educated Mother Just Served Us Noodles**\nMercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune\n\n- Largest: **Jupiter** | Smallest: **Mercury**\n- Hottest: **Venus** (greenhouse effect)\n- Farthest: **Neptune**\n- Light from Sun to Earth: **8 min 20 sec**` },

  { keys:['what is ai','artificial intelligence','machine learning','chatgpt','neural network'],
    response:`**Artificial Intelligence** 🤖\n\nAI = machines that simulate human intelligence\n\n**Types:**\n- **Narrow AI:** specific tasks (Siri, ChatGPT, chess engines)\n- **General AI:** human-level reasoning (not yet achieved)\n\n**Machine Learning:** AI learns from data without explicit programming\n**Deep Learning:** neural networks with many layers\n\n**Me:** I'm Owlix, powered by Claude (Anthropic's AI) 🦉` },

  { keys:['hello','hi','hey','hii','namaste','good morning','good evening'],
    response:`👋 **Hi! I'm Owlix** — your AI study assistant!\n\nI can answer **any question** you have:\n\n- 📐 **Maths** — formulas, problems, step-by-step solutions\n- 🔬 **Science** — Physics, Chemistry, Biology\n- 📖 **English** — stories, grammar, writing\n- 🌍 **Social** — History, Geography, Civics, Economics\n- 💡 **Anything** — GK, AI, coding, current events, and more\n\nJust ask — I'll explain it clearly! 🦉` },

  { keys:['who are you','what are you','owlix','about you'],
    response:`🦉 **I'm Owlix** — AbiLearn's AI Study Assistant!\n\n**Powered by Claude AI (Anthropic)**\n\n- I remember our full conversation for context-aware replies\n- I can answer *any* question — not just CBSE topics\n- Streaming responses that appear in real-time\n- Math solver built-in\n- Connect your API key via ⚙️ for unlimited answers\n\nAsk me anything — I'm here 24/7! 💪` },

  { keys:['thank','thanks','thank you','thx','ty','great','awesome','helpful'],
    response:`😊 You're welcome! Happy to help!\n\nIf you have more doubts, just ask — I'm always here.\n\n**Tip for your next question:** Be specific! Instead of "explain science", try "explain how mirrors form images" — I can give much better answers that way.\n\nGood luck with your studies! 🎓💪` },

  { keys:['board exam','exam tips','score 90','how to score','cbse tips'],
    response:`**CBSE Board Exam Strategy** 🎯\n\n**Subject-wise:**\n- **Maths:** 10 numericals/day | show all steps\n- **Science:** draw neat diagrams with labels\n- **English:** read passage twice before answering\n- **Social:** timeline charts for history; maps for geography\n\n**General tips:**\n- NCERT first — 80% questions are directly from it\n- Solve 5 years' PYQs under timed conditions\n- Sleep 8 hrs the night before\n- Don't cram on exam day — trust your prep!` }
];

/* ══ SMART KB MATCHER ══ */
function owlixThinkSmart(message) {
  const msg = message.toLowerCase().replace(/[?!.,]/g, ' ');
  const words = msg.split(/\s+/).filter(w => w.length > 2);
  let bestScore = 0, bestEntry = null;

  for (const entry of OWLIX_KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (msg.includes(key)) score += key.split(' ').length * 2;
    }
    for (const word of words) {
      for (const key of entry.keys) {
        if (key.includes(word) || word.includes(key)) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; bestEntry = entry; }
  }
  return bestScore >= 2 ? bestEntry.response : null;
}

function escOwlix(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ══ QUICK REPLIES ══ */
const QR = ["What is Ohm's Law?", "Photosynthesis equation", "Dandi March facts", "Quadratic formula", "Board exam tips"];

/* ══ MAIN SEND FUNCTION ══ */
async function sendOwlixMessage(text) {
  const win = document.getElementById('owlixWindow');
  if (win && !win.classList.contains('open')) win.classList.add('open');

  addOwlixMsg('user', escOwlix(text));
  memoryPush('user', text);

  /* 1. Math solver — always instant */
  const mathResult = tryMath(text);
  if (mathResult) {
    showTyping();
    await delay(300);
    hideTyping();
    addOwlixMsg('bot', mdToHtml(mathResult));
    memoryPush('assistant', mathResult);
    return;
  }

  const hasKey = !!sessionStorage.getItem('owlix_api_key');

  /* 2. Claude API — PRIMARY when key exists (streaming) */
  if (hasKey) {
    const ok = await streamOwlixAI(text);
    if (ok) return;
    /* fell through = stream error, show fallback below */
  }

  /* 3. Local KB — fallback when no key */
  const localResponse = owlixThinkSmart(text);
  if (localResponse) {
    showTyping();
    await delay(400 + Math.random() * 300);
    hideTyping();
    addOwlixMsg('bot', mdToHtml(localResponse));
    memoryPush('assistant', localResponse);
    return;
  }

  /* 4. Smart fallback */
  const fallback = `🤔 I don't have a built-in answer for that one.\n\n💡 **Connect Claude AI** via the ⚙️ button above to get answers to **any** question — just like ChatGPT!\n\n**Topics I know offline:**\n- 📐 Quadratic formula, AP, Pythagoras, Trigonometry\n- 🔬 Ohm's Law, Mirrors, Photosynthesis, Mendel\n- 🌍 Dandi March, French Revolution, Soil Types, GDP\n- 📖 Letter to God, Mandela, Footprints, Anne Frank`;

  showTyping();
  await delay(400);
  hideTyping();
  addOwlixMsg('bot', mdToHtml(fallback));
  memoryPush('assistant', fallback);
}

/* ══ UI HELPERS ══ */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function addOwlixMsg(type, html) {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `
    <div class="msg-av">${type === 'bot' ? '🦉' : '👤'}</div>
    <div>
      <div class="msg-bbl">${html}</div>
      <div class="msg-time">${now}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs || document.getElementById('owlix-typing')) return;
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'owlix-typing';
  div.innerHTML = `<div class="msg-av">🦉</div><div class="typing-bbl"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() { document.getElementById('owlix-typing')?.remove(); }

/* ══ SETTINGS PANEL ══ */
function toggleApiKeyPanel(win) {
  let panel = win.querySelector('.owlix-api-panel');
  if (panel) { panel.remove(); return; }
  panel = document.createElement('div');
  panel.className = 'owlix-api-panel';
  const cur = sessionStorage.getItem('owlix_api_key') || '';
  panel.innerHTML = `
    <div style="background:rgba(91,33,182,0.07);border:1px solid rgba(124,58,237,0.18);border-radius:12px;padding:1rem;margin:0.5rem 0.75rem;font-size:0.82rem">
      <div style="font-weight:700;margin-bottom:0.5rem;color:#5B21B6">⚙️ Claude AI Connection</div>
      <div style="color:#6B7280;margin-bottom:0.6rem;line-height:1.5">Connect your Anthropic API key for <strong>unlimited AI answers</strong> — just like ChatGPT!</div>
      <input type="password" id="owlixApiKeyInput" placeholder="sk-ant-..." value="${cur}"
        style="width:100%;padding:0.45rem 0.7rem;border:1px solid #D1D5DB;border-radius:8px;font-size:0.8rem;outline:none;font-family:inherit;margin-bottom:0.5rem;box-sizing:border-box">
      <div style="display:flex;gap:0.5rem">
        <button onclick="saveOwlixKey()" style="flex:1;background:#7C3AED;color:white;border:none;padding:0.4rem;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:600">✅ Save & Connect</button>
        <button onclick="clearOwlixKey()" style="background:none;border:1px solid #D1D5DB;color:#6B7280;padding:0.4rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.8rem">Clear</button>
      </div>
      <div style="color:#9CA3AF;font-size:0.72rem;margin-top:0.5rem">Stored in session only (not saved permanently). <a href="https://console.anthropic.com" target="_blank" style="color:#7C3AED">Get a free API key →</a></div>
    </div>`;
  const msgs = win.querySelector('.owlix-messages');
  if (msgs) msgs.after(panel);
}

function saveOwlixKey() {
  const inp = document.getElementById('owlixApiKeyInput');
  if (!inp) return;
  const key = inp.value.trim();
  if (key) {
    sessionStorage.setItem('owlix_api_key', key);
    addOwlixMsg('bot', mdToHtml(`✅ **Claude AI connected!** I can now answer **any question** with full AI intelligence — with real-time streaming responses!\n\nAsk me anything! 🦉`));
  }
  document.querySelector('.owlix-api-panel')?.remove();
}

function clearOwlixKey() {
  sessionStorage.removeItem('owlix_api_key');
  document.querySelector('.owlix-api-panel')?.remove();
  addOwlixMsg('bot', mdToHtml(`🔑 API key cleared. Using offline knowledge base.\n\nReconnect via ⚙️ for unlimited answers.`));
}

/* ══ INIT ══ */
function injectOwlixStyles() {
  if (document.getElementById('owlix-v5-styles')) return;
  const s = document.createElement('style');
  s.id = 'owlix-v5-styles';
  s.textContent = `
    .owlix-cursor {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      background: #7C3AED;
      margin-left: 1px;
      vertical-align: text-bottom;
      border-radius: 1px;
      animation: owlix-blink 0.6s ease-in-out infinite;
    }
    @keyframes owlix-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .owlix-code {
      background: rgba(124,58,237,0.1);
      padding: 1px 5px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      color: #5B21B6;
    }
    .msg-bbl strong { color: inherit; }
    .msg-bbl code { font-family: 'Courier New', monospace; font-size: 0.85em; }
  `;
  document.head.appendChild(s);
}

function initOwlix() {
  const toggle = document.getElementById('owlixToggle');
  const win    = document.getElementById('owlixWindow');
  const close  = document.getElementById('owlixClose');
  const input  = document.getElementById('owlixInput');
  const send   = document.getElementById('owlixSend');
  const qrWrap = document.getElementById('quickReplies');
  if (!toggle || !win) return;

  injectOwlixStyles();

  if (qrWrap) {
    qrWrap.innerHTML = QR.map(r =>
      `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(r)})">${r}</button>`
    ).join('');
  }

  /* Settings gear button */
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

  const hasKey = !!sessionStorage.getItem('owlix_api_key');
  setTimeout(() => {
    addOwlixMsg('bot', mdToHtml(`👋 **Hi! I'm Owlix** — your AI study assistant!\n\n${hasKey
      ? '✅ **Claude AI connected** — streaming answers to any question!'
      : '💡 Click **⚙️** above to connect Claude AI for unlimited answers.'}\n\nWhat would you like to know? 🎯`));
  }, 500);

  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    const badge = toggle.querySelector('.owlix-badge');
    if (badge && win.classList.contains('open')) badge.style.display = 'none';
  });
  if (close) close.addEventListener('click', () => win.classList.remove('open'));
  if (send)  send.addEventListener('click', submitOwlix);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') submitOwlix(); });
}

function submitOwlix() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendOwlixMessage(text);
}

document.addEventListener('DOMContentLoaded', initOwlix);
