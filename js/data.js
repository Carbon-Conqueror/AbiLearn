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
        { id: 1,  title: 'Chemical Reactions and Equations',       subtitle: 'Types of Reactions, Balancing Equations' },
        { id: 2,  title: 'Acids, Bases and Salts',                 subtitle: 'Properties, pH Scale, Indicators, Salts' },
        { id: 3,  title: 'Metals and Non-Metals',                  subtitle: 'Physical Properties, Reactivity Series, Extraction' },
        { id: 4,  title: 'Carbon and Its Compounds',               subtitle: 'Covalent Bonding, Hydrocarbons, Functional Groups' },
        { id: 5,  title: 'Life Processes',                         subtitle: 'Nutrition, Respiration, Transportation, Excretion' },
        { id: 6,  title: 'Control and Coordination',               subtitle: 'Nervous System, Hormones, Reflex Actions' },
        { id: 7,  title: 'How Do Organisms Reproduce?',            subtitle: 'Asexual & Sexual Reproduction, Contraception' },
        { id: 8,  title: 'Heredity and Evolution',                 subtitle: "Mendel's Laws, Genetics, Darwin's Theory" },
        { id: 9,  title: 'Light – Reflection and Refraction',      subtitle: 'Mirrors, Lenses, Mirror and Lens Formulae' },
        { id: 10, title: 'Human Eye and the Colourful World',      subtitle: 'Structure of Eye, Defects, Dispersion, Scattering' },
        { id: 11, title: 'Electricity',                            subtitle: "Ohm's Law, Resistance, Series & Parallel Circuits, Power" },
        { id: 12, title: 'Magnetic Effects of Electric Current',   subtitle: 'Magnetic Field, Electromagnetic Induction, AC/DC' },
        { id: 13, title: 'Our Environment',                        subtitle: 'Ecosystems, Food Chains, Ozone Layer, Waste Management' }
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
