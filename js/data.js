/* AbiLearn - CBSE Class 10 Content Database */
const DATA = {
  subjects: [
    {
      id: 'maths',
      name: 'Mathematics',
      icon: '📐',
      color: 'maths',
      description: 'Algebra, Geometry, Trigonometry & Statistics',
      chapters: [
        {
          id: 1, title: 'Real Numbers',
          subtitle: "Euclid's Division, HCF, LCM, Irrationals",
          keyPoints: [
            "Euclid's Division Lemma: For any two positive integers a and b, a = bq + r where 0 ≤ r < b",
            "Fundamental Theorem of Arithmetic: Every composite number can be expressed as a product of primes uniquely",
            "HCF × LCM = Product of two numbers (only for two numbers)",
            "√2, √3, √5 are all irrational numbers — their decimal expansions are non-terminating non-repeating",
            "p/q is terminating only when q has no prime factors other than 2 and 5",
            "p/q is non-terminating repeating when q has factors other than 2 and 5"
          ],
          formulas: [
            "a = bq + r  (Euclid's Division Lemma, 0 ≤ r < b)",
            "HCF(a,b) × LCM(a,b) = a × b  [for two numbers]",
            "log(ab) = log a + log b  |  log(a/b) = log a − log b"
          ],
          mcqs: [
            { q: "The decimal expansion of 17/8 is:", opts: ["Terminating","Non-terminating repeating","Non-terminating non-repeating","None of these"], ans: 0, exp: "8 = 2³, has only factor 2, so 17/8 is terminating." },
            { q: "HCF of 96 and 404 by Euclid's division is:", opts: ["4","2","8","12"], ans: 0, exp: "404 = 96×4 + 20; 96 = 20×4 + 16; 20 = 16×1 + 4; 16 = 4×4 + 0. So HCF = 4." },
            { q: "The product of two irrational numbers is:", opts: ["Always rational","Always irrational","Rational or irrational","Always an integer"], ans: 2, exp: "√2 × √2 = 2 (rational), but √2 × √3 = √6 (irrational). So it can be either." }
          ]
        },
        {
          id: 2, title: 'Polynomials',
          subtitle: 'Zeroes, Relationship with Coefficients',
          keyPoints: [
            "A polynomial p(x) = 0 has zeroes (roots) which are the x-values making p(x) zero",
            "Quadratic p(x) = ax² + bx + c has at most 2 zeroes",
            "Sum of zeroes α + β = −b/a",
            "Product of zeroes α × β = c/a",
            "For cubic p(x)=ax³+bx²+cx+d: α+β+γ = −b/a, αβ+βγ+γα = c/a, αβγ = −d/a",
            "Division Algorithm: p(x) = g(x)·q(x) + r(x)"
          ],
          formulas: [
            "Sum of zeroes = −b/a  (for ax² + bx + c)",
            "Product of zeroes = c/a  (for ax² + bx + c)",
            "p(x) = g(x) × q(x) + r(x)  [Division Algorithm]"
          ],
          mcqs: [
            { q: "If the zeroes of p(x) = x² − 5x + k are equal, then k =", opts: ["25/4","5","−5","25"], ans: 0, exp: "For equal roots, discriminant = 0. 25 − 4k = 0 ⟹ k = 25/4." },
            { q: "The number of zeroes of the polynomial shown (touching x-axis at one point and crossing at another) is:", opts: ["1","2","3","0"], ans: 1, exp: "A quadratic graph can have at most 2 zeroes." },
            { q: "If α and β are zeroes of 2x² − 5x + 3, then α + β =", opts: ["5/2","3/2","−5/2","−3/2"], ans: 0, exp: "Sum = −b/a = −(−5)/2 = 5/2." }
          ]
        },
        {
          id: 3, title: 'Pair of Linear Equations',
          subtitle: 'Graphical, Substitution, Elimination, Cross-Multiplication',
          keyPoints: [
            "General form: a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0",
            "Consistent (unique solution): a₁/a₂ ≠ b₁/b₂ — lines intersect",
            "Inconsistent (no solution): a₁/a₂ = b₁/b₂ ≠ c₁/c₂ — lines parallel",
            "Dependent (infinite solutions): a₁/a₂ = b₁/b₂ = c₁/c₂ — lines coincide",
            "Methods: Graphical, Substitution, Elimination, Cross-multiplication"
          ],
          formulas: [
            "Cross-multiplication: x/(b₁c₂−b₂c₁) = y/(c₁a₂−c₂a₁) = 1/(a₁b₂−a₂b₁)",
            "Consistent & unique: a₁/a₂ ≠ b₁/b₂",
            "Inconsistent: a₁/a₂ = b₁/b₂ ≠ c₁/c₂"
          ],
          mcqs: [
            { q: "The pair 2x + 3y = 5 and 4x + 6y = 10 has:", opts: ["Unique solution","No solution","Infinite solutions","Two solutions"], ans: 2, exp: "a₁/a₂ = 2/4 = 1/2, b₁/b₂ = 3/6 = 1/2, c₁/c₂ = 5/10 = 1/2. All equal → infinite solutions." },
            { q: "If 3x + 2y = 5 and 9x + 6y = 15, the system is:", opts: ["Consistent & unique","Inconsistent","Dependent (consistent)","None"], ans: 2, exp: "Ratios equal for all three → infinitely many solutions (dependent)." },
            { q: "For the pair 2x + y = 6 and 4x + 2y = 8, the system is:", opts: ["Consistent","Inconsistent","Dependent","Undetermined"], ans: 1, exp: "a₁/a₂ = b₁/b₂ = 1/2, but c₁/c₂ = 6/8 = 3/4 ≠ 1/2. Inconsistent — no solution." }
          ]
        },
        {
          id: 4, title: 'Quadratic Equations',
          subtitle: 'Standard Form, Factorisation, Quadratic Formula, Nature of Roots',
          keyPoints: [
            "Standard form: ax² + bx + c = 0 where a ≠ 0",
            "Methods of solving: Factorisation, Completing the Square, Quadratic Formula",
            "Discriminant D = b² − 4ac determines the nature of roots",
            "D > 0: two distinct real roots | D = 0: two equal real roots | D < 0: no real roots",
            "Every quadratic equation has exactly 2 roots (real or complex)"
          ],
          formulas: [
            "x = [−b ± √(b²−4ac)] / 2a  [Quadratic Formula / Sridharacharya Formula]",
            "Discriminant D = b² − 4ac",
            "Sum of roots = −b/a  |  Product of roots = c/a"
          ],
          mcqs: [
            { q: "The discriminant of 2x² − 4x + 3 = 0 is:", opts: ["−8","8","−4","4"], ans: 0, exp: "D = (−4)² − 4(2)(3) = 16 − 24 = −8." },
            { q: "The roots of x² − 5x + 6 = 0 are:", opts: ["2 and 3","−2 and −3","1 and 6","−1 and −6"], ans: 0, exp: "Factorising: (x−2)(x−3) = 0 → x = 2 or x = 3." },
            { q: "If a quadratic equation has D = 0, the roots are:", opts: ["Distinct and real","Equal and real","Not real","Irrational"], ans: 1, exp: "D = 0 means the discriminant is zero, giving two equal real roots." }
          ]
        },
        {
          id: 5, title: 'Arithmetic Progressions',
          subtitle: 'nth Term, Sum Formula, Common Difference',
          keyPoints: [
            "An AP has a constant difference 'd' between consecutive terms",
            "General term: aₙ = a + (n−1)d",
            "Sum of first n terms: Sₙ = n/2 [2a + (n−1)d]",
            "If last term l is known: Sₙ = n/2 (a + l)",
            "Middle term of an AP with odd n terms is the average of first and last"
          ],
          formulas: [
            "aₙ = a + (n−1)d  [nth term]",
            "Sₙ = n/2 [2a + (n−1)d]  [Sum of n terms]",
            "Sₙ = n/2 (a + l)  [when last term l is known]",
            "d = a₂ − a₁  [Common difference]"
          ],
          mcqs: [
            { q: "The 10th term of AP 3, 7, 11, 15, ... is:", opts: ["39","41","43","45"], ans: 0, exp: "a=3, d=4. a₁₀ = 3 + (10−1)×4 = 3 + 36 = 39." },
            { q: "Sum of first 20 natural numbers is:", opts: ["190","200","210","220"], ans: 2, exp: "S = 20/2 × (1+20) = 10 × 21 = 210." },
            { q: "Which term of AP 3, 8, 13, 18 ... is 78?", opts: ["14th","15th","16th","17th"], ans: 2, exp: "78 = 3 + (n−1)5 → 75 = (n−1)5 → n−1 = 15 → n = 16." }
          ]
        },
        {
          id: 6, title: 'Triangles',
          subtitle: "Similarity, Thales' Theorem, Pythagoras Theorem",
          keyPoints: [
            "Basic Proportionality Theorem (Thales): If a line is parallel to one side of a triangle, it divides the other two sides proportionally",
            "Converse of BPT: If a line divides two sides of a triangle proportionally, it is parallel to the third side",
            "Similar triangles: AAA, SSS, SAS similarity criteria",
            "Pythagoras Theorem: In right-angled triangle, hypotenuse² = sum of squares of other two sides",
            "Ratio of areas of similar triangles = (ratio of corresponding sides)²"
          ],
          formulas: [
            "If DE ∥ BC: AD/DB = AE/EC  [BPT]",
            "Pythagoras: AC² = AB² + BC²  (AC is hypotenuse)",
            "Area(△ABC)/Area(△DEF) = (AB/DE)² = (BC/EF)² = (AC/DF)²"
          ],
          mcqs: [
            { q: "In △ABC, DE ∥ BC, AD = 4, DB = 6, AE = 5. EC = ?", opts: ["7.5","6","8","5"], ans: 0, exp: "By BPT: AD/DB = AE/EC → 4/6 = 5/EC → EC = 7.5." },
            { q: "Triangles ABC and DEF are similar. AB = 4, DE = 6. Area of △ABC : Area of △DEF =", opts: ["4:9","2:3","16:36","9:4"], ans: 0, exp: "Ratio of areas = (AB/DE)² = (4/6)² = 16/36 = 4:9." },
            { q: "In a right triangle, the hypotenuse is 13 cm and one side is 5 cm. The third side is:", opts: ["12 cm","11 cm","8 cm","10 cm"], ans: 0, exp: "Using Pythagoras: 13² − 5² = 169 − 25 = 144 = 12²." }
          ]
        },
        {
          id: 7, title: 'Coordinate Geometry',
          subtitle: 'Distance Formula, Section Formula, Area of Triangle',
          keyPoints: [
            "Distance between two points P(x₁,y₁) and Q(x₂,y₂)",
            "Midpoint of PQ divides it in ratio 1:1",
            "Section formula: point dividing AB in ratio m:n (internally)",
            "Collinear points: Area of triangle formed = 0",
            "Centroid of triangle divides each median in ratio 2:1"
          ],
          formulas: [
            "PQ = √[(x₂−x₁)² + (y₂−y₁)²]  [Distance Formula]",
            "Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2)",
            "Section formula (internal): ((mx₂+nx₁)/(m+n), (my₂+ny₁)/(m+n))",
            "Area of △ = ½|x₁(y₂−y₃) + x₂(y₃−y₁) + x₃(y₁−y₂)|"
          ],
          mcqs: [
            { q: "Distance between (3, 4) and the origin is:", opts: ["5","7","4","3"], ans: 0, exp: "Distance = √(3²+4²) = √(9+16) = √25 = 5." },
            { q: "Midpoint of (2, 6) and (8, 4) is:", opts: ["(5,5)","(4,5)","(5,4)","(6,5)"], ans: 0, exp: "((2+8)/2, (6+4)/2) = (5, 5)." },
            { q: "The point dividing (−1, 7) and (4, −3) in ratio 2:3 internally is:", opts: ["(1, 3)","(2, 3)","(1, 4)","(3, 1)"], ans: 0, exp: "x=(2×4+3×(−1))/(2+3)=(8−3)/5=1; y=(2×(−3)+3×7)/5=(−6+21)/5=3. So (1,3)." }
          ]
        },
        {
          id: 8, title: 'Introduction to Trigonometry',
          subtitle: 'Ratios, Standard Values, Identities',
          keyPoints: [
            "Trigonometric ratios: sin, cos, tan, cosec, sec, cot (based on right triangle)",
            "sin θ = Perpendicular/Hypotenuse | cos θ = Base/Hypotenuse | tan θ = Perpendicular/Base",
            "sin²θ + cos²θ = 1  (Pythagoras identity)",
            "1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ",
            "sin(90°−θ) = cosθ | cos(90°−θ) = sinθ | tan(90°−θ) = cotθ"
          ],
          formulas: [
            "sin²θ + cos²θ = 1",
            "1 + tan²θ = sec²θ  |  1 + cot²θ = cosec²θ",
            "sin 0° = 0, sin 30° = 1/2, sin 45° = 1/√2, sin 60° = √3/2, sin 90° = 1",
            "cos 0° = 1, cos 30° = √3/2, cos 45° = 1/√2, cos 60° = 1/2, cos 90° = 0",
            "tan 0° = 0, tan 30° = 1/√3, tan 45° = 1, tan 60° = √3, tan 90° = undefined"
          ],
          mcqs: [
            { q: "sin²60° + cos²60° =", opts: ["1","0","√3/2","1/2"], ans: 0, exp: "sin²θ + cos²θ = 1 for all θ. Always 1." },
            { q: "tan 45° × sin 90° =", opts: ["1","0","√2","2"], ans: 0, exp: "tan 45° = 1, sin 90° = 1. Product = 1." },
            { q: "If sin A = 3/5, cos A =", opts: ["4/5","3/4","5/4","5/3"], ans: 0, exp: "sin²A + cos²A = 1 → cos²A = 1 − 9/25 = 16/25 → cos A = 4/5." }
          ]
        },
        {
          id: 9, title: 'Applications of Trigonometry',
          subtitle: 'Heights and Distances, Angle of Elevation/Depression',
          keyPoints: [
            "Angle of Elevation: angle above horizontal when looking UP at an object",
            "Angle of Depression: angle below horizontal when looking DOWN at an object",
            "Line of sight: straight line from eye to the object",
            "tan θ = height / horizontal distance (most common formula used)",
            "Horizontal distance remains the same for angle of elevation and depression from same point"
          ],
          formulas: [
            "tan(elevation angle) = height of object / horizontal distance",
            "Height = distance × tan θ",
            "Distance = height / tan θ",
            "For two different angles: use both triangles to form simultaneous equations"
          ],
          mcqs: [
            { q: "A tower casts a shadow of 40m. The sun's angle of elevation is 30°. Height of tower:", opts: ["40/√3 m","40√3 m","40 m","20 m"], ans: 0, exp: "tan 30° = h/40 → 1/√3 = h/40 → h = 40/√3." },
            { q: "A ladder 10m long leans against a wall making 60° with the ground. Height reached:", opts: ["5√3 m","5 m","10√3 m","10 m"], ans: 0, exp: "sin 60° = h/10 → h = 10 × √3/2 = 5√3 m." },
            { q: "The angle of depression of a boat from the top of a cliff 100m high is 45°. The distance of boat from cliff:", opts: ["100 m","200 m","50 m","100√3 m"], ans: 0, exp: "tan 45° = 100/d → 1 = 100/d → d = 100 m." }
          ]
        },
        {
          id: 10, title: 'Circles',
          subtitle: 'Tangent to a Circle, Number of Tangents',
          keyPoints: [
            "A tangent to a circle touches it at exactly one point (point of tangency)",
            "The tangent at any point is perpendicular to the radius at that point",
            "From an external point, exactly 2 tangents can be drawn to a circle",
            "Lengths of tangents from an external point are equal",
            "A line can intersect a circle at 0, 1 (tangent), or 2 points"
          ],
          formulas: [
            "If PA and PB are tangents from external point P: PA = PB",
            "Radius ⊥ Tangent at point of tangency",
            "Angle in alternate segment = inscribed angle subtending the same arc"
          ],
          mcqs: [
            { q: "Two tangents PA and PB are drawn from an external point P. If PA = 8 cm, PB =", opts: ["8 cm","4 cm","16 cm","Depends on the circle"], ans: 0, exp: "Tangents from external point are equal. PA = PB = 8 cm." },
            { q: "A tangent to a circle makes an angle with the radius at the point of tangency:", opts: ["90°","60°","45°","180°"], ans: 0, exp: "By theorem, tangent is perpendicular to radius at point of tangency." },
            { q: "From an external point, how many tangents can be drawn to a circle?", opts: ["2","1","3","Infinite"], ans: 0, exp: "Exactly 2 tangents can always be drawn from an external point." }
          ]
        },
        {
          id: 11, title: 'Areas Related to Circles',
          subtitle: 'Area of Sector, Segment, Combinations',
          keyPoints: [
            "Area of circle = πr²; Circumference = 2πr",
            "Area of sector with angle θ = (θ/360°) × πr²",
            "Length of arc = (θ/360°) × 2πr",
            "Area of minor segment = Area of sector − Area of triangle",
            "Area of major segment = Area of circle − Area of minor segment"
          ],
          formulas: [
            "Area of sector = (θ/360) × πr²",
            "Arc length = (θ/360) × 2πr",
            "Area of minor segment = (θ/360)πr² − ½r² sinθ",
            "Area of ring = π(R² − r²)  [R = outer, r = inner radius]"
          ],
          mcqs: [
            { q: "Area of sector with radius 7cm and angle 90° is (π = 22/7):", opts: ["38.5 cm²","77 cm²","154 cm²","19.25 cm²"], ans: 0, exp: "(90/360) × (22/7) × 7² = (1/4) × 22 × 7 = 154/4 = 38.5 cm²." },
            { q: "The length of arc in a circle of radius 6cm with central angle 60° is:", opts: ["2π cm","6π cm","π cm","3π cm"], ans: 0, exp: "(60/360) × 2π × 6 = (1/6) × 12π = 2π cm." },
            { q: "Area of a circle with radius 14cm is (π = 22/7):", opts: ["616 cm²","154 cm²","308 cm²","88 cm²"], ans: 0, exp: "πr² = (22/7) × 14² = (22/7) × 196 = 22 × 28 = 616 cm²." }
          ]
        },
        {
          id: 12, title: 'Surface Areas and Volumes',
          subtitle: 'Combinations of Solids, Conversion of Shapes',
          keyPoints: [
            "When solids are combined, add/subtract volumes and surface areas carefully",
            "For conversion (melting/recasting): Volume remains the same",
            "Hemisphere: Curved SA = 2πr², Total SA = 3πr², Volume = (2/3)πr³",
            "Cone: Slant height l = √(r²+h²), CSA = πrl, TSA = πr(r+l), V = (1/3)πr²h",
            "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h"
          ],
          formulas: [
            "Sphere: SA = 4πr², V = (4/3)πr³",
            "Hemisphere: CSA = 2πr², TSA = 3πr², V = (2/3)πr³",
            "Cone: l = √(r²+h²), CSA = πrl, V = (1/3)πr²h",
            "Cylinder: CSA = 2πrh, TSA = 2πr(r+h), V = πr²h",
            "Cuboid: SA = 2(lb+bh+lh), V = l×b×h"
          ],
          mcqs: [
            { q: "Volume of a cone with radius 3cm and height 4cm is:", opts: ["12π cm³","36π cm³","9π cm³","27π cm³"], ans: 0, exp: "V = (1/3)πr²h = (1/3)π×9×4 = 12π cm³." },
            { q: "A solid sphere of radius 3cm is melted and recast into small spheres of radius 1cm. Number of small spheres:", opts: ["27","9","3","81"], ans: 0, exp: "Volume ratio: (4/3)π×3³ / (4/3)π×1³ = 27/1 = 27 small spheres." },
            { q: "Total surface area of a hemisphere of radius 7cm (π = 22/7):", opts: ["462 cm²","231 cm²","154 cm²","616 cm²"], ans: 0, exp: "TSA = 3πr² = 3×(22/7)×49 = 3×22×7 = 462 cm²." }
          ]
        },
        {
          id: 13, title: 'Statistics',
          subtitle: 'Mean, Median, Mode, Cumulative Frequency',
          keyPoints: [
            "Mean (Direct method): x̄ = Σfx / Σf",
            "Mean (Assumed mean method): x̄ = A + (Σfd/Σf) where d = x − A",
            "Median of grouped data uses cumulative frequency and median class",
            "Mode: class with highest frequency is the modal class",
            "Empirical Relationship: Mode = 3 × Median − 2 × Mean",
            "Ogive (cumulative frequency curve) is used to find median graphically"
          ],
          formulas: [
            "Mean = Σfx / Σf  (Direct method)",
            "Median = L + [(n/2 − cf)/f] × h",
            "Mode = L + [(f₁−f₀)/(2f₁−f₀−f₂)] × h",
            "Mode = 3 Median − 2 Mean  (Empirical relation)"
          ],
          mcqs: [
            { q: "The empirical relationship between mean, median and mode is:", opts: ["Mode = 3 Median − 2 Mean","Mean = 3 Median − 2 Mode","Median = 3 Mode − 2 Mean","Mode = 2 Mean − 3 Median"], ans: 0, exp: "This is Karl Pearson's empirical formula: Mode = 3 Median − 2 Mean." },
            { q: "The mean of 5, 10, 15, 20, 25 is:", opts: ["15","13","17","12"], ans: 0, exp: "Sum = 75, n = 5. Mean = 75/5 = 15." },
            { q: "An ogive is used to determine:", opts: ["Median","Mean","Mode","All of these"], ans: 0, exp: "A cumulative frequency curve (ogive) is used to determine the median graphically." }
          ]
        },
        {
          id: 14, title: 'Probability',
          subtitle: 'Classical Probability, Complementary Events',
          keyPoints: [
            "Probability P(E) = (Number of favourable outcomes) / (Total number of outcomes)",
            "0 ≤ P(E) ≤ 1 always",
            "P(E) + P(Ē) = 1  (Complementary events)",
            "Impossible event: P = 0  |  Sure/Certain event: P = 1",
            "For a fair die: 6 outcomes. For a deck of cards: 52 cards"
          ],
          formulas: [
            "P(E) = n(E) / n(S)  [Favourable / Total]",
            "P(Ē) = 1 − P(E)  [Complementary event]",
            "P(A or B) = P(A) + P(B)  [for mutually exclusive events]"
          ],
          mcqs: [
            { q: "A die is thrown once. Probability of getting an even number:", opts: ["1/2","1/3","1/6","2/3"], ans: 0, exp: "Even numbers: {2,4,6} = 3 outcomes. P = 3/6 = 1/2." },
            { q: "One card is drawn from a well-shuffled deck. P(a king) =", opts: ["1/13","4/52","Both a and b","1/4"], ans: 2, exp: "P = 4/52 = 1/13. Both options a and b are same." },
            { q: "If P(E) = 0.35, then P(Ē) =", opts: ["0.65","0.35","0.50","1.35"], ans: 0, exp: "P(Ē) = 1 − P(E) = 1 − 0.35 = 0.65." }
          ]
        }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      icon: '🔬',
      color: 'science',
      description: 'Physics, Chemistry & Biology',
      chapters: [
        {
          id: 1, title: 'Chemical Reactions and Equations',
          subtitle: 'Types of Reactions, Balancing Equations',
          keyPoints: [
            "Signs of chemical reaction: change in colour, formation of precipitate, evolution of gas, change in temperature, change in smell",
            "Law of Conservation of Mass: matter is neither created nor destroyed",
            "Types of reactions: Combination, Decomposition, Displacement, Double Displacement, Oxidation-Reduction",
            "Combination: A + B → AB | Decomposition: AB → A + B",
            "Displacement: A + BC → AC + B (more reactive displaces less reactive)",
            "Redox reactions: Oxidation (loss of electrons/gain of O) & Reduction (gain of electrons/loss of O) occur simultaneously"
          ],
          formulas: [
            "Combination: A + B → AB",
            "Decomposition: AB → A + B  [thermal, electrolytic, photolytic]",
            "Single Displacement: A + BC → AC + B",
            "Double Displacement: AB + CD → AD + CB",
            "2H₂ + O₂ → 2H₂O  [Balanced equation example]"
          ],
          mcqs: [
            { q: "Which of the following is a decomposition reaction?", opts: ["CaCO₃ → CaO + CO₂","C + O₂ → CO₂","Fe + CuSO₄ → FeSO₄ + Cu","NaOH + HCl → NaCl + H₂O"], ans: 0, exp: "CaCO₃ → CaO + CO₂ is a decomposition reaction (one compound → two products)." },
            { q: "Rusting of iron is an example of:", opts: ["Oxidation reaction","Reduction reaction","Decomposition reaction","Combination reaction"], ans: 0, exp: "Rusting is 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃. Iron gets oxidised (gains oxygen)." },
            { q: "In the reaction: Fe + CuSO₄ → FeSO₄ + Cu, which is the more reactive metal?", opts: ["Iron (Fe)","Copper (Cu)","Both equally","Cannot determine"], ans: 0, exp: "Iron displaces copper, showing iron is more reactive than copper in the activity series." }
          ]
        },
        {
          id: 2, title: 'Acids, Bases and Salts',
          subtitle: 'Properties, pH Scale, Indicators, Salts',
          keyPoints: [
            "Acids: taste sour, turn blue litmus red, pH < 7, release H⁺ ions in solution",
            "Bases: taste bitter, feel soapy, turn red litmus blue, pH > 7, release OH⁻ ions",
            "Neutralisation: Acid + Base → Salt + Water",
            "pH scale: 0−14 (0−6 acidic, 7 neutral, 8−14 basic)",
            "Universal indicator shows different colours at different pH values",
            "Strong acid + Strong base → Neutral salt | Strong acid + Weak base → Acidic salt"
          ],
          formulas: [
            "Acid + Base → Salt + Water  (Neutralisation)",
            "HCl + NaOH → NaCl + H₂O",
            "pH < 7 = Acidic | pH = 7 = Neutral | pH > 7 = Basic/Alkaline",
            "Acid + Metal → Salt + Hydrogen gas",
            "Acid + Metal carbonate → Salt + CO₂ + Water"
          ],
          mcqs: [
            { q: "Which has the lowest pH?", opts: ["Gastric juice (pH~2)","Blood (pH~7.4)","Lemon juice (pH~2.2)","Milk (pH~6.8)"], ans: 0, exp: "Lower pH means more acidic. Gastric juice has pH≈2, which is lowest here." },
            { q: "Baking soda is:", opts: ["NaHCO₃","Na₂CO₃","NaCl","NaOH"], ans: 0, exp: "Baking soda is sodium bicarbonate (NaHCO₃). Na₂CO₃ is washing soda." },
            { q: "Plaster of Paris is obtained by heating:", opts: ["Gypsum at 373K","Gypsum at 100K","CaCO₃ at 600K","NaCl at 400K"], ans: 0, exp: "Gypsum (CaSO₄·2H₂O) heated at 373K gives Plaster of Paris (CaSO₄·½H₂O)." }
          ]
        },
        {
          id: 3, title: 'Metals and Non-Metals',
          subtitle: 'Physical Properties, Reactivity Series, Extraction',
          keyPoints: [
            "Metals: lustrous, malleable, ductile, good conductors, sonorous (except mercury — liquid metal)",
            "Non-metals: not lustrous (except iodine, diamond), brittle (if solid), poor conductors (except graphite)",
            "Reactivity series (high to low): K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Hg, Ag, Au, Pt",
            "Metals above hydrogen in reactivity series displace H₂ from dilute acids",
            "Ionic compounds: formed by transfer of electrons from metal to non-metal",
            "Corrosion: slow reaction of metals with environment (e.g., rusting of iron, tarnishing of silver)"
          ],
          formulas: [
            "Metal + Oxygen → Metal oxide  (basic in nature)",
            "Non-metal + Oxygen → Non-metal oxide  (acidic in nature)",
            "Metal + Water → Metal hydroxide + H₂  (reactive metals like Na, K)",
            "Metal + Steam → Metal oxide + H₂  (Mg, Fe)",
            "Metal + Dilute acid → Salt + H₂  (metals above H in series)"
          ],
          mcqs: [
            { q: "Which metal is stored in kerosene oil?", opts: ["Sodium","Iron","Copper","Gold"], ans: 0, exp: "Sodium is highly reactive with water and air, so it is stored in kerosene oil." },
            { q: "Which non-metal conducts electricity?", opts: ["Graphite","Diamond","Sulphur","Phosphorus"], ans: 0, exp: "Graphite is an allotrope of carbon that conducts electricity due to delocalized electrons." },
            { q: "The metal with highest electrical conductivity is:", opts: ["Silver","Copper","Gold","Aluminium"], ans: 0, exp: "Silver has the highest electrical conductivity among all metals." }
          ]
        },
        {
          id: 4, title: 'Carbon and Its Compounds',
          subtitle: 'Covalent Bonding, Hydrocarbons, Functional Groups',
          keyPoints: [
            "Carbon has valency 4 — can form 4 covalent bonds; shows catenation (bonding with itself)",
            "Hydrocarbons: compounds of C and H only. Saturated (alkanes CₙH₂ₙ₊₂) and Unsaturated (alkenes, alkynes)",
            "Functional groups: −OH (alcohol), −COOH (carboxylic acid), −CHO (aldehyde), −CO− (ketone), −X (halide)",
            "Homologous series: series of compounds with same functional group, differing by −CH₂−",
            "Ethanol (C₂H₅OH) — common alcohol; used in medicines, drinks, fuel",
            "Ethanoic acid (CH₃COOH) — acetic acid; component of vinegar"
          ],
          formulas: [
            "Alkanes: CₙH₂ₙ₊₂  |  Alkenes: CₙH₂ₙ  |  Alkynes: CₙH₂ₙ₋₂",
            "Ethanol: C₂H₅OH (combustion, oxidation to ethanoic acid)",
            "Saponification: Fat + NaOH → Soap + Glycerol",
            "Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O"
          ],
          mcqs: [
            { q: "The general formula of alkanes is:", opts: ["CₙH₂ₙ₊₂","CₙH₂ₙ","CₙH₂ₙ₋₂","CₙHₙ"], ans: 0, exp: "Alkanes are saturated hydrocarbons: CₙH₂ₙ₊₂ (e.g., CH₄ for n=1)." },
            { q: "Vinegar is an aqueous solution of:", opts: ["Ethanoic acid","Ethanol","Citric acid","Tartaric acid"], ans: 0, exp: "Vinegar contains 5-8% ethanoic acid (acetic acid, CH₃COOH) in water." },
            { q: "The process of making soap from oil/fat is called:", opts: ["Saponification","Hydrogenation","Esterification","Fermentation"], ans: 0, exp: "Saponification: Fat + NaOH(aq) → Soap (sodium salt of fatty acid) + Glycerol." }
          ]
        },
        {
          id: 5, title: 'Life Processes',
          subtitle: 'Nutrition, Respiration, Transportation, Excretion',
          keyPoints: [
            "Autotrophic nutrition: organisms make their own food (e.g., plants via photosynthesis)",
            "Photosynthesis: 6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂",
            "Aerobic respiration: glucose + oxygen → CO₂ + H₂O + energy (ATP)",
            "Anaerobic respiration: glucose → ethanol + CO₂ + energy (in yeast); or lactic acid (in muscles)",
            "Human heart: 4 chambers (2 atria, 2 ventricles); double circulation",
            "Excretion: kidneys filter blood and produce urine (main nitrogenous waste = urea)"
          ],
          formulas: [
            "Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂  [in presence of chlorophyll + sunlight]",
            "Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP",
            "Anaerobic (yeast): Glucose → 2 Ethanol + 2CO₂ + 2 ATP"
          ],
          mcqs: [
            { q: "The raw materials for photosynthesis are:", opts: ["CO₂ and H₂O","O₂ and glucose","CO₂ and O₂","Glucose and H₂O"], ans: 0, exp: "Plants use CO₂ (from air) and H₂O (from soil) to make glucose in photosynthesis." },
            { q: "Which blood vessel carries oxygenated blood from lungs to heart?", opts: ["Pulmonary vein","Pulmonary artery","Aorta","Vena cava"], ans: 0, exp: "Pulmonary vein carries oxygenated blood from lungs to left atrium of heart." },
            { q: "The functional unit of kidney is:", opts: ["Nephron","Neuron","Alveolus","Villus"], ans: 0, exp: "Nephron is the structural and functional unit of the kidney that filters blood." }
          ]
        },
        {
          id: 6, title: 'Control and Coordination',
          subtitle: 'Nervous System, Hormones, Reflex Actions',
          keyPoints: [
            "Nervous system: Brain, Spinal Cord, Nerves",
            "Neuron: functional unit of nervous system with dendrites, cell body, axon",
            "Reflex action: fast, involuntary response controlled by spinal cord",
            "Reflex arc: Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector",
            "Endocrine glands: secrete hormones directly into blood (ductless glands)",
            "Adrenaline: 'fight or flight' hormone; Insulin: regulates blood sugar; Thyroxine: regulates metabolism"
          ],
          formulas: [
            "Reflex Arc: Stimulus → Receptor → Sensory Nerve → CNS → Motor Nerve → Effector → Response",
            "Synapse: gap between two neurons where nerve impulse is transmitted via neurotransmitters"
          ],
          mcqs: [
            { q: "Which hormone is secreted by the pancreas to lower blood sugar?", opts: ["Insulin","Glucagon","Adrenaline","Thyroxine"], ans: 0, exp: "Insulin is secreted by β-cells of islets of Langerhans in pancreas to reduce blood glucose." },
            { q: "The reflex arc is controlled by:", opts: ["Spinal cord","Brain","Both","Hormones"], ans: 0, exp: "Simple reflex actions are controlled by the spinal cord, not the brain." },
            { q: "Iodine is necessary for the functioning of which gland?", opts: ["Thyroid","Pancreas","Adrenal","Pituitary"], ans: 0, exp: "Thyroid gland requires iodine to produce thyroxine hormone. Deficiency causes goitre." }
          ]
        },
        {
          id: 7, title: 'How Do Organisms Reproduce?',
          subtitle: 'Asexual & Sexual Reproduction, Contraception',
          keyPoints: [
            "Asexual reproduction: single parent, no gametes (fission, budding, regeneration, vegetative propagation, spore formation)",
            "Sexual reproduction: two parents, involves gametes (sex cells)",
            "Binary fission in Amoeba: cell divides into two equal halves",
            "Budding in Hydra/Yeast: small outgrowth develops into new organism",
            "Pollination: transfer of pollen from anther to stigma",
            "Double fertilization in flowering plants: one sperm + egg = zygote; another sperm + polar nuclei = endosperm"
          ],
          formulas: [
            "Fertilization → Zygote → Embryo → Foetus → Baby",
            "Vegetative propagation: roots (dahlia), stem (potato), leaf (bryophyllum)"
          ],
          mcqs: [
            { q: "In Hydra, reproduction occurs by:", opts: ["Budding","Fission","Spore formation","Fragmentation"], ans: 0, exp: "Hydra reproduces asexually by budding — a small bud develops from parent body." },
            { q: "Which part of the flower becomes the fruit after fertilization?", opts: ["Ovary","Ovule","Petal","Stamen"], ans: 0, exp: "After fertilization, the ovary develops into the fruit and ovules become seeds." },
            { q: "Vegetative propagation by leaves occurs in:", opts: ["Bryophyllum","Potato","Rose","Ginger"], ans: 0, exp: "Bryophyllum propagates vegetatively through buds on leaf margins." }
          ]
        },
        {
          id: 8, title: 'Heredity and Evolution',
          subtitle: "Mendel's Laws, Genetics, Darwin's Theory",
          keyPoints: [
            "Heredity: transmission of traits from parents to offspring",
            "Mendel's Law of Segregation: alleles separate during gamete formation",
            "Mendel's Law of Independent Assortment: genes on different chromosomes assort independently",
            "Genotype: genetic makeup | Phenotype: physical appearance",
            "Dominant allele masks recessive allele's expression",
            "Evolution: gradual change in organisms over generations; Darwin's Theory — Natural Selection"
          ],
          formulas: [
            "Monohybrid cross (Tt × Tt): 3 Dominant : 1 Recessive phenotype ratio",
            "Dihybrid cross: 9:3:3:1 ratio",
            "Genotype ratio (Tt × Tt): 1 TT : 2 Tt : 1 tt"
          ],
          mcqs: [
            { q: "Mendel worked on which plant for his experiments?", opts: ["Garden pea (Pisum sativum)","Wheat","Rose","Maize"], ans: 0, exp: "Mendel used garden pea (Pisum sativum) plants for all his genetics experiments." },
            { q: "In Mendel's monohybrid cross (Tt × Tt), phenotype ratio is:", opts: ["3:1","1:2:1","1:1","9:3:3:1"], ans: 0, exp: "The phenotype ratio for monohybrid cross is 3 Dominant : 1 Recessive = 3:1." },
            { q: "Who proposed the Theory of Natural Selection?", opts: ["Charles Darwin","Gregor Mendel","Lamarck","Watson"], ans: 0, exp: "Charles Darwin proposed the Theory of Natural Selection (1859) in 'On the Origin of Species'." }
          ]
        },
        {
          id: 9, title: 'Light – Reflection and Refraction',
          subtitle: 'Mirrors, Lenses, Mirror and Lens Formulae',
          keyPoints: [
            "Laws of Reflection: angle of incidence = angle of reflection; incident ray, normal, reflected ray are coplanar",
            "Concave mirror: converging mirror, used in torches, headlights, dentist mirrors",
            "Convex mirror: diverging mirror, always forms virtual, erect, diminished image; used in rear-view mirrors",
            "Refraction: bending of light when passing from one medium to another",
            "Snell's Law: n₁ sin i = n₂ sin r",
            "Convex lens: converging; Concave lens: diverging"
          ],
          formulas: [
            "Mirror formula: 1/v + 1/u = 1/f",
            "Lens formula: 1/v − 1/u = 1/f",
            "Magnification (mirror): m = −v/u",
            "Power of lens: P = 1/f (in metres), unit = Dioptre (D)",
            "Snell's Law: n₁ sin i = n₂ sin r  |  n = speed of light in vacuum / speed in medium"
          ],
          mcqs: [
            { q: "A concave mirror has focal length 15cm. Its radius of curvature is:", opts: ["30 cm","15 cm","7.5 cm","60 cm"], ans: 0, exp: "R = 2f = 2 × 15 = 30 cm." },
            { q: "Power of a convex lens of focal length 25cm is:", opts: ["+4 D","+25 D","−4 D","−25 D"], ans: 0, exp: "P = 1/f = 1/0.25m = +4 D. Convex lens has positive power." },
            { q: "Which mirror is used in rear-view mirrors of vehicles?", opts: ["Convex mirror","Concave mirror","Plane mirror","Plano-concave mirror"], ans: 0, exp: "Convex mirrors are used in rear-view mirrors as they give a wider field of view." }
          ]
        },
        {
          id: 10, title: 'Human Eye and the Colourful World',
          subtitle: 'Structure of Eye, Defects, Dispersion, Scattering',
          keyPoints: [
            "Power of accommodation: ability of eye lens to change focal length",
            "Near point of normal human eye: 25 cm",
            "Myopia (short-sightedness): distant objects blurred; corrected by concave lens",
            "Hypermetropia (long-sightedness): nearby objects blurred; corrected by convex lens",
            "Presbyopia: loss of accommodation with age; corrected by bifocal lens",
            "Dispersion: splitting of white light into spectrum (VIBGYOR) by a prism",
            "Scattering: blue light scatters most → sky appears blue; at sunrise/sunset, sky is red/orange"
          ],
          formulas: [
            "For Myopia: concave lens of power = −1/distance of far point",
            "Tyndall Effect: scattering of light by colloidal particles",
            "VIBGYOR: Violet, Indigo, Blue, Green, Yellow, Orange, Red"
          ],
          mcqs: [
            { q: "A person with myopia can see clearly up to 4m. Power of corrective lens needed:", opts: ["−0.25 D","−4 D","+0.25 D","+4 D"], ans: 0, exp: "P = 1/f = −1/4 = −0.25 D. Concave lens (negative power) needed." },
            { q: "The sky appears blue because:", opts: ["Blue light scatters most","Blue light absorbs least","Red light scatters most","Atmosphere emits blue light"], ans: 0, exp: "Shorter wavelength blue light scatters more by gas molecules (Rayleigh scattering)." },
            { q: "At sunset, the sun appears red because:", opts: ["Red light scatters least (reaches us)","Red light scatters most","Blue light is absorbed","Atmosphere is red"], ans: 0, exp: "At sunset, light travels longer path; blue is scattered away; red (scatters least) reaches us." }
          ]
        },
        {
          id: 11, title: 'Electricity',
          subtitle: 'Ohm\'s Law, Resistance, Series & Parallel Circuits, Power',
          keyPoints: [
            "Electric current I = Q/t (charge per unit time), SI unit = Ampere (A)",
            "Ohm's Law: V = IR (at constant temperature and other conditions)",
            "Resistance depends on: material (resistivity), length, cross-sectional area",
            "Series circuit: same current, voltages add, resistances add (R = R₁+R₂+...)",
            "Parallel circuit: same voltage, currents add, 1/R = 1/R₁ + 1/R₂ + ...",
            "Electric Power P = VI = I²R = V²/R, unit = Watt (W)"
          ],
          formulas: [
            "V = IR  (Ohm's Law)",
            "I = Q/t  |  Q = ne  (e = 1.6 × 10⁻¹⁹ C)",
            "R = ρL/A  (ρ = resistivity, L = length, A = cross-section area)",
            "Series: R_total = R₁ + R₂ + R₃",
            "Parallel: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃",
            "P = VI = I²R = V²/R  |  H = I²Rt  (Joule's law of heating)"
          ],
          mcqs: [
            { q: "A wire of resistance 10Ω is connected to a 5V battery. Current flowing is:", opts: ["0.5 A","2 A","50 A","0.2 A"], ans: 0, exp: "I = V/R = 5/10 = 0.5 A." },
            { q: "In a parallel circuit, two 6Ω resistors. Equivalent resistance:", opts: ["3 Ω","12 Ω","6 Ω","1 Ω"], ans: 0, exp: "1/R = 1/6 + 1/6 = 2/6 = 1/3 → R = 3 Ω." },
            { q: "An electric iron of 1000W is used for 2 hours. Energy consumed in kWh:", opts: ["2 kWh","1 kWh","0.5 kWh","20 kWh"], ans: 0, exp: "Energy = Power × Time = 1 kW × 2 h = 2 kWh." }
          ]
        },
        {
          id: 12, title: 'Magnetic Effects of Electric Current',
          subtitle: 'Magnetic Field, Electromagnetic Induction, AC/DC',
          keyPoints: [
            "Magnetic field around a straight conductor follows right-hand thumb rule",
            "Electromagnet: soft iron core wrapped with insulated coil carrying current",
            "Fleming's Left-Hand Rule: for force on current-carrying conductor in magnetic field",
            "Fleming's Right-Hand Rule: for direction of induced current (electromagnetic induction)",
            "Electric motor: converts electrical energy to mechanical energy",
            "Generator/Dynamo: converts mechanical energy to electrical energy",
            "AC: alternating current (direction changes periodically); DC: direct current (one direction)"
          ],
          formulas: [
            "Faraday's Law: Induced EMF = −dΦ/dt  (rate of change of magnetic flux)",
            "Right-Hand Thumb Rule: thumb → current direction, curled fingers → magnetic field direction",
            "Fleming's Left-Hand Rule: Thumb=Motion, Index=Field, Middle=Current"
          ],
          mcqs: [
            { q: "An electric motor converts:", opts: ["Electrical to mechanical energy","Mechanical to electrical energy","Chemical to electrical energy","Electrical to heat energy"], ans: 0, exp: "Electric motor converts electrical energy into mechanical (rotational) energy." },
            { q: "The frequency of AC supply in India is:", opts: ["50 Hz","60 Hz","100 Hz","25 Hz"], ans: 0, exp: "In India, the AC supply has a frequency of 50 Hz (50 cycles per second)." },
            { q: "Which rule is used to find direction of force on a current-carrying wire in magnetic field?", opts: ["Fleming's Left-Hand Rule","Right-Hand Thumb Rule","Fleming's Right-Hand Rule","Maxwell's Rule"], ans: 0, exp: "Fleming's Left-Hand Rule gives direction of force (F), magnetic field (B), and current (I)." }
          ]
        },
        {
          id: 13, title: 'Our Environment',
          subtitle: 'Ecosystems, Food Chains, Ozone Layer, Waste Management',
          keyPoints: [
            "Ecosystem: community of living organisms interacting with their non-living environment",
            "Food chain: Producer → Primary Consumer → Secondary Consumer → Tertiary Consumer",
            "10% Law (Lindemann): only 10% of energy is transferred from one trophic level to the next",
            "Biodegradable waste: decomposed by microorganisms (paper, food, cotton)",
            "Non-biodegradable waste: cannot be decomposed naturally (plastics, metals, glass)",
            "Ozone layer (O₃) in stratosphere protects from harmful UV radiation",
            "CFCs (chlorofluorocarbons) deplete the ozone layer → ozone hole → UV reaches Earth"
          ],
          formulas: [
            "10% Energy Law: Energy at next level = 10% of previous level's energy",
            "Food chain: Producer → Herbivore → Carnivore → Top Carnivore"
          ],
          mcqs: [
            { q: "Only what percentage of energy is passed from one trophic level to the next?", opts: ["10%","20%","50%","1%"], ans: 0, exp: "Lindemann's 10% Law: only 10% of energy at one trophic level is available to the next level." },
            { q: "Which gas is responsible for depletion of ozone layer?", opts: ["Chlorofluorocarbons (CFCs)","CO₂","Methane","Sulphur dioxide"], ans: 0, exp: "CFCs (used in refrigerants, aerosols) react with and deplete ozone in the stratosphere." },
            { q: "Decomposers in an ecosystem are:", opts: ["Fungi and bacteria","Plants","Herbivores","Carnivores"], ans: 0, exp: "Decomposers like fungi and bacteria break down dead organic matter, recycling nutrients." }
          ]
        }
      ]
    },
    {
      id: 'english',
      name: 'English',
      icon: '📖',
      color: 'english',
      description: 'First Flight, Footprints Without Feet & Grammar',
      chapters: [
        {
          id: 1, title: 'A Letter to God',
          subtitle: 'First Flight — Chapter 1 | Lencho\'s unshakeable faith',
          keyPoints: [
            "Written by: G.L. Fuentes (originally in Spanish, set in Mexico)",
            "Main character: Lencho, a hardworking farmer with deep faith in God",
            "Lencho's crops are destroyed by a hailstorm just before harvest",
            "He writes a letter to God asking for 100 pesos to restart his life",
            "The postmaster, moved by Lencho's faith, collects 70 pesos from staff and sends it",
            "Lencho receives the money but counts only 70 pesos — blames 'post office people' for stealing 30 pesos",
            "Theme: Absolute faith vs. the irony of human ingratitude"
          ],
          formulas: [
            "Key Word: 'Correspondence' — Lencho's communication with God",
            "Irony: Lencho calls the helpful post office staff 'a bunch of crooks'",
            "Theme: Faith, Irony, Humanity's blind spot"
          ],
          mcqs: [
            { q: "How much money did Lencho ask God for?", opts: ["100 pesos","70 pesos","50 pesos","30 pesos"], ans: 0, exp: "Lencho asked God for 100 pesos, saying his family would need it to survive and sow the field again." },
            { q: "Why did Lencho call the post office employees 'a bunch of crooks'?", opts: ["He received only 70 pesos instead of 100","They opened his letter","They kept his letter","They sent him less money intentionally"], ans: 0, exp: "Lencho received 70 pesos but had asked for 100. He thought the post office employees stole 30 pesos." },
            { q: "Who was moved by Lencho's faith and decided to help him?", opts: ["The postmaster","The mayor","Lencho's neighbour","A banker"], ans: 0, exp: "The postmaster was so moved by Lencho's unshakeable faith in God that he decided to collect money." }
          ]
        },
        {
          id: 2, title: 'Nelson Mandela: Long Walk to Freedom',
          subtitle: 'First Flight — Chapter 2 | Apartheid to Freedom',
          keyPoints: [
            "Nelson Mandela became South Africa's first black President on 10 May 1994",
            "Apartheid: policy of racial segregation in South Africa — white minority ruled black majority",
            "Mandela spent 27 years in prison on Robben Island",
            "He believed the oppressor and oppressed are both imprisoned — oppressor by hatred, oppressed by bars",
            "Key idea: 'The greatest glory in living lies not in never falling, but in rising every time we fall'",
            "Two obligations: one to family and one to people and community",
            "Courageous people like Sisulu, Tambo, Luthuli helped Mandela discover his hunger for freedom"
          ],
          formulas: [
            "Apartheid = Apart + Hood = Policy of racial separation",
            "ANC: African National Congress — party Mandela led",
            "Theme: Courage, Sacrifice, Freedom, Human Dignity"
          ],
          mcqs: [
            { q: "How long was Nelson Mandela imprisoned?", opts: ["27 years","20 years","30 years","15 years"], ans: 0, exp: "Mandela was imprisoned from 1964 to 1990 — a total of 27 years on Robben Island." },
            { q: "What is apartheid?", opts: ["A policy of racial segregation","A type of government","A political party","A legal system"], ans: 0, exp: "Apartheid was a system of racial segregation enforced in South Africa from 1948 to 1994." },
            { q: "According to Mandela, what is the greatest wealth of South Africa?", opts: ["Its people","Gold mines","Diamonds","Land"], ans: 0, exp: "Mandela said the greatest wealth of his country is its people — its finest, most talented people." }
          ]
        },
        {
          id: 3, title: 'Two Stories About Flying',
          subtitle: 'First Flight — Chapter 3 | His First Flight & Black Aeroplane',
          keyPoints: [
            "His First Flight (Liam O'Flaherty): A young seagull afraid to fly. Hunger finally drives him to jump — he flies successfully. Theme: Overcoming fear, courage",
            "Black Aeroplane (Frederick Forsyth): A pilot flying from Paris to England. Enters a storm. A mysterious black aeroplane guides him safely to land. The black aeroplane could not be traced. Theme: Mystery, Courage, Trust",
            "Both stories deal with flying — one literal (seagull), one metaphorical (facing the unknown)",
            "In 'His First Flight', the young seagull's hunger overcame his fear of flying"
          ],
          formulas: [
            "Theme of His First Flight: Courage over fear, nature teaches lessons",
            "Theme of Black Aeroplane: Mystery, helping others selflessly"
          ],
          mcqs: [
            { q: "In 'His First Flight', what finally made the young seagull take his first flight?", opts: ["Hunger","Fear","His mother's push","Wind"], ans: 0, exp: "His hunger drove him to dive for food — and in diving, he spread his wings and flew." },
            { q: "In 'The Black Aeroplane', what happened when the pilot asked the control centre about the other plane?", opts: ["There was no other plane on radar","The plane had crashed","It was an old plane","The pilot was confused"], ans: 0, exp: "The woman at the control centre said there was no other aircraft visible on the radar that night." },
            { q: "In 'The Black Aeroplane', what was the passenger's destination?", opts: ["England","France","Germany","USA"], ans: 0, exp: "The pilot was flying from Paris to England (London) to be home for breakfast." }
          ]
        },
        {
          id: 4, title: 'From the Diary of Anne Frank',
          subtitle: 'First Flight — Chapter 4 | World War II, Holocaust',
          keyPoints: [
            "Anne Frank was a Jewish girl who hid from Nazis during World War II in Amsterdam",
            "She kept a diary (June 1942 to August 1944) which was later published as 'The Diary of a Young Girl'",
            "Anne named her diary 'Kitty' — she considered it her friend",
            "Anne writes that she has no real friend she can confide in, hence the diary",
            "She describes her relationship with her teachers, especially Mr Keesing",
            "The story shows the power of writing and friendship during dark times",
            "Anne was captured by Nazis in 1944 and died in Bergen-Belsen camp in 1945 at age 15"
          ],
          formulas: [
            "Quote: 'Paper has more patience than people' — Anne Frank",
            "Theme: Loneliness, Resilience, Friendship, War's impact on children"
          ],
          mcqs: [
            { q: "What name did Anne Frank give to her diary?", opts: ["Kitty","Mary","Kate","Sophie"], ans: 0, exp: "Anne Frank addressed her diary as 'Kitty' — she considered it her best friend and confidant." },
            { q: "Anne Frank's diary covers the period:", opts: ["1942-1944","1940-1942","1944-1945","1939-1941"], ans: 0, exp: "Anne received the diary on her 13th birthday in June 1942. She wrote until August 1944." },
            { q: "Which teacher kept giving Anne extra homework as punishment?", opts: ["Mr. Keesing","Mr. Smith","Mr. Brown","Mr. Jones"], ans: 0, exp: "Mr. Keesing assigned Anne extra essays as punishment for her talking too much in class." }
          ]
        },
        {
          id: 5, title: 'Glimpses of India',
          subtitle: 'First Flight — Chapter 7 | A Baker, Coorg, Tea from Assam',
          keyPoints: [
            "A Baker from Goa: Traditional Goan bread-maker (Pader). Bread is integral to Goan culture and celebrations",
            "Coorg (Karnataka): Known as Scotland of India. People of Coorg are brave and known for hospitality. Coffee and spice plantations",
            "Tea from Assam: Rajvir and Pranjol visit tea gardens. Assam produces the finest tea. Legend of discovery of tea — a Chinese emperor noticed tea flavor",
            "All three pieces celebrate regional culture and heritage of India"
          ],
          formulas: [
            "Coorg = 'Scotland of India' — known for warrior spirit and nature",
            "Pader = traditional Goan baker",
            "Theme: Cultural pride, regional identity, India's diversity"
          ],
          mcqs: [
            { q: "Coorg is located in which state?", opts: ["Karnataka","Kerala","Tamil Nadu","Goa"], ans: 0, exp: "Coorg (Kodagu) is a district in Karnataka. It is known as the 'Scotland of India'." },
            { q: "What is a 'pader' in the context of Goa?", opts: ["A traditional baker","A fisherman","A farmer","A dancer"], ans: 0, exp: "A 'pader' is the traditional Goan bread-maker whose village bread (pao) is integral to Goa's culture." },
            { q: "In 'Tea from Assam', where are Rajvir and Pranjol going?", opts: ["Assam tea garden","Darjeeling","Coorg","Goa"], ans: 0, exp: "Rajvir is visiting his friend Pranjol's home in Assam, and they are going to a tea garden." }
          ]
        },
        {
          id: 6, title: 'Mijbil the Otter',
          subtitle: 'First Flight — Chapter 8 | Gavin Maxwell\'s pet otter',
          keyPoints: [
            "Author: Gavin Maxwell",
            "Maxwell gets an otter called Mijbil from Basra, Iraq",
            "Mijbil belongs to a new sub-species named 'Lutrogale perspicillata maxwelli'",
            "Mijbil loved water and could operate taps! He was very playful",
            "On the flight to England, Mijbil escaped from the box causing chaos in the plane",
            "People in London called Mijbil a 'mink', 'a small seal', a 'baby seal' — nobody recognized an otter",
            "Theme: Love for animals, Man-animal bond, Curiosity"
          ],
          formulas: [
            "Scientific name of Mijbil's species: Lutrogale perspicillata maxwelli",
            "Theme: Man-animal bond, curiosity, loyalty of pets"
          ],
          mcqs: [
            { q: "Where did Maxwell get Mijbil from?", opts: ["Basra, Iraq","London, UK","Paris, France","Cairo, Egypt"], ans: 0, exp: "Maxwell received Mijbil from Basra, Tigris marshes in Southern Iraq." },
            { q: "What did people in London mistake Mijbil for?", opts: ["A mink or baby seal","A rabbit","A cat","A squirrel"], ans: 0, exp: "Londoners had never seen an otter and called Mijbil a mink, baby seal, or small beaver." },
            { q: "What is significant about Mijbil's scientific name?", opts: ["Named after Maxwell himself","Named after a river","Named after a city","Named after its color"], ans: 0, exp: "The sub-species was named 'maxwelli' after Gavin Maxwell, the author/owner." }
          ]
        },
        {
          id: 7, title: 'Madam Rides the Bus',
          subtitle: "First Flight — Chapter 9 | Valli's first bus journey",
          keyPoints: [
            "Author: Vallikkannan (Tamil author, originally in Tamil)",
            "Valli, an 8-year-old girl, is fascinated by the bus passing her home",
            "She saves money (60 paise) by refusing ice cream, toys, joyrides to buy a bus ticket",
            "She travels alone to the town and back — her life's greatest achievement",
            "On the way back, she sees a dead cow on the road — the same beautiful cow she had seen earlier",
            "She is deeply saddened — realizes life is full of sorrow and beauty coexist",
            "Theme: Childhood curiosity, independence, the reality of life and death"
          ],
          formulas: [
            "Round trip cost: 30 paise one way × 2 = 60 paise total",
            "Theme: Childhood dreams, courage, innocence vs. reality"
          ],
          mcqs: [
            { q: "How old was Valli?", opts: ["8 years","10 years","6 years","12 years"], ans: 0, exp: "Valli was eight years old — a curious and determined girl who wanted to ride the bus." },
            { q: "How much did Valli save for the bus journey?", opts: ["60 paise","30 paise","1 rupee","50 paise"], ans: 0, exp: "The one-way fare was 30 paise. Round trip = 60 paise. She saved exactly 60 paise." },
            { q: "What made Valli feel sad on her return journey?", opts: ["Seeing the dead cow on the road","Missing her mother","Getting late","Being scolded"], ans: 0, exp: "The beautiful cow she had seen earlier was now dead on the roadside — she felt deeply sad." }
          ]
        },
        {
          id: 8, title: 'The Sermon at Benares',
          subtitle: "First Flight — Chapter 10 | Buddha's teaching on death and grief",
          keyPoints: [
            "Author: Betty Renshaw",
            "Siddhartha Gautama (Prince) became Buddha after seeing suffering of the world",
            "Kisa Gotami's only son died — she went from door to door asking for medicine to revive him",
            "Buddha told her to bring a handful of mustard seeds from a house where no one had died",
            "She could not find such a house — realized death is universal and inevitable",
            "She accepted the truth and became Buddha's disciple",
            "Teaching: Grief is part of life; the way to end suffering is to accept the truth"
          ],
          formulas: [
            "Kisa Gotami's lesson: Death is universal — 'The life of mortals in this world is troubled and brief'",
            "Theme: Impermanence of life, acceptance of death, wisdom"
          ],
          mcqs: [
            { q: "What did Buddha ask Kisa Gotami to bring?", opts: ["Mustard seeds from a house with no death","Water from a holy river","Flowers from a temple","Soil from a graveyard"], ans: 0, exp: "Buddha asked for a handful of mustard seeds from a home where no one had ever died." },
            { q: "The central teaching of this story is:", opts: ["Death is universal and grief must be accepted","Medicine can cure all diseases","One should not trust others","Parents should be respected"], ans: 0, exp: "Buddha's message: death comes to all. Clinging to grief doesn't help — accept the truth and move on." },
            { q: "What did Kisa Gotami's son die of?", opts: ["Illness (unspecified)","Snake bite","Accident","Old age"], ans: 0, exp: "Kisa Gotami's only son died of illness. She refused to accept his death and carried his body." }
          ]
        },
        {
          id: 9, title: 'Footprints Without Feet',
          subtitle: 'Supplementary — Chapter 5 | Griffin the invisible scientist',
          keyPoints: [
            "Author: H.G. Wells",
            "Griffin is a scientist who discovers how to make himself invisible",
            "He becomes lawless — sets fire to his landlord's house, robs a theatrical company",
            "He reaches Iping village in winter — wrapped in bandages to hide his invisibility",
            "Mrs Hall (innkeeper) is puzzled by his strange behaviour",
            "When unwrapped, his face disappears — people are terrified",
            "Griffin is a scientific genius but a lawless and dangerous person",
            "Theme: Science without ethics is dangerous; Misuse of power"
          ],
          formulas: [
            "Griffin swallowed a drug → body became transparent → invisible but not indestructible",
            "Theme: Power without responsibility leads to misuse"
          ],
          mcqs: [
            { q: "Griffin became invisible by:", opts: ["Swallowing rare drugs that made his body transparent","Wearing a special suit","Using a magic mirror","Drinking a potion"], ans: 0, exp: "Griffin swallowed certain rare drugs that made his body transparent, rendering him invisible." },
            { q: "Why was Griffin a homeless wanderer in London?", opts: ["He had set fire to his landlord's house","He was fired from his job","His house was destroyed in a flood","He chose to wander"], ans: 0, exp: "Griffin had set fire to his landlord's house (who wanted him out) and had nowhere to go." },
            { q: "In which season did Griffin arrive at Iping village?", opts: ["Winter","Summer","Monsoon","Spring"], ans: 0, exp: "Griffin arrived in winter — unusual as a stranger in a remote village in cold weather wearing bandages." }
          ]
        },
        {
          id: 10, title: 'The Necklace',
          subtitle: "Supplementary — Chapter 7 | Matilda's downfall over pride",
          keyPoints: [
            "Author: Guy de Maupassant (French author)",
            "Matilda Loisel is a pretty but dissatisfied woman who dreams of wealth and luxury",
            "She borrows a diamond necklace from her friend Madame Forestier for a party",
            "She loses the necklace and doesn't tell Madame Forestier",
            "She and her husband buy a replacement necklace for 36,000 francs — taking loans",
            "They work for 10 years in poverty to repay the debt",
            "At the end, Matilda meets Madame Forestier who reveals the necklace was fake (worth only 500 francs)",
            "Theme: Pride, vanity, irony of fate, truth vs. appearance"
          ],
          formulas: [
            "Cost of replacement necklace: 36,000 francs (vs. real necklace: only 500 francs)",
            "Theme: Vanity, Deception, Irony, Hard work",
            "O. Henry twist ending — shocking revelation at the end"
          ],
          mcqs: [
            { q: "What was the cost of the replacement necklace that Matilda and her husband bought?", opts: ["36,000 francs","5,000 francs","500 francs","10,000 francs"], ans: 0, exp: "They spent 36,000 francs on the replacement diamond necklace, plunging into poverty for 10 years." },
            { q: "At the end of the story, what was revealed about the necklace?", opts: ["It was fake (paste/imitation)","It was more valuable than thought","It had been found","Madame Forestier had two necklaces"], ans: 0, exp: "Madame Forestier reveals the necklace was an imitation — worth only 500 francs at most." },
            { q: "Where did Matilda lose the necklace?", opts: ["After the party, on the way home","At the party venue","In a taxi","At home"], ans: 0, exp: "The necklace was lost while returning home after the grand party — possibly fell off during the journey." }
          ]
        },
        {
          id: 11, title: 'The Book That Saved the Earth',
          subtitle: 'Supplementary — Chapter 10 | Aliens misread Mother Goose',
          keyPoints: [
            "Author: Claire Boiko (a play set in the future, 25th century)",
            "Martian invasion of Earth is stopped because of a book — 'Mother Goose'",
            "Think-Tank, the Martian leader, sends crew to Earth to gather information",
            "The crew finds a library and misinterprets 'Mother Goose' nursery rhymes",
            "Think-Tank believes Earth people are dangerous based on misinterpretations",
            "Earth is saved without a single battle — by a book of children's rhymes",
            "Theme: Power of books/literature, Humour, Science fiction, Misunderstanding"
          ],
          formulas: [
            "Satire on human vanity: Think-Tank sees himself as ruler of the universe",
            "Theme: Books can save the world; Knowledge can be misunderstood"
          ],
          mcqs: [
            { q: "Who was the leader of Martians in 'The Book That Saved the Earth'?", opts: ["Think-Tank","Noodle","Omega","Mars Commander"], ans: 0, exp: "Think-Tank (also called Mighty and Exalted) was the commander and supreme authority of Mars." },
            { q: "What book did the Martian crew find in the library?", opts: ["Mother Goose","Alice in Wonderland","Gulliver's Travels","Jack and Jill"], ans: 0, exp: "The crew found 'Mother Goose' — a nursery rhyme book — which Think-Tank catastrophically misinterpreted." },
            { q: "Why did Think-Tank order retreat from Earth?", opts: ["He thought earthlings were dangerous based on misinterpreting rhymes","Earth had powerful weapons","He was afraid of humans","His spaceship was damaged"], ans: 0, exp: "Think-Tank misread a rhyme about shooting (Jack and Jill) as evidence of Earth's military power." }
          ]
        }
      ]
    },
    {
      id: 'social',
      name: 'Social Science',
      icon: '🌍',
      color: 'social',
      description: 'History, Geography, Civics & Economics',
      chapters: [
        {
          id: 1, title: 'The Rise of Nationalism in Europe',
          subtitle: 'History Ch.1 | French Revolution, Romanticism, Revolutions of 1830/1848',
          keyPoints: [
            "The French Revolution (1789) planted seeds of nationalism — ideas of liberty, equality, fraternity",
            "Napoleon spread revolutionary ideas across Europe through his conquests",
            "Nationalism: a strong sense of pride and loyalty towards one's nation",
            "Romanticism: cultural movement promoting emotion over reason; folk tales, language, music to build national identity",
            "1830: Greece became independent (with help from Britain, France, Russia)",
            "1848: 'Spring of Nations' — revolutions across Europe for democracy and national self-determination",
            "Frederic Sorrieu's 1848 print: utopian vision of Democratic and Social Republics",
            "Zollverein (1834): customs union in German states, removed trade barriers"
          ],
          formulas: [
            "Nation-state: a state inhabited by a relatively homogeneous people sharing culture/language",
            "Key Figures: Napoleon, Metternich, Mazzini, Garibaldi, Bismarck"
          ],
          mcqs: [
            { q: "Who said 'When France sneezes, the rest of Europe catches cold'?", opts: ["Metternich","Bismarck","Napoleon","Mazzini"], ans: 0, exp: "Austrian Chancellor Metternich said this about France's revolutionary influence on Europe." },
            { q: "Zollverein (1834) was:", opts: ["A customs union of German states","A military alliance","A political party","A nationalist group"], ans: 0, exp: "Zollverein was a customs union formed in 1834 among German states to remove trade barriers and link economies." },
            { q: "The city of Frankfurt Assembly (1848) was held in:", opts: ["St Paul's Church, Frankfurt","Berlin Cathedral","Notre Dame, Paris","Vienna Hall"], ans: 0, exp: "The Frankfurt Parliament/National Assembly met in St Paul's Church (Paulskirche), Frankfurt in 1848." }
          ]
        },
        {
          id: 2, title: 'Nationalism in India',
          subtitle: 'History Ch.2 | Non-Cooperation, Civil Disobedience, Quit India',
          keyPoints: [
            "First World War: increased military expenditure → higher taxes → anger in India",
            "Rowlatt Act (1919): allowed detention without trial — sparked mass protests",
            "Jallianwala Bagh Massacre (April 13, 1919): General Dyer opened fire on peaceful crowd; hundreds killed",
            "Non-Cooperation Movement (1920): Gandhi called to boycott British goods, return honours, leave schools/courts",
            "Chauri Chaura incident (1922): mob burned police station; Gandhi called off NCM",
            "Civil Disobedience Movement (1930): Gandhi's Dandi March (Salt March) — 240 miles, 24 days",
            "Poona Pact (1932): between Gandhi and B.R. Ambedkar — reserved seats for depressed classes in provincial councils",
            "Quit India Movement (1942): 'Do or Die' — Gandhi's final push for independence"
          ],
          formulas: [
            "Timeline: Rowlatt(1919) → NCM(1920) → CDM(1930) → Quit India(1942) → Independence(1947)",
            "Dandi March: 12 March – 6 April 1930 | 380 km (240 miles) | 78 volunteers"
          ],
          mcqs: [
            { q: "The Jallianwala Bagh Massacre occurred in which city?", opts: ["Amritsar","Lahore","Delhi","Lucknow"], ans: 0, exp: "The massacre took place in Jallianwala Bagh, Amritsar on April 13, 1919 (Baisakhi day)." },
            { q: "Gandhi started the Dandi March to protest against:", opts: ["Salt tax","Import duties","Rowlatt Act","Land tax"], ans: 0, exp: "Gandhi marched 240 miles to Dandi to make salt from seawater, defying the British salt tax law." },
            { q: "The Poona Pact (1932) was between Gandhi and:", opts: ["B.R. Ambedkar","Jawaharlal Nehru","Subhas Chandra Bose","Muhammad Ali Jinnah"], ans: 0, exp: "The Poona Pact was signed between Gandhi and Ambedkar regarding separate electorates for Dalits." }
          ]
        },
        {
          id: 3, title: 'Resources and Development',
          subtitle: 'Geography Ch.1 | Types of Resources, Land Use, Soil Erosion',
          keyPoints: [
            "Resource: anything that can be used to satisfy a need",
            "Classification by origin: Biotic (living) and Abiotic (non-living)",
            "Classification by exhaustibility: Renewable and Non-renewable",
            "Classification by ownership: Individual, Community, National, International",
            "Land use categories: Forests, land not available for cultivation, permanent pastures, cultivable wasteland, net sown area",
            "Soil types in India: Alluvial (most widespread, fertile), Black (cotton), Red & Yellow, Laterite, Arid, Forest soils",
            "Soil erosion: Gully erosion → Badland topography; Wind erosion in desert areas"
          ],
          formulas: [
            "Net Sown Area + Fallow land = Gross Cropped Area",
            "Alluvial soil: found in river plains (Ganga, Indus, Brahmaputra plains)",
            "Black soil: also called Regur soil; ideal for cotton; found in Deccan Plateau"
          ],
          mcqs: [
            { q: "Which soil type is also known as 'Regur soil' and is best for cotton cultivation?", opts: ["Black soil","Alluvial soil","Laterite soil","Red soil"], ans: 0, exp: "Black soil (Regur) is rich in clay minerals, retains moisture well, and is ideal for cotton cultivation." },
            { q: "Which is the most widespread soil in India?", opts: ["Alluvial soil","Black soil","Red soil","Laterite soil"], ans: 0, exp: "Alluvial soil covers the entire Indo-Gangetic plains and is the most widespread soil in India." },
            { q: "Resources which cannot be renewed in our lifetime are called:", opts: ["Non-renewable resources","Renewable resources","Biotic resources","Community resources"], ans: 0, exp: "Non-renewable resources (coal, petroleum) cannot be replenished in a short time — they take millions of years." }
          ]
        },
        {
          id: 4, title: 'Power Sharing',
          subtitle: 'Civics Ch.1 | Why Power Sharing is Important, Forms of Power Sharing',
          keyPoints: [
            "Belgium: complex ethnic composition — Dutch-speaking Flemish (59%), French-speaking Walloons (40%), German-speaking (1%)",
            "Belgium's solution: power sharing between communities — federal system",
            "Sri Lanka: Sinhala majority (74%) vs. Tamil minority — majoritarian approach led to civil war",
            "Majoritarianism: belief that majority community should rule in a way that disregards minority interests — WRONG approach",
            "Why power sharing is good: reduces conflict, respects diversity, prevents tyranny",
            "Forms of power sharing: Horizontal (among organs — legislature, executive, judiciary), Vertical (between levels of government), among political parties"
          ],
          formulas: [
            "Belgium Model: Power shared among communities (linguistic), three governments (federal + regional + community)",
            "Sri Lanka Model: Sinhala Only Act (1956) → alienated Tamils → Civil War"
          ],
          mcqs: [
            { q: "Belgium resolved its ethnic conflicts through:", opts: ["Power sharing and federalism","Majoritarianism","Civil war","Expulsion of minority"], ans: 0, exp: "Belgium adopted a federal model with community governments sharing power, avoiding civil war." },
            { q: "Sinhala Only Act (1956) in Sri Lanka was aimed at:", opts: ["Making Sinhala the only official language","Promoting Tamil rights","Federal system","Equal rights for all"], ans: 0, exp: "The Sinhala Only Act made Sinhala the only official language, alienating the Tamil minority community." },
            { q: "Horizontal distribution of power means power is shared among:", opts: ["Organs of government (legislature, executive, judiciary)","Levels of government","Political parties","Social groups"], ans: 0, exp: "Horizontal distribution = separation of powers among legislature, executive and judiciary at the same level." }
          ]
        },
        {
          id: 5, title: 'Development',
          subtitle: 'Economics Ch.1 | What is Development, HDI, Per Capita Income',
          keyPoints: [
            "Development: increase in economic growth + improvement in quality of life",
            "Per capita income = Total national income / Total population",
            "World Bank criteria: countries with per capita income > $49,300 (2019) are rich/developed",
            "HDI (Human Development Index): combines per capita income + life expectancy + education",
            "India's development goal: increases in income AND improved quality of life for ALL citizens",
            "Aspirations differ: different people have different developmental goals",
            "National Development: what is good for one region may not be good for another"
          ],
          formulas: [
            "Per Capita Income = Total National Income / Population",
            "HDI = (Life Expectancy Index + Education Index + Income Index) / 3",
            "GDP (Gross Domestic Product) = total value of all goods and services produced in a country in a year"
          ],
          mcqs: [
            { q: "Which organisation publishes the Human Development Report?", opts: ["UNDP","World Bank","IMF","WHO"], ans: 0, exp: "The UNDP (United Nations Development Programme) publishes the annual Human Development Report." },
            { q: "The Human Development Index does NOT include:", opts: ["Military expenditure","Per capita income","Life expectancy","Education"], ans: 0, exp: "HDI includes life expectancy, education, and per capita income — not military expenditure." },
            { q: "Kerala has better human development indicators because:", opts: ["Investment in education and health","High per capita income alone","Large population","Industrialisation"], ans: 0, exp: "Kerala's success is due to high investment in education and healthcare, despite moderate income levels." }
          ]
        },
        {
          id: 6, title: 'Money and Credit',
          subtitle: 'Economics Ch.3 | Forms of Credit, Banks, Formal vs Informal',
          keyPoints: [
            "Money as medium of exchange: eliminates double coincidence of wants (problem in barter)",
            "Double coincidence of wants: both parties need what the other has — barter's main problem",
            "Credit (loan): arrangement where lender supplies money/goods in return for promise of future payment",
            "Terms of credit: interest rate, collateral, documentation, mode of repayment",
            "Formal credit: banks, cooperative societies — regulated by RBI, lower interest",
            "Informal credit: moneylenders, traders, relatives — higher interest, exploitative",
            "SHG (Self Help Group): group of 15-20 women who pool savings and give each other loans"
          ],
          formulas: [
            "Credit can be positive (enables business growth) or negative (debt trap for poor)",
            "RBI: Reserve Bank of India — regulates and supervises formal credit system in India",
            "Collateral: asset pledged as security for a loan"
          ],
          mcqs: [
            { q: "The main problem with the barter system is:", opts: ["Double coincidence of wants","Lack of money","High inflation","Unequal trade"], ans: 0, exp: "Barter requires both parties to want what the other has — double coincidence of wants is very difficult." },
            { q: "Which institution supervises the formal credit sector in India?", opts: ["Reserve Bank of India (RBI)","SEBI","NABARD","World Bank"], ans: 0, exp: "RBI (Reserve Bank of India) is the central bank that monitors and regulates all formal credit/banking in India." },
            { q: "Self Help Groups primarily help:", opts: ["Rural women in accessing credit","Large industries","Urban workers","Government employees"], ans: 0, exp: "SHGs help poor rural women by pooling savings and providing loans at low interest, bypassing moneylenders." }
          ]
        },
        {
          id: 7, title: 'Agriculture in India',
          subtitle: 'Geography Ch.4 | Types of Farming, Crops, Green Revolution',
          keyPoints: [
            "India is an agricultural country — 2/3 of population depends on agriculture",
            "Types of farming: Subsistence (primitive, intensive) and Commercial farming",
            "Primitive subsistence: slash and burn / jhum cultivation; shifting cultivation",
            "Rabi crops (winter): wheat, barley, peas, mustard, linseed",
            "Kharif crops (summer/monsoon): rice, maize, jowar, bajra, cotton, jute",
            "Zaid crops (summer): watermelon, muskmelon, cucumber",
            "Green Revolution: 1960s — HYV seeds, fertilizers, irrigation → increased food production",
            "India is the largest producer of pulses; 2nd in rice, wheat"
          ],
          formulas: [
            "Rabi (Oct-Mar): Wheat, Barley, Mustard, Peas",
            "Kharif (Jun-Sep): Rice, Cotton, Jute, Maize, Sugarcane",
            "Zaid (Mar-Jun): Melon, Cucumber, Fodder crops"
          ],
          mcqs: [
            { q: "Which crop is known as the 'Golden Fibre'?", opts: ["Jute","Cotton","Silk","Wheat"], ans: 0, exp: "Jute is called the 'Golden Fibre' because of its golden colour and economic importance. India leads in production." },
            { q: "The Green Revolution is associated with which crop?", opts: ["Wheat and Rice","Cotton","Jute","Sugarcane"], ans: 0, exp: "Green Revolution (1960s) introduced HYV seeds especially for wheat and rice, led by M.S. Swaminathan." },
            { q: "Rice requires which type of climate?", opts: ["Hot and humid climate with high rainfall","Cold and dry","Moderate temperature","Desert conditions"], ans: 0, exp: "Rice needs hot and humid climate with 100-200cm rainfall or good irrigation — grown mainly in river deltas." }
          ]
        },
        {
          id: 8, title: 'Manufacturing Industries',
          subtitle: 'Geography Ch.6 | Textile, Steel, Cement, Software Industries',
          keyPoints: [
            "Manufacturing: production of goods in large quantities using raw materials and machines",
            "Agglomeration economies: benefits from clustering of industries near each other",
            "Cotton Textile Industry: oldest industry; Mumbai, Ahmedabad (Manchester of India), Coimbatore",
            "Iron and Steel Industry: basic/key industry; Jharkhand-Bengal belt, Odisha, Chhattisgarh",
            "Cement Industry: raw materials are limestone, silica, gypsum; production growing fast",
            "Software/IT Industry: Bangalore (Silicon Valley of India), Hyderabad, Chennai, Pune, Mumbai",
            "Industrial pollution: major environmental concern; needs green technologies"
          ],
          formulas: [
            "Manchester of India = Ahmedabad (cotton textile)",
            "Silicon Valley of India = Bangalore (IT/software)",
            "Pittsburgh of India = Jamshedpur (steel)"
          ],
          mcqs: [
            { q: "Ahmedabad is called the 'Manchester of India' because of:", opts: ["Cotton textile industry","IT industry","Steel production","Automobile industry"], ans: 0, exp: "Ahmedabad has a large concentration of cotton textile mills, similar to Manchester in England — hence the name." },
            { q: "Which city is known as the 'Silicon Valley of India'?", opts: ["Bangalore","Mumbai","Chennai","Delhi"], ans: 0, exp: "Bangalore (now Bengaluru) is India's IT hub with largest number of IT companies — called Silicon Valley of India." },
            { q: "TISCO (Tata Iron and Steel Company) is located at:", opts: ["Jamshedpur","Rourkela","Bhilai","Bokaro"], ans: 0, exp: "TISCO (now Tata Steel) was established in 1907 at Jamshedpur, Jharkhand — India's first steel plant." }
          ]
        },
        {
          id: 9, title: 'Political Parties',
          subtitle: 'Civics Ch.6 | Functions, Types, Challenges, Reform',
          keyPoints: [
            "Political party: organized group of people that seeks to capture political power through elections",
            "Functions: contest elections, mobilize voters, form government, make laws, play opposition",
            "National parties: INC, BJP, BSP, CPI, CPM, NCP (recognized by Election Commission)",
            "State parties: recognized at state level only",
            "Challenges: dynastic succession, money and muscle power, no internal democracy, criminalization",
            "Electoral reform: Right to Reject (NOTA — None of the Above); anti-defection law",
            "India has a multi-party system"
          ],
          formulas: [
            "Political party = ideology + organization + goal to win power",
            "NOTA: None of the Above — option introduced in Indian elections",
            "Anti-Defection Law: members cannot vote against their party or face disqualification"
          ],
          mcqs: [
            { q: "In India, the national political parties are recognised by:", opts: ["Election Commission of India","Parliament","President","Supreme Court"], ans: 0, exp: "The Election Commission of India (ECI) officially recognizes and de-recognizes national and state parties." },
            { q: "Which of the following is NOT a function of a political party?", opts: ["Running private businesses","Contesting elections","Forming government","Making policies"], ans: 0, exp: "Political parties contest elections, form governments, and make policies — they don't run private businesses." },
            { q: "NOTA in Indian elections stands for:", opts: ["None of the Above","No Other Trusted Alternative","Not on the Agenda","None of the Applicants"], ans: 0, exp: "NOTA = 'None of the Above' — introduced to give voters the right to reject all candidates." }
          ]
        },
        {
          id: 10, title: 'Globalisation and the Indian Economy',
          subtitle: 'Economics Ch.4 | MNCs, Foreign Trade, Liberalisation',
          keyPoints: [
            "Globalisation: integration of countries through foreign trade and foreign investments",
            "MNCs (Multinational Corporations): companies with production in more than one country",
            "MNCs invest in developing countries for cheap labour, raw materials, and large markets",
            "Liberalisation (1991): Indian government removed many restrictions on trade and investment",
            "WTO (World Trade Organisation): international body promoting free and fair trade",
            "Impact of globalisation in India: job creation in IT, services; but small industries struggle against MNC competition",
            "Fair Globalisation: benefits should reach ALL sections, not just the rich"
          ],
          formulas: [
            "LPG Reforms (1991): Liberalisation + Privatisation + Globalisation",
            "Foreign Trade = Exports + Imports",
            "FDI = Foreign Direct Investment (when MNCs invest in a country)"
          ],
          mcqs: [
            { q: "WTO stands for:", opts: ["World Trade Organisation","World Tourism Organisation","World Technology Organisation","World Treaty Organisation"], ans: 0, exp: "WTO (World Trade Organisation) was established in 1995 to promote free and fair trade between countries." },
            { q: "India's economic liberalisation began in the year:", opts: ["1991","1985","2000","1947"], ans: 0, exp: "India adopted LPG (Liberalisation, Privatisation, Globalisation) reforms in 1991 under PM Narasimha Rao." },
            { q: "A company which owns or controls production in more than one nation is called:", opts: ["Multinational Corporation (MNC)","Public sector company","Cooperative","Domestic company"], ans: 0, exp: "MNCs operate in multiple countries — they set up production units wherever labour and resources are cheapest." }
          ]
        }
      ]
    }
  ]
};

const STUDY_TIPS = [
  { icon: '⏰', title: 'Pomodoro Technique', text: 'Study for 25 minutes, take a 5-minute break. After 4 cycles, take a 30-minute break.' },
  { icon: '📝', title: 'Active Recall', text: 'After reading a chapter, close the book and write what you remember. This boosts memory significantly.' },
  { icon: '🔄', title: 'Spaced Repetition', text: 'Revise topics at increasing intervals: 1 day, 3 days, 7 days, 21 days after first study.' },
  { icon: '🗺️', title: 'Mind Mapping', text: 'Draw diagrams linking concepts. Visual learning helps remember complex topics like Science and History.' },
  { icon: '📚', title: 'NCERT First', text: 'Always master NCERT textbooks first. Board exams are mostly based on NCERT — 80% questions come from it.' },
  { icon: '✍️', title: 'Practice Writing', text: 'Maths needs daily problem solving. Write formulas and derivations by hand — muscle memory helps in exams.' },
  { icon: '🎯', title: 'Previous Year Papers', text: 'Solve last 5 years CBSE board papers in exam conditions. This is the single best exam preparation.' },
  { icon: '💡', title: 'Teach Others', text: 'Explain concepts to friends or family. Teaching is the best way to identify gaps in your own understanding.' }
];
