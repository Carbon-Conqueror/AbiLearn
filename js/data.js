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
        { id: 1,  title: 'Real Numbers',                    subtitle: "Euclid's Division, HCF, LCM, Irrationals" },
        { id: 2,  title: 'Polynomials',                     subtitle: 'Zeroes, Relationship with Coefficients' },
        { id: 3,  title: 'Pair of Linear Equations',        subtitle: 'Graphical, Substitution, Elimination, Cross-Multiplication' },
        { id: 4,  title: 'Quadratic Equations',             subtitle: 'Standard Form, Factorisation, Quadratic Formula, Nature of Roots' },
        { id: 5,  title: 'Arithmetic Progressions',         subtitle: 'nth Term, Sum Formula, Common Difference' },
        { id: 6,  title: 'Triangles',                       subtitle: "Similarity, Thales' Theorem, Pythagoras Theorem" },
        { id: 7,  title: 'Coordinate Geometry',             subtitle: 'Distance Formula, Section Formula, Area of Triangle' },
        { id: 8,  title: 'Introduction to Trigonometry',    subtitle: 'Ratios, Standard Values, Identities' },
        { id: 9,  title: 'Applications of Trigonometry',    subtitle: 'Heights and Distances, Angle of Elevation/Depression' },
        { id: 10, title: 'Circles',                         subtitle: 'Tangent to a Circle, Number of Tangents' },
        { id: 11, title: 'Areas Related to Circles',        subtitle: 'Area of Sector, Segment, Combinations' },
        { id: 12, title: 'Surface Areas and Volumes',       subtitle: 'Combinations of Solids, Conversion of Shapes' },
        { id: 13, title: 'Statistics',                      subtitle: 'Mean, Median, Mode, Cumulative Frequency' },
        { id: 14, title: 'Probability',                     subtitle: 'Classical Probability, Complementary Events' }
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
          id: 1,
          title: 'Chemical Reactions and Equations',
          subtitle: 'Types of Reactions, Balancing Equations',
          keyPoints: [
            'A chemical reaction converts reactants into new products; indicated by change in state, colour, temperature, or gas evolution.',
            'Types of reactions: combination, decomposition, displacement, double displacement, and oxidation-reduction (redox).',
            'Oxidation = gain of oxygen / loss of hydrogen; Reduction = loss of oxygen / gain of hydrogen.',
            'Corrosion (rusting of iron) and rancidity (fats turning stale) are slow oxidation reactions encountered in daily life.',
            'Equations must be balanced to satisfy the Law of Conservation of Mass — atoms are neither created nor destroyed.'
          ],
          formulas: [
            '2Mg + O₂ → 2MgO  (Combination)',
            'CaCO₃ → CaO + CO₂  (Decomposition)',
            'Fe + CuSO₄ → FeSO₄ + Cu  (Displacement)',
            'NaOH + HCl → NaCl + H₂O  (Double displacement)',
            'OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain'
          ],
          mcqs: [
            { q: 'Which of the following is a decomposition reaction?', opts: ['2H₂ + O₂ → 2H₂O', 'CaCO₃ → CaO + CO₂', 'Fe + CuSO₄ → FeSO₄ + Cu', 'NaOH + HCl → NaCl + H₂O'], ans: 1, exp: 'CaCO₃ breaks down into two simpler substances — a single reactant gives two products, which is decomposition.' },
            { q: 'The law that states atoms are neither created nor destroyed in a chemical reaction is:', opts: ['Law of Definite Proportions', 'Law of Multiple Proportions', 'Law of Conservation of Mass', "Avogadro's Law"], ans: 2, exp: 'Law of Conservation of Mass: total mass of reactants equals total mass of products in every chemical reaction.' },
            { q: 'Rusting of iron is an example of:', opts: ['Displacement reaction', 'Double displacement reaction', 'Decomposition reaction', 'Oxidation reaction'], ans: 3, exp: 'Rusting is a slow oxidation reaction — iron reacts with oxygen and moisture to form iron oxide (rust).' },
            { q: 'When zinc reacts with dilute sulphuric acid, what type of reaction occurs?', opts: ['Combination', 'Displacement', 'Double displacement', 'Decomposition'], ans: 1, exp: 'Zn + H₂SO₄ → ZnSO₄ + H₂↑ — zinc displaces hydrogen from the acid; this is a displacement reaction.' },
            { q: 'The burning of magnesium in air produces:', opts: ['Magnesium hydroxide', 'Magnesium carbonate', 'Magnesium oxide', 'Magnesium sulphate'], ans: 2, exp: '2Mg + O₂ → 2MgO. Magnesium burns with a brilliant white flame forming magnesium oxide.' }
          ]
        },
        {
          id: 2,
          title: 'Acids, Bases and Salts',
          subtitle: 'Properties, pH Scale, Indicators, Salts',
          keyPoints: [
            'Acids taste sour, turn blue litmus red, have pH < 7; bases taste bitter, turn red litmus blue, have pH > 7.',
            'Strong acids/bases are completely ionised in water; weak acids/bases are only partially ionised.',
            'pH scale (0–14): pH 7 = neutral, below 7 = acidic, above 7 = basic. Human blood pH ≈ 7.4.',
            'Neutralisation: Acid + Base → Salt + Water (exothermic reaction).',
            'Important salts: NaCl (common salt), NaHCO₃ (baking soda), Na₂CO₃·10H₂O (washing soda), CaOCl₂ (bleaching powder), CaSO₄·½H₂O (plaster of paris).'
          ],
          formulas: [
            'Neutralisation: Acid + Base → Salt + Water',
            'NaHCO₃ = Baking soda  |  Na₂CO₃·10H₂O = Washing soda',
            '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂  (on heating)',
            'CaSO₄·½H₂O (Plaster of Paris) + Water → CaSO₄·2H₂O (Gypsum)',
            'pH < 7 = Acidic  |  pH 7 = Neutral  |  pH > 7 = Basic'
          ],
          mcqs: [
            { q: 'The pH of a neutral solution is:', opts: ['0', '7', '14', '1'], ans: 1, exp: 'pH 7 indicates a neutral solution. Pure water at 25°C has pH = 7 (neither acidic nor basic).' },
            { q: 'Which substance turns phenolphthalein indicator pink?', opts: ['HCl', 'NaCl', 'NaOH', 'H₂SO₄'], ans: 2, exp: 'Phenolphthalein turns pink/magenta in basic (alkaline) solutions. NaOH is a strong base with pH > 7.' },
            { q: 'Baking soda (NaHCO₃) is used in baking because it:', opts: ['Makes dough harder', 'Releases CO₂ on heating, making dough rise', 'Adds sweet taste', 'Acts as a preservative'], ans: 1, exp: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂. CO₂ released makes baked goods light and fluffy.' },
            { q: 'Washing soda is chemically:', opts: ['NaHCO₃', 'Na₂CO₃·10H₂O', 'CaCO₃', 'CaSO₄·½H₂O'], ans: 1, exp: 'Washing soda is sodium carbonate decahydrate (Na₂CO₃·10H₂O), used as a cleaning and softening agent.' },
            { q: 'Which of the following is used as an antacid to relieve acidity?', opts: ['HCl', 'NaOH', 'Mg(OH)₂', 'NaCl'], ans: 2, exp: 'Mg(OH)₂ (milk of magnesia) is a mild base used as an antacid to neutralise excess hydrochloric acid in the stomach.' }
          ]
        },
        {
          id: 3,
          title: 'Metals and Non-Metals',
          subtitle: 'Physical Properties, Reactivity Series, Extraction',
          keyPoints: [
            'Metals: lustrous, malleable, ductile, good conductors of heat and electricity, sonorous; most are solids at room temperature (mercury is the exception).',
            'Non-metals: brittle (in solid state), poor conductors (except graphite), not lustrous; exist as solid (sulphur), liquid (bromine), or gas (oxygen).',
            'Reactivity series (most to least reactive): K > Na > Ca > Mg > Al > Zn > Fe > Pb > (H) > Cu > Hg > Ag > Au.',
            'Ionic bonds form between metals and non-metals: metals lose electrons (form cations), non-metals gain electrons (form anions).',
            'Extraction: highly reactive metals (Al, Na) by electrolysis; moderately reactive (Fe, Zn) by reduction with carbon; less reactive (Cu, Hg) by roasting/heating.'
          ],
          formulas: [
            'Metal + Oxygen → Metal oxide (basic oxide)',
            'Metal + Water → Metal hydroxide + H₂↑',
            'Metal + Dilute acid → Salt + H₂↑',
            'Reactivity: K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Au',
            'Thermite: Fe₂O₃ + 2Al → Al₂O₃ + 2Fe  (aluminothermic reaction)'
          ],
          mcqs: [
            { q: 'Which metal is found in liquid state at room temperature?', opts: ['Lead', 'Mercury', 'Aluminium', 'Sodium'], ans: 1, exp: 'Mercury (Hg) is the only metal that exists in liquid state at room temperature (melting point −39°C).' },
            { q: 'The process of depositing a thin layer of desired metal over another using electricity is called:', opts: ['Galvanisation', 'Corrosion', 'Electroplating', 'Alloying'], ans: 2, exp: 'Electroplating uses electrolysis to coat an object with a thin layer of a desired metal (e.g., nickel, silver, chromium).' },
            { q: 'Which metal reacts vigorously with cold water producing hydrogen gas and heat?', opts: ['Iron', 'Magnesium', 'Sodium', 'Copper'], ans: 2, exp: '2Na + 2H₂O → 2NaOH + H₂↑. Sodium reacts so vigorously with water that it floats and catches fire.' },
            { q: 'The most abundant metal in the Earth\'s crust is:', opts: ['Iron', 'Copper', 'Aluminium', 'Zinc'], ans: 2, exp: 'Aluminium (~8% by mass) is the most abundant metal in the Earth\'s crust. It is found as bauxite ore (Al₂O₃).' },
            { q: 'Galvanisation is coating iron with a layer of which metal to prevent rusting?', opts: ['Tin', 'Copper', 'Zinc', 'Silver'], ans: 2, exp: 'Galvanisation is the process of coating iron/steel with zinc to protect it from rusting (corrosion).' }
          ]
        },
        {
          id: 4,
          title: 'Carbon and Its Compounds',
          subtitle: 'Covalent Bonding, Hydrocarbons, Functional Groups',
          keyPoints: [
            'Carbon has valency 4; forms covalent bonds; can bond with itself extensively — this property is called catenation.',
            'Hydrocarbons: saturated (alkanes, CₙH₂ₙ₊₂) have all single bonds; unsaturated (alkenes CₙH₂ₙ, alkynes CₙH₂ₙ₋₂) have double/triple bonds.',
            'Functional groups determine chemical properties: −OH (alcohol), −COOH (carboxylic acid), −CHO (aldehyde), C=O (ketone), −X (halide).',
            'Homologous series: same functional group, differ by −CH₂− unit (14 mass units), share same general formula and similar chemical properties.',
            'Ethanol (C₂H₅OH): fuel, beverages; oxidised to ethanoic acid. Ethanoic acid (CH₃COOH) = acetic acid/vinegar; melts at 17°C (called glacial acetic acid).'
          ],
          formulas: [
            'Alkanes: CₙH₂ₙ₊₂  |  Alkenes: CₙH₂ₙ  |  Alkynes: CₙH₂ₙ₋₂',
            'CH₃OH: Methanol (toxic wood spirit)  |  C₂H₅OH: Ethanol',
            'CH₃COOH: Ethanoic acid (Acetic acid / Vinegar)',
            'Saponification: fat + NaOH → soap + glycerol',
            'Combustion: CH₄ + 2O₂ → CO₂ + 2H₂O + heat'
          ],
          mcqs: [
            { q: 'The general formula for alkanes is:', opts: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], ans: 1, exp: 'Alkanes are saturated hydrocarbons. Formula: CₙH₂ₙ₊₂ (e.g., methane CH₄ when n=1: 2×1+2=4 H atoms).' },
            { q: 'Ethanoic acid is also known as:', opts: ['Formic acid', 'Oxalic acid', 'Acetic acid', 'Lactic acid'], ans: 2, exp: 'Ethanoic acid (CH₃COOH) is commonly known as acetic acid and is present in vinegar (3–5% solution).' },
            { q: "Carbon's property to form long chains by bonding with itself is called:", opts: ['Valency', 'Catenation', 'Isomerism', 'Allotropy'], ans: 1, exp: 'Catenation is carbon\'s unique ability to form long chains (and rings) by bonding with other carbon atoms.' },
            { q: 'Soap cleans oily dirt because it:', opts: ['Dissolves oil directly', 'Forms micelles — hydrophobic tail surrounds oil, hydrophilic head faces water', 'Is acidic', 'Reacts chemically with oil'], ans: 1, exp: 'Soap molecules form micelles: hydrophobic tails trap oil while hydrophilic heads face water, allowing the dirt to be washed away.' },
            { q: 'Which of the following is an unsaturated hydrocarbon?', opts: ['Methane (CH₄)', 'Ethane (C₂H₆)', 'Ethene (C₂H₄)', 'Propane (C₃H₈)'], ans: 2, exp: 'Ethene (C₂H₄) has a C=C double bond, making it an unsaturated hydrocarbon (alkene family).' }
          ]
        },
        {
          id: 5,
          title: 'Life Processes',
          subtitle: 'Nutrition, Respiration, Transportation, Excretion',
          keyPoints: [
            'Nutrition: autotrophs make their own food (photosynthesis); heterotrophs depend on others. Photosynthesis equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (in sunlight, using chlorophyll).',
            'Respiration: aerobic (with O₂) yields ~38 ATP; anaerobic (without O₂) yields 2 ATP with ethanol (yeast) or lactic acid (muscles) as byproduct.',
            'Transportation in humans: double circulation — pulmonary (heart ↔ lungs) and systemic (heart ↔ body); heart has 4 chambers.',
            'In plants: xylem transports water/minerals upward; phloem transports food bidirectionally — the process is called translocation.',
            'Excretion: kidneys filter blood; nephron is the functional unit; urea is the main nitrogenous waste. Dialysis is used when kidneys fail.'
          ],
          formulas: [
            'Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
            'Aerobic respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 ATP',
            'Anaerobic (yeast): C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + 2 ATP',
            'Anaerobic (muscle): C₆H₁₂O₆ → 2 lactic acid + 2 ATP',
            'Transpiration: water loss from leaves through stomata (drives water column in xylem)'
          ],
          mcqs: [
            { q: 'The opening and closing of stomata in leaves is controlled by:', opts: ['Root cells', 'Xylem cells', 'Guard cells', 'Phloem cells'], ans: 2, exp: 'Guard cells surround each stoma; they become turgid (stoma opens) or flaccid (stoma closes) regulating gas exchange.' },
            { q: 'During anaerobic respiration in yeast, glucose breaks down into:', opts: ['Lactic acid + CO₂', 'Ethanol + CO₂', 'Ethanol + O₂', 'Pyruvate only'], ans: 1, exp: 'Yeast ferments glucose: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂. This is used in bread-making and alcohol fermentation.' },
            { q: 'The functional unit of the kidney is:', opts: ['Neuron', 'Alveolus', 'Nephron', 'Villus'], ans: 2, exp: 'The nephron is the structural and functional unit of the kidney, responsible for filtration and formation of urine.' },
            { q: 'Photosynthesis primarily occurs in which organelle?', opts: ['Mitochondria', 'Ribosome', 'Chloroplast', 'Vacuole'], ans: 2, exp: 'Chloroplasts contain chlorophyll (the green pigment) and are the sites of photosynthesis in plant cells.' },
            { q: 'Which blood vessel carries oxygenated blood from the lungs to the heart?', opts: ['Pulmonary artery', 'Pulmonary vein', 'Aorta', 'Vena cava'], ans: 1, exp: 'The pulmonary vein carries oxygenated blood from the lungs back to the left atrium of the heart.' }
          ]
        },
        {
          id: 6,
          title: 'Control and Coordination',
          subtitle: 'Nervous System, Hormones, Reflex Actions',
          keyPoints: [
            'Nervous system: brain + spinal cord = CNS; peripheral nerves = PNS. Neurons are the structural and functional units of the nervous system.',
            'Reflex arc path: stimulus → receptor → sensory neuron → spinal cord → motor neuron → effector → response. Bypasses the brain for speed.',
            'Brain regions: cerebrum (thinking, voluntary actions), cerebellum (balance, coordination), medulla oblongata (involuntary — breathing, heart rate).',
            'Plant hormones: auxin (phototropism/growth), gibberellin (stem elongation), cytokinin (cell division), abscisic acid (dormancy, stomata closing).',
            'Human hormones: insulin (lowers blood glucose, pancreas), adrenaline (fight-or-flight, adrenal gland), thyroxine (metabolism, thyroid gland), growth hormone (pituitary).'
          ],
          formulas: [
            'Reflex arc: Stimulus → Receptor → Sensory neuron → Spinal cord → Motor neuron → Effector',
            'Synapse: gap between neurons; impulse transmitted by neurotransmitters',
            'Phototropism: auxin accumulates on shaded side → more elongation → bending toward light',
            'Insulin: lowers blood glucose  |  Glucagon: raises blood glucose  (both from pancreas)',
            'Iodine deficiency → goitre (swelling of thyroid gland in neck)'
          ],
          mcqs: [
            { q: 'Which part of the brain controls balance and coordination of body movements?', opts: ['Cerebrum', 'Hypothalamus', 'Cerebellum', 'Medulla'], ans: 2, exp: 'The cerebellum coordinates voluntary movements, balance, and posture. Damage to it causes loss of coordination.' },
            { q: 'A reflex action is controlled by the:', opts: ['Cerebrum', 'Spinal cord', 'Cerebellum', 'Medulla'], ans: 1, exp: 'Reflex actions are controlled at the spinal cord level — they bypass the brain for a much faster response.' },
            { q: 'The hormone that lowers blood sugar levels is:', opts: ['Thyroxine', 'Adrenaline', 'Insulin', 'Oestrogen'], ans: 2, exp: 'Insulin, secreted by the beta cells of the islets of Langerhans in the pancreas, lowers blood glucose by promoting its uptake.' },
            { q: 'Which plant hormone is responsible for bending of a plant shoot toward light?', opts: ['Gibberellin', 'Cytokinin', 'Auxin', 'Abscisic acid'], ans: 2, exp: 'Auxin accumulates on the shaded side of a shoot → more elongation → bending toward light. This is phototropism.' },
            { q: 'Adrenaline is produced by which gland?', opts: ['Thyroid', 'Pituitary', 'Pancreas', 'Adrenal'], ans: 3, exp: 'Adrenaline (epinephrine) is produced by the adrenal medulla. It prepares the body for "fight-or-flight" emergencies.' }
          ]
        },
        {
          id: 7,
          title: 'How Do Organisms Reproduce?',
          subtitle: 'Asexual & Sexual Reproduction, Contraception',
          keyPoints: [
            'Asexual reproduction involves a single parent with no fertilisation. Types: binary fission (Amoeba), budding (Hydra, yeast), fragmentation (Spirogyra), spore formation (Rhizopus), vegetative propagation (plants).',
            'Sexual reproduction in flowering plants: flowers have stamens (male) and pistil (female); pollination → fertilisation → fruit and seed formation.',
            'Human male: testes produce sperm (slightly below body temperature); sperm travel through vas deferens to the urethra.',
            'Human female: ovaries release one egg per month (ovulation at ~day 14 of a 28-day cycle); fertilisation occurs in the fallopian tube; zygote implants in uterus.',
            'Sexually transmitted infections (STIs): HIV/AIDS, gonorrhoea, syphilis. Prevention: condoms; early treatment is crucial.'
          ],
          formulas: [
            'Binary fission: one cell divides into two identical cells (Amoeba, bacteria)',
            'Budding: new organism grows as an outgrowth from parent (Hydra, yeast)',
            'Human gestation: ~9 months (38 weeks)',
            'Menstrual cycle: ~28 days; ovulation around day 14',
            'Zygote (1 cell) → Embryo → Foetus → Baby'
          ],
          mcqs: [
            { q: 'Which organism reproduces by budding?', opts: ['Amoeba', 'Paramecium', 'Hydra', 'Spirogyra'], ans: 2, exp: 'Hydra reproduces by budding — a new individual grows as an outgrowth (bud) on the parent body, eventually detaching.' },
            { q: 'Double fertilisation is a feature of:', opts: ['Gymnosperms', 'Angiosperms', 'Fungi', 'Algae'], ans: 1, exp: 'Double fertilisation occurs in angiosperms: one sperm fertilises the egg (forms zygote), another fuses with polar nuclei (forms endosperm).' },
            { q: 'Sperm in human males are produced in:', opts: ['Seminal vesicles', 'Prostate gland', 'Testes', 'Vas deferens'], ans: 2, exp: 'Sperm are produced in the testes located in the scrotum (outside the body) to keep them 2–2.5°C cooler than body temperature.' },
            { q: 'Fertilisation of the egg in humans takes place in the:', opts: ['Uterus', 'Ovary', 'Vagina', 'Fallopian tube'], ans: 3, exp: 'Fertilisation occurs in the fallopian tube (oviduct). The resulting zygote then travels to the uterus for implantation.' },
            { q: 'Vegetative propagation of potato plants occurs through:', opts: ['Seeds', 'Spores', 'Tubers (stem)', 'Pollination'], ans: 2, exp: 'Potato tubers are modified underground stems with buds (eyes). Each bud can grow into a new plant — this is vegetative propagation.' }
          ]
        },
        {
          id: 8,
          title: 'Heredity and Evolution',
          subtitle: "Mendel's Laws, Genetics, Darwin's Theory",
          keyPoints: [
            "Mendel's Law of Segregation: each organism has two alleles for each trait; alleles separate during gamete formation so each gamete carries only one allele.",
            "Mendel's Law of Independent Assortment: genes for different traits are inherited independently of one another (for genes on different chromosomes).",
            'Monohybrid cross F₂ phenotypic ratio: 3 dominant : 1 recessive. Genotypic ratio: 1 AA : 2 Aa : 1 aa. Dihybrid F₂ ratio: 9:3:3:1.',
            "Sex determination in humans: females are XX, males are XY. The father (X or Y sperm) determines the sex of the child.",
            "Darwin's Theory of Natural Selection: organisms with favourable variations survive and reproduce (survival of the fittest); unfavourable variations are eliminated over generations."
          ],
          formulas: [
            'Monohybrid F₂ phenotype ratio: 3 (dominant) : 1 (recessive)',
            'Monohybrid F₂ genotype ratio: 1 AA : 2 Aa : 1 aa',
            'Dihybrid F₂ phenotype ratio: 9 : 3 : 3 : 1',
            'Human sex: Female = XX  |  Male = XY  (father determines sex)',
            'Dominant allele (A) masks recessive (a); Aa shows dominant trait'
          ],
          mcqs: [
            { q: 'In a monohybrid cross between tall (TT) and dwarf (tt) pea plants, all F₁ plants are:', opts: ['Dwarf (tt)', 'Tall (TT)', 'Tall (Tt)', 'Half tall, half dwarf'], ans: 2, exp: 'F₁ = all Tt (heterozygous tall). T (tall) is completely dominant over t (dwarf), so all F₁ plants are phenotypically tall.' },
            { q: 'The F₂ phenotypic ratio in a monohybrid cross is:', opts: ['1:1', '1:2:1', '3:1', '9:3:3:1'], ans: 2, exp: 'Crossing F₁ (Tt × Tt) gives TT:Tt:tt = 1:2:1 genotypically, but 3 tall : 1 dwarf phenotypically = 3:1.' },
            { q: "The sex of a child is determined by the father's contribution because:", opts: ['Mother always gives X chromosome', 'Father contributes either X or Y; X → girl, Y → boy', 'Mother contributes Y chromosome', 'Both parents contribute equally to sex'], ans: 1, exp: 'Mother can only give X. Father gives either X (producing XX = girl) or Y (producing XY = boy). So the father determines sex.' },
            { q: 'Forelimb of a horse and arm of a human are examples of:', opts: ['Analogous organs', 'Vestigial organs', 'Homologous organs', 'None of these'], ans: 2, exp: 'Homologous organs have the same basic structure (same evolutionary origin) but different functions, indicating common ancestry.' },
            { q: 'The theory of evolution by natural selection was proposed by:', opts: ['Gregor Mendel', 'Jean-Baptiste Lamarck', 'Charles Darwin', 'Hugo de Vries'], ans: 2, exp: "Charles Darwin proposed evolution through natural selection in 'On the Origin of Species' (1859)." }
          ]
        },
        {
          id: 9,
          title: 'Light – Reflection and Refraction',
          subtitle: 'Mirrors, Lenses, Mirror and Lens Formulae',
          keyPoints: [
            'Mirror formula: 1/v + 1/u = 1/f ; Magnification m = −v/u = h′/h. New Cartesian sign convention: distances measured from pole; positive in direction of incident light.',
            'Concave mirror: converging; forms real, inverted image when object is beyond F. Forms virtual, erect, magnified image when object is between P and F. Used in torches, shaving mirrors.',
            'Convex mirror: diverging; always forms virtual, erect, diminished image irrespective of object position. Used as rear-view mirrors.',
            "Refraction: bending of light at a boundary between two media. Snell's Law: n₁ sin θ₁ = n₂ sin θ₂. Refractive index n = speed of light in vacuum / speed in medium.",
            'Lens formula: 1/v − 1/u = 1/f ; Power P = 1/f (metres), unit = dioptre (D). Convex lens: converging, positive f and P; Concave lens: diverging, negative f and P.'
          ],
          formulas: [
            'Mirror formula: 1/v + 1/u = 1/f',
            'Mirror magnification: m = −v/u = h′/h',
            "Snell's Law: n₁ sin θ₁ = n₂ sin θ₂  |  n = c/v",
            'Lens formula: 1/v − 1/u = 1/f',
            'Power of lens: P = 1/f (metres)  →  unit: Dioptre (D)'
          ],
          mcqs: [
            { q: 'If the focal length of a concave mirror is 15 cm, its radius of curvature is:', opts: ['7.5 cm', '15 cm', '30 cm', '45 cm'], ans: 2, exp: 'Radius of curvature R = 2f = 2 × 15 = 30 cm. The centre of curvature is twice as far from the pole as the focus.' },
            { q: 'Which type of mirror is used as a rear-view mirror in vehicles?', opts: ['Concave', 'Convex', 'Plane', 'Parabolic'], ans: 1, exp: 'Convex mirrors provide a wider field of view and always form virtual, erect, diminished images — ideal for rear-view mirrors.' },
            { q: 'A convex lens of focal length 20 cm has power equal to:', opts: ['−5 D', '+0.05 D', '+5 D', '+20 D'], ans: 2, exp: 'P = 1/f = 1/0.20 m = +5 D. Convex (converging) lenses have positive focal length and positive power.' },
            { q: 'A ray of light passing through the principal focus of a convex lens, after refraction, emerges:', opts: ['Parallel to the principal axis', 'Perpendicular to the principal axis', 'Through the optical centre', 'Back along the same path'], ans: 0, exp: 'A ray through the principal focus of a convex lens refracts and exits parallel to the principal axis — one of the standard ray rules.' },
            { q: 'The SI unit of power of a lens is:', opts: ['Metre', 'Centimetre', 'Dioptre', 'Candela'], ans: 2, exp: 'Power of a lens is measured in dioptres (D), where 1 D = 1 m⁻¹. P = 1/f, where f is focal length in metres.' }
          ]
        },
        {
          id: 10,
          title: 'Human Eye and the Colourful World',
          subtitle: 'Structure of Eye, Defects, Dispersion, Scattering',
          keyPoints: [
            'Human eye: cornea refracts light in, iris controls pupil size, lens (flexible) focuses image on retina, optic nerve sends signal to brain.',
            'Accommodation: ability of the eye lens to change its curvature (focal length) to focus on objects at different distances, controlled by ciliary muscles.',
            'Myopia (short-sightedness): image forms in front of retina; cannot see distant objects; corrected by a concave (diverging) lens.',
            'Hypermetropia (long-sightedness): image forms behind retina; cannot see near objects clearly; corrected by a convex (converging) lens.',
            'Dispersion: white light splits into VIBGYOR spectrum through a prism. Rayleigh scattering: shorter wavelengths (blue/violet) scattered more by atmosphere — sky appears blue; sun appears red at sunrise/sunset.'
          ],
          formulas: [
            'Normal near point of human eye: 25 cm (least distance of distinct vision)',
            'Myopia → concave lens  |  Hypermetropia → convex lens  |  Presbyopia → bifocal lens',
            'VIBGYOR: Violet Indigo Blue Green Yellow Orange Red (spectrum order)',
            'Tyndall effect: scattering of light by fine particles in a colloid',
            'Blue sky: shorter (blue) wavelengths scattered more strongly by atmospheric particles'
          ],
          mcqs: [
            { q: 'The defect in which a person cannot see distant objects clearly is:', opts: ['Hypermetropia', 'Presbyopia', 'Myopia', 'Astigmatism'], ans: 2, exp: 'Myopia (near-sightedness): image of distant objects forms in front of the retina. Corrected using a concave lens.' },
            { q: 'Which colour of light is least deviated when white light passes through a glass prism?', opts: ['Violet', 'Blue', 'Red', 'Green'], ans: 2, exp: 'Red light (longest wavelength, ~700 nm) is deviated least by a prism. Violet (shortest wavelength) is deviated most.' },
            { q: 'The sky appears blue because:', opts: ['It reflects blue light from the sea', 'Blue light has longer wavelength and travels farther', 'Rayleigh scattering — blue light is scattered more by atmospheric particles', 'The atmosphere absorbs other colours'], ans: 2, exp: 'Blue light (~450 nm) has a shorter wavelength and is scattered much more than longer wavelengths by atmospheric molecules (Rayleigh scattering). This scattered blue light fills the sky.' },
            { q: 'Which part of the human eye controls the amount of light entering it?', opts: ['Cornea', 'Iris', 'Lens', 'Retina'], ans: 1, exp: 'The iris is the coloured ring that controls the size of the pupil, thereby regulating the amount of light entering the eye.' },
            { q: 'The minimum distance of distinct vision for a normal human eye is:', opts: ['10 cm', '25 cm', '50 cm', '1 m'], ans: 1, exp: 'The near point (least distance of distinct vision) for a normal adult human eye is 25 cm.' }
          ]
        },
        {
          id: 11,
          title: 'Electricity',
          subtitle: "Ohm's Law, Resistance, Series & Parallel Circuits, Power",
          keyPoints: [
            "Ohm's Law: V = IR at constant temperature. SI units: voltage V (volt), current I (ampere), resistance R (ohm, Ω).",
            'Resistance of a wire: R = ρL/A (ρ = resistivity, L = length, A = cross-sectional area). Resistivity is a material property (independent of dimensions).',
            'Series circuit: current same throughout; total voltage = sum of individual voltages; total resistance R = R₁ + R₂ + R₃.',
            'Parallel circuit: voltage same across all components; total current = sum of branch currents; 1/R = 1/R₁ + 1/R₂ + 1/R₃ (equivalent resistance is less than smallest individual).',
            "Electric power P = VI = I²R = V²/R (watts). Energy = P × t. 1 unit of electricity = 1 kWh. Joule's law: H = I²Rt."
          ],
          formulas: [
            "Ohm's Law: V = IR",
            'Series circuit: R_total = R₁ + R₂ + R₃',
            'Parallel circuit: 1/R_total = 1/R₁ + 1/R₂ + 1/R₃',
            'Electric power: P = VI = I²R = V²/R  (watts, W)',
            "Joule's heating law: H = I²Rt  (joules, J)"
          ],
          mcqs: [
            { q: 'Three resistors 2Ω, 3Ω and 6Ω are connected in parallel. The equivalent resistance is:', opts: ['11 Ω', '1 Ω', '0.5 Ω', '6 Ω'], ans: 1, exp: '1/R = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1. Therefore R = 1 Ω.' },
            { q: 'A bulb rated 220 V – 100 W has resistance:', opts: ['220 Ω', '484 Ω', '100 Ω', '22 Ω'], ans: 1, exp: 'R = V²/P = (220)²/100 = 48400/100 = 484 Ω.' },
            { q: 'The SI unit of electric charge is:', opts: ['Ampere', 'Volt', 'Coulomb', 'Watt'], ans: 2, exp: 'The SI unit of charge is the Coulomb (C). Current I = Q/t (coulombs per second = amperes).' },
            { q: 'Household appliances are connected in parallel because:', opts: ['It reduces total resistance', 'Each appliance gets full voltage and can be controlled independently', 'It reduces current drawn', 'Series connection is unsafe'], ans: 1, exp: 'In parallel, each appliance operates at the full supply voltage (230 V) and can be switched on/off without affecting others.' },
            { q: "According to Joule's law of heating, the heat produced is proportional to:", opts: ['I only', 'I² (square of current)', '√I', '1/I'], ans: 1, exp: "Joule's law: H = I²Rt. Heat is proportional to the square of current (I²), resistance (R), and time (t)." }
          ]
        },
        {
          id: 12,
          title: 'Magnetic Effects of Electric Current',
          subtitle: 'Magnetic Field, Electromagnetic Induction, AC/DC',
          keyPoints: [
            'Oersted (1820) discovered that a current-carrying conductor produces a magnetic field around it (electricity and magnetism are related).',
            "Fleming's Left-Hand Rule: for a current-carrying conductor in a magnetic field — index finger = B (field direction), middle finger = I (current direction), thumb = F (force/motion direction). Used for motors.",
            "Fleming's Right-Hand Rule: for electromagnetic induction — thumb = motion of conductor, index = B, middle finger = direction of induced current. Used for generators.",
            'Electric motor converts electrical energy to mechanical energy. Electric generator (dynamo) converts mechanical energy to electrical energy.',
            'AC (alternating current) changes direction periodically (India: 50 Hz, 220–230 V); DC (direct current) flows in one direction. Transformers work only with AC to step voltage up or down.'
          ],
          formulas: [
            "Fleming's Left-Hand Rule → Electric motor  (FBI: Force, B-field, current I)",
            "Fleming's Right-Hand Rule → Electric generator (induced EMF)",
            'Right-Hand Thumb Rule: thumb = current direction; curled fingers = magnetic field direction',
            'India mains supply: 220–230 V AC at 50 Hz',
            'Transformer ratio: V₁/V₂ = N₁/N₂  (N = number of turns)'
          ],
          mcqs: [
            { q: 'The direction of induced current in a conductor is given by:', opts: ["Ohm's Law", "Fleming's Left-Hand Rule", "Fleming's Right-Hand Rule", 'Right-Hand Thumb Rule'], ans: 2, exp: "Fleming's Right-Hand Rule gives the direction of induced current in a generator (electromagnetic induction / Faraday's law)." },
            { q: 'An electric motor converts:', opts: ['Mechanical energy to electrical energy', 'Electrical energy to mechanical energy', 'Heat to electrical energy', 'Chemical energy to electrical energy'], ans: 1, exp: 'An electric motor uses the magnetic effect of current to convert electrical energy into mechanical (rotational kinetic) energy.' },
            { q: 'The frequency of AC supply in India is:', opts: ['60 Hz', '50 Hz', '100 Hz', '25 Hz'], ans: 1, exp: 'India uses 50 Hz AC at 220–230 V. (The USA uses 60 Hz at 120 V.)' },
            { q: 'What happens to the magnetic field inside a solenoid when the current is doubled?', opts: ['Remains the same', 'Becomes half', 'Becomes double', 'Becomes four times'], ans: 2, exp: 'B = μ₀nI inside a solenoid — it is directly proportional to current I. Doubling I doubles B.' },
            { q: 'A transformer is used to:', opts: ['Convert AC to DC', 'Change the frequency of AC', 'Step up or step down AC voltage', 'Store electrical energy'], ans: 2, exp: 'A transformer uses electromagnetic induction to step up (increase) or step down (decrease) an AC voltage. It does not work with DC.' }
          ]
        },
        {
          id: 13,
          title: 'Our Environment',
          subtitle: 'Ecosystems, Food Chains, Ozone Layer, Waste Management',
          keyPoints: [
            'Ecosystem: biotic (living — producers, consumers, decomposers) + abiotic (non-living — water, soil, temperature, light) components interacting together.',
            '10% Energy Law (Lindemann): only 10% of the energy available at one trophic level is transferred to the next; ~90% is lost as heat during metabolic processes.',
            'Ozone (O₃) layer in the stratosphere absorbs harmful UV-B and UV-C radiation. CFCs (chlorofluorocarbons) from refrigerators and aerosols catalytically destroy ozone.',
            'Biodegradable wastes decompose naturally by microorganisms (food waste, paper, cotton); non-biodegradable do not (plastics, DDT, heavy metals, glass).',
            'Biomagnification: concentration of non-biodegradable toxic chemicals (e.g., DDT, mercury) increases at each successive trophic level up the food chain.'
          ],
          formulas: [
            '10% energy law: only 10% of energy passes to each successive trophic level',
            'Food chain: Producer → Primary consumer → Secondary consumer → Tertiary consumer',
            'Ozone formation: 3O₂ + UV → 2O₃  |  CFC destroys ozone in stratosphere',
            'Biodegradable: food, paper, cotton  |  Non-biodegradable: plastic, DDT, metals',
            'Biomagnification: [toxin] increases at higher trophic levels'
          ],
          mcqs: [
            { q: 'How much energy is transferred from one trophic level to the next?', opts: ['1%', '10%', '20%', '50%'], ans: 1, exp: 'The 10% law (Lindemann): only 10% of energy at one trophic level is available at the next. 90% is lost as heat.' },
            { q: 'Depletion of the ozone layer is mainly caused by:', opts: ['Carbon dioxide (CO₂)', 'Methane (CH₄)', 'Chlorofluorocarbons (CFCs)', 'Nitrogen oxides'], ans: 2, exp: 'CFCs released from refrigerators, ACs, and aerosol sprays rise to the stratosphere and catalytically destroy ozone molecules.' },
            { q: 'Which of the following is a non-biodegradable substance?', opts: ['Paper', 'Cotton cloth', 'Plastic', 'Food waste'], ans: 2, exp: 'Plastic is non-biodegradable — microorganisms cannot decompose it, so it persists in the environment for hundreds of years.' },
            { q: 'The process by which toxic chemical concentration increases at higher trophic levels is called:', opts: ['Biomagnification', 'Biodegradation', 'Eutrophication', 'Bioaccumulation'], ans: 0, exp: 'Biomagnification: substances like DDT and mercury are not broken down and accumulate in organisms; concentration multiplies at each trophic level.' },
            { q: 'Producers in an ecosystem are:', opts: ['Animals', 'Fungi', 'Green plants (autotrophs)', 'Decomposing bacteria'], ans: 2, exp: 'Producers (green plants and other autotrophs) synthesise their own food via photosynthesis and form the base of every food chain.' }
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
        { id: 1,  title: 'A Letter to God',                    subtitle: "First Flight — Ch 1 | Lencho's unshakeable faith" },
        { id: 2,  title: 'Nelson Mandela: Long Walk to Freedom', subtitle: 'First Flight — Ch 2 | Apartheid to Freedom' },
        { id: 3,  title: 'Two Stories About Flying',           subtitle: 'First Flight — Ch 3 | His First Flight & Black Aeroplane' },
        { id: 4,  title: 'From the Diary of Anne Frank',       subtitle: 'First Flight — Ch 4 | World War II, Holocaust' },
        { id: 5,  title: 'Glimpses of India',                  subtitle: 'First Flight — Ch 7 | A Baker, Coorg, Tea from Assam' },
        { id: 6,  title: 'Mijbil the Otter',                   subtitle: "First Flight — Ch 8 | Gavin Maxwell's pet otter" },
        { id: 7,  title: 'Madam Rides the Bus',                subtitle: "First Flight — Ch 9 | Valli's first bus journey" },
        { id: 8,  title: 'The Sermon at Benares',              subtitle: "First Flight — Ch 10 | Buddha's teaching on death and grief" },
        { id: 9,  title: 'Footprints Without Feet',            subtitle: 'Footprints — Ch 5 | Griffin the invisible scientist' },
        { id: 10, title: 'The Necklace',                       subtitle: "Footprints — Ch 7 | Matilda's downfall over pride" },
        { id: 11, title: 'The Book That Saved the Earth',      subtitle: 'Footprints — Ch 10 | Aliens misread Mother Goose' }
      ]
    },
    {
      id: 'social',
      name: 'Social Science',
      icon: '🌍',
      color: 'social',
      description: 'History, Geography, Civics & Economics',
      chapters: [
        { id: 1,  title: 'The Rise of Nationalism in Europe',      subtitle: 'History Ch.1 | French Revolution, Romanticism, Revolutions of 1830/1848' },
        { id: 2,  title: 'Nationalism in India',                   subtitle: 'History Ch.2 | Non-Cooperation, Civil Disobedience, Quit India' },
        { id: 3,  title: 'Resources and Development',              subtitle: 'Geography Ch.1 | Types of Resources, Land Use, Soil Erosion' },
        { id: 4,  title: 'Power Sharing',                          subtitle: 'Civics Ch.1 | Why Power Sharing is Important, Forms of Power Sharing' },
        { id: 5,  title: 'Development',                            subtitle: 'Economics Ch.1 | What is Development, HDI, Per Capita Income' },
        { id: 6,  title: 'Money and Credit',                       subtitle: 'Economics Ch.3 | Forms of Credit, Banks, Formal vs Informal' },
        { id: 7,  title: 'Agriculture in India',                   subtitle: 'Geography Ch.4 | Types of Farming, Crops, Green Revolution' },
        { id: 8,  title: 'Manufacturing Industries',               subtitle: 'Geography Ch.6 | Textile, Steel, Cement, Software Industries' },
        { id: 9,  title: 'Political Parties',                      subtitle: 'Civics Ch.6 | Functions, Types, Challenges, Reform' },
        { id: 10, title: 'Globalisation and the Indian Economy',   subtitle: 'Economics Ch.4 | MNCs, Foreign Trade, Liberalisation' }
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
