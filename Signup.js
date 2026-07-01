import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, Heading } from "@chakra-ui/react";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert("Signup successful! Please login to continue.");
        navigate("/login");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration error. Check network connection.");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg">
      <Heading mb="4" textAlign="center">Sign Up</Heading>
      <form onSubmit={handleSignup}>
        <Input mb="3" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <Input mb="3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input mb="3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="green" type="submit" w="full">Sign Up</Button>
      </form>
    </Box>
  );
};

export default Signup;