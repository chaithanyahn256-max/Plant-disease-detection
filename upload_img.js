import React, { useState, useContext} from 'react'; // remove useEffect if not used
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
  Card,
  Badge as BootstrapBadge,   // rename Bootstrap's Badge
  ProgressBar,
} from 'react-bootstrap';
import { HStack, Text, Badge as ChakraBadge } from '@chakra-ui/react'; // rename Chakra's Badge
import UserContext from '../../context/UserContext';

// Complete disease information for all 38 classes with treatment field
const diseaseInfo = {
  // ==================== APPLE (4 classes) ====================
  'Apple___Apple_scab': {
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    treatment: 'Apply fungicides containing myclobutanil, captan, or sulfur every 7-14 days from bud break through June. Rake and destroy fallen leaves in autumn.',
    info: `**Apple Scab** is one of the most common and serious diseases of apples and crabapples.

**Symptoms:** Spots start on the undersides of leaves as small, irregular light brown to olive green lesions. As infection progresses, they become circular and velvety olive green, eventually turning dark brown to black. Infected leaf tissue thickens, causing the upper surface to bulge upward. Leaves may curl and scorch at margins. On fruit, lesions appear as nearly circular, velvety dark green spots that become black, scabby, and cracked over time.

**Disease Cycle:** Infections occur during moist conditions (rain, dew, or constant irrigation). Temperature affects severity - in cool weather, plants must remain wet longer than in warm weather for infection to occur. The battle against scab is won or lost during late April through early June (from bud break to fruit set).

**Management:** Keep plants vigorous and avoid stressing trees. Remove and destroy infected leaves, flowers, and fruit promptly. Grow resistant varieties when possible. If using fungicides, apply from bud break through fruit set during rainy weather with thorough coverage. Most fungicides work preventatively, not curatively. [Source: Illinois Extension]`
  },

  'Apple___Black_rot': {
    name: 'Apple Black Rot',
    scientificName: 'Diplodia seriata',
    treatment: 'Prune out dead or cankered branches. Remove mummified fruit. Apply copper-based fungicides during dormancy and myclobutanil or captan during the growing season.',
    info: `**Black Rot** is a fungal disease that occurs mainly as fruit rot in the pre-harvest period, especially problematic in organically managed crops.

**Symptoms:** First infections may become visible from early June. Leaf spots appear as "frog eyes" near infested shoots or fruit mummies. On fruit, black necrotic spots form that later grow to pinhead size and develop a red edge. From August onward, brown rot can develop from these primary infections. Some varieties are especially at risk, including Gerlinde, Elstar, Dalinbel, Natyra, Ingrid Marie, and Wellant.

**Disease Cycle:** The causal agent overwinters on fruit mummies remaining on trees. Infections are favored by high temperatures (20-26°C/68-79°F) and prolonged rain events. Heavy rainfall causes spores to wash out of fruit mummies, infecting young fruit through lenticels.

**Management:** Consistently pick out fruit mummies by hand before sprouting (February/March). Choose robust varieties. This practice also reduces storage rot pathogens Neofabraea alba and N. perennans. [Source: BIOFRUITNET Practice Abstract]`
  },

  'Apple___Cedar_apple_rust': {
    name: 'Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniperi-virginianae',
    treatment: 'Remove nearby cedar trees or galls. Apply myclobutanil, propiconazole, or triadimefon every 7-10 days from pink bud through spring rains.',
    info: `**Cedar Apple Rust** has a complex two-year life cycle requiring two different host plants to complete.

**Life Cycle:** In spring, bright orange gelatinous galls appear on cedar trees (juniper species). Cedar needles become infected between June and September by spores from apple trees. The following summer, small green galls form on cedar trees and grow until the next spring when they mature into brown balls (approximately 2 inches in diameter). After spending nearly 2 years on cedar trees, spores from the orange goo can travel up to 3 miles to land on damp apple leaves or fruit, forming lesions. While cedar trees aren't negatively impacted, fruit trees can be killed after several years of severe infection.

**Management:** Remove all nearby host plants if possible. Remove visible galls from cedar trees as they grow and mature. Apply fungicide to apple trees starting at bloom and continue every 7 days until spore release from cedars stops. Spray cedar trees from June to September on 7-14 day intervals. Effective chemicals include triforine, propiconazole, myclobutanil, and triadimefon. [Source: K-State Research and Extension]`
  },

  'Apple___healthy': {
    name: 'Healthy Apple',
    treatment: 'No treatment needed. Continue regular monitoring and good cultural practices.',
    info: `**Healthy Apple Leaf** - No disease detected.

This sample shows no signs of apple disease. Continue regular monitoring and maintain good orchard sanitation practices. Healthy apple leaves should appear uniformly green with no spots, lesions, or deformities.`
  },

  // ==================== BLUEBERRY (1 class) ====================
  'Blueberry___healthy': {
    name: 'Healthy Blueberry',
    treatment: 'No treatment needed. Maintain proper soil pH (4.5-5.5) and monitor for mummy berry or Botrytis.',
    info: `**Healthy Blueberry** - No disease detected.

Blueberry (Vaccinium spp.) plants should have vibrant green leaves with no discoloration, spots, or powdery residues. Regular monitoring includes checking for common issues like mummy berry, Botrytis blight, or Phomopsis twig blight. Maintain proper soil pH (4.5-5.5) and good air circulation. [Source: NCBI Plant Names Database]`
  },

  // ==================== CHERRY (2 classes) ====================
  'Cherry___healthy': {
    name: 'Healthy Cherry',
    treatment: 'No treatment needed. Monitor for cherry leaf spot and brown rot.',
    info: `**Healthy Cherry** - No disease detected.

Cherry trees (Prunus avium or Prunus cerasus) with healthy foliage show uniform green leaves without spots, curling, or powdery growth. Regular monitoring helps detect early signs of cherry leaf spot, brown rot, or bacterial canker.`
  },

  'Cherry___Powdery_mildew': {
    name: 'Cherry Powdery Mildew',
    scientificName: 'Podosphaera clandestina',
    treatment: 'Apply sulfur, myclobutanil, or trifloxystrobin at shuck fall and 2-3 weeks later. Improve air circulation through pruning.',
    info: `**Cherry Powdery Mildew** is a fungal disease affecting both sweet and sour cherries.

**Symptoms and Signs:** Characterized by superficial white, weblike growth on leaves, shoots, and fruit. Infections can be severe during years of low rainfall, high humidity, and warm temperatures (70-80°F/21-27°C). The disease is particularly severe on new growth like shoots of inner scaffolds, and can infect fruit causing direct crop loss.

**Disease Cycle:** The fungus overwinters in buds on twigs and as chasmothecia (spore-containing structures) on bark. Secondary spores produced in spring spread to new growth. In warm, humid coastal areas, powdery mildew can also be severe after harvest.

**Management:** To protect fruit, spray soon after petal fall and again 2-3 weeks later if needed. Treat immediately if mildew is found on leaves or shoots of inner scaffolds. Do not use the same fungicide or those with similar chemistry more than twice per year to prevent resistance. Select fungicides active against brown rot and Botrytis as well. Effective options include sulfur, myclobutanil, trifloxystrobin, and other FRAC group 3 and 11 fungicides. [Source: UC IPM]`
  },

  // ==================== CORN / MAIZE (4 classes) ====================
  'Corn___Cercospora_leaf_spot Gray_leaf_spot': {
    name: 'Gray Leaf Spot',
    scientificName: 'Cercospora zeae-maydis',
    treatment: 'Plant resistant hybrids. Rotate crops. Apply fungicides (pyraclostrobin, azoxystrobin) at tasseling if disease appears before silking.',
    info: `**Gray Leaf Spot** is one of the most destructive foliar diseases of corn in the U.S.

**Symptoms:** Lesions appear two to three weeks prior to tasseling as narrow, long, rectangular (up to 2 inches) lesions that are light tan, typically delineated by the leaf veins. Two different Cercospora species can cause identical symptoms, though they differ in culture growth.

**Management:** Genetic resistance is the preferred control method, often governed by quantitative trait loci (QTL) across the corn genome. Crop rotation reduces inoculum present at season start. Tillage helps break down infected corn residue. If considering fungicides, scout fields before application and consider factors like hybrid susceptibility, disease history, and weather conditions. [Source: USDA ARS, Michigan State University Extension]`
  },

  'Corn___Common_rust': {
    name: 'Common Rust',
    scientificName: 'Puccinia sorghi',
    treatment: 'Resistant hybrids are widely available. Fungicides rarely needed; if severe, apply azoxystrobin or pyraclostrobin at tasseling.',
    info: `**Common Rust** is a fungal disease affecting corn that typically does not reach economic threshold levels.

**Symptoms:** Raised brick-red pustules appear on leaf surfaces, often in bands. Pustules contain spores that spread to neighboring plants.

**Disease Cycle:** The rust fungi require living hosts to survive. Urediniospores overwinter on corn in southern U.S., then are carried long distances by wind to reach the Midwest. Pustules typically appear in late June and are favored by high humidity and moderate temperatures (60-80°F/16-27°C).

**Management:** Most corn hybrids are fairly resistant, so selecting for resistance is typically not necessary. Crop rotation does not influence common rust as it does not survive on residue. Fungicide applications may be warranted if disease severity is high and conditions favorable, with greatest yield response when applied between tasseling (VT) and pollination (R1). [Source: University of Florida IFAS, Michigan State University Extension]`
  },

  'Corn___healthy': {
    name: 'Healthy Corn',
    treatment: 'No treatment needed. Continue scouting, especially during tasseling and grain fill.',
    info: `**Healthy Corn** - No disease detected.

Corn (Zea mays) plants showing no signs of foliar disease. Healthy plants should have uniform green leaves without lesions, pustules, or discoloration. Continue regular scouting, especially during tasseling and grain fill periods when disease pressure is highest. [Source: NCBI Plant Names Database]`
  },

  'Corn___Northern_Leaf_Blight': {
    name: 'Northern Corn Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    treatment: 'Use resistant hybrids. Rotate crops. Apply fungicides (azoxystrobin, propiconazole) between tasseling and milk stage if lesions appear before tassel.',
    info: `**Northern Corn Leaf Blight** is a primary foliar disease concern in many corn-growing regions.

**Symptoms:** Distinctive cigar-shaped lesions form on leaves, starting light green but developing into tan or gray lesions (1-6 inches long) that taper at both ends. Lesions typically appear in the lower canopy and progress upward under favorable conditions.

**Disease Cycle:** The fungal pathogen survives on residue, so minimum tillage and corn-on-corn rotations face greatest risk. Spores are splashed onto foliage or deposited by wind. Favorable conditions include long periods of leaf wetness with moderate temperatures.

**Management:** Crop rotation significantly reduces inoculum. Tillage helps break down corn residue. Select resistant hybrids (check seed company ratings). If using susceptible hybrid and lesions appear before tasseling with favorable weather forecast, consider foliar fungicides applied between tasseling and milk stages. Research shows most consistent yield response occurs when corn is treated between vegetative tassel (VT) and pollination (R1). [Source: Michigan State University Extension, University of Florida IFAS]`
  },

  // ==================== GRAPE (4 classes) ====================
  'Grape___Black_rot': {
    name: 'Grape Black Rot',
    scientificName: 'Guignardia bidwellii',
    treatment: 'Apply myclobutanil, captan, or mancozeb from pre-bloom through 4-5 weeks after bloom. Remove mummified berries.',
    info: `**Grape Black Rot** is a common fungal disease affecting grapevines.

**Resistance Development:** Research from Cornell University indicates that berries become highly resistant to infection by about 5 weeks after bloom for Concord grapes, and 7 weeks for wine grapes (Vitis vinifera).

**Management Timing:** Black rot sprays can usually end after the second postbloom application IF the disease has been well-managed up to that point. Continue protection until late July if fruit rot is present.

**Chemical Options:** Effective fungicides include tebuconazole products, myclobutanil, trifloxystrobin, azoxystrobin, pyraclostrobin, and boscalid. Note that some products may cause injury to certain grape varieties (e.g., Revus Top and Inspire Super should not be used on Concord grapes). [Source: Cornell University]`
  },

  'Grape___Esca_(Black_Measles)': {
    name: 'Grape Esca (Black Measles)',
    scientificName: 'Complex of several fungi including Phaeoacremonium and Phaeomoniella species',
    treatment: 'No curative treatment. Prune out infected wood during dry weather. Avoid large pruning wounds. Maintain vine vigor.',
    info: `**Esca** (also known as Black Measles) is a complex fungal disease affecting grapevines worldwide.

**Symptoms:** External symptoms include tiger-stripe patterns on leaves - chlorotic areas between veins that dry and become necrotic. Berries may develop purple-brown spots (black measles) and fail to ripen properly. Internal symptoms include black spots in wood when cut cross-sectionally.

**Disease Cycle:** Caused by several wood-rotting fungi that enter through pruning wounds. The disease develops slowly over several years.

**Management:** Primarily cultural - avoid large pruning wounds, prune during dry weather, remove infected wood, and maintain vine vigor. No highly effective fungicide treatments exist once vines are infected. Prevention through proper vineyard sanitation is key.`
  },

  'Grape___healthy': {
    name: 'Healthy Grape',
    treatment: 'No treatment needed. Maintain good canopy management and monitor for common diseases.',
    info: `**Healthy Grape** - No disease detected.

Grapevines (Vitis spp.) showing healthy foliage without spots, discoloration, or fungal growth. Maintain good air circulation through proper pruning and trellising. Monitor regularly for early signs of powdery mildew, downy mildew, or black rot.`
  },

  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    name: 'Grape Leaf Blight (Isariopsis Leaf Spot)',
    scientificName: 'Pseudocercospora vitis',
    treatment: 'Apply protectant fungicides (mancozeb, captan) during wet periods. Prune to improve air circulation.',
    info: `**Grape Leaf Blight** is a fungal disease affecting grape foliage.

**Symptoms:** Leaf spots that can coalesce and cause significant defoliation in severe cases. The disease reduces photosynthetic capacity and can affect fruit quality.

**Management:** Similar to other grape fungal diseases - maintain good air circulation through proper canopy management, remove infected leaves, and apply protectant fungicides during wet periods if disease pressure is high.`
  },

  // ==================== ORANGE / CITRUS (1 class) ====================
  'Orange___Haunglongbing_(Citrus_greening)': {
    name: 'Citrus Greening (Huanglongbing)',
    scientificName: 'Candidatus Liberibacter spp.',
    treatment: 'No cure. Remove infected trees. Control Asian citrus psyllids with insecticides. Plant tolerant varieties.',
    info: `**Citrus Greening** (Huanglongbing or HLB) is one of the most serious citrus diseases worldwide, significantly impacting production.

**Impact:** The disease reduces yields and increases production costs. Florida's citrus industry continues struggling with disease pressure, compounded by environmental stressors like hurricanes. It has devastated citrus production in affected regions.

**Symptoms:** Blotchy mottling of leaves, yellow shoots, reduced fruit size, lopsided fruit with bitter taste, and premature fruit drop.

**Transmission:** Spread by Asian citrus psyllids (Diaphorina citri), small insects that feed on citrus leaves and stems.

**Management:** Current approaches include planting HLB-tolerant cultivars and enhancing tree nutrition practices. University of Florida/IFAS Extension provides research-based strategies to help growers mitigate the disease. Work with local extension agents for region-specific recommendations. No cure exists, so prevention and management are critical. [Source: UF/IFAS Extension]`
  },

  // ==================== PEACH (2 classes) ====================
  'Peach___Bacterial_spot': {
    name: 'Peach Bacterial Spot',
    scientificName: 'Xanthomonas arboricola pv. pruni',
    treatment: 'Apply copper-based bactericides during dormancy and early season. Plant resistant varieties. Avoid overhead irrigation.',
    info: `**Peach Bacterial Spot** is a serious bacterial disease affecting stone fruits.

**Symptoms:** Small, angular spots on leaves that may drop out leaving "shot-hole" appearance. Fruit lesions appear as small, dark spots that may crack, making fruit unmarketable. Twigs can develop cankers that serve as overwintering sites.

**Favorable Conditions:** Warm, wet springs with wind-driven rain spread bacteria. The disease is worse in sandy soils and areas with poor air circulation.

**Management:** Plant resistant varieties when available. Copper-based sprays during dormancy and early season can help reduce bacterial populations. Avoid overhead irrigation. Maintain proper nutrition and tree vigor.`
  },

  'Peach___healthy': {
    name: 'Healthy Peach',
    treatment: 'No treatment needed. Monitor for common issues like leaf curl and brown rot.',
    info: `**Healthy Peach** - No disease detected.

Peach trees (Prunus persica) showing healthy foliage without spots, curling, or bacterial lesions. Continue monitoring for common issues like peach leaf curl, brown rot, and bacterial spot. Maintain good orchard sanitation and proper pruning for air circulation.`
  },

  // ==================== BELL PEPPER (2 classes) ====================
  'Pepper,_bell___Bacterial_spot': {
    name: 'Bell Pepper Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    treatment: 'Use disease-free seed. Apply copper + mancozeb. Rotate crops. Avoid overhead irrigation.',
    info: `**Bell Pepper Bacterial Spot** is a destructive disease affecting peppers in warm, humid conditions.

**Symptoms:** Small, water-soaked spots on leaves that turn brown and necrotic with yellow halos. Severe infection causes defoliation. Fruit spots are raised, scabby lesions that reduce marketability.

**Disease Cycle:** Bacteria survive on infected plant debris and seeds. Spread by splashing water, wind-driven rain, and workers moving through wet fields. Enters through natural openings or wounds.

**Management:** Use disease-free seed and resistant varieties. Practice crop rotation (2-3 years). Avoid overhead irrigation and working in wet fields. Copper sprays can provide suppression but resistance is common. Fixed copper with mancozeb improves control.`
  },

  'Pepper,_bell___healthy': {
    name: 'Healthy Bell Pepper',
    treatment: 'No treatment needed. Maintain proper spacing and rotate crops.',
    info: `**Healthy Bell Pepper** - No disease detected.

Bell pepper plants (Capsicum annuum) showing healthy green foliage without spots or lesions. Maintain proper spacing for air circulation, avoid overhead irrigation, and rotate crops to prevent soil-borne diseases. Regular scouting helps detect early signs of bacterial spot or Phytophthora.`
  },

  // ==================== POTATO (3 classes) ====================
  'Potato___Early_blight': {
    name: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    treatment: 'Apply chlorothalonil, mancozeb, or azoxystrobin preventatively. Rotate crops. Maintain fertility.',
    info: `**Potato Early Blight** is a common fungal disease affecting potatoes and tomatoes.

**Symptoms:** Dark brown to black lesions with concentric rings (target spot appearance) on lower leaves first. Lesions are usually 1/4 to 1/2 inch in diameter with yellow halos. Severe infection causes leaf yellowing and defoliation, reducing tuber size.

**Disease Cycle:** Fungus survives on infected plant debris and alternative hosts. Spores are produced under moderate temperatures (60-80°F/15-27°C) with alternating wet/dry periods. Disease progresses upward as plants mature and stress increases.

**Management:** Use resistant varieties when available. Rotate crops (2-3 years away from solanaceous crops). Maintain adequate fertility, especially nitrogen. Apply fungicides preventatively when conditions favor disease. Avoid overhead irrigation. Destroy crop residues after harvest.`
  },

  'Potato___healthy': {
    name: 'Healthy Potato',
    treatment: 'No treatment needed. Monitor for early and late blight.',
    info: `**Healthy Potato** - No disease detected.

Potato plants (Solanum tuberosum) showing healthy foliage without lesions, discoloration, or wilt. Continue monitoring for early blight, late blight, and other common potato diseases. Maintain proper fertility and irrigation, and rotate crops to reduce pathogen buildup. [Source: NCBI Plant Names Database]`
  },

  'Potato___Late_blight': {
    name: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    treatment: 'Apply protectant fungicides (chlorothalonil, mancozeb) before infection. Use systemic fungicides (mefenoxam, cymoxanil) if detected. Destroy infected plants immediately.',
    info: `**Potato Late Blight** is an aggressive and destructive disease, historically responsible for the Irish Potato Famine.

**Symptoms:** Irregular, water-soaked lesions on leaves that expand rapidly, often with pale green to yellow-green halos. Under cool, moist conditions, white fungal growth appears on lesion undersides. Stems develop brown lesions that can girdle and kill plants. Tubers develop reddish-brown granular rot that extends from surface inward.

**Disease Cycle:** This pathogen is aggressive and fast-acting, requiring immediate management attention. It thrives in cool (60-70°F/15-21°C), wet conditions with high humidity. Spores are produced abundantly and can spread rapidly through fields.

**Management:** Use certified disease-free seed potatoes. Apply protectant fungicides preventatively when conditions favor disease. Scout fields regularly, especially during favorable weather. Destroy volunteer potatoes and cull piles. For active infections, use targeted systemic fungicides with different modes of action to prevent resistance. Immediate action is critical as this disease can destroy fields within days. [Source: Vegetable Growers News]`
  },

  // ==================== RASPBERRY (1 class) ====================
  'Raspberry___healthy': {
    name: 'Healthy Raspberry',
    treatment: 'No treatment needed. Maintain good air circulation through pruning.',
    info: `**Healthy Raspberry** - No disease detected.

Raspberry plants (Rubus spp.) showing healthy foliage without spots, discoloration, or fungal growth. Maintain good air circulation through proper pruning and trellising. Monitor for common issues like cane blight, spur blight, or anthracnose.`
  },

  // ==================== SOYBEAN (1 class) ====================
  'Soybean___healthy': {
    name: 'Healthy Soybean',
    treatment: 'No treatment needed. Continue scouting for foliar diseases.',
    info: `**Healthy Soybean** - No disease detected.

Soybean (Glycine max) plants with healthy green foliage showing no signs of foliar diseases. Continue monitoring for common issues like frogeye leaf spot, Septoria brown spot, or rust. Maintain proper rotation and select resistant varieties when available. [Source: NCBI Plant Names Database]`
  },

  // ==================== SQUASH (1 class) ====================
  'Squash___Powdery_mildew': {
    name: 'Squash Powdery Mildew',
    scientificName: 'Podosphaera xanthii (most common)',
    treatment: 'Apply sulfur, potassium bicarbonate, or myclobutanil at first sign. Use resistant varieties. Improve air circulation.',
    info: `**Squash Powdery Mildew** is the most common fungal disease affecting cucurbits (squash, pumpkin, cucumber, melons).

**Symptoms:** White, powdery spots on upper leaf surfaces, stems, and sometimes fruit. Spots expand and coalesce, eventually covering entire leaves which yellow and die. Severe infection reduces photosynthesis, fruit yield, and quality.

**Disease Cycle:** The fungus thrives in warm days, cool nights, and high humidity. Unlike many fungal diseases, it does not require free water on leaves for infection. Spores are spread by wind and can travel long distances.

**Management:** Plant resistant varieties when available. Apply protectant fungicides (sulfur, potassium bicarbonate) preventatively. Use targeted fungicides (FRAC groups 3, 7, 11) with rotation to prevent resistance. Improve air circulation through proper spacing. Remove infected plant debris. [Source: NCBI Plant Names Database]`
  },

  // ==================== STRAWBERRY (2 classes) ====================
  'Strawberry___healthy': {
    name: 'Healthy Strawberry',
    treatment: 'No treatment needed. Monitor for common diseases.',
    info: `**Healthy Strawberry** - No disease detected.

Strawberry plants (Fragaria × ananassa) showing healthy green foliage without spots, discoloration, or powdery growth. Maintain good air circulation through proper spacing and plasticulture systems. Monitor for common issues like angular leaf spot, anthracnose, or powdery mildew.`
  },

  'Strawberry___Leaf_scorch': {
    name: 'Strawberry Leaf Scorch',
    scientificName: 'Diplocarpon earlianum',
    treatment: 'Remove infected leaves. Apply protectant fungicides (captan, thiram) during wet periods. Renovate beds after harvest.',
    info: `**Strawberry Leaf Scorch** is a common fungal disease affecting strawberry foliage.

**Symptoms:** Small, irregular purple spots on upper leaf surfaces that enlarge and merge, causing leaves to appear scorched or burned. Spots may also occur on petioles, runners, and fruit calyxes. Severely affected leaves turn brown, curl upward, and die.

**Disease Cycle:** Fungus overwinters on infected leaves and debris. Spores are produced in spring and spread by splashing water. Disease is favored by prolonged leaf wetness and moderate temperatures.

**Management:** Use disease-free plants. Remove and destroy infected leaves. Improve air circulation through proper spacing. Apply protectant fungicides preventatively if disease pressure is high. Maintain proper fertility to reduce plant stress.`
  },

  // ==================== TOMATO (10 classes) ====================
  'Tomato___Bacterial_spot': {
    name: 'Tomato Bacterial Spot',
    scientificName: 'Xanthomonas spp. (complex of four species)',
    treatment: 'Use disease-free seed. Apply copper + mancozeb. Rotate crops. Avoid overhead irrigation.',
    info: `**Tomato Bacterial Spot** is a destructive bacterial disease in warm, humid environments.

**Symptoms:** Small, water-soaked spots on leaves that turn brown to black with yellow halos. Spots may coalesce causing leaf blighting and defoliation. Fruit spots are small, raised, scabby lesions that reduce marketability. Spots on green fruit are surrounded by green halos, on ripe fruit by yellow halos.

**Disease Cycle:** Bacteria survive on infected plant debris, seeds, and volunteer plants. Spread by splashing water, wind-driven rain, and workers moving through wet fields. Enters through natural openings or wounds. Favored by warm temperatures (75-90°F/24-32°C) and high humidity.

**Management:** Use disease-free seed and resistant varieties. Hot water treat seeds (122°F/50°C for 25 minutes). Practice 2-3 year crop rotation. Avoid overhead irrigation and working in wet fields. Copper sprays can provide suppression but resistance is common. Fixed copper with mancozeb improves control.`
  },

  'Tomato___Early_blight': {
    name: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    treatment: 'Apply chlorothalonil, mancozeb, or azoxystrobin every 7-10 days. Mulch to reduce soil splash. Stake plants.',
    info: `**Tomato Early Blight** is a common fungal disease affecting tomatoes, potatoes, and other solanaceous crops.

**Symptoms:** Dark brown to black lesions with concentric rings (target spot appearance) on lower leaves first. Lesions typically reach 1/4 to 1/2 inch in diameter with yellow halos. As disease progresses, leaves yellow and drop, starting from bottom of plant. Stem lesions are dark, slightly sunken, and may girdle plants. Fruit lesions appear near stem attachment as dark, leathery, sunken spots with concentric rings.

**Disease Cycle:** Fungus survives on infected plant debris, wild solanaceous hosts, and seeds. Spores produced under moderate temperatures (60-80°F/15-27°C) with alternating wet/dry periods. Disease progresses upward as plants mature and fruit load increases stress.

**Management:** Use resistant varieties when available. Rotate crops (2-3 years away from solanaceous crops). Mulch to reduce soil splash. Maintain adequate fertility. Stake plants for better air circulation. Apply fungicides preventatively when conditions favor disease. Remove and destroy infected plant material.`
  },

  'Tomato___healthy': {
    name: 'Healthy Tomato',
    treatment: 'No treatment needed. Monitor for common issues like blight and bacterial spot.',
    info: `**Healthy Tomato** - No disease detected.

Tomato plants (Solanum lycopersicum) showing healthy green foliage without spots, lesions, or discoloration. Continue monitoring for common issues like early blight, late blight, Septoria leaf spot, and bacterial spot. Maintain proper fertility, consistent irrigation, and good air circulation through staking or caging. [Source: NCBI Plant Names Database]`
  },

  'Tomato___Late_blight': {
    name: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    treatment: 'Apply chlorothalonil, mancozeb, or copper preventatively. Use mefenoxam or cymoxanil if detected. Destroy infected plants.',
    info: `**Tomato Late Blight** is an aggressive and destructive disease affecting tomatoes and potatoes, caused by the same pathogen responsible for the Irish Potato Famine.

**Symptoms:** Irregular, water-soaked lesions on leaves that expand rapidly, often with pale green to yellow-green halos. Under cool, moist conditions, white fuzzy growth appears on lesion undersides. Petioles and stems develop brown lesions that can girdle and kill plants. Fruit develop large, greasy-looking, brown lesions that quickly rot entire fruit.

**Disease Cycle:** This pathogen is aggressive and fast-acting, requiring immediate attention. Thrives in cool (60-70°F/15-21°C), wet conditions with high humidity. Spores produced abundantly can spread rapidly through fields and travel miles in wind. Disease can destroy fields within days under favorable conditions.

**Management:** Use certified disease-free transplants. Apply protectant fungicides preventatively when conditions favor disease. Scout fields at least twice weekly during favorable weather. For organic production, copper-based products provide some suppression but must be applied before infection. Destroy volunteer tomatoes and potatoes. If detected, immediately apply targeted fungicides with different modes of action. Report suspected outbreaks to local Extension immediately. [Source: Vegetable Growers News]`
  },

  'Tomato___Leaf_Mold': {
    name: 'Tomato Leaf Mold',
    scientificName: 'Passalora fulva (formerly Fulvia fulva)',
    treatment: 'Reduce humidity. Apply chlorothalonil, copper, or myclobutanil. Use resistant varieties.',
    info: `**Tomato Leaf Mold** is a fungal disease primarily affecting greenhouse tomatoes and sometimes field-grown in humid conditions.

**Symptoms:** Pale green to yellowish spots on upper leaf surfaces with corresponding olive-green to grayish-purple velvety mold on undersides. Spots enlarge and coalesce, causing leaves to yellow, curl, and eventually die. In severe cases, flowers, stems, and fruit may be affected. Fruit infection appears as dark, leathery, sunken areas at stem end.

**Disease Cycle:** Fungus survives on infected plant debris and in soil. Spores produced in the velvety growth are easily spread by air currents, splashing water, and workers. Disease favored by high humidity (above 85%) and moderate temperatures (70-80°F/21-27°C). Poor air circulation greatly increases severity.

**Management:** Reduce humidity through ventilation, heating, and avoiding overhead irrigation. Space plants for good air circulation. Use resistant varieties (genes Cf-2, Cf-5, Cf-9). Remove and destroy infected leaves. Apply protectant fungicides if needed. In greenhouses, maintain night temperatures above 65°F/18°C to reduce humidity.`
  },

  'Tomato___Septoria_leaf_spot': {
    name: 'Tomato Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    treatment: 'Apply chlorothalonil, mancozeb, or copper fungicides. Mulch and stake plants. Rotate crops.',
    info: `**Septoria Leaf Spot** is one of the most common and destructive foliar diseases of tomatoes.

**Symptoms:** Small, circular spots with dark brown edges and light gray centers appear on lower leaves first. Characteristic feature: tiny black dots (pycnidia, the fungal fruiting bodies) develop in the center of spots - visible with a hand lens. Severe infection causes leaves to yellow, wither, and drop, starting from bottom of plant. Fruit rarely infected directly, but defoliation exposes fruit to sunscald.

**Disease Cycle:** Fungus survives on infected tomato debris, wild solanaceous plants, and some weed hosts. Spores are produced in pycnidia and spread by splashing rain, irrigation water, and workers moving through wet foliage. Disease favored by moderate temperatures (60-80°F/15-27°C) and prolonged leaf wetness. Can spread rapidly in warm, wet weather.

**Management:** Rotate crops (2-3 years away from tomatoes and related crops). Mulch to reduce soil splash. Stake or cage plants for better air circulation and faster leaf drying. Remove lower infected leaves early in season. Apply fungicides preventatively when conditions favor disease. Destroy crop debris thoroughly after harvest. Avoid working with plants when foliage is wet.`
  },

  'Tomato___Spider_mites Two-spotted_spider_mite': {
    name: 'Two-Spotted Spider Mite',
    scientificName: 'Tetranychus urticae',
    treatment: 'Use miticides (abamectin, bifenthrin) or insecticidal soap. Release predatory mites. Maintain adequate irrigation.',
    info: `**Two-Spotted Spider Mites** are tiny arachnids that cause significant damage to tomatoes and many other crops.

**Symptoms:** Fine stippling (tiny yellow or white spots) on upper leaf surfaces caused by mites piercing cells and feeding on contents. As feeding continues, leaves take on bronzed or silvery appearance. Fine webbing may be visible on undersides of leaves and between stems, especially in severe infestations. Severe feeding causes leaf yellowing, drying, and drop. Plants become stressed, reducing yield and fruit quality.

**Life Cycle:** Mites thrive in hot, dry conditions (optimum 85-95°F/29-35°C, low humidity). Populations explode under these conditions, completing life cycle in as little as 5-7 days. Overwinter as adults in protected areas.

**Management:** Monitor regularly, especially undersides of leaves using hand lens. Knock mites off plants with strong water spray. Maintain adequate irrigation to reduce plant stress. Avoid broad-spectrum insecticides that kill natural predators. Use miticides when threshold reached, rotating between different mode of action groups to prevent resistance. Predatory mites (Phytoseiulus persimilis) can provide biological control in greenhouse and field.`
  },

  'Tomato___Target_Spot': {
    name: 'Tomato Target Spot',
    scientificName: 'Corynespora cassiicola',
    treatment: 'Apply chlorothalonil, mancozeb, or azoxystrobin. Improve air circulation. Rotate crops.',
    info: `**Tomato Target Spot** is a fungal disease causing distinctive concentric ring patterns on leaves and fruit.

**Symptoms:** On leaves, small brown spots expand into circular lesions with concentric rings (target-like appearance). Spots may coalesce causing leaf blighting. On fruit, small water-soaked spots enlarge into sunken lesions with concentric rings, making fruit unmarketable. Symptoms similar to early blight but usually more numerous spots with finer concentric rings.

**Disease Cycle:** Fungus survives on infected plant debris and in soil. Spores produced on lesions spread by wind, splashing water, and workers. Disease favored by warm temperatures (75-85°F/24-29°C) and high humidity. Can be severe in both field and greenhouse.

**Management:** Use disease-free seed and transplants. Rotate crops (avoid solanaceous and cucurbit hosts). Improve air circulation through proper spacing and staking. Avoid overhead irrigation. Apply protectant fungicides preventatively when conditions favor disease. Remove and destroy infected plant material.`
  },

  'Tomato___Tomato_mosaic_virus': {
    name: 'Tomato Mosaic Virus (ToMV)',
    scientificName: 'Tobamovirus',
    treatment: 'No cure. Use resistant varieties. Disinfect tools and hands. Remove infected plants.',
    info: `**Tomato Mosaic Virus** is a highly contagious viral disease affecting tomatoes worldwide, closely related to Tobacco Mosaic Virus (TMV).

**Symptoms:** Light and dark green mottling (mosaic pattern) on leaves, often with distorted or fern-like leaf growth. Leaves may be narrowed and puckered. Plants may be stunted with reduced fruit set. Fruit may show internal browning (brown wall) and external yellow blotches or necrotic spots. Symptoms vary with plant age, variety, temperature, and virus strain.

**Transmission:** Extremely stable virus can survive for years in dried plant material, on tools, clothing, and in soil. Transmitted mechanically through handling, tools, and contact between plants. Not transmitted by insects. Can survive in tobacco products (cigarettes, chewing tobacco) - workers smoking can contaminate plants.

**Management:** Use resistant varieties (Tm-1, Tm-2, Tm-2² genes). Start with certified virus-free seed. Wash hands thoroughly with milk or soap before handling plants. Disinfect tools, stakes, and greenhouse surfaces with 10% bleach solution or commercial disinfectants. Remove and destroy infected plants immediately. Do not smoke near plants. Practice strict sanitation. No chemical controls available.`
  },

  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    name: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificName: 'Begomovirus',
    treatment: 'No cure. Use resistant varieties. Control whiteflies with insecticides and reflective mulches.',
    info: `**Tomato Yellow Leaf Curl Virus** is one of the most devastating viral diseases of tomatoes worldwide, transmitted exclusively by whiteflies.

**Symptoms:** Upward curling of leaf margins, cupping, and yellowing (chlorosis) of leaf edges and between veins. Plants are severely stunted with shortened internodes. Flowers often drop, and fruit set is greatly reduced. Fruit that does develop may be smaller than normal. Symptoms appear 2-3 weeks after infection.

**Transmission:** Spread by silverleaf whitefly (Bemisia tabaci) in a persistent manner - once a whitefly acquires the virus, it remains capable of transmission for life. Not transmitted mechanically or through seed. Whiteflies acquire virus by feeding on infected plants, then transmit to healthy plants when feeding.

**Management:** Use resistant varieties (Ty-1, Ty-2, Ty-3 genes) - the most effective control. Manage whitefly populations through reflective mulches, yellow sticky traps, and appropriate insecticides. Start with clean transplants. Use floating row covers to exclude whiteflies early season. Remove infected plants promptly. Practice region-wide management as whiteflies move easily between fields. Roguing infected plants and controlling whiteflies in surrounding areas is essential.`
  }
};

function UploadImg() {
  const { addScan, user } = useContext(UserContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const getSeverity = (diseaseName) => {
    const low = ['healthy', 'scab', 'spot', 'mildew'];  // less severe
    const medium = ['blight', 'rust', 'mold', 'canker'];
    const high = ['late blight', 'wilt', 'virus', 'rot', 'yellow leaf curl'];

    const name = diseaseName.toLowerCase();
    if (high.some(keyword => name.includes(keyword))) return { level: 'High', color: 'red' };
    if (medium.some(keyword => name.includes(keyword))) return { level: 'Medium', color: 'orange' };
    if (low.some(keyword => name.includes(keyword))) return { level: 'Low', color: 'green' };
    return { level: 'Unknown', color: 'gray' };
 };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setPrediction('');
    setConfidence(null);
    setError('');
    setShowInfo(false);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };


  const handleApply = async () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setShowInfo(false);

    const formData = new FormData();
    formData.append('image', selectedImage);
    
    // Attach user_id if logged in, so backend logs it!
    if (user) {
      const uid = user.id || user.user_id;
      formData.append('user_id', uid);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.class);
      setConfidence(data.confidence);
      // ✅ Add scan to history
      const plantName = data.class.split('_')[0] || 'Unknown';
      const diseaseName = data.class.split('_')[1] || data.class;
      const scan = {
        id: Date.now(),
        plant: plantName,
        disease: diseaseName,
        date: new Date().toISOString().split('T')[0],
        confidence: data.confidence,
        image: previewUrl, // optional
      };
      addScan(scan);
      
    } catch (err) {
      console.error('Error:', err);
      setError('Prediction failed. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const getDiseaseInfo = () => {
    if (!prediction) return null;
    return diseaseInfo[prediction] || {
      name: prediction.replace(/_/g, ' '),
      treatment: 'No treatment information available.',
      info: 'No additional information available.'
    };
  };

  const disease = getDiseaseInfo();
  const severity = disease ? getSeverity(disease.name) : { level: '', color: '' };

  const backgroundStyle = {
    backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/040/754/426/non_2x/ai-generated-growing-five-seedlings-on-green-backdrop-free-photo.jpg")',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh',
    padding: '20px 0'
  };

  const overlayStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
  };

  return (
    <div style={backgroundStyle}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div style={overlayStyle}>
              <h2 className="text-center mb-4">🌿 Plant Disease Check</h2>

              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Choose image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              {previewUrl && (
                <div className="text-center mb-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div className="d-grid gap-2 mb-4">
                <Button variant="primary" onClick={handleApply} disabled={!selectedImage || loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : 'Apply'}
                </Button>
                <Form.Text className="text-muted text-center">
                  Powered by our trained CNN model with 95% accuracy
                </Form.Text>
              </div>

              <Alert variant="info" className="mt-3">
                <small>
                  Feel Free to use the provided images for your project. Note: MixedNet has provided a pre-trained model that can be used as a starting point for your research.
                </small>
              </Alert>

              {error && <Alert variant="danger">{error}</Alert>}

              {prediction && disease && (
                <>
                  <Alert variant="success" className="mt-3">
                    <h4>Prediction: {disease.name}</h4>
                    <p>
                      Confidence: {(confidence * 100).toFixed(2)}%{' '}
                      <BootstrapBadge bg={confidence > 0.8 ? 'success' : confidence > 0.5 ? 'warning' : 'danger'}>
                        {confidence > 0.8 ? 'High' : confidence > 0.5 ? 'Medium' : 'Low'}
                      </BootstrapBadge>
                    </p>
                    <ProgressBar
                      now={confidence * 100}
                      label={`${(confidence * 100).toFixed(0)}%`}
                      variant={confidence > 0.8 ? 'success' : confidence > 0.5 ? 'warning' : 'danger'}
                      className="mb-2"
                    />
                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="sm">Severity:</Text>
                      <ChakraBadge colorScheme={severity.color} fontSize="sm">{severity.level}</ChakraBadge>
                    </HStack>

                    {/* Treatment Section */}
                    {disease.treatment && (
                      <Card className="mt-2 mb-2 border-success">
                        <Card.Body className="p-2">
                          <Card.Text>
                            <strong>💊 Recommended Treatment:</strong> {disease.treatment}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    )}

                    <Button variant="info" onClick={() => setShowInfo(!showInfo)}>
                      {showInfo ? 'Hide Information' : 'Show Information'}
                    </Button>
                  </Alert>

                  {showInfo && (
                    <Card className="mt-3">
                      <Card.Header>
                        <h5>About {disease.name}</h5>
                        {disease.scientificName && (
                          <em className="text-muted">{disease.scientificName}</em>
                        )}
                      </Card.Header>
                      <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {disease.info.split('\n').map((paragraph, idx) => {
                          if (!paragraph.trim()) return null;
                          const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          return <p key={idx} dangerouslySetInnerHTML={{ __html: formatted }} />;
                        })}
                      </Card.Body>
                    </Card>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UploadImg;