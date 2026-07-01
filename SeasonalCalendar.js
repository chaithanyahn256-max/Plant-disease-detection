// src/screens/SeasonalCalendar/SeasonalCalendar.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Select,
  Icon,
  Button,
  Divider,
  useToast,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaSeedling,
  FaSun,
  FaSnowflake,
  FaLeaf,
  FaFlask,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';

// Static planting data for all months (same as before)
const plantingData = {
  January: {
    vegetables: ['Cabbage', 'Kale', 'Lettuce', 'Onions', 'Peas'],
    flowers: ['Pansies', 'Snapdragons', 'Sweet Peas'],
    herbs: ['Cilantro', 'Parsley', 'Chives'],
    icon: FaSnowflake,
    tip: 'Start seeds indoors for cool-season crops. Protect tender plants from frost.',
  },
  February: {
    vegetables: ['Broccoli', 'Cauliflower', 'Spinach', 'Radishes'],
    flowers: ['Petunias', 'Marigolds', 'Dianthus'],
    herbs: ['Dill', 'Mint', 'Oregano'],
    icon: FaSnowflake,
    tip: 'Prune fruit trees. Start tomato and pepper seeds indoors.',
  },
  March: {
    vegetables: ['Carrots', 'Beets', 'Potatoes', 'Lettuce', 'Kale'],
    flowers: ['Sunflowers', 'Zinnias', 'Cosmos'],
    herbs: ['Basil', 'Thyme', 'Sage'],
    icon: FaLeaf,
    tip: 'Direct sow peas, spinach, and radishes. Prepare garden beds.',
  },
  April: {
    vegetables: ['Tomatoes', 'Peppers', 'Cucumbers', 'Beans', 'Corn'],
    flowers: ['Marigolds', 'Petunias', 'Impatiens'],
    herbs: ['Basil', 'Rosemary', 'Cilantro'],
    icon: FaLeaf,
    tip: 'Plant warm-season crops after last frost. Harden off seedlings.',
  },
  May: {
    vegetables: ['Tomatoes', 'Peppers', 'Eggplant', 'Squash', 'Melons'],
    flowers: ['Roses', 'Dahlias', 'Lilies'],
    herbs: ['Basil', 'Oregano', 'Thyme'],
    icon: FaSun,
    tip: 'Mulch to retain moisture. Watch for pests.',
  },
  June: {
    vegetables: ['Beans', 'Corn', 'Cucumbers', 'Okra', 'Peppers'],
    flowers: ['Lavender', 'Echinacea', 'Black-eyed Susans'],
    herbs: ['Basil', 'Mint', 'Sage'],
    icon: FaSun,
    tip: 'Water deeply in the morning. Harvest regularly.',
  },
  July: {
    vegetables: ['Beans', 'Summer Squash', 'Cucumbers', 'Okra'],
    flowers: ['Zinnias', 'Cosmos', 'Sunflowers'],
    herbs: ['Basil', 'Oregano', 'Parsley'],
    icon: FaSun,
    tip: 'Provide afternoon shade in hot climates. Keep soil moist.',
  },
  August: {
    vegetables: ['Kale', 'Lettuce', 'Spinach', 'Radishes', 'Turnips'],
    flowers: ['Asters', 'Chrysanthemums', 'Sedum'],
    herbs: ['Cilantro', 'Dill', 'Parsley'],
    icon: FaLeaf,
    tip: 'Start fall crops. Order spring-flowering bulbs.',
  },
  September: {
    vegetables: ['Broccoli', 'Cabbage', 'Cauliflower', 'Garlic', 'Onions'],
    flowers: ['Pansies', 'Violas', 'Ornamental Kale'],
    herbs: ['Chives', 'Parsley', 'Sage'],
    icon: FaLeaf,
    tip: 'Plant garlic and cover crops. Clean up garden debris.',
  },
  October: {
    vegetables: ['Garlic', 'Onions', 'Spinach', 'Lettuce'],
    flowers: ['Pansies', 'Snapdragons', 'Sweet Peas'],
    herbs: ['Cilantro', 'Parsley', 'Chives'],
    icon: FaSnowflake,
    tip: 'Protect tender plants from early frost. Rake leaves.',
  },
  November: {
    vegetables: ['Garlic', 'Onions', 'Cover Crops'],
    flowers: ['Pansies', 'Violas'],
    herbs: ['Chives', 'Parsley'],
    icon: FaSnowflake,
    tip: 'Mulch perennial beds. Store leftover seeds in a cool, dry place.',
  },
  December: {
    vegetables: ['Garlic', 'Onions', 'Cover Crops'],
    flowers: ['Pansies', 'Violas'],
    herbs: ['Chives', 'Parsley'],
    icon: FaSnowflake,
    tip: 'Plan next year’s garden. Order seed catalogs.',
  },
};

// Plant details database (static)
const plantDetails = {
  // Vegetables
  'Cabbage': { sun: 'Full sun', water: 'Moderate', spacing: '12-24"', sow: 'Indoors', companions: ['Onions', 'Potatoes'] },
  'Kale': { sun: 'Full sun to part shade', water: 'Moderate', spacing: '12-18"', sow: 'Direct', companions: ['Beets', 'Celery'] },
  'Lettuce': { sun: 'Part shade', water: 'Moderate', spacing: '8-12"', sow: 'Direct', companions: ['Carrots', 'Radishes'] },
  'Onions': { sun: 'Full sun', water: 'Moderate', spacing: '4-6"', sow: 'Indoors', companions: ['Beets', 'Lettuce'] },
  'Peas': { sun: 'Full sun', water: 'Moderate', spacing: '2-4"', sow: 'Direct', companions: ['Carrots', 'Radishes'] },
  'Broccoli': { sun: 'Full sun', water: 'Moderate', spacing: '18-24"', sow: 'Indoors', companions: ['Onions', 'Potatoes'] },
  'Cauliflower': { sun: 'Full sun', water: 'Moderate', spacing: '18-24"', sow: 'Indoors', companions: ['Beans', 'Celery'] },
  'Spinach': { sun: 'Part shade', water: 'Moderate', spacing: '4-6"', sow: 'Direct', companions: ['Strawberries'] },
  'Radishes': { sun: 'Full sun', water: 'Moderate', spacing: '2-4"', sow: 'Direct', companions: ['Carrots', 'Lettuce'] },
  'Carrots': { sun: 'Full sun', water: 'Moderate', spacing: '2-4"', sow: 'Direct', companions: ['Onions', 'Peas'] },
  'Beets': { sun: 'Full sun', water: 'Moderate', spacing: '3-4"', sow: 'Direct', companions: ['Onions', 'Lettuce'] },
  'Potatoes': { sun: 'Full sun', water: 'Moderate', spacing: '12-15"', sow: 'Direct', companions: ['Beans', 'Cabbage'] },
  'Tomatoes': { sun: 'Full sun', water: 'Moderate', spacing: '24-36"', sow: 'Indoors', companions: ['Basil', 'Onions'] },
  'Peppers': { sun: 'Full sun', water: 'Moderate', spacing: '18-24"', sow: 'Indoors', companions: ['Basil', 'Carrots'] },
  'Cucumbers': { sun: 'Full sun', water: 'High', spacing: '36-60"', sow: 'Direct', companions: ['Beans', 'Corn'] },
  'Beans': { sun: 'Full sun', water: 'Moderate', spacing: '4-6"', sow: 'Direct', companions: ['Corn', 'Carrots'] },
  'Corn': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Direct', companions: ['Beans', 'Squash'] },
  'Eggplant': { sun: 'Full sun', water: 'Moderate', spacing: '18-24"', sow: 'Indoors', companions: ['Peppers', 'Beans'] },
  'Squash': { sun: 'Full sun', water: 'Moderate', spacing: '36-48"', sow: 'Direct', companions: ['Corn', 'Beans'] },
  'Melons': { sun: 'Full sun', water: 'Moderate', spacing: '36-48"', sow: 'Direct', companions: ['Corn', 'Radishes'] },
  'Okra': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Direct', companions: ['Peppers', 'Eggplant'] },
  'Turnips': { sun: 'Full sun', water: 'Moderate', spacing: '4-6"', sow: 'Direct', companions: ['Peas', 'Beans'] },
  'Garlic': { sun: 'Full sun', water: 'Low', spacing: '4-6"', sow: 'Direct', companions: ['Tomatoes', 'Peppers'] },
  // Flowers
  'Pansies': { sun: 'Part shade', water: 'Moderate', spacing: '6-9"', sow: 'Indoors', companions: [] },
  'Snapdragons': { sun: 'Full sun', water: 'Moderate', spacing: '6-9"', sow: 'Indoors', companions: [] },
  'Sweet Peas': { sun: 'Full sun', water: 'Moderate', spacing: '6-8"', sow: 'Direct', companions: [] },
  'Petunias': { sun: 'Full sun', water: 'Moderate', spacing: '10-12"', sow: 'Indoors', companions: [] },
  'Marigolds': { sun: 'Full sun', water: 'Moderate', spacing: '8-10"', sow: 'Direct', companions: [] },
  'Dianthus': { sun: 'Full sun', water: 'Moderate', spacing: '6-8"', sow: 'Indoors', companions: [] },
  'Sunflowers': { sun: 'Full sun', water: 'Low', spacing: '12-24"', sow: 'Direct', companions: [] },
  'Zinnias': { sun: 'Full sun', water: 'Moderate', spacing: '6-12"', sow: 'Direct', companions: [] },
  'Cosmos': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Direct', companions: [] },
  'Roses': { sun: 'Full sun', water: 'Moderate', spacing: '24-36"', sow: 'Indoors', companions: [] },
  'Dahlias': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Lilies': { sun: 'Full sun to part shade', water: 'Moderate', spacing: '8-12"', sow: 'Indoors', companions: [] },
  'Lavender': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Echinacea': { sun: 'Full sun', water: 'Low', spacing: '18-24"', sow: 'Indoors', companions: [] },
  'Black-eyed Susans': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Direct', companions: [] },
  'Asters': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Chrysanthemums': { sun: 'Full sun', water: 'Moderate', spacing: '18-24"', sow: 'Indoors', companions: [] },
  'Sedum': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Violas': { sun: 'Part shade', water: 'Moderate', spacing: '6-8"', sow: 'Indoors', companions: [] },
  'Ornamental Kale': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Indoors', companions: [] },
  // Herbs
  'Cilantro': { sun: 'Full sun', water: 'Moderate', spacing: '6-8"', sow: 'Direct', companions: [] },
  'Parsley': { sun: 'Full sun to part shade', water: 'Moderate', spacing: '8-10"', sow: 'Indoors', companions: [] },
  'Chives': { sun: 'Full sun', water: 'Moderate', spacing: '6-8"', sow: 'Indoors', companions: [] },
  'Dill': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Direct', companions: [] },
  'Mint': { sun: 'Part shade', water: 'Moderate', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Oregano': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Basil': { sun: 'Full sun', water: 'Moderate', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Thyme': { sun: 'Full sun', water: 'Low', spacing: '12-18"', sow: 'Indoors', companions: [] },
  'Sage': { sun: 'Full sun', water: 'Low', spacing: '18-24"', sow: 'Indoors', companions: [] },
  'Rosemary': { sun: 'Full sun', water: 'Low', spacing: '24-36"', sow: 'Indoors', companions: [] },
};

const months = Object.keys(plantingData);

// Background and glass styles
const backgroundStyle = {
  backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/038/498/179/small_2x/ai-generated-vibrant-green-plant-leaves-free-photo.jpeg")',
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

const SeasonalCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return months.includes(currentMonth) ? currentMonth : 'March';
  });
  const [selectedPlant, setSelectedPlant] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('plantFavorites');
    return saved ? JSON.parse(saved) : [];
  });
  const toast = useToast();

  const data = plantingData[selectedMonth];

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('plantFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const openPlantDetails = (plantName) => {
    setSelectedPlant(plantName);
    onOpen();
  };

  const toggleFavorite = (plantName) => {
    if (favorites.includes(plantName)) {
      setFavorites(favorites.filter(f => f !== plantName));
      toast({
        title: 'Removed from favorites',
        status: 'info',
        duration: 1500,
      });
    } else {
      setFavorites([...favorites, plantName]);
      toast({
        title: 'Added to favorites',
        status: 'success',
        duration: 1500,
      });
    }
  };

  const getSowIcon = (sow) => {
    return sow === 'Indoors' ? '🏠' : '🌱';
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />
      <Container maxW="7xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          {/* Header */}
          <HStack justify="space-between" mb={6} flexWrap="wrap" gap={4}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <Icon as={FaSeedling} boxSize={8} mr={3} color="green.300" />
              Seasonal Planting Calendar
            </Heading>
            <HStack>
              {favorites.length > 0 && (
                <Tooltip label={`${favorites.length} favorite plants`}>
                  <Button
                    leftIcon={<FaHeart />}
                    variant="outline"
                    onClick={() => {
                      // Show a simple alert with favorites (could be a modal later)
                      alert('Your favorite plants:\n' + favorites.join('\n'));
                    }}
                    bg="rgba(255,255,255,0.1)"
                    color="white"
                    border="1px solid rgba(255,255,255,0.3)"
                  >
                    Favorites ({favorites.length})
                  </Button>
                </Tooltip>
              )}
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                width="200px"
                bg="rgba(255,255,255,0.1)"
                border="1px solid rgba(255,255,255,0.3)"
                color="white"
                _hover={{ borderColor: 'whiteAlpha.400' }}
                borderRadius="lg"
              >
                {months.map(month => (
                  <option key={month} value={month} style={{ background: '#2d3748' }}>
                    {month}
                  </option>
                ))}
              </Select>
            </HStack>
          </HStack>

          {/* Month Icon and Tip */}
          <Box textAlign="center" mb={8}>
            <Icon as={data.icon} boxSize={16} color="green.300" />
            <Heading size="2xl" mt={2} color="white">{selectedMonth}</Heading>
            <Text fontSize="lg" color="whiteAlpha.800" maxW="2xl" mx="auto" mt={2}>
              {data.tip}
            </Text>
          </Box>

          {/* Three Categories */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={8}>
            {/* Vegetables */}
            <Box p={6} bg="rgba(255,255,255,0.05)" borderRadius="xl" border="1px solid rgba(255,255,255,0.1)">
              <HStack mb={4}>
                <Icon as={FaLeaf} boxSize={6} color="green.300" />
                <Heading size="md" color="white">🥕 Vegetables</Heading>
              </HStack>
              <VStack align="stretch" spacing={3}>
                {data.vegetables.map(item => (
                  <HStack key={item} justify="space-between">
                    <Badge
                      colorScheme="green"
                      p={2}
                      borderRadius="md"
                      fontSize="sm"
                      textTransform="uppercase"
                      width="full"
                      cursor="pointer"
                      onClick={() => openPlantDetails(item)}
                      _hover={{ opacity: 0.8 }}
                    >
                      {item}
                    </Badge>
                    <IconButton
                      icon={favorites.includes(item) ? <FaHeart color="red" /> : <FaRegHeart />}
                      size="xs"
                      variant="ghost"
                      colorScheme={favorites.includes(item) ? 'red' : 'whiteAlpha'}
                      onClick={() => toggleFavorite(item)}
                      aria-label="Favorite"
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Flowers */}
            <Box p={6} bg="rgba(255,255,255,0.05)" borderRadius="xl" border="1px solid rgba(255,255,255,0.1)">
              <HStack mb={4}>
                <Icon as={FaSun} boxSize={6} color="pink.300" />
                <Heading size="md" color="white">🌸 Flowers</Heading>
              </HStack>
              <VStack align="stretch" spacing={3}>
                {data.flowers.map(item => (
                  <HStack key={item} justify="space-between">
                    <Badge
                      colorScheme="pink"
                      p={2}
                      borderRadius="md"
                      fontSize="sm"
                      textTransform="uppercase"
                      width="full"
                      cursor="pointer"
                      onClick={() => openPlantDetails(item)}
                      _hover={{ opacity: 0.8 }}
                    >
                      {item}
                    </Badge>
                    <IconButton
                      icon={favorites.includes(item) ? <FaHeart color="red" /> : <FaRegHeart />}
                      size="xs"
                      variant="ghost"
                      colorScheme={favorites.includes(item) ? 'red' : 'whiteAlpha'}
                      onClick={() => toggleFavorite(item)}
                      aria-label="Favorite"
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Herbs */}
            <Box p={6} bg="rgba(255,255,255,0.05)" borderRadius="xl" border="1px solid rgba(255,255,255,0.1)">
              <HStack mb={4}>
                <Icon as={FaFlask} boxSize={6} color="purple.300" />
                <Heading size="md" color="white">🌿 Herbs</Heading>
              </HStack>
              <VStack align="stretch" spacing={3}>
                {data.herbs.map(item => (
                  <HStack key={item} justify="space-between">
                    <Badge
                      colorScheme="purple"
                      p={2}
                      borderRadius="md"
                      fontSize="sm"
                      textTransform="uppercase"
                      width="full"
                      cursor="pointer"
                      onClick={() => openPlantDetails(item)}
                      _hover={{ opacity: 0.8 }}
                    >
                      {item}
                    </Badge>
                    <IconButton
                      icon={favorites.includes(item) ? <FaHeart color="red" /> : <FaRegHeart />}
                      size="xs"
                      variant="ghost"
                      colorScheme={favorites.includes(item) ? 'red' : 'whiteAlpha'}
                      onClick={() => toggleFavorite(item)}
                      aria-label="Favorite"
                    />
                  </HStack>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>

          {/* Legend */}
          <Divider borderColor="rgba(255,255,255,0.2)" mb={6} />
          <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="lg">
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Text color="whiteAlpha.800">
                <Icon as={FaSun} mr={1} color="yellow.300" /> Full sun: 6+ hours
              </Text>
              <Text color="whiteAlpha.800">
                <Icon as={FaLeaf} mr={1} color="green.300" /> Part shade: 3-6 hours
              </Text>
              <Text color="whiteAlpha.800">
                <Icon as={FaSnowflake} mr={1} color="blue.300" /> Frost tolerant
              </Text>
              <Text color="whiteAlpha.800">
                <Icon as={FaSeedling} mr={1} color="orange.300" /> Click any plant for details
              </Text>
            </HStack>
          </Box>
        </Box>
      </Container>

      {/* Plant Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>{selectedPlant}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlant && plantDetails[selectedPlant] ? (
              <VStack align="start" spacing={3}>
                <HStack>
                  <Text fontWeight="bold">Sun:</Text>
                  <Badge colorScheme="yellow">{plantDetails[selectedPlant].sun}</Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Water:</Text>
                  <Badge colorScheme="blue">{plantDetails[selectedPlant].water}</Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Spacing:</Text>
                  <Badge colorScheme="purple">{plantDetails[selectedPlant].spacing}</Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Sow:</Text>
                  <Badge colorScheme="green">{plantDetails[selectedPlant].sow} {getSowIcon(plantDetails[selectedPlant].sow)}</Badge>
                </HStack>
                <Box>
                  <Text fontWeight="bold">Companions:</Text>
                  <HStack mt={1} flexWrap="wrap">
                    {plantDetails[selectedPlant].companions.length > 0 ? (
                      plantDetails[selectedPlant].companions.map(comp => (
                        <Badge key={comp} colorScheme="green" mr={1} mb={1}>{comp}</Badge>
                      ))
                    ) : (
                      <Text fontSize="sm" color="gray.400">None</Text>
                    )}
                  </HStack>
                </Box>
              </VStack>
            ) : (
              <Text>No detailed information available for this plant.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SeasonalCalendar;