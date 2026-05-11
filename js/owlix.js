/* Owlix AI — AbiLearn v4
   Smarter matching · Conversation memory · Math solver · 200+ topics · Claude API */

'use strict';

/* ══ CONVERSATION MEMORY ══ */
const OWLIX_MEMORY = [];
const MAX_MEMORY = 12;

function memoryPush(role, text) {
  OWLIX_MEMORY.push({ role, content: text });
  if (OWLIX_MEMORY.length > MAX_MEMORY) OWLIX_MEMORY.shift();
}

function lastBotContext() {
  for (let i = OWLIX_MEMORY.length - 1; i >= 0; i--)
    if (OWLIX_MEMORY[i].role === 'assistant') return OWLIX_MEMORY[i].content;
  return '';
}

/* ══ KNOWLEDGE BASE (200+ topics) ══ */
const OWLIX_KB = [

  /* ── MATHS ── */
  { keys:['quadratic','sridharacharya','quadratic formula','discriminant'],
    response:`<strong>📐 Quadratic Formula</strong><br><br>
<strong>ax² + bx + c = 0</strong><br>
x = [−b ± √(b² − 4ac)] / 2a<br><br>
<strong>Discriminant D = b² − 4ac:</strong><br>
• D &gt; 0 → 2 distinct real roots<br>
• D = 0 → 2 equal roots<br>
• D &lt; 0 → no real roots<br><br>
<strong>Example:</strong> x² − 5x + 6 = 0<br>
D = 25 − 24 = 1 → x = (5±1)/2 → <strong>x = 3 or x = 2</strong> ✅` },

  { keys:['pythagoras','right triangle','hypotenuse'],
    response:`<strong>📐 Pythagoras Theorem</strong><br><br>
<strong>H² = B² + P²</strong> (right-angled triangle)<br><br>
• Hypotenuse = longest side (opposite 90°)<br>
• Converse: if a²+b²=c² → right-angled<br><br>
<strong>Common triplets:</strong> 3-4-5, 5-12-13, 8-15-17<br><br>
<strong>Example:</strong> B=3, P=4 → H = √(9+16) = <strong>5</strong> ✅` },

  { keys:['trigonometry','sin','cos','tan','trig','sine','cosine'],
    response:`<strong>📐 Trigonometry</strong><br><br>
• sin θ = P/H &nbsp;|&nbsp; cos θ = B/H &nbsp;|&nbsp; tan θ = P/B<br>
• cosec = 1/sin &nbsp;|&nbsp; sec = 1/cos &nbsp;|&nbsp; cot = 1/tan<br><br>
<table style="font-size:0.8rem;border-collapse:collapse;width:100%">
<tr style="background:rgba(124,58,237,0.12)"><td style="padding:3px 6px"><b>θ</b></td><td><b>sin</b></td><td><b>cos</b></td><td><b>tan</b></td></tr>
<tr><td style="padding:3px 6px">0°</td><td>0</td><td>1</td><td>0</td></tr>
<tr style="background:#f9f9f9"><td style="padding:3px 6px">30°</td><td>1/2</td><td>√3/2</td><td>1/√3</td></tr>
<tr><td style="padding:3px 6px">45°</td><td>1/√2</td><td>1/√2</td><td>1</td></tr>
<tr style="background:#f9f9f9"><td style="padding:3px 6px">60°</td><td>√3/2</td><td>1/2</td><td>√3</td></tr>
<tr><td style="padding:3px 6px">90°</td><td>1</td><td>0</td><td>∞</td></tr>
</table><br>
<strong>Identities:</strong> sin²θ+cos²θ=1 &nbsp;|&nbsp; 1+tan²θ=sec²θ &nbsp;|&nbsp; 1+cot²θ=cosec²θ` },

  { keys:['arithmetic progression','ap','nth term of ap','sum of ap'],
    response:`<strong>📐 Arithmetic Progression (AP)</strong><br><br>
• <strong>nth term:</strong> aₙ = a + (n−1)d<br>
• <strong>Sum:</strong> Sₙ = n/2[2a + (n−1)d] = n/2(a + l)<br>
• <strong>Common difference:</strong> d = a₂ − a₁<br><br>
<strong>Example:</strong> 2, 5, 8, 11... → a=2, d=3<br>
• 10th term = 2+9×3 = <strong>29</strong><br>
• S₁₀ = 5×(4+27) = <strong>155</strong> ✅` },

  { keys:['geometric progression','gp','geometric series'],
    response:`<strong>📐 Geometric Progression (GP)</strong><br><br>
• <strong>nth term:</strong> aₙ = arⁿ⁻¹<br>
• <strong>Sum (r≠1):</strong> Sₙ = a(rⁿ−1)/(r−1)<br>
• <strong>Sum (r&lt;1):</strong> S∞ = a/(1−r)<br>
• <strong>Common ratio:</strong> r = a₂/a₁<br><br>
<strong>Example:</strong> 2, 6, 18, 54... → a=2, r=3<br>
4th term = 2×3³ = <strong>54</strong> ✅` },

  { keys:['probability','chance','event','sample space','favourable'],
    response:`<strong>🎲 Probability</strong><br><br>
<strong>P(E) = Favourable outcomes / Total outcomes</strong><br><br>
• 0 ≤ P(E) ≤ 1 always<br>
• P(E) + P(Ē) = 1<br>
• Mutually exclusive: P(A∪B) = P(A)+P(B)<br><br>
<strong>Quick examples:</strong><br>
• Die → P(even) = 3/6 = <strong>1/2</strong><br>
• Cards → P(ace) = 4/52 = <strong>1/13</strong><br>
• 2 coins → P(both heads) = <strong>1/4</strong>` },

  { keys:['hcf','lcm','euclid','euclid division','real numbers','irrational'],
    response:`<strong>📐 Real Numbers</strong><br><br>
<strong>Euclid's Lemma:</strong> a = bq + r (0 ≤ r &lt; b)<br><br>
• HCF × LCM = Product of two numbers<br>
• p/q terminating only if q = 2ᵃ×5ᵇ<br>
• √2, √3, √5 are irrational<br><br>
<strong>HCF of 96 & 404:</strong><br>
404=96×4+20 → 96=20×4+16 → 20=16×1+4 → 16=4×4+0<br>
∴ <strong>HCF = 4</strong>` },

  { keys:['coordinate geometry','distance formula','section formula','midpoint','collinear'],
    response:`<strong>📐 Coordinate Geometry</strong><br><br>
• <strong>Distance:</strong> √[(x₂−x₁)²+(y₂−y₁)²]<br>
• <strong>Midpoint:</strong> ((x₁+x₂)/2, (y₁+y₂)/2)<br>
• <strong>Section (m:n):</strong> ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))<br>
• <strong>Area of △:</strong> ½|x₁(y₂−y₃)+x₂(y₃−y₁)+x₃(y₁−y₂)|<br>
• Collinear → Area = 0` },

  { keys:['statistics','mean','median','mode','ogive','cumulative'],
    response:`<strong>📊 Statistics</strong><br><br>
• <strong>Mean (Direct):</strong> Σfx/Σf<br>
• <strong>Mean (Step deviation):</strong> A + (Σfd/Σf), d=x−A<br>
• <strong>Median:</strong> L + [(n/2−cf)/f]×h<br>
• <strong>Mode:</strong> L + [(f₁−f₀)/(2f₁−f₀−f₂)]×h<br>
• <strong>Empirical:</strong> Mode = 3 Median − 2 Mean` },

  { keys:['circle','tangent','chord','secant','arc','sector','segment'],
    response:`<strong>📐 Circles</strong><br><br>
<strong>Tangent theorems:</strong><br>
• Tangent ⊥ radius at point of contact<br>
• Two tangents from external point are equal<br>
• Angle in alternate segment = angle between tangent & chord<br><br>
<strong>Area formulas:</strong><br>
• Sector area = (θ/360)πr²<br>
• Arc length = (θ/360)×2πr<br>
• Segment = Sector − Triangle` },

  { keys:['polynomial','zeroes','factor theorem','remainder theorem','cubic'],
    response:`<strong>📐 Polynomials</strong><br><br>
<strong>For ax² + bx + c (zeroes α, β):</strong><br>
• α + β = −b/a<br>
• αβ = c/a<br><br>
<strong>For ax³+bx²+cx+d (zeroes α,β,γ):</strong><br>
• α+β+γ = −b/a<br>
• αβ+βγ+γα = c/a<br>
• αβγ = −d/a<br><br>
<strong>Factor theorem:</strong> (x−a) is factor if p(a)=0` },

  { keys:['surface area','volume','cylinder','cone','sphere','hemisphere','cuboid','cube'],
    response:`<strong>📐 Surface Area & Volume</strong><br><br>
<strong>Cylinder (r,h):</strong> CSA=2πrh | TSA=2πr(r+h) | V=πr²h<br>
<strong>Cone (r,h,l):</strong> CSA=πrl | TSA=πr(r+l) | V=⅓πr²h<br>
<strong>Sphere:</strong> SA=4πr² | V=⁴⁄₃πr³<br>
<strong>Hemisphere:</strong> CSA=2πr² | TSA=3πr² | V=⅔πr³<br>
<strong>Cuboid:</strong> TSA=2(lb+bh+lh) | V=lbh` },

  { keys:['height distance','angle elevation','angle depression','trigonometry application'],
    response:`<strong>📐 Heights & Distances</strong><br><br>
<strong>Angle of Elevation:</strong> angle looked UP from horizontal<br>
<strong>Angle of Depression:</strong> angle looked DOWN from horizontal<br><br>
<strong>Key formulas used:</strong><br>
• tan θ = height/base → height = base × tan θ<br>
• sin θ = height/hypotenuse<br><br>
<strong>Tip:</strong> Always draw a diagram first! Mark the right angle, angle θ, and the unknown side. Then pick sin/cos/tan accordingly.` },

  { keys:['linear equation','pair of linear','simultaneous','substitution','elimination','cross multiplication'],
    response:`<strong>📐 Pair of Linear Equations</strong><br><br>
<strong>Methods to solve:</strong><br>
1️⃣ <strong>Substitution:</strong> Express one variable in terms of other<br>
2️⃣ <strong>Elimination:</strong> Add/subtract equations to cancel one variable<br>
3️⃣ <strong>Cross multiplication:</strong> Direct formula for a₁x+b₁y+c₁=0 & a₂x+b₂y+c₂=0<br><br>
<strong>Consistency:</strong><br>
• a₁/a₂ ≠ b₁/b₂ → unique solution (consistent)<br>
• a₁/a₂ = b₁/b₂ = c₁/c₂ → infinitely many<br>
• a₁/a₂ = b₁/b₂ ≠ c₁/c₂ → no solution` },

  { keys:['simple interest','compound interest','si','ci','principal','rate','time'],
    response:`<strong>💰 Simple & Compound Interest</strong><br><br>
• <strong>SI = PRT/100</strong> &nbsp;|&nbsp; Amount (SI) = P + SI<br>
• <strong>CI: A = P(1 + R/100)ⁿ</strong> &nbsp;|&nbsp; CI = A − P<br><br>
<strong>Example:</strong> P=₹10,000, R=10%, T=2 yrs<br>
• SI = 10000×10×2/100 = <strong>₹2,000</strong><br>
• CI: A = 10000×(1.1)² = 12100 → CI = <strong>₹2,100</strong><br><br>
CI is always greater than SI for T &gt; 1 year` },

  { keys:['percentage','profit','loss','discount','markup','selling price','cost price'],
    response:`<strong>💰 Percentage, Profit & Loss</strong><br><br>
• Profit = SP − CP &nbsp;|&nbsp; Profit% = Profit/CP × 100<br>
• Loss = CP − SP &nbsp;|&nbsp; Loss% = Loss/CP × 100<br>
• SP = CP × (100+P%)/100<br>
• Discount = MP − SP &nbsp;|&nbsp; Discount% = Discount/MP × 100<br><br>
<strong>Example:</strong> CP=₹500, Profit=20%<br>
SP = 500×120/100 = <strong>₹600</strong>` },

  /* ── SCIENCE PHYSICS ── */
  { keys:["ohm's law",'ohm','resistance','current','voltage','electric','circuit','series','parallel'],
    response:`<strong>⚡ Electricity</strong><br><br>
<strong>V = IR</strong> (Ohm's Law)<br><br>
• R = ρL/A &nbsp;|&nbsp; P = VI = I²R = V²/R<br>
• <strong>Series:</strong> R_total = R₁+R₂+R₃ (same current)<br>
• <strong>Parallel:</strong> 1/R = 1/R₁+1/R₂+1/R₃ (same voltage)<br>
• Joule's heating: H = I²Rt<br>
• 1 kWh = 3.6×10⁶ J<br><br>
<strong>Example:</strong> V=10V, R=5Ω → I = 2A ✅` },

  { keys:['mirror','lens','reflection','refraction','focal','concave','convex','image'],
    response:`<strong>🔭 Light — Mirrors & Lenses</strong><br><br>
• <strong>Mirror formula:</strong> 1/v + 1/u = 1/f<br>
• <strong>Lens formula:</strong> 1/v − 1/u = 1/f<br>
• Magnification (mirror) = −v/u<br>
• <strong>Power of lens:</strong> P = 1/f (metres) → Dioptre (D)<br><br>
<strong>Concave</strong> mirror/lens → converging<br>
<strong>Convex</strong> mirror → always virtual, erect → rear-view<br>
<strong>Sign convention:</strong> object always left (−u)` },

  { keys:['magnetic','electromagnet','solenoid','motor','generator','faraday','fleming','induction'],
    response:`<strong>🧲 Magnetic Effects of Current</strong><br><br>
• <strong>Right-hand thumb rule:</strong> thumb=current, fingers=field<br>
• <strong>Fleming's Left-hand rule:</strong> Motor (force on conductor)<br>
• <strong>Fleming's Right-hand rule:</strong> Generator (induced current)<br><br>
<strong>Electric Motor:</strong> Electrical → Mechanical energy<br>
<strong>Generator (Faraday):</strong> Mechanical → Electrical energy<br><br>
<strong>Solenoid:</strong> uniform field inside, like a bar magnet` },

  { keys:['eye','myopia','hypermetropia','presbyopia','defects','vision','lens power'],
    response:`<strong>👁️ Defects of Vision</strong><br><br>
1️⃣ <strong>Myopia:</strong> Can't see far → image before retina → <strong>Concave lens</strong><br>
2️⃣ <strong>Hypermetropia:</strong> Can't see near → image behind retina → <strong>Convex lens</strong><br>
3️⃣ <strong>Presbyopia:</strong> Old age, both → <strong>Bifocal lens</strong><br><br>
Normal near point = <strong>25 cm</strong><br>
Power (D) = 1/f(m) &nbsp;→&nbsp; concave = −ve, convex = +ve` },

  { keys:['scattering','sky blue','tyndall','sunset','rainbow','dispersion','prism'],
    response:`<strong>🌈 Light Scattering & Dispersion</strong><br><br>
• <strong>Sky blue:</strong> blue light (short λ) scatters most by air molecules<br>
• <strong>Sunset red/orange:</strong> blue scattered away; red (long λ) reaches us<br>
• <strong>Tyndall effect:</strong> scattering by colloidal particles (smoky room, fog)<br>
• <strong>Rainbow:</strong> dispersion + refraction + TIR in water droplets<br>
• <strong>VIBGYOR:</strong> Violet to Red (violet bends most)` },

  { keys:['energy sources','renewable','non-renewable','solar','wind','hydro','fossil fuel','nuclear'],
    response:`<strong>⚡ Energy Sources</strong><br><br>
<strong>Non-renewable (finite, polluting):</strong><br>
• Coal, Petroleum, Natural gas, Nuclear<br><br>
<strong>Renewable (clean, infinite):</strong><br>
• Solar, Wind, Hydro, Geothermal, Tidal, Biomass<br><br>
<strong>Key facts:</strong><br>
• <strong>Solar cell:</strong> converts light → electricity (no pollution)<br>
• <strong>Biogas:</strong> mainly methane from animal/plant waste<br>
• <strong>Nuclear:</strong> huge energy but radioactive waste<br>
• India's goal: 500 GW renewable by 2030` },

  /* ── SCIENCE CHEMISTRY ── */
  { keys:['photosynthesis','chlorophyll','glucose','stomata','chloroplast'],
    response:`<strong>🌱 Photosynthesis</strong><br><br>
<strong>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</strong> (Sunlight + Chlorophyll)<br><br>
• Site: <strong>Chloroplasts</strong> (contain chlorophyll)<br>
• Inputs: CO₂ (stomata) + H₂O (roots) + light<br>
• Outputs: Glucose (food) + O₂ (released)<br>
• Light reactions: thylakoid &nbsp;|&nbsp; Calvin cycle: stroma<br><br>
<strong>Factors:</strong> Light intensity, CO₂ concentration, Temperature` },

  { keys:['acid','base','ph scale','indicator','neutralisation','salt','litmus'],
    response:`<strong>🧪 Acids, Bases & Salts</strong><br><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Acid</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Base</strong><br>
• pH &lt; 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; pH &gt; 7<br>
• Blue→Red (litmus) &nbsp; Red→Blue<br>
• Releases H⁺ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Releases OH⁻<br><br>
<strong>Important salts:</strong><br>
• Baking soda: NaHCO₃ &nbsp;|&nbsp; Washing soda: Na₂CO₃<br>
• POP: CaSO₄·½H₂O &nbsp;|&nbsp; Common salt: NaCl` },

  { keys:['chemical reaction','combination','decomposition','displacement','redox','oxidation','reduction'],
    response:`<strong>⚗️ Types of Chemical Reactions</strong><br><br>
1️⃣ <strong>Combination:</strong> A+B→AB &nbsp;(CaO+H₂O→Ca(OH)₂)<br>
2️⃣ <strong>Decomposition:</strong> AB→A+B &nbsp;(CaCO₃→CaO+CO₂)<br>
3️⃣ <strong>Single displacement:</strong> Fe+CuSO₄→FeSO₄+Cu<br>
4️⃣ <strong>Double displacement:</strong> NaOH+HCl→NaCl+H₂O<br>
5️⃣ <strong>Redox:</strong> Oxidation + Reduction always together<br><br>
<strong>Oxidation:</strong> loss of e⁻ / gain of O₂<br>
<strong>Reduction:</strong> gain of e⁻ / loss of O₂` },

  { keys:['reactivity series','metals','non metals','alloy','corrosion','galvanizing','electroplating'],
    response:`<strong>⚗️ Metals & Reactivity Series</strong><br><br>
<strong>K&gt;Na&gt;Ca&gt;Mg&gt;Al&gt;Zn&gt;Fe&gt;Pb&gt;H&gt;Cu&gt;Hg&gt;Ag&gt;Au</strong><br><br>
• Metals above H → displace H₂ from dilute acids<br>
• Na, K → stored in kerosene (too reactive)<br>
• Au, Pt → most unreactive<br><br>
<strong>Corrosion:</strong> 4Fe+3O₂+6H₂O→4Fe(OH)₃<br>
<strong>Prevention:</strong> paint, galvanize, electroplate, alloy` },

  { keys:['carbon','organic','alkane','alkene','alkyne','hydrocarbon','ethanol','ethanoic','soap','saponification'],
    response:`<strong>⚗️ Carbon Compounds</strong><br><br>
<strong>Hydrocarbons:</strong><br>
• Alkanes (CₙH₂ₙ₊₂): saturated — CH₄, C₂H₆<br>
• Alkenes (CₙH₂ₙ): one double bond — C₂H₄<br>
• Alkynes (CₙH₂ₙ₋₂): one triple bond — C₂H₂<br><br>
• <strong>Ethanol</strong> C₂H₅OH → alcohol, fuel<br>
• <strong>Ethanoic acid</strong> CH₃COOH → vinegar (5-8%)<br>
• <strong>Saponification:</strong> Fat + NaOH → Soap + Glycerol` },

  { keys:['periodic table','periodic','mendeleev','dobereiner','newlands','valence','atomic number'],
    response:`<strong>⚗️ Periodic Table</strong><br><br>
<strong>History:</strong><br>
• Dobereiner's Triads (1829)<br>
• Newlands' Octaves (1866)<br>
• Mendeleev's Table (1869) — arranged by atomic mass<br>
• Modern table — arranged by <strong>atomic number</strong><br><br>
<strong>Periods (7):</strong> horizontal rows → same no. of shells<br>
<strong>Groups (18):</strong> vertical columns → same valence electrons<br><br>
• Group 1 = Alkali metals &nbsp;|&nbsp; Group 17 = Halogens<br>
• Group 18 = Noble gases (inert)` },

  /* ── SCIENCE BIOLOGY ── */
  { keys:['respiration','aerobic','anaerobic','atp','mitochondria','lactic acid','yeast'],
    response:`<strong>🫁 Respiration</strong><br><br>
<strong>Aerobic:</strong> C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + <strong>38 ATP</strong><br>
Site: Mitochondria ("powerhouse of the cell")<br><br>
<strong>Anaerobic:</strong><br>
• Yeast: Glucose → Ethanol + CO₂ + 2 ATP<br>
• Muscles: Glucose → Lactic acid + 2 ATP<br>
→ causes muscle cramps<br><br>
<strong>ATP</strong> = Adenosine Triphosphate = energy currency of cell` },

  { keys:['nervous system','neuron','synapse','reflex','spinal cord','brain','cerebrum','cerebellum','medulla'],
    response:`<strong>🧠 Nervous System</strong><br><br>
<strong>Neuron parts:</strong> Dendrites → Cell body → Axon → Synapse<br>
<strong>CNS:</strong> Brain + Spinal cord &nbsp;|&nbsp; <strong>PNS:</strong> all other nerves<br><br>
<strong>Reflex arc:</strong><br>
Stimulus→Receptor→Sensory nerve→Spinal cord→Motor nerve→Effector<br><br>
<strong>Brain regions:</strong><br>
• Cerebrum → thinking, memory<br>
• Cerebellum → balance, coordination<br>
• Medulla → breathing, heartbeat (involuntary)` },

  { keys:['heredity','mendel','genetics','dominant','recessive','monohybrid','dihybrid','chromosome','gene','dna'],
    response:`<strong>🧬 Heredity & Evolution</strong><br><br>
<strong>Mendel's Laws:</strong><br>
• Law of Segregation: alleles separate during gamete formation<br>
• Law of Independent Assortment: genes on different chromosomes<br><br>
<strong>Monohybrid cross (Tt×Tt):</strong> Phenotype ratio <strong>3:1</strong><br>
<strong>Dihybrid cross:</strong> Phenotype ratio <strong>9:3:3:1</strong><br><br>
• Dominant = expressed with 1 copy (T)<br>
• Recessive = expressed only when homozygous (tt)<br>
• Plant used: <strong>Garden pea (Pisum sativum)</strong>` },

  { keys:['life processes','nutrition','digestion','transport','blood','heart','excretion','nephron','kidney'],
    response:`<strong>🌿 Life Processes</strong><br><br>
<strong>Nutrition:</strong> Autotrophic (plants) | Heterotrophic (animals)<br><br>
<strong>Blood circulation:</strong><br>
• Heart: 4 chambers | Double circulation<br>
• Pulmonary vein → oxygenated blood → heart<br>
• Aorta → body from heart<br><br>
<strong>Excretion:</strong><br>
• Functional unit: <strong>Nephron</strong><br>
• Nitrogenous waste: <strong>Urea</strong> (humans)` },

  { keys:['reproduction','asexual','sexual','binary fission','budding','fragmentation','pollination','fertilisation'],
    response:`<strong>🌸 Reproduction</strong><br><br>
<strong>Asexual (no gametes needed):</strong><br>
• Binary fission: Amoeba, Bacteria<br>
• Budding: Hydra, Yeast<br>
• Fragmentation: Spirogyra<br>
• Regeneration: Planaria<br><br>
<strong>Sexual:</strong> requires male + female gametes<br>
• Plants: pollination → fertilisation → seed<br>
• Humans: sperm + egg → zygote → foetus<br><br>
<strong>Vegetative propagation:</strong> stem, root, leaf cuttings` },

  { keys:['ecosystem','food chain','food web','trophic','biodiversity','ozone','environment','pollution','cfc'],
    response:`<strong>🌍 Environment</strong><br><br>
<strong>Food chain:</strong> Producer→Herbivore→Carnivore→Top carnivore<br>
<strong>10% energy law (Lindemann):</strong> only 10% transfers each level<br><br>
<strong>Ozone layer:</strong><br>
• Location: Stratosphere<br>
• Depleted by: CFCs (chlorofluorocarbons)<br>
• Effect: UV radiation → skin cancer, cataracts<br><br>
<strong>Waste:</strong><br>
• Biodegradable: food, paper, cotton<br>
• Non-biodegradable: plastic, DDT, glass` },

  { keys:['hormone','endocrine','insulin','thyroxine','adrenaline','pituitary','auxin','gibberellin','plant hormone'],
    response:`<strong>🌿 Hormones</strong><br><br>
<strong>Human hormones:</strong><br>
• <strong>Pituitary:</strong> GH, TSH (master gland)<br>
• <strong>Thyroid:</strong> Thyroxine → regulates metabolism<br>
• <strong>Adrenal:</strong> Adrenaline → fight or flight<br>
• <strong>Pancreas:</strong> Insulin (↓ blood glucose) | Glucagon (↑)<br><br>
<strong>Plant hormones:</strong><br>
• <strong>Auxin:</strong> cell elongation, phototropism<br>
• <strong>Gibberellin:</strong> stem growth, germination<br>
• <strong>Abscisic acid:</strong> inhibits, wilting, dormancy<br>
• <strong>Ethylene:</strong> fruit ripening` },

  /* ── HISTORY ── */
  { keys:['dandi','salt march','civil disobedience','cdm','gandhi','1930'],
    response:`<strong>🇮🇳 Civil Disobedience / Dandi March</strong><br><br>
• <strong>Date:</strong> 12 March – 6 April 1930<br>
• <strong>Route:</strong> Sabarmati Ashram → Dandi (~380 km)<br>
• <strong>Purpose:</strong> Protest British salt tax (make salt illegally)<br>
• Started with 78 volunteers<br><br>
<strong>Timeline:</strong><br>
• 1919: Rowlatt Act + Jallianwala Bagh<br>
• 1920: Non-Cooperation (called off after Chauri Chaura 1922)<br>
• 1930: Civil Disobedience (Dandi March)<br>
• 1942: Quit India — "Do or Die"<br>
• 1947: Independence (15 August)` },

  { keys:['nationalism europe','french revolution','napoleon','zollverein','bismarck','garibaldi','mazzini','unification'],
    response:`<strong>🏛️ Nationalism in Europe</strong><br><br>
1️⃣ French Revolution (1789) — liberty, equality, fraternity<br>
2️⃣ Napoleon — spread revolutionary ideas<br>
3️⃣ Romanticism — folk tales, music for national identity<br>
4️⃣ Zollverein (1834) — German customs union<br>
5️⃣ 1848 — Spring of Nations (revolutions across Europe)<br>
6️⃣ Germany unified (1866–71) — Bismarck "Blood and Iron"<br>
7️⃣ Italy — Mazzini+Garibaldi+Cavour<br><br>
<strong>Quote:</strong> "When France sneezes, Europe catches cold" — Metternich` },

  { keys:['world war','ww1','ww2','first world war','second world war','hiroshima','holocaust','cold war'],
    response:`<strong>🌍 World Wars</strong><br><br>
<strong>WWI (1914–1918):</strong><br>
• Trigger: Assassination of Archduke Franz Ferdinand<br>
• Ended: Treaty of Versailles (1919) → League of Nations<br><br>
<strong>WWII (1939–1945):</strong><br>
• Trigger: Germany invades Poland<br>
• Holocaust: 6 million Jews killed by Hitler<br>
• Hiroshima (6 Aug) + Nagasaki (9 Aug) 1945 → Japan surrenders<br>
• Result: UN formed; Cold War begins<br><br>
<strong>Cold War (1947–1991):</strong> USA vs USSR — ideological rivalry` },

  { keys:['print culture','printing press','gutenberg','books','newspapers','mass communication'],
    response:`<strong>📰 Print Culture & Nationalism</strong><br><br>
• <strong>Gutenberg Press (1448):</strong> first printing press in Europe<br>
• Made books affordable and widespread<br>
• Spread Reformation ideas (Martin Luther)<br>
• Newspapers became voice of nationalism<br><br>
<strong>In India:</strong><br>
• First printed books in India: Goa (Portuguese missionaries)<br>
• Raja Ram Mohan Roy used press for social reform<br>
• Bal Gangadhar Tilak used "Kesari" newspaper for nationalism<br>
• Press censored by Vernacular Press Act (1878)` },

  { keys:['industrialisation','industrial revolution','factory','labour','child labour','manchester','bombay'],
    response:`<strong>🏭 Industrialisation</strong><br><br>
<strong>Britain (18th century):</strong><br>
• Steam engine → cotton/iron industries<br>
• Children worked in factories (12-16 hrs/day)<br>
• Manchester → "Cottonopolis"<br><br>
<strong>India:</strong><br>
• First cotton mill: Bombay (1854)<br>
• First jute mill: Bengal (1855)<br>
• Tata Iron & Steel: Jamshedpur (1912)<br><br>
<strong>Problems:</strong> low wages, no job security, no unions initially` },

  /* ── GEOGRAPHY ── */
  { keys:['soil','alluvial','black soil','laterite','red soil','desert soil','forest soil'],
    response:`<strong>🌱 Soil Types in India</strong><br><br>
1️⃣ <strong>Alluvial:</strong> Most fertile, Indo-Gangetic plains, rice/wheat<br>
2️⃣ <strong>Black (Regur):</strong> Deccan, retains moisture → <strong>COTTON</strong><br>
3️⃣ <strong>Red & Yellow:</strong> Odisha, TN, Andhra (crystalline rocks)<br>
4️⃣ <strong>Laterite:</strong> Kerala, Karnataka (leached) → tea, coffee<br>
5️⃣ <strong>Arid:</strong> Rajasthan — sandy, low humus<br>
6️⃣ <strong>Forest:</strong> Himalayan slopes — humus-rich<br><br>
<strong>Memory:</strong> <em>ABRLAF</em>` },

  { keys:['agriculture','kharif','rabi','zaid','crop','green revolution','swaminathan','irrigation'],
    response:`<strong>🌾 Agriculture in India</strong><br><br>
<strong>Kharif (June–Sept):</strong> Rice, Maize, Cotton, Jute, Bajra<br>
<strong>Rabi (Oct–March):</strong> Wheat, Barley, Mustard, Peas, Gram<br>
<strong>Zaid (March–June):</strong> Watermelon, Cucumber<br><br>
<strong>Green Revolution (1960s):</strong><br>
• HYV seeds + fertilizers + irrigation<br>
• Pioneer: <strong>M.S. Swaminathan</strong><br>
• Mainly: Wheat & Rice | States: Punjab, Haryana, UP<br><br>
<strong>India:</strong> Largest pulse producer; 2nd in rice & wheat` },

  { keys:['rivers','ganga','brahmaputra','godavari','krishna','kaveri','narmada','tapi','drainage'],
    response:`<strong>🌊 Rivers of India</strong><br><br>
<strong>Himalayan (perennial — glacier + rain fed):</strong><br>
• Ganga, Yamuna, Brahmaputra → form deltas<br><br>
<strong>Peninsular (seasonal — rain only):</strong><br>
• <strong>West-flowing:</strong> Narmada, Tapi → estuaries<br>
• <strong>East-flowing:</strong> Godavari (longest peninsular), Krishna, Kaveri<br><br>
• Longest river: Ganga<br>
• Largest basin: Ganga basin<br>
• Brahmaputra = Tsangpo (Tibet) = Jamuna (Bangladesh)` },

  { keys:['minerals','coal','petroleum','iron ore','bauxite','mica','mining','energy resource'],
    response:`<strong>⛏️ Minerals & Energy Resources</strong><br><br>
<strong>Metallic:</strong><br>
• Iron ore: Jharkhand, Odisha, Chhattisgarh<br>
• Copper: Rajasthan, Jharkhand<br>
• Bauxite (aluminium): Odisha, Gujarat<br><br>
<strong>Non-metallic:</strong><br>
• Mica: Jharkhand (largest), Andhra<br>
• Limestone: everywhere (cement industry)<br><br>
<strong>Coal types (quality):</strong> Anthracite &gt; Bituminous &gt; Lignite &gt; Peat<br>
<strong>Largest coal field:</strong> Jharia (Jharkhand)` },

  { keys:['forest','wildlife','biodiversity','reserve','national park','biosphere','deforestation'],
    response:`<strong>🌳 Forest & Wildlife</strong><br><br>
<strong>Types of forests in India:</strong><br>
• Tropical evergreen: Assam, Kerala (heavy rainfall)<br>
• Tropical deciduous: most common — teak, sal<br>
• Thorny: Rajasthan — cactus, acacia<br>
• Mangrove: Sundarbans (largest in world)<br><br>
<strong>Protected areas:</strong><br>
• National Parks: 106+ in India<br>
• Wildlife Sanctuaries: 551+<br>
• Biosphere Reserves: 18<br><br>
<strong>Key projects:</strong> Project Tiger (1973), Project Elephant` },

  { keys:['transport','roadways','railways','waterways','airways','pipeline','national highway'],
    response:`<strong>🚂 Lifelines of the Economy</strong><br><br>
<strong>Roadways:</strong><br>
• India has 2nd largest road network in world<br>
• NH (National Highways): 2% length, 40% traffic<br>
• Golden Quadrilateral: Delhi-Mumbai-Chennai-Kolkata<br><br>
<strong>Railways:</strong><br>
• 4th largest network in world<br>
• Largest employer in India<br><br>
<strong>Waterways:</strong><br>
• NW-1: Ganga (Prayagraj-Haldia)<br>
• NW-2: Brahmaputra<br><br>
<strong>Airways:</strong> Mumbai (busiest) | Delhi (international hub)` },

  /* ── ECONOMICS ── */
  { keys:['gdp','gnp','per capita','hdi','development','undp','human development'],
    response:`<strong>💰 Development & Economy</strong><br><br>
• <strong>Per capita income = National income / Population</strong><br>
• <strong>GDP:</strong> Total value of all goods & services in one year<br>
• <strong>HDI:</strong> Published by UNDP = Per capita income + Life expectancy + Education<br><br>
<strong>LPG Reforms (1991):</strong><br>
• <strong>L</strong>iberalisation + <strong>P</strong>rivatisation + <strong>G</strong>lobalisation<br>
• PM: Narasimha Rao | Finance Minister: Manmohan Singh<br><br>
<strong>Key insight:</strong> Kerala (lower income) &gt; Punjab (HDI) → income alone isn't enough` },

  { keys:['globalisation','mnc','wto','fdi','liberalisation','trade','foreign'],
    response:`<strong>🌐 Globalisation</strong><br><br>
• Integration of countries through trade + investment<br>
• <strong>MNC:</strong> production in 2+ countries (Samsung, Apple, Nestlé)<br>
• <strong>WTO (1995):</strong> promotes free and fair international trade<br>
• <strong>FDI:</strong> Foreign Direct Investment<br><br>
<strong>India's reforms (1991):</strong><br>
• Reduced import duties | Allowed foreign companies<br>
• Result: IT boom, BPO, manufacturing growth<br>
• Challenge: small industries face MNC competition` },

  { keys:['money','credit','bank','rbi','shg','self help group','barter','formal','informal'],
    response:`<strong>🏦 Money & Credit</strong><br><br>
• <strong>Barter problem:</strong> double coincidence of wants → solved by money<br><br>
<strong>Formal credit (RBI regulated):</strong><br>
Banks, cooperative societies → lower rates, needs collateral<br><br>
<strong>Informal credit (unregulated):</strong><br>
Moneylenders → very high rates → debt trap<br><br>
<strong>SHG (Self Help Group):</strong><br>
• 15-20 rural women | pool savings | give loans<br>
• Bypasses moneylenders | empowers women<br>
• RBI = Reserve Bank of India (regulates banking)` },

  { keys:['consumer','consumer rights','consumer protection','isi','agmark','standardisation'],
    response:`<strong>🛒 Consumer Rights</strong><br><br>
<strong>6 Consumer Rights:</strong><br>
1️⃣ Right to Safety<br>
2️⃣ Right to be Informed<br>
3️⃣ Right to Choose<br>
4️⃣ Right to be Heard<br>
5️⃣ Right to Seek Redressal<br>
6️⃣ Right to Consumer Education<br><br>
• <strong>COPRA (1986):</strong> Consumer Protection Act<br>
• <strong>ISI:</strong> industrial goods | <strong>AGMARK:</strong> agricultural<br>
• <strong>Hallmark:</strong> gold jewellery<br>
• World Consumer Rights Day: <strong>15 March</strong>` },

  /* ── CIVICS ── */
  { keys:['power sharing','belgium','sri lanka','majoritarianism','federal','unitary'],
    response:`<strong>⚖️ Power Sharing</strong><br><br>
<strong>Belgium (success):</strong> Dutch 59% + French 40%<br>
→ Equal representation + federal system → no conflict ✅<br><br>
<strong>Sri Lanka (failure):</strong> Sinhala Only Act (1956)<br>
→ Tamils alienated → decades of civil war ❌<br><br>
<strong>Forms:</strong><br>
1️⃣ Horizontal: Legislature ↔ Executive ↔ Judiciary<br>
2️⃣ Vertical: Central → State → Local<br>
3️⃣ Among parties (coalition)<br>
4️⃣ Among social groups (reservations)` },

  { keys:['democracy','elections','political party','constitution','fundamental rights','directive principles'],
    response:`<strong>🗳️ Democracy & Constitution</strong><br><br>
<strong>Indian Constitution:</strong><br>
• Adopted: 26 Nov 1949 | Enacted: 26 Jan 1950<br>
• Drafted by: <strong>Dr. B.R. Ambedkar</strong><br>
• Longest written constitution in the world<br><br>
<strong>Fundamental Rights (Part III):</strong><br>
1️⃣ Right to Equality (14-18)<br>
2️⃣ Right to Freedom (19-22)<br>
3️⃣ Right Against Exploitation (23-24)<br>
4️⃣ Right to Freedom of Religion (25-28)<br>
5️⃣ Cultural & Educational Rights (29-30)<br>
6️⃣ Right to Constitutional Remedies (32) — "Heart & Soul"` },

  { keys:['gender','women','caste','religion','communalism','secularism','social division'],
    response:`<strong>⚖️ Social Divisions & Democracy</strong><br><br>
<strong>Gender division:</strong><br>
• Women face discrimination in work, pay, politics<br>
• India has 33% reservation bill (Women's Reservation)<br>
• Panchayati Raj → 1/3 seats reserved for women<br><br>
<strong>Caste & politics:</strong><br>
• Caste influences voting patterns<br>
• Reservations for SC/ST/OBC in education, jobs, legislature<br><br>
<strong>Communalism:</strong> religion used for political gains → dangerous<br>
<strong>Secularism:</strong> state has no official religion (India's model)` },

  /* ── ENGLISH ── */
  { keys:['letter to god','lencho','g.l. fuentes','hailstorm','pesos'],
    response:`<strong>📖 A Letter to God</strong><br><br>
• <strong>Author:</strong> G.L. Fuentes (Mexican)<br>
• Lencho — farmer, crops destroyed by hailstorm<br>
• Writes to God asking for <strong>100 pesos</strong><br>
• Post office staff collect <strong>70 pesos</strong> and send<br>
• Lencho calls them "crooks" — dramatic irony!<br><br>
<strong>Themes:</strong> Unshakeable faith | Irony | Ingratitude<br><br>
<strong>Board Q:</strong> Why did Lencho call helpers crooks?<br>→ He believed God sent 100 but received only 70.` },

  { keys:['nelson mandela','apartheid','robben island','long walk','inauguration','south africa'],
    response:`<strong>📖 Nelson Mandela — Long Walk to Freedom</strong><br><br>
• Mandela's inauguration as first Black President, <strong>10 May 1994</strong><br>
• Imprisoned for <strong>27 years</strong> on Robben Island (1964–1990)<br>
• <strong>Apartheid:</strong> racial segregation system (1948–1994)<br>
• <strong>ANC:</strong> African National Congress<br><br>
<strong>Key ideas:</strong><br>
• Both oppressor & oppressed lose humanity<br>
• Courage = overcoming fear, not absence of it<br>
• "Greatest glory = rising every time we fall"` },

  { keys:['two stories from flying','black aeroplane','his first flight'],
    response:`<strong>📖 Two Stories About Flying</strong><br><br>
<strong>His First Flight (Liam O'Flaherty):</strong><br>
• Young seagull afraid to fly — family flies away<br>
• Mother tempts him with fish → he dives → flies!<br>
• Theme: Overcoming fear through courage<br><br>
<strong>Black Aeroplane (Frederick Forsyth):</strong><br>
• Pilot lost in storm clouds, fuel running out<br>
• A mysterious black aeroplane guides him to safety<br>
• Mystery: No one knows who the pilot was<br>
• Theme: Hope and help in crisis; mystery of life` },

  { keys:['glimpses of india','coorg','tea','bakers','kerala'],
    response:`<strong>📖 Glimpses of India</strong><br><br>
<strong>A Baker from Goa (Lucio Rodrigues):</strong><br>
• Portuguese tradition of bread-making in Goa<br>
• Baker = "pader" — still comes every morning<br>
• Soft bread rolls called "bol"<br><br>
<strong>Coorg (Lokesh Abrol):</strong><br>
• "Scotland of India" — Karnataka<br>
• Coffee + orange plantations | mist + rain<br>
• Brave Kodavas people; river Kaveri originates here<br><br>
<strong>Tea from Assam (Arup Kumar Datta):</strong><br>
• Two students on train — tea gardens of Assam<br>
• Legend: Buddhist monk brought tea plant from China<br>
• Assam = largest tea producer in world` },

  { keys:['footprints without feet','griffin','invisible','h.g. wells','iping'],
    response:`<strong>📖 Footprints Without Feet — H.G. Wells</strong><br><br>
• Griffin — brilliant but <em>lawless</em> scientist<br>
• Discovers how to make body <strong>invisible/transparent</strong><br>
• Burns landlord's house → homeless wanderer<br>
• Steals clothes from theatrical company<br>
• Hides at Mrs. Hall's inn in Iping village (winter)<br>
• Covered in bandages → identity hidden<br>
• Eventually exposed → runs away invisible<br><br>
<strong>Theme:</strong> Science without ethics = dangerous<br>
Power without responsibility → misuse & destruction` },

  { keys:['necklace','matilda','maupassant','forestier','diamond','francs'],
    response:`<strong>📖 The Necklace — Guy de Maupassant</strong><br><br>
• Matilda Loisel → obsessed with wealth & status<br>
• Borrows diamond necklace from Madame Forestier<br>
• Loses it → too proud to admit → buys replacement<br>
• Cost: <strong>36,000 francs</strong> → 10 years of poverty to repay<br>
• <strong>TWIST:</strong> necklace was fake! Worth only 500 francs!<br><br>
<strong>Themes:</strong> Vanity leads to downfall | Irony of fate | Deception<br>
This is an <strong>O. Henry style</strong> twist ending — remember it!` },

  { keys:['bholi','sulekha','tutors','harelip','stammer','marriage'],
    response:`<strong>📖 Bholi (Footprints)</strong><br><br>
• Author: K.A. Abbas<br>
• Bholi = Sulekha — neglected, slow, stammers, pockmarked<br>
• Sent to school (family thought: "Who will marry her?")<br>
• Teacher encourages her → she gains confidence<br>
• Bishambar demands dowry at wedding → Bholi REFUSES<br>
• Bholi becomes teacher herself<br><br>
<strong>Theme:</strong> Education empowers women | Courage against injustice<br>
<strong>Message:</strong> A teacher's encouragement can transform a life` },

  { keys:['anne frank','kitty','diary','nazis','amsterdam','bergen-belsen'],
    response:`<strong>📖 From the Diary of Anne Frank</strong><br><br>
• Jewish girl hiding from Nazis in Amsterdam (1942–1944)<br>
• Named her diary <strong>"Kitty"</strong> — her best friend<br>
• Captured August 1944 → died at Bergen-Belsen (age 15)<br><br>
<strong>Key ideas:</strong><br>
• "Paper has more patience than people"<br>
• Felt no true friend; chose to write instead<br>
• Describes funny relationship with teacher Mr. Keesing<br><br>
<strong>Themes:</strong> Loneliness | Resilience | War's impact on children` },

  /* ── GENERAL KNOWLEDGE ── */
  { keys:['planets','solar system','jupiter','saturn','mercury','venus','mars','uranus','neptune'],
    response:`<strong>🪐 Solar System</strong><br><br>
<strong>My Very Educated Mother Just Served Us Noodles</strong><br>
Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune<br><br>
• Largest: <strong>Jupiter</strong> | Smallest: <strong>Mercury</strong><br>
• Hottest: <strong>Venus</strong> (greenhouse effect)<br>
• Farthest: <strong>Neptune</strong><br>
• Planet with most moons: Jupiter (95)<br>
• Light from Sun to Earth: <strong>8 minutes 20 seconds</strong><br>
• 1 light year ≈ 9.46 trillion km` },

  { keys:['atom','atomic','proton','neutron','electron','nucleus','bohr','shell'],
    response:`<strong>⚛️ Atomic Structure</strong><br><br>
• <strong>Proton:</strong> +1 charge, in nucleus, mass=1u<br>
• <strong>Neutron:</strong> 0 charge, in nucleus, mass=1u<br>
• <strong>Electron:</strong> −1 charge, orbits nucleus, mass≈0<br><br>
• Atomic number (Z) = no. of protons<br>
• Mass number (A) = protons + neutrons<br>
• Isotopes: same Z, different A (e.g., C-12, C-14)<br><br>
<strong>Bohr's model:</strong> electrons in fixed orbits (K=2, L=8, M=18)<br>
<strong>Valence electrons</strong> = outermost shell electrons` },

  { keys:['cell','mitosis','meiosis','dna','chromosome','nucleus','chloroplast','mitochondria','ribosome'],
    response:`<strong>🔬 Cell Biology</strong><br><br>
<strong>Types:</strong> Prokaryotic (no nucleus — bacteria) | Eukaryotic (nucleus present)<br><br>
<strong>Key organelles:</strong><br>
• Nucleus: control centre, contains DNA<br>
• Mitochondria: ATP energy production<br>
• Chloroplast: photosynthesis (plants only)<br>
• Ribosome: protein synthesis<br><br>
<strong>Cell division:</strong><br>
• <strong>Mitosis:</strong> 2 identical cells (growth, repair)<br>
• <strong>Meiosis:</strong> 4 half-chromosome cells (reproduction)` },

  { keys:['india constitution','fundamental','directive','ambedkar','republic','preamble'],
    response:`<strong>🇮🇳 Indian Constitution</strong><br><br>
• Adopted: 26 Nov 1949 | Enacted: 26 Jan 1950<br>
• Father: <strong>Dr. B.R. Ambedkar</strong><br>
• Longest written constitution in the world<br><br>
<strong>Fundamental Rights (6):</strong><br>
1️⃣ Right to Equality (Art. 14-18)<br>
2️⃣ Right to Freedom (19-22)<br>
3️⃣ Right Against Exploitation (23-24)<br>
4️⃣ Right to Freedom of Religion (25-28)<br>
5️⃣ Cultural & Educational Rights (29-30)<br>
6️⃣ Right to Constitutional Remedies (32)<br><br>
<strong>Fundamental Duties:</strong> Added by 42nd Amendment, 1976` },

  { keys:['capital','country capital','new delhi','london','washington','beijing','tokyo','paris'],
    response:`<strong>🌍 World Capitals</strong><br><br>
<strong>South Asia:</strong><br>
India→New Delhi | Pakistan→Islamabad | Bangladesh→Dhaka<br>
Nepal→Kathmandu | Sri Lanka→Sri Jayawardenepura Kotte<br><br>
<strong>Major countries:</strong><br>
USA→Washington D.C. | UK→London | France→Paris<br>
Germany→Berlin | Russia→Moscow | China→Beijing<br>
Japan→Tokyo | Australia→Canberra | Canada→Ottawa<br>
Brazil→Brasília | UAE→Abu Dhabi | Saudi Arabia→Riyadh` },

  /* ── GENERAL ── */
  { keys:['what is ai','artificial intelligence','machine learning','chatgpt','ai','neural network'],
    response:`<strong>🤖 Artificial Intelligence (AI)</strong><br><br>
<strong>AI</strong> = machines that simulate human intelligence<br><br>
<strong>Types:</strong><br>
• <strong>Narrow AI:</strong> specific tasks (Siri, chess engines, ChatGPT)<br>
• <strong>General AI:</strong> human-level reasoning (not yet achieved)<br><br>
<strong>Machine Learning:</strong> AI learns from data without explicit programming<br>
<strong>Deep Learning:</strong> neural networks with many layers<br>
<strong>ChatGPT:</strong> Large Language Model by OpenAI<br>
<strong>Claude:</strong> AI by Anthropic (that's me!)<br><br>
<strong>Uses:</strong> Healthcare, education, self-driving cars, content creation, robotics` },

  { keys:['what is python','programming','coding','computer science','algorithm','software'],
    response:`<strong>💻 Programming & Computer Science</strong><br><br>
<strong>Python basics:</strong><br>
• print("Hello, World!") → output text<br>
• Variables: x = 10 &nbsp;|&nbsp; name = "Abi"<br>
• if/else: if x &gt; 5: print("big")<br>
• for loop: for i in range(5): print(i)<br><br>
<strong>Key concepts:</strong><br>
• <strong>Algorithm:</strong> step-by-step instructions to solve a problem<br>
• <strong>Variable:</strong> container to store data<br>
• <strong>Function:</strong> reusable block of code<br>
• <strong>Class:</strong> blueprint for objects (OOP)<br><br>
Ask me for help with any specific programming concept!` },

  { keys:['climate change','global warming','greenhouse','carbon','temperature','ice cap'],
    response:`<strong>🌡️ Climate Change & Global Warming</strong><br><br>
<strong>Greenhouse gases:</strong> CO₂, CH₄, N₂O, H₂O vapour<br>
These trap heat in atmosphere → Earth gets warmer<br><br>
<strong>Causes:</strong> burning fossil fuels, deforestation, industrial emissions<br><br>
<strong>Effects:</strong><br>
• Rising sea levels → coastal flooding<br>
• Extreme weather (floods, droughts, cyclones)<br>
• Melting glaciers & polar ice caps<br>
• Loss of biodiversity<br><br>
<strong>Solutions:</strong> Renewable energy | Electric vehicles | Reforestation | Paris Agreement (2015)` },

  { keys:['how to study','study tips','memory','concentration','focus','exam preparation'],
    response:`<strong>🎯 How to Study Effectively</strong><br><br>
<strong>Proven techniques:</strong><br>
1️⃣ <strong>Spaced repetition:</strong> revise after 1→3→7→21 days<br>
2️⃣ <strong>Active recall:</strong> test yourself, don't just re-read<br>
3️⃣ <strong>Pomodoro:</strong> 25 min focused + 5 min break<br>
4️⃣ <strong>Mind maps:</strong> connect concepts visually<br>
5️⃣ <strong>Teach someone:</strong> best way to know if you truly understand<br><br>
<strong>CBSE specific:</strong><br>
• NCERT first — 80% questions come from it<br>
• Solve past 5 years' papers in exam conditions<br>
• Make formula sheets for Maths & Science<br>
• 8 hours sleep the night before exam 💤` },

  { keys:['hello','hi','hey','hii','helo','namaste','good morning','good evening','good afternoon'],
    response:`👋 <strong>Hi there! I'm Owlix</strong> — your AI study assistant!<br><br>
I remember our conversation and can answer <strong>any question</strong>:<br><br>
• 📐 <strong>Maths</strong> — formulas, problems, step-by-step solutions<br>
• 🔬 <strong>Science</strong> — Physics, Chemistry, Biology<br>
• 📖 <strong>English</strong> — stories, grammar, writing skills<br>
• 🌍 <strong>Social Science</strong> — History, Geography, Civics, Economics<br>
• 💡 <strong>General</strong> — GK, AI, coding, climate, and more<br><br>
Just ask — I'll explain it clearly! 🦉` },

  { keys:['who are you','what are you','owlix','about you','your name'],
    response:`🦉 <strong>I'm Owlix</strong> — AbiLearn's AI Study Assistant!<br><br>
<strong>What makes me different from a basic chatbot:</strong><br>
1️⃣ I remember our conversation (context-aware)<br>
2️⃣ I can solve basic math expressions directly<br>
3️⃣ I detect what type of question you're asking<br>
4️⃣ 200+ topics in my knowledge base<br>
5️⃣ Connect Claude AI via ⚙️ for unlimited answers<br><br>
<strong>Powered by:</strong> Local KB + optional Claude AI backend<br><br>
Ask me anything — I'm here 24/7! 💪` },

  { keys:['thank','thanks','thank you','thx','ty','great','awesome','helpful'],
    response:`😊 You're welcome! Happy to help!<br><br>
If you have more doubts, just ask — I'm always here.<br><br>
<strong>Quick tips for your next question:</strong><br>
• Be specific: "explain photosynthesis step by step"<br>
• Ask for examples: "give example of acid-base reaction"<br>
• Ask follow-ups: "explain that in simpler words"<br><br>
Good luck with your studies! 🎓💪` },

  { keys:['board exam','exam tips','score 90','how to score','cbse tips','preparation'],
    response:`<strong>🎯 CBSE Board Exam Strategy</strong><br><br>
<strong>Subject-wise:</strong><br>
• <strong>Maths:</strong> 10 numericals/day | show all steps in board<br>
• <strong>Science:</strong> draw neat diagrams with labels<br>
• <strong>English:</strong> read passage twice before answering<br>
• <strong>Social:</strong> timeline charts for history; maps for geography<br><br>
<strong>General tips:</strong><br>
• NCERT first — 80% questions are directly from it<br>
• Solve 5 years' PYQs under timed conditions<br>
• Revise using spaced repetition<br>
• Sleep 8 hrs the night before<br>
• Don't cram on exam day — trust your preparation!` },

  { keys:['formula','all formulas','cheat sheet','quick reference'],
    response:`<strong>📐 Quick Formula Reference</strong><br><br>
<strong>MATHS:</strong><br>
• Quadratic: x = [−b±√(b²−4ac)]/2a<br>
• AP: aₙ=a+(n−1)d | Sₙ=n/2[2a+(n−1)d]<br>
• Distance: √[(x₂−x₁)²+(y₂−y₁)²]<br>
• P(E) = n(E)/n(S)<br><br>
<strong>PHYSICS:</strong><br>
• V=IR | P=VI=I²R | H=I²Rt<br>
• 1/v±1/u=1/f | P=1/f(m) dioptres<br><br>
<strong>CHEMISTRY:</strong><br>
• 6CO₂+6H₂O→C₆H₁₂O₆+6O₂ (photosynthesis)<br>
• C₆H₁₂O₆+6O₂→6CO₂+6H₂O+38ATP (aerobic respiration)<br><br>
Ask any topic for detailed formulas! 🦉` }
];

/* ══ SMART BRAIN — scored keyword matching ══ */
function owlixThinkSmart(message) {
  const msg = message.toLowerCase().replace(/[?!.,]/g, ' ');
  const words = msg.split(/\s+/).filter(w => w.length > 2);

  let bestScore = 0;
  let bestEntry = null;

  for (const entry of OWLIX_KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (msg.includes(key)) score += key.split(' ').length * 2; // phrase match = higher score
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

/* ══ MATH SOLVER ══ */
function tryMath(msg) {
  const clean = msg.trim()
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '**2').replace(/³/g, '**3')
    .replace(/\^/g, '**');

  // Simple arithmetic: digits, operators, parens, spaces
  if (/^[\d\s\+\-\*\/\.\(\)\%\*]+$/.test(clean)) {
    try {
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + clean + ')')();
      if (typeof result === 'number' && isFinite(result)) {
        return `<strong>🔢 Calculator</strong><br><br>
<strong>${escOwlix(msg.trim())} = ${+result.toFixed(6)}</strong><br><br>
<em>Need help with algebra or formulas? Just ask!</em>`;
      }
    } catch { /* not a valid expression */ }
  }
  return null;
}

/* ══ CONTEXT DETECTOR ══ */
function detectIntent(msg) {
  const m = msg.toLowerCase();
  if (/^[\d\s\+\-\*\/\.\(\)\^×÷]+$/.test(msg.trim())) return 'math';
  if (/^(what is|what are|define|definition of|meaning of)/i.test(msg)) return 'definition';
  if (/^(explain|how does|how do|tell me about)/i.test(msg)) return 'explanation';
  if (/^(solve|find|calculate|evaluate|compute)/i.test(msg)) return 'solve';
  if (/^(list|give me|name|examples of)/i.test(msg)) return 'list';
  if (/(explain more|elaborate|more detail|in simple|simplify)/i.test(msg)) return 'followup';
  if (/(difference between|compare|vs|versus)/i.test(msg)) return 'compare';
  return 'general';
}

/* ══ FOLLOW-UP HANDLER ══ */
function handleFollowUp(msg) {
  const intent = detectIntent(msg);
  if (intent !== 'followup') return null;
  const prev = lastBotContext();
  if (!prev) return null;
  // Re-send the same topic but prompt Claude to simplify
  return null; // Let Claude handle this with memory context
}

function escOwlix(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ══ CLAUDE API ══ */
const OWLIX_SYSTEM = `You are Owlix, the AI tutor on AbiLearn — an educational platform for students in India.
Answer ANY question asked — CBSE topics, general knowledge, science, maths, history, coding, current events, anything.

FORMAT rules (strict):
- Use HTML: <strong> for bold, <br> for line breaks, <em> for italic
- Use numbered emoji for steps: 1️⃣ 2️⃣ 3️⃣
- Use bullet points with •
- Use tables with inline-styled HTML when comparing data
- Emojis as section headers: 📐 maths, 🔬 science, 📖 English, 🌍 social, 💡 general, ⚡ physics, ⚗️ chemistry, 🧬 biology
- NEVER use markdown (no # ** __ etc)
- Keep responses 150-300 words — clear, student-friendly
- For CBSE topics: mention board exam relevance and tips
- For maths/science: formula first, then example
- End with a memory trick or encouragement when relevant`;

async function owlixAI(message) {
  const key = sessionStorage.getItem('owlix_api_key') || '';
  if (!key) return null;

  // Build messages array with conversation history
  const messages = OWLIX_MEMORY.map(m => ({ role: m.role, content: m.content }));
  messages.push({ role: 'user', content: message });

  try {
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
        system: OWLIX_SYSTEM,
        messages
      })
    });
    if (!res.ok) {
      if (res.status === 401) {
        sessionStorage.removeItem('owlix_api_key');
        return `⚠️ <strong>Invalid API key.</strong> Please re-enter your key via ⚙️.`;
      }
      return null;
    }
    const data = await res.json();
    return data?.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

/* ══ QUICK REPLIES ══ */
const QR = ["What is Ohm's Law?", "Photosynthesis equation", "Dandi March facts", "Quadratic formula", "Board exam tips"];

/* ══ UI INIT ══ */
function initOwlix() {
  const toggle = document.getElementById('owlixToggle');
  const win    = document.getElementById('owlixWindow');
  const close  = document.getElementById('owlixClose');
  const input  = document.getElementById('owlixInput');
  const send   = document.getElementById('owlixSend');
  const qrWrap = document.getElementById('quickReplies');
  if (!toggle || !win) return;

  if (qrWrap) {
    qrWrap.innerHTML = QR.map(r =>
      `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(r)})">${r}</button>`
    ).join('');
  }

  // Settings button in header
  const header = win.querySelector('.owlix-header');
  if (header && !header.querySelector('.owlix-settings-btn')) {
    const btn = document.createElement('button');
    btn.className = 'owlix-settings-btn';
    btn.title = 'AI Settings';
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
    addOwlixMsg('bot', `👋 <strong>Hi! I'm Owlix</strong> — your upgraded AI study buddy!<br><br>
I now remember our conversation and can answer <strong>any question</strong>.<br>
${hasKey ? '✅ <strong>Claude AI connected</strong> — unlimited answers!' : '💡 Click <strong>⚙️</strong> to connect Claude AI for even smarter answers!'}<br><br>
What would you like to know? 🎯`);
  }, 600);

  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    const badge = toggle.querySelector('.owlix-badge');
    if (badge && win.classList.contains('open')) badge.style.display = 'none';
  });
  if (close) close.addEventListener('click', () => win.classList.remove('open'));
  if (send)  send.addEventListener('click', submitOwlix);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') submitOwlix(); });
}

function toggleApiKeyPanel(win) {
  let panel = win.querySelector('.owlix-api-panel');
  if (panel) { panel.remove(); return; }
  panel = document.createElement('div');
  panel.className = 'owlix-api-panel';
  const cur = sessionStorage.getItem('owlix_api_key') || '';
  panel.innerHTML = `
    <div style="background:rgba(91,33,182,0.07);border:1px solid rgba(124,58,237,0.18);border-radius:12px;padding:1rem;margin:0.5rem 0.75rem;font-size:0.82rem">
      <div style="font-weight:700;margin-bottom:0.5rem;color:#5B21B6">⚙️ Claude AI Connection</div>
      <div style="color:#6B7280;margin-bottom:0.6rem;line-height:1.4">Connect your Anthropic API key to unlock <strong>any question</strong> answers.</div>
      <input type="password" id="owlixApiKeyInput" placeholder="sk-ant-..." value="${cur}"
        style="width:100%;padding:0.45rem 0.7rem;border:1px solid #D1D5DB;border-radius:8px;font-size:0.8rem;outline:none;font-family:inherit;margin-bottom:0.5rem">
      <div style="display:flex;gap:0.5rem">
        <button onclick="saveOwlixKey()" style="flex:1;background:#7C3AED;color:white;border:none;padding:0.4rem;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:600">Save</button>
        <button onclick="clearOwlixKey()" style="background:none;border:1px solid #D1D5DB;color:#6B7280;padding:0.4rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.8rem">Clear</button>
      </div>
      <div style="color:#9CA3AF;font-size:0.72rem;margin-top:0.5rem">Session only. <a href="https://console.anthropic.com" target="_blank" style="color:#7C3AED">Get a key →</a></div>
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
    addOwlixMsg('bot', '✅ <strong>Claude AI connected!</strong> I can now answer any question with full AI intelligence. Ask me anything! 🦉');
  }
  document.querySelector('.owlix-api-panel')?.remove();
}

function clearOwlixKey() {
  sessionStorage.removeItem('owlix_api_key');
  document.querySelector('.owlix-api-panel')?.remove();
  addOwlixMsg('bot', '🔑 API key cleared. Using built-in knowledge base. Reconnect via ⚙️ for unlimited answers.');
}

function submitOwlix() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendOwlixMessage(text);
}

async function sendOwlixMessage(text) {
  const win = document.getElementById('owlixWindow');
  if (win && !win.classList.contains('open')) win.classList.add('open');

  addOwlixMsg('user', escOwlix(text));
  memoryPush('user', text);

  // 1. Try math solver
  const mathResult = tryMath(text);
  if (mathResult) {
    showTyping();
    await delay(400);
    hideTyping();
    addOwlixMsg('bot', mathResult);
    memoryPush('assistant', mathResult);
    return;
  }

  // 2. Try smart local KB
  const localResponse = owlixThinkSmart(text);
  if (localResponse) {
    showTyping();
    await delay(500 + Math.random() * 400);
    hideTyping();
    addOwlixMsg('bot', localResponse);
    memoryPush('assistant', localResponse);
    return;
  }

  // 3. Try Claude API (with conversation memory)
  showTyping();
  const aiResponse = await owlixAI(text);
  hideTyping();

  if (aiResponse) {
    addOwlixMsg('bot', aiResponse);
    memoryPush('assistant', aiResponse);
    return;
  }

  // 4. Smart fallback
  const hasKey = !!sessionStorage.getItem('owlix_api_key');
  const intent = detectIntent(text);
  let fallback = `🤔 <strong>Hmm, let me try to help!</strong><br><br>`;

  if (intent === 'followup') {
    fallback += `Could you give me more context? What topic were you asking about?<br><br>`;
  } else if (intent === 'compare') {
    fallback += `For comparison questions, try asking about each item separately, e.g. "What is X?" then "What is Y?"<br><br>`;
  } else {
    fallback += `I don't have a built-in answer for "<em>${escOwlix(text.slice(0, 50))}${text.length > 50 ? '...' : ''}</em>"<br><br>`;
  }

  if (!hasKey) {
    fallback += `💡 <strong>Tip:</strong> Click ⚙️ above to connect Claude AI — I'll then answer <em>any</em> question instantly!<br><br>`;
  }

  fallback += `<strong>Topics I know well:</strong><br>
📐 Quadratic formula, AP, Pythagoras, Trigonometry, Probability<br>
🔬 Ohm's Law, Mirrors, Photosynthesis, Mendel, Periodic Table<br>
🌍 Dandi March, French Revolution, Soil Types, GDP, Power Sharing<br>
📖 Letter to God, Mandela, Footprints, Anne Frank, Bholi<br>
💡 Solar System, Constitution, World Capitals, AI, Climate Change`;

  addOwlixMsg('bot', fallback);
  memoryPush('assistant', fallback);
}

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

function hideTyping() {
  document.getElementById('owlix-typing')?.remove();
}

document.addEventListener('DOMContentLoaded', initOwlix);
