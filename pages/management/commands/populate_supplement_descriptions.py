from django.core.management.base import BaseCommand
from pages.models import Supplement

DESCRIPTIONS = {
    # ── Vitamins ──────────────────────────────────────────────────────────────
    "Vitamin A (Retinol)": (
        "Fat-soluble vitamin essential for vision, immune function, and skin cell renewal. "
        "Found in liver, dairy, and eggs; also produced from beta-carotene in plant foods. "
        "Deficiency causes night blindness; long-term excess from supplements (not food) can "
        "cause liver toxicity and birth defects. The RDA is 700-900 mcg for adults."
    ),
    "Vitamin B1 (Thiamine)": (
        "Water-soluble B vitamin critical for carbohydrate metabolism and nerve function. "
        "Deficiency causes beriberi and Wernicke's encephalopathy, most common in heavy "
        "alcohol users and those with malabsorption. Often supplemented by people with "
        "poor diets or GI conditions. Very safe at typical doses since excess is excreted."
    ),
    "Vitamin B2 (Riboflavin)": (
        "Water-soluble B vitamin involved in energy production and red blood cell formation. "
        "Supplemented for migraine prevention, where high doses (400 mg/day) show modest "
        "benefit in clinical trials. Excess is excreted harmlessly, causing bright yellow urine. "
        "Found in meat, dairy, eggs, and leafy greens."
    ),
    "Vitamin B3 (Niacin)": (
        "B vitamin used at high doses (1-3 g/day) to raise HDL cholesterol and lower "
        "triglycerides. Flush-free nicotinamide forms are popular for skin and energy but "
        "may lack the cardiovascular benefits of regular niacin. Common side effects at "
        "higher doses include skin flushing, itching, and GI upset."
    ),
    "Vitamin B5 (Pantothenic Acid)": (
        "Essential B vitamin involved in CoA synthesis, adrenal function, and fatty acid "
        "metabolism. Used at high doses (500-2000 mg/day) for acne and energy support, "
        "though evidence is mixed. Deficiency is rare. Diarrhea is possible at very high doses."
    ),
    "Vitamin B6 (Pyridoxine)": (
        "B vitamin essential for protein metabolism, neurotransmitter synthesis (serotonin, "
        "dopamine), and immune function. Commonly used for PMS, morning sickness, and "
        "carpal tunnel syndrome. Peripheral neuropathy can occur with chronic high doses "
        "(above 100 mg/day). Found in poultry, fish, potatoes, and bananas."
    ),
    "Vitamin B7 (Biotin)": (
        "B vitamin widely marketed for hair, skin, and nail health, though evidence in "
        "non-deficient individuals is limited. Involved in fat and carbohydrate metabolism. "
        "Very safe at high doses, but high-dose supplementation can interfere with thyroid "
        "and troponin lab tests -- inform your doctor before testing."
    ),
    "Vitamin B9 (Folate/Folic Acid)": (
        "B vitamin critical for DNA synthesis and cell division, especially important during "
        "pregnancy to prevent neural tube defects. Folic acid is the synthetic form; "
        "methylfolate is better for those with MTHFR gene variants. Deficiency causes "
        "megaloblastic anemia. Found in leafy greens, legumes, and fortified foods."
    ),
    "Vitamin B12 (Cobalamin)": (
        "Essential B vitamin for neurological function, red blood cell formation, and DNA "
        "synthesis. Deficiency (common in vegans, older adults, and those on metformin) "
        "causes fatigue, nerve damage, and anemia. Methylcobalamin and adenosylcobalamin "
        "are more bioavailable than cyanocobalamin. Very safe even at high doses."
    ),
    "Vitamin C (Ascorbic Acid)": (
        "Powerful antioxidant and essential cofactor for collagen synthesis, immune function, "
        "and iron absorption. Widely used for cold prevention (modest evidence), skin health, "
        "and wound healing. Doses above 2 g/day commonly cause GI upset and loose stools. "
        "Found abundantly in citrus, bell peppers, and broccoli."
    ),
    "Vitamin D2 (Ergocalciferol)": (
        "Plant-derived form of vitamin D that supports calcium absorption, bone health, and "
        "immune function. Less potent than D3 at raising serum 25(OH)D levels. Deficiency "
        "is common worldwide and associated with bone loss, immune dysfunction, and low mood. "
        "Best absorbed with a fat-containing meal."
    ),
    "Vitamin D3 (Cholecalciferol)": (
        "The most effective form of vitamin D for raising blood levels, critical for calcium "
        "absorption, bone density, immune regulation, and mood. Widespread deficiency, "
        "especially in those with limited sun exposure. High doses over time can cause "
        "hypercalcemia -- periodic blood testing is advisable at doses above 4000 IU/day."
    ),
    "Vitamin E (Tocopherol)": (
        "Fat-soluble antioxidant that protects cell membranes from oxidative damage. Used "
        "for skin health, cardiovascular support, and immune function. High-dose supplementation "
        "(above 400 IU/day) has been associated with increased all-cause mortality in some "
        "meta-analyses. Mixed tocopherols are preferable to isolated alpha-tocopherol."
    ),
    "Vitamin K1 (Phylloquinone)": (
        "Fat-soluble vitamin essential for blood clotting, produced by gut bacteria and found "
        "in leafy greens. Deficiency impairs coagulation. Interacts with warfarin -- those on "
        "blood thinners should maintain consistent intake. Less relevant for bone health "
        "than vitamin K2."
    ),
    "Vitamin K2 (Menaquinone)": (
        "Fat-soluble vitamin that activates proteins directing calcium into bones and away "
        "from arteries. Often co-supplemented with D3 for bone and cardiovascular health. "
        "The MK-7 form (from natto or supplements) has a longer half-life than MK-4. "
        "Emerging evidence links K2 to reduced arterial calcification."
    ),
    # ── Minerals ─────────────────────────────────────────────────────────────
    "Calcium": (
        "Most abundant mineral in the body, essential for bone structure, muscle contraction, "
        "and nerve signaling. Calcium carbonate is cheapest but requires stomach acid; calcium "
        "citrate is better absorbed without food. Excessive supplementation (not dietary) may "
        "increase cardiovascular risk. Best taken in split doses alongside vitamin D."
    ),
    "Chromium": (
        "Trace mineral that enhances insulin action, commonly supplemented for blood sugar "
        "regulation and weight management. Evidence for metabolic benefits is mixed in "
        "non-deficient individuals. Chromium picolinate is the most studied form. "
        "Generally safe at typical doses; avoid very high doses long-term."
    ),
    "Copper": (
        "Essential trace mineral involved in iron metabolism, collagen synthesis, antioxidant "
        "defense, and neurotransmitter production. Supplementation is often needed to balance "
        "high zinc intake, since the two compete for absorption. Deficiency causes anemia and "
        "neurological issues. Excess copper is toxic."
    ),
    "Fluoride": (
        "Mineral best known for strengthening tooth enamel and reducing cavity formation. "
        "Added to water supplies and toothpaste in many countries. Excessive intake causes "
        "dental and skeletal fluorosis. Most adults receive adequate fluoride through "
        "toothpaste and fluoridated water without supplementation."
    ),
    "Iodine": (
        "Essential mineral for thyroid hormone synthesis, brain development, and metabolic "
        "regulation. Deficiency (globally common) causes goiter and hypothyroidism. "
        "Supplemented by vegans, those avoiding iodized salt, and women planning pregnancy. "
        "Both deficiency and excess can impair thyroid function."
    ),
    "Iron": (
        "Essential mineral for oxygen transport (hemoglobin), energy metabolism, and immune "
        "function. The most common nutritional deficiency worldwide, especially in menstruating "
        "women and vegans. Excess iron is pro-oxidant and toxic -- blood testing before "
        "supplementing is strongly recommended. Ferrous bisglycinate is gentler on the stomach."
    ),
    "Magnesium": (
        "Essential mineral involved in over 300 enzymatic reactions including energy production, "
        "muscle relaxation, sleep, and nerve function. Most people are mildly deficient. "
        "Commonly used for sleep quality, muscle cramps, anxiety, and headaches. Glycinate "
        "and malate forms are better tolerated than oxide, which acts mainly as a laxative."
    ),
    "Manganese": (
        "Trace mineral required for bone formation, carbohydrate metabolism, and antioxidant "
        "defense (as part of MnSOD). Deficiency is rare in typical diets. Most often "
        "supplemented as part of a multi or bone support formula. High doses over time "
        "can be neurotoxic."
    ),
    "Molybdenum": (
        "Ultra-trace mineral that acts as a cofactor for enzymes involved in amino acid "
        "metabolism and sulfite detoxification. Deficiency is extremely rare. Occasionally "
        "supplemented for sulfite sensitivity. Excess intake may increase uric acid levels."
    ),
    "Phosphorus": (
        "Second most abundant mineral in the body after calcium, critical for bone structure, "
        "energy (ATP), and cell membrane integrity. Deficiency is uncommon given how prevalent "
        "it is in protein-rich foods. Supplemented mainly in clinical settings. High intake "
        "from processed foods is a greater concern than deficiency for most people."
    ),
    "Potassium": (
        "Electrolyte essential for heart rhythm, muscle contraction, fluid balance, and blood "
        "pressure regulation. Deficiency from poor diet or diuretics causes muscle cramps and "
        "arrhythmias. High-dose supplements are restricted (99 mg per serving) due to cardiac "
        "risk -- food sources (bananas, avocados, potatoes) are the safest way to increase intake."
    ),
    "Selenium": (
        "Trace mineral with antioxidant properties via glutathione peroxidase, associated "
        "with thyroid function, immune health, and cancer prevention in deficient populations. "
        "Brazil nuts are an extremely rich source (1-2 per day is often sufficient). "
        "Narrow therapeutic window -- chronic excess causes selenosis (hair loss, brittle nails)."
    ),
    "Sodium": (
        "Primary extracellular electrolyte regulating fluid balance, nerve impulse transmission, "
        "and blood pressure. Supplemented mainly by endurance athletes and those on very "
        "low-sodium diets. Most people consume excess sodium from food. Hyponatremia from "
        "overhydration during endurance events is the main risk for athletes."
    ),
    "Zinc": (
        "Essential trace mineral for immune function, testosterone production, wound healing, "
        "taste, smell, and skin health. Deficiency is common, especially in vegans and older "
        "adults. Used for colds, acne, and testosterone support. Long-term high-dose zinc "
        "depletes copper -- if taking above 25 mg/day, supplement copper alongside it."
    ),
    "Flowers of Sulfur": (
        "Elemental sulfur historically used topically for acne, seborrheic dermatitis, and "
        "scabies. Internal use was part of traditional medicine but is largely obsolete. "
        "Topical sulfur remains a common ingredient in skincare for its keratolytic and "
        "antimicrobial properties."
    ),
    # ── Amino Acids ──────────────────────────────────────────────────────────
    "5-HTP": (
        "A direct precursor to serotonin, converted from tryptophan. Used for mood support, "
        "sleep improvement, appetite regulation, and migraine prevention. Should not be "
        "combined with SSRIs, MAOIs, or other serotonergic drugs due to serotonin syndrome "
        "risk. Best taken at night. Works more directly than L-tryptophan."
    ),
    "BCAAs": (
        "Branched-chain amino acids (leucine, isoleucine, valine) that support muscle protein "
        "synthesis and reduce exercise-induced muscle breakdown. Leucine is the primary driver "
        "of anabolic signaling. Most useful when total protein intake is insufficient; complete "
        "protein sources (whey, food) are generally preferable over isolated BCAAs."
    ),
    "Beta-Alanine": (
        "Non-essential amino acid that increases muscle carnosine levels, buffering lactic acid "
        "during high-intensity exercise lasting 1-4 minutes. Takes 4-6 weeks of daily use to "
        "reach full effect. The harmless tingling (paresthesia) at higher doses can be reduced "
        "by splitting into smaller doses throughout the day."
    ),
    "Glycine": (
        "Non-essential amino acid involved in collagen synthesis, glutathione production, and "
        "inhibitory neurotransmission. Used for sleep quality, joint health, gut lining support, "
        "and as a mild anxiolytic. Very safe and inexpensive. Large doses above 10 g may cause "
        "mild GI discomfort. Found naturally in collagen-rich foods."
    ),
    "L-Arginine": (
        "Conditionally essential amino acid and precursor to nitric oxide, which dilates blood "
        "vessels. Used for cardiovascular health, erectile dysfunction, exercise performance, "
        "and wound healing. Oral absorption is poor at high doses; L-citrulline converts to "
        "arginine more efficiently. Can trigger herpes outbreaks in susceptible individuals."
    ),
    "L-Carnitine": (
        "Amino acid-derived compound that transports fatty acids into mitochondria for energy "
        "production. Used for fat metabolism, exercise recovery, male fertility, and heart "
        "health. Most effective in populations with low baseline levels (vegans, older adults, "
        "kidney disease). ALCAR (acetyl-L-carnitine) crosses the blood-brain barrier."
    ),
    "L-Citrulline": (
        "Non-essential amino acid that converts to arginine more efficiently than arginine "
        "itself, boosting nitric oxide and blood flow. Popular pre-workout for exercise "
        "performance and muscle pumps. Citrulline malate (2:1 ratio) is the most studied "
        "form. Well tolerated with minimal side effects at typical doses."
    ),
    "L-Glutamine": (
        "Most abundant amino acid in the body, critical for gut lining integrity, immune "
        "function, and muscle recovery. Supplemented by athletes and those with gut conditions "
        "like IBS or leaky gut. Evidence for exercise recovery benefits is modest in well-nourished "
        "individuals. Very safe even at high doses."
    ),
    "L-Histidine": (
        "Essential amino acid involved in hemoglobin synthesis, immune function, and as a "
        "precursor to histamine. Supplemented for conditions like rheumatoid arthritis and "
        "kidney disease. Carnosine (beta-alanine + histidine) is stored in muscle tissue. "
        "Excess can cause anxiety or neurological symptoms in some people."
    ),
    "L-Isoleucine (BCAA)": (
        "One of the three branched-chain amino acids, supporting muscle protein synthesis, "
        "glucose uptake into cells, and immune function. Has glucose-sparing and tissue-repair "
        "properties. Typically taken as part of a BCAA blend rather than in isolation for "
        "best synergistic effect with leucine and valine."
    ),
    "L-Leucine (BCAA)": (
        "The most anabolic of the BCAAs and the primary activator of mTOR, the central "
        "regulator of muscle protein synthesis. Often considered the key reason BCAA "
        "supplements support muscle growth. Taken alone or as part of a BCAA blend for "
        "muscle recovery, especially in a calorie deficit."
    ),
    "L-Lysine": (
        "Essential amino acid important for collagen synthesis, calcium absorption, and immune "
        "function. Widely used to reduce frequency and severity of cold sore (herpes simplex) "
        "outbreaks by competing with arginine. Also studied for anxiety reduction and bone "
        "health. Found in meat, legumes, and dairy."
    ),
    "L-Ornithine": (
        "Non-essential amino acid in the urea cycle, helping remove ammonia. Used for exercise "
        "performance, liver support, sleep quality, and GH secretion (when taken at night on "
        "an empty stomach). Works synergistically with arginine and citrulline. "
        "Generally well tolerated."
    ),
    "L-Phenylalanine": (
        "Essential amino acid and precursor to tyrosine, dopamine, norepinephrine, and "
        "epinephrine. Supplemented for mood support, pain (via the DLPA form), vitiligo, "
        "and focus. Should be avoided by those with PKU (phenylketonuria). "
        "Can increase blood pressure in some individuals."
    ),
    "L-Serine": (
        "Non-essential amino acid involved in phospholipid synthesis, nerve function (as a "
        "phosphatidylserine precursor), and one-carbon metabolism. Studied for neurological "
        "conditions including ALS and Alzheimer's disease. Part of serine metabolism pathways "
        "that are disrupted in some neurodegenerative conditions."
    ),
    "L-Theanine": (
        "Amino acid found in green tea that promotes calm alertness without sedation by "
        "modulating alpha brain waves and GABA activity. Widely used for anxiety, focus, and "
        "sleep quality. Synergistic with caffeine -- 200 mg theanine + 100 mg caffeine is one "
        "of the most studied natural cognitive stacks. Very safe with no known serious side effects."
    ),
    "L-Tryptophan": (
        "Essential amino acid and precursor to serotonin and melatonin. Used for sleep, mood, "
        "and anxiety. Has a gentler, more sustained effect than 5-HTP since the conversion "
        "step is rate-limited. Should be used cautiously with SSRIs due to serotonin syndrome "
        "risk. Found in turkey, eggs, and dairy."
    ),
    "L-Tyrosine": (
        "Non-essential amino acid and precursor to dopamine, norepinephrine, and thyroid "
        "hormones. Most effective as a cognitive support under acute stress or sleep deprivation "
        "rather than as a daily nootropic. Taken 30-60 minutes before demanding mental or "
        "physical tasks. N-Acetyl-L-Tyrosine (NALT) is more water soluble."
    ),
    "L-Valine (BCAA)": (
        "One of the three branched-chain amino acids supporting muscle protein synthesis "
        "and tissue repair. Has glucose-sparing effects and may support glycogen replenishment "
        "after exercise. Typically taken as part of a complete BCAA supplement alongside "
        "leucine and isoleucine."
    ),
    "Taurine": (
        "Semi-essential amino acid found in high concentrations in the brain, heart, and "
        "muscles. Acts as an antioxidant, osmoregulator, and neuromodulator. Used for "
        "cardiovascular health, exercise performance, and eye health. Very safe and "
        "well-tolerated. A common ingredient in energy drinks."
    ),
    # ── Herbs ────────────────────────────────────────────────────────────────
    "Ashwagandha": (
        "Adaptogenic root from Ayurvedic medicine used to reduce cortisol, support stress "
        "and anxiety, improve sleep quality, and support testosterone levels. One of the "
        "most well-researched adaptogens with multiple human clinical trials. KSM-66 and "
        "Sensoril are the best-studied standardized extracts. Rare cases of liver toxicity "
        "have been reported -- cycle use and avoid very high doses."
    ),
    "Black Cohosh": (
        "Herb traditionally used to relieve menopausal symptoms including hot flashes, night "
        "sweats, and mood changes. Evidence is mixed but several trials show benefit over "
        "placebo. Not recommended during pregnancy. Rare cases of liver toxicity have been "
        "reported. Mechanism may involve serotonin modulation rather than direct estrogen activity."
    ),
    "Cascara Sagrada": (
        "Herbal laxative from the dried bark of Rhamnus purshiana, containing anthraquinone "
        "glycosides that stimulate bowel movements. Intended for short-term constipation only. "
        "Long-term use can cause electrolyte imbalances and laxative dependence. The FDA "
        "banned it in OTC laxatives in 2002, but it remains available as a supplement."
    ),
    "Echinacea": (
        "Popular herb used to reduce the severity and duration of upper respiratory infections. "
        "Evidence is mixed -- most trials show modest benefit for prevention and early treatment "
        "of colds. Multiple species exist (E. purpurea, E. angustifolia, E. pallida) with "
        "different activity profiles. Generally safe short-term."
    ),
    "Fenugreek": (
        "Herb and culinary spice with documented effects on blood sugar regulation, testosterone "
        "support, and milk production in breastfeeding women. Active compounds include "
        "protodioscin and 4-hydroxyisoleucine. Causes a distinct maple syrup odor in sweat and "
        "urine. Generally safe; may interact with anticoagulants and diabetes medications."
    ),
    "Garlic Extract": (
        "Concentrated form of garlic standardized for allicin content, used for cardiovascular "
        "health (modest blood pressure and cholesterol reduction), immune support, and "
        "antimicrobial properties. Enteric-coated or aged garlic extract reduces odor. "
        "May mildly interact with blood-thinning medications."
    ),
    "Ginger Root": (
        "Rhizome with well-established antiemetic properties -- one of the most evidence-backed "
        "natural remedies for nausea from pregnancy, chemotherapy, or motion sickness. Also "
        "used for anti-inflammatory effects and digestion. Generally very safe; high doses "
        "may mildly inhibit platelet aggregation."
    ),
    "Ginkgo Biloba": (
        "Extract from one of the world's oldest tree species, used for cognitive function, "
        "memory, and circulation. Contains flavonoids and terpenoids that improve blood flow "
        "and have antioxidant effects. Evidence for dementia prevention is mixed in large trials. "
        "May increase bleeding risk -- avoid with anticoagulants."
    ),
    "Green Tea Extract (Camellia sinensis)": (
        "Concentrated source of catechins (especially EGCG) and caffeine, used for antioxidant "
        "support, fat oxidation, and metabolism. High doses have been associated with liver "
        "toxicity -- doses above 800 mg EGCG/day carry real risk. Take with food and choose "
        "products with moderate EGCG content."
    ),
    "Holy Basil (Tulsi)": (
        "Adaptogenic herb from Ayurvedic medicine used for stress reduction, blood sugar "
        "regulation, and anti-inflammatory support. Contains eugenol, rosmarinic acid, and "
        "ursolic acid. Used for anxiety, cortisol management, and immune health. Generally "
        "safe; has mild blood-thinning properties."
    ),
    "Horny Goat Weed": (
        "Herb (Epimedium) from traditional Chinese medicine used for libido, erectile function, "
        "and bone health. Contains icariin, a PDE5 inhibitor with mild activity similar to "
        "prescription medications. Human clinical evidence is limited. Often combined with "
        "other herbs in men's health formulas. Generally well tolerated at typical doses."
    ),
    "Maca": (
        "Andean root vegetable used for energy, libido, hormone balance, and fertility. "
        "Does not directly affect hormone levels but may modulate the hypothalamic-pituitary "
        "axis. Gelatinized maca is more bioavailable than raw. Different colors (yellow, red, "
        "black) have slightly different activity profiles. Generally very safe."
    ),
    "Milk Thistle (Silymarin)": (
        "Herb standardized for silymarin content, with well-documented liver-protective and "
        "regenerative properties. Evidence includes protection against toxin-induced liver "
        "damage (including alcohol and certain medications). Widely used alongside compounds "
        "that stress the liver. The phosphatidylcholine complex (silybin-phytosome) "
        "has better bioavailability."
    ),
    "Oregano Oil": (
        "Concentrated essential oil high in carvacrol and thymol, with potent antimicrobial, "
        "antifungal, and antioxidant properties. Used for gut dysbiosis, candida overgrowth, "
        "and respiratory infections. Can disrupt the gut microbiome with extended use -- often "
        "cycled. Must be diluted before ingestion."
    ),
    "Panax Ginseng": (
        "Adaptogenic root from traditional Chinese medicine used for cognitive performance, "
        "physical endurance, immune function, and libido. Contains ginsenosides as primary "
        "active compounds. One of the most researched adaptogens. Stimulating at higher "
        "doses -- avoid late in the day. May interact with warfarin and diabetes medications."
    ),
    "Pau D'Arco": (
        "Bark of the Tabebuia tree used in South American traditional medicine for antifungal, "
        "antimicrobial, and anti-inflammatory effects. The active compound lapachol has shown "
        "activity against candida and bacteria in lab studies. Evidence is primarily preclinical. "
        "High doses can cause nausea and anticoagulant effects."
    ),
    "Rhodiola Rosea": (
        "Adaptogenic herb that helps the body resist physical and mental stress by modulating "
        "cortisol and HPA axis activity. Well-studied for reducing fatigue, improving mood, "
        "and enhancing cognitive performance under stress. Effects are often noticeable "
        "within the first dose. Best taken in the morning; may interact with SSRIs."
    ),
    "Rosemary": (
        "Culinary herb with antioxidant, anti-inflammatory, and mild cognitive-enhancing "
        "properties. Even the aroma of rosemary oil (1,8-cineole) has been shown to improve "
        "memory in small studies. Also used topically for hair growth. Generally safe as a "
        "food and supplement; essential oil should never be ingested undiluted."
    ),
    "Saffron": (
        "Derived from Crocus sativus stigmas with notable clinical evidence for antidepressant "
        "effects comparable to low-dose SSRIs in several trials. Also used for PMS and as an "
        "appetite suppressant. Active compounds include safranal and crocin. Very expensive "
        "-- adulteration of cheap supplements is common. Generally well tolerated."
    ),
    "Saw Palmetto": (
        "Berry extract used primarily for benign prostatic hyperplasia (BPH) symptoms and "
        "androgenic alopecia. Thought to inhibit 5-alpha reductase, reducing DHT. Clinical "
        "evidence for BPH is mixed across trials. Commonly combined with pygeum. "
        "Generally well tolerated; may mildly influence hormonal balance."
    ),
    "St. John's Wort": (
        "Herb with well-documented evidence for mild-to-moderate depression, comparable to "
        "SSRIs in some trials. Active compounds include hyperforin and hypericin. A potent "
        "CYP3A4 inducer -- significantly reduces blood levels of many drugs including birth "
        "control pills, antiretrovirals, and warfarin. Should not be combined with antidepressants."
    ),
    "Tribulus": (
        "Herb traditionally used for libido and testosterone support, widely marketed to "
        "athletes. Despite claims, most clinical trials show no significant effect on "
        "testosterone in healthy men. May support sexual function through non-hormonal "
        "mechanisms. Evidence quality overall is poor."
    ),
    "Turmeric (Curcumin)": (
        "Spice containing curcumin, a potent anti-inflammatory polyphenol. Very poorly "
        "bioavailable on its own -- piperine (black pepper), phospholipid complexes, or "
        "self-emulsifying formulations dramatically improve absorption. Used for joint "
        "inflammation, gut health, and metabolic support. Blood-thinning at high doses."
    ),
    "Valerian Root": (
        "Herb used for sleep induction and anxiety. Evidence is modest but consistent -- "
        "may reduce time to fall asleep and improve sleep quality, especially with regular "
        "use over several weeks. Often combined with passionflower, lemon balm, or hops. "
        "Generally well tolerated; high doses may cause grogginess."
    ),
    "Berberine": (
        "Alkaloid from plants like barberry and goldenseal with significant effects on "
        "blood sugar, lipids, and gut microbiome via AMPK activation -- often compared to "
        "metformin. Strong evidence for type 2 diabetes, PCOS, and dyslipidemia. Start "
        "with low doses to reduce GI upset. May interact with CYP3A4-metabolized drugs."
    ),
    # ── Oils ─────────────────────────────────────────────────────────────────
    "Black Seed Oil": (
        "Oil from Nigella sativa seeds used in traditional Islamic and Ayurvedic medicine. "
        "Contains thymoquinone with anti-inflammatory, antimicrobial, and immunomodulatory "
        "properties. Used for allergies, metabolic syndrome, blood sugar, and blood pressure. "
        "One of the more evidence-backed herbal oils. Generally well tolerated."
    ),
    "Chia Seed Oil": (
        "Rich in alpha-linolenic acid (ALA), a plant-based omega-3. Conversion of ALA to "
        "EPA/DHA is poor in humans (~5-10%), so it is less potent than fish or krill oil for "
        "raising omega-3 levels. Suitable for vegans as part of overall omega-3 support. "
        "No significant adverse effects at typical doses."
    ),
    "Coconut Oil": (
        "Oil composed primarily of medium-chain triglycerides (MCTs), especially lauric acid. "
        "Popular for cooking, keto diets, and skin care. Raises both HDL and LDL cholesterol. "
        "The antimicrobial properties of lauric acid have driven practices like oil pulling. "
        "Cold-pressed virgin coconut oil is preferable for supplementation."
    ),
    "Evening Primrose Oil": (
        "Oil from Oenothera biennis seeds rich in gamma-linolenic acid (GLA), an omega-6 "
        "fatty acid with anti-inflammatory effects. Most commonly used for PMS symptoms, "
        "menopausal symptoms, eczema, and breast pain. Evidence is mixed across trials. "
        "Generally well tolerated; may mildly interact with blood-thinning medications."
    ),
    "Fish Oil (Omega-3)": (
        "Concentrated source of EPA and DHA, the most bioavailable forms of omega-3 fatty "
        "acids. Strong evidence for triglyceride reduction, anti-inflammatory effects, brain "
        "function, and eye health. Look for high-potency products with above 60% omega-3 "
        "content and third-party purity testing. Fishy burps can be reduced by refrigerating "
        "or using enteric-coated capsules."
    ),
    "Flaxseed Oil": (
        "Plant-based oil high in alpha-linolenic acid (ALA), a precursor to EPA and DHA. "
        "Conversion efficiency is low in humans. Used for cardiovascular health, cholesterol "
        "management, and anti-inflammatory support. More economical than fish oil but less "
        "effective at raising EPA/DHA blood levels. Oxidizes quickly -- refrigerate after opening."
    ),
    "Krill Oil": (
        "Source of EPA and DHA in phospholipid form, which may improve bioavailability "
        "compared to triglyceride-form fish oil. Contains astaxanthin as a natural antioxidant "
        "that also improves stability. Used for cardiovascular health, inflammation, and joint "
        "pain. More expensive per gram of omega-3 than fish oil."
    ),
    # ── Nootropics ───────────────────────────────────────────────────────────
    "Acetyl-L-Carnitine": (
        "Acetylated form of L-carnitine that crosses the blood-brain barrier, supporting "
        "mitochondrial function, acetylcholine production, and nerve regeneration. Used for "
        "cognitive decline, depression, peripheral neuropathy, and fatigue. More nootropically "
        "active than standard L-carnitine. May cause insomnia or restlessness at high doses."
    ),
    "Alpha-GPC": (
        "Highly bioavailable choline source that crosses the blood-brain barrier and boosts "
        "acetylcholine synthesis. The best-studied choline form for cognitive performance and "
        "neuroprotection. Commonly used for memory, focus, and the 'mind-muscle connection' "
        "in athletes. Available without prescription and well-tolerated at typical doses."
    ),
    "Aniracetam": (
        "Fat-soluble racetam and AMPA receptor modulator with cognitive-enhancing and "
        "anxiolytic properties not found in other racetams. Requires fat for absorption. "
        "Short half-life requires dosing multiple times per day. Popular in nootropic "
        "communities, though formal clinical evidence in healthy people is limited."
    ),
    "Bacopa Monnieri": (
        "Ayurvedic herb with robust evidence for improving memory consolidation, reducing "
        "anxiety, and supporting long-term brain health. Effects develop over 8-12 weeks of "
        "consistent daily use -- not immediately noticeable. Active bacosides enhance "
        "synaptic transmission. Best taken with food to reduce GI upset."
    ),
    "Caffeine": (
        "The world's most widely consumed psychoactive substance. Blocks adenosine receptors "
        "to increase alertness, focus, and physical performance. Half-life is 4-6 hours. "
        "Tolerance develops quickly with regular use. Excess causes anxiety, heart palpitations, "
        "and insomnia. Synergistic with L-theanine, which smooths the stimulant edge."
    ),
    "Citicoline (CDP-Choline)": (
        "Precursor to both phosphatidylcholine and acetylcholine, supporting membrane "
        "integrity and neurotransmitter synthesis. Clinical evidence for stroke recovery, "
        "glaucoma, and cognitive decline. Provides uridine (a separate nootropic) in addition "
        "to choline, making it arguably the most complete choline supplement available."
    ),
    "Curcumin": (
        "Bioactive polyphenol from turmeric with anti-inflammatory and neuroprotective "
        "properties. Crosses the blood-brain barrier in more bioavailable forms (BCM-95, "
        "Longvida). Used for cognitive support and mood. Requires a bioavailability enhancer "
        "(piperine, phospholipids, or nanoformulation) to have significant systemic effect."
    ),
    "Huperzine A": (
        "Acetylcholinesterase inhibitor from club moss that increases acetylcholine in the "
        "brain. Potent and fast-acting with clinical evidence for Alzheimer's and vascular "
        "dementia. Should be cycled (2-4 weeks on, 1-2 weeks off) to avoid tolerance. "
        "Can cause nausea, dizziness, and GI upset at higher doses."
    ),
    "Inositol": (
        "Sugar alcohol and precursor to cell membrane phospholipids involved in serotonin "
        "and insulin signaling. Used for OCD, panic disorder, PCOS, and metabolic syndrome. "
        "High doses (12-18 g/day) show the strongest evidence for anxiety disorders. "
        "Myo-inositol and D-chiro-inositol are the most studied forms. Generally very safe."
    ),
    "Lion's Mane Mushroom": (
        "Medicinal mushroom containing hericenones and erinacines that stimulate nerve growth "
        "factor (NGF) production. Used for cognitive enhancement, nerve regeneration, and mood. "
        "One of the few supplements studied for peripheral nerve repair. Human clinical evidence "
        "is growing. Best taken consistently over several months for full effect."
    ),
    "Methylene Blue": (
        "Synthetic dye and pharmaceutical agent that acts as a mitochondrial electron carrier "
        "at low doses, with neuroprotective and cognitive-enhancing effects. Shows promise for "
        "memory and Alzheimer's in early research. Interacts with serotonergic drugs -- "
        "risk of serotonin syndrome. Quality and dosing vary widely in over-the-counter products."
    ),
    "Noopept": (
        "Synthetic dipeptide nootropic far more potent than piracetam (10-30 mg vs. several "
        "grams). Modulates AMPA and NMDA receptors and stimulates BDNF production. Used for "
        "memory, focus, and neuroprotection. Fast onset. Long-term human safety data is "
        "limited. Not approved as a drug in most Western countries."
    ),
    "Oxiracetam": (
        "Water-soluble racetam with stimulant-like cognitive effects used for focus, memory, "
        "and mental clarity. More stimulating than piracetam. Formal human trial data is "
        "sparse. Often stacked with a choline source to prevent headaches. "
        "Generally well-tolerated in the nootropic community."
    ),
    "Phenylpiracetam": (
        "Piracetam derivative that is significantly more stimulating due to its phenyl group. "
        "Used for cognitive performance, physical endurance, and cold tolerance. Banned by the "
        "World Anti-Doping Agency (WADA) for athletic competition. Tolerance develops quickly "
        "-- best used occasionally rather than daily."
    ),
    "Phosphatidylserine": (
        "Phospholipid component of cell membranes with strong evidence for cognitive support "
        "and stress reduction. One of few supplements with an FDA-qualified health claim for "
        "cognitive decline. Well-studied for reducing cortisol after intense exercise. "
        "The soy-derived form is most common; sunflower-derived is available for those avoiding soy."
    ),
    "Piracetam": (
        "The original racetam nootropic, modulating AMPA receptors and improving neuronal "
        "membrane fluidity. Clinical evidence exists for cognitive decline and some neurological "
        "conditions; prescription-only in Europe but sold as a supplement elsewhere. Effects "
        "in healthy individuals are subtle. Requires relatively high doses (2.4-4.8 g/day)."
    ),
    "Sulbutiamine": (
        "Synthetic derivative of thiamine (B1) that crosses the blood-brain barrier more "
        "effectively, increasing dopaminergic and cholinergic transmission. Used for fatigue, "
        "motivation, mood, and social anxiety. Tolerance develops with daily use -- best "
        "cycled. Well-tolerated at moderate doses."
    ),
    "Tyrosine": (
        "Amino acid precursor to dopamine, norepinephrine, and thyroid hormones. Most effective "
        "as a cognitive aid under acute stressors like sleep deprivation, cold, or high cognitive "
        "demand. Does not significantly elevate neurotransmitters under relaxed baseline conditions. "
        "Taken 30-60 minutes before a demanding task for best effect."
    ),
    # ── Phytonutrients ───────────────────────────────────────────────────────
    "Anthocyanins": (
        "Polyphenolic pigments in dark berries (blueberries, blackberries, elderberries) with "
        "antioxidant, anti-inflammatory, and cardiovascular-protective properties. Associated "
        "with improved cognitive function, eye health, and metabolic health. Best consumed "
        "via whole foods or concentrated berry extracts. Well tolerated."
    ),
    "Astaxanthin": (
        "Potent carotenoid antioxidant found in salmon, shrimp, and microalgae -- significantly "
        "more powerful than vitamin C in some assays. Used for skin photoprotection, eye health, "
        "endurance performance, and anti-aging. One of few antioxidants with consistently "
        "positive human trial results. Natural form (Haematococcus pluvialis) is preferred."
    ),
    "Beta-Carotene": (
        "Pro-vitamin A carotenoid from orange and yellow vegetables that converts to vitamin A "
        "as needed, avoiding toxicity risk. Also acts as an antioxidant. High-dose supplementation "
        "in smokers significantly increased lung cancer risk in major clinical trials (ATBC, CARET). "
        "Smokers should avoid supplemental beta-carotene."
    ),
    "Catechins (from Green Tea)": (
        "Polyphenols concentrated in green tea, especially EGCG (epigallocatechin gallate), "
        "with antioxidant and anti-inflammatory activity. Studied for metabolic health, "
        "cardiovascular protection, and cancer prevention. Liver toxicity is a concern at "
        "very high isolated EGCG doses -- whole green tea extract with mixed catechins is safer."
    ),
    "DIM (Diindolylmethane)": (
        "Compound formed from cruciferous vegetables that modulates estrogen metabolism, "
        "shifting conversion toward 2-hydroxy estrogens (considered more favorable) and away "
        "from 16-hydroxy forms. Popular for estrogen dominance, PMS, hormonal acne, and "
        "prostate health. May cause urine discoloration. Well tolerated at typical doses."
    ),
    "Lycopene": (
        "Carotenoid pigment giving tomatoes their red color, associated with reduced risk of "
        "prostate cancer, cardiovascular disease, and UV skin damage. Best absorbed from cooked "
        "tomato products (paste, sauce) with fat. Supplemental forms may not fully replicate "
        "the matrix effects of whole food sources."
    ),
    "Lutein": (
        "Carotenoid concentrated in the macula of the eye that filters blue light and protects "
        "against age-related macular degeneration (AMD) and cataracts. Often combined with "
        "zeaxanthin. Also studied for cognitive function and skin photoprotection. Fat-soluble "
        "-- take with meals. Generally very safe."
    ),
    "Quercetin": (
        "Flavonoid with anti-inflammatory, antihistamine, and antioxidant properties. Used for "
        "allergy relief, exercise recovery, and as a zinc ionophore (enhancing zinc's antiviral "
        "properties). Bioavailability is poor unless combined with vitamin C or bromelain. "
        "Generally safe; high doses may mildly inhibit thyroid peroxidase."
    ),
    "Resveratrol": (
        "Polyphenol in red grapes and berries that activates sirtuins and AMPK, mimicking "
        "some caloric restriction pathways associated with longevity. Human evidence for direct "
        "benefits is weaker than animal studies suggest. Trans-resveratrol is the active form. "
        "Better absorbed with fat. High doses may have diminishing or hormetic effects."
    ),
    "Sulforaphane": (
        "Isothiocyanate produced when cruciferous vegetables are chopped or chewed, acting as "
        "a potent Nrf2 activator to upregulate the body's antioxidant defenses. Studied for "
        "cancer prevention, detoxification, brain health, and autism symptom reduction. "
        "Broccoli sprouts are the richest source. Look for myrosinase-active supplements."
    ),
    "Zeaxanthin": (
        "Carotenoid concentrated alongside lutein in the macula, protecting against AMD and "
        "cataracts by filtering high-energy blue light. Supported by the AREDS2 trial for AMD "
        "prevention. Also studied for cognitive function and skin health. "
        "Often sold combined with lutein in eye health formulas."
    ),
    # ── Antioxidants ─────────────────────────────────────────────────────────
    "Alpha Lipoic Acid (ALA)": (
        "Endogenous antioxidant and mitochondrial cofactor that is both water and fat soluble, "
        "capable of recycling vitamins C and E and regenerating glutathione. Strong evidence "
        "for diabetic peripheral neuropathy. Also used for blood sugar regulation and "
        "anti-aging. The R-ALA isomer is naturally occurring and more potent than racemic ALA. "
        "Can lower blood sugar -- monitor if on diabetes medications."
    ),
    "Coenzyme Q10": (
        "Antioxidant and essential component of the mitochondrial electron transport chain. "
        "Naturally produced by the body but declines significantly with age and is depleted "
        "by statin medications. Used for heart failure, statin-induced muscle pain, and "
        "mitochondrial energy support. Ubiquinol form is better absorbed in older adults. "
        "Fat-soluble -- take with meals."
    ),
    "Glutathione": (
        "Master antioxidant produced in every cell, critical for detoxification, immune "
        "function, and oxidative stress. Oral bioavailability of standard L-glutathione is "
        "poor; liposomal and S-acetyl-glutathione forms are better absorbed. NAC, alpha-lipoic "
        "acid, and glycine are more cost-effective ways to raise glutathione levels. "
        "IV glutathione is used clinically."
    ),
    "Grapeseed Extract": (
        "Rich source of oligomeric proanthocyanidins (OPCs), potent antioxidants with "
        "anti-inflammatory and cardiovascular-protective properties. Clinical evidence for "
        "venous insufficiency, blood pressure reduction, and edema. One of the more bioavailable "
        "polyphenol sources. Well-tolerated with no significant adverse effects."
    ),
    "N-Acetyl Cysteine (NAC)": (
        "Glutathione precursor and FDA-approved treatment for acetaminophen overdose and "
        "respiratory conditions (as a mucolytic). Used for liver protection, antioxidant "
        "support, mental health (OCD, bipolar disorder), and respiratory health. Very well "
        "studied with a strong safety record. Nausea is possible at high doses."
    ),
    # ── Peptides ─────────────────────────────────────────────────────────────
    "BPC-157": (
        "Synthetic peptide derived from a protein found in gastric juice with remarkable "
        "tissue-healing properties in animal research. Used by the biohacking community for "
        "gut healing, tendon and ligament repair, joint protection, and neurological support. "
        "Human clinical evidence is very limited. No established long-term safety profile. "
        "Typically self-administered orally or via injection."
    ),
    "CJC-1295": (
        "Synthetic analog of growth hormone-releasing hormone (GHRH) that stimulates pulsatile "
        "GH secretion. Used for fat loss, muscle gain, anti-aging, and improved sleep quality. "
        "Often combined with ipamorelin for synergistic effect. The DAC version has a much "
        "longer half-life (~6-8 days). Prescription in most countries."
    ),
    "Epitalon": (
        "Synthetic tetrapeptide studied primarily for telomere-lengthening and anti-aging "
        "properties in Russian research. Thought to upregulate telomerase activity. Animal "
        "studies show life extension; human data is limited and largely from small Russian "
        "trials. Administered as injection or nasal spray. Long-term safety is not established."
    ),
    "GHK-Cu": (
        "Copper peptide naturally present in blood plasma with regenerative, anti-inflammatory, "
        "and collagen-stimulating properties. Most evidence is for wound healing and topical "
        "skin applications. Systemic use (injection, nasal spray) is in early research stages. "
        "Generally considered low-risk at physiological doses. Popular in skin health and "
        "longevity communities."
    ),
    "Hexarelin": (
        "Synthetic growth hormone secretagogue that strongly stimulates GH release -- more "
        "potent than ipamorelin but also increases cortisol and prolactin to a greater degree. "
        "Used for muscle gain, fat loss, and recovery. Desensitization occurs with continuous "
        "use -- requires cycling. No approved human indications; research peptide only."
    ),
    "IGF-1 LR3": (
        "Long-acting analog of insulin-like growth factor 1 with a 20-30 hour half-life. "
        "Promotes muscle protein synthesis, fat oxidation, and cellular growth downstream "
        "of GH. Carries a significant risk of hypoglycemia -- blood sugar monitoring is "
        "critical. High abuse potential in bodybuilding. Controlled substance in many countries."
    ),
    "Ipamorelin": (
        "Selective growth hormone secretagogue that stimulates GH release with minimal effect "
        "on cortisol or prolactin, making it one of the better-tolerated GH peptides. Used "
        "for fat loss, recovery, anti-aging, and sleep quality. Often paired with CJC-1295 "
        "for amplified GH pulses. Long-term safety data is still limited."
    ),
    "Melanotan II": (
        "Synthetic analog of alpha-MSH that stimulates melanin production (tanning) and "
        "potently activates sexual arousal receptors. Not approved for human use anywhere. "
        "Causes nausea, flushing, and spontaneous erections. Associated with dangerous "
        "side effects including abnormal mole changes and cardiovascular events. "
        "High-risk compound -- use is strongly cautioned."
    ),
    "PT-141": (
        "Melanocortin receptor agonist (bremelanotide) FDA-approved for hypoactive sexual "
        "desire disorder (HSDD) in premenopausal women. Increases sexual desire through "
        "CNS mechanisms rather than vascular effects. Used off-label in men for erectile "
        "dysfunction. Common side effects include nausea, flushing, and temporary "
        "blood pressure elevation."
    ),
    "Selank": (
        "Synthetic heptapeptide analog of tuftsin with anxiolytic and nootropic properties, "
        "developed in Russia. Modulates GABA and serotonin without sedation or dependence "
        "potential. Used for anxiety, stress, focus, and immune regulation. Typically "
        "administered as a nasal spray. Not approved in Western countries."
    ),
    "Semax": (
        "Synthetic ACTH analog developed in Russia as a neuroprotective and cognitive agent. "
        "Stimulates BDNF production with anti-anxiety and focus-enhancing effects. Approved "
        "in Russia for ischemic stroke and cognitive decline. Taken as a nasal spray. "
        "Well-regarded in nootropic communities for its clean cognitive enhancement profile."
    ),
    "Tesamorelin": (
        "GHRH analog FDA-approved for HIV-associated lipodystrophy that increases GH and "
        "IGF-1 production. Used off-label for anti-aging, visceral fat reduction, and "
        "cognitive decline prevention (with notable Alzheimer's research). Requires injection. "
        "Has a better-established safety profile than most other GH peptides due to FDA approval."
    ),
    "Thymosin Alpha-1": (
        "Immunomodulatory peptide from the thymus gland with broad immune-enhancing and "
        "anti-inflammatory properties. Approved in over 35 countries for hepatitis B, "
        "hepatitis C, and as a cancer therapy adjuvant. Studied for COVID-19, Lyme disease, "
        "and sepsis. One of the most clinically validated peptides available. Generally "
        "well tolerated."
    ),
    "Thymosin Beta-4": (
        "Regenerative peptide that promotes tissue repair, reduces inflammation, and "
        "accelerates healing of muscles, tendons, and cardiac tissue. TB-500 (the "
        "commonly supplemented fragment) has the same core activity. Evidence is primarily "
        "preclinical. Used for sports recovery and wound healing. No published human "
        "clinical trials as of yet."
    ),
    # ── Hormones ─────────────────────────────────────────────────────────────
    "DHEA (Dehydroepiandrosterone)": (
        "Most abundant steroid hormone in the body, declining with age. A precursor to both "
        "estrogen and testosterone. Used for anti-aging, libido, mood, bone density, and "
        "adrenal support. Effects are highly variable depending on individual conversion "
        "pathways. May cause acne, oily skin, or hormonal side effects. Over-the-counter "
        "in the US but controlled elsewhere."
    ),
    "DHT (Dihydrotestosterone)": (
        "The most potent androgen, converted from testosterone by 5-alpha reductase. Critical "
        "for male sexual development, libido, and prostate function. Elevated DHT is "
        "associated with male pattern baldness and BPH. Supplementation is niche -- "
        "topical forms are used for hypogonadism and some female libido applications. "
        "Requires medical supervision."
    ),
    "Estrogen": (
        "Female sex hormone responsible for reproductive development, bone density, "
        "cardiovascular health, and mood regulation. Supplemented as HRT for menopausal "
        "symptom relief and osteoporosis prevention. Multiple forms exist (estradiol, "
        "estrone, estriol) with differing potency. Associated with increased clot and "
        "cancer risk when used without appropriate medical oversight."
    ),
    "Melatonin": (
        "Pineal hormone that regulates the sleep-wake cycle. Highly effective for jet lag, "
        "shift work, and sleep onset. The optimal dose is far lower than most OTC products "
        "-- 0.5-1 mg is as effective as 5-10 mg for most people with fewer next-day effects. "
        "Timing (1-2 hours before desired sleep) matters more than dose."
    ),
    "Pregnenolone": (
        "Master precursor to most steroid hormones including DHEA, progesterone, estrogen, "
        "testosterone, and cortisol. Used for cognitive function, mood, and stress resilience. "
        "Effects depend heavily on individual conversion pathways and existing hormone levels. "
        "Difficult to predict outcomes -- hormonal cascades make this a nuanced supplement."
    ),
    "Testosterone": (
        "Primary male sex hormone responsible for muscle mass, libido, bone density, "
        "red blood cell production, and mood. Medical testosterone therapy requires a "
        "prescription. Over-the-counter 'boosters' typically contain herbal blends with "
        "modest evidence. Anabolic steroid misuse carries serious cardiovascular and "
        "endocrine risks. Blood testing before supplementing is important."
    ),
    "Allopregnanolone": (
        "Neurosteroid synthesized from progesterone that positively modulates GABA-A receptors, "
        "producing anxiolytic and sedative effects. FDA-approved (as brexanolone, IV) for "
        "postpartum depression. Levels naturally fluctuate with the menstrual cycle and are "
        "linked to PMDD. No OTC supplemental forms are established -- this is primarily "
        "a prescription pharmaceutical."
    ),
    "Andosterone": (
        "Weak androgen and pheromone found in human sweat and urine. Used in some pheromone "
        "products marketed for social and sexual attraction. Androgenic effects at typical "
        "doses are minimal. Scientific evidence for behavioral effects is limited. "
        "Should not be confused with androstenedione."
    ),
    "6-keto-P4": (
        "Naturally occurring progesterone metabolite with weak estrogenic activity. Used "
        "experimentally as a topical progestogen in some hormone optimization formulations. "
        "Limited clinical data compared to conventional progestogens. Discussed primarily "
        "in hormone optimization communities. Requires careful dosing and monitoring."
    ),
    "Cyproheptadine": (
        "First-generation antihistamine with antiserotonergic and appetite-stimulating "
        "properties. Used off-label for appetite stimulation, weight gain, serotonin syndrome "
        "treatment, and migraine prevention. Causes sedation and can blunt the effects of "
        "SSRIs. Available by prescription in many countries."
    ),
    "Natural Desiccated Thyroid (NDT)": (
        "Thyroid hormone replacement derived from porcine (pig) thyroid gland, containing "
        "both T3 and T4. Used for hypothyroidism, particularly by those who do not feel "
        "well on synthetic T4 alone. Contains a fixed T3/T4 ratio which may not suit everyone. "
        "Requires a prescription and regular blood monitoring."
    ),
    "Thyroid (T3)": (
        "The active form of thyroid hormone (triiodothyronine) that directly regulates "
        "metabolism, energy, body temperature, and heart rate. Used for hypothyroidism, "
        "especially when T4-only therapy is insufficient. Short half-life requires careful "
        "dosing. Requires a prescription and close medical monitoring."
    ),
    "Thyroid (T3+T4)": (
        "Combination thyroid hormone therapy providing both the active T3 and the precursor "
        "T4 (levothyroxine). Used for those with hypothyroidism who don't convert T4 to T3 "
        "adequately. Available as desiccated thyroid or as separate synthetic hormones. "
        "Requires a prescription and regular monitoring."
    ),
    "Thyroid (T4)": (
        "The precursor thyroid hormone (levothyroxine) that the body converts to active T3. "
        "The standard medical treatment for hypothyroidism. Long half-life allows once-daily "
        "dosing. Absorption is affected by food, calcium, and iron -- best taken on an empty "
        "stomach. Requires a prescription and regular TSH monitoring."
    ),
    # ── Antibiotics ──────────────────────────────────────────────────────────
    "Amoxicillin": (
        "Broad-spectrum penicillin-class antibiotic used for bacterial respiratory, ear, "
        "skin, and urinary tract infections. Requires a prescription. Common side effects "
        "include GI upset and allergic reactions. Not effective against viral infections. "
        "Completing the full prescribed course is essential to prevent resistance."
    ),
    "Azithromycin": (
        "Macrolide antibiotic (the 'Z-pack') prescribed for respiratory infections, STIs, "
        "and atypical pneumonia. Long tissue half-life allows short treatment courses. "
        "Associated with cardiac arrhythmia risk (QT prolongation) at higher doses. "
        "Requires a prescription. Has no effect on viral infections."
    ),
    "Ciprofloxacin": (
        "Broad-spectrum fluoroquinolone antibiotic with a black box warning for tendon "
        "rupture, peripheral neuropathy, and CNS effects. Should be reserved for infections "
        "where alternatives are not suitable. Does not absorb well when taken with calcium, "
        "magnesium, or iron supplements. Requires a prescription."
    ),
    "Clindamycin": (
        "Lincosamide antibiotic used for skin, bone, and anaerobic infections. Associated "
        "with C. difficile-associated diarrhea more than most other antibiotics. Requires "
        "a prescription. Available in topical forms for acne. Should only be used when "
        "specifically prescribed by a doctor."
    ),
    "Doxycycline": (
        "Tetracycline-class antibiotic used for acne, Lyme disease, malaria prophylaxis, "
        "and respiratory infections. Photosensitizing -- avoid prolonged sun exposure. "
        "Take with plenty of water and remain upright for 30 minutes after dosing to "
        "prevent esophageal irritation. Requires a prescription."
    ),
    "Erythromycin": (
        "Original macrolide antibiotic now less commonly used due to GI side effects and "
        "resistance patterns. Used for respiratory infections, skin conditions, and as a "
        "prokinetic for gastroparesis. Available in topical forms for acne. A potent "
        "CYP3A4 inhibitor with significant drug interactions. Requires a prescription."
    ),
    "Levofloxacin": (
        "Broad-spectrum fluoroquinolone antibiotic sharing the same black box warnings as "
        "ciprofloxacin (tendon rupture, neuropathy, CNS effects). Used for serious "
        "infections including community-acquired pneumonia. Should be reserved for when "
        "other antibiotics are not appropriate. Requires a prescription."
    ),
    "Metronidazole": (
        "Antibiotic and antiprotozoal used for bacterial vaginosis, C. difficile, H. pylori, "
        "and parasitic infections. A disulfiram-like reaction occurs with alcohol -- strictly "
        "avoid alcohol during and for 48 hours after treatment. Metallic taste is a common "
        "side effect. Requires a prescription."
    ),
    "Penicillin": (
        "The original beta-lactam antibiotic, still highly effective for streptococcal "
        "infections, syphilis, and Lyme disease. Penicillin allergy is widely over-reported "
        "-- up to 90% of those labeled as allergic tolerate it on formal allergy testing. "
        "Requires a prescription. No effect on viral infections."
    ),
    "Tetracycline": (
        "Broad-spectrum antibiotic used for acne, Lyme disease, and respiratory infections. "
        "Should not be used during pregnancy or by children under 8 as it stains developing "
        "teeth. Must be taken on an empty stomach and away from dairy and mineral supplements. "
        "Photosensitizing. Requires a prescription."
    ),
    # ── Liver Support ────────────────────────────────────────────────────────
    "TUDCA": (
        "Bile acid derivative and powerful liver-protective agent that reduces ER stress, "
        "inhibits cell death, and promotes bile flow. Used for liver protection, cholestasis, "
        "and metabolic liver disease. Growing evidence for neuroprotective effects in ALS "
        "and Alzheimer's research. One of the most evidence-backed liver support supplements."
    ),
    # ── Methylation ──────────────────────────────────────────────────────────
    "SAMe (S-Adenosyl Methionine)": (
        "Methyl donor involved in hundreds of biochemical reactions including neurotransmitter "
        "synthesis, DNA methylation, and liver function. Strong evidence for antidepressant "
        "effects and liver disease treatment. Can trigger anxiety or mania in bipolar disorder. "
        "Expensive and unstable -- product quality varies significantly."
    ),
    "TMG (Betaine)": (
        "Methyl donor that reduces homocysteine, supports liver health, and has modest evidence "
        "for improving power output in athletes. Works synergistically with folate, B12, and "
        "choline in methylation pathways. Used for cardiovascular support and liver protection. "
        "Generally well tolerated; high doses may cause GI discomfort."
    ),
    # ── Mushrooms ────────────────────────────────────────────────────────────
    "Chaga": (
        "Parasitic fungus from birch trees used in Siberian traditional medicine for immune "
        "support and antioxidant protection. Rich in beta-glucans, betulinic acid, and melanin "
        "complexes. Used for immune regulation, inflammation, and gut health. High oxalate "
        "content -- those prone to kidney stones should use caution. Evidence is largely "
        "preclinical."
    ),
    # ── Probiotics ───────────────────────────────────────────────────────────
    "Probiotic (Any Mix)": (
        "Blends of beneficial bacteria (typically Lactobacillus and Bifidobacterium species) "
        "that support gut microbiome balance, immune function, and digestive health. Benefits "
        "are strain- and condition-specific -- the strongest evidence is for antibiotic-associated "
        "diarrhea and IBS. Refrigerated live cultures are preferable for most strains."
    ),
    "Probiotic (Saccharomyces)": (
        "Saccharomyces boulardii is a probiotic yeast with the strongest evidence base among "
        "probiotics, particularly for traveler's diarrhea, C. difficile, and antibiotic-associated "
        "diarrhea. As a yeast it survives antibiotic treatment and can be taken simultaneously. "
        "Also beneficial for IBS and IBD. One of the most clinically validated probiotic options."
    ),
    "Probiotic (Soil-Based)": (
        "Probiotic formulas using spore-forming bacteria (Bacillus coagulans, B. subtilis, "
        "B. licheniformis) that are heat-stable and acid-resistant. Growing evidence for IBS, "
        "gut health, and immune function. Generally safe; additional caution is advised "
        "in immunocompromised individuals compared to conventional lactobacillus strains."
    ),
    # ── Miscellaneous ────────────────────────────────────────────────────────
    "Creatine": (
        "One of the most extensively researched performance supplements, increasing "
        "phosphocreatine stores in muscle for rapid ATP regeneration during high-intensity "
        "efforts. Also shows cognitive benefits, especially under sleep deprivation, and is "
        "being studied for neurological conditions. Creatine monohydrate is as effective as "
        "any other form. Loading is optional -- 3-5 g/day consistently is sufficient."
    ),
    "GABA": (
        "The primary inhibitory neurotransmitter in the brain. Supplemental GABA is widely "
        "used for anxiety and sleep, though its ability to cross the blood-brain barrier "
        "orally is debated. Pharma-GABA (from fermentation) appears to produce measurable "
        "relaxing effects in some studies. Gamma-aminobutyric acid supports a calm, "
        "focused state at typical doses."
    ),
    "Glucosamine": (
        "Building block of joint cartilage used for osteoarthritis pain and joint health. "
        "Often combined with chondroitin. The NIH-funded GAIT trial showed benefit for "
        "moderate-to-severe knee pain specifically. Effects take weeks to months to develop. "
        "Generally well tolerated; those with shellfish allergies should choose synthetic forms."
    ),
    "Hyaluronic Acid": (
        "Glycosaminoglycan naturally found in connective tissue, synovial fluid, and skin "
        "that retains water to keep tissues moist and lubricated. Used for joint pain, skin "
        "hydration, and wound healing. Studies support systemic absorption of low-molecular-weight "
        "oral forms. Very well tolerated with no significant adverse effects."
    ),
    "Malic Acid": (
        "Organic acid from the Krebs cycle found in apples. Used for fibromyalgia (combined "
        "with magnesium), exercise performance, skin brightening, and kidney stone prevention. "
        "Very safe at typical doses. Also a common food additive (E296) and ingredient in "
        "energy-focused supplement formulas."
    ),
    "Mastic Gum": (
        "Resin from Pistacia lentiscus trees with strong evidence for H. pylori eradication "
        "and peptic ulcer healing. One of the better-studied natural remedies for H. pylori "
        "with efficacy comparable to some antibiotic protocols. Also has antifungal and "
        "anti-inflammatory properties. Generally well tolerated."
    ),
    "Spermidine": (
        "Naturally occurring polyamine found in wheat germ, aged cheese, and mushrooms that "
        "induces autophagy (cellular self-cleaning). Emerging longevity supplement with "
        "observational data linking higher dietary spermidine to reduced all-cause mortality. "
        "Works via mTOR inhibition. Human supplementation trials are in early stages."
    ),
    "Collagen": (
        "Hydrolyzed protein providing the amino acids (glycine, proline, hydroxyproline) "
        "used to build connective tissue. Best evidence is for skin elasticity, joint pain "
        "in athletes, and nail strength. Marine collagen is more bioavailable than bovine. "
        "Vitamin C is essential for collagen synthesis and is often co-supplemented."
    ),
    "Gelatin": (
        "Protein derived from animal collagen that provides glycine, proline, and "
        "hydroxyproline for joint health and gut lining support. Less refined than "
        "hydrolyzed collagen so not as easily absorbed, but inexpensive as a food supplement. "
        "Requires vitamin C for optimal use of its amino acids in collagen synthesis."
    ),
    "Chlorella": (
        "Single-celled freshwater algae rich in chlorophyll, protein, vitamins, and minerals. "
        "Used for heavy metal detoxification, immune support, and as a nutrient-dense green "
        "supplement. Evidence for heavy metal chelation is mixed. May bind some medications "
        "-- take separately. Can cause mild GI discomfort initially."
    ),
    "Lanosterol": (
        "Precursor to cholesterol and other steroids, primarily studied for its ability to "
        "dissolve protein aggregates in the eye lens (cataracts). Promising animal and limited "
        "human data for topical eye drop use in cataract treatment. Rationale for oral "
        "systemic supplementation is not well established."
    ),
    "Phosphatidylcholine": (
        "Major phospholipid component of cell membranes and a precursor to acetylcholine. "
        "Used for liver health (NAFLD, hepatitis), cognitive function, and as a choline "
        "source. Present in lecithin supplements. IV phosphatidylcholine is used clinically "
        "for lipodystrophy. Generally well tolerated."
    ),
    "Pine Pollen": (
        "Pollen from pine trees marketed as a natural source of phytoandrogens. Androgenic "
        "content is real but very low -- standard doses are unlikely to meaningfully raise "
        "hormone levels. Rich in vitamins, minerals, and antioxidants. More plausible as a "
        "nutritional supplement than a testosterone booster."
    ),
    "Pyruvate": (
        "Glycolysis intermediate supplemented for fat loss and exercise performance. "
        "Some studies show modest body composition improvements with exercise. Doses used "
        "in studies (25-45 g/day) commonly cause GI distress. Practical benefits relative "
        "to cost and side effects are questionable."
    ),
    "Shilajit": (
        "Resinous substance from Himalayan rocks formed from decomposed organic matter. "
        "Rich in fulvic acid, humic acid, and trace minerals. Used for energy, testosterone "
        "support, and mitochondrial function (via CoQ10 enhancement). High risk of heavy "
        "metal contamination -- third-party testing is essential. Some clinical evidence "
        "for testosterone and exercise performance."
    ),
    "Sodium Butyrate": (
        "Salt of butyric acid, a short-chain fatty acid produced by gut bacteria from dietary "
        "fiber. Directly feeds colonocytes (colon cells), promotes gut barrier integrity, and "
        "has anti-inflammatory effects. Used for IBS, IBD, leaky gut, and colon health. "
        "Similar effects to the ketone body beta-hydroxybutyrate. Has a notably unpleasant smell."
    ),
    "Succinate": (
        "Salt of succinic acid, a Krebs cycle intermediate involved in mitochondrial energy "
        "production. Used for energy support and anti-aging, particularly in Russian supplement "
        "traditions. Limited standalone clinical evidence. Found naturally in many foods. "
        "Generally considered safe at typical doses."
    ),
    "CLA": (
        "Conjugated linoleic acid naturally found in grass-fed dairy and meat, used for "
        "modest fat reduction and lean mass preservation. Effects in humans are statistically "
        "significant but small in scale. May reduce insulin sensitivity at high doses. "
        "Better results are typically seen when combined with diet and exercise."
    ),
    "SEA (Stearoylethanolamide)": (
        "Endocannabinoid-related lipid molecule that activates PPAR-alpha receptors and "
        "modulates the endocannabinoid system without directly binding CB1/CB2 receptors. "
        "Used for inflammation, mood, and sleep regulation. Related to PEA but with distinct "
        "receptor activity. Evidence is primarily preclinical with growing interest in "
        "human applications."
    ),
    "PEA (Phenylethylamine)": (
        "Endogenous trace amine with stimulant and mood-elevating effects via dopamine and "
        "norepinephrine release. Very short half-life (~10 minutes orally) unless combined "
        "with an MAO-B inhibitor like hordenine. Popular in pre-workout and mood supplements. "
        "Can cause rapid heart rate and anxiety at higher doses."
    ),
    "Xylitol": (
        "Sugar alcohol used as a sugar substitute that does not significantly raise blood "
        "glucose. Has well-established dental benefits by inhibiting Streptococcus mutans, "
        "the bacteria responsible for cavities. Common in sugar-free gum and oral care "
        "products. Causes GI distress in larger amounts. Extremely toxic to dogs."
    ),
    "Apple Cider Vinegar": (
        "Fermented apple juice containing acetic acid, used for blood sugar blunting, "
        "weight management, and digestion. Evidence is mostly from small short-term trials. "
        "Must be diluted before ingestion -- undiluted ACV can damage tooth enamel "
        "and the esophagus. The acetic acid is the primary active component."
    ),
    "Baking Soda": (
        "Sodium bicarbonate used as an antacid for heartburn and as an ergogenic aid for "
        "high-intensity exercise by buffering lactic acid in the blood. Well-established "
        "evidence for performance in anaerobic efforts. GI distress (bloating, nausea) is "
        "common at the doses needed for performance benefits (0.3 g/kg)."
    ),
    "Vinegar": (
        "Dilute acetic acid with mild blood sugar-blunting effects when consumed before "
        "carbohydrate-rich meals. The same core mechanism as apple cider vinegar. Very safe "
        "when diluted. Also used as a food preservative with a long history of culinary "
        "and household use."
    ),
    # ── Alkaloids ────────────────────────────────────────────────────────────
    "10-Methoxy-Harmalan": (
        "Beta-carboline alkaloid related to harmaline and harmine, found in certain plants. "
        "Acts as a reversible MAO inhibitor with psychedelic and neurological activity. "
        "Very limited human safety data. Of interest in neuroscience research for "
        "Parkinson's disease. Carries significant risks including serotonin syndrome if "
        "combined with serotonergic drugs."
    ),
    # ── Serotonin Modulators ──────────────────────────────────────────────────
    "Lisuride": (
        "Semi-synthetic ergot alkaloid with dopamine agonist and serotonin antagonist "
        "properties. Approved in some countries for Parkinson's disease and migraine "
        "prevention. Carries significant cardiovascular and fibrotic risks associated with "
        "ergot compounds. Requires careful medical supervision and monitoring."
    ),
    "Metergoline": (
        "Semi-synthetic ergot compound and broad serotonin receptor antagonist used in "
        "research settings to study serotonin's behavioral role. Investigated for prolactin "
        "lowering and cluster headaches. Not a mainstream supplement -- limited safety and "
        "efficacy data outside research contexts."
    ),
    # ── Herbal Supplements ────────────────────────────────────────────────────
    "Pau D'Arco": (
        "Bark of the Tabebuia tree used in South American traditional medicine for antifungal, "
        "antimicrobial, and anti-inflammatory effects. The active compound lapachol has shown "
        "activity against candida and bacteria in lab studies. Evidence is primarily preclinical. "
        "High doses can cause nausea and anticoagulant effects."
    ),
}


class Command(BaseCommand):
    help = "Populate supplement descriptions for all known supplements."

    def handle(self, *args, **kwargs):
        updated = 0
        skipped = 0
        not_found = []

        for name, description in DESCRIPTIONS.items():
            count = Supplement.objects.filter(name=name).update(description=description)
            if count:
                updated += count
            else:
                not_found.append(name)

        self.stdout.write(self.style.SUCCESS(f"Done. Updated {updated} supplement(s)."))
        if not_found:
            self.stdout.write(
                self.style.WARNING(
                    f"{len(not_found)} names had no DB match: {not_found}"
                )
            )
