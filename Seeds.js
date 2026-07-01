// src/screens/Seeds/Seeds.js
import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  HStack,
  VStack,
  Badge,
  Input,
  Select,
  useToast,
  Flex,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FaSeedling, FaShoppingCart, FaCalendarAlt, FaLeaf, FaTint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

// Full page background with plant image
const backgroundStyle = {
  backgroundImage: 'url("https://c.pxhere.com/photos/de/38/photo-163947.jpg!d")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0',
  position: 'relative',
};

// Dark overlay for better glass effect
const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 20, 0, 0.6)',
  zIndex: 1,
};

// Glass card style for main container
const glassCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  color: "white",
};

// Glass card for seed items
const seedGlassCard = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
  color: "white",
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};

// Seed database
const seeds = [
  // Vegetables
  {
    id: 101,
    name: 'Tomato Seeds – Heirloom',
    category: 'Vegetables',
    variety: 'Brandywine',
    price: 4.99,
    description: 'Large, pink beefsteak tomatoes with rich flavor. Heirloom variety, open-pollinated.',
    planting: 'Start indoors 6-8 weeks before last frost. Transplant after danger of frost.',
    daysToMaturity: '80-100 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://ndgbotanicals.com/wp-content/uploads/2016/08/Tomato-Black-Krim-1-7023-scaled.jpg',
    organic: true,
    inStock: true,
  },
  {
    id: 102,
    name: 'Tomato Seeds – Cherry',
    category: 'Vegetables',
    variety: 'Sweet 100',
    price: 3.99,
    description: 'Prolific producer of sweet, bite-sized tomatoes. Great for salads and snacking.',
    planting: 'Start indoors 6-8 weeks before last frost. Transplant after danger of frost.',
    daysToMaturity: '65-70 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://basicfarmhouse.com/cdn/shop/files/YellowCherryTomato2_b60574cb-d1e9-44a1-8200-f7e080f59787.jpg?v=1750573544&width=1445',
    organic: false,
    inStock: true,
  },
  {
    id: 103,
    name: 'Bell Pepper Seeds',
    category: 'Vegetables',
    variety: 'California Wonder',
    price: 3.49,
    description: 'Classic bell pepper with thick walls and sweet flavor. Green to red when fully ripe.',
    planting: 'Start indoors 8-10 weeks before last frost. Transplant after soil warms.',
    daysToMaturity: '70-80 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://www.mediasculp.com/wp-content/uploads/2023/01/20210116-19-57-45.jpg',
    organic: true,
    inStock: true,
  },
  {
    id: 104,
    name: 'Cucumber Seeds',
    category: 'Vegetables',
    variety: 'Marketmore',
    price: 2.99,
    description: 'Slicing cucumber with dark green skin and crisp texture. Disease resistant.',
    planting: 'Direct sow after last frost when soil is warm.',
    daysToMaturity: '55-65 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'High',
    image: 'https://media.sciencephoto.com/image/c0055534/800wm/C0055534-Cucumber_seeds_Cucumis_sativus_.jpg',
    organic: false,
    inStock: true,
  },
  {
    id: 105,
    name: 'Carrot Seeds',
    category: 'Vegetables',
    variety: 'Nantes',
    price: 2.49,
    description: 'Sweet, crunchy carrots with blunt ends. Excellent for fresh eating.',
    planting: 'Direct sow 2-3 weeks before last frost. Thin to 2 inches apart.',
    daysToMaturity: '65-75 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-carrot-seeds-scimat.jpg',
    organic: true,
    inStock: true,
  },
  
  // Fruits
  {
    id: 106,
    name: 'Strawberry Seeds',
    category: 'Fruits',
    variety: 'Alpine',
    price: 5.99,
    description: 'Ever-bearing alpine strawberries with intense flavor. Great for containers.',
    planting: 'Start indoors 8-10 weeks before last frost. Surface sow, do not cover.',
    daysToMaturity: '90-120 days',
    sunRequirement: 'Full sun to part shade',
    waterRequirement: 'Moderate',
    image: 'https://everythingbackyard.net/wp-content/uploads/2017/01/3_strawberry-seeds.jpg',
    organic: true,
    inStock: true,
  },
  {
    id: 107,
    name: 'Watermelon Seeds',
    category: 'Fruits',
    variety: 'Sugar Baby',
    price: 3.99,
    description: 'Icebox-sized watermelon with sweet red flesh. Perfect for small gardens.',
    planting: 'Direct sow after last frost when soil is warm.',
    daysToMaturity: '75-85 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://img.freepik.com/free-photo/watermelon-seeds-isolated-white-background_29402-1022.jpg?size=626&ext=jpg',
    organic: false,
    inStock: true,
  },
  
  // Herbs
  {
    id: 108,
    name: 'Basil Seeds',
    category: 'Herbs',
    variety: 'Genovese',
    price: 2.99,
    description: 'Classic Italian basil with large leaves and sweet flavor. Perfect for pesto.',
    planting: 'Start indoors 4-6 weeks before last frost or direct sow after.',
    daysToMaturity: '60-70 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Moderate',
    image: 'https://www.levels.com/wp-content/uploads/2023/01/BasilSeeds.jpg',
    organic: true,
    inStock: true,
  },
  {
    id: 109,
    name: 'Cilantro Seeds',
    category: 'Herbs',
    variety: 'Slow Bolt',
    price: 2.49,
    description: 'Slow-bolting variety for extended harvest. Leaves for cilantro, seeds for coriander.',
    planting: 'Direct sow in early spring or fall. Succession plant every 3 weeks.',
    daysToMaturity: '50-60 days',
    sunRequirement: 'Full sun to part shade',
    waterRequirement: 'Moderate',
    image: 'https://img.freepik.com/premium-photo/coriander-cilantro-seeds-close-up_1048944-5191980.jpg',
    organic: true,
    inStock: true,
  },
  
  // Flowers
  {
    id: 110,
    name: 'Sunflower Seeds',
    category: 'Flowers',
    variety: 'Mammoth',
    price: 3.49,
    description: 'Towering sunflowers up to 12 feet tall with massive seed heads.',
    planting: 'Direct sow after last frost. Plant 1 inch deep, 6 inches apart.',
    daysToMaturity: '80-100 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Low',
    image: 'https://www.publicdomainpictures.net/pictures/80000/velka/sunflower-seeds-1393667091wQv.jpg',
    organic: false,
    inStock: true,
  },
  {
    id: 111,
    name: 'Marigold Seeds',
    category: 'Flowers',
    variety: 'French',
    price: 2.49,
    description: 'Bright, compact flowers that repel garden pests. Great companion plant.',
    planting: 'Direct sow after last frost or start indoors 4-6 weeks earlier.',
    daysToMaturity: '45-60 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Low',
    image: 'https://5.imimg.com/data5/SELLER/Default/2023/2/OO/IT/JQ/132209273/french-marigold-flower-seeds-500x500.jpg',
    organic: true,
    inStock: true,
  },
  {
    id: 112,
    name: 'Zinnia Seeds',
    category: 'Flowers',
    variety: 'Cut and Come Again',
    price: 2.99,
    description: 'Vibrant, long-lasting blooms perfect for cutting. Attracts pollinators.',
    planting: 'Direct sow after last frost. Thin to 12 inches apart.',
    daysToMaturity: '60-70 days',
    sunRequirement: 'Full sun',
    waterRequirement: 'Low',
    image: 'https://thumbs.dreamstime.com/z/heap-quality-seeds-zinnia-flower-your-adorable-garden-can-be-used-create-new-elegant-packaging-background-high-140265920.jpg',
    organic: true,
    inStock: true,
  },
];

const Seeds = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useContext(CartContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSeeds = seeds.filter(seed => {
    const matchesSearch = seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seed.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         seed.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || seed.category === category;
    const matchesOrganic = !organicOnly || seed.organic;
    return matchesSearch && matchesCategory && matchesOrganic;
  });

  const handleAddToCart = (seed) => {
    addToCart({
      id: seed.id,
      name: seed.name,
      price: seed.price,
      quantity: 1,
      image: seed.image,
      size: seed.daysToMaturity,
    });
    
    toast({
      title: 'Added to cart',
      description: `${seed.name} has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />
      
      <Container maxW="7xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <FaSeedling style={{ marginRight: '12px' }} />
              Plant Seeds
            </Heading>
            <Button
              leftIcon={<FaShoppingCart />}
              variant="outline"
              onClick={() => navigate('/cart')}
              bg="rgba(255,255,255,0.1)"
              color="white"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              View Cart
            </Button>
          </Flex>

          <Tabs variant="enclosed" colorScheme="green" mb={6}>
            <TabList>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">All Seeds</Tab>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">Vegetables</Tab>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">Fruits</Tab>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">Herbs</Tab>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">Flowers</Tab>
              <Tab _selected={{ bg: 'rgba(255,255,255,0.2)', color: 'white' }} color="whiteAlpha.800">Planting Guide</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box style={glassCard} p={4} mb={6} borderRadius="lg">
                  <VStack spacing={4}>
                    <Flex w="100%" align="center" justify="space-between">
                      <Input
                        placeholder="Search seeds..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        maxW="400px"
                        bg="rgba(255,255,255,0.1)"
                        border="1px solid rgba(255,255,255,0.2)"
                        color="white"
                        _placeholder={{ color: 'whiteAlpha.700' }}
                        _hover={{ borderColor: 'whiteAlpha.400' }}
                        _focus={{ borderColor: 'green.300', boxShadow: 'none' }}
                      />
                      <Button
                        leftIcon={<FaSeedling />}
                        onClick={() => setShowFilters(!showFilters)}
                        bg="rgba(255,255,255,0.15)"
                        color="white"
                        border="1px solid rgba(255,255,255,0.3)"
                        _hover={{ bg: 'rgba(255,255,255,0.25)' }}
                      >
                        Filters
                      </Button>
                    </Flex>

                    {showFilters && (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="100%">
                        <Select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          bg="rgba(255,255,255,0.1)"
                          border="1px solid rgba(255,255,255,0.2)"
                          color="white"
                        >
                          <option value="all" style={{ background: '#2d3748' }}>All Categories</option>
                          <option value="Vegetables" style={{ background: '#2d3748' }}>Vegetables</option>
                          <option value="Fruits" style={{ background: '#2d3748' }}>Fruits</option>
                          <option value="Herbs" style={{ background: '#2d3748' }}>Herbs</option>
                          <option value="Flowers" style={{ background: '#2d3748' }}>Flowers</option>
                        </Select>
                        <Button
                          bg={organicOnly ? 'green.500' : 'rgba(255,255,255,0.15)'}
                          color="white"
                          border="1px solid rgba(255,255,255,0.3)"
                          _hover={{ bg: organicOnly ? 'green.600' : 'rgba(255,255,255,0.25)' }}
                          onClick={() => setOrganicOnly(!organicOnly)}
                        >
                          {organicOnly ? '✓ Organic Only' : 'Show Organic'}
                        </Button>
                      </SimpleGrid>
                    )}
                  </VStack>
                </Box>

                {filteredSeeds.length === 0 ? (
                  <Box textAlign="center" py={10}>
                    <Text color="white">No seeds found.</Text>
                  </Box>
                ) : (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {filteredSeeds.map((seed) => (
                      <Box
                        key={seed.id}
                        style={seedGlassCard}
                        borderRadius="xl"
                        overflow="hidden"
                        _hover={{ transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' }}
                      >
                        <Image
                          src={seed.image}
                          alt={seed.name}
                          height="180px"
                          width="100%"
                          objectFit="cover"
                        />
                        
                        <VStack p={5} align="stretch" spacing={3} flex="1">
                          <Flex justify="space-between" align="center" minHeight="40px">
                            <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                              {seed.category}
                            </Badge>
                            {seed.organic && (
                              <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                                🌱 Organic
                              </Badge>
                            )}
                          </Flex>

                          <Heading size="md" color="white" fontWeight="bold" noOfLines={2} minHeight="60px">
                            {seed.name}
                          </Heading>

                          <Text color="whiteAlpha.800" fontSize="sm" fontWeight="medium">
                            Variety: {seed.variety}
                          </Text>

                          <HStack spacing={1} flexWrap="wrap">
                            <Badge colorScheme="blue" fontSize="xs" px={2} py={1} bg="rgba(56, 161, 105, 0.3)" border="1px solid rgba(56, 161, 105, 0.5)" fontWeight="bold">
                              <FaCalendarAlt style={{ display: 'inline', marginRight: '4px' }} />
                              {seed.daysToMaturity}
                            </Badge>
                            <Badge colorScheme="purple" fontSize="xs" px={2} py={1} bg="rgba(159, 122, 234, 0.3)" border="1px solid rgba(159, 122, 234, 0.5)" fontWeight="bold">
                              <FaLeaf style={{ display: 'inline', marginRight: '4px' }} />
                              {seed.sunRequirement}
                            </Badge>
                            <Badge colorScheme="cyan" fontSize="xs" px={2} py={1} bg="rgba(56, 178, 172, 0.3)" border="1px solid rgba(56, 178, 172, 0.5)" fontWeight="bold">
                              <FaTint style={{ display: 'inline', marginRight: '4px' }} />
                              {seed.waterRequirement}
                            </Badge>
                          </HStack>

                          <Text color="whiteAlpha.900" fontSize="sm" noOfLines={2} fontWeight="medium" minHeight="40px">
                            {seed.description}
                          </Text>

                          <Text fontSize="sm" fontWeight="bold" color="white">Planting:</Text>
                          <Text fontSize="sm" color="whiteAlpha.800" minHeight="50px">
                            {seed.planting}
                          </Text>

                          <Divider borderColor="rgba(255,255,255,0.2)" />

                          <Flex justify="space-between" align="center" minHeight="70px">
                            <Box>
                              <Text fontSize="2xl" fontWeight="extrabold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                                ${seed.price.toFixed(2)}
                              </Text>
                              <Text fontSize="sm" color="white" fontWeight="bold">
                                {seed.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                              </Text>
                            </Box>
                            <Button
                              leftIcon={<FaSeedling />}
                              colorScheme="green"
                              size="md"
                              onClick={() => handleAddToCart(seed)}
                              isDisabled={!seed.inStock}
                              bg="rgba(72, 187, 120, 0.4)"
                              border="1px solid rgba(72, 187, 120, 0.6)"
                              _hover={{ bg: 'rgba(72, 187, 120, 0.6)' }}
                              fontWeight="bold"
                              minWidth="120px"
                            >
                              Add to Cart
                            </Button>
                          </Flex>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </TabPanel>

{/* Other tab panels (Vegetables, Fruits, Herbs, Flowers) - reuse same grid but filtered */}
              {['Vegetables', 'Fruits', 'Herbs', 'Flowers'].map(cat => (
                <TabPanel key={cat}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {seeds.filter(s => s.category === cat).map((seed) => (
                      <Box
                        key={seed.id}
                        style={seedGlassCard}
                        borderRadius="xl"
                        overflow="hidden"
                        _hover={{ transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' }}
                      >
                        {/* Same card content as above – could extract to a component, but for brevity we repeat similar structure */}
                        <Image src={seed.image} alt={seed.name} height="180px" width="100%" objectFit="cover" />
                        <VStack p={5} align="stretch" spacing={3} flex="1">
                          <Flex justify="space-between" align="center" minHeight="40px">
                            <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255,255,255,0.2)" border="1px solid rgba(255,255,255,0.5)" fontWeight="bold" color="white">
                              {seed.category}
                            </Badge>
                            {seed.organic && (
                              <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255,255,255,0.2)" border="1px solid rgba(255,255,255,0.5)" fontWeight="bold" color="white">
                                🌱 Organic
                              </Badge>
                            )}
                          </Flex>
                          <Heading size="md" color="white" fontWeight="bold" noOfLines={2}>{seed.name}</Heading>
                          <Text color="whiteAlpha.800" fontSize="sm">Variety: {seed.variety}</Text>
                          <HStack spacing={1} flexWrap="wrap">
                            <Badge colorScheme="blue" fontSize="xs" px={2} py={1} bg="rgba(56,161,105,0.3)" border="1px solid rgba(56,161,105,0.5)" fontWeight="bold">
                              <FaCalendarAlt style={{display:'inline', marginRight:'4px'}} />
                              {seed.daysToMaturity}
                            </Badge>
                            <Badge colorScheme="purple" fontSize="xs" px={2} py={1} bg="rgba(159,122,234,0.3)" border="1px solid rgba(159,122,234,0.5)" fontWeight="bold">
                              <FaLeaf style={{display:'inline', marginRight:'4px'}} />
                              {seed.sunRequirement}
                            </Badge>
                            <Badge colorScheme="cyan" fontSize="xs" px={2} py={1} bg="rgba(56,178,172,0.3)" border="1px solid rgba(56,178,172,0.5)" fontWeight="bold">
                              <FaTint style={{display:'inline', marginRight:'4px'}} />
                              {seed.waterRequirement}
                            </Badge>
                          </HStack>
                          <Text color="whiteAlpha.900" fontSize="sm" noOfLines={2}>{seed.description}</Text>
                          <Text fontSize="sm" fontWeight="bold" color="white">Planting:</Text>
                          <Text fontSize="sm" color="whiteAlpha.800" minHeight="50px">{seed.planting}</Text>
                          <Divider borderColor="rgba(255,255,255,0.2)" />
                          <Flex justify="space-between" align="center" minHeight="70px">
                            <Box>
                              <Text fontSize="2xl" fontWeight="extrabold" color="white">${seed.price.toFixed(2)}</Text>
                              <Text fontSize="sm" color="white" fontWeight="bold">{seed.inStock ? '✓ In Stock' : '✗ Out of Stock'}</Text>
                            </Box>
                            <Button leftIcon={<FaSeedling />} colorScheme="green" size="md" onClick={() => handleAddToCart(seed)} isDisabled={!seed.inStock} bg="rgba(72,187,120,0.4)" border="1px solid rgba(72,187,120,0.6)" _hover={{bg:'rgba(72,187,120,0.6)'}} fontWeight="bold" minWidth="120px">Add to Cart</Button>
                          </Flex>
                        </VStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>
              ))}

              {/* Planting Guide Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Box p={6} style={seedGlassCard} borderRadius="xl">
                    <Heading size="sm" mb={2} color="white">🌱 Starting Seeds Indoors</Heading>
                    <Text color="whiteAlpha.800">Start seeds 6-8 weeks before last frost date. Use seed starting mix, keep moist, provide light.</Text>
                  </Box>
                  <Box p={6} style={seedGlassCard} borderRadius="xl">
                    <Heading size="sm" mb={2} color="white">☀️ Hardening Off</Heading>
                    <Text color="whiteAlpha.800">Gradually introduce seedlings to outdoor conditions over 7-10 days before transplanting.</Text>
                  </Box>
                  <Box p={6} style={seedGlassCard} borderRadius="xl">
                    <Heading size="sm" mb={2} color="white">🌿 Direct Sowing</Heading>
                    <Text color="whiteAlpha.800">Some seeds prefer direct sowing after soil has warmed. Check seed packet for instructions.</Text>
                  </Box>
                  <Box p={6} style={seedGlassCard} borderRadius="xl">
                    <Heading size="sm" mb={2} color="white">💧 Watering Tips</Heading>
                    <Text color="whiteAlpha.800">Keep soil consistently moist but not waterlogged. Water from bottom to prevent damping off.</Text>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
};

export default Seeds;