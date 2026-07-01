// src/screens/Dashboard/Dashboard.js
import React, { useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  VStack,
  HStack,
  Avatar,
  Button,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaLeaf, FaHistory, FaSearch, FaTint, FaShoppingBag } from 'react-icons/fa'; // Removed FaMapMarkedAlt
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

// Removed the unused openGardenCenters function

const backgroundStyle = {
  backgroundImage: 'url("https://thumbs.dreamstime.com/b/tree-hands-nurturing-seedlings-growth-tree-hands-nurturing-growth-seedlings-304209380.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0'
};

// Fallback data
const mockStats = {
  totalScans: 47,
  diseasesDetected: 12,
  plantsTracked: 8,
  accuracy: 95,
};

const mockRecentScans = [
  { id: 1, plant: 'Tomato', disease: 'Early Blight', date: '2026-02-15', confidence: 0.94 },
  { id: 2, plant: 'Apple', disease: 'Cedar Apple Rust', date: '2026-02-14', confidence: 0.99 },
  { id: 3, plant: 'Corn', disease: 'Gray Leaf Spot', date: '2026-02-13', confidence: 0.87 },
  { id: 4, plant: 'Grape', disease: 'Black Rot', date: '2026-02-12', confidence: 0.92 },
];

const mockOrders = [
  { id: 1001, date: '2026-02-18', total: 53.96, items: 3 },
  { id: 1002, date: '2026-02-10', total: 27.99, items: 1 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  
  const scanHistory = context?.scanHistory || [];
  const orderHistory = context?.orderHistory || [];
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const recentScans = scanHistory.length > 0 ? scanHistory : mockRecentScans;
  const recentOrders = orderHistory.length > 0 ? orderHistory : mockOrders;

  const totalScans = scanHistory.length || mockStats.totalScans;
  const uniqueDiseases = new Set(scanHistory.map(s => s.disease)).size || mockStats.diseasesDetected;

  return (
    <div style={backgroundStyle}>
      <Container maxW="7xl" py={8}>
        <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8}>
          {/* Welcome Header */}
          <Box mb={8}>
            <Heading as="h1" size="xl" mb={2}>
              👋 Welcome back, Farmer!
            </Heading>
            <Text color="gray.600">Here's an overview of your plant health activity.</Text>
          </Box>

          {/* Stats Cards */}
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <Stat>
                <HStack justify="space-between">
                  <StatLabel fontSize="md">Total Scans</StatLabel>
                  <Box color="green.500"><FaLeaf /></Box>
                </HStack>
                <StatNumber fontSize="3xl">{totalScans}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" /> 12% from last month
                </StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <Stat>
                <HStack justify="space-between">
                  <StatLabel fontSize="md">Diseases Detected</StatLabel>
                  <Box color="red.500"><FaTint /></Box>
                </HStack>
                <StatNumber fontSize="3xl">{uniqueDiseases}</StatNumber>
                <StatHelpText>Unique diseases found</StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <Stat>
                <HStack justify="space-between">
                  <StatLabel fontSize="md">Plants Tracked</StatLabel>
                  <Box color="purple.500"><FaLeaf /></Box>
                </HStack>
                <StatNumber fontSize="3xl">{mockStats.plantsTracked}</StatNumber>
                <StatHelpText>Different crop types</StatHelpText>
              </Stat>
            </Box>

            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <Stat>
                <HStack justify="space-between">
                  <StatLabel fontSize="md">Avg. Accuracy</StatLabel>
                  <Box color="blue.500"><FaSearch /></Box>
                </HStack>
                <StatNumber fontSize="3xl">{mockStats.accuracy}%</StatNumber>
                <StatHelpText>Model confidence</StatHelpText>
              </Stat>
            </Box>
          </SimpleGrid>

          {/* Recent Scans & Recent Orders */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            {/* Recent Scans */}
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <HStack justify="space-between" mb={4}>
                <Heading as="h3" size="md">
                  <HStack><FaHistory /><Text>Recent Scans</Text></HStack>
                </Heading>
                <Button size="sm" variant="outline" colorScheme="green" onClick={() => navigate('/history')}>
                  View All
                </Button>
              </HStack>
              <VStack spacing={3} align="stretch">
                {recentScans.slice(0, 4).map((scan) => (
                  <HStack key={scan.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <HStack spacing={3}>
                      <Avatar size="sm" bg="green.500" icon={<FaLeaf />} />
                      <Box>
                        <Text fontWeight="bold">{scan.plant || 'Unknown'}</Text>
                        <Text fontSize="sm" color="gray.600">{scan.disease || 'Unknown'}</Text>
                      </Box>
                    </HStack>
                    <HStack>
                      <Badge colorScheme={scan.confidence > 0.9 ? 'green' : 'yellow'}>
                        {typeof scan.confidence === 'number' ? (scan.confidence * 100).toFixed(0) : scan.confidence}%
                      </Badge>
                      <Text fontSize="sm" color="gray.500">{scan.date || ''}</Text>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Recent Orders */}
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
              <Heading as="h3" size="md" mb={4}>
                <HStack><FaShoppingBag /><Text>Recent Orders</Text></HStack>
              </Heading>
              {recentOrders.length === 0 ? (
                <Text>No orders yet.</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {recentOrders.slice(0, 3).map((order) => (
                    <Box key={order.id} p={3} bg="gray.50" borderRadius="md">
                      <HStack justify="space-between" mb={1}>
                        <Text fontWeight="bold">Order #{order.id?.toString().slice(-4) || 'N/A'}</Text>
                        <Text fontSize="sm" color="gray.500">{order.date || ''}</Text>
                      </HStack>
                      <Text fontSize="sm">Buyer: {order.buyer || order.address?.fullName || 'Guest'}</Text>
                      <HStack justify="space-between" mt={1}>
                        <Text fontSize="sm">Total: ${order.total?.toFixed(2) || '0.00'}</Text>
                        <Text fontSize="sm">{order.items?.length || order.items || 0} items</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </SimpleGrid>

          {/* Quick Actions */}
          <Box mt={8} bg={cardBg} p={6} borderRadius="lg" boxShadow="md" borderWidth="1px" borderColor={borderColor}>
            <Heading as="h3" size="md" mb={4}>Quick Actions</Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
              <Button leftIcon={<FaLeaf />} colorScheme="green" onClick={() => navigate('/check')}>
                New Scan
              </Button>
              <Button leftIcon={<FaHistory />} colorScheme="green" variant="outline" onClick={() => navigate('/history')}>
                Scan History
              </Button>
              <Button leftIcon={<FaShoppingBag />} colorScheme="green" variant="outline" onClick={() => navigate('/products')}>
                Shop
              </Button>
              <Button leftIcon={<FaTint />} colorScheme="green" variant="outline" onClick={() => navigate('/home-remedies')}>
                Remedies
              </Button>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Dashboard;