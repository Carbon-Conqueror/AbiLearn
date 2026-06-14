/* AbiLearn — Social Science Extra MCQs — Ch 4, 7, 8 */

const SOCIAL_CH4_EXTRA = [
  // 1
  { q: 'What percentage of Belgium\'s population speaks Dutch/Flemish?', opts: ['40%', '59%', '1%', '74%'], ans: 1, exp: 'Dutch/Flemish speakers make up 59% of Belgium\'s population.' },
  // 2
  { q: 'What percentage of Belgium\'s population speaks French?', opts: ['59%', '1%', '40%', '18%'], ans: 2, exp: 'French speakers constitute 40% of Belgium\'s population.' },
  // 3
  { q: 'What percentage of Belgium\'s population speaks German?', opts: ['5%', '10%', '3%', '1%'], ans: 3, exp: 'German speakers are a small minority — only 1% of Belgium\'s population.' },
  // 4
  { q: 'Brussels, the capital of Belgium, has approximately what percentage of French speakers?', opts: ['40%', '59%', '80%', '50%'], ans: 2, exp: 'About 80% of Brussels residents are French-speaking, though Brussels is geographically located in the Flemish region.' },
  // 5
  { q: 'In which region is Brussels geographically situated, despite having a French-speaking majority?', opts: ['Wallonia', 'German Community', 'Flemish region', 'Federal District'], ans: 2, exp: 'Brussels is located in the Flemish region but has a predominantly French-speaking (80%) population.' },
  // 6
  { q: 'How many times did Belgium amend its Constitution between 1970 and 1993?', opts: ['2', '3', '4', '5'], ans: 2, exp: 'Belgium made 4 constitutional amendments between 1970 and 1993 to accommodate linguistic and regional demands.' },
  // 7
  { q: 'The Community Government in Belgium has power over which matters?', opts: ['Defence and foreign policy', 'Cultural, educational and language matters', 'Finance and taxation', 'Law and order'], ans: 1, exp: 'The Community Government in Belgium has authority over cultural, educational and language matters for each linguistic community.' },
  // 8
  { q: 'Who elects the Community Government in Belgium?', opts: ['All citizens of Belgium', 'Members of Parliament', 'Only members of the linguistic community (not by geographic constituency)', 'The King of Belgium'], ans: 2, exp: 'Community Government members are elected only by members of their own linguistic community, regardless of geographic location.' },
  // 9
  { q: 'In which year did Sri Lanka gain independence?', opts: ['1947', '1948', '1950', '1956'], ans: 1, exp: 'Sri Lanka (then Ceylon) gained independence from British rule in 1948.' },
  // 10
  { q: 'What percentage of Sri Lanka\'s population are Sinhalese?', opts: ['18%', '7%', '59%', '74%'], ans: 3, exp: 'Sinhalese constitute approximately 74% of Sri Lanka\'s population.' },
  // 11
  { q: 'What is the combined Tamil population percentage in Sri Lanka (Sri Lankan Tamils + Indian Tamils)?', opts: ['7%', '12%', '18%', '25%'], ans: 2, exp: 'Tamils (Sri Lankan + Indian) together form approximately 18% of Sri Lanka\'s population.' },
  // 12
  { q: 'What percentage of Sri Lanka\'s population are Muslims?', opts: ['7%', '12%', '18%', '1%'], ans: 0, exp: 'Muslims constitute approximately 7% of Sri Lanka\'s population.' },
  // 13
  { q: 'In which year was the Sri Lankan Official Language Act passed, making Sinhala the only official language?', opts: ['1948', '1950', '1956', '1983'], ans: 2, exp: 'The Official Language Act (also called the "Sinhala Only" Act) was passed in 1956, creating an overnight disadvantage for Tamils.' },
  // 14
  { q: 'What did the "Sinhala Only" Act of 1956 specifically do?', opts: ['Gave Tamils autonomy in the north', 'Recognised Tamil as a second official language', 'Made Sinhala the sole official language, disadvantaging Tamils overnight', 'Created a federal state'], ans: 2, exp: 'The 1956 Sinhala Only Act made Sinhala the sole official language, creating an overnight disadvantage for Tamil speakers in government jobs and higher education.' },
  // 15
  { q: 'What was the Tamil United Liberation Front\'s main political demand?', opts: ['Equal representation in Parliament', 'Tamil as second official language', 'A separate Tamil state called Tamil Eelam', 'Federal system with provincial autonomy'], ans: 2, exp: 'The TULF demanded a separate Tamil state called Tamil Eelam in the northern and eastern parts of Sri Lanka.' },
  // 16
  { q: 'What does LTTE stand for?', opts: ['Lanka Tamil Trade Enterprise', 'Liberation Tigers of Tamil Eelam', 'Lanka Tamil Territorial Establishment', 'Liberation Troops of Tamil Eelam'], ans: 1, exp: 'LTTE stands for Liberation Tigers of Tamil Eelam, the armed militant organisation that fought for a separate Tamil state.' },
  // 17
  { q: 'Between which years did the civil war in Sri Lanka officially last?', opts: ['1956–1983', '1972–2000', '1983–2009', '1956–1993'], ans: 2, exp: 'The Sri Lankan civil war between the government and LTTE lasted from 1983 to 2009, when the LTTE was militarily defeated.' },
  // 18
  { q: 'What is "Majoritarianism" as a concept in power sharing?', opts: ['Rule by the majority with protection for minorities', 'A system where the majority community rules and ignores minority rights', 'Proportional representation for all groups', 'Coalition government led by the majority party'], ans: 1, exp: 'Majoritarianism is the belief that the majority community should rule the country and can ignore the needs and wishes of minority communities.' },
  // 19
  { q: 'Which type of reason for power sharing relates to avoiding social conflict and ensuring political stability?', opts: ['Moral reason', 'Ethical reason', 'Prudential reason', 'Constitutional reason'], ans: 2, exp: 'Prudential reasons for power sharing focus on practical benefits — avoiding conflict and ensuring long-term political stability.' },
  // 20
  { q: 'Which type of reason for power sharing considers it inherently valuable and respectful of citizens\' rights?', opts: ['Prudential reason', 'Moral reason', 'Economic reason', 'Political reason'], ans: 1, exp: 'Moral reasons hold that power sharing is inherently good because it respects citizens\' rights and gives everyone a voice in governance.' },
  // 21
  { q: 'Horizontal power sharing refers to power shared between which entities?', opts: ['Central and state governments', 'State and local governments', 'Different organs of government — legislature, executive, judiciary', 'Political parties in a coalition'], ans: 2, exp: 'Horizontal power sharing is between the three organs of government — legislature, executive and judiciary — at the same level.' },
  // 22
  { q: 'Vertical power sharing refers to power shared between which entities?', opts: ['Legislature and executive', 'Social groups and communities', 'Different levels of government — central, state and local', 'Political parties'], ans: 2, exp: 'Vertical power sharing involves different levels of government — central, state and local — sharing power in a hierarchical structure.' },
  // 23
  { q: 'The system of "checks and balances" is associated with which form of power sharing?', opts: ['Vertical power sharing', 'Power sharing among social groups', 'Horizontal power sharing between organs of government', 'Power sharing among political parties'], ans: 2, exp: 'Checks and balances is a feature of horizontal power sharing, where each organ of government (legislature, executive, judiciary) can limit the others.' },
  // 24
  { q: 'Reservations for SC/ST communities is an example of power sharing among which groups?', opts: ['Political parties', 'Social groups', 'Government levels', 'Government organs'], ans: 1, exp: 'Reservations for SC/ST and minority representation in legislatures are examples of power sharing among social groups.' },
  // 25
  { q: 'A coalition government is an example of power sharing among which entities?', opts: ['Social groups', 'Government levels', 'Political parties', 'Government organs'], ans: 2, exp: 'Coalition governments, where multiple political parties share power, are an example of power sharing among political parties.' },
  // 26
  { q: 'Which Belgian city is 80% French-speaking yet geographically located in the Flemish region?', opts: ['Antwerp', 'Ghent', 'Brussels', 'Liège'], ans: 2, exp: 'Brussels, the Belgian capital, is 80% French-speaking but is geographically situated in the Flemish (Dutch-speaking) region.' },
  // 27
  { q: 'Belgium\'s model of power sharing is best described as which type?', opts: ['Only vertical', 'Only horizontal', 'A combination of horizontal, vertical, social and political power sharing', 'Majoritarian democracy'], ans: 2, exp: 'Belgium employs a comprehensive model combining horizontal (organs), vertical (levels), community (social groups) and coalition (parties) power sharing.' },
  // 28
  { q: 'What specifically distinguishes the Community Government in Belgium from regular territorial governments?', opts: ['It controls defence forces', 'It is elected only by members of that linguistic community, not by geographic constituency', 'It has power over international relations', 'It is appointed by the King'], ans: 1, exp: 'The unique feature of Community Government is that its members are elected exclusively by members of their linguistic community — not based on geographic area.' },
  // 29
  { q: 'Sri Lanka\'s policy of giving preference to Sinhalese in government jobs is an example of which policy?', opts: ['Federal accommodation', 'Vertical power sharing', 'Majoritarianism', 'Prudential power sharing'], ans: 2, exp: 'Preferential policies favouring the Sinhalese majority while ignoring Tamil minority rights is a classic example of Majoritarianism.' },
  // 30
  { q: 'The Belgian constitutional amendments between 1970 and 1993 were primarily aimed at resolving what?', opts: ['Economic inequality between regions', 'Conflict between linguistic communities (Dutch, French, German)', 'Military tensions with neighbouring countries', 'Religious discrimination'], ans: 1, exp: 'The 4 constitutional amendments in Belgium were designed to resolve conflicts between Dutch, French and German linguistic communities through power sharing.' },
  // 31
  { q: 'Power sharing among social groups in India most directly includes which mechanism?', opts: ['Federal structure', 'Judicial review', 'Reservations for SC/ST and minority representation', 'Coalition governments'], ans: 2, exp: 'Reservations for SC/ST communities and ensuring minority representation in legislatures are the primary mechanisms of social group power sharing in India.' },
  // 32
  { q: 'Which country provides the example of power sharing succeeding in a multi-ethnic, multi-linguistic society?', opts: ['Sri Lanka', 'Belgium', 'Yugoslavia', 'Sudan'], ans: 1, exp: 'Belgium is cited as a successful example of power sharing resolving tensions in a multi-linguistic society with Dutch, French and German communities.' },
  // 33
  { q: 'Which country provides the example of majoritarianism leading to civil war?', opts: ['Belgium', 'Switzerland', 'Sri Lanka', 'India'], ans: 2, exp: 'Sri Lanka\'s majoritarian policies favouring Sinhalese led to Tamil alienation, the LTTE armed struggle and a devastating civil war from 1983 to 2009.' },
  // 34
  { q: 'The TULF (Tamil United Liberation Front) primarily operated in which country?', opts: ['India', 'Malaysia', 'Bangladesh', 'Sri Lanka'], ans: 3, exp: 'TULF was a major Tamil political party in Sri Lanka that demanded a separate homeland (Tamil Eelam) for Tamils.' },
  // 35
  { q: 'What does power sharing through the judiciary relate to in terms of type?', opts: ['Vertical power sharing', 'Horizontal power sharing', 'Power sharing among social groups', 'Power sharing among political parties'], ans: 1, exp: 'An independent judiciary is a component of horizontal power sharing, as it checks the powers of the legislature and executive.' },
  // 36
  { q: 'In Belgium\'s power sharing model, which level handles matters like international treaties and defence?', opts: ['Community Government', 'Regional Government', 'Federal Government', 'Linguistic Council'], ans: 2, exp: 'The Federal Government in Belgium handles matters of national importance such as defence, foreign policy and international treaties.' },
  // 37
  { q: 'The civil war in Sri Lanka ended in which year?', opts: ['2000', '2005', '2007', '2009'], ans: 3, exp: 'The Sri Lankan civil war ended in 2009 when government forces militarily defeated the LTTE.' },
  // 38
  { q: 'Which of the following best defines "prudential" reasons for power sharing?', opts: ['Power sharing is morally right', 'Power sharing helps avoid conflict and ensures political stability', 'Power sharing reflects respect for individuals', 'Power sharing is required by international law'], ans: 1, exp: 'Prudential reasons are practical — power sharing reduces the likelihood of conflict between groups and creates long-term political stability.' },
  // 39
  { q: 'Which form of power sharing does a multi-party system primarily represent?', opts: ['Horizontal power sharing', 'Vertical power sharing', 'Power sharing among political parties', 'Power sharing among social groups'], ans: 2, exp: 'A multi-party system, where different parties compete for power, is an example of power sharing among political parties.' },
  // 40
  { q: 'Sri Lanka\'s Tamils faced disadvantage after 1956 primarily in which fields?', opts: ['Agriculture and industry', 'Military and foreign service', 'Government employment and higher education', 'Trade and commerce'], ans: 2, exp: 'The Sinhala Only Act made Tamil speakers ineligible for many government jobs and higher education opportunities, causing severe disadvantage.' },
  // 41
  { q: 'Which constitutional principle ensures that no single organ of government becomes all-powerful?', opts: ['Federalism', 'Secularism', 'Checks and balances', 'Universal franchise'], ans: 2, exp: 'The system of checks and balances ensures each organ (legislature, executive, judiciary) can limit the others, preventing any single organ from becoming all-powerful.' },
  // 42
  { q: 'Belgium\'s Community Government has power over language matters. Which community does NOT have its own Community Government?', opts: ['Dutch/Flemish community', 'French community', 'German community', 'Brussels community (it has Regional Government instead)'], ans: 3, exp: 'Brussels has a Regional Government rather than a Community Government, since it is a bilingual area with mixed French and Dutch speakers.' },
  // 43
  { q: 'The demand for Tamil Eelam refers to what?', opts: ['Equal rights for Tamils within Sri Lanka', 'A separate independent Tamil state in Sri Lanka', 'Tamil representation in the Sri Lankan cabinet', 'Tamil as co-official language'], ans: 1, exp: 'Tamil Eelam was the demand for a completely separate, independent Tamil state in the northern and eastern regions of Sri Lanka.' },
  // 44
  { q: 'Power sharing is sometimes described as the "spirit of democracy." Which reason supports this view?', opts: ['Prudential reason — it prevents violence', 'Moral reason — it respects citizens and gives everyone a voice', 'Economic reason — it reduces poverty', 'Strategic reason — it strengthens the military'], ans: 1, exp: 'The moral reason holds that power sharing is the very spirit of democracy because it respects all citizens and ensures everyone has a say in governance.' },
  // 45
  { q: 'Which specific event in 1983 escalated the Sri Lankan ethnic conflict into full civil war?', opts: ['The passage of Sinhala Only Act', 'The formation of TULF', 'Anti-Tamil riots (Black July) that killed thousands of Tamils', 'The assassination of a Tamil leader'], ans: 2, exp: 'The anti-Tamil riots of July 1983 (Black July), in which thousands of Tamils were killed by Sinhalese mobs, escalated the conflict into full-scale civil war.' },
  // 46
  { q: 'Which of the following is an example of vertical power sharing in India?', opts: ['The Supreme Court striking down a Parliament law', 'State governments having power over agriculture', 'Opposition parties scrutinising the government', 'Reservations for OBCs in education'], ans: 1, exp: 'State governments having constitutional power over subjects like agriculture is an example of vertical power sharing between central and state governments.' },
  // 47
  { q: 'The Belgian model specifically evolved over what period through constitutional amendments?', opts: ['1947–1960', '1960–1970', '1970–1993', '1993–2010'], ans: 2, exp: 'Belgium\'s power sharing model was developed through 4 constitutional amendments between 1970 and 1993.' },
  // 48
  { q: 'Which group in Belgium felt threatened by French speakers dominating the capital Brussels despite being a minority nationally?', opts: ['German speakers', 'Dutch/Flemish speakers', 'Italian immigrants', 'Walloons'], ans: 1, exp: 'Dutch/Flemish speakers (59% of Belgium) felt threatened because the capital Brussels was 80% French-speaking despite their national majority status.' },
  // 49
  { q: 'Power sharing among which groups is illustrated by minority communities getting reserved constituencies in Indian legislatures?', opts: ['Political parties', 'Government levels', 'Social groups', 'Government organs'], ans: 2, exp: 'Reserved constituencies for SC/ST and minority representation are examples of power sharing among social groups — ensuring marginalized communities have political voice.' },
  // 50
  { q: 'Sri Lankan Tamils are classified as either "Sri Lankan Tamils" (long-settled) or "Indian Tamils." What is the total Tamil share of Sri Lanka\'s population?', opts: ['7%', '12%', '18%', '25%'], ans: 2, exp: 'Sri Lankan Tamils and Indian Tamils together comprise approximately 18% of Sri Lanka\'s population, making them a significant minority.' },
];

const SOCIAL_CH7_EXTRA = [
  // 1
  { q: 'What is India\'s Net Sown Area (NSA)?', opts: ['120 million hectares', '140 million hectares', '160 million hectares', '192 million hectares'], ans: 1, exp: 'India\'s Net Sown Area is approximately 140 million hectares — the area sown with crops at least once during an agricultural year.' },
  // 2
  { q: 'What is India\'s Gross Cropped Area (GCA)?', opts: ['140 million hectares', '175 million hectares', '192 million hectares', '210 million hectares'], ans: 2, exp: 'India\'s Gross Cropped Area is approximately 192 million hectares, counting each crop in multiple seasons separately.' },
  // 3
  { q: 'How is Cropping Intensity calculated?', opts: ['NSA / GCA × 100', 'GCA / NSA × 100', 'GCA − NSA × 100', 'NSA × GCA / 100'], ans: 1, exp: 'Cropping Intensity = (GCA / NSA) × 100. A value above 100 indicates multiple cropping on the same land in a year.' },
  // 4
  { q: 'Kharif crops are sown in which months?', opts: ['October–November', 'March–April', 'June–July', 'January–February'], ans: 2, exp: 'Kharif crops are sown at the onset of the southwest monsoon in June–July and harvested in September–October.' },
  // 5
  { q: 'Kharif crops are harvested in which months?', opts: ['March–April', 'June–July', 'September–October', 'December–January'], ans: 2, exp: 'Kharif crops like rice, maize and cotton are harvested in September–October, after the monsoon season.' },
  // 6
  { q: 'Which of the following is NOT a kharif crop?', opts: ['Rice', 'Cotton', 'Wheat', 'Groundnut'], ans: 2, exp: 'Wheat is a rabi crop, sown in October–November. Rice, cotton and groundnut are all kharif crops.' },
  // 7
  { q: 'Rabi crops are sown in which months?', opts: ['June–July', 'August–September', 'October–November', 'December–January'], ans: 2, exp: 'Rabi crops are sown in October–November (after the monsoon) and harvested in March–April.' },
  // 8
  { q: 'Rabi crops are harvested in which months?', opts: ['September–October', 'December–January', 'March–April', 'May–June'], ans: 2, exp: 'Rabi crops like wheat, barley and mustard are harvested in March–April, marking the end of the winter season.' },
  // 9
  { q: 'Zaid crops are grown in which period?', opts: ['During kharif season', 'Between rabi and kharif (summer season)', 'During rabi season', 'Year-round'], ans: 1, exp: 'Zaid crops are grown in the short summer season between rabi harvest and kharif sowing — examples include watermelon, cucumber and muskmelon.' },
  // 10
  { q: 'Which of the following is a Zaid crop?', opts: ['Wheat', 'Rice', 'Watermelon', 'Cotton'], ans: 2, exp: 'Watermelon, cucumber and muskmelon are classic Zaid crops grown in the short summer season between rabi and kharif.' },
  // 11
  { q: 'What is the local name for "slash and burn" agriculture in North-East India?', opts: ['Milpa', 'Ladang', 'Jhumming', 'Taungya'], ans: 2, exp: 'In North-East India, slash and burn agriculture is called Jhumming. It is also known as shifting cultivation or primitive subsistence farming.' },
  // 12
  { q: 'What is the local name for slash and burn agriculture in Mexico and Central America?', opts: ['Jhumming', 'Milpa', 'Ladang', 'Roca'], ans: 1, exp: 'In Mexico and Central America, slash and burn (shifting cultivation) is called Milpa.' },
  // 13
  { q: 'What is the local name for slash and burn agriculture in Malaysia and Indonesia?', opts: ['Jhumming', 'Milpa', 'Ladang', 'Taungya'], ans: 2, exp: 'In Malaysia and Indonesia, shifting cultivation is known as Ladang.' },
  // 14
  { q: 'Which type of farming is characterised by small plot sizes, high labour intensity and high yield per unit area?', opts: ['Primitive subsistence farming', 'Commercial farming', 'Intensive subsistence farming', 'Plantation farming'], ans: 2, exp: 'Intensive subsistence farming uses small plots with very high labour input to achieve high yields per unit area — common in densely populated Asian countries.' },
  // 15
  { q: 'In which year was the Green Revolution introduced in India?', opts: ['1960–61', '1965–66', '1967–68', '1971–72'], ans: 2, exp: 'The Green Revolution in India began in 1967–68 with the introduction of High Yielding Variety (HYV) seeds, particularly for wheat and rice.' },
  // 16
  { q: 'IR-8 rice, known as "Miracle Rice," was developed by which institution?', opts: ['IARI (Indian Agricultural Research Institute)', 'IRRI (International Rice Research Institute)', 'FAO (Food and Agriculture Organisation)', 'CGIAR'], ans: 1, exp: 'IR-8, called "Miracle Rice," was developed by the International Rice Research Institute (IRRI) and played a key role in the Green Revolution.' },
  // 17
  { q: 'Norman Borlaug received the Nobel Prize in 1970 for his work on which crop?', opts: ['Rice', 'Maize', 'Wheat', 'Cotton'], ans: 2, exp: 'Norman Borlaug received the Nobel Peace Prize in 1970 for developing high-yielding wheat varieties, making him a father of the Green Revolution globally.' },
  // 18
  { q: 'Who is known as the "Father of Green Revolution in India"?', opts: ['Norman Borlaug', 'Dr. Verghese Kurien', 'M.S. Swaminathan', 'C. Subramaniam'], ans: 2, exp: 'M.S. Swaminathan is called the "Father of Green Revolution in India" for his role in introducing and adapting HYV seeds to Indian conditions.' },
  // 19
  { q: 'Rice cultivation requires a minimum annual rainfall of:', opts: ['50 cm', '75 cm', '100 cm', '150 cm'], ans: 2, exp: 'Rice requires more than 100 cm of annual rainfall and temperatures above 25°C. It is a tropical crop needing warm and wet conditions.' },
  // 20
  { q: 'Which state is the largest producer of rice in India?', opts: ['Punjab', 'Andhra Pradesh', 'West Bengal', 'Tamil Nadu'], ans: 2, exp: 'West Bengal is the largest producer of rice in India, followed by Uttar Pradesh and Andhra Pradesh.' },
  // 21
  { q: 'Wheat requires what temperature range at the time of harvest?', opts: ['5–10°C', '10–15°C', '20–25°C', '25–30°C'], ans: 1, exp: 'Wheat needs cool temperatures (10–15°C) during the growing season and bright sunshine at harvest time. It requires 50–75 cm of rainfall.' },
  // 22
  { q: 'Cotton requires a minimum of how many frost-free days?', opts: ['120 days', '150 days', '180 days', '210 days'], ans: 3, exp: 'Cotton requires at least 210 frost-free days and temperatures between 21–30°C. It grows best in black/regur soil.' },
  // 23
  { q: 'Which type of soil is most suitable for cotton cultivation?', opts: ['Alluvial soil', 'Red soil', 'Laterite soil', 'Black/regur soil'], ans: 3, exp: 'Cotton grows best in black soil (regur soil) because of its moisture retention capacity. Maharashtra, Gujarat and Telangana are major producers.' },
  // 24
  { q: 'Jute is known as "golden fibre." Which river delta is the main jute-growing region in India?', opts: ['Mahanadi delta', 'Godavari delta', 'Hooghly/Ganga delta', 'Krishna delta'], ans: 2, exp: 'Jute, the "golden fibre," is primarily grown in the Hooghly/Ganga delta. West Bengal produces over 50% of India\'s jute.' },
  // 25
  { q: 'Which state produces more than 50% of India\'s jute?', opts: ['Bihar', 'Assam', 'West Bengal', 'Odisha'], ans: 2, exp: 'West Bengal produces over 50% of India\'s total jute output, mainly in the Hooghly river basin and Ganga delta.' },
  // 26
  { q: 'What percentage of the world\'s jute is produced by Bangladesh and India combined?', opts: ['50%', '60%', '70%', '80%'], ans: 2, exp: 'Bangladesh and India together account for approximately 70% of the world\'s jute production.' },
  // 27
  { q: 'Tea cultivation requires approximately how much annual rainfall?', opts: ['75–100 cm', '100–150 cm', '200 cm', 'Over 300 cm'], ans: 2, exp: 'Tea requires around 200 cm of well-distributed rainfall, temperatures between 20–30°C and well-drained hill slopes.' },
  // 28
  { q: 'Which state is the largest producer of tea in India, contributing about 54% of production?', opts: ['West Bengal', 'Kerala', 'Tamil Nadu', 'Assam'], ans: 3, exp: 'Assam produces approximately 54% of India\'s tea. Tamil Nadu produces about 17%, making these two states the dominant tea producers.' },
  // 29
  { q: 'What percentage of India\'s tea production comes from Tamil Nadu?', opts: ['5%', '10%', '17%', '25%'], ans: 2, exp: 'Tamil Nadu produces approximately 17% of India\'s tea, making it the second-largest tea producer after Assam (54%).' },
  // 30
  { q: 'Which state produces approximately 54% of India\'s coffee?', opts: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'], ans: 2, exp: 'Karnataka produces about 54% of India\'s coffee. Coffee grows in hot, humid conditions with well-drained soil and requires shade.' },
  // 31
  { q: 'Which state produces approximately 23% of India\'s coffee?', opts: ['Tamil Nadu', 'Kerala', 'Andhra Pradesh', 'Goa'], ans: 1, exp: 'Kerala produces approximately 23% of India\'s coffee, making it the second-largest coffee producer after Karnataka (54%).' },
  // 32
  { q: 'Which state has about 50% of India\'s sugarcane area under cultivation but Maharashtra has higher productivity?', opts: ['Bihar', 'Uttar Pradesh', 'Tamil Nadu', 'Andhra Pradesh'], ans: 1, exp: 'Uttar Pradesh has about 50% of India\'s sugarcane area but Maharashtra achieves higher productivity (40% production) due to better yield per acre.' },
  // 33
  { q: 'Which state is the largest producer of rubber in India, contributing about 90% of production?', opts: ['Tamil Nadu', 'Assam', 'Tripura', 'Kerala'], ans: 3, exp: 'Kerala produces about 90% of India\'s rubber. Rubber requires equatorial climate with 200+ cm rainfall and temperatures above 25°C.' },
  // 34
  { q: 'Operation Flood (1970–1996) was related to which revolution?', opts: ['Yellow Revolution', 'Blue Revolution', 'White Revolution (dairy)', 'Green Revolution'], ans: 2, exp: 'Operation Flood (1970–1996) was the White Revolution in dairy development, making India the world\'s largest milk producer, led by Dr. Verghese Kurien.' },
  // 35
  { q: 'Who led Operation Flood (White Revolution) in India?', opts: ['M.S. Swaminathan', 'Norman Borlaug', 'Dr. Verghese Kurien', 'C. Subramaniam'], ans: 2, exp: 'Dr. Verghese Kurien, known as the "Father of the White Revolution," led Operation Flood (1970–1996) through the National Dairy Development Board (NDDB).' },
  // 36
  { q: 'The Yellow Revolution in India is associated with which agricultural sector?', opts: ['Fisheries', 'Dairy', 'Oilseeds', 'Horticulture'], ans: 2, exp: 'The Yellow Revolution refers to the increased production of oilseeds in India, boosting edible oil production.' },
  // 37
  { q: 'The Blue Revolution in India relates to which sector?', opts: ['Dairy', 'Fisheries', 'Oilseeds', 'Horticulture'], ans: 1, exp: 'The Blue Revolution refers to the rapid development of fisheries. India is the second-largest fish producer in the world.' },
  // 38
  { q: 'India\'s rank in global fish production is:', opts: ['1st', '2nd', '3rd', '5th'], ans: 1, exp: 'India is the second-largest fish producer in the world, a result of the Blue Revolution that transformed the fisheries sector.' },
  // 39
  { q: 'The National Food Security Act (NFSA) was passed in which year?', opts: ['2008', '2010', '2012', '2013'], ans: 3, exp: 'The National Food Security Act was passed in 2013, entitling beneficiaries to 5 kg of grain per person per month at heavily subsidised prices.' },
  // 40
  { q: 'Under the National Food Security Act 2013, how much grain is entitled per person per month?', opts: ['2 kg', '3 kg', '5 kg', '7 kg'], ans: 2, exp: 'The NFSA 2013 provides 5 kg of foodgrain (rice, wheat or coarse grains) per person per month at subsidised rates.' },
  // 41
  { q: 'Which crop requires equatorial climate with over 200 cm of rainfall?', opts: ['Tea', 'Coffee', 'Rubber', 'Jute'], ans: 2, exp: 'Rubber requires equatorial climate with over 200 cm of well-distributed rainfall. Kerala produces about 90% of India\'s rubber.' },
  // 42
  { q: 'Subsistence farming where farmers produce mainly for their own consumption is called:', opts: ['Commercial farming', 'Plantation farming', 'Subsistence farming', 'Mixed farming'], ans: 2, exp: 'Subsistence farming is practised to meet the farmer\'s own needs. Surpluses, if any, are sold locally. It includes primitive and intensive varieties.' },
  // 43
  { q: 'Which specific type of primitive subsistence farming involves burning forest vegetation and cultivating on that land temporarily?', opts: ['Intensive subsistence farming', 'Plantation farming', 'Slash and burn / shifting cultivation', 'Commercial farming'], ans: 2, exp: 'Slash and burn (shifting cultivation) involves clearing forest by burning, cultivating briefly, then moving to another area when soil fertility declines.' },
  // 44
  { q: 'HYV seeds introduced during the Green Revolution primarily benefited which crops initially?', opts: ['Rice and cotton', 'Wheat and rice', 'Sugarcane and jute', 'Maize and groundnut'], ans: 1, exp: 'The Green Revolution initially focused on wheat and rice, with HYV seeds dramatically increasing yields, especially in Punjab, Haryana and UP.' },
  // 45
  { q: 'Which major problem arose as a consequence of the Green Revolution?', opts: ['Decreased food production', 'Regional imbalance — only Punjab/Haryana/WUP benefited while other regions lagged', 'Decrease in chemical fertiliser use', 'Forest area expansion'], ans: 1, exp: 'The Green Revolution created regional imbalances — mainly benefiting Punjab, Haryana and western UP, while other regions and crops were left behind.' },
  // 46
  { q: 'What temperature range does wheat cultivation require during the growing season?', opts: ['10–15°C (harvest) with cool winters', '25–30°C', '30–35°C', '5–10°C year-round'], ans: 0, exp: 'Wheat requires cool winters for growth and temperatures of 10–15°C at harvest time with bright sunshine. It needs 50–75 cm of annual rainfall.' },
  // 47
  { q: 'The National Horticulture Mission focuses on developing which agricultural products?', opts: ['Cereals and pulses', 'Oilseeds and cotton', 'Fruits, vegetables and flowers', 'Fish and dairy'], ans: 2, exp: 'The National Horticulture Mission was launched to boost the production of fruits, vegetables, flowers and other horticultural crops in India.' },
  // 48
  { q: 'Which crops are examples of rabi crops?', opts: ['Rice, maize, cotton', 'Wheat, barley, mustard, peas', 'Watermelon, cucumber, muskmelon', 'Groundnut, jute, soybean'], ans: 1, exp: 'Wheat, barley, mustard and peas are rabi crops sown in October–November and harvested in March–April.' },
  // 49
  { q: 'Coffee cultivation in India is described as "shade-loving." What does this mean for farming?', opts: ['Coffee is grown under artificial lights', 'Coffee plants need direct harsh sunlight', 'Coffee plants are grown under the shade of taller trees', 'Coffee is grown indoors'], ans: 2, exp: 'Coffee is a shade-loving plant, traditionally grown under the shade of taller trees (like silver oak) on hill slopes in Karnataka, Kerala and Tamil Nadu.' },
  // 50
  { q: 'India became the world\'s largest milk producer as a result of which programme?', opts: ['Green Revolution', 'Blue Revolution', 'Yellow Revolution', 'Operation Flood (White Revolution)'], ans: 3, exp: 'Operation Flood (1970–1996), the White Revolution led by Dr. Verghese Kurien, transformed India into the world\'s largest milk producer.' },
];

const SOCIAL_CH8_EXTRA = [
  // 1
  { q: 'What does "value addition" in manufacturing mean?', opts: ['Adding vitamins to food products', 'The value of manufactured goods minus the cost of raw materials', 'Total revenue from goods sold', 'Tax added to goods'], ans: 1, exp: 'Value addition in manufacturing = value of manufactured goods MINUS cost of raw materials used. It represents wealth created through the manufacturing process.' },
  // 2
  { q: 'What are "agglomeration economies" in industrial location?', opts: ['Losses due to industries clustering together', 'Economic benefits derived from industries clustering in the same location', 'Government subsidies for rural industries', 'Economies achieved through large-scale production'], ans: 1, exp: 'Agglomeration economies are benefits that industries gain by clustering together — shared infrastructure, labour pools, ancillary services and reduced transport costs.' },
  // 3
  { q: 'Weber\'s least-cost theory of industrial location is based on which primary factors?', opts: ['Market size and government policy', 'Transport costs, labour costs and agglomeration', 'Climate and natural resources', 'Population density and energy supply'], ans: 1, exp: 'Alfred Weber\'s least-cost theory holds that industries locate where total costs (mainly transport + labour + agglomeration benefits) are minimised.' },
  // 4
  { q: 'Mumbai is known as the "Manchester of East" for which industry?', opts: ['Jute textile', 'Steel', 'Cotton textile', 'Silk textile'], ans: 2, exp: 'Mumbai is called the "Manchester of East" because of its well-developed cotton textile industry, aided by its port and proximity to the Deccan cotton-growing region.' },
  // 5
  { q: 'Why did cotton textile industries develop in Mumbai?', opts: ['Abundance of coal nearby', 'Sea port access and cotton hinterland in the Deccan', 'Large iron ore deposits', 'Cheap hydroelectric power'], ans: 1, exp: 'Mumbai developed as a cotton textile hub due to its excellent sea port (for export) and the rich cotton-growing Deccan hinterland providing raw material.' },
  // 6
  { q: 'Ahmedabad is called which of the following nicknames?', opts: ['Manchester of East', 'Silicon Valley of India', 'Detroit of India', 'Boston of East or Manchester of India'], ans: 3, exp: 'Ahmedabad is called both the "Boston of East" and "Manchester of India" — a major cotton textile centre with several large mills.' },
  // 7
  { q: 'Which of the following cities is NOT a major cotton textile centre?', opts: ['Mumbai', 'Ahmedabad', 'Coimbatore', 'Jamshedpur'], ans: 3, exp: 'Jamshedpur is famous for iron and steel (TISCO), not cotton textiles. Mumbai, Ahmedabad and Coimbatore are all major cotton textile centres.' },
  // 8
  { q: 'The jute industry in India is mainly concentrated along which river?', opts: ['Godavari', 'Mahanadi', 'Hugli (Hooghly)', 'Sabarmati'], ans: 2, exp: 'India\'s jute industry is clustered along the Hugli (Hooghly) river near Kolkata, benefiting from proximity to raw material, water and port access.' },
  // 9
  { q: 'India\'s share in global jute goods production is approximately:', opts: ['30%', '50%', '70%', '90%'], ans: 2, exp: 'India is the world\'s largest producer of jute goods, accounting for approximately 70% of global jute goods production.' },
  // 10
  { q: 'Which of the following is NOT a reason for the decline of the jute industry in India?', opts: ['Competition from synthetic substitutes', 'High production cost', 'Partition — jute-growing areas went to Bangladesh', 'Increase in international demand'], ans: 3, exp: 'The jute industry declined due to synthetic substitutes, high costs and partition (raw jute areas went to Bangladesh) — NOT due to increased demand, which is incorrect.' },
  // 11
  { q: 'The sugar industry in India is described as "seasonal." For how many months does it typically operate per year?', opts: ['2–3 months', '4–5 months', '6–7 months', '8–9 months'], ans: 1, exp: 'The sugar industry operates only 4–5 months per year (during crushing season) and is hence called a seasonal industry.' },
  // 12
  { q: 'Which two states together account for about 60% of India\'s sugar production?', opts: ['Punjab and Haryana', 'Bihar and Odisha', 'Uttar Pradesh and Maharashtra', 'Tamil Nadu and Karnataka'], ans: 2, exp: 'Uttar Pradesh and Maharashtra together contribute approximately 60% of India\'s sugar production. UP has more area, Maharashtra has higher yield.' },
  // 13
  { q: 'Why is the sugar industry gradually moving southward (to Maharashtra and Karnataka)?', opts: ['Lower labour costs in south', 'Higher sucrose content in sugarcane grown in Maharashtra and Karnataka', 'Better port facilities in south', 'Government policy on sugar zones'], ans: 1, exp: 'Sugarcane grown in Maharashtra and Karnataka has higher sucrose content (due to climate), making southern mills more efficient and productive.' },
  // 14
  { q: 'TISCO (Tata Iron & Steel Company) at Jamshedpur was established in which year?', opts: ['1900', '1907', '1911', '1919'], ans: 1, exp: 'TISCO was established in 1907 by Dorabji Tata and Jamshedji Tata at Jamshedpur, making it India\'s first major private steel plant.' },
  // 15
  { q: 'TISCO at Jamshedpur is which type of enterprise?', opts: ['Public sector', 'Joint sector', 'Private sector', 'Foreign enterprise'], ans: 2, exp: 'TISCO (Tata Iron & Steel Company) is a private sector enterprise, established by the Tata family in 1907.' },
  // 16
  { q: 'The Bhilai Steel Plant in Chhattisgarh was established with collaboration from which country?', opts: ['Germany', 'United Kingdom', 'United States', 'Soviet Union (USSR)'], ans: 3, exp: 'Bhilai Steel Plant (1959) was established with Soviet (USSR) collaboration, one of three major steel plants set up in 1959.' },
  // 17
  { q: 'The Rourkela Steel Plant in Odisha was set up with collaboration from which country?', opts: ['USSR', 'UK (Britain)', 'Germany', 'USA'], ans: 2, exp: 'Rourkela Steel Plant in Odisha was established in 1959 with German collaboration (West Germany).' },
  // 18
  { q: 'The Durgapur Steel Plant in West Bengal was established with collaboration from which country?', opts: ['USSR', 'Germany', 'France', 'UK (Britain)'], ans: 3, exp: 'Durgapur Steel Plant in West Bengal (1959) was built with British (UK) collaboration.' },
  // 19
  { q: 'In which year was the Durgapur Steel Plant established?', opts: ['1907', '1955', '1959', '1964'], ans: 2, exp: 'Durgapur Steel Plant was established in 1959 along with Bhilai and Rourkela — all three set up in the same year with foreign collaboration.' },
  // 20
  { q: 'The Bokaro Steel Plant in Jharkhand was established in which year with which country\'s collaboration?', opts: ['1959, German', '1964, UK', '1964, Soviet Union', '1970, USA'], ans: 2, exp: 'Bokaro Steel Plant was established in 1964 with Soviet (USSR) collaboration, making it another Indo-Soviet industrial project.' },
  // 21
  { q: 'Which steel plant is located in Tamil Nadu and operated by SAIL?', opts: ['Bokaro Steel Plant', 'Bhilai Steel Plant', 'Salem Steel Plant', 'Durgapur Steel Plant'], ans: 2, exp: 'Salem Steel Plant in Tamil Nadu is operated by SAIL (Steel Authority of India Limited) and specialises in stainless and special steels.' },
  // 22
  { q: 'The Vishakhapatnam Steel Plant is also known as:', opts: ['TISCO', 'SAIL Vizag', 'RINL (Rashtriya Ispat Nigam Ltd.) or Vizag Steel', 'BSP Vizag'], ans: 2, exp: 'Vishakhapatnam Steel Plant is officially known as RINL — Rashtriya Ispat Nigam Ltd. — commonly called "Vizag Steel." It was built with Soviet assistance.' },
  // 23
  { q: 'Vizag Steel (RINL) was built with assistance from which country?', opts: ['Germany', 'UK', 'USA', 'Soviet Union (USSR)'], ans: 3, exp: 'Vishakhapatnam Steel Plant (RINL/Vizag Steel) was built with Soviet (USSR) assistance, similar to Bhilai and Bokaro.' },
  // 24
  { q: 'Which of the following is an aluminium smelting centre in Chhattisgarh?', opts: ['Alupuram', 'Hirakud', 'Korba', 'Koyna'], ans: 2, exp: 'Korba in Chhattisgarh is a major aluminium smelting centre, close to coal deposits and with access to bauxite ore.' },
  // 25
  { q: 'The Hirakud aluminium smelting plant is located near which dam/river?', opts: ['Bhakra, Sutlej', 'Koyna, Maharashtra', 'Hirakud, Mahanadi — in Odisha', 'Farakka, Ganga'], ans: 2, exp: 'The Hirakud aluminium smelting plant in Odisha uses power from the Hirakud dam on the Mahanadi river.' },
  // 26
  { q: 'Alupuram aluminium smelting plant is located in which state?', opts: ['Chhattisgarh', 'Odisha', 'West Bengal', 'Kerala'], ans: 3, exp: 'Alupuram is an aluminium smelting centre in Kerala, using hydroelectric power and local bauxite deposits.' },
  // 27
  { q: 'The chemical industries corridor in India is primarily concentrated in which region?', opts: ['Damodar Valley region', 'Mumbai–Thane–Pune corridor and Gujarat coast', 'Bengaluru–Chennai corridor', 'Delhi–Chandigarh corridor'], ans: 1, exp: 'India\'s chemical industry is concentrated in the Mumbai–Thane–Pune corridor and along the Gujarat coast (Vadodara, Surat, Jamnagar).' },
  // 28
  { q: 'Chennai is nicknamed "Detroit of India" for which industry?', opts: ['IT/Software', 'Cotton textile', 'Automobile manufacturing', 'Petrochemicals'], ans: 2, exp: 'Chennai is called the "Detroit of India" because it hosts major automobile manufacturers including Ford, Hyundai, BMW and Royal Enfield.' },
  // 29
  { q: 'Which automobile companies have major manufacturing plants in Chennai?', opts: ['Maruti Suzuki and Hero', 'Ford, Hyundai, BMW and Royal Enfield', 'Bajaj and TVS only', 'Tata Motors and Mahindra'], ans: 1, exp: 'Chennai (Detroit of India) hosts Ford, Hyundai, BMW and Royal Enfield plants, making it India\'s largest automobile manufacturing hub.' },
  // 30
  { q: 'Gurgaon/Manesar is primarily associated with which automobile manufacturer?', opts: ['Ford', 'Hyundai', 'Maruti Suzuki and Hero', 'Tata Motors'], ans: 2, exp: 'Gurgaon and Manesar in Haryana are headquarters of Maruti Suzuki and Hero MotoCorp, making this region a major automobile manufacturing hub.' },
  // 31
  { q: 'Bengaluru is called the "Silicon Valley of India" for which industry?', opts: ['Automobile', 'Cotton textile', 'IT/Software', 'Steel'], ans: 2, exp: 'Bengaluru is the "Silicon Valley of India" — home to major IT and software companies, with the highest concentration of tech firms in the country.' },
  // 32
  { q: 'STPI (Software Technology Parks of India) was established in which year?', opts: ['1984', '1991', '1995', '2000'], ans: 1, exp: 'STPI was established in 1991 to provide infrastructure and 100% export-oriented software development facilities, coinciding with economic liberalisation.' },
  // 33
  { q: 'Which river is severely polluted by industrial effluents in the Damodar Valley region?', opts: ['Godavari', 'Krishna', 'Damodar', 'Brahmani'], ans: 2, exp: 'The Damodar river is heavily polluted by effluents from coal mines and steel plants in the Damodar Valley region (Jharkhand and West Bengal).' },
  // 34
  { q: 'What does ZLD (Zero Liquid Discharge) mean in the context of industrial pollution?', opts: ['Zero production losses', 'No liquid effluent is discharged outside the plant — all wastewater is treated and recycled', 'Zero water usage in production', 'Complete ban on liquid chemicals'], ans: 1, exp: 'ZLD (Zero Liquid Discharge) means industries treat and recycle all wastewater internally — no liquid effluent is released into water bodies outside the plant.' },
  // 35
  { q: 'Which gases from industrial air pollution contribute to acid rain?', opts: ['CO2 and methane', 'SO2 (sulphur dioxide) and NO2 (nitrogen dioxide)', 'CFC and ozone', 'Argon and helium'], ans: 1, exp: 'SO2 and NO2 emitted from industries (especially thermal power plants and steel mills) dissolve in rainwater to form sulphuric and nitric acids — causing acid rain.' },
  // 36
  { q: 'The National River Conservation Plan is primarily aimed at:', opts: ['Building dams on major rivers', 'Cleaning and conserving river water quality by controlling industrial pollution', 'Generating hydroelectricity', 'Flood control and irrigation'], ans: 1, exp: 'The National River Conservation Plan focuses on cleaning rivers, particularly controlling industrial effluents and sewage that degrade river water quality.' },
  // 37
  { q: 'Which steel plant was the first to be established in independent India (after TISCO)?', opts: ['Bokaro Steel Plant', 'Durgapur Steel Plant', 'Bhilai, Rourkela and Durgapur (all 1959)', 'Salem Steel Plant'], ans: 2, exp: 'Bhilai, Rourkela and Durgapur were all established in 1959 — the first public sector steel plants set up after independence, unlike TISCO (1907) which was pre-independence.' },
  // 38
  { q: 'Weber\'s theory distinguishes between weight-loss and weight-gain industries. A weight-loss industry would locate near:', opts: ['Markets', 'Raw material sources', 'Labour supply areas', 'Ports'], ans: 1, exp: 'In weight-loss industries (where raw material loses weight during processing), it is cheapest to locate near raw material sources to minimise transport costs.' },
  // 39
  { q: 'Which industrial corridor is most significant for India\'s chemical/petrochemical industry?', opts: ['Pune–Nashik corridor', 'Mumbai–Thane–Pune corridor and Gujarat coast (Vadodara)', 'Delhi–Agra corridor', 'Bengaluru–Mysuru corridor'], ans: 1, exp: 'The Mumbai–Thane–Pune corridor and Vadodara/Gujarat coast together form India\'s most significant chemical and petrochemical industrial zone.' },
  // 40
  { q: 'RINL stands for:', opts: ['Regional Iron and Nickel Limited', 'Rashtriya Ispat Nigam Ltd.', 'Rural Industries and National Ltd.', 'Refined Iron Nickel Logistics'], ans: 1, exp: 'RINL stands for Rashtriya Ispat Nigam Ltd. — the company that operates the Vishakhapatnam Steel Plant (Vizag Steel) in Andhra Pradesh.' },
  // 41
  { q: 'The Belur aluminium plant is located in which state?', opts: ['Odisha', 'Kerala', 'West Bengal', 'Chhattisgarh'], ans: 2, exp: 'Belur aluminium smelting plant is located in West Bengal. Other centres include Korba (CG), Alupuram (Kerala), Hirakud (Odisha) and Koyna (Maharashtra).' },
  // 42
  { q: 'The Koyna aluminium smelting plant is located in which state?', opts: ['Odisha', 'Maharashtra', 'West Bengal', 'Kerala'], ans: 1, exp: 'The Koyna aluminium smelting plant is in Maharashtra, near the Koyna hydroelectric project which provides the massive electricity needed for smelting.' },
  // 43
  { q: 'Which city in Maharashtra/Pune region is part of India\'s major automobile manufacturing belt?', opts: ['Aurangabad only', 'Mumbai and Pune', 'Nashik only', 'Kolhapur only'], ans: 1, exp: 'Mumbai and Pune form a major automobile manufacturing belt in Maharashtra, with plants of Tata Motors, Bajaj, Mercedes-Benz and others.' },
  // 44
  { q: 'Noise pollution from industries mainly affects which aspects of human health?', opts: ['Only cardiovascular system', 'Hearing loss, stress, sleep disturbance and cardiovascular problems', 'Only respiratory system', 'Only eyesight'], ans: 1, exp: 'Industrial noise pollution causes hearing impairment, psychological stress, sleep disorders and cardiovascular problems in workers and nearby communities.' },
  // 45
  { q: 'Which Tata family members were associated with founding TISCO in 1907?', opts: ['Ratan Tata and Cyrus Mistry', 'J.R.D. Tata and Naval Tata', 'Dorabji Tata and Jamshedji Tata', 'Jamsetji Tata Jr. and Pallonji Tata'], ans: 2, exp: 'TISCO was established in 1907 by Dorabji Tata (son of Jamshedji Tata). Jamshedji Tata had the vision but died before the plant opened.' },
  // 46
  { q: 'What is the primary reason jute-growing areas being in Bangladesh affects India\'s jute industry?', opts: ['Bangladesh charges export duty making Indian jute industry pay more for raw jute', 'Indian mills are far from raw material, reducing the cost advantage of clustering near source', 'Bangladesh does not export jute to India', 'Indian government banned jute imports'], ans: 0, exp: 'After partition, most raw jute-growing areas went to Bangladesh (then East Pakistan), increasing raw material costs for Indian jute mills in West Bengal.' },
  // 47
  { q: 'Which type of industrial pollution directly contaminates drinking water sources?', opts: ['Air pollution (SO2)', 'Noise pollution', 'Thermal pollution and effluents discharged into rivers', 'Light pollution'], ans: 2, exp: 'Industrial effluents and thermal pollution discharged into rivers directly contaminate surface water and groundwater sources used for drinking.' },
  // 48
  { q: 'The Ganga river\'s pollution is attributed to which combination of sources?', opts: ['Only agricultural runoff', 'Only municipal sewage', 'Industrial effluents from cities + tanneries + municipal sewage', 'Only religious activities'], ans: 2, exp: 'Ganga pollution results from industrial effluents (especially from tanneries in Kanpur and chemical plants), municipal sewage and other urban waste.' },
  // 49
  { q: 'Which steel plant collaboration pair is CORRECTLY matched?', opts: ['Bokaro — German collaboration', 'Rourkela — British collaboration', 'Durgapur — German collaboration', 'Bhilai — Soviet collaboration'], ans: 3, exp: 'Bhilai Steel Plant (1959) was built with Soviet (USSR) collaboration. Rourkela = German, Durgapur = British, Bokaro (1964) = Soviet.' },
  // 50
  { q: 'Commercial farming is characterised by which of the following features?', opts: ['Small plots, family labour, subsistence output', 'Large scale, mechanisation, crop specialisation for markets', 'Shifting cultivation with burning of vegetation', 'Mixed farming for local barter'], ans: 1, exp: 'Commercial farming is large-scale, highly mechanised, uses HYV seeds and modern inputs, and produces specialised crops primarily for national and international markets.' },
];
