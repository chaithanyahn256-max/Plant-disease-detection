import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, Heading, Text, SimpleGrid, Image, Button, HStack, VStack, Badge, Input, Select, useToast, Flex, Divider } from '@chakra-ui/react';
import { FaShoppingCart, FaFilter, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';

const backgroundStyle = {
  backgroundImage: 'url("https://cdn.pixabay.com/photo/2024/04/23/11/20/growth-8714779_1280.jpg")',
  backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center',
  minHeight: '100vh', padding: '20px 0', position: 'relative',
};

const overlayStyle = {
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0, 20, 0, 0.6)', zIndex: 1,
};

const glassCard = {
  background: "rgba(255, 255, 255, 0.1)", backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)", color: "white",
};

const productGlassCard = {
  background: "rgba(255, 255, 255, 0.08)", backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)", color: "white", 
  transition: 'all 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column',
};

const Products = () => {
  const toast = useToast();
  const { addToCart } = useContext(CartContext);
  
  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [disease, setDisease] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/products");
        const data = await response.json();
        // The backend returns an array of products
        // Parse the 'diseases' string if it exists into an array, or provide an empty array
        const formattedData = data.map(p => ({
          ...p,
          id: p.product_id,
          // If you had diseases stored as a JSON string or comma-separated:
          diseases: p.diseases ? p.diseases.split(',') : [],
          rating: 4.5, // Dummy default rating
          reviews: 100,
          organic: Boolean(p.organic),
          inStock: Boolean(p.inStock),
          price: parseFloat(p.price),
          image: p.image_url
        }));
        setAllProducts(formattedData);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['all', ...new Set(allProducts.map(p => p.category))];
  const allDiseases = ['all', ...new Set(allProducts.flatMap(p => Array.isArray(p.diseases) ? p.diseases : []))];

  const filteredProducts = allProducts.filter(product => {
    const term = searchTerm.toLowerCase();
    const productName = product.name ? product.name.toLowerCase() : '';
    const productDesc = product.description ? product.description.toLowerCase() : '';
    const matchesSearch = productName.includes(term) || productDesc.includes(term);
    
    const matchesCategory = category === 'all' || product.category === category;
    const matchesDisease = disease === 'all' || (Array.isArray(product.diseases) && product.diseases.some(d => d.toLowerCase().includes(disease.toLowerCase())));
    const matchesOrganic = !organicOnly || product.organic;
    
    return matchesSearch && matchesCategory && matchesDisease && matchesOrganic;
  });

  const handleAddToCart = (product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, size: product.size });
    toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.`, status: 'success', duration: 3000, isClosable: true });
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
      <Container maxW="7xl" position="relative" zIndex={2}>
        <Box style={glassCard} py={16} px={8} textAlign="center" borderRadius="2xl" mb={8}>
          <Heading as="h1" size="3xl" mb={4} color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)" fontWeight="extrabold">🌱 Plant Health Products</Heading>
          <Text fontSize="xl" color="whiteAlpha.900" maxW="3xl" mx="auto" fontWeight="medium">Discover our range of scientifically formulated products to keep your plants healthy and thriving</Text>
        </Box>

        <Box style={glassCard} p={4} mb={8} borderRadius="lg">
          <VStack spacing={4}>
            <Flex w="100%" align="center" justify="space-between">
              <Input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} maxW="400px" bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.2)" color="white" _placeholder={{ color: 'whiteAlpha.700' }} _hover={{ borderColor: 'whiteAlpha.400' }} _focus={{ borderColor: 'green.300', boxShadow: 'none' }} fontWeight="medium" />
              <Button leftIcon={<FaFilter />} onClick={() => setShowFilters(!showFilters)} bg="rgba(255,255,255,0.15)" color="white" border="1px solid rgba(255,255,255,0.3)" _hover={{ bg: 'rgba(255,255,255,0.25)' }} fontWeight="bold">Filters</Button>
            </Flex>
            {showFilters && (
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="100%">
                <Select value={category} onChange={(e) => setCategory(e.target.value)} bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.2)" color="white" fontWeight="medium">
                  {categories.map(cat => (<option key={cat} value={cat} style={{ background: '#2d3748', fontWeight: 'bold' }}>{cat === 'all' ? 'All Categories' : cat}</option>))}
                </Select>
                <Select value={disease} onChange={(e) => setDisease(e.target.value)} bg="rgba(255,255,255,0.1)" border="1px solid rgba(255,255,255,0.2)" color="white" fontWeight="medium">
                  <option value="all" style={{ background: '#2d3748', fontWeight: 'bold' }}>All Diseases</option>
                  {allDiseases.slice(0, 10).map(d => (<option key={d} value={d} style={{ background: '#2d3748', fontWeight: 'bold' }}>{d}</option>))}
                </Select>
                <Button bg={organicOnly ? 'green.500' : 'rgba(255,255,255,0.15)'} color="white" border="1px solid rgba(255,255,255,0.3)" _hover={{ bg: organicOnly ? 'green.600' : 'rgba(255,255,255,0.25)' }} onClick={() => setOrganicOnly(!organicOnly)} fontWeight="bold">{organicOnly ? '✓ Organic Only' : 'Show Organic'}</Button>
              </SimpleGrid>
            )}
          </VStack>
        </Box>

        {filteredProducts.length === 0 ? (
          <Box style={glassCard} textAlign="center" py={10} px={6} borderRadius="xl">
            <Heading size="lg" mb={4} color="white" fontWeight="bold">No products found</Heading>
            <Button bg="rgba(255,255,255,0.15)" color="white" border="1px solid rgba(255,255,255,0.3)" _hover={{ bg: 'rgba(255,255,255,0.25)' }} onClick={() => { setSearchTerm(''); setCategory('all'); setDisease('all'); setOrganicOnly(false); }} fontWeight="bold">Clear Filters</Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredProducts.map((product) => (
              <Box key={product.id} style={productGlassCard} borderRadius="xl" overflow="hidden" _hover={{ transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)' }}>
                <Box position="relative" height="180px" overflow="hidden">
                  <Image src={product.image} alt={product.name} w="100%" h="100%" objectFit="cover" transition="transform 0.5s" _hover={{ transform: 'scale(1.1)' }} />
                  {product.featured && (<Badge position="absolute" top={4} right={4} colorScheme="yellow" fontSize="sm" p={2} borderRadius="full" bg="rgba(255, 215, 0, 0.3)" border="1px solid gold" fontWeight="bold">⭐ Featured</Badge>)}
                </Box>
                <VStack p={5} align="stretch" spacing={3} flex="1">
                  <Flex justify="space-between" align="center" minHeight="40px">
                    <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                      {product.brand}
                    </Badge>
                    {product.organic && (
                      <Badge colorScheme="whiteAlpha" fontSize="sm" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                        🌱 Organic
                      </Badge>
                    )}
                  </Flex>

                  <Heading size="md" color="white" fontWeight="bold" textShadow="0 2px 4px rgba(0,0,0,0.3)" noOfLines={2} minHeight="60px">
                    {product.name}
                  </Heading>

                  <HStack justify="space-between" align="center">
                    <Text color="whiteAlpha.900" fontSize="sm" fontWeight="bold">
                      📦 {product.size}
                    </Text>
                    <HStack spacing={1}>
                      <RatingStars rating={product.rating} />
                      <Text color="whiteAlpha.900" fontSize="xs" fontWeight="bold" ml={1}>
                        ({product.reviews})
                      </Text>
                    </HStack>
                  </HStack>

                  <Text color="whiteAlpha.900" fontSize="sm" noOfLines={2} fontWeight="medium" minHeight="40px">
                    {product.description}
                  </Text>

                  <HStack spacing={1} flexWrap="wrap" minHeight="50px">
                    {product.diseases.slice(0, 3).map((d, idx) => (
                      <Badge key={idx} colorScheme="whiteAlpha" fontSize="xs" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" textTransform="uppercase" color="white">
                        {d}
                      </Badge>
                    ))}
                    {product.diseases.length > 3 && (
                      <Badge colorScheme="whiteAlpha" fontSize="xs" px={2} py={1} bg="rgba(255, 255, 255, 0.2)" border="1px solid rgba(255, 255, 255, 0.5)" fontWeight="bold" color="white">
                        +{product.diseases.length - 3}
                      </Badge>
                    )}
                  </HStack>

                  <Divider borderColor="rgba(255,255,255,0.2)" />

                  <Flex justify="space-between" align="center" minHeight="70px">
                    <Box>
                      <Text fontSize="2xl" fontWeight="extrabold" color="white" textShadow="0 2px 4px rgba(0,0,0,0.3)">
                        ${product.price.toFixed(2)}
                      </Text>
                      <Text fontSize="sm" color="white" fontWeight="bold">
                        {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                      </Text>
                    </Box>
                    <Button 
                      colorScheme="green" 
                      size="md" 
                      leftIcon={<FaShoppingCart />} 
                      onClick={() => handleAddToCart(product)} 
                      isDisabled={!product.inStock} 
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
      </Container>
    </div>
  );
};

export default Products;