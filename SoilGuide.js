// src/screens/SoilGuide/SoilGuide.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Flex,
  Icon,
  Divider,
  Select,
  Button,
} from '@chakra-ui/react';
import { FaLeaf, FaTint, FaSeedling, FaFlask } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const backgroundStyle = {
  backgroundImage: 'url("https://static.vecteezy.com/system/resources/previews/047/385/522/non_2x/young-green-plants-sprouting-from-the-soil-with-the-sun-s-rays-c-free-photo.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0',
  position: 'relative',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 20, 0, 0.6)',
  zIndex: 1,
};

const glassCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  color: "white",
};

const infoGlassCard = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
  color: "white",
};

const SoilGuide = () => {
  const navigate = useNavigate();
  const [selectedRange, setSelectedRange] = useState('6.1-7.0');

  const phRanges = [
    {
      range: '3.0 - 5.0',
      label: 'Extremely to Very Acid',
      color: 'red.400',
      bgGradient: 'linear(to-r, red.900, red.700)',
      description: 'Very acid soil. Most plant nutrients, particularly calcium, potassium, magnesium and copper, become more soluble and are easily washed away. Most phosphates are locked up and unavailable to plants.',
      plants: ['Blueberries', 'Rhododendrons', 'Azaleas', 'Camellias', 'Heathers', 'Potatoes', 'Pines'],
      action: 'Add lime to raise the pH to at least 5.0 for most plants. For ericaceous plants, maintain this range.',
    },
    {
      range: '5.1 - 6.0',
      label: 'Moderately Acid',
      color: 'orange.400',
      bgGradient: 'linear(to-r, orange.800, orange.600)',
      description: 'Acid soil, ideal for ericaceous (lime-hating) plants. Many nutrients become more available as pH increases toward neutral.',
      plants: ['Rhododendrons', 'Camellias', 'Heathers', 'Magnolias', 'Lupins', 'Strawberries', 'Parsley'],
      action: 'If growing lime-hating plants, maintain this range. For vegetables and lawns, consider adding lime to raise pH toward 6.5.',
    },
    {
      range: '6.1 - 7.0',
      label: 'Slightly Acid to Neutral',
      color: 'green.400',
      bgGradient: 'linear(to-r, green.800, green.600)',
      description: 'The best general purpose pH for gardens. A pH of 6.5 is considered optimal for most plants. The availability of major nutrients is at its highest and bacterial and earthworm activity is optimum.',
      plants: ['Most vegetables (tomatoes, peppers, beans)', 'Most fruits (apples, pears)', 'Roses', 'Lawns', 'Perennials'],
      action: 'No action needed for most plants. This is the ideal range for a wide variety of plants, except lime-hating species.',
    },
    {
      range: '7.1 - 8.0',
      label: 'Slightly Alkaline',
      color: 'blue.400',
      bgGradient: 'linear(to-r, blue.800, blue.600)',
      description: 'Alkaline soil. Phosphorus availability decreases. Iron and manganese become less available leading to lime-induced chlorosis (yellowing leaves). Clubroot disease of cabbage family crops is reduced.',
      plants: ['Lavender', 'Rosemary', 'Thyme', 'Oregano', 'Clematis', 'Lilac', 'Cabbage family'],
      action: 'Add sulphur, iron sulphate or other acidifying agents to reduce pH for acid-loving plants. Clay soils may require large amounts.',
    },
  ];

  const selectedPh = phRanges.find(r => r.range === selectedRange) || phRanges[2];

  const soilTypes = [
    {
      name: 'Sandy Soil',
      icon: FaTint,
      description: 'Large particles, drains quickly, warms up fast in spring, low nutrients, easy to work.',
      plants: 'Carrots, radishes, strawberries, lavender, rosemary',
      amendments: 'Add organic matter (compost, manure) to improve water retention and nutrients.',
    },
    {
      name: 'Clay Soil',
      icon: FaFlask,
      description: 'Small particles, drains slowly, nutrient-rich, heavy to work, warms slowly in spring.',
      plants: 'Cabbage, broccoli, brussels sprouts, roses, hostas',
      amendments: 'Add organic matter and gypsum to improve drainage and structure. Avoid working when wet.',
    },
    {
      name: 'Loamy Soil',
      icon: FaSeedling,
      description: 'Ideal balance of sand, silt, and clay. Good drainage, nutrient-rich, easy to work.',
      plants: 'Perfect for most plants – vegetables, fruits, flowers, shrubs',
      amendments: 'Maintain with regular organic matter additions.',
    },
    {
      name: 'Chalky Soil',
      icon: FaLeaf,
      description: 'Alkaline, often stony, free-draining, can be shallow over chalk bedrock.',
      plants: 'Lavender, rosemary, buddleia, clematis, lilac',
      amendments: 'Add organic matter regularly. Iron and manganese supplements may be needed.',
    },
  ];

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />
      
      <Container maxW="7xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <FaFlask style={{ marginRight: '12px' }} />
              Soil Type & pH Guide
            </Heading>
            <Button
              leftIcon={<FaLeaf />}
              variant="outline"
              onClick={() => navigate('/products')}
              bg="rgba(255,255,255,0.1)"
              color="white"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              Browse Products
            </Button>
          </Flex>

          <Text mb={8} color="whiteAlpha.800" fontSize="xl">
            Understanding your soil's pH and type is the foundation of successful gardening. 
            Use this guide to identify your soil and choose the right plants and amendments. 
          </Text>

          {/* pH Selector */}
          <Box style={infoGlassCard} p={6} mb={8} borderRadius="xl">
            <HStack spacing={4} wrap="wrap">
              <Text color="white" fontWeight="bold" minW="120px">Select pH Range:</Text>
              <Select
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                maxW="300px"
                bg="rgba(255,255,255,0.1)"
                border="1px solid rgba(255,255,255,0.2)"
                color="white"
                _hover={{ borderColor: 'whiteAlpha.400' }}
              >
                {phRanges.map(range => (
                  <option key={range.range} value={range.range} style={{ background: '#2d3748' }}>
                    {range.range} – {range.label}
                  </option>
                ))}
              </Select>
            </HStack>
          </Box>
          
          {/* pH Visual Scale */}
          <Box style={infoGlassCard} p={6} mb={8} borderRadius="xl">
            <Heading size="md" mb={4} color="white">pH Scale</Heading>
            <Flex justify="space-between" mb={2}>
              <Text color="red.300" fontSize="lg">Acidic</Text>
              <Text color="green.300" fontSize="lg">Neutral</Text>
              <Text color="blue.300" fontSize="lg">Alkaline</Text>
            </Flex>
            <Flex height="20px" borderRadius="full" overflow="hidden" mb={2}>
              <Box flex="3" bg="red.500" />
              <Box flex="2" bg="orange.500" />
              <Box flex="2" bg="yellow.500" />
              <Box flex="2" bg="green.500" />
              <Box flex="2" bg="teal.500" />
              <Box flex="3" bg="blue.500" />
            </Flex>
            <Flex justify="space-between" px={1}>
              <Text color="whiteAlpha.700" fontSize="xl">3.0</Text>
              <Text color="whiteAlpha.700" fontSize="xl">4.5</Text>
              <Text color="whiteAlpha.700" fontSize="xl">5.5</Text>
              <Text color="whiteAlpha.700" fontSize="xl">6.5</Text>
              <Text color="whiteAlpha.700" fontSize="xl">7.5</Text>
              <Text color="whiteAlpha.700" fontSize="xl">8.5</Text>
            </Flex>
          </Box>

          {/* Selected pH Range Details */}
          <Box style={infoGlassCard} p={6} mb={8} borderRadius="xl" bgGradient={selectedPh.bgGradient}>
            <Flex justify="space-between" align="center" mb={3}>
              <Badge colorScheme="whiteAlpha" fontSize="lg" px={3} py={1}>
                pH {selectedPh.range}
              </Badge>
              <Badge colorScheme="whiteAlpha" fontSize="lg" px={2} py={1}>
                {selectedPh.label}
              </Badge>
            </Flex>
            
            <VStack align="stretch" spacing={4}>
              <Text color="white">{selectedPh.description}</Text>
              
              <Box>
                <Text fontWeight="bold" color="white" mb={2}>🌱 Suitable Plants</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {selectedPh.plants.map(plant => (
                    <Badge key={plant} colorScheme="green" fontSize="lg" px={3} py={1} bg="rgba(255,255,255,0.2)">
                      {plant}
                    </Badge>
                  ))}
                </HStack>
              </Box>
              
              <Box>
                <Text fontWeight="bold" color="white" mb={2}>🛠️ Recommended Action</Text>
                <Text color="whiteAlpha.900">{selectedPh.action}</Text>
              </Box>
            </VStack>
          </Box>

          {/* Soil Types Grid */}
          <Heading size="md" mb={4} color="white">Soil Types & Their Characteristics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
            {soilTypes.map((soil, idx) => (
              <Box key={idx} style={infoGlassCard} p={6} borderRadius="xl">
                <HStack mb={3}>
                  <Icon as={soil.icon} boxSize={6} color="green.300" />
                  <Heading size="lg" color="white">{soil.name}</Heading>
                </HStack>
                <Text color="whiteAlpha.800" fontSize="lg" mb={3}>
                  {soil.description}
                </Text>
                <Text color="whiteAlpha.800" fontSize="lg" mb={2}>
                  <strong>Good for:</strong> {soil.plants}
                </Text>
                <Divider borderColor="rgba(255,255,255,0.2)" my={2} />
                <Text color="whiteAlpha.800" fontSize="lg">
                  <strong>Improvement:</strong> {soil.amendments}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </div>
  );
};

export default SoilGuide;