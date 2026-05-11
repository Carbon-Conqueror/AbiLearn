/* Owlix AI — AbiLearn Study Assistant v3
   Local KB + Claude API fallback for any question */

const OWLIX_KB = [

  /* ════════ MATHS — Class 10 ════════ */
  { keys:['quadratic formula','sridharacharya','quadratic equation'],
    response:`<strong>📐 Quadratic Formula (Sridharacharya)</strong><br><br>
<strong>Formula:</strong> x = [−b ± √(b² − 4ac)] / 2a<br><br>
<strong>📌 Steps to solve ax² + bx + c = 0:</strong><br>
1️⃣ Identify a, b, and c from the equation<br>
2️⃣ Calculate Discriminant: <strong>D = b² − 4ac</strong><br>
3️⃣ If D ≥ 0, find roots using the formula<br>
4️⃣ Two roots: x₁ = (−b + √D)/2a &nbsp; x₂ = (−b − √D)/2a<br><br>
<strong>📊 Nature of Roots:</strong><br>
• D &gt; 0 → Two distinct real roots<br>
• D = 0 → Two equal real roots<br>
• D &lt; 0 → No real roots (imaginary)<br><br>
<strong>Example:</strong> x² − 5x + 6 = 0<br>
D = 25 − 24 = 1 → x = (5±1)/2 → x = 3 or x = 2 ✅` },

  { keys:['pythagoras','pythagorean theorem'],
    response:`<strong>📐 Pythagoras Theorem</strong><br><br>
<strong>Statement:</strong> In a right-angled triangle:<br>
<strong>Hypotenuse² = Base² + Perpendicular²</strong><br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Only applies to right-angled triangles<br>
2️⃣ Hypotenuse is always the LONGEST side (opposite 90°)<br>
3️⃣ Formula: AC² = AB² + BC²<br>
4️⃣ Converse: if a² + b² = c², triangle is right-angled<br><br>
<strong>Common Pythagorean Triplets:</strong><br>
• 3, 4, 5 &nbsp;|&nbsp; 5, 12, 13 &nbsp;|&nbsp; 8, 15, 17<br>
• 7, 24, 25 &nbsp;|&nbsp; 6, 8, 10<br><br>
<strong>Example:</strong> AB = 3, BC = 4 → AC = √(9+16) = √25 = <strong>5</strong> ✅` },

  { keys:['trigonometry','sin cos tan','trig values','trig table','trigonometric'],
    response:`<strong>📐 Trigonometry — Class 10</strong><br><br>
<strong>Basic Ratios (right triangle):</strong><br>
• sin θ = Perpendicular / Hypotenuse<br>
• cos θ = Base / Hypotenuse<br>
• tan θ = Perpendicular / Base<br>
• cosec = 1/sin &nbsp;|&nbsp; sec = 1/cos &nbsp;|&nbsp; cot = 1/tan<br><br>
<strong>📊 Standard Values Table:</strong><br>
<table style="font-size:0.82rem;border-collapse:collapse;width:100%">
<tr style="background:rgba(124,58,237,0.15)"><td style="padding:3px 8px"><b>Angle</b></td><td style="padding:3px 8px"><b>sin</b></td><td style="padding:3px 8px"><b>cos</b></td><td style="padding:3px 8px"><b>tan</b></td></tr>
<tr><td style="padding:3px 8px">0°</td><td style="padding:3px 8px">0</td><td style="padding:3px 8px">1</td><td style="padding:3px 8px">0</td></tr>
<tr style="background:rgba(0,0,0,0.03)"><td style="padding:3px 8px">30°</td><td style="padding:3px 8px">1/2</td><td style="padding:3px 8px">√3/2</td><td style="padding:3px 8px">1/√3</td></tr>
<tr><td style="padding:3px 8px">45°</td><td style="padding:3px 8px">1/√2</td><td style="padding:3px 8px">1/√2</td><td style="padding:3px 8px">1</td></tr>
<tr style="background:rgba(0,0,0,0.03)"><td style="padding:3px 8px">60°</td><td style="padding:3px 8px">√3/2</td><td style="padding:3px 8px">1/2</td><td style="padding:3px 8px">√3</td></tr>
<tr><td style="padding:3px 8px">90°</td><td style="padding:3px 8px">1</td><td style="padding:3px 8px">0</td><td style="padding:3px 8px">∞</td></tr>
</table><br>
<strong>📌 Identities:</strong><br>
• sin²θ + cos²θ = 1<br>
• 1 + tan²θ = sec²θ<br>
• 1 + cot²θ = cosec²θ` },

  { keys:['arithmetic progression','ap ','nth term','sum of ap'],
    response:`<strong>📐 Arithmetic Progression (AP)</strong><br><br>
<strong>Definition:</strong> Sequence where consecutive terms differ by constant <em>d</em><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>nth Term:</strong> aₙ = a + (n−1)d<br>
2️⃣ <strong>Sum of n terms:</strong> Sₙ = n/2 [2a + (n−1)d]<br>
3️⃣ <strong>Sum (with last term l):</strong> Sₙ = n/2 (a + l)<br>
4️⃣ <strong>Common difference:</strong> d = a₂ − a₁<br><br>
<strong>Example:</strong> AP: 2, 5, 8, 11... → a=2, d=3<br>
• 10th term = 2 + 9×3 = <strong>29</strong><br>
• S₁₀ = 5 × (4+27) = <strong>155</strong> ✅` },

  { keys:['probability'],
    response:`<strong>🎲 Probability</strong><br><br>
<strong>Formula:</strong> P(E) = Favourable outcomes / Total outcomes<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ 0 ≤ P(E) ≤ 1 always<br>
2️⃣ P(certain event) = 1 &nbsp;|&nbsp; P(impossible) = 0<br>
3️⃣ P(E) + P(Ē) = 1<br>
4️⃣ Mutually exclusive: P(A or B) = P(A) + P(B)<br><br>
<strong>📊 Common Examples:</strong><br>
• Die: 6 outcomes → P(even) = 3/6 = <strong>1/2</strong><br>
• Cards: 52 total → P(king) = 4/52 = <strong>1/13</strong><br>
• 2 coins → P(both heads) = 1/4<br><br>
<strong>Tip:</strong> Always list sample space first!` },

  { keys:['hcf','lcm','euclid','real numbers'],
    response:`<strong>📐 Real Numbers — HCF, LCM & Euclid</strong><br><br>
<strong>Euclid's Division Lemma:</strong><br>
For a, b: &nbsp; <strong>a = bq + r</strong> &nbsp;(0 ≤ r &lt; b)<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ HCF × LCM = Product of two numbers<br>
2️⃣ To find HCF: apply Euclid's lemma until r = 0<br>
3️⃣ Fundamental Theorem: every composite = unique product of primes<br>
4️⃣ p/q is terminating ONLY when q = 2ᵃ × 5ᵇ<br>
5️⃣ √2, √3, √5 are irrational<br><br>
<strong>Example (HCF of 96 and 404):</strong><br>
404 = 96×4+20 → 96 = 20×4+16 → 20 = 16×1+4 → 16 = 4×4+0<br>
∴ <strong>HCF = 4</strong> ✅` },

  { keys:['coordinate geometry','distance formula','section formula'],
    response:`<strong>📐 Coordinate Geometry</strong><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>Distance:</strong> PQ = √[(x₂−x₁)² + (y₂−y₁)²]<br>
2️⃣ <strong>Midpoint:</strong> M = ((x₁+x₂)/2, (y₁+y₂)/2)<br>
3️⃣ <strong>Section (m:n):</strong> P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))<br>
4️⃣ <strong>Area of △:</strong> ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|<br>
5️⃣ Collinear points → Area = 0<br><br>
<strong>Example:</strong> Distance from (3,4) to (0,0):<br>
= √(9+16) = √25 = <strong>5 units</strong> ✅` },

  { keys:['statistics','mean','median','mode'],
    response:`<strong>📊 Statistics — Mean, Median, Mode</strong><br><br>
<strong>📌 Formulas:</strong><br>
1️⃣ <strong>Mean (Direct):</strong> x̄ = Σfx / Σf<br>
2️⃣ <strong>Mean (Step Deviation):</strong> x̄ = A + (Σfd/Σf), d = x − A<br>
3️⃣ <strong>Median:</strong> L + [(n/2 − cf)/f] × h<br>
4️⃣ <strong>Mode:</strong> L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h<br>
5️⃣ <strong>Empirical:</strong> Mode = 3 Median − 2 Mean<br><br>
Where L = lower boundary, cf = cumulative frequency before class, f = class freq, h = width` },

  { keys:['circles','tangent','tangent to circle'],
    response:`<strong>📐 Circles — Tangents</strong><br><br>
<strong>📌 Key Theorems:</strong><br>
1️⃣ Tangent is <strong>perpendicular</strong> to radius at point of contact<br>
2️⃣ From an external point, exactly <strong>2 tangents</strong> can be drawn<br>
3️⃣ Lengths of both tangents from external point are <strong>equal</strong><br>
4️⃣ Angle between tangent and chord = Angle in alternate segment<br><br>
<strong>Board Tip:</strong> Draw a diagram and mark the right angle between radius and tangent! 📏` },

  { keys:['polynomials','zeroes of polynomial','factor theorem'],
    response:`<strong>📐 Polynomials</strong><br><br>
<strong>📌 Relationship between zeroes (α, β) and coefficients:</strong><br>
For ax² + bx + c = 0:<br>
• Sum of zeroes: α + β = <strong>−b/a</strong><br>
• Product of zeroes: αβ = <strong>c/a</strong><br><br>
For ax³ + bx² + cx + d = 0 (cubic):<br>
• α + β + γ = −b/a<br>
• αβ + βγ + γα = c/a<br>
• αβγ = −d/a<br><br>
<strong>Factor Theorem:</strong> (x − a) is a factor of p(x) if p(a) = 0` },

  { keys:['areas related circles','sector','segment','area of circle'],
    response:`<strong>📐 Areas Related to Circles</strong><br><br>
<strong>📌 Formulas:</strong><br>
1️⃣ Area of circle: <strong>πr²</strong><br>
2️⃣ Circumference: <strong>2πr</strong><br>
3️⃣ Area of Sector: <strong>(θ/360) × πr²</strong><br>
4️⃣ Length of Arc: <strong>(θ/360) × 2πr</strong><br>
5️⃣ Area of Minor Segment: Area of sector − Area of triangle<br>
6️⃣ Area of Major Segment: Area of circle − Area of minor segment<br><br>
<strong>Remember:</strong> Use π = 22/7 unless told otherwise in CBSE!` },

  { keys:['surface area','volume','sphere','cylinder','cone','cuboid'],
    response:`<strong>📐 Surface Area & Volume</strong><br><br>
<strong>📊 Key Formulas:</strong><br><br>
<strong>Cuboid (l × b × h):</strong><br>
• TSA = 2(lb + bh + lh) &nbsp;|&nbsp; Volume = lbh<br><br>
<strong>Cylinder (r, h):</strong><br>
• CSA = 2πrh &nbsp;|&nbsp; TSA = 2πr(r+h) &nbsp;|&nbsp; V = πr²h<br><br>
<strong>Cone (r, h, l=slant):</strong><br>
• CSA = πrl &nbsp;|&nbsp; TSA = πr(r+l) &nbsp;|&nbsp; V = ⅓πr²h<br><br>
<strong>Sphere (r):</strong><br>
• SA = 4πr² &nbsp;|&nbsp; V = (4/3)πr³<br><br>
<strong>Hemisphere:</strong><br>
• CSA = 2πr² &nbsp;|&nbsp; TSA = 3πr² &nbsp;|&nbsp; V = (2/3)πr³` },

  /* ════════ SCIENCE — PHYSICS ════════ */
  { keys:["ohm's law",'ohm law','resistance','electric circuit','electricity'],
    response:`<strong>⚡ Electricity — Ohm's Law & Circuits</strong><br><br>
<strong>Ohm's Law:</strong> <em>V = IR</em><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ Current: I = Q/t &nbsp;|&nbsp; Charge: Q = ne<br>
2️⃣ Resistance: R = ρL/A (ρ = resistivity)<br>
3️⃣ <strong>Series:</strong> R_total = R₁ + R₂ + R₃ (current same)<br>
4️⃣ <strong>Parallel:</strong> 1/R = 1/R₁ + 1/R₂ + 1/R₃ (voltage same)<br>
5️⃣ Power: P = VI = I²R = V²/R<br>
6️⃣ Joule's Heating: H = I²Rt<br><br>
<strong>📊 Quick Examples:</strong><br>
• V=10V, R=5Ω → I = 2A<br>
• 1000W iron × 2 hours → Energy = 2 kWh ✅` },

  { keys:['mirror formula','lens formula','light reflection refraction','power of lens','concave','convex'],
    response:`<strong>🔭 Light — Mirrors & Lenses</strong><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>Mirror formula:</strong> 1/v + 1/u = 1/f<br>
2️⃣ <strong>Lens formula:</strong> 1/v − 1/u = 1/f<br>
3️⃣ Magnification (mirror): m = −v/u<br>
4️⃣ <strong>Power of lens:</strong> P = 1/f(metres) → unit: <strong>Dioptre (D)</strong><br><br>
<strong>📊 Mirror Types:</strong><br>
• <strong>Concave</strong> — converging, real+inverted (except within F)<br>
• <strong>Convex</strong> — diverging, always virtual+erect+diminished → rear-view mirrors<br><br>
<strong>Sign Convention:</strong> Distances from pole. Object always left (−u). Focal length: concave (−), convex (+).` },

  { keys:['myopia','hypermetropia','eye','defects of eye'],
    response:`<strong>👁️ Defects of Vision</strong><br><br>
1️⃣ <strong>Myopia (Short-sightedness):</strong><br>
&nbsp; • Cannot see DISTANT objects clearly<br>
&nbsp; • Image forms in FRONT of retina<br>
&nbsp; • Correction: <strong>Concave lens</strong><br><br>
2️⃣ <strong>Hypermetropia (Long-sightedness):</strong><br>
&nbsp; • Cannot see NEAR objects clearly<br>
&nbsp; • Image forms BEHIND retina<br>
&nbsp; • Correction: <strong>Convex lens</strong><br><br>
3️⃣ <strong>Presbyopia:</strong><br>
&nbsp; • Old age — loss of accommodation<br>
&nbsp; • Correction: <strong>Bifocal lens</strong><br><br>
<strong>Near point of normal eye = 25 cm</strong>` },

  { keys:['sky blue','scattering','tyndall effect','sunset','rainbow'],
    response:`<strong>🌈 Scattering of Light</strong><br><br>
<strong>Why sky is blue:</strong><br>
1️⃣ Shorter wavelength (blue) scatters MORE by gas molecules<br>
2️⃣ Blue light reaches eyes from all directions → sky looks BLUE<br><br>
<strong>Why sunset is red/orange:</strong><br>
1️⃣ Light travels longer path at sunrise/sunset<br>
2️⃣ Blue scattered away — only red (scatters LEAST) reaches us<br><br>
<strong>Tyndall Effect:</strong><br>
• Scattering by colloidal particles<br>
• Example: beam in smoky room, headlights in fog<br><br>
<strong>VIBGYOR:</strong> Violet, Indigo, Blue, Green, Yellow, Orange, Red<br>
<strong>Rainbow:</strong> Dispersion + Refraction + TIR in water droplets` },

  { keys:['magnetic effect','electromagnet','solenoid','motor','generator','faraday'],
    response:`<strong>🧲 Magnetic Effects of Electric Current</strong><br><br>
<strong>📌 Key Concepts:</strong><br>
1️⃣ <strong>Right-hand thumb rule:</strong> Thumb→current, Fingers→magnetic field<br>
2️⃣ <strong>Solenoid:</strong> Strong, uniform field inside (like a bar magnet)<br>
3️⃣ <strong>Electromagnet:</strong> Temporary magnet made using solenoid + iron core<br><br>
<strong>📌 Electric Motor:</strong><br>
• Converts electrical energy → mechanical energy<br>
• Works on force on current-carrying conductor in magnetic field<br>
• Uses: fans, mixers, electric vehicles<br><br>
<strong>📌 Generator (Faraday's Law):</strong><br>
• Converts mechanical energy → electrical energy<br>
• Moving magnet near coil → changing flux → induced EMF<br>
• AC generator → Fleming's right-hand rule<br><br>
<strong>Fleming's Left-hand rule:</strong> Motor (force on conductor)<br>
<strong>Fleming's Right-hand rule:</strong> Generator (induced current)` },

  /* ════════ SCIENCE — CHEMISTRY ════════ */
  { keys:['photosynthesis'],
    response:`<strong>🌱 Photosynthesis</strong><br><br>
<strong>Equation:</strong><br>
6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Occurs in <strong>chloroplasts</strong> (contains chlorophyll)<br>
2️⃣ <strong>Raw materials:</strong> CO₂ (stomata) + H₂O (roots)<br>
3️⃣ <strong>Products:</strong> Glucose + Oxygen<br>
4️⃣ Light reactions: thylakoid membranes<br>
5️⃣ Dark reactions (Calvin cycle): stroma<br><br>
<strong>Factors affecting rate:</strong> Light intensity, CO₂, Temperature, Water` },

  { keys:['acid','base','ph','neutralisation','salt'],
    response:`<strong>🧪 Acids, Bases & Salts</strong><br><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Acids</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Bases</strong><br>
• Taste: Sour &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bitter / soapy<br>
• Litmus: Blue→Red &nbsp;&nbsp; Red→Blue<br>
• pH: &lt; 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &gt; 7<br>
• Release: H⁺ ions &nbsp;&nbsp;&nbsp;&nbsp; OH⁻ ions<br><br>
<strong>📌 Important Reactions:</strong><br>
1️⃣ Neutralisation: Acid + Base → Salt + Water<br>
2️⃣ Metal + Acid → Salt + H₂ gas<br>
3️⃣ Carbonate + Acid → Salt + CO₂ + Water<br><br>
<strong>📊 Common Salts:</strong><br>
• Baking soda: NaHCO₃ &nbsp;|&nbsp; Washing soda: Na₂CO₃<br>
• Plaster of Paris: CaSO₄·½H₂O` },

  { keys:['chemical reaction','types of reaction','combination','decomposition','displacement'],
    response:`<strong>⚗️ Types of Chemical Reactions</strong><br><br>
1️⃣ <strong>Combination:</strong> A + B → AB &nbsp;(CaO + H₂O → Ca(OH)₂)<br><br>
2️⃣ <strong>Decomposition:</strong> AB → A + B &nbsp;(CaCO₃ → CaO + CO₂)<br><br>
3️⃣ <strong>Single Displacement:</strong> A + BC → AC + B &nbsp;(Fe + CuSO₄ → FeSO₄ + Cu)<br><br>
4️⃣ <strong>Double Displacement:</strong> AB + CD → AD + CB &nbsp;(NaOH + HCl → NaCl + H₂O)<br><br>
5️⃣ <strong>Oxidation:</strong> Loss of electrons / gain of oxygen<br><br>
6️⃣ <strong>Reduction:</strong> Gain of electrons / loss of oxygen<br><br>
<strong>Note:</strong> Oxidation + Reduction always together = <strong>Redox reaction</strong>` },

  { keys:['reactivity series','metals non metals','corrosion','alloy'],
    response:`<strong>⚗️ Metals & Non-Metals</strong><br><br>
<strong>Reactivity Series (High → Low):</strong><br>
<strong>K &gt; Na &gt; Ca &gt; Mg &gt; Al &gt; Zn &gt; Fe &gt; Pb &gt; H &gt; Cu &gt; Hg &gt; Ag &gt; Au</strong><br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Metals above H displace H₂ from dilute acids<br>
2️⃣ Na and K stored in <strong>kerosene</strong> (too reactive)<br>
3️⃣ Gold/Platinum don't corrode<br><br>
<strong>Properties:</strong><br>
• Metals: lustrous, malleable, ductile, conductors<br>
• Non-metals: brittle, poor conductors (except graphite)<br>
• Exception: Mercury = liquid metal; Graphite = conducts electricity<br><br>
<strong>Corrosion (Rusting):</strong><br>
4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃<br>
Prevention: painting, galvanizing, electroplating, alloying` },

  { keys:['carbon compounds','organic chemistry','alkane','alkene','hydrocarbon','ethanol'],
    response:`<strong>⚗️ Carbon & Its Compounds</strong><br><br>
<strong>📌 Why Carbon is Special:</strong><br>
1️⃣ <strong>Catenation</strong> — bonds with itself to form long chains<br>
2️⃣ Valency = 4 — forms 4 covalent bonds<br><br>
<strong>📊 Hydrocarbons:</strong><br>
• <strong>Alkanes</strong> (saturated): CₙH₂ₙ₊₂ — CH₄, C₂H₆<br>
• <strong>Alkenes</strong> (double bond): CₙH₂ₙ — C₂H₄<br>
• <strong>Alkynes</strong> (triple bond): CₙH₂ₙ₋₂ — C₂H₂<br><br>
<strong>📌 Important Compounds:</strong><br>
• <strong>Ethanol</strong> (C₂H₅OH): alcohol, fuel, medicine<br>
• <strong>Ethanoic acid</strong> (CH₃COOH): vinegar (5-8%)<br>
• <strong>Saponification:</strong> Fat + NaOH → Soap + Glycerol` },

  /* ════════ SCIENCE — BIOLOGY ════════ */
  { keys:['respiration','aerobic','anaerobic','atp','mitochondria'],
    response:`<strong>🫁 Respiration</strong><br><br>
<strong>1️⃣ Aerobic (with O₂):</strong><br>
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + <strong>38 ATP</strong><br>
• Occurs in: <strong>Mitochondria</strong><br><br>
<strong>2️⃣ Anaerobic (without O₂):</strong><br>
• In yeast: Glucose → Ethanol + CO₂ + 2 ATP<br>
• In muscles: Glucose → Lactic acid + 2 ATP<br>
• Less energy, causes muscle cramps<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Mitochondria = "powerhouse of the cell"<br>
2️⃣ ATP = Adenosine Triphosphate (energy currency)<br>
3️⃣ Breathing ≠ Respiration (breathing = physical)` },

  { keys:['nervous system','neuron','reflex action','reflex arc','brain'],
    response:`<strong>🧠 Nervous System</strong><br><br>
<strong>📌 Structure:</strong><br>
1️⃣ <strong>Neuron</strong> = structural + functional unit<br>
&nbsp; Parts: Dendrites → Cell body → Axon → Synaptic knob<br>
2️⃣ <strong>CNS</strong> = Brain + Spinal cord<br>
3️⃣ <strong>PNS</strong> = All nerves outside CNS<br><br>
<strong>📌 Reflex Arc:</strong><br>
Stimulus → Receptor → Sensory nerve → <strong>Spinal cord</strong> → Motor nerve → Effector → Response<br><br>
<strong>Brain Regions:</strong><br>
• <strong>Cerebrum:</strong> thinking, memory, consciousness<br>
• <strong>Cerebellum:</strong> balance and coordination<br>
• <strong>Medulla oblongata:</strong> breathing, heartbeat (involuntary)` },

  { keys:['mendel','heredity','genetics','dominant recessive','monohybrid','dihybrid'],
    response:`<strong>🧬 Heredity & Genetics (Mendel)</strong><br><br>
<strong>📌 Mendel's Laws:</strong><br>
1️⃣ <strong>Law of Segregation:</strong> Alleles separate during gamete formation<br>
2️⃣ <strong>Law of Independent Assortment:</strong> Genes on different chromosomes assort independently<br><br>
<strong>📊 Monohybrid Cross (Tt × Tt):</strong><br>
• Genotype ratio: 1:2:1<br>
• Phenotype ratio: <strong>3:1</strong><br><br>
<strong>📊 Dihybrid Cross (TtRr × TtRr):</strong><br>
• Phenotype ratio: <strong>9:3:3:1</strong><br><br>
<strong>Dominant = expressed with one/two copies (T)</strong><br>
<strong>Recessive = expressed only when homozygous (tt)</strong><br>
<strong>Plant used:</strong> Garden pea (Pisum sativum)` },

  { keys:['life processes','nutrition','transport','excretion','digestion'],
    response:`<strong>🌿 Life Processes</strong><br><br>
<strong>1️⃣ Nutrition:</strong> Autotrophic (plants/Photosynthesis) | Heterotrophic (animals)<br><br>
<strong>2️⃣ Respiration:</strong> C₆H₁₂O₆ + O₂ → CO₂ + H₂O + ATP<br><br>
<strong>3️⃣ Transportation (Human):</strong><br>
• Heart: 4 chambers (2 atria + 2 ventricles)<br>
• Double circulation (pulmonary + systemic)<br>
• Pulmonary vein → oxygenated blood from lungs to heart<br>
• Aorta → oxygenated blood from heart to body<br><br>
<strong>4️⃣ Excretion (Human):</strong><br>
• Kidneys filter blood → produce urine<br>
• Functional unit: <strong>Nephron</strong><br>
• Nitrogenous waste: <strong>Urea</strong>` },

  { keys:['ecosystem','food chain','10% law','environment','ozone','biodegradable'],
    response:`<strong>🌍 Our Environment</strong><br><br>
<strong>1️⃣ Food Chain:</strong><br>
Producer → Primary Consumer → Secondary Consumer → Tertiary Consumer<br><br>
<strong>2️⃣ 10% Energy Law (Lindemann):</strong><br>
• Only <strong>10%</strong> of energy passes to next trophic level<br>
• Example: 1000J → 100J → 10J → 1J<br><br>
<strong>3️⃣ Ozone Layer:</strong><br>
• Location: Stratosphere<br>
• Function: blocks harmful UV radiation<br>
• Depletion: <strong>CFCs</strong> react with O₃<br>
• Effect: skin cancer, cataracts<br><br>
<strong>4️⃣ Waste:</strong><br>
• Biodegradable: paper, food, cotton<br>
• Non-biodegradable: plastics, glass, DDT` },

  { keys:['control coordination','hormones','endocrine','plant hormones','auxin'],
    response:`<strong>🌿 Control & Coordination</strong><br><br>
<strong>📌 Plant Hormones:</strong><br>
1️⃣ <strong>Auxin:</strong> Promotes cell elongation; causes phototropism<br>
2️⃣ <strong>Gibberellin:</strong> Promotes stem elongation, seed germination<br>
3️⃣ <strong>Cytokinin:</strong> Promotes cell division<br>
4️⃣ <strong>Abscisic acid:</strong> Inhibits growth; causes wilting, dormancy<br>
5️⃣ <strong>Ethylene:</strong> Fruit ripening<br><br>
<strong>📌 Human Hormones (Endocrine):</strong><br>
• <strong>Pituitary:</strong> Growth hormone, TSH (master gland)<br>
• <strong>Thyroid:</strong> Thyroxine — regulates metabolism<br>
• <strong>Adrenal:</strong> Adrenaline — "fight or flight"<br>
• <strong>Pancreas:</strong> Insulin (lowers blood glucose) | Glucagon (raises)<br>
• <strong>Testes:</strong> Testosterone &nbsp;|&nbsp; <strong>Ovaries:</strong> Oestrogen` },

  /* ════════ HISTORY ════════ */
  { keys:['dandi march','salt march','civil disobedience','cdm'],
    response:`<strong>🇮🇳 Dandi March / Civil Disobedience Movement</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Date:</strong> 12 March – 6 April 1930<br>
2️⃣ <strong>Distance:</strong> ~380 km from Sabarmati Ashram to Dandi<br>
3️⃣ <strong>Started with:</strong> 78 volunteers<br>
4️⃣ <strong>Purpose:</strong> Protest British salt tax by making salt<br><br>
<strong>📌 Impact:</strong><br>
• Launched Civil Disobedience Movement nationwide<br>
• International attention on Indian independence<br>
• Gandhi arrested → nationwide hartals<br><br>
<strong>Timeline:</strong><br>
• 1920: Non-Cooperation (called off after Chauri Chaura 1922)<br>
• 1930: Civil Disobedience (Dandi)<br>
• 1932: Poona Pact (Gandhi + Ambedkar)<br>
• 1942: Quit India 'Do or Die'` },

  { keys:['nationalism india','jallianwala','rowlatt','non cooperation'],
    response:`<strong>🇮🇳 Nationalism in India — Timeline</strong><br><br>
1️⃣ <strong>Rowlatt Act (1919):</strong> detention without trial → mass outrage<br><br>
2️⃣ <strong>Jallianwala Bagh (13 Apr 1919):</strong><br>
&nbsp; • General Dyer fired on peaceful crowd in Amritsar<br>
&nbsp; • Hundreds killed; shocked the nation<br><br>
3️⃣ <strong>Non-Cooperation Movement (1920):</strong><br>
&nbsp; • Boycott British goods, courts, schools<br>
&nbsp; • Called off after Chauri Chaura violence (1922)<br><br>
4️⃣ <strong>Dandi March (1930)</strong><br>
5️⃣ <strong>Quit India (1942):</strong> 'Do or Die'<br>
6️⃣ <strong>Independence: 15 August 1947</strong><br><br>
<strong>Leaders:</strong> Gandhi, Nehru, Ambedkar, Subhas Bose, Sardar Patel` },

  { keys:['nationalism europe','french revolution','zollverein','romanticism','bismarck'],
    response:`<strong>🏛️ Rise of Nationalism in Europe</strong><br><br>
1️⃣ <strong>French Revolution (1789):</strong> liberty, equality, fraternity<br>
2️⃣ <strong>Napoleon (1799–1815):</strong> spread revolutionary ideas via conquests<br>
3️⃣ <strong>Romanticism:</strong> folk tales, music, language for national identity<br>
4️⃣ <strong>Zollverein (1834):</strong> German customs union<br>
5️⃣ <strong>1830:</strong> Greece gained independence<br>
6️⃣ <strong>1848 (Spring of Nations):</strong> Revolutions across Europe<br>
7️⃣ <strong>Unification of Germany (1866–71):</strong> Bismarck — "Blood and Iron"<br>
8️⃣ <strong>Italy:</strong> Mazzini (Young Italy), Garibaldi (military), Cavour (politics)<br><br>
<strong>Quote:</strong> Metternich — "When France sneezes, Europe catches cold"` },

  { keys:['world war','ww1','ww2','cold war','hiroshima'],
    response:`<strong>🌍 World Wars — Key Facts</strong><br><br>
<strong>World War I (1914–1918):</strong><br>
• Trigger: Assassination of Archduke Franz Ferdinand<br>
• Alliances: Allied (UK, France, Russia, USA) vs Central (Germany, Austria, Ottoman)<br>
• End: Treaty of Versailles (1919)<br>
• Impact: League of Nations formed<br><br>
<strong>World War II (1939–1945):</strong><br>
• Trigger: Germany invades Poland<br>
• Alliances: Allies (UK, USA, USSR) vs Axis (Germany, Italy, Japan)<br>
• Holocaust: 6 million Jews killed by Hitler<br>
• Hiroshima (6 Aug 1945) + Nagasaki (9 Aug 1945) — atomic bombs<br>
• End: 2 September 1945 (Japan surrenders)<br>
• Impact: UN formed; Cold War begins<br><br>
<strong>Cold War (1947–1991):</strong> USA vs USSR — no direct combat but ideological conflict` },

  /* ════════ GEOGRAPHY ════════ */
  { keys:['soil types','alluvial soil','black soil','laterite'],
    response:`<strong>🌱 Soil Types in India</strong><br><br>
1️⃣ <strong>Alluvial Soil:</strong> Most widespread — Indo-Gangetic plains; Crops: Rice, wheat, sugarcane<br><br>
2️⃣ <strong>Black Soil (Regur):</strong> Deccan Plateau; Retains moisture; Best for: <strong>COTTON</strong><br><br>
3️⃣ <strong>Red & Yellow Soil:</strong> Odisha, TN, Andhra; From crystalline rocks<br><br>
4️⃣ <strong>Laterite Soil:</strong> Karnataka, Kerala; Formed by leaching; Tea, coffee, cashews<br><br>
5️⃣ <strong>Arid (Desert) Soil:</strong> Rajasthan; Sandy, low humus<br><br>
6️⃣ <strong>Forest Soil:</strong> Himalayan slopes; Humus-rich<br><br>
<strong>Memory trick:</strong> "ABRLAF" — Alluvial, Black, Red, Laterite, Arid, Forest` },

  { keys:['agriculture','kharif','rabi','green revolution','crop','farming'],
    response:`<strong>🌾 Agriculture in India</strong><br><br>
<strong>📌 Crop Seasons:</strong><br>
1️⃣ <strong>Kharif (June–Sept):</strong> Rice, Maize, Cotton, Jute, Bajra<br>
2️⃣ <strong>Rabi (Oct–March):</strong> Wheat, Barley, Mustard, Peas, Gram<br>
3️⃣ <strong>Zaid (March–June):</strong> Watermelon, Cucumber, Fodder<br><br>
<strong>📌 Green Revolution (1960s):</strong><br>
• HYV seeds + fertilizers + irrigation<br>
• Mainly: <strong>Wheat and Rice</strong><br>
• Pioneer: <strong>M.S. Swaminathan</strong><br>
• States: Punjab, Haryana, western UP<br><br>
<strong>India:</strong> Largest producer of pulses; 2nd in rice & wheat` },

  { keys:['minerals','resources','coal','petroleum','natural resources','energy'],
    response:`<strong>⛏️ Minerals & Energy Resources</strong><br><br>
<strong>📌 Types of Minerals:</strong><br>
1️⃣ <strong>Metallic:</strong> Iron ore (Jharkhand), Copper (Rajasthan), Bauxite (Odisha)<br>
2️⃣ <strong>Non-metallic:</strong> Mica (Jharkhand), Limestone, Gypsum<br>
3️⃣ <strong>Fuel:</strong> Coal, Petroleum, Natural gas<br><br>
<strong>📌 Energy Sources:</strong><br>
• <strong>Conventional:</strong> Coal, petroleum, natural gas (non-renewable, cause pollution)<br>
• <strong>Non-conventional:</strong> Solar, wind, hydro, geothermal, tidal (renewable, clean)<br><br>
<strong>Coal Types (quality):</strong> Anthracite &gt; Bituminous &gt; Lignite &gt; Peat<br>
<strong>Largest coal deposits:</strong> Jharia (Jharkhand)` },

  { keys:['rivers','drainage','himalayan rivers','peninsular rivers','ganga'],
    response:`<strong>🌊 Rivers of India</strong><br><br>
<strong>📌 Types of Rivers:</strong><br>
<strong>Himalayan Rivers (perennial):</strong><br>
• Ganga, Yamuna, Brahmaputra, Sutlej, Beas<br>
• Fed by glaciers AND rainfall<br>
• Form delta (Sundarbans)<br><br>
<strong>Peninsular Rivers (seasonal):</strong><br>
• <strong>West-flowing:</strong> Narmada, Tapi (form estuaries)<br>
• <strong>East-flowing:</strong> Godavari (longest), Krishna, Kaveri, Mahanadi<br>
• Fed by rainfall only<br><br>
<strong>📌 Key Facts:</strong><br>
• Longest river: Ganga &nbsp;|&nbsp; Largest river basin: Ganga basin<br>
• Sacred river: Ganga &nbsp;|&nbsp; Lifeline of India: Ganga<br>
• Brahmaputra is called Tsangpo in Tibet, Jamuna in Bangladesh` },

  /* ════════ ECONOMICS ════════ */
  { keys:['gdp','development','per capita','hdi','human development'],
    response:`<strong>💰 Development & Economy</strong><br><br>
1️⃣ <strong>Per Capita Income = National Income / Population</strong><br>
&nbsp; Limitation: doesn't show distribution of income<br><br>
2️⃣ <strong>GDP:</strong> Total value of goods & services produced in a country in one year<br><br>
3️⃣ <strong>HDI (Human Development Index):</strong><br>
&nbsp; Published by: <strong>UNDP</strong> annually<br>
&nbsp; Combines: Per capita income + Life expectancy + Education<br><br>
4️⃣ <strong>LPG Reforms (1991):</strong><br>
&nbsp; <strong>L</strong>iberalisation + <strong>P</strong>rivatisation + <strong>G</strong>lobalisation<br>
&nbsp; PM Narasimha Rao; Finance Minister Manmohan Singh<br><br>
<strong>Key:</strong> Punjab higher income, Kerala better HDI → HDI is more meaningful` },

  { keys:['globalisation','mnc','wto','liberalisation','foreign trade'],
    response:`<strong>🌐 Globalisation & the Indian Economy</strong><br><br>
1️⃣ <strong>Globalisation:</strong> Integration of countries through trade & FDI<br><br>
2️⃣ <strong>MNC:</strong> Company with production in 2+ countries<br>
&nbsp; Examples: Samsung, Apple, Unilever, Nestlé<br><br>
3️⃣ <strong>WTO:</strong><br>
&nbsp; • Established: 1995<br>
&nbsp; • Purpose: promote free and fair international trade<br><br>
4️⃣ <strong>FDI</strong> = Foreign Direct Investment<br><br>
5️⃣ <strong>India's LPG Reforms (1991):</strong><br>
&nbsp; • Removed import restrictions, reduced duties<br>
&nbsp; • Allowed foreign companies to invest<br><br>
<strong>Impact:</strong> IT boom, jobs BUT small industries face MNC competition` },

  { keys:['money credit','formal informal','rbi','shg','self help','bank','banking'],
    response:`<strong>🏦 Money & Credit</strong><br><br>
1️⃣ <strong>Barter Problem:</strong> Double coincidence of wants — solved by money<br><br>
2️⃣ <strong>Formal Credit (RBI regulated):</strong><br>
&nbsp; Banks, cooperative societies<br>
&nbsp; Lower interest, legal protection, requires collateral<br><br>
3️⃣ <strong>Informal Credit (Unregulated):</strong><br>
&nbsp; Moneylenders, traders, relatives<br>
&nbsp; Very high interest → debt trap<br><br>
4️⃣ <strong>SHG (Self Help Group):</strong><br>
&nbsp; 15–20 rural women pool savings<br>
&nbsp; Give loans at low interest → empowers women<br><br>
<strong>RBI = Reserve Bank of India</strong> → regulates all formal credit in India` },

  /* ════════ CIVICS ════════ */
  { keys:['power sharing','belgium','sri lanka','majoritarianism','federalism'],
    response:`<strong>⚖️ Power Sharing</strong><br><br>
<strong>1️⃣ Belgium (Success):</strong><br>
&nbsp; Dutch 59% + French 40% + German 1%<br>
&nbsp; Federal system + equal representation → no civil war ✅<br><br>
<strong>2️⃣ Sri Lanka (Failure):</strong><br>
&nbsp; Sinhala Only Act (1956) → Tamils alienated → civil war ❌<br><br>
<strong>📌 Forms of Power Sharing:</strong><br>
1️⃣ Horizontal: Among organs (legislature, executive, judiciary)<br>
2️⃣ Vertical: Federal → State → Local government<br>
3️⃣ Among political parties (coalition)<br>
4️⃣ Among social groups (reservations, representation)<br><br>
<strong>Lesson:</strong> Belgium shows sharing PREVENTS conflict; Sri Lanka shows ignoring minorities causes conflict` },

  { keys:['democracy','political parties','election','constitution'],
    response:`<strong>🗳️ Democracy & Political Parties</strong><br><br>
<strong>📌 Features of Democracy:</strong><br>
1️⃣ Free and fair elections<br>
2️⃣ Rule of law (constitution)<br>
3️⃣ Protection of fundamental rights<br>
4️⃣ Multi-party system<br>
5️⃣ Independent judiciary<br><br>
<strong>📌 Functions of Political Parties:</strong><br>
1️⃣ Contest elections and form government<br>
2️⃣ Make laws<br>
3️⃣ Play opposition role<br>
4️⃣ Shape public opinion<br>
5️⃣ Provide welfare schemes<br><br>
<strong>Types:</strong> National parties (BJP, Congress, BSP) | State parties (TRS, SP, TMC)<br>
<strong>India has:</strong> Multi-party system with federal structure` },

  /* ════════ ENGLISH LITERATURE ════════ */
  { keys:['lencho','letter to god'],
    response:`<strong>📖 A Letter to God</strong><br><br>
<strong>Author:</strong> G.L. Fuentes (Mexican; originally in Spanish)<br><br>
<strong>📌 Plot:</strong><br>
1️⃣ Lencho's crops destroyed by hailstorm before harvest<br>
2️⃣ He writes to God asking for 100 pesos<br>
3️⃣ Post office staff moved by faith → collect 70 pesos<br>
4️⃣ Lencho counts only 70 pesos → calls them <em>"crooks"</em><br>
5️⃣ <strong>Irony:</strong> Helpers called thieves!<br><br>
<strong>📌 Themes:</strong><br>
• Unshakeable faith in God<br>
• Dramatic irony<br>
• Human ingratitude<br><br>
<strong>Board Q:</strong> Why did Lencho call helpers crooks? → He believed God sent 100 pesos but received only 70.` },

  { keys:['nelson mandela','apartheid','long walk to freedom'],
    response:`<strong>📖 Nelson Mandela: Long Walk to Freedom</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ Mandela's inauguration as first black President of South Africa<br>
2️⃣ <strong>Date:</strong> 10 May 1994<br>
3️⃣ <strong>Prison:</strong> 27 years on Robben Island (1964–1990)<br>
4️⃣ <strong>Apartheid:</strong> Racial segregation system (1948–1994)<br><br>
<strong>📌 Key Ideas:</strong><br>
1️⃣ Both oppressor and oppressed are robbed of humanity<br>
2️⃣ Mandela had two obligations: family and his people<br>
3️⃣ Courage = overcoming fear, not absence of it<br>
4️⃣ "A man who takes away another's freedom is a prisoner of hatred"<br><br>
<strong>ANC</strong> = African National Congress (Mandela's party)` },

  { keys:['anne frank','diary of anne'],
    response:`<strong>📖 From the Diary of Anne Frank</strong><br><br>
1️⃣ <strong>Who:</strong> Anne Frank — Jewish girl hiding from Nazis in Amsterdam<br>
2️⃣ <strong>Diary name:</strong> "Kitty" — her best friend<br>
3️⃣ <strong>Period:</strong> June 1942 – August 1944<br>
4️⃣ <strong>Fate:</strong> Captured, died in Bergen-Belsen camp, 1945 (age 15)<br><br>
<strong>📌 Key Ideas:</strong><br>
• Paper has more patience than people (famous quote)<br>
• Anne feels she has no true friend<br>
• Funny relationship with Mr. Keesing (teacher)<br>
• Power of writing during dark times<br><br>
<strong>Themes:</strong> Loneliness, Resilience, Friendship, War's impact on children` },

  { keys:['footprints without feet','griffin','invisible man'],
    response:`<strong>📖 Footprints Without Feet — H.G. Wells</strong><br><br>
1️⃣ Griffin discovers how to make body transparent<br>
2️⃣ Sets fire to landlord's house → homeless wanderer<br>
3️⃣ Steals from theatrical company for clothes<br>
4️⃣ Arrives at Iping village → stays at Mrs. Hall's inn<br>
5️⃣ Covered in bandages to hide invisibility<br>
6️⃣ Unwrapped in public → people horrified<br>
7️⃣ Runs off invisible again<br><br>
<strong>Central Theme:</strong><br>
• Science without ethics = dangerous<br>
• Power without responsibility → misuse` },

  { keys:['necklace','matilda','maupassant','the necklace'],
    response:`<strong>📖 The Necklace — Guy de Maupassant</strong><br><br>
1️⃣ Matilda Loisel — obsessed with wealth she doesn't have<br>
2️⃣ Borrows diamond necklace from friend Madame Forestier<br>
3️⃣ <strong>Loses the necklace</strong> after a party<br>
4️⃣ Too proud to tell → buys replacement for <strong>36,000 francs</strong><br>
5️⃣ They work 10 years in poverty to repay<br>
6️⃣ <strong>TWIST:</strong> Forestier reveals necklace was FAKE — worth only 500 francs!<br><br>
<strong>📌 Themes:</strong><br>
• Vanity and pride lead to downfall<br>
• Irony of fate<br>
• Deception and consequences` },

  /* ════════ GENERAL SCIENCE (beyond Class 10) ════════ */
  { keys:['atom','atomic structure','proton','neutron','electron','nucleus'],
    response:`<strong>⚛️ Atomic Structure</strong><br><br>
<strong>Subatomic Particles:</strong><br>
• <strong>Proton:</strong> +1 charge, in nucleus, mass = 1u<br>
• <strong>Neutron:</strong> 0 charge, in nucleus, mass = 1u<br>
• <strong>Electron:</strong> −1 charge, orbits nucleus, mass ≈ 0<br><br>
<strong>📌 Key Concepts:</strong><br>
• Atomic number (Z) = number of protons<br>
• Mass number (A) = protons + neutrons<br>
• Isotopes = same Z, different A (e.g., C-12 and C-14)<br>
• Bohr's Model: Electrons in fixed energy orbits<br>
• K shell: max 2 electrons; L: 8; M: 18<br><br>
<strong>Valence electrons</strong> = electrons in outermost shell (determine reactivity)` },

  { keys:['cell','cell biology','mitosis','meiosis','dna'],
    response:`<strong>🔬 Cell Biology</strong><br><br>
<strong>📌 Cell Types:</strong><br>
• <strong>Prokaryotic:</strong> No nucleus (bacteria)<br>
• <strong>Eukaryotic:</strong> Has nucleus (plants, animals, fungi)<br><br>
<strong>📌 Important Organelles:</strong><br>
• Nucleus: control centre, contains DNA<br>
• Mitochondria: energy (ATP) production<br>
• Chloroplast: photosynthesis (plants only)<br>
• Ribosome: protein synthesis<br>
• Cell membrane: controls what enters/exits<br><br>
<strong>📌 Cell Division:</strong><br>
• <strong>Mitosis:</strong> 2 identical daughter cells (growth, repair)<br>
• <strong>Meiosis:</strong> 4 cells with half chromosomes (reproduction)<br><br>
<strong>DNA:</strong> Double helix; made of nucleotides (A-T, G-C pairs)` },

  /* ════════ MATHEMATICS (General) ════════ */
  { keys:['percentage','percentage calculation','discount','profit loss'],
    response:`<strong>📊 Percentage, Profit & Loss</strong><br><br>
<strong>📌 Key Formulas:</strong><br>
• Percentage = (Part / Whole) × 100<br>
• % Increase = (Increase / Original) × 100<br>
• Profit = SP − CP &nbsp;|&nbsp; Loss = CP − SP<br>
• Profit% = (Profit / CP) × 100<br>
• SP = CP × (100 + P%) / 100<br>
• Discount = MP − SP &nbsp;|&nbsp; Discount% = (Discount/MP) × 100<br><br>
<strong>Example:</strong><br>
CP = ₹500, Profit = 20% → SP = 500 × 120/100 = <strong>₹600</strong><br>
MP = ₹800, Discount = 10% → SP = 800 × 90/100 = <strong>₹720</strong>` },

  { keys:['simple interest','compound interest','si','ci'],
    response:`<strong>💰 Simple & Compound Interest</strong><br><br>
<strong>📌 Formulas:</strong><br>
• <strong>Simple Interest:</strong> SI = P × R × T / 100<br>
• <strong>Amount (SI):</strong> A = P + SI<br><br>
• <strong>Compound Interest:</strong> A = P(1 + R/100)ⁿ<br>
• <strong>CI:</strong> A − P<br><br>
<strong>📌 Example:</strong><br>
P = ₹10,000, R = 10%, T = 2 years<br>
• SI = 10000 × 10 × 2/100 = <strong>₹2,000</strong><br>
• CI: A = 10000 × (1.1)² = 12100 → CI = <strong>₹2,100</strong><br><br>
<strong>CI > SI</strong> always (for same P, R, T &gt; 1 year)` },

  /* ════════ GENERAL KNOWLEDGE ════════ */
  { keys:['capital of india','capitals of countries','country capital'],
    response:`<strong>🌍 World Capitals — Key Ones</strong><br><br>
<strong>South Asia:</strong><br>
• India → New Delhi &nbsp;|&nbsp; Pakistan → Islamabad<br>
• Bangladesh → Dhaka &nbsp;|&nbsp; Nepal → Kathmandu<br>
• Sri Lanka → Sri Jayawardenepura Kotte (legislative) / Colombo<br><br>
<strong>Major Countries:</strong><br>
• USA → Washington D.C. &nbsp;|&nbsp; UK → London<br>
• China → Beijing &nbsp;|&nbsp; Japan → Tokyo<br>
• France → Paris &nbsp;|&nbsp; Germany → Berlin<br>
• Russia → Moscow &nbsp;|&nbsp; Australia → Canberra<br>
• Brazil → Brasília &nbsp;|&nbsp; Canada → Ottawa<br><br>
<strong>India's largest city:</strong> Mumbai | Capital: New Delhi | Financial capital: Mumbai` },

  { keys:['planets','solar system','milky way','universe','space','astronomy'],
    response:`<strong>🪐 Solar System & Space</strong><br><br>
<strong>📌 8 Planets (order from Sun):</strong><br>
<strong>My Very Educated Mother Just Served Us Noodles</strong><br>
Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune<br><br>
<strong>📌 Key Facts:</strong><br>
• Largest planet: <strong>Jupiter</strong><br>
• Smallest planet: <strong>Mercury</strong><br>
• Closest to Sun: Mercury &nbsp;|&nbsp; Farthest: Neptune<br>
• Only planet with life: Earth<br>
• Hottest planet: <strong>Venus</strong> (greenhouse effect; not Mercury!)<br>
• Planet with rings: Saturn (most prominent)<br>
• Earth's moon: only natural satellite<br><br>
<strong>Light year</strong> = distance light travels in 1 year ≈ 9.46 trillion km<br>
<strong>Milky Way</strong> = our galaxy (spiral); 100,000 light-years across` },

  { keys:['india','constitution of india','fundamental rights','directive principles'],
    response:`<strong>🇮🇳 Indian Constitution & Fundamental Rights</strong><br><br>
<strong>📌 Key Facts:</strong><br>
• Adopted: 26 November 1949 | Enacted: 26 January 1950<br>
• Longest written constitution in the world<br>
• Father of Constitution: <strong>Dr. B.R. Ambedkar</strong><br><br>
<strong>📌 Six Fundamental Rights (Part III):</strong><br>
1️⃣ Right to Equality (Articles 14–18)<br>
2️⃣ Right to Freedom (Articles 19–22)<br>
3️⃣ Right Against Exploitation (Articles 23–24)<br>
4️⃣ Right to Freedom of Religion (Articles 25–28)<br>
5️⃣ Cultural and Educational Rights (Articles 29–30)<br>
6️⃣ Right to Constitutional Remedies (Article 32) — "Heart & Soul": Ambedkar<br><br>
<strong>Directive Principles (Part IV):</strong> Not enforceable in court but guide state policy<br>
<strong>Fundamental Duties (Part IV-A):</strong> Added by 42nd Amendment, 1976` },

  /* ════════ GENERAL Q&A ════════ */
  { keys:['hi','hello','hey','hii','helo','namaste','good morning','good evening'],
    response:`👋 <strong>Hello! I'm Owlix</strong> — your AI Study Assistant!<br><br>
I can answer questions on <strong>ANY topic</strong> — from CBSE Class 10 to general knowledge, science, history, maths, and more!<br><br>
<strong>📚 What I cover:</strong><br>
• 📐 Maths formulas and problem-solving<br>
• 🔬 Science — Physics, Chemistry, Biology<br>
• 📖 English stories, grammar<br>
• 🌍 Social Science — History, Geography, Civics<br>
• 💡 General Knowledge and current topics<br><br>
Just ask your question — I'll explain it step by step! 🦉` },

  { keys:['who are you','what are you','owlix','about you'],
    response:`🦉 <strong>I'm Owlix</strong> — AbiLearn's AI Study Assistant!<br><br>
<strong>What I can do:</strong><br>
1️⃣ Explain any concept in simple, point-by-point format<br>
2️⃣ Give formulas with examples instantly<br>
3️⃣ Answer questions beyond just CBSE Class 10<br>
4️⃣ Cover general science, maths, history, geography, GK<br>
5️⃣ Help with board exam strategy and study tips<br><br>
<strong>Powered by:</strong> Local knowledge base + Claude AI<br><br>
I'm available 24/7 — ask me anything! 💪` },

  { keys:['board exam','exam tips','how to study','score 90','cbse tips','study tips','study strategy'],
    response:`<strong>🎯 Board Exam Tips — Score 90+ in CBSE Class 10</strong><br><br>
<strong>📌 Study Strategy:</strong><br>
1️⃣ <strong>NCERT First:</strong> 80% of CBSE questions come from NCERT<br>
2️⃣ <strong>PYQs:</strong> Solve last 5 years' papers in exam conditions<br>
3️⃣ <strong>Formula Sheets:</strong> Make your own for Maths & Science<br>
4️⃣ <strong>Write, Don't Just Read:</strong> Writing activates memory<br>
5️⃣ <strong>Spaced Repetition:</strong> Revise after 1 → 3 → 7 → 21 days<br><br>
<strong>📌 Subject-wise Tips:</strong><br>
• <strong>Maths:</strong> Practice 10 numericals daily per chapter<br>
• <strong>Science:</strong> Draw diagrams for every topic<br>
• <strong>English:</strong> Read passage twice before answering<br>
• <strong>Social:</strong> Timeline charts for history; maps for geography<br><br>
<strong>Night before:</strong> Sleep 8 hours. Don't cram. Read questions carefully. 💪` },

  { keys:['formula','formulas','all formulas','important formulas'],
    response:`<strong>📐 Quick Formula Reference</strong><br><br>
<strong>MATHS:</strong><br>
• Quadratic: x = [−b ± √(b²−4ac)] / 2a<br>
• AP nth term: aₙ = a + (n−1)d &nbsp;|&nbsp; Sum: Sₙ = n/2[2a+(n−1)d]<br>
• Distance: √[(x₂−x₁)²+(y₂−y₁)²]<br>
• Probability: P(E) = n(E)/n(S)<br>
• Circle sector: Area = (θ/360)πr²<br><br>
<strong>PHYSICS:</strong><br>
• Ohm's Law: V = IR &nbsp;|&nbsp; Power: P = VI = I²R<br>
• Mirror/Lens: 1/v ± 1/u = 1/f<br>
• Power of lens: P = 1/f(m) in Dioptres<br><br>
<strong>CHEMISTRY:</strong><br>
• Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂<br>
• Respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP<br><br>
Ask about any specific topic for detailed explanation! 🦉` }
];

/* ════════ OWLIX BRAIN ════════ */
function owlixThink(message) {
  const msg = message.toLowerCase().trim();
  if (!msg) return null;
  for (const entry of OWLIX_KB) {
    if (entry.keys.some(k => msg.includes(k))) return entry.response;
  }
  return null;
}

function escOwlix(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ════════ CLAUDE API INTEGRATION ════════ */
const OWLIX_SYSTEM_PROMPT = `You are Owlix, a brilliant AI tutor on AbiLearn, an educational platform for CBSE Class 10 students in India. You can answer ANY question asked by students — from CBSE curriculum topics to general science, history, maths, current events, and beyond.

Rules:
1. Always respond in clear, well-structured HTML using <strong> for key terms, <br> for line breaks, numbered lists with 1️⃣ 2️⃣ 3️⃣, and bullet points with •
2. Use relevant emojis as section headers (📐 for maths, 🔬 for science, 📖 for English, 🌍 for social, ⚡ for physics, ⚗️ for chemistry, 🧬 for biology, 💡 for general)
3. Be concise but complete — aim for 150-300 words
4. For CBSE topics, always mention board exam tips where relevant
5. For maths/science, always show the formula first, then an example
6. Structure responses like a great teacher would explain to a 10th grade student
7. Always end with a practical tip, memory trick, or encouragement if space allows
8. Do not use markdown (no # headers, no ** bold — use <strong> instead)
9. Format tables using HTML table tags with inline styles when needed`;

async function owlixAI(message) {
  const key = sessionStorage.getItem('owlix_api_key') || '';
  if (!key) return null;

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
        system: OWLIX_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: message }]
      })
    });
    if (!res.ok) {
      if (res.status === 401) sessionStorage.removeItem('owlix_api_key');
      return null;
    }
    const data = await res.json();
    return data?.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

/* ════════ QUICK REPLIES ════════ */
const QR = [
  "What is Ohm's Law?",
  "Photosynthesis equation",
  "Dandi March facts",
  "Quadratic formula",
  "Board exam tips"
];

/* ════════ OWLIX UI ════════ */
function initOwlix() {
  const toggle  = document.getElementById('owlixToggle');
  const win     = document.getElementById('owlixWindow');
  const close   = document.getElementById('owlixClose');
  const input   = document.getElementById('owlixInput');
  const send    = document.getElementById('owlixSend');
  const qrWrap  = document.getElementById('quickReplies');

  if (!toggle || !win) return;

  if (qrWrap) {
    qrWrap.innerHTML = QR.map(r =>
      `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(r)})">${r}</button>`
    ).join('');
  }

  // Add settings button to Owlix header
  const header = win.querySelector('.owlix-header');
  if (header && !header.querySelector('.owlix-settings-btn')) {
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'owlix-settings-btn';
    settingsBtn.title = 'AI Settings';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:1rem;padding:0.3rem;border-radius:6px;margin-right:0.25rem;opacity:0.7;transition:opacity 0.2s';
    settingsBtn.onmouseenter = () => settingsBtn.style.opacity = '1';
    settingsBtn.onmouseleave = () => settingsBtn.style.opacity = '0.7';
    settingsBtn.onclick = () => toggleApiKeyPanel(win);
    const closeBtn = header.querySelector('.owlix-close');
    if (closeBtn) header.insertBefore(settingsBtn, closeBtn);
  }

  setTimeout(() => {
    const hasKey = !!sessionStorage.getItem('owlix_api_key');
    addOwlixMsg('bot', `👋 <strong>Hi! I'm Owlix</strong> — your AI study buddy!<br><br>
I can now answer <strong>ANY question</strong> — not just CBSE Class 10.<br><br>
${hasKey ? '✅ <strong>Claude AI is connected.</strong> I can handle complex questions too!' : '💡 <em>Tip: Click ⚙️ to connect Claude AI for even smarter answers!</em>'}<br><br>
What would you like to know today? 🎯`);
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
  const currentKey = sessionStorage.getItem('owlix_api_key') || '';
  const masked = currentKey ? '•'.repeat(Math.min(currentKey.length, 20)) + ' ✅' : '';
  panel.innerHTML = `
    <div style="background:rgba(91,33,182,0.08);border:1px solid rgba(124,58,237,0.2);border-radius:12px;padding:1rem;margin:0.5rem 0.75rem;font-size:0.82rem">
      <div style="font-weight:700;margin-bottom:0.5rem;color:#5B21B6">⚙️ Claude AI Connection</div>
      <div style="color:#6B7280;margin-bottom:0.6rem;line-height:1.4">Enter your Anthropic API key to unlock unlimited AI answers for <strong>any question</strong>.</div>
      <input type="password" id="owlixApiKeyInput" placeholder="sk-ant-..." value="${currentKey}"
        style="width:100%;padding:0.45rem 0.7rem;border:1px solid #D1D5DB;border-radius:8px;font-size:0.8rem;outline:none;font-family:inherit;margin-bottom:0.5rem">
      ${masked ? `<div style="color:#10B981;font-size:0.75rem;margin-bottom:0.5rem">Current: ${masked}</div>` : ''}
      <div style="display:flex;gap:0.5rem">
        <button onclick="saveOwlixKey()" style="flex:1;background:#7C3AED;color:white;border:none;padding:0.4rem;border-radius:8px;cursor:pointer;font-size:0.8rem;font-weight:600">Save Key</button>
        <button onclick="clearOwlixKey()" style="background:none;border:1px solid #D1D5DB;color:#6B7280;padding:0.4rem 0.6rem;border-radius:8px;cursor:pointer;font-size:0.8rem">Clear</button>
      </div>
      <div style="color:#9CA3AF;font-size:0.72rem;margin-top:0.5rem">Key stored in session only. <a href="https://console.anthropic.com" target="_blank" style="color:#7C3AED">Get a key →</a></div>
    </div>`;

  const messagesEl = win.querySelector('.owlix-messages');
  if (messagesEl) messagesEl.after(panel);
}

function saveOwlixKey() {
  const input = document.getElementById('owlixApiKeyInput');
  if (!input) return;
  const key = input.value.trim();
  if (key) {
    sessionStorage.setItem('owlix_api_key', key);
    addOwlixMsg('bot', '✅ <strong>Claude AI connected!</strong> I can now answer any question — even ones outside my built-in knowledge base. Ask me anything! 🦉');
  }
  const panel = document.querySelector('.owlix-api-panel');
  if (panel) panel.remove();
}

function clearOwlixKey() {
  sessionStorage.removeItem('owlix_api_key');
  const panel = document.querySelector('.owlix-api-panel');
  if (panel) panel.remove();
  addOwlixMsg('bot', '🔑 API key cleared. I\'ll use my built-in knowledge base. For unlimited AI answers, reconnect via ⚙️.');
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
  addOwlixMsg('user', escOwlix(text));

  // Open chatbot if closed
  const win = document.getElementById('owlixWindow');
  if (win && !win.classList.contains('open')) win.classList.add('open');

  // Try local KB first (instant)
  const localResponse = owlixThink(text);
  if (localResponse) {
    showTyping();
    await delay(600 + Math.random() * 400);
    hideTyping();
    addOwlixMsg('bot', localResponse);
    return;
  }

  // No local match — try Claude API
  showTyping();
  const aiResponse = await owlixAI(text);
  hideTyping();

  if (aiResponse) {
    addOwlixMsg('bot', aiResponse);
  } else {
    // Friendly fallback
    const hasKey = !!sessionStorage.getItem('owlix_api_key');
    addOwlixMsg('bot', `🤔 <strong>Let me help with that!</strong><br><br>
I don't have a built-in answer for <em>"${escOwlix(text.slice(0,60))}${text.length>60?'...':''}"</em>, but I'm eager to assist!<br><br>
${!hasKey ? '💡 <strong>Tip:</strong> Click ⚙️ above to connect Claude AI and I\'ll be able to answer <em>any</em> question instantly!<br><br>' : ''}
<strong>Topics I know well:</strong><br>
• 📐 <strong>Maths:</strong> Quadratic formula, AP, Pythagoras, Probability, Trigonometry<br>
• 🔬 <strong>Science:</strong> Ohm's Law, Lenses, Photosynthesis, Mendel, Periodic Table<br>
• 🌍 <strong>Social:</strong> Dandi March, French Revolution, Soil Types, GDP<br>
• 📖 <strong>English:</strong> Letter to God, Mandela, Footprints, Anne Frank<br>
• 💡 <strong>General:</strong> Solar System, Constitution, World Capitals<br><br>
Try rephrasing your question or ask about a specific topic! 🦉`);
  }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function addOwlixMsg(type, html) {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  const av = type === 'bot' ? '🦉' : '👤';
  div.innerHTML = `
    <div class="msg-av">${av}</div>
    <div>
      <div class="msg-bbl">${html}</div>
      <div class="msg-time">${now}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('owlixMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'owlix-typing';
  div.innerHTML = `<div class="msg-av">🦉</div><div class="typing-bbl"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById('owlix-typing');
  if (el) el.remove();
}

document.addEventListener('DOMContentLoaded', initOwlix);
