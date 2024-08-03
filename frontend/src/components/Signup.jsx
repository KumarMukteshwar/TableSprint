import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/Context";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Center,
  Heading,
  Text,
  Link,
  useToast,
  Flex,
  Image,
} from "@chakra-ui/react";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/auth/signup", {
        name,
        email,
        password,
      });
      signup(response.data);
      navigate("/login");
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        title: "An error occurred.",
        description:
          error.response?.data?.message || "Unable to create account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex direction="column" align="center" marginTop="50px" justify="center" minHeight="100vh">
      <Center flexDirection="column" mb={8}>
        <Image src="/logo.jpg" alt="TableSprint Logo" width="150px" mb={4} />
        <Heading as="h2" size="xl" textAlign="center">
          Welcome 
        </Heading>
      </Center>
    <Flex maxWidth="800px" margin="auto" mt={8} justifyContent="space-between">
      
      <Box width="50%">
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Sign Up</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>
          <Text>
            Already have an account?{" "}
            <Link color="blue.500" href="/login">
              Log in
            </Link>
          </Text>
        </VStack>
      </Box>
      <Box width="45%">
        <Image
          src="/iogin.png"
          alt="Sign Up Image"
          height="100%"
          width="100%"
        />
      </Box>
    </Flex>
    </Flex>
  );
};

export default Signup;
