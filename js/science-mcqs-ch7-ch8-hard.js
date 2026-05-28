/* AbiLearn — Hard MCQs: CH7 (Reproduction) & CH8 (Heredity & Evolution) — 50 each */

// CH7_MCQs
const CH7_HARD_MCQS = [
  {
    q: 'Leishmania, a parasitic protozoan, reproduces by binary fission but the plane of division is longitudinal. In Plasmodium (malaria parasite), asexual reproduction inside red blood cells occurs by:',
    opts: ['Binary fission (longitudinal)', 'Multiple fission (schizogony)', 'Budding', 'Sporulation in a sporangium'],
    ans: 1,
    exp: 'Plasmodium undergoes multiple fission (schizogony) inside RBCs — the nucleus divides repeatedly, then cytoplasm divides around each nucleus producing many merozoites simultaneously. This is why so many RBCs lyse at once causing periodic fever.'
  },
  {
    q: 'In Hydra, a bud begins as a small outgrowth. Which cell type in Hydra is primarily responsible for initiating budding?',
    opts: ['Nematocysts', 'Interstitial (I) cells — multipotent stem cells', 'Gastrodermal cells only', 'Cnidocytes'],
    ans: 1,
    exp: 'Interstitial (I) cells are multipotent stem cells interspersed among ectodermal cells of Hydra. They proliferate to form buds and can differentiate into all cell types. Nematocysts (stinging cells) are defence/capture structures, not reproductive cells.'
  },
  {
    q: 'Vegetative propagation in potato occurs through eyes (buds) on tubers. A potato tuber is morphologically a:',
    opts: ['Root modified for storage', 'Underground stem (stem tuber) bearing nodes with axillary buds', 'Swollen leaf petiole', 'Modified flower bud'],
    ans: 1,
    exp: 'Potato (Solanum tuberosum) tubers are modified underground stems (stem tubers). Evidence: they have nodes (eyes are axillary buds), internodes, and scale leaves. Roots lack nodes and buds. Sweet potato is a root tuber (different structure).'
  },
  {
    q: 'During spore formation in Rhizopus, the sporangiospores are enclosed in a sporangium at the tip of an erect hypha called a:',
    opts: ['Rhizoid', 'Stolon', 'Sporangiophore', 'Haustorium'],
    ans: 2,
    exp: 'The erect hyphae bearing sporangia are sporangiophores. Rhizoids are root-like hyphae anchoring Rhizopus to substrate. Stolons are horizontal hyphae connecting upright sporangiophores. Haustoria are nutrient-absorbing hyphae in parasitic fungi.'
  },
  {
    q: 'Fragmentation in Spirogyra is typically triggered by:',
    opts: ['Increase in light intensity only', 'Unfavourable conditions (drought, temperature extremes) causing filaments to break at cell walls', 'Sexual reproduction followed by fragmentation', 'Enzyme secretion by predators'],
    ans: 1,
    exp: 'Spirogyra filaments fragment mainly under adverse conditions (nutrient depletion, desiccation, mechanical stress). Each fragment can grow into a new filament under favourable conditions. This is a form of asexual reproduction distinct from conjugation (sexual).'
  },
  {
    q: 'If a flatworm (Planaria) is cut transversely into three pieces — head, middle, and tail — what is the most accurate prediction?',
    opts: ['Only the head piece survives', 'All three regenerate into complete organisms (head piece fastest, tail piece slowest)', 'Only head and middle regenerate', 'None regenerate — flatworms need their nervous system intact'],
    ans: 1,
    exp: 'Planaria\'s neoblast (totipotent stem cells) allow any fragment to regenerate a complete organism. The head end regenerates fastest (the Wnt/β-catenin gradient guides polarity). Even a 1/279th fragment can regenerate. Tail fragment takes longer but does regenerate.'
  },
  {
    q: 'In a bisexual flower, which part is the receptacle?',
    opts: ['The stalk of the flower', 'The swollen end of the peduncle bearing all floral whorls', 'The basal part of the ovary', 'The place where pollen is deposited'],
    ans: 1,
    exp: 'The receptacle is the swollen tip of the pedicel (flower stalk) from which all four floral whorls arise: calyx (sepals), corolla (petals), androecium (stamens), and gynoecium (pistil). In some plants (e.g., rose), it develops into a false fruit (accessory fruit).'
  },
  {
    q: 'A pollen grain that lands on the stigma germinates to produce a pollen tube. The pollen tube grows through the:',
    opts: ['Petal wall', 'Style, carrying two male gametes (sperm cells) to the ovule', 'Directly through the ovary wall', 'Sepal tissue'],
    ans: 1,
    exp: 'The pollen tube grows down through the style (often through a transmitting tract tissue) carrying the tube nucleus and two male gametes (sperm cells). It enters the ovule through the micropyle and delivers the gametes for double fertilisation.'
  },
  {
    q: 'In angiosperms, after double fertilisation, the primary endosperm nucleus (3n) undergoes repeated mitotic divisions to form the endosperm. In most monocots, the mature seed endosperm is:',
    opts: ['Completely consumed before seed maturity, stored in cotyledons', 'Retained as a persistent food-storage tissue in the mature seed', 'Converted to fruit flesh', 'Triploid but becomes diploid at maturity'],
    ans: 1,
    exp: 'In monocots (e.g., maize, wheat, rice), the endosperm persists as a major food-storage tissue in the mature seed. In most dicots (e.g., pea, bean), the endosperm is absorbed by the cotyledons during seed development, so mature seeds have large cotyledons and little/no endosperm.'
  },
  {
    q: 'Wind-pollinated (anemophilous) flowers show which combination of features?',
    opts: ['Large, colourful petals; large, sticky stigma; scented; abundant nectar', 'Small or absent petals; large feathery stigma; light dry pollen produced in large quantities; no nectar', 'Enclosed anthers; small stigma; large flowers', 'Tubular flowers; sticky pollen; prominent anthers projecting outward'],
    ans: 1,
    exp: 'Wind-pollinated flowers: petals small or absent (no need to attract insects); stigma large and feathery to catch airborne pollen; pollen is light, smooth, dry, and produced in enormous quantities; no nectar or scent needed. Examples: grasses, maize, wheat, date palm.'
  },
  {
    q: 'In the human male reproductive system, the correct pathway of sperm from production to ejaculation is:',
    opts: ['Seminiferous tubules → Epididymis → Vas deferens → Ejaculatory duct → Urethra', 'Leydig cells → Epididymis → Vas deferens → Urethra', 'Seminiferous tubules → Vas deferens → Epididymis → Urethra', 'Testes → Prostate → Vas deferens → Epididymis → Urethra'],
    ans: 0,
    exp: 'Spermatogenesis occurs in seminiferous tubules. Immature sperm mature in the epididymis (takes ~2-3 weeks). During ejaculation: epididymis → vas deferens → ejaculatory duct (joined by seminal vesicle duct) → urethra → out. Prostate and bulbourethral glands secrete fluids along the way.'
  },
  {
    q: 'Spermatogenesis requires that the testes be at approximately 2–3°C below core body temperature. This is why testes are located in the scrotum. If the testes fail to descend (cryptorchidism), the primary consequence is:',
    opts: ['Excess testosterone production', 'Infertility due to failure of spermatogenesis at core body temperature', 'Complete loss of testosterone', 'Increased sperm production'],
    ans: 1,
    exp: 'Spermatogenesis is highly temperature sensitive. At core body temperature (~37°C), sperm production fails. Cryptorchidism results in infertility if untreated. Testosterone production by Leydig cells is less temperature sensitive, so hormonal function is largely preserved.'
  },
  {
    q: 'The acrosome reaction of a sperm is triggered by:',
    opts: ['Contact with the zona pellucida of the egg, releasing hydrolytic enzymes', 'The acidic environment of the vagina', 'LH from the pituitary', 'Contact with the uterine wall'],
    ans: 0,
    exp: 'When a sperm binds to the zona pellucida (glycoprotein coat around the egg), the acrosome reaction is triggered: the acrosomal membrane fuses with the plasma membrane, releasing hydrolytic enzymes (hyaluronidase, acrosin) that digest the zona pellucida, allowing sperm penetration.'
  },
  {
    q: 'After fertilisation, a zygote undergoes cleavage. Unlike normal cell division, cleavage results in:',
    opts: ['Cells that grow larger with each division', 'Successively smaller cells (blastomeres) with no increase in total cytoplasmic volume', 'Only 2-4 cells total before implantation', 'Immediate differentiation into specific tissue types'],
    ans: 1,
    exp: 'Cleavage divisions are rapid mitoses without growth between divisions. The large zygote is subdivided into smaller and smaller blastomeres. Total cytoplasmic volume remains roughly constant — cell number increases while cell size decreases. This continues from 2-cell to morula (~16 cells) to blastocyst.'
  },
  {
    q: 'The corpus luteum degenerates at the end of a non-conception menstrual cycle because:',
    opts: ['FSH levels rise sharply', 'LH support (from pituitary) is withdrawn; without hCG from an embryo, corpus luteum regresses', 'Estrogen permanently suppresses it', 'The uterine lining absorbs it'],
    ans: 1,
    exp: 'Corpus luteum requires LH for maintenance. After ovulation, LH levels drop. If no embryo is present (no hCG), the corpus luteum regresses after ~14 days → progesterone and estrogen fall → uterine lining sheds (menstruation). If pregnancy occurs, embryonic hCG maintains corpus luteum until placenta takes over.'
  },
  {
    q: 'Copper-T (intrauterine device) prevents pregnancy primarily by:',
    opts: ['Releasing copper ions that inhibit ovulation', 'Copper ions impair sperm motility and viability, and may prevent implantation by causing local inflammation', 'Acting as a physical barrier at the cervix', 'Releasing progesterone to suppress LH'],
    ans: 1,
    exp: 'Copper IUD works mainly by the spermicidal effect of copper ions (Cu²⁺ impair sperm motility and acrosome reaction) and the local inflammatory reaction in the uterus that is hostile to sperm and fertilised eggs. It does NOT primarily prevent ovulation (unlike hormonal IUDs).'
  },
  {
    q: 'HIV is classified as a retrovirus. The key feature that makes retroviruses distinct from other RNA viruses is:',
    opts: ['They are always lethal', 'They carry reverse transcriptase, converting their RNA genome into DNA that integrates into the host genome', 'They replicate in the nucleus only', 'They produce DNA from the host cell\'s own DNA'],
    ans: 1,
    exp: 'Retroviruses (HIV, HTLV) carry the enzyme reverse transcriptase, which transcribes their RNA genome into complementary DNA (cDNA). This DNA is then integrated into the host cell\'s chromosomal DNA (as a provirus) by integrase. Standard RNA viruses do not use reverse transcription.'
  },
  {
    q: 'Which contraceptive method provides protection against sexually transmitted infections (STIs) AND pregnancy?',
    opts: ['Oral contraceptive pills', 'Copper-T IUD', 'Male condom used correctly and consistently', 'Tubectomy'],
    ans: 2,
    exp: 'Only barrier methods (condoms) provide dual protection: against STIs (by preventing exchange of body fluids) AND against pregnancy (physical barrier to sperm). Pills, IUDs, and tubectomy prevent pregnancy but offer NO protection against STIs.'
  },
  {
    q: 'Apomixis in plants such as dandelion produces offspring that are:',
    opts: ['Genetically diverse due to meiotic recombination', 'Genetically identical to the mother plant (clones) because no fertilisation occurs', 'Always triploid', 'Produced from pollen of another plant'],
    ans: 1,
    exp: 'Apomixis (agamospermy): seeds develop without fertilisation, from diploid cells of the ovule or from an unreduced embryo sac. Offspring are genetically identical to the mother (maternal clones). Agronomy advantage: preserving hybrid vigour in seeds without re-crossing.'
  },
  {
    q: 'In tissue culture (micropropagation), a callus is:',
    opts: ['A type of hormone used in the medium', 'An undifferentiated mass of totipotent dividing cells formed from an explant on nutrient agar', 'A mature plantlet ready for transplanting', 'Dead tissue from the cut explant'],
    ans: 1,
    exp: 'A callus is an undifferentiated mass of dividing parenchyma-like cells that forms when an explant is placed on a nutrient medium containing auxins and cytokinins. By adjusting hormone ratios, the callus can then be induced to differentiate into shoots and roots (organogenesis).'
  },
  {
    q: 'Sexual reproduction in flowering plants requires meiosis to produce haploid gametes. In which specific structure does meiosis occur to produce pollen grains?',
    opts: ['The pollen grain itself divides by meiosis', 'The pollen mother cells (PMC) inside the anther undergo meiosis → 4 haploid microspores → each becomes a pollen grain', 'The stigma undergoes meiosis', 'Meiosis occurs in the style'],
    ans: 1,
    exp: 'Microsporogenesis: pollen mother cells (2n) in the anther\'s microsporangia undergo meiosis → tetrad of 4 haploid microspores. Each microspore undergoes mitosis → mature pollen grain (with tube cell nucleus and generative cell). The generative cell will divide into 2 sperm.'
  },
  {
    q: 'The significance of DNA replication before cell division in reproduction is best explained as:',
    opts: ['To increase cell size before division', 'To ensure each daughter cell receives a complete, identical copy of the genetic information, maintaining continuity', 'To repair mutations in DNA', 'To produce RNA for protein synthesis'],
    ans: 1,
    exp: 'Before each mitotic division (and in the S-phase before meiosis), DNA is precisely replicated so that every daughter cell inherits a complete, accurate copy of the genome. This ensures genetic continuity across generations of cells and is the molecular basis of heredity in asexual reproduction.'
  },
  {
    q: 'Variation in sexually reproducing organisms arises from all of the following EXCEPT:',
    opts: ['Crossing over during meiosis I', 'Independent assortment of chromosomes', 'Random fertilisation between egg and sperm', 'DNA replication of a single parent cell in binary fission'],
    ans: 3,
    exp: 'Binary fission produces genetically identical cells — it is NOT a source of variation. Sexual reproduction generates variation through: crossing over (new allele combinations), independent assortment (random chromosome segregation), and random fertilisation (one of millions of possible gamete combinations).'
  },
  {
    q: 'The advantage of variations in a sexually reproducing population under environmental change is best described as:',
    opts: ['Variations cause all individuals to adapt equally', 'Some variants may be pre-adapted to new conditions, giving them survival advantage — the population avoids extinction', 'Variations always make organisms stronger', 'Variations reduce reproductive rate'],
    ans: 1,
    exp: 'Variation is the raw material for natural selection. When conditions change (new pathogen, climate shift), variants pre-adapted to the new conditions survive and reproduce while others may die. Without variation, a new challenge could wipe out the entire population. This is Darwin\'s insight.'
  },
  {
    q: 'Genital herpes (HSV-2) is an STI that cannot be cured because:',
    opts: ['Antibiotics are not effective on it, but antiviral drugs can eradicate it', 'HSV-2 establishes latent infection in sensory nerve ganglia; the virus persists for life despite antiviral treatment', 'The immune system destroys the drug', 'HSV-2 lives only in blood cells'],
    ans: 1,
    exp: 'HSV-2 establishes lifelong latency in sacral (dorsal root) sensory ganglia. Antiviral drugs (acyclovir) suppress replication and reduce outbreaks but cannot eliminate the latent virus. Periodic reactivation causes recurrent lesions. This distinguishes viral (incurable) from bacterial STIs (curable with antibiotics).'
  },
  {
    q: 'A child is born with cystic fibrosis, a condition due to a defect in a gene whose product is required for chloride ion transport. The parents appear normal. This is consistent with:',
    opts: ['Autosomal dominant inheritance', 'X-linked recessive inheritance (mother is carrier)', 'Autosomal recessive inheritance (both parents are carriers)', 'A new mutation in the germ cell'],
    ans: 2,
    exp: 'Autosomal recessive: both parents carry one defective allele (Cc × Cc) and are phenotypically normal. 25% of children are affected (cc). Cystic fibrosis (CFTR gene, chromosome 7) is the most common autosomal recessive disorder in Caucasians. X-linked disorders affect sons more often and mothers are carriers.'
  },
  {
    q: 'In the female reproductive cycle, which hormone is responsible for the proliferative (follicular) phase, causing the uterine lining to thicken?',
    opts: ['Progesterone', 'Estrogen (secreted by the growing follicle)', 'FSH directly', 'LH directly'],
    ans: 1,
    exp: 'Estrogen secreted by the developing ovarian follicle (days 6-13) acts on the uterine endometrium causing cell proliferation (thickening). Progesterone (from corpus luteum, days 15-28) causes further changes (secretory phase). FSH and LH are pituitary hormones that regulate the ovary.'
  },
  {
    q: 'A woman wishes to use the rhythm (calendar) method of contraception. If her cycle is consistently 28 days, the MOST fertile period to avoid unprotected sex is approximately:',
    opts: ['Days 1-5 (menstruation)', 'Days 10-17 (around ovulation on day 14)', 'Days 22-28 (late luteal phase)', 'There is no fertile period — the entire cycle is risky'],
    ans: 1,
    exp: 'The ovum survives ~12-24 hours after ovulation. Sperm survive up to 5 days. Ovulation in a 28-day cycle is ~day 14. The fertile window is days 10-17 (sperm can be present when ovulation occurs). The calendar method avoids intercourse during this window. It is unreliable in women with irregular cycles.'
  },
  {
    q: 'The placenta acts as a selective barrier. Which of the following can cross the placenta and potentially harm the foetus?',
    opts: ['Maternal red blood cells', 'Maternal IgG antibodies, some viruses (HIV, rubella), alcohol, and certain drugs', 'Maternal platelets', 'Maternal white blood cells (in normal pregnancy)'],
    ans: 1,
    exp: 'The placenta allows passive transport of maternal IgG (protective immunity) and small molecules (O₂, glucose, alcohol, many drugs, nicotine). Viruses like HIV and rubella can cross via trophoblast cells. Maternal blood cells do not cross in a normal pregnancy (separate circulations), though foetal RBCs can leak across during trauma/delivery.'
  },
  {
    q: 'Parthenogenesis in honey bees determines the caste/sex of offspring. Unfertilised eggs develop into:',
    opts: ['Queens (diploid)', 'Workers (diploid)', 'Drones — haploid males (n)', 'Infertile females'],
    ans: 2,
    exp: 'Bee sex determination: unfertilised eggs → haploid drones (males, n). Fertilised eggs → diploid females (queen or workers depending on larval nutrition). Drones develop by parthenogenesis and have only mothers (no fathers). Queens produce fertilised and unfertilised eggs.'
  },
  {
    q: 'Vasectomy (male sterilisation) involves cutting and sealing the:',
    opts: ['Seminal vesicles', 'Vas deferens (sperm duct) — prevents sperm from reaching semen', 'Epididymis', 'Urethra'],
    ans: 1,
    exp: 'Vasectomy: the vas deferens is cut, tied, or sealed (bilateral), preventing sperm from being ejaculated. Testosterone production and libido are unaffected. The man still ejaculates (semen without sperm). It is highly effective (>99.9%) and largely irreversible. Tubectomy is the female equivalent (fallopian tubes blocked).'
  },
  {
    q: 'In angiosperm reproduction, the "embryo sac" inside the ovule typically contains how many cells/nuclei at maturity?',
    opts: ['4 cells', '7 cells and 8 nuclei (Polygonum type)', '2 cells', '16 cells'],
    ans: 1,
    exp: 'The mature female gametophyte (embryo sac) of most angiosperms (Polygonum type) contains 7 cells and 8 nuclei: 3 antipodal cells, 2 synergid cells, 1 egg cell, and 1 central cell with 2 polar nuclei. The egg cell is fertilised by one sperm; the central cell (with 2 polar nuclei) is fertilised by the other sperm → triploid endosperm.'
  },
  {
    q: 'Why must sexually reproducing organisms maintain alternation of generations (meiosis) to keep chromosome number constant?',
    opts: ['Because mitosis doubles chromosome number each generation', 'Without meiosis to halve the chromosome number in gametes, fusion of two gametes would double the chromosome number each generation, causing geometric increase', 'Because meiosis repairs damaged chromosomes', 'Organisms do not need meiosis if they have repair mechanisms'],
    ans: 1,
    exp: 'Each gamete contributes the haploid (n) set. Fertilisation (n + n = 2n) restores the diploid number. Without meiosis: gametes would be diploid (2n); fertilisation would give 4n; next generation 8n, etc. Meiosis is the essential compensatory halving that maintains ploidy across generations.'
  },
  {
    q: 'Cross-pollination between two different plant species (interspecific pollination) usually does NOT result in fertile offspring because:',
    opts: ['Pollen grain is too large', 'Post-pollination barriers: incompatible pollen tube growth, failure of fertilisation, or hybrid sterility (reproductive isolation)', 'Cross-species pollen has no germination capacity at all', 'The stigma destroys all foreign pollen'],
    ans: 1,
    exp: 'Post-pollination barriers prevent interspecific fertilisation: (1) pollen tube may fail to grow through the style (incompatible signals); (2) if fertilisation occurs, the hybrid embryo may abort; (3) if the hybrid is born, it may be sterile (like a mule). These barriers contribute to reproductive isolation — the basis of speciation.'
  },
  {
    q: 'A student compares asexual reproduction in yeast and Hydra. One key distinction is:',
    opts: ['Yeast buds are formed by meiosis; Hydra buds by mitosis', 'In yeast, the bud separates while still small; in Hydra, the bud usually detaches only after forming a complete individual with tentacles and mouth', 'Hydra buds form inside the parent body; yeast buds form externally', 'Both processes produce genetically diverse offspring'],
    ans: 1,
    exp: 'In Hydra budding, the bud grows into a miniature adult — developing a mouth and tentacles — before detaching. Yeast buds pinch off while much smaller (the daughter cell grows after separation). Both use mitosis, producing genetically identical offspring. Neither involves meiosis.'
  },
  {
    q: 'Seed dormancy is an adaptive feature because:',
    opts: ['It prevents seeds from being eaten by animals', 'It delays germination until environmental conditions (temperature, moisture, light) are suitable, improving seedling survival', 'It prevents cross-pollination', 'It reduces competition between seeds and pollen'],
    ans: 1,
    exp: 'Seed dormancy is controlled by abscisic acid (ABA). It ensures seeds do not germinate during unfavourable seasons (winter, drought). Germination is triggered by specific cues (stratification by cold, scarification, water). This is an evolutionary adaptation maximising seedling survival rate.'
  },
  {
    q: 'A woman with irregular menstrual cycles is planning pregnancy. Her doctor recommends using basal body temperature (BBT) to identify ovulation. BBT rises by ~0.2-0.5°C after ovulation because of:',
    opts: ['Estrogen surge at ovulation', 'Progesterone secreted by the corpus luteum has a thermogenic effect', 'LH itself raises body temperature', 'The uterine lining generates heat during the luteal phase'],
    ans: 1,
    exp: 'Progesterone, secreted by the corpus luteum after ovulation, acts on the hypothalamus and has a thermogenic (heat-raising) effect — BBT rises by 0.2-0.5°C and stays elevated throughout the luteal phase. A sustained rise in BBT confirms ovulation has occurred. The fall in BBT signals impending menstruation.'
  },
  {
    q: 'Which of the following represents the correct order of events after pollen lands on the stigma?',
    opts: ['Pollen tube forms → double fertilisation → pollination complete', 'Pollen hydrates → pollen tube germinates → tube grows through style → two sperm released in ovule → double fertilisation', 'Sperm are released on stigma → swim to ovule → fertilisation', 'Stigma secretes enzymes that fertilise the egg directly'],
    ans: 1,
    exp: 'Correct sequence: pollen grain hydrates (absorbs water from stigma) → pollen tube germinates (grows from germination pore) → tube grows through style, guided by chemical signals → enters ovule via micropyle → tube bursts → 2 sperm released → double fertilisation (1 sperm + egg = zygote; 1 sperm + 2 polar nuclei = endosperm).'
  },
  {
    q: 'Semen analysis revealed a man has spermatozoa with normal morphology and count, but very low motility (asthenozoospermia). Which organelle defect most likely explains this?',
    opts: ['Defective acrosome (missing enzymes)', 'Defective mitochondria in the sperm midpiece (insufficient ATP for flagellar movement)', 'Missing nucleus (no DNA)', 'Absent plasma membrane'],
    ans: 1,
    exp: 'Sperm flagellar movement (via dynein arms on axoneme) requires ATP. The midpiece of the sperm is packed with mitochondria that generate ATP by oxidative phosphorylation. Defective mitochondria → insufficient ATP → immotile sperm (asthenozoospermia), a major cause of male infertility.'
  },
  {
    q: 'The term "totipotency" as used in plant tissue culture means:',
    opts: ['The ability of a cell to grow indefinitely in culture', 'The ability of a single plant cell to develop into a complete organism — expressing the full genetic potential', 'The ability of a cell to resist disease', 'The ability to produce all types of pollen'],
    ans: 1,
    exp: 'Totipotency: every living plant cell retains the complete genome and, under appropriate conditions, can develop into a complete organism. This was proposed by Haberlandt (1902) and demonstrated by Steward (1958) with carrot cells. It is the scientific basis of plant tissue culture and micropropagation.'
  },
  {
    q: 'Amenorrhoea (absence of menstruation) during pregnancy occurs because:',
    opts: ['The uterus is stretched', 'High levels of hCG, progesterone, and estrogen suppress FSH/LH, preventing follicle development and menstruation', 'The foetus consumes all available hormones', 'Estrogen alone suppresses ovulation permanently'],
    ans: 1,
    exp: 'Pregnancy: hCG maintains corpus luteum → high progesterone and estrogen levels → negative feedback on pituitary → FSH and LH suppressed → no new follicle develops → no ovulation → no endometrial shedding (amenorrhoea). Progesterone also prevents uterine contractions to maintain pregnancy.'
  },
  {
    q: 'Microbial diseases can be transmitted sexually. Chlamydia trachomatis is particularly dangerous because:',
    opts: ['It is always symptomatic and easy to detect', 'It is often asymptomatic, leading to silent spread and complications such as pelvic inflammatory disease and infertility', 'It can only infect males', 'It is a viral infection unresponsive to antibiotics'],
    ans: 1,
    exp: 'Chlamydia (Chlamydia trachomatis — obligate intracellular bacterium) is the most common bacterial STI worldwide. It is often asymptomatic (especially in women), allowing silent transmission. Untreated, it causes pelvic inflammatory disease (PID), ectopic pregnancy, and infertility. It is treatable with antibiotics (azithromycin).'
  },
  {
    q: 'The vas deferens runs from the epididymis through the inguinal canal into the pelvic cavity and is joined by the duct of the seminal vesicle to form the ejaculatory duct. The ejaculatory duct then passes through the:',
    opts: ['Prostate gland and opens into the urethra', 'Bladder and opens into the ureter', 'Testis and loops back', 'Directly to the exterior'],
    ans: 0,
    exp: 'The ejaculatory duct (formed by vas deferens + seminal vesicle duct) passes through the prostate gland and opens into the prostatic urethra. The prostate also adds its secretion to semen at this point. The urethra then carries semen (and urine, separately) to the exterior through the penis.'
  },
  {
    q: 'In plant asexual reproduction by runners (stolons), as seen in strawberry, the new plant forms at the:',
    opts: ['Tip of every internode on the runner', 'Node of the runner, where adventitious roots and shoots develop', 'Base of the parent plant only', 'Leaf axils of the original plant'],
    ans: 1,
    exp: 'Stolons (runners) are horizontal stems that grow along the soil surface. At alternate nodes, adventitious roots grow downward and shoots grow upward → new plantlet. The runner then withers, leaving independent plants. Grass, strawberry, and spider plant reproduce this way.'
  },
  {
    q: 'The sequence of events in the human menstrual cycle from Days 1-28 is governed by hormonal interactions. The CORRECT hormonal sequence is:',
    opts: ['FSH → Estrogen → LH surge → Ovulation → Progesterone', 'LH → FSH → Progesterone → Estrogen → Ovulation', 'Estrogen → LH → FSH → Ovulation → Progesterone', 'Progesterone → FSH → Estrogen → LH → Ovulation'],
    ans: 0,
    exp: 'FSH (from pituitary) stimulates follicle growth and estrogen production. Rising estrogen (positive feedback) triggers the LH surge at ~day 13-14. LH surge causes ovulation (day 14). Post-ovulation: corpus luteum secretes progesterone (and estrogen), maintaining the endometrium (days 15-28). If no pregnancy, corpus luteum degenerates → progesterone falls → menstruation.'
  },
  {
    q: 'A 14-year-old boy is concerned that he is producing semen but not fertile sperm yet. In normal puberty, the hormone that initiates spermatogenesis is:',
    opts: ['Growth hormone', 'Testosterone (rising under LH stimulation at puberty, combined with FSH acting on Sertoli cells)', 'Estrogen', 'Cortisol'],
    ans: 1,
    exp: 'Puberty: the hypothalamic-pituitary-gonadal axis activates. LH stimulates Leydig cells to produce testosterone. FSH acts on Sertoli cells to support spermatogenesis. Rising testosterone causes secondary sexual characteristics AND initiates spermatogenesis in seminiferous tubules. Full spermatogenic maturation takes weeks-months after puberty onset.'
  },
  {
    q: 'Which of the following correctly distinguishes between geitonogamy and xenogamy?',
    opts: ['Geitonogamy: pollen from same flower. Xenogamy: pollen from a different species', 'Geitonogamy: cross-pollination between different flowers on the SAME plant (genetically = self-pollination). Xenogamy: cross-pollination between different plants of the same species', 'Geitonogamy: pollination by insects. Xenogamy: pollination by wind', 'Geitonogamy: occurs only in monoecious plants. Xenogamy: occurs only in dioecious plants'],
    ans: 1,
    exp: 'Autogamy: same flower (self-pollination). Geitonogamy: pollen from a different flower on the SAME plant — mechanically cross-pollination but genetically self-pollination (same genome). Xenogamy: pollen from a genetically different individual of the same species — true cross-pollination, introducing new allele combinations.'
  },
  {
    q: 'Emergency contraception using mifepristone (RU-486) works differently from levonorgestrel. Mifepristone is a:',
    opts: ['Progestogen agonist that prevents ovulation', 'Progesterone receptor antagonist that blocks progesterone action, used within 72h to prevent or interrupt early pregnancy', 'Estrogen blocker that prevents fertilisation', 'Gonadotropin that triggers ovulation at a wrong time'],
    ans: 1,
    exp: 'Mifepristone (RU-486) is a progesterone receptor antagonist — it blocks progesterone\'s action. Without progesterone signalling, the endometrium cannot support implantation, and the uterine lining sheds. Used within 72 hours post-coital (emergency contraception) or up to 7 weeks for medical abortion (combined with misoprostol).'
  },
  {
    q: 'Organisms that reproduce only asexually in stable environments are at a long-term evolutionary disadvantage compared to sexually reproducing organisms because:',
    opts: ['Asexual reproduction is slower', 'Asexual clones lack variation; any new pathogen or environmental change could wipe out the entire genetically identical population', 'Asexual reproduction uses more energy', 'Sexual organisms can live longer'],
    ans: 1,
    exp: 'The "Red Queen hypothesis" describes the evolutionary advantage of sexual reproduction: pathogens rapidly evolve to infect a genetically uniform host population. Sexual reproduction continuously generates new allele combinations, making it much harder for parasites/pathogens to adapt. A clonal population could be devastated by a single new pathogen to which none have resistance.'
  },
  {
    q: 'In IVF, the number of embryos transferred to the uterus is typically limited (1-2). The main reason for this limitation is:',
    opts: ['Only 1-2 embryos can be created in the lab', 'To reduce the risk of multiple pregnancy (twins, triplets), which carries higher maternal and foetal risks', 'The uterus can only hold 1-2 blastocysts genetically', 'More embryos reduce the chance of success'],
    ans: 1,
    exp: 'Multiple embryo transfer increases IVF success rate per cycle but also greatly increases risk of multiple pregnancies (twins, triplets). Multiple pregnancies have higher risks: premature delivery, low birth weight, maternal complications. Current guidelines recommend single embryo transfer (SET) in most cases to minimize these risks.'
  },
];

// CH8_MCQs
const CH8_HARD_MCQS = [
  {
    q: 'In Mendel\'s monohybrid cross (Tt × Tt), the genotypic ratio in F2 is 1:2:1. If TT and Tt both show the tall phenotype, but a researcher doing a test cross (F2 tall × tt) finds that 1/3 of the "tall" plants give ONLY tall offspring, this result identifies those plants as:',
    opts: ['Tt (heterozygous)', 'TT (homozygous dominant) — all offspring from TT × tt are Tt (tall)', 'tt (homozygous recessive)', 'A new mutation'],
    ans: 1,
    exp: 'Test cross of tall F2 plants × tt: TT × tt → all Tt (100% tall offspring). Tt × tt → 50% Tt (tall) + 50% tt (short). Since TT makes up 1/3 of tall plants (ratio TT:Tt = 1:2), 1/3 give only tall offspring (TT). The test cross is the definitive tool for determining unknown genotype.'
  },
  {
    q: 'In a dihybrid cross RrYy × rryy (test cross), which phenotypic ratio is expected?',
    opts: ['9:3:3:1', '3:1', '1:1:1:1 (round yellow : round green : wrinkled yellow : wrinkled green)', '1:2:1'],
    ans: 2,
    exp: 'RrYy × rryy: RrYy produces 4 gamete types (RY, Ry, rY, ry) in equal proportions. rryy produces only ry. The 4 offspring types are RrYy (round yellow) : Rryy (round green) : rrYy (wrinkled yellow) : rryy (wrinkled green) in 1:1:1:1 ratio. This is the standard dihybrid test cross outcome, demonstrating independent assortment.'
  },
  {
    q: 'Mendel chose pea plants (Pisum sativum) for his experiments. One key reason was that pea plants have contrasting, clearly distinguishable traits. An equally important practical reason was:',
    opts: ['Pea plants reproduce very slowly', 'Peas are naturally self-fertilising (cleistogamy), allowing Mendel to maintain pure-breeding lines, and also cross-pollinate them manually when desired', 'Pea plants have only 2 chromosomes', 'Peas have no flowers, simplifying observation'],
    ans: 1,
    exp: 'Pea plants are normally self-fertilising (cleistogamous — flowers fertilise before opening), making it easy to maintain true-breeding lines. Mendel could remove anthers from flowers before they opened and manually cross-pollinate (emasculation + artificial cross), giving him complete experimental control over mating.'
  },
  {
    q: 'A couple both have normal vision. They have a son with red-green colour blindness (X-linked recessive). What is the probability that their next child will be a colour-blind daughter?',
    opts: ['25%', '0% — daughters cannot be colour blind if father is normal', '12.5% (1 in 8)', '50%'],
    ans: 1,
    exp: 'Mother is a carrier (X^B X^b); father is normal (X^B Y). Sons: 50% colour blind (X^b Y). Daughters: X^B X^B (normal) or X^B X^b (carrier), none affected (X^b X^b would require affected father). Since father is normal (X^B Y), daughters get X^B from father → cannot be X^b X^b. P(colour-blind daughter) = 0%.'
  },
  {
    q: 'If a woman is colour blind (X^b X^b) and she has children with a normal-visioned man (X^B Y), what fraction of her DAUGHTERS will be colour blind?',
    opts: ['None', '50% of daughters', 'All daughters (100%)', '25% of daughters'],
    ans: 0,
    exp: 'Colour-blind mother X^b X^b × normal father X^B Y: daughters receive X^b from mother + X^B from father = X^B X^b (all daughters are carriers, NOT colour blind). Sons receive X^b from mother + Y from father = X^b Y (all sons are colour blind). Zero daughters are colour blind.'
  },
  {
    q: 'A man with blood type AB (I^A I^B) and a woman with blood type O (ii) have children. What blood types are possible in their children?',
    opts: ['AB and O only', 'A and B only (50% type A, 50% type B)', 'A, B, AB, and O', 'AB only'],
    ans: 1,
    exp: 'I^A I^B × ii: gametes from father are I^A or I^B; gametes from mother are i only. Possible offspring: I^A i (blood type A) and I^B i (blood type B) in 1:1 ratio. AB (I^A I^B) and O (ii) are NOT possible from this cross.'
  },
  {
    q: 'In a pedigree, a trait appears in every generation (grandfather, mother, and her son), with both males and females affected. Unaffected parents never have affected children. This inheritance pattern is most consistent with:',
    opts: ['Autosomal recessive', 'X-linked recessive', 'Autosomal dominant', 'Y-linked (holandric)'],
    ans: 2,
    exp: 'Autosomal dominant: trait appears in every generation (vertical transmission), affects both sexes equally, and unaffected individuals (homozygous recessive) do NOT pass the trait. If both males and females are affected across generations, Y-linkage (males only) and X-linkage (patterns differ by sex) are excluded.'
  },
  {
    q: 'A pedigree shows a trait that appears ONLY in males, and ALL sons of affected fathers are affected, but NO daughters are affected. This suggests:',
    opts: ['X-linked recessive', 'Autosomal dominant (sex-limited expression)', 'Y-linked (holandric) inheritance', 'Mitochondrial inheritance'],
    ans: 2,
    exp: 'Y-linked (holandric) traits: Y chromosome carries the gene → father passes Y to all sons → 100% of sons affected. Daughters get X from father (not Y) → never affected. Hairy pinna (outer ear hair) was a classic example (now disputed). Absolute father-to-son transmission distinguishes Y-linkage from all other patterns.'
  },
  {
    q: 'In incomplete dominance, a cross between pink (Rr) × pink (Rr) snapdragons produces what phenotypic ratio?',
    opts: ['3 red : 1 white', '1 red : 2 pink : 1 white', 'All pink', '1 red : 1 white'],
    ans: 1,
    exp: 'Incomplete dominance: RR = red, Rr = pink (intermediate), rr = white. Rr × Rr → 1 RR : 2 Rr : 1 rr = 1 red : 2 pink : 1 white. The phenotypic and genotypic ratios are both 1:2:1 (unlike complete dominance where phenotypic is 3:1).'
  },
  {
    q: 'Codominance differs from incomplete dominance in that in codominance:',
    opts: ['A blend of both traits appears in the heterozygote', 'BOTH alleles are fully and separately expressed in the heterozygote (no blending)', 'One allele is completely dominant', 'The heterozygote shows neither parental phenotype'],
    ans: 1,
    exp: 'Incomplete dominance: blended phenotype (e.g., red + white = pink). Codominance: both alleles expressed simultaneously and distinctly (e.g., type AB blood: both A and B antigens present on RBCs; roan cattle: both red and white hairs present — no blending, just both together).'
  },
  {
    q: 'Epistasis is a phenomenon where one gene MASKS or modifies the expression of another gene. In a 9:3:3:1 dihybrid cross, if one dominant allele (A_) masks expression of the B gene, the ratio becomes:',
    opts: ['9:3:3:1', '12:3:1 (dominant epistasis)', '9:7', '15:1'],
    ans: 1,
    exp: 'Dominant epistasis (e.g., gene A epistatic to gene B): A_ suppresses expression of B gene. 9 A_B_ + 3 A_bb = 12 (show A phenotype, B masked). 3 aaB_ = 3 (B expressed when A absent). 1 aabb = 1 (recessive). Ratio 12:3:1. Other epistasis types give 9:3:4, 9:7, 15:1, etc.'
  },
  {
    q: 'Sickle cell anaemia is caused by a SINGLE nucleotide change in the β-globin gene (HBB), converting glutamic acid → valine at position 6. The inheritance pattern is:',
    opts: ['Autosomal dominant (one copy causes disease)', 'Autosomal recessive (two copies needed for full anaemia, but carriers show sickling under low oxygen — codominant at molecular level)', 'X-linked dominant', 'Mitochondrial'],
    ans: 1,
    exp: 'Sickle cell anaemia: classically autosomal recessive (two HbS alleles → severe anaemia). However, at the molecular/cellular level it shows codominance: HbA/HbS carriers (sickle cell trait) have BOTH normal and sickle haemoglobin in their RBCs, showing mild sickling under extreme low-oxygen conditions. Clinically recessive, molecularly codominant.'
  },
  {
    q: 'The Hardy-Weinberg equation is p² + 2pq + q² = 1. In a population of 1000, if 360 individuals are homozygous dominant (AA), 480 are heterozygous (Aa), and 160 are homozygous recessive (aa), calculate the allele frequency of the recessive allele (q):',
    opts: ['0.4', '0.6', '0.16', '0.32'],
    ans: 0,
    exp: 'Total alleles = 2000. Recessive alleles (q): from aa: 160×2 = 320; from Aa: 480×1 = 480. Total q alleles = 800. q = 800/2000 = 0.4. Check: q² = 0.16 = 160/1000 ✓. p = 0.6. p² = 0.36 = 360/1000 ✓. 2pq = 0.48 = 480/1000 ✓. Population is in Hardy-Weinberg equilibrium.'
  },
  {
    q: 'If the frequency of a recessive allele (q) in a Hardy-Weinberg population is 0.2, what is the frequency of carriers (heterozygotes)?',
    opts: ['0.04', '0.32', '0.16', '0.64'],
    ans: 1,
    exp: 'p = 1 − q = 0.8. Frequency of carriers (Aa) = 2pq = 2 × 0.8 × 0.2 = 0.32 (32% of population). Note: q² = 0.04 (frequency of affected, homozygous recessive). 2pq is ALWAYS higher than q² when q < 0.5 — most recessive alleles in a population are "hidden" in carriers.'
  },
  {
    q: 'Which of the following situations would VIOLATE Hardy-Weinberg equilibrium and cause evolutionary change?',
    opts: ['Large random-mating population with no external selective pressure', 'A natural disaster kills 99% of the population, leaving a few survivors (bottleneck effect)', 'Equal sex ratio and random mating', 'Absence of migration and mutation'],
    ans: 1,
    exp: 'A population bottleneck drastically reduces population size → genetic drift becomes powerful → allele frequencies change by chance, not selection → departure from H-W equilibrium. The 5 conditions for H-W equilibrium are: large population, random mating, no mutation, no migration, no natural selection.'
  },
  {
    q: 'In the Hershey-Chase experiment (1952), bacteriophage T4 was grown with radioactive ³²P (labels DNA) and ³⁵S (labels protein). After infection of bacteria, the ³²P was found INSIDE the bacteria. This proved:',
    opts: ['Protein is the genetic material', 'DNA is the genetic material (DNA, not protein, enters the cell and directs new phage production)', 'RNA is the genetic material', 'Both DNA and protein enter the cell'],
    ans: 1,
    exp: 'In the Hershey-Chase experiment, radioactive ³²P (DNA) was found inside infected bacteria (and in new phage progeny), while ³⁵S (protein) remained outside in the viral coat. Since ³²P directed new phage production, DNA was conclusively proven to be the genetic material, not protein.'
  },
  {
    q: 'A human genetic disease shows the following pedigree pattern: only females are affected; affected females always have affected mothers; the trait appears in every generation on the maternal line; affected fathers do NOT pass the trait to children. This pattern strongly suggests:',
    opts: ['Autosomal dominant', 'X-linked dominant', 'Mitochondrial (maternal) inheritance', 'Y-linked'],
    ans: 2,
    exp: 'Mitochondrial inheritance: mitochondria are inherited exclusively from the mother (cytoplasmic inheritance). Affected mothers pass the disease to ALL children (sons and daughters), but affected fathers NEVER pass it to any child. Leber\'s hereditary optic neuropathy (LHON) and MELAS syndrome follow mitochondrial inheritance.'
  },
  {
    q: 'Homologous chromosomes pair during meiosis I (synapsis). Crossing over (chiasmata formation) during prophase I results in:',
    opts: ['Identical sister chromatids', 'New combinations of alleles on chromosomes (recombinant chromosomes), increasing genetic diversity', 'Doubling of chromosome number', 'Chromosomal deletion only'],
    ans: 1,
    exp: 'Crossing over: homologous chromosomes exchange segments at chiasmata during prophase I of meiosis. This creates recombinant chromosomes with new combinations of alleles not present in either parent. It is a major source of genetic variation (along with independent assortment and random fertilisation).'
  },
  {
    q: 'Darwin observed that finches on the Galápagos Islands had different beak shapes adapted to different food sources. This is an example of:',
    opts: ['Convergent evolution (similar environments, different species)', 'Adaptive radiation (divergent evolution from a common ancestor into different ecological niches)', 'Co-evolution', 'Genetic drift in isolated populations'],
    ans: 1,
    exp: 'Adaptive radiation: a single ancestral finch colonised the Galápagos. In the absence of competition, different populations adapted to different food sources (seeds, insects, cactus) → natural selection shaped different beak morphologies. This divergent evolution from one ancestor into multiple ecological niches is adaptive radiation (also seen in Australian marsupials, Hawaiian honeycreepers).'
  },
  {
    q: 'Lamarck proposed that the giraffe\'s long neck evolved because ancestral giraffes stretched their necks and passed this acquired trait to offspring. The FUNDAMENTAL error in Lamarck\'s theory is:',
    opts: ['Giraffes never ate from tall trees', 'Acquired (somatic) characteristics cannot be inherited — changes to body (muscle, structure) do not alter germline DNA', 'Natural selection does not exist', 'Lamarck did not know about DNA, so his theory is entirely wrong'],
    ans: 1,
    exp: 'Lamarck\'s fatal flaw: the Weismann barrier. Germline cells (gametes) are separate from somatic (body) cells. Changes to muscles, bones, or organs during an organism\'s lifetime do NOT alter the DNA in gametes and cannot be passed to offspring. Modern genetics confirms this (epigenetics has nuanced exceptions but does not rescue Lamarckism). Weismann\'s experiments cutting rat tails for 22 generations showed no shortening.'
  },
  {
    q: 'The forelimbs of a whale (flipper), a bat (wing), a human (arm), and a horse (leg) all have the same basic skeletal elements (humerus, radius, ulna, carpals, digits). These are:',
    opts: ['Analogous organs (same function, different origin)', 'Homologous organs (same basic structure and common evolutionary origin, different functions)', 'Vestigial organs', 'Convergent structures'],
    ans: 1,
    exp: 'Homologous organs share the same basic bone structure (pentadactyl limb) inherited from a common tetrapod ancestor (~370 MYA), even though they perform different functions (swimming, flying, grasping, walking). They are evidence for divergent evolution and common descent. Analogous organs have similar functions but different origins (e.g., wing of bat vs wing of butterfly).'
  },
  {
    q: 'The human appendix is considered a vestigial organ. This means:',
    opts: ['It is non-functional in all organisms', 'It is a reduced remnant of a larger, functional organ in our ancestors (caecum for cellulose digestion), retained without its original major function', 'It was added recently by evolution', 'It will disappear within one generation'],
    ans: 1,
    exp: 'The appendix is a vestige of the enlarged caecum of herbivorous ancestors that housed bacteria for cellulose fermentation. In humans, the caecum is reduced and the appendix (vermiform) is a tiny remnant. It retains some lymphoid tissue (minor immune function) but has lost its primary ancestral digestive function. Vestigial organs are evidence of evolutionary ancestry.'
  },
  {
    q: 'Fossils in which geological time period would most likely represent the earliest fish-to-tetrapod transition (vertebrates moving from water to land)?',
    opts: ['Cambrian (~540 MYA)', 'Devonian (~375 MYA) — transitional fossils like Tiktaalik', 'Cretaceous (~66-145 MYA)', 'Permian (~252-299 MYA)'],
    ans: 1,
    exp: 'Tiktaalik roseae (Devonian, ~375 MYA) is a classic transitional fossil showing fish-to-tetrapod evolution: it had gills AND primitive lung-like organs, fish-like scales AND proto-limb-like fins with wrist joints capable of supporting weight. The Devonian period is the key era for fish diversification and the first vertebrate land colonisation.'
  },
  {
    q: 'The molecular clock hypothesis, used to estimate divergence times between species, is based on the observation that:',
    opts: ['DNA mutations accumulate rapidly in highly variable genes', 'Certain genes accumulate mutations at an approximately constant rate over time, allowing divergence time estimation from molecular differences', 'All genes mutate at the same rate', 'Fossils always provide accurate dating'],
    ans: 1,
    exp: 'Molecular clock: neutral mutations in conserved genes (like cytochrome c or rRNA) accumulate at a roughly constant rate over geological time. By comparing the degree of molecular difference between two species and knowing the mutation rate, scientists can estimate WHEN they diverged (calibrated with fossil dates). Used in human evolution studies (mitochondrial Eve, ~150,000 years ago).'
  },
  {
    q: 'Gene flow between populations tends to:',
    opts: ['Increase genetic differences between populations', 'Decrease genetic differences between populations by introducing alleles from one population into another', 'Cause speciation directly', 'Always reduce genetic diversity in recipient population'],
    ans: 1,
    exp: 'Gene flow (migration): individuals move between populations and reproduce, transferring alleles. This homogenises allele frequencies between populations — reducing genetic divergence. Gene flow opposes speciation. In contrast, geographic isolation prevents gene flow → populations diverge → speciation. Extensive gene flow between two groups maintains them as one genetic unit.'
  },
  {
    q: 'Natural selection acts on:',
    opts: ['Individual genotype directly', 'Individual phenotype — individuals with favourable phenotypes survive/reproduce more, causing allele frequency changes at the population level', 'The entire species at once', 'DNA sequences directly without phenotypic expression'],
    ans: 1,
    exp: 'Natural selection "sees" phenotype (observable traits), not genotype directly. A favourable phenotype (caused by advantageous alleles) leads to greater survival and reproduction → those alleles become more frequent in the next generation. Selection cannot act on recessive alleles hidden in heterozygotes — they are invisible to selection.'
  },
  {
    q: 'The bottleneck effect is a type of genetic drift that occurs when:',
    opts: ['A small founder group colonises a new area', 'A population is drastically reduced in size by a catastrophic event, losing most genetic diversity', 'Two populations merge', 'A single individual has many offspring'],
    ans: 1,
    exp: 'Population bottleneck: a catastrophe (disease, disaster) drastically reduces population size. The surviving gene pool is a random, unrepresentative sample of the original → some alleles are lost forever, others become fixed by chance (not selection). Example: cheetah genetic uniformity (past bottleneck ~10,000 years ago). Distinguished from founder effect (voluntary colonisation of new habitat).'
  },
  {
    q: 'Speciation by polyploidy (increase in chromosome sets) is most common in:',
    opts: ['Animals (especially vertebrates)', 'Plants — many crop species (wheat, cotton, banana) are ancient polyploids', 'Bacteria', 'Fungi only'],
    ans: 1,
    exp: 'Polyploidy speciation: common in plants, rare in animals. Example: bread wheat (Triticum aestivum) is hexaploid (6n = 42 chromosomes), formed by hybridisation of 3 different diploid grass species. Polyploids are reproductively isolated from their parent species (different chromosome numbers → sterile hybrids if mated) — instant speciation.'
  },
  {
    q: 'Which form of natural selection increases the frequency of individuals with EXTREME phenotypes and reduces those with intermediate phenotypes?',
    opts: ['Stabilising selection', 'Directional selection', 'Disruptive (diversifying) selection', 'Sexual selection'],
    ans: 2,
    exp: 'Disruptive (diversifying) selection: favours two extreme phenotypes over the intermediate. Example: black and white oyster catchers survive better than intermediate-coloured ones in a patchwork habitat. Over time, this can split one population into two distinct groups, potentially leading to speciation. Stabilising: favours intermediate. Directional: favours one extreme.'
  },
  {
    q: 'Australopithecus afarensis ("Lucy") is significant in human evolution because:',
    opts: ['It was the first Homo species with a large brain', 'It demonstrated bipedalism (upright walking) while retaining small brain size (~400-550 cc), showing bipedality preceded brain expansion in human evolution', 'It used complex stone tools', 'It was the first hominid to use fire'],
    ans: 1,
    exp: 'Lucy (A. afarensis, ~3.2 MYA) had a chimp-sized brain (~400-550 cc) but fossilised pelvis and knee joints confirm bipedal locomotion. This overturned earlier assumptions that large brain evolved first. The sequence was: bipedalism → free hands → tool use → further brain expansion (in Homo). Fire use: Homo erectus (~1 MYA).'
  },
  {
    q: 'Darwin\'s theory of evolution requires THREE conditions to hold for natural selection to operate. Which set correctly states all three?',
    opts: ['Variation, Heritability, Differential survival/reproduction (fitness differences)', 'Variation, Mutation, Large population size', 'Heritability, Random mating, Geographic isolation', 'Mutation, Selection pressure, Time'],
    ans: 0,
    exp: 'For natural selection: (1) Variation — individuals differ in traits. (2) Heritability — traits are inherited by offspring. (3) Differential reproduction — variation affects survival/reproduction (fitness). If all three conditions are met, natural selection INEVITABLY occurs. Darwin did not know about DNA/genes but correctly identified these logical requirements.'
  },
  {
    q: 'In a dominant lethal condition where the heterozygous state is lethal before reproductive age, what is the long-term fate of that dominant allele in the population?',
    opts: ['It increases because dominant alleles spread faster', 'It is rapidly eliminated because affected individuals die before reproducing, preventing the allele from being passed on', 'It remains at a constant level through mutation-selection balance', 'It becomes recessive over time'],
    ans: 1,
    exp: 'A dominant lethal allele (kills heterozygotes before reproduction) is under intense negative selection pressure. Affected individuals (Aa) never reproduce → the allele is not transmitted. The only source maintaining it is NEW mutations (de novo). It is rapidly eliminated each generation. Example: dominant lethal mutations causing early embryonic death.'
  },
  {
    q: 'In a cross AaBb × AaBb, what is the probability of an offspring with phenotype A_bb (dominant A, recessive bb)?',
    opts: ['1/16', '3/16', '9/16', '1/4'],
    ans: 1,
    exp: 'Apply independent assortment. P(A_) = 3/4. P(bb) = 1/4. If genes are on different chromosomes: P(A_bb) = 3/4 × 1/4 = 3/16. This corresponds to the 9:3:3:1 ratio where A_bb is one of the 3/16 classes (round green in Mendel\'s peas, if A = round, B = yellow).'
  },
  {
    q: 'Two parents both with normal hearing (autosomal recessive deafness) have a deaf child. If they decide to have 4 more children, what is the probability that exactly 2 of the next 4 children will be deaf?',
    opts: ['25%', '21.1%', '50%', '6.25%'],
    ans: 1,
    exp: 'Both parents are carriers (Dd × Dd): P(deaf, dd) = 1/4. Use binomial probability: P(exactly 2 deaf in 4 children) = C(4,2) × (1/4)² × (3/4)² = 6 × 1/16 × 9/16 = 54/256 ≈ 0.211 = 21.1%. This requires both the independent probability for each child AND combinatorial counting.'
  },
  {
    q: 'A woman is heterozygous for two X-linked genes A and B (X^{AB} / X^{ab}), meaning the alleles are in coupling (cis). If there is NO crossing over, what gametes does she produce?',
    opts: ['X^{AB}, X^{Ab}, X^{aB}, X^{ab} in equal proportions', 'X^{AB} and X^{ab} in equal proportions (parental types only)', 'X^{Ab} and X^{aB} only (recombinant types)', 'All four types in 9:3:3:1 ratio'],
    ans: 1,
    exp: 'If genes A and B are linked in coupling (AB/ab) on the X chromosome, and no crossing over occurs, only parental gametes are produced: X^{AB} and X^{ab} in 1:1 ratio. Recombinant gametes (X^{Ab} and X^{aB}) are produced only through crossing over between the two loci. The frequency of recombinants = recombination frequency (map distance in cM).'
  },
  {
    q: 'The term "gene pool" refers to:',
    opts: ['The total genetic information in a single individual', 'The total collection of all alleles of all genes present in all individuals of a population at a given time', 'A laboratory collection of genes', 'The gametes of one generation only'],
    ans: 1,
    exp: 'Gene pool: the sum total of all alleles (for all loci) in all individuals of a population at a given time. Evolution is the change in the gene pool over time. A large, diverse gene pool provides more raw material for natural selection and increases a population\'s ability to adapt.'
  },
  {
    q: 'Analogous structures provide evidence for:',
    opts: ['Divergent evolution and common descent', 'Convergent evolution — similar selective pressures drive similar adaptations in unrelated lineages', 'The validity of Lamarckism', 'Genetic drift in isolated populations'],
    ans: 1,
    exp: 'Analogous structures (e.g., wings of birds vs insects, eyes of vertebrates vs octopus) arise independently in unrelated lineages — convergent evolution. Similar environments exert similar selection pressures, independently driving similar solutions. They do NOT indicate common ancestry. Homologous structures (same origin, different functions) indicate common ancestry and divergent evolution.'
  },
  {
    q: 'Which of the following provides the STRONGEST direct evidence for evolution?',
    opts: ['Biogeography (species distribution patterns)', 'Comparative anatomy (homologous structures)', 'Fossil record showing transitional forms', 'Molecular genetics (shared DNA sequences)'],
    ans: 2,
    exp: 'Transitional fossils provide the most direct, tangible evidence of evolutionary change over time — actual physical specimens showing intermediate forms between ancestor and descendant. Examples: Archaeopteryx (dinosaur-to-bird), Tiktaalik (fish-to-tetrapod), whale ancestors (Pakicetus, Ambulocetus). All other lines of evidence are circumstantial (though highly compelling and consistent).'
  },
  {
    q: 'Genetic drift is most powerful (has the strongest evolutionary effect) in:',
    opts: ['Very large populations with high gene flow', 'Small, isolated populations where random sampling errors cause large fluctuations in allele frequency', 'Populations under intense natural selection', 'Populations with high mutation rates'],
    ans: 1,
    exp: 'Genetic drift: random change in allele frequency due to chance. In a large population, random sampling errors are small relative to total allele pool. In a small population (e.g., 10 individuals), losing one individual can eliminate alleles. Drift is proportional to 1/2N (N = population size) — the smaller N, the greater the drift effect.'
  },
  {
    q: 'In Mendel\'s experiment, when he crossed F1 dihybrids (RrYy × RrYy), he obtained a 9:3:3:1 ratio. If the two genes were completely LINKED (on the same chromosome, no crossing over), the expected F2 ratio would instead be:',
    opts: ['9:3:3:1 (unchanged)', '3:1 (only round yellow : wrinkled green)', '1:2:1', '1:1:1:1'],
    ans: 1,
    exp: 'If two genes are completely linked (no crossing over), the RrYy parent produces only two gamete types: RY and ry (parental types). RY and ry gametes in 1:1 ratio → offspring are RRYY (round yellow) : RrYy (round yellow) : rryy (wrinkled green) in 1:2:1 → phenotypic ratio: 3 round yellow : 1 wrinkled green. No round green or wrinkled yellow appears. Mendel\'s 9:3:3:1 ratio depends on INDEPENDENT assortment (genes on different chromosomes).'
  },
  {
    q: 'The "Out of Africa" theory of modern human origins proposes that:',
    opts: ['Homo sapiens evolved independently on each continent from local Homo erectus populations (multiregional hypothesis)', 'All modern humans descend from a single African population of Homo sapiens that migrated out of Africa ~60,000-70,000 years ago, replacing other archaic hominids', 'Humans originated in Asia and colonised Africa later', 'Modern humans and Neanderthals have no shared ancestry'],
    ans: 1,
    exp: 'The "Out of Africa" (single-origin) model is strongly supported by mitochondrial DNA analysis (mitochondrial Eve, ~150,000 years ago in Africa), Y-chromosome data, and genomic studies. Modern Homo sapiens emerged in Africa and migrated globally, with some interbreeding with Neanderthals and Denisovans. The multiregional hypothesis (parallel evolution) is now largely rejected.'
  },
  {
    q: 'A new antibiotic kills 99.9% of bacteria in a culture. The 0.1% that survive are likely to be:',
    opts: ['Weakened mutants that developed immunity through exposure', 'Pre-existing resistant variants whose resistance was not caused by the antibiotic — natural selection amplified them', 'Bacteria that "learned" resistance', 'Bacteria that used Lamarckian mechanisms to adapt'],
    ans: 1,
    exp: 'Antibiotic resistance illustrates Darwinian natural selection (not Lamarckism). Rare resistant mutants exist in the population BEFORE antibiotic exposure (random mutation). The antibiotic kills sensitive bacteria, leaving resistant ones to reproduce → rapid selection. Antibiotics do not CAUSE mutations; they SELECT for pre-existing resistant variants. This is direct evidence for evolution by natural selection.'
  },
  {
    q: 'In a cross between two true-breeding varieties, if F1 shows a phenotype BEYOND the range of both parents (transgressive segregation), this is evidence of:',
    opts: ['X-linkage of the gene', 'Polygenic inheritance — multiple genes with additive effects, and recombination in F2 creates extreme combinations', 'Dominance of one allele', 'Epistasis always producing extreme phenotypes'],
    ans: 1,
    exp: 'Transgressive segregation: F2 individuals show phenotypes more extreme than either parent. This occurs with polygenic traits: each parent is homozygous for different alleles at different loci. Recombination in F1 × F1 produces offspring that combine extreme alleles from both parents, exceeding parental range. E.g., if parents are AAbb and aaBB, some F2 offspring can be AABB or aabb (more extreme than either parent).'
  },
  {
    q: 'The sex of offspring in humans is determined by the father because:',
    opts: ['The mother always contributes X chromosome; only the father contributes X or Y', 'The father\'s somatic cells determine sex', 'The X chromosome is always from the father', 'Sex is determined after fertilisation by maternal hormones'],
    ans: 0,
    exp: 'Every human egg carries exactly one X chromosome (mother is XX — always contributes X). Father (XY) produces two types of sperm: X-bearing (→ daughter) and Y-bearing (→ son) in ~50:50 ratio. The sperm type that fertilises the egg determines the sex. The SRY gene on the Y chromosome triggers male development. Therefore, the father\'s sperm type is the determining factor.'
  },
  {
    q: 'Evidence from comparative embryology supports evolution because:',
    opts: ['All embryos look identical throughout development', 'Distantly related vertebrates (fish, amphibians, reptiles, birds, mammals) share strikingly similar embryonic structures (gill slits, notochord, tail) that diverge later — reflecting shared ancestry', 'Embryos are simpler organisms that can be studied more easily', 'Embryology only shows similarities in adult organisms'],
    ans: 1,
    exp: 'Ernst Haeckel\'s observation (though his drawings were exaggerated) that vertebrate embryos pass through similar developmental stages reflects shared evolutionary heritage (conserved developmental genes, Hox genes). Early embryos of fish, chickens, and humans all show gill pouches, notochords, and tails, reflecting their common vertebrate ancestor. These disappear as development proceeds along species-specific paths.'
  },
  {
    q: 'A population of moths in an industrial area shifted from predominantly light-coloured to predominantly dark-coloured after industrialisation darkened tree bark with soot. This is a real example of:',
    opts: ['Genetic drift in a large population', 'Directional natural selection (industrial melanism) — peppered moth (Biston betularia)', 'Founder effect', 'Disruptive selection'],
    ans: 1,
    exp: 'Industrial melanism in the peppered moth: before industrialisation, light moths were camouflaged on lichen-covered bark; dark (melanic) mutants were easily seen and eaten by birds. After industrialisation blackened bark, dark moths were camouflaged and light moths were preyed upon. Directional selection rapidly shifted the population toward dark phenotype. Classic demonstration of observable, rapid natural selection.'
  },
  {
    q: 'In Mendel\'s original 7 traits in pea plants, he was lucky that the genes assorted independently. We now know this is because:',
    opts: ['All 7 genes are on different chromosomes', 'Some genes are on the same chromosomes but far enough apart (or on different chromosomes) that they appear to assort independently due to crossing over', 'Peas have 7 chromosomes, one gene per chromosome', 'Mendel selected traits specifically located on different chromosomes'],
    ans: 1,
    exp: 'Pea plants have 7 pairs of chromosomes. Of Mendel\'s 7 traits, most happen to be on different chromosomes OR are far enough apart on the same chromosome that crossing over makes them appear to assort independently. Modern mapping has confirmed this fortunate coincidence — some of his gene pairs ARE on the same chromosome but unlinked due to distance. If he had chosen closely linked genes, he would not have observed 9:3:3:1 ratios.'
  },
  {
    q: 'A woman\'s karyotype shows 47 chromosomes: 47,XXX (Triple X syndrome). This condition most commonly arises from:',
    opts: ['Crossing over during meiosis', 'Non-disjunction of sex chromosomes during meiosis in the mother — both X chromosomes fail to separate', 'Non-disjunction in the father\'s meiosis', 'A somatic mutation after fertilisation'],
    ans: 1,
    exp: '47,XXX arises when an egg receives two X chromosomes instead of one (non-disjunction in maternal meiosis I or II) and is fertilised by a normal X-bearing sperm. Most cases (>90%) result from maternal non-disjunction. The condition is usually mild, with most women being fertile. Maternal age is a risk factor.'
  },
  {
    q: 'The concept of "punctuated equilibrium" proposed by Gould and Eldredge challenges the classical Darwinian view by suggesting that:',
    opts: ['Evolution occurs at a completely constant, slow rate', 'Long periods of stasis (little change) in species are punctuated by rapid bursts of evolutionary change (speciation events), often not gradual', 'Evolution is directed toward a goal (orthogenesis)', 'Genetic drift is more important than natural selection in all contexts'],
    ans: 1,
    exp: 'Punctuated equilibrium (1972): the fossil record often shows species remaining unchanged (stasis) for millions of years, then rapidly changing (in geological time scales) at speciation events. This contrasts with gradualism (slow, continuous change). Rapid change during speciation may be driven by small, isolated populations undergoing strong selection. Both views (gradualism and punctuated equilibrium) may apply in different contexts.'
  },
  {
    q: 'What is the correct interpretation of "survival of the fittest" in evolutionary biology?',
    opts: ['The physically strongest organism always survives', 'Fitness refers to reproductive success (leaving more offspring) — the "fittest" organism is the one best adapted to reproduce in its current environment', 'Faster organisms always outcompete slower ones', 'Fit organisms never die young'],
    ans: 1,
    exp: '"Fitness" in evolutionary biology = reproductive success = how many offspring an organism leaves in the next generation. A slow, small organism may be "fitter" than a large, fast one if it reproduces more successfully in its environment. Fitness is always relative to the specific environment. This is often misunderstood as "strongest" (social Darwinism fallacy).'
  },
];
