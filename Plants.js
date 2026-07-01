// src/screens/Plants/Plants.js
import React, { useState, useContext, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { FaShoppingCart, FaTree, FaFilter, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

// Background and glass styles
const backgroundStyle = {
  backgroundImage: 'url("https://wallup.net/wp-content/uploads/2017/11/24/535091-wheat-plants-green.jpg")',
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

const plantGlassCard = {
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

const Plants = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useContext(CartContext);
  
  const [plantsData, setPlantsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        const data = await response.json();
        // Filter out only plants (Indoor/Outdoor matching categories)
        const thePlants = data.filter(p => p.category === 'Indoor' || p.category === 'Outdoor');
        
        const formattedData = thePlants.map(p => ({
          ...p,
          id: p.product_id,
          size: p.category === 'Indoor' ? 'Medium Plant' : 'Large Plant',
          care: 'Follow specific instructions',
          rating: 4.8,
          reviews: 50,
          inStock: Boolean(p.inStock),
          featured: true,
          price: parseFloat(p.price),
          image: p.image_url
        }));
        setPlantsData(formattedData);
      } catch (err) {
        console.error("Error fetching plants:", err);
      }
    };
    fetchPlants();
  }, []);

  const filteredPlants = plantsData.filter(plant => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (plant.name || '').toLowerCase().includes(term) ||
                         (plant.description || '').toLowerCase().includes(term);
    const matchesCategory = category === 'all' || plant.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (plant) => {
    addToCart({
      id: plant.id,
      name: plant.name,
      price: plant.price,
      quantity: 1,
      image: plant.image,
      size: plant.size,
    });
    
    toast({
      title: 'Added to cart',
      description: `${plant.name} has been added to your cart.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const RatingStars = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} color="#FFD700" />);
      else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
      else stars.push(<FaRegStar key={i} color="#FFD700" />);
    }
    return <HStack spacing={1}>{stars}</HStack>;
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />
      
      <Container maxW="7xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <FaTree style={{ marginRight: '12px' }} />
              Live Plants
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

          {/* Filter Bar */}
          <Box style={glassCard} p={4} mb={6} borderRadius="lg">
            <VStack spacing={4}>
              <Flex w="100%" align="center" justify="space-between">
                <Input
                  placeholder="Search plants..."
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
                  leftIcon={<FaFilter />}
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
                    <option value="Indoor" style={{ background: '#2d3748' }}>Indoor Plants</option>
                    <option value="Outdoor" style={{ background: '#2d3748' }}>Outdoor Plants</option>
                  </Select>
                </SimpleGrid>
              )}
            </VStack>
          </Box>

          {/* Plants Grid */}
          {filteredPlants.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color="white">No plants found.</Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredPlants.map((plant) => (
                <Box
                  key={plant.id}
                  style={plantGlassCard}
                  borderRadius="xl"
                  overflow="hidden"
                  _hover={{ transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' }}
                >
                  <Image
                    src={plant.image}
                    alt={plant.name}
                    height="180px"
                    width="100%"
                    objectFit="cover"
                  />
                  
                  <VStack p={5} align="stretch" spacing={3} flex="1">
                    <Flex justify="space-between" align="center" minHeight="40px">
                      <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255,255,255,0.2)" border="1px solid rgba(255,255,255,0.5)" fontWeight="bold" color="white">
                        {plant.category}
                      </Badge>
                      {plant.featured && (
                        <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255,255,255,0.2)" border="1px solid rgba(255,255,255,0.5)" fontWeight="bold" color="white">
                          ⭐ Featured
                        </Badge>
                      )}
                    </Flex>

                    <Heading size="md" color="white" fontWeight="bold" noOfLines={2} minHeight="60px">
                      {plant.name}
                    </Heading>

                    <HStack justify="space-between" align="center">
                      <Text color="whiteAlpha.900" fontSize="sm" fontWeight="bold">
                        📏 {plant.size}
                      </Text>
                      <HStack spacing={1}>
                        <RatingStars rating={plant.rating} />
                        <Text color="whiteAlpha.900" fontSize="xs" fontWeight="bold" ml={1}>
                          ({plant.reviews})
                        </Text>
                      </HStack>
                    </HStack>

                    <Text color="whiteAlpha.900" fontSize="sm" noOfLines={2} fontWeight="medium" minHeight="40px">
                      {plant.description}
                    </Text>

                    <Text fontSize="sm" fontWeight="bold" color="white">Care:</Text>
                    <Text fontSize="sm" color="whiteAlpha.800" minHeight="50px">
                      {plant.care}
                    </Text>

                    <Divider borderColor="rgba(255,255,255,0.2)" />

                    <Flex justify="space-between" align="center" minHeight="70px">
                      <Box>
                        <Text fontSize="2xl" fontWeight="extrabold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                          ${plant.price.toFixed(2)}
                        </Text>
                        <Text fontSize="sm" color="white" fontWeight="bold">
                          {plant.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                        </Text>
                      </Box>
                      <Button
                        leftIcon={<FaTree />}
                        colorScheme="green"
                        size="md"
                        onClick={() => handleAddToCart(plant)}
                        isDisabled={!plant.inStock}
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
        </Box>
      </Container>
    </div>
  );
};

export default Plants;