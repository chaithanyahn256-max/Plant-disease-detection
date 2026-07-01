// src/screens/Cart/Cart.js
import React, { useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  Image,
  Button,
  HStack,
  VStack,
  Divider,
  Flex,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

// Full page background with plant image
const backgroundStyle = {
  backgroundImage: 'url("https://img.freepik.com/premium-photo/close-up-plant-with-green-leaves-background-generative-ai_900775-48111.jpg")',
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

// Glass card style
const glassCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  color: "white",
};

// Glass card for cart items
const glassItemCard = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.2)",
  color: "white",
  transition: 'all 0.3s ease',
};

const Cart = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Add some items to your cart first!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    navigate('/checkout');
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle} />

      <Container maxW="6xl" position="relative" zIndex={2} py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          <Flex justify="space-between" align="center" mb={6}>
            <Heading as="h1" size="xl" color="white" display="flex" alignItems="center">
              <FaShoppingCart style={{ marginRight: '12px' }} />
              Your Cart
            </Heading>
            <Button
              leftIcon={<FaArrowLeft />}
              variant="outline"
              onClick={() => navigate('/products')}
              bg="rgba(255,255,255,0.1)"
              color="white"
              border="1px solid rgba(255,255,255,0.3)"
              _hover={{ bg: 'rgba(255,255,255,0.2)' }}
            >
              Continue Shopping
            </Button>
          </Flex>

          {cartItems.length === 0 ? (
            <VStack spacing={6} py={16} textAlign="center">
              <Box fontSize="80px" opacity={0.5}>🛒</Box>
              <Text fontSize="xl" color="whiteAlpha.900" fontWeight="bold">Your cart is empty</Text>
              <Text color="whiteAlpha.700">Looks like you haven't added anything to your cart yet</Text>
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => navigate('/products')}
                bg="rgba(72, 187, 120, 0.4)"
                border="1px solid rgba(72, 187, 120, 0.6)"
                _hover={{ bg: 'rgba(72, 187, 120, 0.6)' }}
                mt={4}
              >
                Browse Products
              </Button>
            </VStack>
          ) : (
            <>
              <VStack spacing={4} align="stretch" mb={6}>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    style={glassItemCard}
                    borderRadius="xl"
                    p={4}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)' }}
                  >
                    <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
                      {/* Product Image & Info */}
                      <HStack spacing={4} flex="2" w="100%">
                        <Image
                          src={item.image}
                          alt={item.name}
                          boxSize="70px"
                          objectFit="cover"
                          borderRadius="lg"
                          border="1px solid rgba(255,255,255,0.2)"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold" fontSize="lg" color="white">
                            {item.name}
                          </Text>
                          <Text fontSize="sm" color="whiteAlpha.700">
                            ${item.price.toFixed(2)} each
                          </Text>
                          {item.size && (
                            <Text fontSize="xs" color="whiteAlpha.600">
                              📦 {item.size}
                            </Text>
                          )}
                        </VStack>
                      </HStack>

                      {/* Quantity Controls */}
                      <HStack spacing={3} my={{ base: 3, md: 0 }}>
                        <IconButton
                          size="sm"
                          icon={<span>-</span>}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          bg="rgba(255,255,255,0.1)"
                          border="1px solid rgba(255,255,255,0.2)"
                          color="white"
                          _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                        />
                        <Text minW="40px" textAlign="center" fontWeight="bold" color="white">
                          {item.quantity}
                        </Text>
                        <IconButton
                          size="sm"
                          icon={<span>+</span>}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          bg="rgba(255,255,255,0.1)"
                          border="1px solid rgba(255,255,255,0.2)"
                          color="white"
                          _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                        />
                      </HStack>

                      {/* Price & Remove */}
                      <HStack spacing={4} minW="150px" justify="flex-end">
                        <Text fontWeight="bold" fontSize="xl" color="green.200">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <IconButton
                          size="sm"
                          icon={<FaTrash />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                          color="red.200"
                          _hover={{ bg: 'rgba(254, 178, 178, 0.2)' }}
                        />
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>

              <Divider borderColor="rgba(255,255,255,0.2)" my={6} />

              {/* Cart Summary */}
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontSize="lg" color="whiteAlpha.800">Total Items</Text>
                  <Text fontSize="3xl" fontWeight="bold" color="white">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="lg" color="whiteAlpha.800">Total Amount</Text>
                  <Text fontSize="4xl" fontWeight="extrabold" color="green.200">
                    ${total.toFixed(2)}
                  </Text>
                </Box>
              </Flex>

              <Divider borderColor="rgba(255,255,255,0.2)" my={6} />

              {/* Action Buttons */}
              <HStack spacing={4} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => navigate('/products')}
                  bg="rgba(255,255,255,0.1)"
                  color="white"
                  border="1px solid rgba(255,255,255,0.3)"
                  _hover={{ bg: 'rgba(255,255,255,0.2)' }}
                  size="lg"
                >
                  Continue Shopping
                </Button>
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={handleCheckout}
                  bg="rgba(72, 187, 120, 0.4)"
                  border="1px solid rgba(72, 187, 120, 0.6)"
                  _hover={{ bg: 'rgba(72, 187, 120, 0.6)' }}
                  px={8}
                >
                  Proceed to Checkout
                </Button>
              </HStack>
            </>
          )}
        </Box>
      </Container>
    </div>
  );
};

export default Cart;