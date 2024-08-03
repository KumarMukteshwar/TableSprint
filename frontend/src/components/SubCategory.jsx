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

const SubCategory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({ subCategoryName: '', image: null, sequence: '', status: 'active' });
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const fetchSubcategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/v1/category', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setError('Failed to fetch subcategories. Please try again.');
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

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setNewSubcategory({ subCategoryName: '', image: null, sequence: '', status: 'active' });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const formData = new FormData();
      formData.append('subCategoryName', newSubcategory.subCategoryName);
      formData.append('image', newSubcategory.image);
      formData.append('sequence', newSubcategory.sequence);
      formData.append('status', newSubcategory.status);

      if (editingSubcategory) {
        await axios.put(`/api/v1/category/${editingSubcategory._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast({
          title: "Subcategory updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await axios.post('/api/v1/category', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast({
          title: "Subcategory added",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalVisible(false);
      fetchSubcategories();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      toast({
        title: "Error",
        description: "Failed to save subcategory",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setNewSubcategory({ ...subcategory, image: null });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await axios.delete(`/api/v1/category/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchSubcategories();
        toast({
          title: "Subcategory deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        toast({
          title: "Error",
          description: "Failed to delete subcategory",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
            <FaLayerGroup size="24px" style={{marginRight: '10px'}} />
            <Text fontSize="2xl" fontWeight="bold" mr={4}>Subcategory</Text>
            <Input
              placeholder="Search subcategories"
              onChange={(e) => handleSearch(e.target.value)}
              width="200px"
              mr={4}
            />
            <Button leftIcon={<FaPlus />} onClick={handleAddSubcategory}>
              Add Subcategory
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
                  <Th>Subcategory Name</Th>
                  <Th>Image</Th>
                  <Th>Sequence</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {subcategories.filter(subcategory => 
                  subcategory.categoryName.toLowerCase().includes(searchText.toLowerCase())
                ).map((subcategory) => (
                  <Tr key={subcategory._id}>
                    <Td>{subcategory._id}</Td>
                    <Td>{subcategory.categoryName}</Td>
                    <Td><Image src={subcategory.image} alt={subcategory.categoryName} boxSize="50px" objectFit="cover" /></Td>
                    <Td>{subcategory.sequence}</Td>
                    <Td>{subcategory.status}</Td>
                    <Td>
                      <Button size="sm" mr={2} leftIcon={<FaEdit />} onClick={() => handleEdit(subcategory)}>Edit</Button>
                      <Button size="sm" colorScheme="red" leftIcon={<FaTrash />} onClick={() => handleDelete(subcategory._id)}>Delete</Button>
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
          <ModalHeader>{editingSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Input
                placeholder="Subcategory Name"
                value={newSubcategory.subCategoryName}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, subCategoryName: e.target.value })}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewSubcategory({ ...newSubcategory, image: e.target.files[0] })}
              />
              <Input
                placeholder="Sequence"
                type="number"
                value={newSubcategory.sequence}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, sequence: e.target.value })}
              />
              <Select
                value={newSubcategory.status}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
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

export default SubCategory;
