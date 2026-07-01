// src/screens/Checkout/Checkout.js
import React, { useState, useContext } from 'react';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Input,
  Select,
  Radio,
  RadioGroup,
  Stack,
  FormControl,
  FormLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import UserContext from '../../context/UserContext';

const backgroundStyle = {
  backgroundImage: 'url("https://static.vecteezy.com/system/resources/thumbnails/044/315/303/small_2x/lush-green-tea-plantation-at-dawn-generative-ai-photo.jpg")',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundPosition: 'center',
  minHeight: '100vh',
  padding: '20px 0'
};

const glassCard = {
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
  color: "white",
};

const glassInput = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  _placeholder: { color: 'whiteAlpha.600' },
  _hover: { borderColor: 'whiteAlpha.400' },
  _focus: { borderColor: 'green.300', boxShadow: 'none' },
};

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems, clearCart } = useContext(CartContext);
  const { addOrder, user } = useContext(UserContext);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  // UPI details
  const [upiId, setUpiId] = useState('');

  const [errors, setErrors] = useState({});

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validatePayment = () => {
    const newErrors = {};
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) newErrors.cardExpiry = 'Expiry must be MM/YY';
      if (!cardCvv.trim()) newErrors.cardCvv = 'CVV is required';
      else if (!/^\d{3}$/.test(cardCvv)) newErrors.cardCvv = 'CVV must be 3 digits';
    } else if (paymentMethod === 'upi') {
      if (!upiId.trim()) newErrors.upiId = 'UPI ID is required';
      else if (!/^[\w.-]+@[\w]+$/.test(upiId)) newErrors.upiId = 'Enter a valid UPI ID (e.g., name@bank)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!address.fullName || !address.street || !address.city || !address.state || !address.zip) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all address fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!validatePayment()) {
      toast({
        title: 'Invalid payment details',
        description: 'Please check your payment information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onOpen();
  };

  const confirmOrder = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to place an order.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Optionally navigate to login, or just close the modal. Let's just return for now.
      onClose();
      return;
    }

    try {
      const uid = user.id || user.user_id;
      const orderPayload = {
        user_id: uid,
        cart_items: cartItems.map(item => ({ 
          product_id: item.id || item.product_id, 
          quantity: item.quantity, 
          price: item.price 
        })),
        address: address,
        payment_method: paymentMethod,
        total: total
      };

      const res = await fetch('http://127.0.0.1:5000/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Add to local state so UI updates
      const orderInfo = {
         id: data.order_id,
         date: new Date().toISOString().split('T')[0],
         total: total,
         items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
         buyer: address.fullName,
      };
      addOrder(orderInfo);
      
      clearCart();
      onClose();
      toast({
        title: 'Order placed!',
        description: 'Your order has been confirmed. Thank you for shopping with GreenGuard.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/products');
    } catch (err) {
      console.error('Order placement error:', err);
      toast({
        title: 'Order failed',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div style={backgroundStyle}>
        <Container maxW="7xl" py={8}>
          <Box bg="white" borderRadius="lg" boxShadow="2xl" p={8}>
            <Heading mb={4}>Checkout</Heading>
            <Text>Your cart is empty.</Text>
            <Button mt={4} colorScheme="green" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <div style={backgroundStyle}>
      <Container maxW="7xl" py={8}>
        <Box style={glassCard} borderRadius="2xl" p={8}>
          <Heading mb={6} color="white">Checkout</Heading>

          <HStack spacing={4} mb={8} justify="center">
            <StepIndicator step={1} current={step} label="Address" />
            <StepIndicator step={2} current={step} label="Payment" />
            <StepIndicator step={3} current={step} label="Review" />
          </HStack>

          {step === 1 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="white">Shipping Address</Heading>
              <FormControl isRequired>
                <FormLabel color="whiteAlpha.800">Full Name</FormLabel>
                <Input name="fullName" value={address.fullName} onChange={handleAddressChange} style={glassInput} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="whiteAlpha.800">Street Address</FormLabel>
                <Input name="street" value={address.street} onChange={handleAddressChange} style={glassInput} />
              </FormControl>
              <HStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">City</FormLabel>
                  <Input name="city" value={address.city} onChange={handleAddressChange} style={glassInput} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">State</FormLabel>
                  <Input name="state" value={address.state} onChange={handleAddressChange} style={glassInput} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="whiteAlpha.800">ZIP</FormLabel>
                  <Input name="zip" value={address.zip} onChange={handleAddressChange} style={glassInput} />
                </FormControl>
              </HStack>
              <FormControl>
                <FormLabel color="whiteAlpha.800">Country</FormLabel>
                <Select name="country" value={address.country} onChange={handleAddressChange} style={glassInput}>
                  <option value="India" style={{ background: '#2d3748' }}>India</option>
                  <option value="USA" style={{ background: '#2d3748' }}>USA</option>
                  <option value="UK" style={{ background: '#2d3748' }}>UK</option>
                </Select>
              </FormControl>
              <Button colorScheme="green" onClick={() => setStep(2)}>
                Next: Payment
              </Button>
            </VStack>
          )}

          {step === 2 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="white">Payment Method</Heading>
              <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
                <Stack color="white">
                  <Radio value="card">Credit / Debit Card</Radio>
                  <Radio value="upi">UPI</Radio>
                  <Radio value="cod">Cash on Delivery</Radio>
                </Stack>
              </RadioGroup>

              {paymentMethod === 'card' && (
                <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                  <VStack spacing={3}>
                    <FormControl isRequired isInvalid={!!errors.cardNumber}>
                      <FormLabel color="whiteAlpha.800">Card Number</FormLabel>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                        maxLength={19}
                        style={glassInput}
                      />
                      {errors.cardNumber && <FormErrorMessage>{errors.cardNumber}</FormErrorMessage>}
                    </FormControl>
                    <HStack>
                      <FormControl isRequired isInvalid={!!errors.cardExpiry}>
                        <FormLabel color="whiteAlpha.800">Expiry (MM/YY)</FormLabel>
                        <Input
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            setCardExpiry(val);
                          }}
                          maxLength={5}
                          style={glassInput}
                        />
                        {errors.cardExpiry && <FormErrorMessage>{errors.cardExpiry}</FormErrorMessage>}
                      </FormControl>
                      <FormControl isRequired isInvalid={!!errors.cardCvv}>
                        <FormLabel color="whiteAlpha.800">CVV</FormLabel>
                        <Input
                          placeholder="123"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          maxLength={3}
                          type="password"
                          style={glassInput}
                        />
                        {errors.cardCvv && <FormErrorMessage>{errors.cardCvv}</FormErrorMessage>}
                      </FormControl>
                    </HStack>
                  </VStack>
                </Box>
              )}

              {paymentMethod === 'upi' && (
                <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                  <FormControl isRequired isInvalid={!!errors.upiId}>
                    <FormLabel color="whiteAlpha.800">UPI ID</FormLabel>
                    <Input
                      placeholder="username@bank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={glassInput}
                    />
                    {errors.upiId && <FormErrorMessage>{errors.upiId}</FormErrorMessage>}
                  </FormControl>
                </Box>
              )}

              {paymentMethod === 'cod' && (
                <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                  <Text color="white">You'll pay upon delivery. No additional details needed.</Text>
                </Box>
              )}

              <HStack spacing={4}>
                <Button variant="outline" onClick={() => setStep(1)} bg="rgba(255,255,255,0.1)" color="white" borderColor="rgba(255,255,255,0.3)" _hover={{ bg: 'rgba(255,255,255,0.2)' }}>
                  Back
                </Button>
                <Button colorScheme="green" onClick={() => {
                  if (validatePayment()) setStep(3);
                }}>
                  Next: Review
                </Button>
              </HStack>
            </VStack>
          )}

          {step === 3 && (
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="white">Review Your Order</Heading>
              <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                <Text fontWeight="bold" color="white">Shipping to:</Text>
                <Text color="whiteAlpha.800">{address.fullName}</Text>
                <Text color="whiteAlpha.800">{address.street}</Text>
                <Text color="whiteAlpha.800">{address.city}, {address.state} {address.zip}</Text>
                <Text color="whiteAlpha.800">{address.country}</Text>
              </Box>
              <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                <Text fontWeight="bold" color="white">Payment method:</Text>
                <Text color="whiteAlpha.800">
                  {paymentMethod === 'card' ? 'Credit Card (•••• ' + (cardNumber.slice(-4) || '****') + ')' :
                    paymentMethod === 'upi' ? `UPI (${upiId})` :
                      'Cash on Delivery'}
                </Text>
              </Box>
              <Box p={4} bg="rgba(255,255,255,0.05)" borderRadius="md">
                <Text fontWeight="bold" color="white">Items:</Text>
                {cartItems.map(item => (
                  <HStack key={item.id} justify="space-between">
                    <Text color="whiteAlpha.800">{item.name} x {item.quantity}</Text>
                    <Text color="whiteAlpha.800">${(item.price * item.quantity).toFixed(2)}</Text>
                  </HStack>
                ))}
                <Divider my={2} borderColor="rgba(255,255,255,0.2)" />
                <HStack justify="space-between" fontWeight="bold">
                  <Text color="white">Total:</Text>
                  <Text color="white">${total.toFixed(2)}</Text>
                </HStack>
              </Box>
              <HStack spacing={4}>
                <Button variant="outline" onClick={() => setStep(2)} bg="rgba(255,255,255,0.1)" color="white" borderColor="rgba(255,255,255,0.3)" _hover={{ bg: 'rgba(255,255,255,0.2)' }}>
                  Back
                </Button>
                <Button colorScheme="green" size="lg" onClick={handlePlaceOrder}>
                  Place Order
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Confirm Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to place this order?</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={confirmOrder}>
              Confirm Order
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const StepIndicator = ({ step, current, label }) => {
  const isActive = step === current;
  const isPast = step < current;
  const bg = isActive ? 'green.500' : isPast ? 'green.200' : 'gray.200';
  return (
    <VStack>
      <Box w="40px" h="40px" borderRadius="full" bg={bg} color="white" display="flex" alignItems="center" justifyContent="center">
        {step}
      </Box>
      <Text fontSize="sm" color="white">{label}</Text>
    </VStack>
  );
};

export default Checkout;