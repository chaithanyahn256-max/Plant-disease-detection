// src/screens/HomeRemedies/HomeRemedies.js
import React from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Image,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
} from '@chakra-ui/react';

const backgroundStyle = {
  backgroundImage: 'url("https://thumbs.dreamstime.com/b/tree-hands-nurturing-seedlings-growth-tree-hands-nurturing-growth-seedlings-304209380.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0'
};

// Expanded remedies data
const remedies = [
  {
    disease: 'Early Blight (Tomato/Potato)',
    symptoms: 'Dark spots with concentric rings on lower leaves, yellowing, defoliation.',
    remedy: 'Mix 1 tbsp baking soda, 1 tbsp vegetable oil, and a few drops of liquid soap in 1 gallon of water. Spray weekly, especially after rain.',
    image: 'https://apps.lucidcentral.org/ppp_v9/images/entities/tomato_early_blight_211/potatoaltkc.jpg'
  },
  {
    disease: 'Late Blight (Tomato/Potato)',
    symptoms: 'Water-soaked lesions, white fungal growth on undersides, rapid plant death.',
    remedy: 'Use copper fungicide or a mixture of 1 part milk to 2 parts water. Apply every 5-7 days. Remove infected plants immediately.',
    image: 'https://www.rootsimple.com/wp-content/uploads/2014/01/Symptom_potato_late_blight.jpg'
  },
  {
    disease: 'Powdery Mildew',
    symptoms: 'White powdery spots on leaves, stems, and fruit; leaves curl and yellow.',
    remedy: 'Mix 2 tbsp apple cider vinegar with 1 gallon water. Spray every 3-4 days. Alternatively, use neem oil or sulfur powder.',
    image: 'https://img.freepik.com/premium-photo/powdery-mildew-apples-apple-tree-caused-by-fungus-podosphaera-leucotricha-apple-powdery-mildew-apple-disease_996086-4401.jpg?w=1380'
  },
  {
    disease: 'Downy Mildew',
    symptoms: 'Yellow angular spots on upper leaf surface, purple-gray mold on undersides.',
    remedy: 'Apply a mixture of 1 tsp baking soda, 1 tsp vegetable oil, and a few drops of soap in 1 quart water. Spray weekly.',
    image: 'https://www.planetnatural.com/wp-content/uploads/2012/12/downy-mildew-disease-920x518.jpg'
  },
  {
    disease: 'Aphids',
    symptoms: 'Clusters of small insects on new growth, sticky honeydew, sooty mold.',
    remedy: 'Spray with neem oil solution (2 tsp neem oil, 1 tsp mild soap, 1 liter water). Introduce ladybugs or use strong water spray.',
    image: 'https://a-z-animals.com/media/2022/07/aphids.jpg'
  },
  {
    disease: 'Spider Mites',
    symptoms: 'Tiny yellow or white stippling on leaves, fine webbing, leaf drop.',
    remedy: 'Mix 1 tbsp rubbing alcohol with 1 cup water and a few drops of soap. Spray undersides. Increase humidity.',
    image: 'https://gardeningsg.nparks.gov.sg/images/Biodiversity/spidermites%20(1)_plantscienceandhealth_nparks.jpg'
  },
  {
    disease: 'Whiteflies',
    symptoms: 'Tiny white insects flying when disturbed, yellowing leaves, sticky residue.',
    remedy: 'Use yellow sticky traps. Spray with insecticidal soap or neem oil every 3-4 days.',
    image: 'https://bioprotectionportal.com/wp-content/uploads/2024/05/112682_01.jpg'
  },
  {
    disease: 'Leaf Miners',
    symptoms: 'Serpentine tunnels or blotches on leaves, visible larvae inside.',
    remedy: 'Remove affected leaves. Spray with neem oil to deter egg laying. Use beneficial insects like parasitic wasps.',
    image: 'https://morningchores.com/wp-content/uploads/2023/07/shutterstock_2327151625.jpg'
  },
  {
    disease: 'Rust (Corn, Beans, etc.)',
    symptoms: 'Raised reddish-brown pustules on leaves, yellowing, defoliation.',
    remedy: 'Apply sulfur powder or neem oil. Remove and destroy infected leaves. Improve air circulation.',
    image: 'https://lgpress.clemson.edu/wp-content/uploads/sites/3/2022/06/corn-leaf-with-southern-rust-pustules-.jpeg'
  },
  {
    disease: 'Bacterial Leaf Spot',
    symptoms: 'Water-soaked spots that turn brown/black with yellow halos, leaf drop.',
    remedy: 'Copper fungicide or a mixture of 1 part hydrogen peroxide to 9 parts water. Remove infected leaves.',
    image: 'https://www.thedailygarden.us/uploads/4/5/4/9/45493619/hibiscus-bacterial-leaf-spot-caused-by-pseudomonas-cichorii-5684575818_orig.jpg'
  },
  {
    disease: 'Fusarium Wilt',
    symptoms: 'Yellowing, wilting, stunting, vascular browning.',
    remedy: 'No cure; remove infected plants. Solarize soil. Plant resistant varieties.',
    image: 'https://vegcropshotline.org/wp-content/uploads/2023/03/IMG_3471-768x1024.jpg'
  },
  {
    disease: 'Verticillium Wilt',
    symptoms: 'V-shaped yellow lesions on leaf margins, wilting, vascular discoloration.',
    remedy: 'Remove infected plants. Rotate crops. Use resistant rootstocks.',
    image: 'https://bpb-us-w2.wpmucdn.com/u.osu.edu/dist/8/3691/files/2014/05/bacterialSpeck03510339f27656b-1scmgh1-300x225.jpg'
  },
  {
    disease: 'Anthracnose',
    symptoms: 'Dark sunken lesions on leaves, stems, and fruit; leaf spots with pink spores.',
    remedy: 'Apply copper fungicide or sulfur. Remove and destroy infected plant parts. Improve air circulation.',
    image: 'https://img1.wsimg.com/isteam/ip/e034f413-0517-4616-9881-6e201835f717/Anthracnose-UPLOAD.jpg'
  },
  {
    disease: 'Cercospora Leaf Spot',
    symptoms: 'Circular gray/brown spots with reddish borders, yellow halos.',
    remedy: 'Neem oil or copper fungicide. Remove infected leaves. Avoid overhead watering.',
    image: 'https://veggiescout.mgcafe.uky.edu/sites/veggiescout.ca.uky.edu/files/inline-images/27_Seethapathy%2C%20Bugwood_0.jpg'
  },
  {
    disease: 'Septoria Leaf Spot',
    symptoms: 'Small circular spots with dark edges and light centers, tiny black dots in center.',
    remedy: 'Remove lower infected leaves. Apply copper fungicide or baking soda spray. Mulch to prevent soil splash.',
    image: 'https://bpb-us-e1.wpmucdn.com/blogs.cornell.edu/dist/8/5755/files/2021/02/septoria_tom_seedlings1x1200.jpg'
  },
  {
    disease: 'Gray Mold (Botrytis)',
    symptoms: 'Gray fuzzy mold on flowers, leaves, and fruit; water-soaked spots.',
    remedy: 'Improve air circulation. Remove infected parts. Apply neem oil or sulfur.',
    image: 'https://vegcropshotline.org/wp-content/uploads/2020/05/IMG_2066.jpg'
  }
];

const HomeRemedies = () => {
  return (
    <div style={backgroundStyle}>
      <Container maxW="7xl" py={8}>
        <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8}>
          <Heading as="h1" size="xl" mb={4}>🌿 Home Remedies for Plant Diseases</Heading>
          <Text mb={8} color="gray.600" fontSize="lg">
            Natural and organic treatments to keep your plants healthy. Click each disease for symptoms and detailed instructions.
          </Text>
          
          <Accordion allowToggle>
            {remedies.map((item, idx) => (
              <AccordionItem key={idx} border="none" mb={4}>
                <AccordionButton
                  bg="green.50"
                  _expanded={{ bg: 'green.100' }}
                  borderRadius="md"
                  p={4}
                >
                  <HStack flex="1" spacing={4}>
                    <Image
                      src={item.image}
                      alt={item.disease}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    <Box textAlign="left">
                      <Heading size="md">{item.disease}</Heading>
                      <Text fontSize="sm" color="gray.600">{item.symptoms.substring(0, 60)}...</Text>
                    </Box>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4} bg="white" borderRadius="md" mt={1}>
                  <VStack align="start" spacing={3}>
                    <Badge colorScheme="red">Symptoms</Badge>
                    <Text>{item.symptoms}</Text>
                    <Badge colorScheme="green">Remedy</Badge>
                    <Text>{item.remedy}</Text>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Container>
    </div>
  );
};

export default HomeRemedies;