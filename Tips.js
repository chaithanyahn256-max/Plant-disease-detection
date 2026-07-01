// src/screens/Tips/Tips.js
import React from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { FaLeaf, FaTint, FaSun, FaSeedling } from 'react-icons/fa';

const tips = [
  {
    icon: FaTint,
    title: 'Watering',
    tip: 'Water your plants early in the morning to prevent fungal diseases. Avoid wetting the leaves.',
  },
  {
    icon: FaSun,
    title: 'Sunlight',
    tip: 'Most vegetables need at least 6-8 hours of direct sunlight daily. Monitor for signs of sunscald.',
  },
  {
    icon: FaSeedling,
    title: 'Soil Health',
    tip: 'Test your soil pH regularly. Most plants prefer slightly acidic soil (pH 6.0-6.8).',
  },
  {
    icon: FaLeaf,
    title: 'Disease Prevention',
    tip: 'Rotate crops yearly to prevent soil-borne diseases. Remove infected leaves immediately.',
  },
];

const backgroundStyle = {
  backgroundImage: 'url("https://img.freepik.com/premium-photo/close-up-bunch-green-plants_961147-81232.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0'
};

const Tips = () => {
  return (
    <div style={backgroundStyle}>
      <Container maxW="7xl" py={8}>
        <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8}>
          <Heading as="h1" size="xl" mb={6}>🌱 Plant Care Tips</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {tips.map((tip, index) => (
              <VStack key={index} p={6} bg="green.50" borderRadius="lg" align="start" spacing={3}>
                <Icon as={tip.icon} boxSize={8} color="green.600" />
                <Heading as="h3" size="md">{tip.title}</Heading>
                <Text color="gray.700">{tip.tip}</Text>
              </VStack>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </div>
  );
};

export default Tips;