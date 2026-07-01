// src/screens/HarvestCalculator/HarvestCalculator.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Select,
  Input,
  useToast,
  Badge,
  Icon,
  Flex,
  Switch,
  FormControl,
  FormLabel,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react';
import { 
  FaSeedling, 
  FaCalendarAlt, 
  FaLeaf, 
  FaSnowflake, 
  FaPlus, 
  FaTrash,
  FaClock,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Plant data
const plantData = [
  { name: 'Tomato (Cherry)', days: 65 },
  { name: 'Tomato (Beefsteak)', days: 85 },
  { name: 'Pepper (Bell)', days: 75 },
  { name: 'Pepper (Jalapeño)', days: 70 },
  { name: 'Carrot', days: 70 },
  { name: 'Lettuce', days: 50 },
  { name: 'Spinach', days: 40 },
  { name: 'Radish', days: 25 },
  { name: 'Cucumber', days: 55 },
  { name: 'Zucchini', days: 50 },
  { name: 'Bean (Bush)', days: 55 },
  { name: 'Bean (Pole)', days: 65 },
  { name: 'Pea', days: 60 },
  { name: 'Corn', days: 75 },
  { name: 'Potato', days: 90 },
  { name: 'Strawberry', days: 90 },
  { name: 'Basil', days: 70 },
  { name: 'Sunflower', days: 85 },
];

// Background styles
const backgroundStyle = {
  backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/029/710/331/small_2x/capturing-leaf-patterns-in-botanical-portraits-generated-ai-shot-photo.jpg")',
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

const parseFrostDate = (frost) => {
  if (!frost || frost.length !== 5) return null;
  const [month, day] = frost.split('-').map(Number);
  if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { month, day };
};

const HarvestCalculator = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // Single calculator state
  const [selectedPlant, setSelectedPlant] = useState('');
  const [plantingDate, setPlantingDate] = useState('');
  const [calculatedHarvest, setCalculatedHarvest] = useState(null);
  const [daysToMaturity, setDaysToMaturity] = useState(null);

  // Frost warning state
  const [frostDate, setFrostDate] = useState(() => localStorage.getItem('frostDate') || '');
  const [enableFrostWarning, setEnableFrostWarning] = useState(() => 
    localStorage.getItem('frostWarningEnabled') ? JSON.parse(localStorage.getItem('frostWarningEnabled')) : false
  );

  // Garden plan state
  const [plantings, setPlantings] = useState(() => {
    const saved = localStorage.getItem('gardenPlan');
    return saved ? JSON.parse(saved) : [];
  });

  // Save plantings to localStorage
  useEffect(() => {
    localStorage.setItem('gardenPlan', JSON.stringify(plantings));
  }, [plantings]);

  // Save frost settings
  useEffect(() => {
    localStorage.setItem('frostDate', frostDate);
  }, [frostDate]);
  useEffect(() => {
    localStorage.setItem('frostWarningEnabled', JSON.stringify(enableFrostWarning));
  }, [enableFrostWarning]);

  // Load last used plant
  useEffect(() => {
    const saved = localStorage.getItem('lastSelectedPlant');
    if (saved) setSelectedPlant(saved);
  }, []);

  // Save last selected plant
  useEffect(() => {
    if (selectedPlant) {
      localStorage.setItem('lastSelectedPlant', selectedPlant);
      const plant = plantData.find(p => p.name === selectedPlant);
      if (plant) setDaysToMaturity(plant.days);
    }
  }, [selectedPlant]);

  const checkFrostRisk = (harvestISO) => {
    if (!enableFrostWarning || !frostDate || !harvestISO) return null;
    const frost = parseFrostDate(frostDate);
    if (!frost) return 'invalid';
    const [harvestMonth, harvestDay] = harvestISO.split('-').slice(1).map(Number);
    if (harvestMonth > frost.month) return 'danger';
    if (harvestMonth === frost.month && harvestDay > frost.day) return 'danger';
    return 'safe';
  };

  const calculateHarvest = () => {
    if (!selectedPlant) {
      toast({ title: 'Select a plant', status: 'warning', duration: 2000 });
      return;
    }
    if (!plantingDate) {
      toast({ title: 'Enter planting date', status: 'warning', duration: 2000 });
      return;
    }
    const plant = plantData.find(p => p.name === selectedPlant);
    if (!plant) return;
    const planting = new Date(plantingDate);
    planting.setDate(planting.getDate() + plant.days);
    const harvest = planting.toISOString().split('T')[0];
    setCalculatedHarvest(harvest);
    setDaysToMaturity(plant.days);
    toast({ title: 'Harvest date calculated!', status: 'success', duration: 2000 });
  };

  const addToPlan = () => {
    if (!selectedPlant || !plantingDate) {
      toast({ title: 'Select a plant and date first', status: 'warning', duration: 2000 });
      return;
    }
    const plant = plantData.find(p => p.name === selectedPlant);
    if (!plant) return;
    const planting = new Date(plantingDate);
    planting.setDate(planting.getDate() + plant.days);
    const harvest = planting.toISOString().split('T')[0];
    const newEntry = {
      id: Date.now(),
      plantName: selectedPlant,
      plantingDate,
      harvestDate: harvest,
      daysToMaturity: plant.days,
    };
    setPlantings([...plantings, newEntry]);
    toast({ title: 'Added to your garden plan', status: 'success', duration: 2000 });
  };

  const removeEntry = (id) => {
    setPlantings(plantings.filter(p => p.id !== id));
  };

  const getProgress = (entry) => {
    const today = new Date();
    const start = new Date(entry.plantingDate);
    const end = new Date(entry.harvestDate);
    if (today < start) return 0;
    if (today > end) return 100;
    const total = (end - start) / (1000 * 60 * 60 * 24);
    const elapsed = (today - start) / (1000 * 60 * 60 * 24);
    return Math.min(100, Math.round((elapsed / total) * 100));
  };

  const sortedPlantings = [...plantings].sort((a, b) => 
    new Date(a.harvestDate) - new Date(b.harvestDate)
  );

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />
      <Container maxW="7xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <Icon as={FaCalendarAlt} boxSize={8} mr={3} />
              Garden Planting Planner
            </Heading>
            <Button
              leftIcon={<FaLeaf />}
              variant="outline"
              onClick={() => navigate('/seeds')}
              bg="rgba(255,255,255,0.1)"
              color="white"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              Browse Seeds
            </Button>
          </Flex>

          <Text mb={8} color="whiteAlpha.800" fontSize="lg">
            Add crops to your plan and watch them grow on the timeline.
          </Text>

          {/* Add Crop Section */}
          <Box p={6} bg="rgba(255,255,255,0.05)" borderRadius="lg" mb={8}>
            <Heading size="md" color="white" mb={4}>Add a New Crop</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} alignItems="flex-end">
              <Box>
                <Text fontWeight="bold" color="white" mb={2}>Plant</Text>
                <Select
                  placeholder="Select plant"
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  bg="rgba(255,255,255,0.1)"
                  border="1px solid rgba(255,255,255,0.2)"
                  color="white"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                >
                  {plantData.map((plant) => (
                    <option key={plant.name} value={plant.name} style={{ background: '#2d3748' }}>
                      {plant.name} ({plant.days}d)
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <Text fontWeight="bold" color="white" mb={2}>Planting Date</Text>
                <Input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  bg="rgba(255,255,255,0.1)"
                  border="1px solid rgba(255,255,255,0.2)"
                  color="white"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                />
              </Box>
              <HStack spacing={2}>
                <Button
                  leftIcon={<FaSeedling />}
                  onClick={calculateHarvest}
                  bg="rgba(72,187,120,0.4)"
                  border="1px solid rgba(72,187,120,0.6)"
                  _hover={{ bg: 'rgba(72,187,120,0.6)' }}
                  flex="1"
                >
                  Calculate
                </Button>
                <Button
                  leftIcon={<FaPlus />}
                  onClick={addToPlan}
                  bg="rgba(255,255,255,0.1)"
                  border="1px solid rgba(255,255,255,0.3)"
                  _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  flex="1"
                >
                  Add
                </Button>
              </HStack>
            </SimpleGrid>

            {/* Single calculator result with frost risk */}
            {calculatedHarvest && daysToMaturity && (
              <Box mt={4} p={3} bg="rgba(255,255,255,0.08)" borderRadius="md">
                <HStack justify="space-between" align="center">
                  <Text color="whiteAlpha.900">
                    <strong>{selectedPlant}</strong> planted {formatDate(plantingDate)} → harvest around{' '}
                    <strong>{formatDate(calculatedHarvest)}</strong>
                  </Text>
                  {enableFrostWarning && (() => {
                    const risk = checkFrostRisk(calculatedHarvest);
                    return risk === 'danger' ? (
                      <Badge colorScheme="red">❌ Frost risk</Badge>
                    ) : risk === 'safe' ? (
                      <Badge colorScheme="green">✅ Frost safe</Badge>
                    ) : risk === 'invalid' ? (
                      <Badge colorScheme="yellow">⚠️ Invalid frost date</Badge>
                    ) : null;
                  })()}
                </HStack>
              </Box>
            )}
          </Box>

          {/* Frost Warning Toggle */}
          <Box mb={8} p={4} bg="rgba(255,255,255,0.05)" borderRadius="lg">
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="frost-warning" color="white" mb="0">
                <Icon as={FaSnowflake} color="blue.200" mr={2} />
                Frost warning
              </FormLabel>
              <Switch
                id="frost-warning"
                isChecked={enableFrostWarning}
                onChange={(e) => setEnableFrostWarning(e.target.checked)}
                colorScheme="green"
              />
            </FormControl>
            {enableFrostWarning && (
              <Input
                mt={3}
                placeholder="First frost date (MM-DD) e.g., 10-15"
                value={frostDate}
                onChange={(e) => setFrostDate(e.target.value)}
                bg="rgba(255,255,255,0.1)"
                border="1px solid rgba(255,255,255,0.2)"
                color="white"
                _placeholder={{ color: 'whiteAlpha.600' }}
                maxLength={5}
              />
            )}
          </Box>

          {/* Garden Plan Timeline */}
          <Box p={6} bg="rgba(255,255,255,0.05)" borderRadius="lg">
            <Heading size="md" color="white" mb={4} display="flex" alignItems="center">
              <Icon as={FaClock} mr={2} />
              Your Garden Timeline
            </Heading>

            {sortedPlantings.length === 0 ? (
              <Text color="whiteAlpha.700">No crops added yet. Use the form above to add your first planting.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {sortedPlantings.map((entry) => {
                  const progress = getProgress(entry);
                  const today = new Date();
                  const start = new Date(entry.plantingDate);
                  const end = new Date(entry.harvestDate);
                  const status = today > end ? 'ready' : today < start ? 'not started' : 'growing';
                  const risk = enableFrostWarning ? checkFrostRisk(entry.harvestDate) : null;

                  return (
                    <Box key={entry.id} p={4} bg="rgba(255,255,255,0.08)" borderRadius="lg">
                      <Flex justify="space-between" align="center" mb={2}>
                        <HStack>
                          <Text fontWeight="bold" color="white">{entry.plantName}</Text>
                          <Badge colorScheme={
                            status === 'ready' ? 'green' : status === 'growing' ? 'blue' : 'gray'
                          }>
                            {status === 'ready' ? 'Ready!' : status === 'growing' ? 'Growing' : 'Not started'}
                          </Badge>
                          {risk === 'danger' && <Badge colorScheme="red">❌ Frost risk</Badge>}
                          {risk === 'safe' && <Badge colorScheme="green">✅ Frost safe</Badge>}
                        </HStack>
                        <IconButton
                          icon={<FaTrash />}
                          size="sm"
                          onClick={() => removeEntry(entry.id)}
                          colorScheme="red"
                          variant="ghost"
                          aria-label="Remove"
                        />
                      </Flex>

                      <HStack spacing={4} fontSize="sm" color="whiteAlpha.800" mb={2}>
                        <Text>Planted: {formatDate(entry.plantingDate)}</Text>
                        <Text>→</Text>
                        <Text>Harvest: {formatDate(entry.harvestDate)}</Text>
                      </HStack>

                      {/* Timeline bar */}
                      <Box bg="rgba(255,255,255,0.1)" borderRadius="full" h="24px" w="100%" position="relative">
                        <Box
                          bg={status === 'ready' ? 'green.400' : 'green.200'}
                          borderRadius="full"
                          h="100%"
                          w={`${progress}%`}
                          transition="width 0.3s"
                        />
                        <Text
                          position="absolute"
                          top="2px"
                          left="50%"
                          transform="translateX(-50%)"
                          fontSize="xs"
                          fontWeight="bold"
                          color="black"
                        >
                          {progress}%
                        </Text>
                      </Box>
                    </Box>
                  );
                })}
              </VStack>
            )}
          </Box>

          {/* Quick tip */}
          <Box mt={8} p={4} bg="rgba(255,255,255,0.05)" borderRadius="lg">
            <HStack spacing={2}>
              <Icon as={FaLeaf} color="green.300" />
              <Text color="whiteAlpha.800" fontSize="sm">
                Days to maturity are averages. Actual harvest time depends on weather, soil, and care.
              </Text>
            </HStack>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default HarvestCalculator;