import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Input, Button, Heading } from "@chakra-ui/react";
import UserContext from "../../context/UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUser(data.user);
        alert("Login successful!");
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to server");
    }
  };

  return (
    <Box maxW="md" mx="auto" mt="10" p="6" borderWidth="1px" borderRadius="lg">
      <Heading mb="4" textAlign="center">Login</Heading>
      {error && <Box color="red.500" mb="3">{error}</Box>}
      <form onSubmit={handleLogin}>
        <Input mb="3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input mb="3" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button colorScheme="green" type="submit" w="full">Login</Button>
      </form>
    </Box>
  );
};

export default Login;