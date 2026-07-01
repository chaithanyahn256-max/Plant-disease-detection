import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  VStack,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import axios from 'axios';

const AdminActivity = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cardBg = useColorModeValue('white', 'gray.800');
  const mainBg = useColorModeValue('gray.50', 'gray.900');
  const theadBg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/admin/users-activity');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load user activity data. Check database connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  if (loading) {
    return (
      <Container maxW="7xl" py={10} textAlign="center">
        <Spinner size="xl" />
        <Text mt={4}>Loading Admin Dashboard...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="7xl" py={10}>
        <Box p={5} bg="red.100" color="red.700" borderRadius="md">
          <Text>{error}</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg={mainBg} py={8}>
      <Container maxW="7xl">
        <Heading as="h1" size="xl" mb={8} color="green.600">
          Admin Dashboard: User Activity
        </Heading>

        <Accordion allowMultiple>
          {users.map((user, index) => (
            <AccordionItem key={index} bg={cardBg} mb={4} borderRadius="lg" boxShadow="sm" border="none">
              <AccordionButton p={4} _expanded={{ bg: 'green.50', color: 'green.800' }}>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" fontSize="lg">
                    {user.name || user.email || `User #${user.user_id || user.id}`}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {user.scans?.length || 0} Scans | {user.orders?.length || 0} Orders
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={6}>
                <VStack spacing={6} align="stretch">
                  
                  {/* Scans Table */}
                  <Box>
                    <Heading as="h3" size="md" mb={4}>Recent Scans</Heading>
                    {user.scans && user.scans.length > 0 ? (
                      <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                          <Thead bg={theadBg}>
                            <Tr>
                              <Th>Date</Th>
                              <Th>Plant Name</Th>
                              <Th>Disease Detected</Th>
                              <Th>Confidence</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {user.scans.map((scan, i) => (
                              <Tr key={i}>
                                <Td>{new Date(scan.date).toLocaleDateString()}</Td>
                                <Td fontWeight="medium">{scan.plant_name}</Td>
                                <Td>{scan.disease_name || scan.disease_id}</Td>
                                <Td>
                                  <Badge colorScheme={scan.confidence > 0.9 ? 'green' : 'yellow'}>
                                    {(scan.confidence * 100).toFixed(1)}%
                                  </Badge>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    ) : (
                      <Text color="gray.500">No scans found for this user.</Text>
                    )}
                  </Box>

                  {/* Orders Table */}
                  <Box>
                    <Heading as="h3" size="md" mb={4}>Recent Orders</Heading>
                    {user.orders && user.orders.length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {user.orders.map((order, i) => (
                          <Box key={i} p={4} borderWidth="1px" borderRadius="md">
                            <Text fontWeight="bold" mb={2}>
                              Order Date: {new Date(order.date).toLocaleDateString()}
                            </Text>
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Product</Th>
                                  <Th isNumeric>Price</Th>
                                  <Th isNumeric>Qty</Th>
                                  <Th isNumeric>Total</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {order.items && order.items.map((item, j) => (
                                  <Tr key={j}>
                                    <Td>{item.product_name || `Product #${item.product_id}`}</Td>
                                    <Td isNumeric>${item.price || '0.00'}</Td>
                                    <Td isNumeric>{item.quantity || 1}</Td>
                                    <Td isNumeric>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Text color="gray.500">No orders found for this user.</Text>
                    )}
                  </Box>

                </VStack>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
        
        {users.length === 0 && !loading && !error && (
          <Box p={5} textAlign="center" bg="white" borderRadius="md" shadow="sm">
            <Text>No successful database connection or no users found.</Text>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AdminActivity;
