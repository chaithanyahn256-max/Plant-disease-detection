// src/screens/History/History.js
import React, { useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  HStack,
  Avatar,
  Badge,
  SimpleGrid,
  Button,
} from '@chakra-ui/react';
import { FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';

const backgroundStyle = {
  backgroundImage: 'url("https://thumbs.dreamstime.com/b/tree-hands-nurturing-seedlings-growth-tree-hands-nurturing-growth-seedlings-304209380.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0'
};

const History = () => {
  const navigate = useNavigate();
  const { scanHistory } = useContext(UserContext);

  // If no history, show placeholder
  if (!scanHistory || scanHistory.length === 0) {
    return (
      <div style={backgroundStyle}>
        <Container maxW="7xl" py={8}>
          <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8} textAlign="center">
            <Heading mb={4}>Scan History</Heading>
            <Text mb={6}>No scans yet. Go to the Check page to detect diseases.</Text>
            <Button colorScheme="green" onClick={() => navigate('/check')}>
              Go to Check
            </Button>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <Container maxW="7xl" py={8}>
        <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8}>
          <Heading mb={6}>Scan History</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {scanHistory.map((scan) => (
              <HStack key={scan.id} p={4} bg="gray.50" borderRadius="md" justify="space-between">
                <HStack spacing={3}>
                  <Avatar size="sm" bg="green.500" icon={<FaLeaf />} />
                  <Box>
                    <Text fontWeight="bold">{scan.plant}</Text>
                    <Text fontSize="sm" color="gray.600">{scan.disease}</Text>
                  </Box>
                </HStack>
                <HStack>
                  <Badge colorScheme={scan.confidence > 0.9 ? 'green' : 'yellow'}>
                    {(scan.confidence * 100).toFixed(0)}%
                  </Badge>
                  <Text fontSize="sm" color="gray.500">{scan.date}</Text>
                </HStack>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </div>
  );
};

export default History;