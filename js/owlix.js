/* Owlix AI — AbiLearn Study Chatbot v2
   Point-by-point formatted responses */

const OWLIX_KB = [

  /* ════════ MATHS ════════ */
  { keys:['quadratic formula','sridharacharya','quadratic equation'],
    response:`<strong>📐 Quadratic Formula (Sridharacharya's Formula)</strong><br><br>
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
3️⃣ Formula: AC² = AB² + BC² (where AC is hypotenuse)<br>
4️⃣ Converse: if a² + b² = c², triangle is right-angled<br><br>
<strong>Common Pythagorean Triplets:</strong><br>
• 3, 4, 5 &nbsp;|&nbsp; 5, 12, 13 &nbsp;|&nbsp; 8, 15, 17<br>
• 7, 24, 25 &nbsp;|&nbsp; 6, 8, 10 (multiples of 3-4-5)<br><br>
<strong>Example:</strong> AB = 3, BC = 4 → AC = √(9+16) = √25 = <strong>5</strong> ✅` },

  { keys:['trigonometry','sin cos tan','trig values','trig table','trigonometric'],
    response:`<strong>📐 Trigonometry — Class 10</strong><br><br>
<strong>Basic Ratios (for right triangle):</strong><br>
• sin θ = Perpendicular / Hypotenuse<br>
• cos θ = Base / Hypotenuse<br>
• tan θ = Perpendicular / Base<br>
• cosec θ = 1/sin θ &nbsp;|&nbsp; sec θ = 1/cos θ &nbsp;|&nbsp; cot θ = 1/tan θ<br><br>
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
<strong>Definition:</strong> A sequence where consecutive terms differ by a constant <em>d</em><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>nth Term:</strong> aₙ = a + (n−1)d<br>
2️⃣ <strong>Sum of n terms:</strong> Sₙ = n/2 [2a + (n−1)d]<br>
3️⃣ <strong>Sum (when last term l known):</strong> Sₙ = n/2 (a + l)<br>
4️⃣ <strong>Common difference:</strong> d = a₂ − a₁<br><br>
<strong>📊 Where:</strong><br>
• a = first term &nbsp;|&nbsp; d = common difference<br>
• n = number of terms &nbsp;|&nbsp; l = last term<br><br>
<strong>Example:</strong> AP: 2, 5, 8, 11... → a=2, d=3<br>
• 10th term = 2 + 9×3 = <strong>29</strong><br>
• S₁₀ = 10/2 × (2×2 + 9×3) = 5 × 31 = <strong>155</strong> ✅` },

  { keys:['probability'],
    response:`<strong>🎲 Probability — Class 10</strong><br><br>
<strong>Formula:</strong> P(E) = Favourable outcomes / Total outcomes<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ P(E) always lies between 0 and 1 (0 ≤ P ≤ 1)<br>
2️⃣ P(certain event) = 1 &nbsp;|&nbsp; P(impossible) = 0<br>
3️⃣ P(E) + P(Ē) = 1 (Complementary events)<br>
4️⃣ For mutually exclusive: P(A or B) = P(A) + P(B)<br><br>
<strong>📊 Common Examples:</strong><br>
• Die: 6 outcomes → P(even) = 3/6 = <strong>1/2</strong><br>
• Cards: 52 total → P(king) = 4/52 = <strong>1/13</strong><br>
• Coins: 2 coins → P(both heads) = 1/4<br><br>
<strong>Tip:</strong> Always list sample space first for complex problems!` },

  { keys:['hcf','lcm','euclid','real numbers'],
    response:`<strong>📐 Real Numbers — HCF, LCM & Euclid</strong><br><br>
<strong>Euclid's Division Lemma:</strong><br>
For a, b: &nbsp; <strong>a = bq + r</strong> &nbsp;(0 ≤ r &lt; b)<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ HCF × LCM = Product of two numbers (only for 2 numbers)<br>
2️⃣ To find HCF: apply Euclid's lemma repeatedly until r = 0<br>
3️⃣ Fundamental Theorem: every composite = unique product of primes<br>
4️⃣ p/q is terminating ONLY when q = 2ᵃ × 5ᵇ<br>
5️⃣ √2, √3, √5 are irrational (non-terminating, non-repeating)<br><br>
<strong>Example (HCF of 96 and 404):</strong><br>
404 = 96×4 + 20 → 96 = 20×4 + 16 → 20 = 16×1 + 4 → 16 = 4×4 + 0<br>
∴ <strong>HCF = 4</strong> ✅` },

  { keys:['coordinate geometry','distance formula','section formula'],
    response:`<strong>📐 Coordinate Geometry</strong><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>Distance:</strong> PQ = √[(x₂−x₁)² + (y₂−y₁)²]<br>
2️⃣ <strong>Midpoint:</strong> M = ((x₁+x₂)/2, (y₁+y₂)/2)<br>
3️⃣ <strong>Section formula (m:n):</strong> P = ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))<br>
4️⃣ <strong>Area of △:</strong> ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|<br>
5️⃣ Collinear points → Area of triangle = 0<br><br>
<strong>Example:</strong> Distance from (3,4) to origin (0,0):<br>
= √(3²+4²) = √(9+16) = √25 = <strong>5 units</strong> ✅` },

  { keys:['statistics','mean','median','mode'],
    response:`<strong>📊 Statistics — Mean, Median, Mode</strong><br><br>
<strong>📌 Formulas:</strong><br>
1️⃣ <strong>Mean (Direct):</strong> x̄ = Σfx / Σf<br>
2️⃣ <strong>Mean (Assumed mean):</strong> x̄ = A + (Σfd/Σf), where d = x − A<br>
3️⃣ <strong>Median:</strong> L + [(n/2 − cf)/f] × h<br>
4️⃣ <strong>Mode:</strong> L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h<br>
5️⃣ <strong>Empirical relation:</strong> <em>Mode = 3 Median − 2 Mean</em><br><br>
<strong>📊 Where:</strong><br>
• L = lower boundary of median/modal class<br>
• cf = cumulative frequency before median class<br>
• f = frequency of median class &nbsp;|&nbsp; h = class width<br>
• f₁ = modal class freq, f₀ = before, f₂ = after` },

  { keys:['circles','tangent','tangent to circle'],
    response:`<strong>📐 Circles — Tangents</strong><br><br>
<strong>📌 Key Theorems:</strong><br>
1️⃣ Tangent is <strong>perpendicular</strong> to radius at point of tangency<br>
2️⃣ From an <strong>external point</strong>, exactly <strong>2 tangents</strong> can be drawn<br>
3️⃣ Lengths of both tangents from external point are <strong>equal</strong><br>
4️⃣ Angle between tangent and chord = Angle in alternate segment<br><br>
<strong>📌 Common Formulas:</strong><br>
• If PA, PB are tangents from P → PA = PB<br>
• OA ⊥ PA (radius ⊥ tangent)<br>
• In △OAP: OP² = OA² + AP² (using Pythagoras)<br><br>
<strong>Board Exam Tip:</strong> Always draw a diagram and mark the right angle between radius and tangent! 📏` },

  /* ════════ SCIENCE — PHYSICS ════════ */
  { keys:["ohm's law",'ohm law','resistance','electric circuit'],
    response:`<strong>⚡ Electricity — Ohm's Law & Circuits</strong><br><br>
<strong>Ohm's Law:</strong> <em>V = IR</em><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ Current: I = Q/t (Amperes) &nbsp;|&nbsp; Charge: Q = ne<br>
2️⃣ Resistance: R = ρL/A (ρ = resistivity)<br>
3️⃣ <strong>Series:</strong> R_total = R₁ + R₂ + R₃ (current same)<br>
4️⃣ <strong>Parallel:</strong> 1/R = 1/R₁ + 1/R₂ + 1/R₃ (voltage same)<br>
5️⃣ Power: P = VI = I²R = V²/R<br>
6️⃣ Joule's Heating: H = I²Rt<br><br>
<strong>📊 Quick Examples:</strong><br>
• V=10V, R=5Ω → I = V/R = <strong>2A</strong><br>
• 2 resistors (6Ω each) in parallel → R = 6/2 = <strong>3Ω</strong><br>
• 1000W iron × 2 hours → Energy = <strong>2 kWh</strong> ✅` },

  { keys:['mirror formula','lens formula','light reflection refraction','power of lens','concave','convex'],
    response:`<strong>🔭 Light — Mirrors & Lenses</strong><br><br>
<strong>📌 Key Formulas:</strong><br>
1️⃣ <strong>Mirror formula:</strong> 1/v + 1/u = 1/f<br>
2️⃣ <strong>Lens formula:</strong> 1/v − 1/u = 1/f<br>
3️⃣ Magnification (mirror): m = −v/u<br>
4️⃣ <strong>Power of lens:</strong> P = 1/f(in metres) → unit: <strong>Dioptre (D)</strong><br><br>
<strong>📊 Mirror Types:</strong><br>
• <strong>Concave</strong> — converging, real+inverted images (except when object is within F)<br>
• <strong>Convex</strong> — diverging, always virtual+erect+diminished → rear-view mirrors<br><br>
<strong>📊 Lens Types:</strong><br>
• <strong>Convex (converging)</strong> → positive power (+)<br>
• <strong>Concave (diverging)</strong> → negative power (−)<br><br>
<strong>Sign Convention:</strong> Distances measured from pole/optical centre. Object always on left (−u).` },

  { keys:['myopia','hypermetropia','eye','defects of eye'],
    response:`<strong>👁️ Defects of Vision</strong><br><br>
<strong>📌 Three Main Defects:</strong><br><br>
1️⃣ <strong>Myopia (Short-sightedness):</strong><br>
&nbsp; • Cannot see DISTANT objects clearly<br>
&nbsp; • Image forms in FRONT of retina<br>
&nbsp; • Cause: eyeball too long / lens too convex<br>
&nbsp; • Correction: <strong>Concave lens (−ve power)</strong><br><br>
2️⃣ <strong>Hypermetropia (Long-sightedness):</strong><br>
&nbsp; • Cannot see NEAR objects clearly<br>
&nbsp; • Image forms BEHIND retina<br>
&nbsp; • Cause: eyeball too short / lens too flat<br>
&nbsp; • Correction: <strong>Convex lens (+ve power)</strong><br><br>
3️⃣ <strong>Presbyopia (Old Age):</strong><br>
&nbsp; • Loss of accommodation (power to adjust focus)<br>
&nbsp; • Correction: <strong>Bifocal lens</strong><br><br>
<strong>Near point of normal eye = 25 cm</strong>` },

  { keys:['sky blue','scattering','tyndall effect','sunset'],
    response:`<strong>🌈 Scattering of Light</strong><br><br>
<strong>📌 Why is the sky blue?</strong><br>
1️⃣ Sunlight has all colours (VIBGYOR)<br>
2️⃣ Shorter wavelength (blue/violet) scatters MORE by gas molecules<br>
3️⃣ Blue light reaches our eyes from all directions → sky looks BLUE<br><br>
<strong>📌 Why does the sun appear red at sunrise/sunset?</strong><br>
1️⃣ Light travels a LONGER path through atmosphere<br>
2️⃣ Blue/violet light scattered away long before reaching us<br>
3️⃣ Only red light (scatters LEAST, longer wavelength) reaches our eyes<br><br>
<strong>📌 Tyndall Effect:</strong><br>
• Scattering of light by colloidal particles<br>
• Example: beam of light in a smoky room, headlights in fog<br><br>
<strong>VIBGYOR:</strong> Violet, Indigo, Blue, Green, Yellow, Orange, Red` },

  /* ════════ SCIENCE — CHEMISTRY ════════ */
  { keys:['photosynthesis'],
    response:`<strong>🌱 Photosynthesis</strong><br><br>
<strong>Equation:</strong><br>
6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Occurs in <strong>chloroplasts</strong> (contains chlorophyll pigment)<br>
2️⃣ <strong>Raw materials:</strong> CO₂ (from air through stomata) + H₂O (from soil)<br>
3️⃣ <strong>Products:</strong> Glucose (food/energy) + Oxygen (released)<br>
4️⃣ <strong>Conditions:</strong> Sunlight + Chlorophyll<br>
5️⃣ Light reactions: in thylakoid membranes<br>
6️⃣ Dark reactions (Calvin cycle): in stroma<br><br>
<strong>📊 Factors affecting rate:</strong><br>
• Light intensity &nbsp;|&nbsp; CO₂ concentration &nbsp;|&nbsp; Temperature &nbsp;|&nbsp; Water availability<br><br>
<strong>Board tip:</strong> Know the equation by heart — worth 1-2 marks every year!` },

  { keys:['acid','base','ph','neutralisation','salt'],
    response:`<strong>🧪 Acids, Bases & Salts</strong><br><br>
<strong>📌 Comparison:</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>Acids</strong> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Bases</strong><br>
• Taste: Sour &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Bitter / soapy<br>
• Litmus: Blue → Red &nbsp;&nbsp;&nbsp;&nbsp; Red → Blue<br>
• pH: less than 7 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; greater than 7<br>
• Release: H⁺ ions &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; OH⁻ ions<br><br>
<strong>📌 Important Reactions:</strong><br>
1️⃣ Neutralisation: Acid + Base → Salt + Water<br>
2️⃣ HCl + NaOH → NaCl + H₂O<br>
3️⃣ Metal + Acid → Salt + H₂ gas<br>
4️⃣ Metal carbonate + Acid → Salt + CO₂ + Water<br><br>
<strong>📊 Common Salts:</strong><br>
• Baking soda: NaHCO₃ &nbsp;|&nbsp; Washing soda: Na₂CO₃<br>
• Plaster of Paris: CaSO₄·½H₂O &nbsp;|&nbsp; Bleaching powder: Ca(OCl)Cl` },

  { keys:['chemical reaction','types of reaction','combination','decomposition','displacement'],
    response:`<strong>⚗️ Types of Chemical Reactions</strong><br><br>
<strong>📌 6 Main Types:</strong><br><br>
1️⃣ <strong>Combination:</strong> A + B → AB<br>
&nbsp; Example: CaO + H₂O → Ca(OH)₂<br><br>
2️⃣ <strong>Decomposition:</strong> AB → A + B<br>
&nbsp; Example: CaCO₃ → CaO + CO₂ (thermal)<br><br>
3️⃣ <strong>Single Displacement:</strong> A + BC → AC + B<br>
&nbsp; Example: Fe + CuSO₄ → FeSO₄ + Cu<br><br>
4️⃣ <strong>Double Displacement:</strong> AB + CD → AD + CB<br>
&nbsp; Example: NaOH + HCl → NaCl + H₂O<br><br>
5️⃣ <strong>Oxidation:</strong> Loss of electrons / gain of oxygen<br><br>
6️⃣ <strong>Reduction:</strong> Gain of electrons / loss of oxygen<br><br>
<strong>Note:</strong> Oxidation and Reduction always occur TOGETHER → called <strong>Redox reaction</strong>` },

  { keys:['reactivity series','metals non metals','corrosion'],
    response:`<strong>⚗️ Metals & Non-Metals</strong><br><br>
<strong>Reactivity Series (High → Low):</strong><br>
<strong>K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Hg > Ag > Au</strong><br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Metals above H displace H₂ from dilute acids<br>
2️⃣ More reactive metal displaces less reactive from solution<br>
3️⃣ Na and K stored in <strong>kerosene</strong> (too reactive)<br>
4️⃣ Gold/Platinum don't corrode → used in jewellery<br><br>
<strong>📊 Physical Properties:</strong><br>
• Metals: lustrous, malleable, ductile, conductors, sonorous<br>
• Non-metals: brittle (if solid), poor conductors (except graphite)<br>
• Exception: Mercury is a liquid metal; Graphite conducts electricity<br><br>
<strong>📊 Corrosion:</strong><br>
• Rusting: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃<br>
• Prevented by: painting, galvanizing, electroplating, alloying` },

  { keys:['carbon compounds','organic chemistry','alkane','alkene','hydrocarbon'],
    response:`<strong>⚗️ Carbon & Its Compounds</strong><br><br>
<strong>📌 Why Carbon is Special:</strong><br>
1️⃣ <strong>Catenation</strong> — can bond with itself to form long chains<br>
2️⃣ Valency = 4 — forms 4 covalent bonds<br>
3️⃣ Forms millions of compounds (organic chemistry)<br><br>
<strong>📊 Hydrocarbons:</strong><br>
• <strong>Alkanes</strong> (saturated): CₙH₂ₙ₊₂ — CH₄, C₂H₆<br>
• <strong>Alkenes</strong> (one double bond): CₙH₂ₙ — C₂H₄<br>
• <strong>Alkynes</strong> (one triple bond): CₙH₂ₙ₋₂ — C₂H₂<br><br>
<strong>📌 Important Compounds:</strong><br>
• <strong>Ethanol</strong> (C₂H₅OH): alcohol, fuel, medicine<br>
• <strong>Ethanoic acid</strong> (CH₃COOH): vinegar (5-8% solution)<br>
• <strong>Saponification:</strong> Fat + NaOH → Soap + Glycerol` },

  /* ════════ SCIENCE — BIOLOGY ════════ */
  { keys:['respiration','aerobic','anaerobic','atp'],
    response:`<strong>🫁 Respiration</strong><br><br>
<strong>📌 Two Types:</strong><br><br>
<strong>1️⃣ Aerobic Respiration (with O₂):</strong><br>
C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + <strong>38 ATP</strong><br>
• Occurs in: Mitochondria<br>
• More energy produced<br><br>
<strong>2️⃣ Anaerobic Respiration (without O₂):</strong><br>
• In yeast: Glucose → Ethanol + CO₂ + 2 ATP<br>
• In muscles: Glucose → Lactic acid + 2 ATP<br>
• Less energy, causes muscle cramps<br><br>
<strong>📌 Key Points:</strong><br>
1️⃣ Mitochondria = "powerhouse of the cell"<br>
2️⃣ ATP = Adenosine Triphosphate (energy currency of cell)<br>
3️⃣ Breathing ≠ Respiration (breathing = physical, respiration = chemical)<br><br>
<strong>Board tip:</strong> Know both equations with products!` },

  { keys:['nervous system','neuron','reflex action','reflex arc'],
    response:`<strong>🧠 Nervous System</strong><br><br>
<strong>📌 Structure:</strong><br>
1️⃣ <strong>Neuron</strong> = structural + functional unit<br>
&nbsp; Parts: Dendrites → Cell body → Axon → Synaptic knob<br>
2️⃣ <strong>CNS</strong> = Brain + Spinal cord<br>
3️⃣ <strong>PNS</strong> = All nerves outside CNS<br><br>
<strong>📌 Reflex Arc:</strong><br>
Stimulus → <strong>Receptor</strong> → Sensory nerve → <strong>Spinal cord</strong> → Motor nerve → <strong>Effector</strong> → Response<br><br>
<strong>Why reflexes bypass the brain:</strong><br>
• Brain processing takes time; reflexes need instant response<br>
• Spinal cord controls simple reflexes (knee-jerk, withdrawal)<br><br>
<strong>📊 Brain Regions:</strong><br>
• <strong>Cerebrum</strong>: thinking, memory, consciousness<br>
• <strong>Cerebellum</strong>: balance and coordination<br>
• <strong>Medulla oblongata</strong>: breathing, heartbeat (involuntary)` },

  { keys:['mendel','heredity','genetics','dominant recessive','monohybrid'],
    response:`<strong>🧬 Heredity & Genetics (Mendel)</strong><br><br>
<strong>📌 Mendel's Laws:</strong><br>
1️⃣ <strong>Law of Segregation:</strong> Alleles separate during gamete formation<br>
2️⃣ <strong>Law of Independent Assortment:</strong> Genes on different chromosomes assort independently<br><br>
<strong>📊 Monohybrid Cross (Tt × Tt):</strong><br>
• Genotype ratio: 1 TT : 2 Tt : 1 tt = <strong>1:2:1</strong><br>
• Phenotype ratio: 3 Tall : 1 Short = <strong>3:1</strong><br><br>
<strong>📊 Dihybrid Cross (TtRr × TtRr):</strong><br>
• Phenotype ratio: <strong>9:3:3:1</strong><br><br>
<strong>📌 Key Terms:</strong><br>
• <strong>Dominant</strong> = expressed when one/two copies present (T)<br>
• <strong>Recessive</strong> = expressed ONLY when both copies present (tt)<br>
• <strong>Genotype</strong> = genetic makeup &nbsp;|&nbsp; <strong>Phenotype</strong> = physical appearance<br>
• Plant used: <strong>Garden pea (Pisum sativum)</strong>` },

  { keys:['life processes','nutrition','transport','excretion'],
    response:`<strong>🌿 Life Processes</strong><br><br>
<strong>📌 Essential Life Processes:</strong><br><br>
<strong>1️⃣ Nutrition:</strong><br>
• Autotrophic (plants) → Photosynthesis<br>
• Heterotrophic (animals) → consume other organisms<br><br>
<strong>2️⃣ Respiration:</strong> C₆H₁₂O₆ + O₂ → CO₂ + H₂O + ATP<br><br>
<strong>3️⃣ Transportation (Human):</strong><br>
• Heart: 4 chambers (2 atria + 2 ventricles)<br>
• Double circulation (pulmonary + systemic)<br>
• Pulmonary vein → oxygenated blood from lungs to heart<br>
• Aorta → oxygenated blood from heart to body<br><br>
<strong>4️⃣ Excretion (Human):</strong><br>
• Kidneys filter blood → produce urine<br>
• Functional unit: <strong>Nephron</strong><br>
• Nitrogenous waste: <strong>Urea</strong> (in humans)` },

  { keys:['ecosystem','food chain','10% law','environment','ozone'],
    response:`<strong>🌍 Our Environment</strong><br><br>
<strong>📌 Key Concepts:</strong><br><br>
<strong>1️⃣ Food Chain:</strong><br>
Producer → Primary Consumer → Secondary Consumer → Tertiary Consumer<br><br>
<strong>2️⃣ 10% Energy Law (Lindemann):</strong><br>
• Only <strong>10%</strong> of energy passes to the next trophic level<br>
• Rest (90%) lost as heat<br>
• Example: 1000J → 100J → 10J → 1J<br><br>
<strong>3️⃣ Ozone Layer:</strong><br>
• Location: Stratosphere<br>
• Function: blocks harmful UV radiation<br>
• Depletion: <strong>CFCs</strong> (chlorofluorocarbons) react with O₃<br>
• Effect: ozone hole → UV rays reach Earth → skin cancer, cataracts<br><br>
<strong>4️⃣ Waste Types:</strong><br>
• Biodegradable: paper, food, cotton (decomposed by microbes)<br>
• Non-biodegradable: plastics, glass, DDT (persist in environment)` },

  /* ════════ HISTORY ════════ */
  { keys:['dandi march','salt march','civil disobedience','cdm'],
    response:`<strong>🇮🇳 Dandi March / Civil Disobedience Movement</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Date:</strong> 12 March – 6 April 1930<br>
2️⃣ <strong>Distance:</strong> ~380 km (240 miles)<br>
3️⃣ <strong>Started with:</strong> 78 volunteers from Sabarmati Ashram<br>
4️⃣ <strong>Destination:</strong> Dandi (coastal village in Gujarat)<br>
5️⃣ <strong>Purpose:</strong> Protest British salt tax by making salt from seawater<br><br>
<strong>📌 Impact:</strong><br>
• Launched the Civil Disobedience Movement nationwide<br>
• Thousands made salt illegally across India<br>
• International attention on Indian independence movement<br>
• Gandhi arrested → nationwide hartals and protests<br><br>
<strong>📌 Context:</strong><br>
• Before Dandi: Non-Cooperation Movement (1920) called off after Chauri Chaura<br>
• Poona Pact (1932): Gandhi + Ambedkar — reserved seats for Dalits<br>
• Quit India (1942): 'Do or Die' — final push` },

  { keys:['nationalism india','jallianwala','rowlatt','non cooperation'],
    response:`<strong>🇮🇳 Nationalism in India — Timeline</strong><br><br>
<strong>📌 Key Events:</strong><br><br>
1️⃣ <strong>Rowlatt Act (1919):</strong> detention without trial → mass outrage<br><br>
2️⃣ <strong>Jallianwala Bagh (13 Apr 1919):</strong><br>
&nbsp; • General Dyer ordered firing on peaceful crowd in Amritsar<br>
&nbsp; • Hundreds killed; shocked the entire nation<br><br>
3️⃣ <strong>Non-Cooperation Movement (1920):</strong><br>
&nbsp; • Boycott British goods, courts, schools<br>
&nbsp; • Called off after Chauri Chaura violence (1922)<br><br>
4️⃣ <strong>Dandi March (1930):</strong> Civil Disobedience — salt tax protest<br><br>
5️⃣ <strong>Quit India (1942):</strong> 'Do or Die' — Gandhi's final push<br><br>
6️⃣ <strong>Independence: 15 August 1947</strong><br><br>
<strong>Key Leaders:</strong> Mahatma Gandhi, Nehru, Ambedkar, Subhas Chandra Bose, Sardar Patel` },

  { keys:['nationalism europe','french revolution','zollverein','romanticism'],
    response:`<strong>🏛️ Rise of Nationalism in Europe</strong><br><br>
<strong>📌 Key Events in Order:</strong><br>
1️⃣ <strong>French Revolution (1789):</strong> Ideas of liberty, equality, fraternity spread<br>
2️⃣ <strong>Napoleon (1799–1815):</strong> Spread revolutionary ideas across Europe via conquests<br>
3️⃣ <strong>Romanticism:</strong> Cultural movement — folk tales, music, language to build national identity<br>
4️⃣ <strong>Zollverein (1834):</strong> German customs union — removed trade barriers, linked economies<br>
5️⃣ <strong>1830:</strong> Greece gained independence (first new nation-state in Europe)<br>
6️⃣ <strong>1848 (Spring of Nations):</strong> Revolutions for democracy across Europe<br>
7️⃣ <strong>Unification of Germany (1866–71):</strong> Led by Bismarck — "Blood and Iron" policy<br>
8️⃣ <strong>Unification of Italy:</strong> Led by Mazzini (Young Italy), Garibaldi (military), Cavour (politics)<br><br>
<strong>Key Quote:</strong> Metternich — "When France sneezes, rest of Europe catches cold"` },

  /* ════════ GEOGRAPHY ════════ */
  { keys:['soil types','alluvial soil','black soil','laterite'],
    response:`<strong>🌱 Soil Types in India</strong><br><br>
<strong>📌 6 Major Soil Types:</strong><br><br>
1️⃣ <strong>Alluvial Soil:</strong><br>
&nbsp; • Most widespread — Indo-Gangetic plains<br>
&nbsp; • Very fertile | Crops: Rice, wheat, sugarcane, cotton<br><br>
2️⃣ <strong>Black Soil (Regur):</strong><br>
&nbsp; • Deccan Plateau (Maharashtra, MP, Gujarat)<br>
&nbsp; • Retains moisture | Best for: <strong>COTTON</strong><br><br>
3️⃣ <strong>Red & Yellow Soil:</strong><br>
&nbsp; • Odisha, Tamil Nadu, Andhra | Formed from crystalline rocks<br><br>
4️⃣ <strong>Laterite Soil:</strong><br>
&nbsp; • Karnataka, Kerala, Tamil Nadu | Formed by leaching<br>
&nbsp; • Crops: Tea, coffee, cashews<br><br>
5️⃣ <strong>Arid (Desert) Soil:</strong><br>
&nbsp; • Rajasthan | Sandy, low humus | Needs irrigation<br><br>
6️⃣ <strong>Forest Soil:</strong><br>
&nbsp; • Himalayan slopes | Humus-rich in dense forests<br><br>
<strong>Memory trick:</strong> "ABRLAF" — Alluvial, Black, Red, Laterite, Arid, Forest` },

  { keys:['agriculture','kharif','rabi','green revolution','crop'],
    response:`<strong>🌾 Agriculture in India</strong><br><br>
<strong>📌 Crop Seasons:</strong><br><br>
1️⃣ <strong>Kharif (June–September):</strong><br>
&nbsp; • Sown in monsoon, harvested in autumn<br>
&nbsp; • Crops: <strong>Rice, Maize, Cotton, Jute, Bajra, Sugarcane</strong><br><br>
2️⃣ <strong>Rabi (October–March):</strong><br>
&nbsp; • Winter crops, harvested in spring<br>
&nbsp; • Crops: <strong>Wheat, Barley, Mustard, Peas, Gram</strong><br><br>
3️⃣ <strong>Zaid (March–June):</strong><br>
&nbsp; • Summer crops between Rabi and Kharif<br>
&nbsp; • Crops: Watermelon, Cucumber, Muskmelon, Fodder<br><br>
<strong>📌 Green Revolution (1960s):</strong><br>
• HYV (High Yielding Variety) seeds + fertilizers + irrigation<br>
• Mainly benefited: <strong>Wheat and Rice</strong><br>
• Pioneer: <strong>M.S. Swaminathan</strong> (Father of Green Revolution)<br>
• States: Punjab, Haryana, western UP initially<br><br>
<strong>India:</strong> Largest producer of pulses; 2nd in rice & wheat` },

  /* ════════ ECONOMICS ════════ */
  { keys:['gdp','development','per capita','hdi','human development'],
    response:`<strong>💰 Development & Economy</strong><br><br>
<strong>📌 Key Concepts:</strong><br><br>
1️⃣ <strong>Per Capita Income = National Income / Population</strong><br>
&nbsp; • Higher per capita = generally better standard of living<br>
&nbsp; • Limitation: doesn't show distribution of income<br><br>
2️⃣ <strong>GDP (Gross Domestic Product):</strong><br>
&nbsp; • Total value of goods & services produced in a country in one year<br><br>
3️⃣ <strong>HDI (Human Development Index):</strong><br>
&nbsp; • Published by: <strong>UNDP</strong> annually<br>
&nbsp; • Combines: Per capita income + Life expectancy + Education<br><br>
4️⃣ <strong>LPG Reforms (1991):</strong><br>
&nbsp; • <strong>L</strong>iberalisation + <strong>P</strong>rivatisation + <strong>G</strong>lobalisation<br>
&nbsp; • PM Narasimha Rao; Finance Minister Manmohan Singh<br><br>
<strong>Key Comparison:</strong><br>
• Punjab vs Kerala: Punjab higher income, but Kerala better in health & education → HDI more meaningful than just income` },

  { keys:['globalisation','mnc','wto','liberalisation'],
    response:`<strong>🌐 Globalisation & the Indian Economy</strong><br><br>
<strong>📌 Key Concepts:</strong><br><br>
1️⃣ <strong>Globalisation:</strong> Integration of countries through trade & foreign investment<br><br>
2️⃣ <strong>MNC (Multinational Corporation):</strong><br>
&nbsp; • Company with production in 2+ countries<br>
&nbsp; • Attracted by: cheap labour, raw materials, large markets<br>
&nbsp; • Examples: Samsung, Apple, Unilever, Nestlé<br><br>
3️⃣ <strong>WTO (World Trade Organisation):</strong><br>
&nbsp; • Established: 1995<br>
&nbsp; • Purpose: promote free and fair international trade<br>
&nbsp; • Role: set rules, resolve trade disputes<br><br>
4️⃣ <strong>FDI = Foreign Direct Investment</strong><br><br>
5️⃣ <strong>India's LPG Reforms (1991):</strong><br>
&nbsp; • Removed import restrictions &nbsp;|&nbsp; Reduced import duties<br>
&nbsp; • Allowed foreign companies to invest freely<br><br>
<strong>Impact:</strong> IT sector boom, job creation BUT small industries face competition from MNCs` },

  { keys:['money credit','formal informal','rbi','shg','self help'],
    response:`<strong>🏦 Money & Credit</strong><br><br>
<strong>📌 Key Concepts:</strong><br><br>
1️⃣ <strong>Barter Problem:</strong> Double coincidence of wants<br>
&nbsp; • Both parties must want what the other has — very difficult!<br>
&nbsp; • Money solved this as a medium of exchange<br><br>
2️⃣ <strong>Formal Credit (RBI regulated):</strong><br>
&nbsp; • Banks, cooperative societies<br>
&nbsp; • Lower interest rates, legal protection<br>
&nbsp; • Requires collateral + documentation<br><br>
3️⃣ <strong>Informal Credit (Unregulated):</strong><br>
&nbsp; • Moneylenders, traders, relatives<br>
&nbsp; • Very high interest → can cause debt trap for poor<br><br>
4️⃣ <strong>SHG (Self Help Group):</strong><br>
&nbsp; • 15–20 rural women pool savings<br>
&nbsp; • Give each other loans at low interest<br>
&nbsp; • Bypass moneylenders; empowers women<br><br>
<strong>RBI = Reserve Bank of India</strong> → regulates all formal credit/banking in India` },

  /* ════════ CIVICS ════════ */
  { keys:['power sharing','belgium','sri lanka','majoritarianism'],
    response:`<strong>⚖️ Power Sharing</strong><br><br>
<strong>📌 Two Case Studies:</strong><br><br>
<strong>1️⃣ Belgium (Success Story):</strong><br>
&nbsp; • Dutch 59% + French 40% + German 1%<br>
&nbsp; • Solution: Federal system + equal representation<br>
&nbsp; • 3 governments: Federal + Regional + Community<br>
&nbsp; • Result: <strong>No civil war, peaceful coexistence</strong> ✅<br><br>
<strong>2️⃣ Sri Lanka (Failure):</strong><br>
&nbsp; • Sinhala 74% + Tamil 18% + Others<br>
&nbsp; • Sinhala Only Act (1956) → alienated Tamils<br>
&nbsp; • Civil war lasted decades<br>
&nbsp; • Result: <strong>Conflict, instability</strong> ❌<br><br>
<strong>📌 Forms of Power Sharing:</strong><br>
1️⃣ Horizontal: Among organs — legislature, executive, judiciary<br>
2️⃣ Vertical: Federal → State → Local government<br>
3️⃣ Among political parties (coalition)<br>
4️⃣ Among social groups (reservations, representation)<br><br>
<strong>Lesson:</strong> Belgium shows power sharing PREVENTS conflict; Sri Lanka shows ignoring minorities causes it` },

  /* ════════ ENGLISH LITERATURE ════════ */
  { keys:['lencho','letter to god'],
    response:`<strong>📖 A Letter to God — Summary</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Author:</strong> G.L. Fuentes (Mexican writer, originally in Spanish)<br>
2️⃣ <strong>Setting:</strong> Rural Mexico — a small farm<br>
3️⃣ <strong>Main Character:</strong> Lencho — a hardworking, deeply religious farmer<br><br>
<strong>📌 Plot:</strong><br>
1️⃣ Lencho's crops destroyed by a hailstorm just before harvest<br>
2️⃣ He writes a letter to God asking for 100 pesos<br>
3️⃣ Post office staff read it — postmaster moved by Lencho's faith<br>
4️⃣ Staff collect 70 pesos and send it (can't collect full 100)<br>
5️⃣ Lencho counts only 70 pesos → calls post office staff <em>"a bunch of crooks"</em><br>
6️⃣ Irony: The very people who helped him are called thieves!<br><br>
<strong>📌 Themes:</strong><br>
• Unshakeable faith in God<br>
• Dramatic irony — Lencho's ignorance vs reader's knowledge<br>
• Human ingratitude<br><br>
<strong>Board Question:</strong> Why did Lencho call the helpers crooks? → He believed God sent 100 pesos but received only 70.` },

  { keys:['nelson mandela','apartheid','long walk to freedom'],
    response:`<strong>📖 Nelson Mandela: Long Walk to Freedom</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Event:</strong> Nelson Mandela's inauguration as first black President of South Africa<br>
2️⃣ <strong>Date:</strong> 10 May 1994<br>
3️⃣ <strong>Prison term:</strong> 27 years on Robben Island (1964–1990)<br>
4️⃣ <strong>Apartheid:</strong> System of racial segregation in South Africa (1948–1994)<br><br>
<strong>📌 Key Ideas in the Text:</strong><br>
1️⃣ Both oppressor and oppressed are robbed of their humanity<br>
2️⃣ Mandela had two obligations: to family and to his people<br>
3️⃣ Courage is not absence of fear — it's overcoming fear<br>
4️⃣ Greatest glory = rising every time we fall<br><br>
<strong>📌 Important Quotes:</strong><br>
• "A man who takes away another man's freedom is a prisoner of hatred"<br>
• "The greatest wealth of my country is its people"<br><br>
<strong>ANC</strong> = African National Congress (Mandela's party)` },

  { keys:['anne frank','diary of anne'],
    response:`<strong>📖 From the Diary of Anne Frank</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Who:</strong> Anne Frank — Jewish girl hiding from Nazis in Amsterdam<br>
2️⃣ <strong>Diary name:</strong> "Kitty" — her best friend and confidant<br>
3️⃣ <strong>Period:</strong> June 1942 – August 1944<br>
4️⃣ <strong>Fate:</strong> Captured by Nazis, died in Bergen-Belsen camp, 1945 (age 15)<br><br>
<strong>📌 Key Ideas in the Text:</strong><br>
1️⃣ Anne feels she has no true friend to confide in<br>
2️⃣ Paper has more patience than people (famous quote)<br>
3️⃣ She describes her funny relationship with Mr. Keesing (teacher)<br>
4️⃣ Shows power of writing during dark times<br><br>
<strong>📌 Famous Quote:</strong><br>
<em>"Paper has more patience than people"</em> — Anne Frank<br><br>
<strong>Themes:</strong> Loneliness, Resilience, Friendship, War's impact on children` },

  { keys:['footprints without feet','griffin','invisible man'],
    response:`<strong>📖 Footprints Without Feet — H.G. Wells</strong><br><br>
<strong>📌 Key Facts:</strong><br>
1️⃣ <strong>Author:</strong> H.G. Wells (science fiction writer)<br>
2️⃣ <strong>Griffin:</strong> A brilliant but <em>lawless</em> scientist<br><br>
<strong>📌 Plot Points:</strong><br>
1️⃣ Griffin discovers how to make his body transparent (invisible)<br>
2️⃣ Sets fire to his landlord's house → becomes a homeless wanderer<br>
3️⃣ Steals from a theatrical company for clothes + money<br>
4️⃣ Arrives at Iping village in winter → stays at Mrs. Hall's inn<br>
5️⃣ Covers himself in bandages to hide his invisibility<br>
6️⃣ Eventually unwrapped in public → face disappears → people horrified<br>
7️⃣ Runs off as an invisible person again<br><br>
<strong>📌 Central Theme:</strong><br>
• Science without ethics = dangerous<br>
• Power without responsibility leads to misuse and destruction<br><br>
<strong>Board Q:</strong> Why was Griffin a homeless wanderer? → He had set fire to his landlord's house.` },

  { keys:['necklace','matilda','maupassant','the necklace'],
    response:`<strong>📖 The Necklace — Guy de Maupassant</strong><br><br>
<strong>📌 Plot Summary:</strong><br>
1️⃣ Matilda Loisel — pretty, but obsessed with wealth she doesn't have<br>
2️⃣ Husband gets invitation to a grand party<br>
3️⃣ Borrows a diamond necklace from friend Madame Forestier<br>
4️⃣ Has a wonderful time at the party<br>
5️⃣ <strong>Loses the necklace on the way home</strong><br>
6️⃣ Too proud to tell Forestier → buys a replacement for <strong>36,000 francs</strong><br>
7️⃣ They take loans, work 10 years in poverty to repay<br>
8️⃣ Matilda meets Forestier after 10 years — looking old and worn<br>
9️⃣ <strong>TWIST:</strong> Forestier reveals the necklace was FAKE — worth only 500 francs!<br><br>
<strong>📌 Themes:</strong><br>
• Vanity and pride lead to downfall<br>
• Irony of fate<br>
• Deception and its consequences<br><br>
<strong>Board Tip:</strong> The "O. Henry twist ending" — shocking final revelation is a favourite question!` },

  /* ════════ GENERAL ════════ */
  { keys:['hi','hello','hey','hii','helo'],
    response:`👋 <strong>Hello! I'm Owlix</strong> — your AbiLearn AI Study Assistant!<br><br>
I'm here to help you master <strong>CBSE Class 10</strong>. Ask me anything!<br><br>
<strong>📚 What I can help with:</strong><br>
• 📐 Maths formulas, theorems, problem-solving tips<br>
• 🔬 Science — Physics, Chemistry, Biology concepts<br>
• 📖 English story summaries & grammar rules<br>
• 🌍 Social Science — History, Geography, Civics, Economics<br>
• 🎯 Board exam tips and study strategies<br><br>
Just type your question and I'll explain it step by step! 🦉` },

  { keys:['who are you','what are you','owlix','about you'],
    response:`🦉 <strong>I'm Owlix</strong> — AbiLearn's AI Study Assistant for CBSE Class 10!<br><br>
<strong>What I do:</strong><br>
1️⃣ Explain concepts in simple, point-by-point format<br>
2️⃣ Give you formulas with examples instantly<br>
3️⃣ Help you understand stories, history, science — all subjects<br>
4️⃣ Answer board exam style questions<br>
5️⃣ Give study tips and strategies<br><br>
<strong>I cover all 4 subjects:</strong><br>
📐 Mathematics &nbsp;|&nbsp; 🔬 Science &nbsp;|&nbsp; 📖 English &nbsp;|&nbsp; 🌍 Social Science<br><br>
Ask me anything — I'm available 24/7! 💪` },

  { keys:['board exam','exam tips','how to study','score 90','cbse tips','study tips'],
    response:`<strong>🎯 Board Exam Tips — Score 90+ in CBSE Class 10</strong><br><br>
<strong>📌 Study Strategy:</strong><br>
1️⃣ <strong>NCERT First:</strong> 80% of CBSE questions come directly from NCERT<br>
2️⃣ <strong>Previous Year Papers:</strong> Solve last 5 years' papers in exam conditions<br>
3️⃣ <strong>Formula Sheets:</strong> Make your own formula sheet for Maths & Science<br>
4️⃣ <strong>Write, Don't Just Read:</strong> Writing activates memory much better<br>
5️⃣ <strong>Spaced Repetition:</strong> Revise after 1 day → 3 days → 7 days → 21 days<br><br>
<strong>📌 Subject-wise Tips:</strong><br>
• <strong>Maths:</strong> Practice minimum 10 numericals daily per chapter<br>
• <strong>Science:</strong> Draw diagrams for every topic (heart, reflex arc, etc.)<br>
• <strong>English:</strong> Read the passage in reading section carefully twice<br>
• <strong>Social:</strong> Make timeline charts for history; maps for geography<br><br>
<strong>📌 Before the Exam:</strong><br>
• Sleep 8 hours the night before<br>
• Eat well, don't cram last minute<br>
• Read questions carefully before answering<br><br>
You've got this! 💪` },

  { keys:['formula','formulas','all formulas','important formulas'],
    response:`<strong>📐 Quick Formula Reference — Class 10</strong><br><br>
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
Ask me about any specific topic for detailed explanation! 🦉` }
];

/* ════════ OWLIX BRAIN ════════ */
function owlixThink(message) {
  const msg = message.toLowerCase().trim();
  if (!msg) return null;
  for (const entry of OWLIX_KB) {
    if (entry.keys.some(k => msg.includes(k))) return entry.response;
  }
  return `🤔 <strong>Great question!</strong> I'm still expanding my knowledge about <em>"${escOwlix(message)}"</em>.<br><br>
Try asking me about:<br>
• <strong>Maths:</strong> "quadratic formula", "Pythagoras", "AP", "probability"<br>
• <strong>Science:</strong> "Ohm's Law", "photosynthesis", "refraction", "Mendel"<br>
• <strong>History:</strong> "Dandi March", "Nationalism in Europe", "Jallianwala Bagh"<br>
• <strong>English:</strong> "Letter to God", "Nelson Mandela", "Footprints Without Feet"<br><br>
Or type <strong>"board exam tips"</strong> for study strategies! 🦉`;
}

function escOwlix(s) {
  return String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');
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

  // Quick reply chips
  if (qrWrap) {
    qrWrap.innerHTML = QR.map(r =>
      `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(r)})">${r}</button>`
    ).join('');
  }

  // Welcome message (delayed)
  setTimeout(() => {
    addOwlixMsg('bot', `👋 <strong>Hi! I'm Owlix</strong> — your AI study buddy for CBSE Class 10!<br><br>Ask me any doubt about Maths, Science, English or Social Science. I'll explain everything <strong>point by point</strong>. 🎯<br><br>What would you like to know today?`);
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

function submitOwlix() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  sendOwlixMessage(text);
}

function sendOwlixMessage(text) {
  addOwlixMsg('user', escOwlix(text));
  showTyping();
  setTimeout(() => {
    hideTyping();
    addOwlixMsg('bot', owlixThink(text));
    // Open chatbot if closed
    const win = document.getElementById('owlixWindow');
    if (win && !win.classList.contains('open')) win.classList.add('open');
  }, 700 + Math.random() * 500);
}

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
