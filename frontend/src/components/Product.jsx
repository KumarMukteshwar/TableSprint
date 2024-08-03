import React, { useState, useEffect, useContext } from "react";
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Image,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../Context/Context";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { FaHome, FaList, FaLayerGroup, FaBox, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios';

const Product = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({ productName: '', category: '', status: 'active', image: null });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/product', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/v1/category', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setNewProduct({ productName: '', category: '', status: 'active', image: null });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const formData = new FormData();
      formData.append('productName', newProduct.productName);
      formData.append('category', newProduct.category);
      formData.append('status', newProduct.status);
      formData.append('image', newProduct.image);

      if (editingProduct) {
        await axios.put(`/api/v1/product/${editingProduct._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast({
          title: "Product updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post('/api/v1/product', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast({
          title: "Product added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setNewProduct({ ...product, image: null });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/v1/product/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchProducts();
        toast({
          title: "Product deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
        bg="#662671"
      >
        <Flex align="center" mr={5}>
          <img
            height="50px"
            width="155rem"
            src="/Group.png"
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
            <FaBox size="24px" style={{marginRight: '10px'}} />
            <Text fontSize="2xl" fontWeight="bold" mr={4}>Products</Text>
            <Input
              placeholder="Search products"
              onChange={(e) => handleSearch(e.target.value)}
              width="200px"
              mr={4}
            />
            <Button leftIcon={<FaPlus />} onClick={handleAddProduct}>
              Add Product
            </Button>
          </Flex>
          {loading ? (
            <Text>Loading...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Product Name</Th>
                  <Th>Image</Th>
                  <Th>Sequence</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {categories.filter(category => 
                  category.categoryName.toLowerCase().includes(searchText.toLowerCase())
                ).map((category) => (
                  <Tr key={category._id}>
                    <Td>{category._id}</Td>
                    <Td>{category.categoryName}</Td>
                    <Td><Image src={category.image} alt={category.categoryName} boxSize="50px" objectFit="cover" /></Td>
                    <Td>{category.sequence}</Td>
                    <Td>{category.status}</Td>
                    <Td>
                      <Button size="sm" mr={2} leftIcon={<FaEdit />} onClick={() => handleEdit(category)}>Edit</Button>
                      <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} onClick={() => handleDelete(category._id)}>Delete</Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent textAlign="center">
          <ModalHeader>Logout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Image
                src={user?.avatar || "/Group1.png"}
                alt="User Avatar"
                boxSize="100px"
                borderRadius="full"
                margin="auto"
              />
              <Text fontWeight="bold" fontSize="xl" textAlign="center">
                {user?.name}
              </Text>
              <Text textAlign="center">{user?.email}</Text>
              <Text>Are you sure you want to logout?</Text>
              <HStack justifyContent="center">
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

      <Modal isOpen={isModalVisible} onClose={handleModalCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingProduct ? 'Edit Product' : 'Add Product'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Product Name"
                value={newProduct.productName}
                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
              />
              <Select
                placeholder="Select Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Select>
              <Select
                value={newProduct.status}
                onChange={(e) => setNewProduct({ ...newProduct, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
              />
            </VStack>
          </ModalBody>
          <Flex justifyContent="flex-end" p={3}>
            <Button colorScheme="blue" mr={3} onClick={handleModalOk}>
              Save
            </Button>
            <Button variant="ghost" onClick={handleModalCancel}>Cancel</Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Product;
