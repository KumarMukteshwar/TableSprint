import React, { useState, useContext } from "react";
import {
  Box,
  Flex,
  Spacer,
  Avatar,
  useDisclosure,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Button,
  Link,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../Context/Context";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FaHome, FaList, FaLayerGroup, FaBox, FaPlus } from "react-icons/fa";
import axios from "axios";

const AddCategory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [category, setCategory] = useState({
    categoryName: "",
    image: null,
    sequence: "",
    status: "active",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("categoryName", category.categoryName);
      formData.append("image", category.image);
      formData.append("sequence", category.sequence);
      formData.append("status", category.status);

      const response = await axios.post("/api/v1/category", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        toast({
          title: "Category added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/categories");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error adding category",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column">
      {/* Top Navbar */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.5rem"
        bg="gray.100"
      >
        <Flex align="center" mr={5}>
          <img
            height="50px"
            width="155rem"
            src="https://tablesprint.com/_next/image?url=%2Fimg%2Flogo-white.png&w=1920&q=75"
            alt=""
          />
        </Flex>
        <Spacer />
        <Box>
          <Avatar
            name={user?.name}
            src={user?.avatar}
            onClick={onOpen}
            cursor="pointer"
          />
        </Box>
      </Flex>

      <Flex>
        {/* Vertical Menu */}
        <Box width="250px" bg="gray.100" minHeight="calc(100vh - 80px)" p={4}>
          <VStack spacing={4} align="stretch">
            <Link
              as={RouterLink}
              to="/dashboard"
              _hover={{ textDecoration: "none" }}
            >
              <HStack>
                <FaHome />
                <Text>Dashboard</Text>
              </HStack>
            </Link>
            <Link
              as={RouterLink}
              to="/categories"
              _hover={{ textDecoration: "none" }}
            >
              <HStack>
                <FaList />
                <Text>Category</Text>
              </HStack>
            </Link>
            <Link
              as={RouterLink}
              to="/subcategory"
              _hover={{ textDecoration: "none" }}
            >
              <HStack>
                <FaLayerGroup />
                <Text>Subcategory</Text>
              </HStack>
            </Link>
            <Link
              as={RouterLink}
              to="/products"
              _hover={{ textDecoration: "none" }}
            >
              <HStack>
                <FaBox />
                <Text>Products</Text>
              </HStack>
            </Link>
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={5}>
          <Flex mb={4} alignItems="center">
            <FaPlus size="24px" style={{marginRight: '10px'}} />
            <Text fontSize="2xl" fontWeight="bold">Add Category</Text>
          </Flex>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input
                  name="categoryName"
                  value={category.categoryName}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Image</FormLabel>
                <Input
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setCategory({ ...category, image: file });
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sequence</FormLabel>
                <Input
                  name="sequence"
                  type="number"
                  value={category.sequence}
                  onChange={handleInputChange}
                  placeholder="Enter sequence number"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={category.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
                Add Category
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader>Logout</ModalHeader>
          <Text>Are you sure you want to logout?</Text>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontWeight="bold" fontSize="xl" textAlign="center">
                {user?.name}
              </Text>
              <Text textAlign="center">{user?.email}</Text>
              <HStack>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  variant="solid"
                  onClick={handleLogout}
                >
                  Confirm
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AddCategory;
