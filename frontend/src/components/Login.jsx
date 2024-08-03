import React, { useState, useContext } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Flex,
  Image,
  Center
} from '@chakra-ui/react'
import { AuthContext } from '../Context/Context'
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  let toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      login(user);
      navigate('/dashboard');
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "An error occurred during login",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minHeight="100vh">
      <Center flexDirection="column" mb={8}>
        <Image src="/logo.jpg" alt="TableSprint Logo" width="150px" mb={4} />
        <Heading as="h2" size="xl" textAlign="center">
          Welcome 
        </Heading>
      </Center>
      <Flex width="800px" boxShadow="lg" borderRadius="md" overflow="hidden">
        <Box flex="1" p={8}>
          <VStack spacing={4} align="stretch">
            <Heading as="h1" size="xl" textAlign="center">
              Login
            </Heading>
            <form onSubmit={handleSubmit}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl id="password" isRequired mt={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" mt={4}>
                Log in
              </Button>
            </form>
            <Text textAlign="center">
              Don't have an account?{' '}
              <RouterLink to="/signup" style={{ color: 'blue.500' }}>
                Sign up
              </RouterLink>
            </Text>
          </VStack>
        </Box>
        <Box flex="1">
          <Image src="/iogin.png" alt="Login" objectFit="cover" height="100%" />
        </Box>
      </Flex>
    </Flex>
  )
}

export default Login
