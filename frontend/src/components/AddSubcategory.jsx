import React, { useState, useContext, useEffect } from "react";
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

const AddSubcategory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [subcategory, setSubcategory] = useState({
    subCategoryName: "",
    category: "",
    image: null,
    sequence: "",
    status: "active",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/v1/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubcategory({ ...subcategory, [name]: value });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("subCategoryName", subcategory.subCategoryName);
      formData.append("category", subcategory.category);
      formData.append("image", subcategory.image);
      formData.append("sequence", subcategory.sequence);
      formData.append("status", subcategory.status);

      const response = await axios.post("/api/v1/subcategory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        toast({
          title: "Subcategory added successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/subcategory");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast({
        title: "Error adding subcategory",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex direction="column">
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
        <Box width="250px" bg="gray.100" minHeight="calc(100vh - 80px)" p={4}>
          <VStack spacing={4} align="stretch">
            <Link as={RouterLink} to="/dashboard" _hover={{ textDecoration: "none" }}>
              <HStack>
                <FaHome />
                <Text>Dashboard</Text>
              </HStack>
            </Link>
            <Link as={RouterLink} to="/categories" _hover={{ textDecoration: "none" }}>
              <HStack>
                <FaList />
                <Text>Category</Text>
              </HStack>
            </Link>
            <Link as={RouterLink} to="/subcategory" _hover={{ textDecoration: "none" }}>
              <HStack>
                <FaLayerGroup />
                <Text>Subcategory</Text>
              </HStack>
            </Link>
            <Link as={RouterLink} to="/products" _hover={{ textDecoration: "none" }}>
              <HStack>
                <FaBox />
                <Text>Products</Text>
              </HStack>
            </Link>
          </VStack>
        </Box>

        <Box flex={1} p={5}>
          <Flex mb={4} alignItems="center">
            <FaPlus size="24px" style={{marginRight: '10px'}} />
            <Text fontSize="2xl" fontWeight="bold">Add Subcategory</Text>
          </Flex>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Subcategory Name</FormLabel>
                <Input
                  name="subCategoryName"
                  value={subcategory.subCategoryName}
                  onChange={handleInputChange}
                  placeholder="Enter subcategory name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  name="category"
                  value={subcategory.category}
                  onChange={handleInputChange}
                  placeholder="Select category"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Sequence</FormLabel>
                <Input
                  name="sequence"
                  type="number"
                  value={subcategory.sequence}
                  onChange={handleInputChange}
                  placeholder="Enter sequence number"
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
                    setSubcategory({ ...subcategory, image: file });
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={subcategory.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormControl>

              <Button type="submit" colorScheme="blue" leftIcon={<FaPlus />}>
                Add Subcategory
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

export default AddSubcategory;
