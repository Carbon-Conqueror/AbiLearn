/* Owlix AI — LLM-powered v13
   Real AI via /api/chat · KB used for CBSE context injection */
'use strict';

/* ══════════════════════════════════════════════════════
   KNOWLEDGE BASE — CBSE Class 10 Complete
   Each entry: keys[] = trigger words, ans = markdown answer
══════════════════════════════════════════════════════ */
const KB = [

  /* ══ MATHS ══ */
  {
    keys: ['real number', 'hcf', 'lcm', 'euclid', 'irrational', 'prime factori', 'rational decimal', 'terminating'],
    ans: `**📐 Real Numbers**

**Euclid's Division Algorithm:**
For any two positive integers a and b:
\`a = bq + r\` (0 ≤ r < b)
→ Used to find **HCF** step by step.

**HCF × LCM = a × b** (for two numbers)

**Fundamental Theorem of Arithmetic:**
Every composite number = unique product of primes.

**Irrational Numbers:** √2, √3, √5, π — cannot be expressed as p/q.
**Proof √2 is irrational:** Assume √2 = p/q (lowest terms) → p² = 2q² → p is even → q is even → contradiction!

**Decimal Expansion:**
- Denominator has only 2's and 5's → **terminating**
- Otherwise → **non-terminating repeating**

📌 **Board Tips:**
- HCF by Euclid's algorithm — very frequently asked
- Prove irrationality of √2, √3 — must prepare!`
  },

  {
    keys: ['polynomial', 'zeroes', 'zero of polynomial', 'alpha beta', 'sum of zeroes', 'product of zeroes', 'cubic polynomial'],
    ans: `**📐 Polynomials**

**Quadratic** ax² + bx + c (α, β are zeroes):
- **Sum:** \`α + β = −b/a\`
- **Product:** \`αβ = c/a\`

**Cubic** ax³ + bx² + cx + d (α, β, γ):
- \`α + β + γ = −b/a\`
- \`αβ + βγ + γα = c/a\`
- \`αβγ = −d/a\`

**Geometrically:** Number of zeroes = times graph crosses x-axis.
- Linear → 1 zero, Quadratic → max 2, Cubic → max 3

**Division Algorithm:**
\`Dividend = Divisor × Quotient + Remainder\`

📌 **Board Tips:**
- Memorise sum & product formulas — in every exam!
- If α is a zero → (x − α) is a factor`
  },

  {
    keys: ['linear equation', 'pair of linear', 'substitution method', 'elimination method', 'cross multiplication', 'consistent', 'inconsistent', 'infinitely many solution'],
    ans: `**📐 Pair of Linear Equations**

Standard: a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0

**Conditions:**
| Ratio | Lines | Solutions |
|---|---|---|
| a₁/a₂ ≠ b₁/b₂ | Intersecting | Unique (consistent) |
| a₁/a₂ = b₁/b₂ = c₁/c₂ | Coincident | Infinite (consistent) |
| a₁/a₂ = b₁/b₂ ≠ c₁/c₂ | Parallel | None (inconsistent) |

**Methods:**
1. **Substitution** — express x in terms of y (or vice versa)
2. **Elimination** — multiply to make coefficients equal, add/subtract
3. **Cross-multiplication:**
\`x / (b₁c₂ − b₂c₁) = y / (c₁a₂ − c₂a₁) = 1 / (a₁b₂ − a₂b₁)\`

📌 **Board Tips:**
- Word problems: always form two equations first
- Verify answer by substituting back into both equations`
  },

  {
    keys: ['quadratic equation', 'quadratic formula', 'discriminant', 'nature of roots', 'factorisation method', 'completing the square', 'x squared'],
    ans: `**📐 Quadratic Equations**

**Standard Form:** ax² + bx + c = 0 (a ≠ 0)

**Quadratic Formula:**
\`x = [−b ± √(b² − 4ac)] / 2a\`

**Discriminant D = b² − 4ac:**
- **D > 0** → Two distinct real roots
- **D = 0** → Two equal real roots
- **D < 0** → No real roots (imaginary)

**Methods to Solve:**
1. **Factorisation** — split middle term into two factors
2. **Completing the Square** — make perfect square, then take √
3. **Quadratic Formula** — always works!

**Example:** x² − 5x + 6 = 0
→ (x − 2)(x − 3) = 0 → **x = 2 or x = 3**

**Relation of roots:** Sum = −b/a, Product = c/a

📌 **Board Tips:**
- Always check D before solving — tells nature of roots
- If D < 0, write "no real roots" — don't leave blank`
  },

  {
    keys: ['arithmetic progression', ' ap ', 'nth term', 'common difference', 'sum of n terms', 'sum of ap', 'arithmetic sequence'],
    ans: `**📐 Arithmetic Progressions (AP)**

**nth Term:** \`aₙ = a + (n − 1)d\`

**Sum of n terms:**
\`Sₙ = n/2 [2a + (n − 1)d]\`
or \`Sₙ = n/2 [a + l]\` (l = last term)

**Common Difference:** \`d = a₂ − a₁\`

**Important:**
- \`aₙ = Sₙ − Sₙ₋₁\`
- If a, b, c are in AP → **2b = a + c**

**Three terms in AP:** take as **(a − d), a, (a + d)**
**Four terms:** **(a − 3d), (a − d), (a + d), (a + 3d)**

**Example:** 2, 5, 8, 11... (a = 2, d = 3)
- 10th term = 2 + 9×3 = **29**
- S₁₀ = 10/2 [4 + 27] = **155**

📌 **Board Tips:**
- Three terms in AP trick saves a lot of time!
- Check if Sₙ is quadratic → it's an AP`
  },

  {
    keys: ['triangle', 'similarity', 'similar triangles', 'thales theorem', 'bpt', 'basic proportionality', 'pythagoras', 'pythagoras theorem', 'aa criterion', 'sss criterion', 'sas criterion'],
    ans: `**📐 Triangles**

**Basic Proportionality Theorem (BPT / Thales):**
If DE ∥ BC in △ABC, then:
\`AD/DB = AE/EC\`
(Converse: if AD/DB = AE/EC, then DE ∥ BC)

**Criteria for Similarity:**
- **AA** — two angles equal
- **SSS** — all sides proportional
- **SAS** — two sides proportional + included angle equal

**Properties of Similar Triangles:**
- Ratio of **areas** = (ratio of sides)²
- Ratio of **perimeters** = ratio of corresponding sides

**Pythagoras Theorem:**
In right △, \`Hypotenuse² = Base² + Perpendicular²\`
\`AC² = AB² + BC²\` (right angle at B)

**Converse:** If AC² = AB² + BC², then ∠B = 90°

**Pythagorean Triples:** (3,4,5), (5,12,13), (8,15,17), (7,24,25)

📌 **Board Tips:**
- BPT proof is a must-learn
- Area theorem (ratio of areas) very frequently asked`
  },

  {
    keys: ['coordinate geometry', 'distance formula', 'section formula', 'midpoint formula', 'area of triangle coordinate', 'collinear points'],
    ans: `**📐 Coordinate Geometry**

**Distance Formula:**
\`d = √[(x₂ − x₁)² + (y₂ − y₁)²]\`

**Section Formula** (P divides AB in m:n internally):
\`x = (mx₂ + nx₁) / (m + n)\`
\`y = (my₂ + ny₁) / (m + n)\`

**Midpoint** (m = n = 1):
\`M = ((x₁+x₂)/2 , (y₁+y₂)/2)\`

**Area of Triangle** with vertices (x₁,y₁), (x₂,y₂), (x₃,y₃):
\`Area = ½ |x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|\`

**Collinear Points:** Area of triangle = 0

📌 **Board Tips:**
- Distance formula appears in every exam!
- Section formula for trisection: use m:n = 1:2 and 2:1`
  },

  {
    keys: ['trigonometry', 'sin cos tan', 'trig ratio', 'trigonometric identity', 'standard angle', 'sine cosine', 'sec cosec cot', '30 45 60 90'],
    ans: `**📐 Introduction to Trigonometry**

**Basic Ratios (Right △, angle θ):**
\`sin θ = Opposite / Hypotenuse\`
\`cos θ = Adjacent / Hypotenuse\`
\`tan θ = Opposite / Adjacent = sin θ / cos θ\`

**Standard Values:**
| θ | 0° | 30° | 45° | 60° | 90° |
|---|---|---|---|---|---|
| sin | 0 | 1/2 | 1/√2 | √3/2 | 1 |
| cos | 1 | √3/2 | 1/√2 | 1/2 | 0 |
| tan | 0 | 1/√3 | 1 | √3 | ∞ |

**Reciprocals:** cosec = 1/sin, sec = 1/cos, cot = 1/tan

**Trigonometric Identities:**
- \`sin²θ + cos²θ = 1\`
- \`1 + tan²θ = sec²θ\`
- \`1 + cot²θ = cosec²θ\`

**Complementary Angles:**
sin(90°−θ) = cosθ, cos(90°−θ) = sinθ, tan(90°−θ) = cotθ

📌 **Board Tip:** Memorise the table — asked in every exam!`
  },

  {
    keys: ['height and distance', 'angle of elevation', 'angle of depression', 'tower height', 'building height', 'shadow', 'applications of trigonometry'],
    ans: `**📐 Applications of Trigonometry**

**Key Definitions:**
- **Angle of Elevation** — angle looking UP from horizontal
- **Angle of Depression** — angle looking DOWN from horizontal

**Core Formula:**
\`tan θ = Perpendicular Height / Horizontal Distance\`

**Common Setups:**
- Tower, angle θ from distance d: **h = d × tan θ**
- Two angles from same point: use both tan equations and solve simultaneously

**Example:**
Angle of elevation of tower = 60°, distance = 30 m
h = 30 × tan 60° = 30√3 ≈ **51.96 m**

📌 **Board Tips:**
- Always draw a clear labelled diagram first
- Angle of elevation = angle of depression (alternate angles when observer and object are at same height)
- Use exact values (√3, 1/√3) unless told to use decimals`
  },

  {
    keys: ['circle', 'tangent', 'tangent to circle', 'number of tangent', 'tangent length', 'pa pb tangent'],
    ans: `**📐 Circles**

**Key Properties:**
1. Tangent ⊥ radius at point of contact
2. From an external point → exactly **2 tangents** can be drawn
3. **PA = PB** (tangents from same external point P are equal)

**Important Theorems:**
- Tangent is perpendicular to radius through point of contact (Theorem 10.1)
- Lengths of two tangents from external point are equal (Theorem 10.2)

**Proof of PA = PB:**
OA ⊥ PA, OB ⊥ PB (tangent ⊥ radius)
OA = OB (radii), OP is common
∴ △OAP ≅ △OBP (RHS) → **PA = PB** ✓

**Angle in Semicircle:** Always 90°

📌 **Board Tips:**
- PA = PB proof is a must-learn 3-mark question
- Tangent-chord angle = angle in alternate segment`
  },

  {
    keys: ['area related to circle', 'sector', 'segment', 'arc length', 'area of sector', 'area of segment', 'minor segment', 'major segment'],
    ans: `**📐 Areas Related to Circles**

**Circle:**
- Area = **πr²**
- Circumference = **2πr**

**Sector** (angle θ at centre, radius r):
- Area = **(θ/360) × πr²**
- Arc length = **(θ/360) × 2πr**

**Segment = Sector − Triangle:**
- Area of segment = (θ/360)πr² − ½r²sinθ

**Annulus (ring):** π(R² − r²)

**Combinations:** Find areas of individual shapes, add or subtract.

📌 **Board Tips:**
- Use π = 22/7 when r is multiple of 7; use 3.14 otherwise
- Segment = Sector − Triangle (always remember this!)
- Read whether they want minor or major segment`
  },

  {
    keys: ['surface area', 'volume', 'cylinder', 'cone', 'sphere', 'hemisphere', 'frustum', 'slant height', 'combination of solids'],
    ans: `**📐 Surface Areas & Volumes**

| Shape | CSA/LSA | TSA | Volume |
|---|---|---|---|
| **Cube (a)** | 4a² | 6a² | a³ |
| **Cuboid (l,b,h)** | 2h(l+b) | 2(lb+bh+hl) | lbh |
| **Cylinder (r,h)** | 2πrh | 2πr(r+h) | πr²h |
| **Cone (r,l,h)** | πrl | πr(r+l) | ⅓πr²h |
| **Sphere (r)** | — | 4πr² | ⁴⁄₃πr³ |
| **Hemisphere** | 2πr² | 3πr² | ⅔πr³ |

**Slant height of Cone:** \`l = √(r² + h²)\`

**Frustum** (cone cut parallel to base, R, r, h):
- CSA = πl(R + r), where l = √[h² + (R−r)²]
- Volume = ⅓πh(R² + Rr + r²)

📌 **Board Tips:**
- Hemisphere: 2 in CSA (curved only), 3 in TSA (curved + flat)
- Combinations: usually add volumes, and adjust surface area`
  },

  {
    keys: ['statistics', 'mean', 'median', 'mode', 'frequency table', 'cumulative frequency', 'ogive', 'modal class', 'assumed mean'],
    ans: `**📐 Statistics**

**Mean:**
- Direct: \`x̄ = Σfx / Σf\`
- Assumed Mean (a): \`x̄ = a + Σfd / Σf\` (d = x − a)
- Step Deviation: \`x̄ = a + (Σfu / Σf) × h\` (u = d/h)

**Mode:**
\`Mode = l + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h\`
l = lower limit of modal class (highest freq class)
f₁ = modal class freq, f₀ = class before, f₂ = class after, h = class size

**Median:**
\`Median = l + [(n/2 − cf) / f] × h\`
cf = cumulative frequency before median class

**Empirical Relation:**
\`Mode = 3 Median − 2 Mean\`

📌 **Board Tips:**
- Modal class = class with highest frequency
- For median: find n/2 first to identify median class`
  },

  {
    keys: ['probability', 'favourable outcome', 'sample space', 'event', 'complementary event', 'deck of cards', 'dice probability'],
    ans: `**📐 Probability**

**Formula:**
\`P(E) = Favourable outcomes / Total outcomes\`

**Key Rules:**
- 0 ≤ P(E) ≤ 1
- P(E) + P(Ē) = 1 (complementary)
- P(certain event) = 1, P(impossible event) = 0

**Playing Cards (52 cards):**
- 4 suits × 13 cards = 52 total
- Face cards (J, Q, K) = 12; Aces = 4
- Red = 26 (Hearts ♥ + Diamonds ♦), Black = 26

**Dice:**
- Single die: 6 outcomes {1,2,3,4,5,6}
- Two dice: 36 outcomes (6×6)

**Useful Tricks:**
- P(at least one) = 1 − P(none)
- P(both) for independent events = P(A) × P(B)

📌 **Board Tips:**
- Always write sample space for small problems
- Probability is always between 0 and 1 — check your answer!`
  },

  /* ══ SCIENCE — PHYSICS ══ */

  {
    keys: ["ohm's law", 'ohm law', 'v=ir', 'resistance', 'resistivity', 'series circuit', 'parallel circuit', 'electric current', 'electric power', 'joule heating', 'watt'],
    ans: `**⚡ Electricity**

**Ohm's Law:** \`V = IR\`
(V = Voltage in Volts, I = Current in Amperes, R = Resistance in Ohms Ω)

**Resistivity:** \`R = ρL / A\` (ρ = material property, L = length, A = cross-section area)

**Series Circuit:**
- R_total = R₁ + R₂ + R₃
- Same current, voltage divides

**Parallel Circuit:**
- 1/R_total = 1/R₁ + 1/R₂ + 1/R₃
- Same voltage, current divides

**Electric Power:**
\`P = VI = I²R = V²/R\` (in Watts)

**Joule's Law of Heating:**
\`H = I²Rt\` (H in Joules, t in seconds)

**Units:** 1 unit = 1 kWh = 3.6 × 10⁶ J

📌 **Board Tips:**
- Household circuits are always **parallel**
- P = I²R is most used formula for numericals`
  },

  {
    keys: ['magnetic effect', 'magnetic field', 'electromagnet', 'solenoid', 'electric motor', 'generator', 'electromagnetic induction', "fleming's rule", 'left hand rule', 'right hand rule', 'ac dc', 'alternating current'],
    ans: `**🔌 Magnetic Effects of Electric Current**

**Magnetic Field:**
- Right-hand thumb rule: Thumb → current direction, Fingers curl → field direction

**Force on Current-Carrying Conductor:**
**Fleming's Left-Hand Rule (Motor):**
- Forefinger → Magnetic Field (B)
- Middle finger → Current (I)
- Thumb → Motion/Force (F)

**Electromagnetic Induction:**
Changing magnetic field induces EMF in conductor.

**Fleming's Right-Hand Rule (Generator):**
- Forefinger → Field, Thumb → Motion, Middle finger → Induced current

**Electric Motor:** Electrical → Mechanical energy
**Generator/Dynamo:** Mechanical → Electrical energy

**AC vs DC:**
- **DC** — constant direction (battery, torch)
- **AC** — changes direction 50 times/sec (India = 50 Hz, 220V)

📌 **Memory Tip:** L**e**ft = Motor, **R**ight = Generato**r**`
  },

  {
    keys: ['light reflection', 'light refraction', 'mirror formula', 'lens formula', 'mirror', 'concave mirror', 'convex mirror', 'convex lens', 'concave lens', 'magnification', 'power of lens', 'focal length', 'refraction of light'],
    ans: `**💡 Light — Reflection & Refraction**

**Mirror Formula:** \`1/f = 1/v + 1/u\`
**Lens Formula:** \`1/f = 1/v − 1/u\`

**Magnification:**
- Mirror: \`m = −v/u\`
- Lens: \`m = v/u\`

**Power of Lens:** \`P = 1/f\` (f in metres, P in dioptres D)
Combined: **P = P₁ + P₂ + P₃**

**New Cartesian Sign Convention:**
- Object always placed left of mirror/lens
- Distances measured from pole/optical centre
- Right/Up = positive, Left/Down = negative

| | Image | Use |
|---|---|---|
| Concave mirror | Real/inverted (usually) | Shaving mirror, headlight |
| Convex mirror | Virtual/erect/diminished | Rear-view mirror |
| Convex lens | Real/inverted (usually) | Camera, microscope |
| Concave lens | Virtual/erect/diminished | Spectacles (myopia) |

**f = R/2** for mirrors

📌 **Board Tips:**
- f = R/2 is very important
- Concave = converging, Convex mirror = diverging`
  },

  {
    keys: ['human eye', 'defect of vision', 'myopia', 'hypermetropia', 'near sighted', 'far sighted', 'presbyopia', 'power of accommodation', 'dispersion', 'scattering', 'rainbow', 'blue sky', 'red sunset'],
    ans: `**👁️ Human Eye & The Colourful World**

**Parts:** Cornea → Iris (pupil) → Lens → Retina → Optic nerve

**Defects of Vision:**
| Defect | Far point | Near point | Correction |
|---|---|---|---|
| **Myopia** (near-sighted) | < infinity | Normal | **Concave lens** |
| **Hypermetropia** (far-sighted) | Normal | > 25cm | **Convex lens** |
| **Presbyopia** | < infinity | > 25cm | **Bifocal lens** |

**Normal eye:** Near point = 25 cm, Far point = infinity

**Power of Accommodation:** Ability of eye lens to adjust focal length (young people: 4D range)

**Dispersion:** White light splits into VIBGYOR through prism.
Red deviates LEAST, Violet deviates MOST.

**Scattering (Tyndall Effect):**
- Blue light scattered most → **sky is blue**
- Red, orange scattered least → **sunrise/sunset appears red**

📌 **Board Tip:** Myopia = concave lens, Hypermetropia = convex lens`
  },

  /* ══ SCIENCE — CHEMISTRY ══ */

  {
    keys: ['chemical reaction', 'chemical equation', 'balancing equation', 'type of chemical reaction', 'combination reaction', 'decomposition reaction', 'displacement reaction', 'double displacement', 'redox', 'oxidation', 'reduction', 'exothermic', 'endothermic'],
    ans: `**⚗️ Chemical Reactions & Equations**

**Types of Reactions:**
1. **Combination:** A + B → AB
   *2H₂ + O₂ → 2H₂O* (exothermic)
2. **Decomposition:** AB → A + B
   *2H₂O → 2H₂ + O₂* (endothermic, electrolysis)
3. **Displacement:** A + BC → AC + B
   *Zn + CuSO₄ → ZnSO₄ + Cu*
4. **Double Displacement:** AB + CD → AD + CB
   *NaCl + AgNO₃ → AgCl↓ + NaNO₃*
5. **Redox:** Oxidation + Reduction occur simultaneously

**Oxidation:** Loss of electrons / gain of O₂ / loss of H₂
**Reduction:** Gain of electrons / loss of O₂ / gain of H₂

**OIL RIG:** Oxidation Is Loss, Reduction Is Gain (electrons)

**Corrosion:** Rusting of iron (Fe₂O₃·xH₂O)
**Rancidity:** Oxidation of fats/oils (prevented by antioxidants, vacuum packing)

📌 **Board Tips:**
- Balance equations by hit and trial; balance H and O last
- Exothermic = heat released, Endothermic = heat absorbed`
  },

  {
    keys: ['acid', 'base', 'salt', 'ph scale', 'indicator', 'neutral', 'alkali', 'neutralisation', 'baking soda', 'washing soda', 'bleaching powder', 'plaster of paris'],
    ans: `**⚗️ Acids, Bases & Salts**

**Acids:** Produce H⁺ in water. pH < 7. Sour taste.
*HCl, H₂SO₄, HNO₃, CH₃COOH (acetic acid)*

**Bases:** Produce OH⁻ in water. pH > 7. Bitter, soapy.
*NaOH, Ca(OH)₂, KOH*

**pH Scale (0 to 14):**
- 0–7 → Acidic (0 = most acidic)
- 7 → Neutral (pure water)
- 7–14 → Basic (14 = most basic)

**Indicators:**
| Indicator | Acid | Base |
|---|---|---|
| Litmus | Red | Blue |
| Phenolphthalein | Colourless | Pink |
| Methyl Orange | Red/Orange | Yellow |

**Important Salts:**
- **Baking soda:** NaHCO₃ — used in cooking, antacid
- **Washing soda:** Na₂CO₃·10H₂O — cleaning agent
- **Bleaching powder:** Ca(OCl)Cl — disinfectant
- **Plaster of Paris:** CaSO₄·½H₂O — fractures/casts

📌 **Board Tip:** Stomach acid pH ≈ 2 (very acidic for digestion)`
  },

  {
    keys: ['metal', 'non-metal', 'reactivity series', 'ionic bond', 'corrosion', 'galvanising', 'thermite', 'aluminium', 'extraction of metal'],
    ans: `**⚗️ Metals & Non-Metals**

**Reactivity Series (most → least reactive):**
**K > Na > Ca > Mg > Al > Zn > Fe > Ni > Sn > Pb > H > Cu > Ag > Au**

**Rule:** More reactive metal displaces less reactive from salt solution.

**Physical Properties:**
| Property | Metals | Non-metals |
|---|---|---|
| Lustre | Shiny | Dull |
| Conductivity | Good | Poor (except graphite) |
| State at room temp | Solid (except Hg) | Solid/Liquid/Gas |
| Malleability | Ductile/Malleable | Brittle |

**Corrosion (Rusting):**
*4Fe + 3O₂ + xH₂O → 2Fe₂O₃·xH₂O*
**Prevention:** Painting, galvanising (Zn coating), alloying

**Thermite Reaction:**
*Fe₂O₃ + 2Al → Al₂O₃ + 2Fe + heat*

**Note:** Aluminium protected by Al₂O₃ layer (doesn't corrode easily)

📌 **Board Tip:** Reactivity series order must be memorised!`
  },

  {
    keys: ['carbon compound', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'functional group', 'homologous series', 'covalent bond', 'ethanol', 'ethanoic acid', 'soap', 'saponification', 'ester'],
    ans: `**⚗️ Carbon & Its Compounds**

**Carbon:** 4 valence electrons → forms 4 covalent bonds
Properties: catenation, tetravalency

**Hydrocarbons:**
- **Alkanes:** CₙH₂ₙ₊₂ (saturated, all single bonds) — Methane (CH₄), Ethane
- **Alkenes:** CₙH₂ₙ (one double bond) — Ethene (CH₂=CH₂)
- **Alkynes:** CₙH₂ₙ₋₂ (one triple bond) — Ethyne (HC≡CH)

**Functional Groups:**
| Group | Name | Example |
|---|---|---|
| −OH | Alcohol | Ethanol (C₂H₅OH) |
| −CHO | Aldehyde | Ethanal |
| −COOH | Carboxylic Acid | Ethanoic acid (vinegar) |
| −CO− | Ketone | Propanone |

**Homologous Series:** Same functional group, differ by −CH₂−, same general formula

**Esterification:**
*CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O* (with H₂SO₄)
Sweet smell → used in perfumes/flavours

**Saponification:** Fat + NaOH → Soap + Glycerol

📌 **Board Tip:** Soap works by micelle formation — hydrophilic end in water, hydrophobic in dirt`
  },

  /* ══ SCIENCE — BIOLOGY ══ */

  {
    keys: ['photosynthesis', 'chlorophyll', 'stomata', 'chloroplast', 'carbon dioxide', 'glucose plant'],
    ans: `**🌱 Photosynthesis**

**Equation:**
\`6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\`
(in presence of sunlight and chlorophyll)

**Requirements:**
- **Sunlight** — energy source
- **Carbon dioxide** — from air through stomata
- **Water** — from soil through roots
- **Chlorophyll** — green pigment in chloroplasts

**Products:** Glucose (food for plant) + Oxygen (released)

**Stomata:** Tiny pores on leaves controlled by guard cells
- CO₂ enters, O₂ and water vapour exit (transpiration)

**Chlorophyll:** Absorbs red and blue light; reflects green (hence leaves look green)

**Two Stages:**
1. **Light reactions** (in thylakoid) — light energy → ATP, NADPH
2. **Dark reactions/Calvin cycle** (in stroma) — CO₂ + ATP → Glucose

📌 **Board Tips:**
- Balanced equation must be memorised exactly
- Chloroplasts contain chlorophyll (not the whole leaf)`
  },

  {
    keys: ['respiration', 'aerobic respiration', 'anaerobic respiration', 'glycolysis', 'atp energy', 'lactic acid', 'fermentation'],
    ans: `**🫁 Life Processes — Respiration**

**Aerobic Respiration** (with O₂):
\`C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP\`

Steps: Glycolysis (cytoplasm) → Krebs Cycle (mitochondria) → Electron Transport Chain

**Anaerobic Respiration** (without O₂):
- In **yeast/fungi:** Glucose → Ethanol + CO₂ + 2 ATP (fermentation)
- In **muscle cells:** Glucose → Lactic acid + 2 ATP
- Muscle cramps = lactic acid accumulation

**Glycolysis:** Glucose (6C) → 2 Pyruvate (3C) + 2 ATP (in cytoplasm)

**Comparison:**
| | Aerobic | Anaerobic |
|---|---|---|
| O₂ | Required | Not required |
| ATP | 38 | 2 |
| Products | CO₂ + H₂O | Ethanol or Lactic acid |

📌 **Board Tips:**
- Aerobic = more ATP (38), Anaerobic = less ATP (2)
- Yeast produces ethanol (used in bread, wine making)`
  },

  {
    keys: ['life processes', 'nutrition', 'digestion', 'excretion', 'transportation', 'blood', 'heart', 'kidney', 'nephron'],
    ans: `**🫀 Life Processes**

**Nutrition:**
- **Autotrophs:** Make own food (photosynthesis) — plants
- **Heterotrophs:** Depend on others — animals, fungi

**Digestion in Humans:**
Mouth (saliva/amylase) → Stomach (HCl + pepsin) → Small intestine (bile + pancreatic juice) → Absorbed → Large intestine (water absorbed) → Faeces

**Transportation:**
- **Blood:** Plasma + RBC (haemoglobin, O₂) + WBC (immunity) + Platelets (clotting)
- **Heart:** 4 chambers — right (deoxygenated), left (oxygenated)
- Double circulation: pulmonary + systemic

**Excretion:**
- **Kidneys:** Filter blood → urine (urea, salts, water)
- **Nephron:** Functional unit of kidney
- Process: Filtration → Reabsorption → Secretion → Urine

**Plants excrete:** O₂ (photosynthesis), CO₂ (respiration), water (transpiration)

📌 **Board Tip:** Nephron is the functional unit — draw and label it!`
  },

  {
    keys: ['heredity', 'evolution', "mendel's law", 'genetics', 'dominant', 'recessive', 'chromosome', 'dna', 'natural selection', 'darwin', 'monohybrid', 'dihybrid', 'sex determination'],
    ans: `**🧬 Heredity & Evolution**

**Mendel's Laws:**
1. **Law of Dominance** — Dominant trait expressed over recessive
2. **Law of Segregation** — Alleles separate during gamete formation
3. **Law of Independent Assortment** — Genes on different chromosomes assort independently

**Monohybrid Cross** (Tt × Tt):
Genotype ratio: **TT : Tt : tt = 1 : 2 : 1**
Phenotype ratio: **3 Tall : 1 Short** (3:1)

**Dihybrid Cross** (F2 phenotype): **9 : 3 : 3 : 1**

**Sex Determination in Humans:**
- Females: **XX**
- Males: **XY**
- Father (XY) determines sex — contributes X or Y to child

**Evolution:**
- **Variation** exists in population
- **Natural Selection (Darwin):** Organisms with favourable variations survive → "Survival of the Fittest"
- Favourable traits passed to next generation

**Acquired vs Inherited:** Traits acquired in lifetime (muscles, scars) are NOT inherited

📌 **Board Tips:**
- Father gives X or Y → determines baby's sex (not mother!)
- 3:1 ratio for monohybrid, 9:3:3:1 for dihybrid`
  },

  {
    keys: ['nervous system', 'neuron', 'reflex action', 'reflex arc', 'brain', 'cerebrum', 'cerebellum', 'medulla', 'hormone', 'endocrine', 'insulin', 'adrenaline', 'coordination'],
    ans: `**🧠 Control & Coordination**

**Neuron (Nerve Cell):**
Dendrites → Cell Body → Axon → Synapse (gap between neurons)

**Types of Nervous System:**
- **CNS:** Brain + Spinal cord
- **PNS:** All nerves outside CNS

**Reflex Arc:**
Stimulus → Receptor → Sensory nerve → Spinal cord → Motor nerve → Effector → Response
(Very fast — does NOT go to brain first!)

**Brain Regions:**
| Part | Function |
|---|---|
| **Cerebrum** | Thinking, memory, voluntary actions, intelligence |
| **Cerebellum** | Balance, posture, coordination |
| **Medulla Oblongata** | Heartbeat, breathing, blood pressure |

**Endocrine Glands & Hormones:**
| Gland | Hormone | Function |
|---|---|---|
| Pituitary | Growth hormone | Overall growth |
| Thyroid | Thyroxin | Metabolism |
| Pancreas | Insulin | Blood sugar control |
| Adrenal | Adrenaline | Fight-or-flight response |

📌 **Board Tip:** Reflex arc → spinal cord (NOT brain) — very commonly asked!`
  },

  {
    keys: ['reproduction', 'asexual reproduction', 'sexual reproduction', 'budding', 'binary fission', 'spore formation', 'fragmentation', 'vegetative propagation', 'pollination', 'fertilisation'],
    ans: `**🌱 Reproduction**

**Asexual Reproduction (one parent, identical offspring):**
- **Binary Fission:** Amoeba, Bacteria
- **Budding:** Hydra, Yeast
- **Spore Formation:** Rhizopus (bread mould), Ferns
- **Fragmentation:** Spirogyra
- **Regeneration:** Planaria
- **Vegetative Propagation:** Potato (tuber), Rose (cutting), Bryophyllum (leaf)

**Sexual Reproduction (two parents, variation in offspring):**
Male gamete + Female gamete → Zygote → New organism

**Pollination:**
- Self-pollination — same flower/plant
- Cross-pollination — different plant (agents: wind, insects, water)

**Human Reproduction:**
- Fertilisation in oviduct → Zygote → Uterus (implantation) → Embryo (9 months) → Birth

**Contraception types:** Barrier (condom), Chemical (pills), Surgical (vasectomy/tubectomy)

📌 **Board Tips:**
- Asexual = fast, genetically identical
- Sexual = genetic variation, better adaptability`
  },

  {
    keys: ['environment', 'ecosystem', 'food chain', 'food web', 'trophic level', 'ozone layer', 'biodegradable', 'non-biodegradable', 'biological magnification', 'energy flow', 'ten percent law'],
    ans: `**🌍 Our Environment**

**Ecosystem:** Community of living organisms + their physical environment interacting together.

**Food Chain:** Producer → Primary Consumer → Secondary → Tertiary Consumer
*Grass → Grasshopper → Frog → Snake → Eagle*

**10% Energy Law (Lindeman):**
Only **10%** of energy transfers to next trophic level.
(90% lost as heat)
→ Short food chains are more efficient

**Trophic Levels:**
- T1: Producers (plants)
- T2: Herbivores
- T3: Carnivores
- T4: Top carnivores

**Biodegradable:** Broken by microbes — paper, fruit peels, cotton, wool
**Non-biodegradable:** NOT broken — plastic, DDT, glass, metals

**Ozone Layer (O₃):**
- Located in stratosphere (15-35 km altitude)
- Blocks harmful UV radiation from Sun
- **Depleted by:** CFCs (chlorofluorocarbons) from fridges, ACs, aerosols

**Biological Magnification:** Concentration of DDT increases at higher trophic levels (most at top carnivore)

📌 **Board Tips:**
- 10% law = only 10% energy passed on
- CFCs → ozone hole (UV → skin cancer, cataracts)`
  },

  /* ══ ENGLISH — FIRST FLIGHT ══ */

  {
    keys: ['letter to god', 'lencho', 'faith in god', 'hailstorm', 'post office lencho'],
    ans: `**📖 A Letter to God — First Flight Ch 1**
*Author: G.L. Fuentes (translated from Spanish)*

**Plot:**
Lencho, a hardworking farmer, writes a letter to God asking for 100 pesos after a hailstorm destroys his crops. The postmaster, moved by Lencho's unshakeable faith, collects 70 pesos from post office employees and sends it. Lencho receives it but writes again — accusing the post office people of stealing 30 pesos!

**Irony:** The very people who helped him are accused of theft.

**Characters:**
- **Lencho** — simple, hardworking, deeply religious farmer; great faith in God
- **Postmaster** — compassionate, moved by Lencho's faith, calls him "an ox of a man"

**Themes:**
- Unshakeable faith in God
- Irony — helpers accused of theft
- Kindness of strangers

📌 **Board Questions:**
- Why did Lencho write to God? (Hailstorm destroyed crops, needed 100 pesos)
- What did the postmaster do? (Collected 70 pesos from staff and sent it)
- What is the irony? (Lencho accuses helpers of stealing)`
  },

  {
    keys: ['nelson mandela', 'long walk to freedom', 'apartheid', 'anc', 'inauguration', 'robben island', 'twin obligations'],
    ans: `**📖 Nelson Mandela: Long Walk to Freedom — First Flight Ch 2**

**Context:** Mandela's autobiography excerpt — his inauguration as South Africa's first Black President (10 May 1994).

**Apartheid:** System of racial segregation in South Africa (whites superior, Blacks oppressed).

**Key Events:**
- ANC (African National Congress) — freedom movement
- Mandela imprisoned 27 years in **Robben Island**
- Inauguration on 10 May 1994

**Twin Obligations:**
1. Obligations to family
2. Obligations to people/community/nation

**Famous Quote:** *"A brave man is not he who does not feel afraid, but he who conquers that fear."*

**Themes:**
- Freedom, equality, justice
- Courage and sacrifice
- The cost of racial discrimination

📌 **Board Questions:**
- What was apartheid? (Racial segregation system)
- What did Mandela mean by twin obligations?
- Why is 10 May significant? (First democratic government inauguration)`
  },

  {
    keys: ['two stories about flying', 'his first flight seagull', 'black aeroplane', 'mysterious plane', 'young seagull afraid'],
    ans: `**📖 Two Stories About Flying — First Flight Ch 3**

**Story 1 — His First Flight (Liam O'Flaherty):**
A young seagull is afraid to fly. His entire family flies away, leaving him alone on the ledge. Desperate from hunger, he dives for a piece of fish — and instinctively starts flying.
**Theme:** Overcoming fear; hunger/desperation as motivation for courage

**Story 2 — Black Aeroplane (Frederick Forsyth):**
A pilot flying from Paris to London enters a storm cloud. A mysterious black plane guides him safely to an airport. On landing, the air traffic controller says no other aircraft was flying that night.
**Theme:** Mystery and the unknown; gratitude for unexpected help

📌 **Board Questions:**
- How did the young seagull overcome fear? (Hunger forced him to dive — and he flew)
- Who was the mysterious pilot? (Unknown — left as a mystery in the story)
- What feeling does the narrator have at the end? (Gratitude, wonder)`
  },

  {
    keys: ['anne frank', 'diary of anne frank', 'kitty diary', 'holocaust', 'anne diary best friend', 'nazi'],
    ans: `**📖 From the Diary of Anne Frank — First Flight Ch 4**

**Context:** Anne Frank, a German-Jewish girl, wrote a real diary while hiding from Nazis during WWII in Amsterdam (1942–1944).

**Key Points:**
- Anne names her diary **"Kitty"** — her closest friend
- She felt she had no true friend to confide in
- She discusses how teachers misunderstand students; friends understand better
- She prays to God for someone who could be a real friend

**Historical Context:**
- **Holocaust** — Nazi Germany's genocide of Jews
- Anne and her family hid in a "Secret Annex" for 2 years
- Discovered in 1944; Anne died in Bergen-Belsen concentration camp (1945)
- Her diary published after the war by her father Otto Frank

**Themes:**
- Loneliness and the need for friendship
- Writing as an outlet for pain
- The horror of the Holocaust

📌 **Board Questions:**
- Why did Anne consider her diary her best friend?
- What were Anne's views on teachers?`
  },

  {
    keys: ['amanda poem', 'amanda!', 'robin klein', 'mermaid amanda', 'orphan amanda', 'rapunzel amanda', 'nagging poem'],
    ans: `**📖 Amanda! — First Flight Poem 6**
*Poet: Robin Klein*

**Summary:**
Amanda, a young girl, is constantly nagged by an adult about her posture, homework, chocolate, etc. While the adult lectures, Amanda daydreams of freedom — as a mermaid, a free orphan, Rapunzel in a tower (without the prince).

**Three Daydreams:**
1. **Mermaid** — drifting peacefully in sea (when nagged about posture)
2. **Orphan** — roaming barefoot, free, making patterns in dust (when nagged about homework)
3. **Rapunzel** — living alone in a tower, never letting anyone in (when nagged about chocolate)

**Themes:**
- Overprotection and its effects on children
- Child's need for freedom and imagination
- Irony — adult thinks Amanda is sulky/moody, but nagging causes it

**Tone:** Ironic, gentle humour

📌 **Board Questions:**
- What does Amanda dream of and why? (Freedom from constant nagging)
- What does the last stanza suggest? (Adult thinks Amanda is moody — irony)`
  },

  {
    keys: ['dust of snow', 'robert frost', 'crow snow poem', 'hemlock tree', 'rued'],
    ans: `**📖 Dust of Snow — First Flight Poem 1**
*Poet: Robert Frost*

**Summary:** A crow shakes snow dust from a hemlock tree onto the poet. This small, simple moment lifts his sad mood and saves what remains of a ruined day.

**Symbols:**
- **Crow** — usually an omen of bad luck, here becomes a positive agent
- **Hemlock tree** — poisonous tree, yet brings something positive
- **Dust of snow** — small, trivial act; yet powerful impact

**Theme:** Small moments in nature can heal the mind. Nature has transformative power. Joy can come from unexpected sources.

**Structure:** 2 stanzas of 4 lines each; simple language, deep meaning

📌 **Board Questions:**
- What is the significance of crow and hemlock tree being negative symbols?
- How did the poet's mood change? (From rued/sad → hopeful, one part of the day saved)`
  },

  {
    keys: ['fire and ice poem', 'fire and ice frost', 'desire hate poem', 'end of world poem'],
    ans: `**📖 Fire and Ice — First Flight Poem 2**
*Poet: Robert Frost*

**Summary:** Frost says the world will end either by fire (desire) or ice (hatred). He prefers fire — desire is so intense it could destroy the world. But if the world had to perish twice, ice (hatred) would suffice.

**Symbolism:**
- **Fire** → Desire, passion, greed, conflict, war
- **Ice** → Hatred, indifference, cruelty, envy

**Theme:** Human emotions — desire and hatred — can lead to the world's destruction. A warning about unchecked human emotions.

**Poetic Devices:** Metaphor (fire/ice), Symbolism, Brevity

**Tone:** Contemplative, philosophical, subtly humorous

📌 **Board Questions:**
- What does fire symbolise? (Desire, greed, passion)
- What does ice represent? (Hatred, cold indifference)
- Which does the poet prefer, and why?`
  },

  {
    keys: ['the necklace', 'matilda', 'maupassant', 'loisel', 'diamond necklace fake', 'footprints necklace'],
    ans: `**📖 The Necklace — Footprints Without Feet Ch 7**
*Author: Guy de Maupassant*

**Plot:**
Matilda Loisel, a beautiful but dissatisfied woman, borrows a diamond necklace from her rich friend Mme Forestier for a ball. She loses it! The Loisels spend the next **10 years** working in poverty to repay a loan they took to buy a replacement necklace worth 36,000 francs. Finally, when Matilda meets Mme Forestier and confesses — she reveals the original necklace was **FAKE** (paste/glass)!

**Irony:** Ten years of suffering for a worthless necklace. Honesty would have saved everything.

**Characters:**
- **Matilda Loisel** — proud, vain, dissatisfied; wants luxury but doesn't have it
- **M. Loisel** — loving, devoted husband
- **Mme Forestier** — wealthy friend; the bearer of the shocking truth

**Themes:** Pride leads to downfall; honesty is the best policy; irony of fate

📌 **Board Questions:**
- Why was Matilda unhappy? (Wanted luxury she couldn't afford)
- What is the twist ending? (The original necklace was fake/artificial)
- What lesson does the story teach? (Honesty, contentment)`
  },

  {
    keys: ['footprints without feet', 'griffin', 'invisible man', 'invisible scientist', 'h.g. wells', 'invisible drug'],
    ans: `**📖 Footprints Without Feet — Footprints Ch 5**
*Author: H.G. Wells*

**Plot:**
Griffin, a brilliant but unscrupulous scientist, discovers how to make himself invisible by swallowing a special drug. He uses this power for crime — burns his landlord's house, robs a clergyman, steals from a shop, and beats up a policeman. He is finally caught when his invisible body shows footprints in the snow and eventually gets exposed.

**Key Points:**
- Griffin = irresponsible use of scientific discovery
- Invisible but footprints visible in snow → how he is first noticed
- He terrorises people at Iping Village

**Themes:**
- Science can be misused dangerously
- Power without morality/responsibility is destructive

**Mrs Hall:** Inn owner in Iping; driven out of her own inn by Griffin

📌 **Board Questions:**
- How was Griffin first discovered by the two boys? (Muddy footprints in snow)
- What crimes did Griffin commit?
- Was Griffin's discovery a boon or a bane? (A bane — he misused it)`
  },

  {
    keys: ['book that saved the earth', 'mother goose', 'think tank', 'martian invasion', 'noodle', 'alien book'],
    ans: `**📖 The Book That Saved the Earth — Footprints Ch 10**

**Setting:** 25th century. Historian in a "Museum of Ancient History" narrates how a book saved Earth in the 21st century.

**Plot:**
Think-Tank, the ruler of Mars, sends a team to Earth to prepare for invasion. They land in a library. Think-Tank orders them to decode the books. They find *Mother Goose* (nursery rhyme book). Noodle helps Think-Tank interpret the rhymes — he thinks "missiles" are mentioned, and that Earth is planning to attack Mars. Think-Tank panics and calls off the invasion!

**The Book:** *Mother Goose* — a simple nursery rhyme book

**Characters:**
- **Think-Tank** — arrogant, foolish Martian ruler
- **Noodle** — smarter assistant who humbly offers "corrections"
- **Captain Omega, Iota, Oop** — Martian crew

**Themes:** Power of books; misunderstanding; satire on arrogance; humour

📌 **Board Questions:**
- What was the book that saved Earth? (*Mother Goose*)
- What role did Noodle play? (Corrected Think-Tank cleverly)
- What literary device is used? (Satire, irony, humour)`
  },

  /* ══ ENGLISH — GRAMMAR ══ */

  {
    keys: ['tense chart', 'tense rules', 'present tense', 'past tense', 'future tense', 'perfect tense', 'continuous tense'],
    ans: `**📝 Tenses — Complete Chart**

**Present:**
- Simple: She **writes** every day.
- Continuous: She **is writing** now. *(is/am/are + V-ing)*
- Perfect: She **has written** the letter. *(has/have + V3)*
- Perfect Continuous: She **has been writing** for 2 hours. *(has/have + been + V-ing)*

**Past:**
- Simple: She **wrote** yesterday. *(V2)*
- Continuous: She **was writing** at 5 pm. *(was/were + V-ing)*
- Perfect: She **had written** before he came. *(had + V3)*
- Perfect Continuous: She **had been writing** for hours. *(had been + V-ing)*

**Future:**
- Simple: She **will write** tomorrow. *(will/shall + V1)*
- Continuous: She **will be writing** at 5.
- Perfect: She **will have written** by then.

**Signal Words:**
- Yesterday/ago/last → Simple Past
- Just/already/yet/ever → Present Perfect
- Since (point) / For (period) → Perfect Continuous

📌 **Board Tip:** "Since" + point of time; "For" + period of time`
  },

  {
    keys: ['active voice', 'passive voice', 'active passive conversion', 'passive transformation', 'voice in english'],
    ans: `**📝 Active & Passive Voice**

**Active:** Subject does the action.
**Passive:** Subject receives the action.

**Formula:** Object + *be* (correct tense) + Past Participle (V3) + by + Subject

**Tense Conversions:**
| Tense | Active | Passive |
|---|---|---|
| Simple Present | eats | **is/are eaten** |
| Simple Past | ate | **was/were eaten** |
| Present Continuous | is eating | **is being eaten** |
| Past Continuous | was eating | **was being eaten** |
| Present Perfect | has eaten | **has been eaten** |
| Past Perfect | had eaten | **had been eaten** |
| Simple Future | will eat | **will be eaten** |
| Modals | can eat | **can be eaten** |

**Example:**
Active: Ram writes a letter.
Passive: A letter **is written** by Ram.

**Note:** Drop "by + agent" if the doer is unknown, obvious, or unimportant.

📌 **Board Tip:** Questions (active) → use if/whether or wh-word in passive`
  },

  {
    keys: ['direct speech', 'indirect speech', 'reported speech', 'narration change', 'reporting verb', 'backshift'],
    ans: `**📝 Direct & Indirect Speech**

**Rules for Changing to Indirect:**
1. Remove quotation marks
2. **Tense shifts back (backshift)**
3. **Pronouns change** (I/we → he/she/they based on context)
4. **Time/place words change**

**Tense Changes:**
| Direct | → | Indirect |
|---|---|---|
| is/are | → | was/were |
| was/were | → | had been |
| will | → | would |
| has/have + V3 | → | had + V3 |
| can | → | could |
| may | → | might |

**Time/Place Changes:**
- today → that day | tomorrow → the next day
- yesterday → the previous day | here → there | now → then

**Statement:** He said, "I am tired." → He said that he **was** tired.
**Question:** She asked, "Are you coming?" → She asked if I **was** coming.
**Command:** He said, "Close the door." → He told me to close the door.

📌 **Board Tip:** Questions in indirect: yes/no → *if/whether*, wh-question → wh-word`
  },

  /* ══ SOCIAL SCIENCE — HISTORY ══ */

  {
    keys: ['nationalism in europe', 'french revolution nationalism', 'romanticism nationalism', 'germany unification', 'italy unification', 'bismarck', 'garibaldi', 'mazzini', 'treaty of vienna', 'nation state'],
    ans: `**🌍 Rise of Nationalism in Europe — History Ch 1**

**French Revolution (1789):**
- Birth of idea of nation-state and popular sovereignty
- Liberty, Equality, Fraternity — ideals of revolution
- *La Marseillaise* became national anthem

**Romanticism:** Cultural movement that promoted:
- Folk songs, dances, stories as basis of national identity
- Language as political tool of national unity (Germany — vernacular German)

**Unification of Germany:**
- Led by **Otto von Bismarck** ("Blood and Iron" policy)
- Won 3 wars against Denmark, Austria, France
- Germany unified in **1871**, Prussian King became Kaiser

**Unification of Italy:**
- **Mazzini** — ideological father (Young Italy movement)
- **Cavour** — statecraft and diplomacy
- **Garibaldi** — military leader (led "Red Shirts")
- Unified in **1861**

**Treaty of Vienna (1815):** Conservative powers (Austria, Russia, Britain, Prussia) restored old monarchies after Napoleon.

**1848 Revolution:** Liberal middle class revolutions across Europe demanding constitutions.

📌 **Board Tips:**
- Bismarck = Germany, Garibaldi = soldier of Italy
- Mazzini = ideological base, Cavour = diplomat`
  },

  {
    keys: ['nationalism in india', 'non-cooperation movement', 'civil disobedience movement', 'quit india movement', 'dandi march', 'khilafat movement', 'gandhi ji', 'simon commission', 'chauri chaura', 'rowlatt act'],
    ans: `**🌍 Nationalism in India — History Ch 2**

**Rowlatt Act (1919):** Allowed imprisonment without trial → Gandhi called for hartal (strike).

**Non-Cooperation Movement (1920–22):**
- Combined with **Khilafat Movement** (Ali Brothers — Muhammad Ali, Shaukat Ali)
- Boycott: British goods, schools, courts, legislative councils
- **Stopped** after Chauri Chaura incident (Feb 1922) — mob burned police station, 22 policemen killed

**Simon Commission (1927):** No Indian members → "Simon Go Back" protests

**Civil Disobedience Movement (1930):**
- **Dandi March: 12 March 1930** — Gandhi walked 240 miles to Dandi to break salt law
- Nationwide civil disobedience: non-payment of revenue, boycott of British goods
- **Gandhi-Irwin Pact (1931)** → Congress attended 2nd Round Table Conference

**Quit India Movement (1942):**
- **"Do or Die"** slogan
- Most radical — mass arrests, Gandhi/Nehru imprisoned

**Participation:**
- Peasants → stopped paying revenue
- Women → picketed liquor shops, joined marches
- Workers → strikes in cities

📌 **Board Tips:**
- **Dandi March: 12 March 1930** — must memorise!
- Chauri Chaura → Gandhi stopped Non-Cooperation`
  },

  /* ══ SOCIAL SCIENCE — GEOGRAPHY ══ */

  {
    keys: ['resources and development', 'types of resources', 'renewable resource', 'non-renewable', 'biotic', 'abiotic', 'land use', 'soil types', 'alluvial soil', 'black soil', 'laterite soil', 'soil conservation'],
    ans: `**🌍 Resources & Development — Geography Ch 1**

**Classification of Resources:**
- **By Origin:** Biotic (forests, animals) / Abiotic (rocks, minerals)
- **By Exhaustibility:** Renewable (solar, wind, water) / Non-renewable (coal, petroleum)
- **By Ownership:** Individual / Community / National / International

**Soil Types in India:**
| Soil | Region | Best for |
|---|---|---|
| **Alluvial** (most fertile) | Ganga-Yamuna plains | Rice, wheat, sugarcane |
| **Black (Regur)** | Deccan plateau (Maharashtra) | Cotton |
| **Red & Yellow** | Odisha, Chhattisgarh | Less fertile |
| **Laterite** | Karnataka, Kerala | Tea, cashew, coffee |
| **Mountain** | Himalayas | Forests, orchards |
| **Arid (Desert)** | Rajasthan | Sandy, low fertility |

**Soil Conservation Methods:**
- Terrace farming (hills)
- Contour ploughing (slopes)
- Strip cropping
- Shelter belts (trees planted in rows)
- Afforestation, check dams

📌 **Board Tip:** Alluvial = most fertile (most of India), Black soil = best for cotton`
  },

  {
    keys: ['power sharing', 'belgium', 'sri lanka', 'majoritarianism', 'federalism', 'forms of power sharing', 'accommodation belgium', 'ethnic conflict sri lanka'],
    ans: `**🌍 Power Sharing — Civics Ch 1**

**Why Power Sharing is Important:**
- Reduces conflict between social groups
- Ensures political stability and peace
- Prevents tyranny of majority over minority
- Respects the diversity of citizens

**Belgium vs Sri Lanka:**
| | Belgium | Sri Lanka |
|---|---|---|
| Communities | Dutch, French, German speakers | Sinhala (74%), Tamil (18%) |
| Approach | **Accommodation** (power sharing) | **Majoritarianism** (Sinhala supremacy) |
| Result | Stable democracy, peace | Civil war (1983–2009), thousands died |

**Belgium's Solution:**
- Equal representation in central govt
- Regional govt — Flemish (Dutch) and Wallonia (French) regions
- Brussels — separate govt for both communities

**Forms of Power Sharing:**
1. **Horizontal** — Among organs of government (legislature, executive, judiciary)
2. **Vertical** — Among levels of government (Centre, State, Local)
3. **Community/Social** — Reserved seats, separate electorates
4. **Political** — Coalition governments, sharing among parties

📌 **Board Tips:**
- Belgium = power sharing success; Sri Lanka = failure example
- Prudential reason + moral reason for power sharing`
  },

  {
    keys: ['development economics', 'per capita income', 'hdi', 'human development index', 'national development', 'sustainable development', 'kerala development'],
    ans: `**🌍 Development — Economics Ch 1**

**Development** = More than just income — includes health, education, freedom, sustainability.

**Per Capita Income = Total National Income / Total Population**
Used by World Bank to classify nations.

**HDI — Human Development Index (by UNDP):**
Measures 3 dimensions:
1. Long, healthy life → **Life expectancy**
2. Knowledge → **Mean years of schooling + Expected years**
3. Standard of living → **Per Capita GNI (Gross National Income)**

**Why Income Alone is NOT Enough:**
- **Kerala** has lower per capita than Punjab, but better literacy and life expectancy
- **Maharashtra** is richer but has worse human development indicators in some districts

**Sustainable Development:**
Development that meets present needs **without** compromising future generations' ability to meet their needs.

**World Bank Criterion:**
- High income countries (>12,536 USD per capita) — developed
- Low/middle income — developing

📌 **Board Tips:**
- HDI considers 3 factors: life expectancy, education, income
- Bhutan uses Gross National Happiness as development goal`
  },

  {
    keys: ['money and credit', 'barter system', 'bank loan', 'formal credit', 'informal credit', 'self help group', 'shg', 'collateral', 'debt trap', 'rbi'],
    ans: `**🌍 Money & Credit — Economics Ch 3**

**Barter System Problem:** Double coincidence of wants — both parties must want exactly what the other has.

**Money as Medium of Exchange:** Solves barter problems. Accepted by everyone.

**Credit (Loan):**
- **Terms of credit:** Interest rate, collateral, documents, repayment schedule
- **Collateral:** Asset pledged as security (land, building, gold, deposits)

**Formal vs Informal Credit:**
| | Formal | Informal |
|---|---|---|
| Sources | Banks, cooperatives | Moneylenders, relatives, merchants |
| Regulated by | **RBI** | Not regulated |
| Interest rates | Lower | **Higher** |
| Risk | Safer | Debt trap possible |

**Self-Help Groups (SHG):**
- Groups of 15–20 poor members (mostly women)
- Save regularly, take loans among themselves at low interest
- Help escape moneylenders
- **Grameen Bank** (Bangladesh, Nobel Prize) — pioneer model

**RBI (Reserve Bank of India):** Central bank, supervises all formal credit institutions.

📌 **Board Tips:**
- Formal = RBI regulated, lower interest
- Informal credit → debt trap (very high interest)`
  },

  {
    keys: ['globalisation', 'multinational corporation', 'mnc', 'foreign trade', 'liberalisation 1991', 'wto', 'special economic zone', 'trade barrier'],
    ans: `**🌍 Globalisation & Indian Economy — Economics Ch 4**

**Globalisation:** Rapid integration of countries through trade, investment, technology and movement of people.

**MNCs (Multinational Corporations):**
- Own/control production in more than one country
- Locate in developing countries: cheap labour, close to markets, resources
- Examples: Nike, Samsung, Volkswagen, Infosys

**Foreign Trade:**
- Links domestic markets to world markets
- **Import** = buying from other countries; **Export** = selling to other countries
- Trade barrier = tax/tariff on imports (protects local industry)

**Factors Enabling Globalisation:**
1. **Technology** — internet, mobile, cheap transport (containers)
2. **Liberalisation** — removing government restrictions on trade
3. **WTO** — World Trade Organisation ensures free trade rules

**India's Liberalisation (1991):**
- Removed trade barriers, allowed MNCs, privatisation
- **SEZs (Special Economic Zones)** — no taxes for businesses

**Impact:**
- Positive: Jobs, variety, lower prices, technology transfer
- Negative: Local small industries suffer from MNC competition, inequality rises

**Fair Globalisation:** Benefits reach the poor too (worker rights, fair wages)

📌 **Board Tips:**
- 1991 = liberalisation year (very important!)
- WTO = ensures free & fair international trade`
  },

  {
    keys: ['agriculture india', 'types of farming', 'kharif crop', 'rabi crop', 'zaid crop', 'green revolution', 'rice wheat', 'tea cotton jute'],
    ans: `**🌍 Agriculture in India — Geography Ch 4**

**Types of Farming:**
- **Subsistence:** Small land, family consumption (primitive)
- **Commercial:** Large scale, market sale
- **Shifting (Jhum):** Tribal areas, slash and burn
- **Plantation:** Single cash crop, large area (tea, coffee, rubber)

**Crop Seasons:**
| Season | Sowing | Harvest | Crops |
|---|---|---|---|
| **Kharif** | June–July | Sep–Oct | Rice, Maize, Cotton, Jute, Soybean |
| **Rabi** | Oct–Nov | March–April | Wheat, Mustard, Gram, Barley |
| **Zaid** | March | June | Watermelon, Muskmelon, Cucumber |

**Important Crops & Conditions:**
- **Rice:** High rainfall, alluvial soil (West Bengal, UP, Punjab)
- **Wheat:** Cool winter, moderate rain (Punjab, Haryana)
- **Tea:** Cool climate, acidic soil, slope (Assam, West Bengal)
- **Cotton:** Black soil, dry warm climate (Maharashtra, Gujarat)
- **Jute:** High rainfall, alluvial plain (West Bengal)

**Green Revolution (1960s):**
High Yielding Variety (HYV) seeds + irrigation + fertilisers → huge increase in wheat & rice output (Punjab, Haryana)

📌 **Board Tips:**
- Kharif = summer, Rabi = winter — memorise examples!
- Black soil = cotton; Alluvial = rice, wheat`
  },

  /* ══ GENERAL ══ */

  {
    keys: ['study tip', 'how to study', 'board exam tip', 'score 90', 'score 95', 'exam preparation', 'revision strategy', 'time management study'],
    ans: `**🎯 Top Tips to Score 90+ in CBSE Boards**

**📅 Planning:**
1. Make a realistic timetable (6 hrs study + breaks)
2. Start with your weakest subject
3. Revise yesterday's content before starting new topic
4. Keep last 2 weeks ONLY for revision

**📝 Study Techniques:**
- **Pomodoro:** 25 min study → 5 min break → repeat
- **Active Recall:** Read then close book, write what you remember
- **Spaced Repetition:** Revise after 1 day, 3 days, 7 days, 21 days
- **Mind Maps:** Visual connections between concepts
- **Teach others:** Best test of your understanding

**📋 For Boards Specifically:**
- NCERT first — 80% questions are directly from NCERT
- Solve last **5 years CBSE papers** — absolutely essential
- Practise writing answers in time conditions
- Learn to draw and label diagrams (Biology, Physics)
- Memorise formulas with daily 10-minute revision

**⏰ Last Week Strategy:**
- Only revision — NO new topics
- Mock tests under real exam conditions
- Sleep 8 hours — memory consolidates during sleep
- Light exercise → better focus

📌 **Secret:** Board toppers = NCERT mastery + PYQ practice + neat presentation`
  },

  {
    keys: ['hello', 'hi ', 'hey ', 'hii', 'helo', 'good morning', 'good evening', 'good afternoon', 'how are you', 'namaste', 'sup '],
    ans: `👋 **Hey! I'm Owlix.**

Your AI on AbiLearn — built for CBSE Class 10, but here for whatever you need.

**I can help you with:**
- 📐 **Maths** — formulas, theorems, step-by-step solutions
- 🔬 **Science** — Physics, Chemistry, Biology explained clearly
- 📖 **English** — summaries, themes, grammar, writing
- 🌍 **Social Science** — History, Geography, Civics, Economics
- 🧮 **Quick calculations** — just type any arithmetic expression
- 🎯 **Exam strategy** — tips, time management, board patterns

I give direct, accurate answers. If I'm not sure, I'll tell you.

**Ask me anything.** 🦉`
  },

  {
    keys: ['thank you', 'thanks', 'thank u', 'helpful', 'great answer', 'awesome', 'perfect', 'well done owlix'],
    ans: `Glad I could help. 🦉

Ask me anything else — I'm here.`
  },

  {
    keys: ['who are you', 'what are you', 'about owlix', 'tell me about yourself', 'what can you do'],
    ans: `**🦉 I'm Owlix — your AI on AbiLearn.**

I'm a high-accuracy, built-in AI assistant designed primarily for CBSE Class 10 — but capable of much more.

**What I'm good at:**
- 📐 **Maths** — every chapter, formula, theorem, and proof technique
- 🔬 **Science** — Physics, Chemistry, Biology with clear explanations
- 📖 **English** — chapter summaries, poem analysis, grammar rules
- 🌍 **Social Science** — History, Geography, Civics, Economics
- 🧮 **Live calculations** — type any arithmetic and I compute it instantly
- 🎯 **Strategy** — how to study, manage time, and score higher

**How I work:**
I run 100% offline — no internet, no API key, no wait time. I answer from a built-in knowledge base. I'll be direct about what I know and honest when something is outside my scope.

**What I'm not:**
I'm not a general web search or live-data engine. For topics outside CBSE Class 10, my answers may be limited.

Ask me something — let's see what I can do. 🦉`
  }
];

/* ══════════════════════════════════════
   CONVERSATION HISTORY
   [{role:'user'|'assistant', content:'...'}]
   Sent to /api/chat for multi-turn context
══════════════════════════════════════ */
const CONVERSATION = [];
const MAX_CONV     = 20; // last 10 turns (20 messages)
let   _streaming   = false;

function _trimConv() {
  while (CONVERSATION.length > MAX_CONV) CONVERSATION.splice(0, 2);
}

function _addConv(role, content) {
  CONVERSATION.push({ role, content });
  _trimConv();
}

/* ══════════════════════════════════════
   UTILITIES
══════════════════════════════════════ */
const delay = ms => new Promise(r => setTimeout(r, ms));

function mdToHtml(text) {
  // 1. Extract fenced code blocks first (so their content isn't escaped/reformatted)
  const blocks = [];
  let s = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const id = 'ocb-' + Math.random().toString(36).slice(2, 9);
    const safe = code.trim()
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    blocks.push(
      `<div class="owlix-cb"><div class="owlix-cb-hd">` +
      `<span class="owlix-cb-lang">${lang || 'code'}</span>` +
      `<button class="owlix-cb-copy" onclick="owlixCopyCode('${id}')">Copy</button></div>` +
      `<pre id="${id}" class="owlix-cb-pre">${safe}</pre></div>`
    );
    return `\x00BLOCK${blocks.length - 1}\x00`;
  });

  // 2. Escape HTML in the rest
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // 3. Inline markdown
  s = s
    // Bold+italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`\n]+)`/g, '<code class="owlix-code">$1</code>')
    // Headers h3 → h1
    .replace(/^### (.+)$/gm, '<strong class="owlix-h owlix-h3">$1</strong>')
    .replace(/^## (.+)$/gm,  '<strong class="owlix-h owlix-h2">$1</strong>')
    .replace(/^# (.+)$/gm,   '<strong class="owlix-h owlix-h1">$1</strong>')
    // Tables (pipe rows)
    .replace(/^\|(.+)$/gm, row => {
      if (/^\|[\s\-:|]+\|/.test(row)) return ''; // separator row
      const cells = row.split('|').filter(c => c.trim());
      return '<div class="owlix-tr">' +
        cells.map(c => `<span class="owlix-td">${c.trim()}</span>`).join('') +
        '</div>';
    })
    // Horizontal rule
    .replace(/^---+$/gm, '<hr class="owlix-hr">')
    // Unordered list items
    .replace(/^[-*] (.+)$/gm, '<span class="owlix-li">• $1</span>')
    // Ordered list items
    .replace(/^(\d+)\. (.+)$/gm, '<span class="owlix-li">$1. $2</span>')
    // Paragraph breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  // 4. Restore code blocks
  s = s.replace(/\x00BLOCK(\d+)\x00/g, (_, i) => blocks[+i]);

  return s;
}

function owlixCopyCode(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const btn = el.closest('.owlix-cb')?.querySelector('.owlix-cb-copy');
  navigator.clipboard.writeText(el.textContent).then(() => {
    if (btn) { btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = 'Copy', 2000); }
  }).catch(() => {
    // fallback: select text
    const range = document.createRange();
    range.selectNode(el);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  });
}

function escOwlix(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ══════════════════════════════════════
   INSTANT MATH SOLVER
══════════════════════════════════════ */
function tryMath(msg) {
  const clean = msg.trim()
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/²/g, '**2').replace(/³/g, '**3').replace(/\^/g, '**');
  if (/^[\d\s+\-*/.()%*]+$/.test(clean) && clean.length < 120 && /\d/.test(clean)) {
    try {
      // eslint-disable-next-line no-new-func
      const r = Function('"use strict"; return (' + clean + ')')();
      if (typeof r === 'number' && isFinite(r)) {
        return `**Result:** \`${msg.trim()} = ${+r.toFixed(10)}\`\n\n*Calculated instantly ✓*`;
      }
    } catch { /* not arithmetic */ }
  }
  return null;
}

/* ══════════════════════════════════════
   MATCHING ENGINE
══════════════════════════════════════ */
function scoreEntry(entry, q) {
  let score = 0, count = 0;
  for (const k of entry.keys) {
    if (q.includes(k.toLowerCase())) { score += k.length; count++; }
  }
  if (count > 1) score += count * 4; // bonus for multi-keyword matches
  return score;
}

function findAnswer(query) {
  const q = query.toLowerCase();
  let best = null, top = 0;
  for (const e of KB) {
    const s = scoreEntry(e, q);
    if (s > top) { top = s; best = e; }
  }
  return top >= 3 ? best : null;
}

function isFollowUp(q) {
  return /\b(more|explain|example|elaborate|detail|simpler|simple|again|go on|expand|tell me more|what about|and what|continue|next|show me|give me|how about|unclear|didn'?t understand|not clear|repeat|rephrase)\b/.test(q);
}

/* getFallback is kept only as an offline emergency fallback when the
   LLM API is completely unavailable. It does NOT run as the primary
   response engine — the real LLM handles all normal questions. */
function getFallback(query) {
  const q = query.toLowerCase();
  const kbMatch = findAnswer(q);
  if (kbMatch) return kbMatch.ans;

  return `⚠️ **Owlix AI is temporarily unavailable.**\n\nI couldn't connect to the AI service right now. Please check your internet connection and try again in a moment.`;
}

/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
async function typeOut(bubble, rawText, msgs) {
  const tokens = rawText.split(/(\s+)/);
  let displayed = '';
  let count = 0;
  for (const t of tokens) {
    displayed += t;
    count++;
    if (count % 3 === 0) {
      bubble.innerHTML = mdToHtml(displayed) + '<span class="owlix-cursor"></span>';
      msgs.scrollTop = msgs.scrollHeight;
      await delay(14 + Math.random() * 18);
    }
  }
  bubble.innerHTML = mdToHtml(displayed);
  msgs.scrollTop = msgs.scrollHeight;
}

/* ══════════════════════════════════════
   UI HELPERS
══════════════════════════════════════ */
function getMsgs() { return document.getElementById('owlixMessages'); }

function addOwlixMsg(type, html) {
  const msgs = getMsgs();
  if (!msgs) return;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.innerHTML = `<div class="msg-av">${type === 'bot' ? '🦉' : '👤'}</div>
    <div><div class="msg-bbl">${html}</div><div class="msg-time">${now}</div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function createBotBubble() {
  const msgs = getMsgs();
  if (!msgs) return null;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const id = 'ob-' + Date.now();
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.innerHTML = `<div class="msg-av">🦉</div>
    <div><div class="msg-bbl" id="${id}"><span class="owlix-cursor"></span></div>
    <div class="msg-time">${now}</div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return { bubble: document.getElementById(id), msgs };
}

function showTyping() {
  const msgs = getMsgs();
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'owlix-typing-indicator';
  div.innerHTML = `<div class="msg-av">🦉</div>
    <div><div class="typing-bbl">
      <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
    </div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('owlix-typing-indicator');
  if (t) t.remove();
}

/* ══════════════════════════════════════
   LLM STREAMING ENGINE
══════════════════════════════════════ */

/**
 * Stream a response from /api/chat (Cloudflare Pages Function).
 * Writes tokens directly into `bubble` as they arrive.
 * Returns the complete text when done.
 */
async function _streamAPI(userMsg, history, kbContext, bubble, msgs) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMsg,
      history,
      context: kbContext || undefined,
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const e   = new Error(err.error || `HTTP ${resp.status}`);
    e.status  = resp.status;
    throw e;
  }

  const reader = resp.body.getReader();
  const dec    = new TextDecoder();
  let full = '';
  let buf  = '';

  bubble.innerHTML = '<span class="owlix-cursor"></span>';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const d = line.slice(6).trim();
      if (d === '[DONE]') {
        bubble.innerHTML = mdToHtml(full);
        msgs.scrollTop   = msgs.scrollHeight;
        return full;
      }
      try {
        const { text } = JSON.parse(d);
        if (text) {
          full += text;
          bubble.innerHTML = mdToHtml(full) + '<span class="owlix-cursor"></span>';
          msgs.scrollTop   = msgs.scrollHeight;
        }
      } catch { /* partial JSON — ignore */ }
    }
  }

  bubble.innerHTML = mdToHtml(full);
  msgs.scrollTop   = msgs.scrollHeight;
  return full;
}

/* ══════════════════════════════════════
   MAIN SEND
══════════════════════════════════════ */
async function sendOwlixMessage(text) {
  const win = document.getElementById('owlixWindow');
  if (win && !win.classList.contains('open')) win.classList.add('open');

  const q = (text || '').trim();
  if (!q || _streaming) return;

  addOwlixMsg('user', escOwlix(q));

  // Hide quick-reply chips after first real message
  if (CONVERSATION.length > 0) {
    const qr = document.getElementById('quickReplies');
    if (qr) qr.style.display = 'none';
  }

  // Short query guard
  if (q.length < 3) {
    const r = createBotBubble();
    if (r) r.bubble.innerHTML = mdToHtml(
      'Can you give me a bit more detail? Try asking:\n\n' +
      '- *"What is photosynthesis?"*\n' +
      '- *"Explain Newton\'s laws"*\n' +
      '- *"Write Python code to reverse a list"*\n' +
      '- Or type a calculation: `25 × 48`'
    );
    return;
  }

  // Instant arithmetic — no API call needed, faster and always accurate
  const math = tryMath(q);
  if (math) {
    await delay(150);
    const r = createBotBubble();
    if (r) r.bubble.innerHTML = mdToHtml(math);
    _addConv('user', q);
    _addConv('assistant', math);
    return;
  }

  // ── Real LLM call ───────────────────────────────────────────────────
  // Build history snapshot BEFORE adding current message
  const history = CONVERSATION.slice(-MAX_CONV);

  // KB lookup — inject relevant CBSE notes as trusted context for the LLM
  const kbMatch  = findAnswer(q);
  const kbContext = kbMatch ? kbMatch.ans : null;

  // Add user message to conversation now
  _addConv('user', q);

  // Lock UI during streaming
  _streaming = true;
  const inp = document.getElementById('owlixInput');
  const snd = document.getElementById('owlixSend');
  if (inp) inp.disabled = true;
  if (snd) snd.disabled = true;

  showTyping();
  await delay(180); // brief pause so typing indicator is visible

  let reply = '';

  try {
    removeTyping();
    const r = createBotBubble();
    if (!r) throw new Error('ui');

    reply = await _streamAPI(q, history, kbContext, r.bubble, r.msgs);

  } catch (err) {
    removeTyping();

    let msg;
    const s = err.status || 0;

    if (!navigator.onLine || err.message.toLowerCase().includes('fetch') || s === 0) {
      msg = '⚠️ **No connection.** Please check your internet and try again.';
    } else if (s === 429) {
      msg = '⚠️ **Too many requests.** Please wait a moment and try again.';
    } else if (s === 503) {
      msg = kbContext
        ? '⚠️ **AI service unavailable.** Here\'s what I have from my notes:\n\n' + kbContext
        : '⚠️ Owlix AI is not set up yet. Please check back soon.';
    } else {
      msg = kbContext
        ? '⚠️ **Couldn\'t reach AI right now.** Here\'s what I have from my notes:\n\n' + kbContext
        : '⚠️ Owlix couldn\'t respond. Please try again.';
    }

    const r = createBotBubble();
    if (r) r.bubble.innerHTML = mdToHtml(msg);
    reply = msg;

  } finally {
    _streaming = false;
    if (inp) { inp.disabled = false; inp.focus(); }
    if (snd) snd.disabled = false;
  }

  if (reply) _addConv('assistant', reply);
}

/* ══════════════════════════════════════
   STYLES
══════════════════════════════════════ */
function injectOwlixStyles() {
  if (document.getElementById('owlix-v13-styles')) return;
  const s = document.createElement('style');
  s.id = 'owlix-v13-styles';
  s.textContent = `
    .owlix-cursor {
      display:inline-block;width:2px;height:1.1em;background:#7C3AED;
      margin-left:2px;vertical-align:text-bottom;border-radius:1px;
      animation:owlix-blink 0.65s ease-in-out infinite;
    }
    @keyframes owlix-blink { 0%,100%{opacity:1} 50%{opacity:0} }
    .owlix-code {
      background:rgba(124,58,237,0.1);padding:1px 5px;border-radius:4px;
      font-family:'Courier New',monospace;font-size:0.85em;color:#5B21B6;
    }
    .msg-bbl strong { color:inherit; }
    .msg-bbl code { word-break:break-all; }
    .owlix-cb {
      background:#0f0d1f;border:1px solid rgba(124,58,237,0.3);
      border-radius:8px;margin:8px 0;overflow:hidden;
      font-family:'Courier New',Courier,monospace;
    }
    .owlix-cb-hd {
      display:flex;align-items:center;justify-content:space-between;
      padding:5px 10px;background:rgba(124,58,237,0.15);
      border-bottom:1px solid rgba(124,58,237,0.2);
    }
    .owlix-cb-lang {
      font-size:0.72em;color:#a78bfa;text-transform:uppercase;
      letter-spacing:0.06em;font-family:inherit;
    }
    .owlix-cb-copy {
      font-size:0.72em;padding:2px 8px;border-radius:4px;
      background:rgba(124,58,237,0.25);border:1px solid rgba(124,58,237,0.4);
      color:#c4b5fd;cursor:pointer;transition:background 0.2s;
    }
    .owlix-cb-copy:hover { background:rgba(124,58,237,0.45); }
    .owlix-cb-pre {
      margin:0;padding:10px 12px;overflow-x:auto;
      font-size:0.82em;line-height:1.55;color:#e2e8f0;
      white-space:pre;
    }
  `;
  document.head.appendChild(s);
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
function initOwlix() {
  const toggle = document.getElementById('owlixToggle');
  const win    = document.getElementById('owlixWindow');
  const close  = document.getElementById('owlixClose');
  const input  = document.getElementById('owlixInput');
  const send   = document.getElementById('owlixSend');
  const qrWrap = document.getElementById('quickReplies');
  if (!toggle || !win) return;

  injectOwlixStyles();
  if (input) input.placeholder = 'Ask any doubt...';

  /* Quick reply chips */
  if (qrWrap) {
    const chips = [
      { label: '📐 Quadratic Formula',     q: 'What is the quadratic formula and discriminant?' },
      { label: '⚡ Ohm\'s Law',             q: "Explain Ohm's law with formula and examples" },
      { label: '🌱 Photosynthesis',         q: 'What is the equation of photosynthesis?' },
      { label: '📖 The Necklace',           q: 'Summary of The Necklace story from Footprints' },
      { label: '🌍 Dandi March',            q: 'What was the Dandi March and why was it important?' },
      { label: '🎯 Board Exam Tips',        q: 'Give me top tips to score 90+ in CBSE board exams' }
    ];
    qrWrap.innerHTML = chips.map(c =>
      `<button class="qr-btn" onclick="sendOwlixMessage(${JSON.stringify(c.q)})">${c.label}</button>`
    ).join('');
  }

  /* Welcome message */
  setTimeout(() => {
    addOwlixMsg('bot', mdToHtml(
      `👋 **Hi, I'm Owlix.**\n\n` +
      `Your AI study assistant on AbiLearn — powered by real AI, built for CBSE Class 10.\n\n` +
      `I can help you with:\n` +
      `- 📐 Maths · 🔬 Science · 📖 English · 🌍 Social Science\n` +
      `- 🧮 Step-by-step solutions and explanations\n` +
      `- 📝 Board exam tips, mark weightage, and common mistakes\n` +
      `- 💻 Code blocks with syntax highlighting\n\n` +
      `Ask me anything — I give direct, accurate answers.`
    ));
  }, 350);

  /* Events */
  toggle.addEventListener('click', () => {
    win.classList.toggle('open');
    const badge = toggle.querySelector('.owlix-badge');
    if (badge && win.classList.contains('open')) badge.style.display = 'none';
  });
  if (close) close.addEventListener('click', () => win.classList.remove('open'));
  if (send)  send.addEventListener('click', submitOwlix);
  if (input) input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitOwlix(); }
  });
}

function submitOwlix() {
  const input = document.getElementById('owlixInput');
  if (!input) return;
  const text = input.value.trim();
  input.value = '';
  if (text) sendOwlixMessage(text);
}

document.addEventListener('DOMContentLoaded', initOwlix);
