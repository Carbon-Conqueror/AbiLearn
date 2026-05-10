/* Owlix AI - AbiLearn's Study Chatbot */

const OWLIX_KB = [
  /* ===== MATHS ===== */
  { keys: ['quadratic formula','sridharacharya'], response: '📐 Quadratic Formula (Sridharacharya):\nx = [−b ± √(b²−4ac)] / 2a\n\nWhere D = b²−4ac is the discriminant:\n• D > 0 → two distinct real roots\n• D = 0 → two equal real roots\n• D < 0 → no real roots' },
  { keys: ['pythagoras','pythagorean'], response: '📐 Pythagoras Theorem:\nIn a right-angled triangle:\nHypotenuse² = Base² + Perpendicular²\n\nAC² = AB² + BC²\n\nExample: If AB = 3, BC = 4, then AC = √(9+16) = 5 ✅' },
  { keys: ['trigonometry values','sin cos tan','trig table'], response: '📐 Trigonometric Values:\n\n| Angle | sin | cos | tan |\n|-------|-----|-----|-----|\n| 0° | 0 | 1 | 0 |\n| 30° | 1/2 | √3/2 | 1/√3 |\n| 45° | 1/√2 | 1/√2 | 1 |\n| 60° | √3/2 | 1/2 | √3 |\n| 90° | 1 | 0 | undefined |' },
  { keys: ['arithmetic progression','ap formula','sum of ap'], response: '📐 Arithmetic Progression:\n• nth term: aₙ = a + (n−1)d\n• Sum of n terms: Sₙ = n/2 [2a + (n−1)d]\n• If last term l known: Sₙ = n/2(a + l)\n\nWhere a = first term, d = common difference' },
  { keys: ['area of circle','circumference','sector area'], response: '📐 Circle Formulas:\n• Area = πr²\n• Circumference = 2πr\n• Area of sector = (θ/360°) × πr²\n• Arc length = (θ/360°) × 2πr\n• Area of segment = Area of sector − Area of triangle' },
  { keys: ['probability','favourable outcomes'], response: '🎲 Probability:\nP(E) = Favourable outcomes / Total outcomes\n\n• 0 ≤ P(E) ≤ 1 always\n• P(impossible event) = 0\n• P(certain event) = 1\n• P(E) + P(Ē) = 1 [Complementary]\n\nFor a fair die: P(even) = 3/6 = 1/2' },
  { keys: ['hcf','lcm','euclid'], response: "📐 HCF & LCM:\n• Euclid's Division: a = bq + r (0 ≤ r < b)\n• HCF × LCM = Product of two numbers\n• Fundamental Theorem of Arithmetic: every number = unique product of primes\n\nExample: HCF(12, 18) = 6, LCM = 36, 6×36 = 12×18 = 216 ✅" },
  { keys: ['distance formula','coordinate geometry'], response: '📐 Coordinate Geometry:\n• Distance: d = √[(x₂−x₁)² + (y₂−y₁)²]\n• Midpoint: ((x₁+x₂)/2, (y₁+y₂)/2)\n• Section formula (m:n): ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))\n• Area of triangle = ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|' },
  { keys: ['statistics','mean median mode','empirical'], response: '📊 Statistics:\n• Mean = Σfx / Σf\n• Median = L + [(n/2−cf)/f] × h\n• Mode = L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h\n• Empirical: Mode = 3 Median − 2 Mean\n• Ogive → used to find median graphically' },

  /* ===== SCIENCE - PHYSICS ===== */
  { keys: ['ohm\'s law','resistance','electric'], response: "⚡ Electricity Formulas:\n• Ohm's Law: V = IR\n• Current: I = Q/t\n• Resistance: R = ρL/A\n• Series: R_total = R₁+R₂+R₃\n• Parallel: 1/R = 1/R₁+1/R₂+1/R₃\n• Power: P = VI = I²R = V²/R\n• Energy: H = I²Rt (Joule's heating)" },
  { keys: ['mirror formula','lens formula','power of lens'], response: '🔭 Light Formulas:\n• Mirror formula: 1/v + 1/u = 1/f\n• Lens formula: 1/v − 1/u = 1/f\n• Magnification (mirror): m = −v/u\n• Power: P = 1/f(metres) in Dioptre (D)\n• Convex lens = positive power (+)\n• Concave lens = negative power (−)' },
  { keys: ['myopia','hypermetropia','eye defect'], response: '👁️ Eye Defects:\n• Myopia (short-sight): far objects blurred → Concave lens\n• Hypermetropia (long-sight): near objects blurred → Convex lens\n• Presbyopia: loss of accommodation (old age) → Bifocal lens\n\nNear point of normal eye = 25 cm' },
  { keys: ['refraction','snell'], response: "🌊 Refraction:\n• Bending of light when entering a new medium\n• Snell's Law: n₁ sin i = n₂ sin r\n• n = c/v (refractive index)\n• Light bends TOWARDS normal when going denser medium\n• Light bends AWAY from normal going rarer medium" },
  { keys: ['sky blue','scattering','tyndall'], response: '🌈 Scattering of Light:\n• Sky is BLUE because blue light (shorter wavelength) scatters MORE\n• Sun appears RED/ORANGE at sunrise/sunset because blue is scattered away — red reaches us\n• Tyndall Effect: scattering by colloidal particles (e.g., beam in smoky room)\n• VIBGYOR: order of spectrum (Violet to Red)' },

  /* ===== SCIENCE - CHEMISTRY ===== */
  { keys: ['photosynthesis'], response: '🌱 Photosynthesis:\n6CO₂ + 6H₂O + Sunlight (chlorophyll) → C₆H₁₂O₆ + 6O₂\n\n• Location: Chloroplasts (chlorophyll pigment)\n• Light reaction: in thylakoid | Dark reaction: in stroma\n• Raw materials: CO₂ + H₂O\n• Products: Glucose + Oxygen' },
  { keys: ['acid base','ph scale','neutralisation'], response: '🧪 Acids & Bases:\n• Acids: sour taste, pH < 7, turn blue litmus RED\n• Bases: bitter, pH > 7, turn red litmus BLUE\n• Neutral: pH = 7 (water)\n• Neutralisation: Acid + Base → Salt + Water\n• Example: HCl + NaOH → NaCl + H₂O' },
  { keys: ['reactivity series','metals','corrosion'], response: '⚗️ Reactivity Series (high → low):\nK > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au\n\n• Metals above H displace hydrogen from dilute acids\n• Sodium stored in kerosene (too reactive with air)\n• Corrosion = slow reaction of metal with environment' },
  { keys: ['carbon','organic','alkane alkene'], response: '⚗️ Carbon Compounds:\n• Alkanes: CₙH₂ₙ₊₂ (saturated) — single bonds\n• Alkenes: CₙH₂ₙ (unsaturated) — one double bond\n• Alkynes: CₙH₂ₙ₋₂ — one triple bond\n• Ethanol: C₂H₅OH | Ethanoic acid: CH₃COOH\n• Saponification: Fat + NaOH → Soap + Glycerol' },
  { keys: ['reaction types','decomposition','combination'], response: '⚗️ Types of Chemical Reactions:\n• Combination: A + B → AB\n• Decomposition: AB → A + B\n• Single Displacement: A + BC → AC + B\n• Double Displacement: AB + CD → AD + CB\n• Oxidation = loss of electrons / gain of O\n• Reduction = gain of electrons / loss of O\n• Redox = both happen simultaneously' },

  /* ===== SCIENCE - BIOLOGY ===== */
  { keys: ['respiration','aerobic anaerobic'], response: '🫁 Respiration:\n• Aerobic: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP\n• Anaerobic (yeast): Glucose → Ethanol + CO₂ + 2 ATP\n• Anaerobic (muscle): Glucose → Lactic acid + 2 ATP\n• Location: mitochondria (called "powerhouse of cell")' },
  { keys: ['nervous system','neuron','reflex'], response: '🧠 Nervous System:\n• Structural unit: Neuron (dendrites + cell body + axon)\n• Reflex arc: Stimulus → Receptor → Sensory nerve → Spinal cord → Motor nerve → Effector\n• Reflex = involuntary, fast response (spinal cord controlled)\n• Brain regions: Cerebrum (thinking), Cerebellum (balance), Medulla (breathing/heartbeat)' },
  { keys: ['heredity','mendel','genetics'], response: "🧬 Mendel's Genetics:\n• Law of Segregation: alleles separate during gamete formation\n• Monohybrid cross (Tt × Tt): phenotype 3:1, genotype 1:2:1\n• Dihybrid cross: 9:3:3:1 ratio\n• Dominant = expressed | Recessive = hidden (two copies needed)\n• Plant used: Garden pea (Pisum sativum)" },
  { keys: ['reproduction','budding','fission'], response: '🌿 Reproduction:\n• Asexual: single parent — binary fission (Amoeba), budding (Hydra), regeneration, spore formation, vegetative propagation\n• Sexual: requires male + female gametes\n• Fertilisation → Zygote → Embryo\n• Bryophyllum: vegetative propagation by leaves\n• Double fertilisation in flowering plants: unique to angiosperms' },
  { keys: ['10% law','food chain','ecosystem'], response: '🌍 Ecosystem & Environment:\n• Food chain: Producer → Herbivore → Carnivore → Top Carnivore\n• 10% Law (Lindemann): only 10% of energy passes to next trophic level\n• Biodegradable: decomposed by microbes (paper, food)\n• Non-biodegradable: plastics, glass, metals\n• Ozone depletion: CFCs react with O₃ → ozone hole → harmful UV rays reach Earth' },

  /* ===== HISTORY ===== */
  { keys: ['nationalism europe','french revolution'], response: "🏛️ Nationalism in Europe:\n• French Revolution (1789): liberty, equality, fraternity → spread nationalism\n• Napoleon spread ideas via conquests\n• Romanticism: emotion + folk culture to build national identity\n• 1830: Greece's independence\n• 1848: Spring of Nations — revolutions across Europe\n• Zollverein (1834): customs union of German states\n• Key figures: Napoleon, Metternich, Mazzini, Garibaldi, Bismarck" },
  { keys: ['nationalism india','gandhi','non cooperation'], response: "🇮🇳 Nationalism in India:\n• Rowlatt Act (1919): detention without trial → mass protests\n• Jallianwala Bagh (April 13, 1919): General Dyer's firing on crowd\n• Non-Cooperation Movement (1920): boycott British goods\n• Chauri Chaura (1922): Gandhi called off NCM\n• Dandi March (1930): 240 miles, 24 days — protest against salt tax\n• Poona Pact (1932): Gandhi + Ambedkar — reserved seats for Dalits\n• Quit India (1942): 'Do or Die'" },
  { keys: ['dandi march','salt march','civil disobedience'], response: '🧂 Dandi March (Civil Disobedience Movement):\n• Date: 12 March – 6 April 1930\n• Distance: ~380 km (240 miles)\n• Volunteers: started with 78 followers\n• Purpose: protest British salt tax by making salt from seawater\n• This launched the Civil Disobedience Movement across India' },

  /* ===== GEOGRAPHY ===== */
  { keys: ['soil types','alluvial','black soil'], response: '🌱 Soil Types in India:\n• Alluvial: most widespread, fertile, Indo-Gangetic plains — rice, wheat, sugarcane\n• Black (Regur): Deccan plateau, retains moisture — best for COTTON\n• Red & Yellow: Tamil Nadu, Andhra — porous, rice, wheat\n• Laterite: Karnataka, Kerala, Meghalaya — leached by rain — cashews, coffee\n• Arid: Rajasthan — sandy\n• Forest soil: Himalayan & hill regions' },
  { keys: ['green revolution','kharif rabi'], response: '🌾 Agriculture:\n• Kharif (Jun-Sep): Rice, Cotton, Jute, Maize, Bajra\n• Rabi (Oct-Mar): Wheat, Barley, Mustard, Peas\n• Zaid (Mar-Jun): Watermelon, Cucumber\n• Green Revolution (1960s): HYV seeds + fertilizers → more wheat & rice\n• India = largest producer of pulses; 2nd in rice & wheat' },

  /* ===== ECONOMICS ===== */
  { keys: ['gdp','per capita income','development'], response: '💰 Economic Development:\n• Per Capita Income = Total National Income ÷ Population\n• GDP = total value of goods & services produced in a year\n• HDI = Life Expectancy + Education + Per Capita Income\n• HDI published by: UNDP\n• World Bank: countries with per capita income > $49,300 = high income\n• LPG Reforms (1991): Liberalisation + Privatisation + Globalisation' },
  { keys: ['globalisation','mnc','wto'], response: '🌐 Globalisation:\n• Globalisation = integration through trade + investment\n• MNC = company with production in 2+ countries\n• WTO (est. 1995): promotes free/fair international trade\n• FDI = Foreign Direct Investment\n• India adopted LPG reforms in 1991 (PM Narasimha Rao)\n• Benefits: jobs in IT/services | Concerns: small industries face competition' },
  { keys: ['credit','formal informal','rbi'], response: '🏦 Money & Credit:\n• Double coincidence of wants: main problem in barter system\n• Formal credit: banks, cooperatives — regulated by RBI, lower interest\n• Informal credit: moneylenders, traders — higher interest, exploitative\n• Collateral: asset pledged as loan security\n• SHG: 15-20 women pool savings → give each other loans at low interest\n• Terms of credit: interest rate + collateral + documentation + repayment mode' },

  /* ===== ENGLISH ===== */
  { keys: ['lencho','letter to god'], response: "📖 A Letter to God:\n• Author: G.L. Fuentes (Mexican)\n• Lencho's crops destroyed by hail → writes to God for 100 pesos\n• Postmaster collects 70 pesos from staff, sends it\n• Lencho receives 70 pesos, calls helpers 'crooks' thinking they stole 30\n• Theme: Unshakeable faith, Irony, Ingratitude" },
  { keys: ['mandela','apartheid'], response: "📖 Nelson Mandela: Long Walk to Freedom:\n• Mandela = 1st black President of South Africa (10 May 1994)\n• Apartheid = racial segregation policy in South Africa\n• Imprisoned 27 years on Robben Island (1964–1990)\n• Quote: 'The greatest glory in living lies not in never falling, but in rising every time we fall'\n• ANC = African National Congress" },
  { keys: ['anne frank','diary'], response: "📖 From the Diary of Anne Frank:\n• Anne Frank = Jewish girl hiding from Nazis in Amsterdam\n• Diary name: 'Kitty' — she considered it her friend\n• Period: June 1942 – August 1944\n• Quote: 'Paper has more patience than people'\n• Anne died in Bergen-Belsen camp, 1945, age 15\n• Theme: Loneliness, Resilience, War's impact" },
  { keys: ['griffin','invisible','footprints without feet'], response: "📖 Footprints Without Feet:\n• Author: H.G. Wells\n• Griffin = scientist who becomes invisible by swallowing rare drugs\n• He burns landlord's house, steals, goes to Iping village\n• Bandaged to hide invisibility — Mrs Hall is suspicious\n• Theme: Science without ethics = danger | Power without responsibility" },
  { keys: ['necklace','matilda','maupassant'], response: "📖 The Necklace:\n• Author: Guy de Maupassant (French)\n• Matilda borrows a diamond necklace, loses it at party\n• Buys replacement for 36,000 francs (goes into huge debt)\n• Works 10 years in poverty to repay\n• Twist ending: original necklace was FAKE (worth only 500 francs!)\n• Theme: Pride, Vanity, Irony of Fate" },

  /* ===== CIVICS ===== */
  { keys: ['power sharing','belgium','sri lanka'], response: "⚖️ Power Sharing:\n• Belgium: Dutch 59% + French 40% → adopted federal power sharing (success)\n• Sri Lanka: Sinhala 74% vs Tamil → Sinhala Only Act (1956) → civil war (failure)\n• Majoritarianism = wrong approach to diversity\n• Types of power sharing:\n  1. Horizontal: among organs (legislature, executive, judiciary)\n  2. Vertical: between levels of government (federal, state, local)\n  3. Among social groups\n  4. Among political parties" },
  { keys: ['political party','democracy','election'], response: "🗳️ Political Parties:\n• Functions: contest elections, mobilize voters, form government, make laws\n• Challenges: dynastic succession, money/muscle power, criminalization\n• National parties: INC, BJP, BSP, CPI, CPM, NCP\n• India has multi-party system\n• NOTA = None of the Above (right to reject)\n• Anti-defection law: members can't vote against party\n• EC (Election Commission) = recognizes parties" },

  /* ===== GENERAL ===== */
  { keys: ['hi','hello','hey','hii'], response: "👋 Hello! I'm Owlix, your AbiLearn study buddy! I know everything about CBSE Class 10 — Maths, Science, English & Social Science.\n\nAsk me anything like:\n• 'What is Ohm's Law?'\n• 'Explain photosynthesis'\n• 'What happened in Dandi March?'\n• 'Who wrote The Necklace?'" },
  { keys: ['who are you','what are you','owlix'], response: "🦉 I'm Owlix — AbiLearn's AI Study Assistant!\n\nI'm here to help you with:\n📐 Maths formulas & problems\n🔬 Science concepts & reactions\n📖 English story summaries\n🌍 History, Geography, Civics & Economics\n\nJust ask me any Class 10 CBSE question!" },
  { keys: ['board exam','cbse exam','how to study','tips'], response: "📚 Board Exam Tips from Owlix:\n1. Master NCERT first — 80% of CBSE questions come from it\n2. Solve last 5 years' board papers\n3. Use the Pomodoro technique: 25 min study + 5 min break\n4. Make formula sheets for Maths & Physics\n5. Practice writing answers, not just reading\n6. Revise with spaced repetition\n7. Sleep well the night before the exam!\n\nYou've got this! 💪" },
  { keys: ['formula','formulas','important formulas'], response: "📐 Key Formulas by Subject:\n\nMATHS:\n• Quadratic: x = [−b ± √(b²−4ac)] / 2a\n• AP nth term: aₙ = a+(n−1)d\n• Pythagoras: AC² = AB² + BC²\n\nSCIENCE:\n• Ohm's Law: V = IR\n• Power: P = VI = I²R\n• Mirror: 1/v + 1/u = 1/f\n\nAsk me about any specific topic for more details!" }
];

/* ====== OWLIX ENGINE ====== */
function owlixRespond(message) {
  const msg = message.toLowerCase().trim();
  if (!msg) return null;

  for (const entry of OWLIX_KB) {
    if (entry.keys.some(k => msg.includes(k))) {
      return entry.response;
    }
  }

  // Fallback
  return `🤔 Great question! I'm still learning about "${message}".\n\nTry asking me about:\n• Specific topics like "Ohm's Law", "photosynthesis", "Dandi March"\n• Formulas like "quadratic formula", "distance formula"\n• Stories like "The Necklace" or "Footprints Without Feet"\n\nOwlix is constantly being updated with more knowledge! 🦉`;
}

/* ====== OWLIX UI ====== */
const QUICK_REPLIES = [
  'What is Ohm\'s Law?',
  'Explain photosynthesis',
  'Dandi March',
  'Quadratic formula',
  'Board exam tips'
];

function initOwlix() {
  const toggle = document.getElementById('owlixToggle');
  const window_ = document.getElementById('owlixWindow');
  const close = document.getElementById('owlixClose');
  const input = document.getElementById('owlixInput');
  const send = document.getElementById('owlixSend');
  const qr = document.getElementById('quickReplies');

  if (!toggle || !window_) return;

  // Quick replies
  if (qr) {
    qr.innerHTML = QUICK_REPLIES.map(r =>
      `<button class="quick-reply" onclick="sendOwlixMessage('${r.replace(/'/g, "\\'")}')">
        ${r}
      </button>`
    ).join('');
  }

  // Welcome message
  setTimeout(() => {
    addOwlixMessage('bot', "👋 Hi! I'm Owlix, your AI study buddy for CBSE Class 10!\n\nAsk me anything about Maths, Science, English or Social Science. I'm here to help you score big in your Board exams! 🎯");
  }, 600);

  // Toggle
  toggle.addEventListener('click', () => {
    window_.classList.toggle('open');
    if (window_.classList.contains('open') && toggle.querySelector('.owlix-badge')) {
      toggle.querySelector('.owlix-badge').style.display = 'none';
    }
  });

  // Close
  if (close) close.addEventListener('click', () => window_.classList.remove('open'));

  // Send
  if (send) send.addEventListener('click', () => submitOwlixInput());
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submitOwlixInput();
  });
}

function submitOwlixInput() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendOwlixMessage(text);
}

function sendOwlixMessage(text) {
  addOwlixMessage('user', text);
  showOwlixTyping();
  setTimeout(() => {
    hideOwlixTyping();
    const response = owlixRespond(text);
    addOwlixMessage('bot', response);
  }, 800 + Math.random() * 600);
}

let typingMsgId = null;
function showOwlixTyping() {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-message bot';
  div.id = 'owlix-typing';
  div.innerHTML = `
    <div class="msg-avatar">🦉</div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideOwlixTyping() {
  const el = document.getElementById('owlix-typing');
  if (el) el.remove();
}

function addOwlixMessage(type, text) {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `chat-message ${type}`;

  const avatar = type === 'bot' ? '🦉' : '👤';
  const safeText = text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');

  div.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${safeText}</div>
      <div class="message-time">${now}</div>
    </div>`;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', initOwlix);
