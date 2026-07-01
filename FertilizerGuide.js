// src/screens/FertilizerGuide/FertilizerGuide.js
import React, { useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Badge,
  HStack,
  Image,
  Button,
  useToast,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { FaSeedling, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

// Full page background with plant image
const backgroundStyle = {
  backgroundImage: 'url("https://www.setaswall.com/wp-content/uploads/2017/06/Tea-Leaves-Nature-Plants-Green-Sunlight-1920-x-1200.jpg")',
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

// Glass card for fertilizer items
const productGlassCard = {
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

const fertilizers = [
  {
    id: 201,
    plant: 'Tomatoes',
    name: 'Tomato‐specific Fertilizer',
    npk: '5-10-10',
    description: 'Balanced formula with extra phosphorus for strong roots and fruit development.',
    application: 'Apply 1 cup per plant at planting, then side-dress every 4 weeks.',
    organic: true,
    price: 12.99,
    size: '4 lbs',
    image: 'https://i5.walmartimages.com/seo/5-10-10-Tomato-Vegetable-RRF12-Fertilizer-Made-USA-Micronutrients-Plant-Food-Flower-Gardens-Promotes-Vigorous-Growth-Big-Blooms-Cz-Garden-Organics-Pu_48111956-8314-42cb-b609-da3c5797d96e.4d2248cc851a1f789d3381f5ca21d562.jpeg',
  },
  {
    id: 202,
    plant: 'Corn',
    name: 'High‐Nitrogen Corn Fertilizer',
    npk: '10-5-5',
    description: 'Nitrogen boost for leafy growth and ear formation.',
    application: 'Apply 2 cups per 10 ft row at planting, side-dress when plants are 12" tall.',
    organic: false,
    price: 14.99,
    size: '5 lbs',
    image: 'https://image.made-in-china.com/2f0j00aTGbAcLtVnuU/Foliar-Fertilizer-for-Corn-High-Nitrogen-Formula-NPK-30-10-10-Fertilizer.jpg',
  },
  {
    id: 203,
    plant: 'Apples',
    name: 'Fruit Tree Fertilizer',
    npk: '6-2-4',
    description: 'Slow-release formula with micronutrients for healthy trees and abundant fruit.',
    application: 'Apply 1 lb per inch of trunk diameter in early spring.',
    organic: true,
    price: 18.99,
    size: '8 lbs',
    image: 'https://thegardenfixes.com/wp-content/uploads/2023/10/The-Right-Amount-of-Fertilizer-at-the-Right-Time.jpg',
  },
  {
    id: 204,
    plant: 'Peppers',
    name: 'Pepper & Eggplant Fertilizer',
    npk: '3-5-5',
    description: 'Encourages flowering and fruit set without excessive foliage.',
    application: 'Mix into soil at transplanting, then feed every 3-4 weeks.',
    organic: true,
    price: 11.99,
    size: '3 lbs',
    image: 'https://thegardenfixes.com/wp-content/uploads/2023/10/The-Right-Amount-of-Fertilizer-at-the-Right-Time.jpg',
  },
  {
    id: 205,
    plant: 'Strawberries',
    name: 'Berry Fertilizer',
    npk: '4-3-4',
    description: 'Promotes strong roots and sweet berries.',
    application: 'Apply in early spring and again after harvest.',
    organic: false,
    price: 13.99,
    size: '4 lbs',
    image: 'https://rohrerseeds.com/cdn/shop/products/fruit_and_berry_fert_uMybw_1200x1527.jpg?v=1610043025',
  },
  {
    id: 206,
    plant: 'General Purpose',
    name: 'All‐Purpose Organic Fertilizer',
    npk: '4-4-4',
    description: 'Balanced blend for vegetables, flowers, and shrubs.',
    application: 'Use 1 cup per 10 sq ft, work into soil monthly.',
    organic: true,
    price: 16.99,
    size: '6 lbs',
    image: 'https://cf-images.ap-southeast-2.prod.boltdns.net/v1/static/3850378352001/c6f448e9-a9d9-4d0a-9036-99846caf1207/9b04b4a0-9a19-4ac0-bf80-9e739ac2c68a/1280x720/match/image.jpg',
  },
];

const FertilizerGuide = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = (fertilizer) => {
    addToCart({
      id: fertilizer.id,
      name: fertilizer.name,
      price: fertilizer.price,
      quantity: 1,
      image: fertilizer.image,
      size: fertilizer.size,
    });
    
    toast({
      title: 'Added to cart',
      description: `${fertilizer.name} has been added to your cart.`,
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
              🌱 Fertilizer Guide
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
          <Text mb={8} color="whiteAlpha.800" fontSize="lg">
            Choose the right fertilizer for your plants. All fertilizers can be added to your cart.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {fertilizers.map((fertilizer, idx) => (
              <Box
                key={idx}
                style={productGlassCard}
                borderRadius="xl"
                overflow="hidden"
                _hover={{ transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' }}
              >
                <Image
                  src={fertilizer.image}
                  alt={fertilizer.name}
                  height="180px"
                  width="100%"
                  objectFit="cover"
                />
                
                <VStack p={5} align="stretch" spacing={3} flex="1">
                  <Flex justify="space-between" align="center" minHeight="40px">
                    <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                      {fertilizer.plant}
                    </Badge>
                    {fertilizer.organic && (
                      <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                        🌱 Organic
                      </Badge>
                    )}
                  </Flex>

                  <Heading size="md" color="white" fontWeight="bold" noOfLines={2} minHeight="60px">
                    {fertilizer.name}
                  </Heading>

                  <HStack spacing={1} flexWrap="wrap">
                    <Badge colorScheme="blue" fontSize="xs" px={2} py={1} bg="rgba(56, 161, 105, 0.3)" border="1px solid rgba(56, 161, 105, 0.5)" fontWeight="bold">
                      NPK {fertilizer.npk}
                    </Badge>
                    <Badge colorScheme="purple" fontSize="xs" px={2} py={1} bg="rgba(159, 122, 234, 0.3)" border="1px solid rgba(159, 122, 234, 0.5)" fontWeight="bold">
                      {fertilizer.size}
                    </Badge>
                  </HStack>

                  <Text color="whiteAlpha.900" fontSize="sm" noOfLines={2} fontWeight="medium" minHeight="40px">
                    {fertilizer.description}
                  </Text>

                  <Text fontSize="sm" fontWeight="bold" color="white">Application:</Text>
                  <Text fontSize="sm" color="whiteAlpha.800" minHeight="50px">
                    {fertilizer.application}
                  </Text>

                  <Divider borderColor="rgba(255,255,255,0.2)" />

                  <Flex justify="space-between" align="center" minHeight="70px">
                    <Box>
                      <Text fontSize="2xl" fontWeight="extrabold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                        ${fertilizer.price.toFixed(2)}
                      </Text>
                    </Box>
                    <Button
                      leftIcon={<FaSeedling />}
                      colorScheme="green"
                      size="md"
                      onClick={() => handleAddToCart(fertilizer)}
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
        </Box>
      </Container>
    </div>
  );
};

export default FertilizerGuide;