import React from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './Context/Context'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Categories from './components/Categories'
import SubCategory from './components/SubCategory'
import Product from './components/Product'
import AddCategory from './components/AddCategory'
// import Subcategories from './components/Subcategories'
// import Products from './components/Products'

function App() {
  return (
    <ChakraProvider>
        <Router>
      <AuthProvider>
          <Box>
            <Routes>
              {/* <Route path="/" element={<Navigate to="/signup" />} /> */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/subcategory" element={<SubCategory />} />
              <Route path="/products" element={<Product />} />
              <Route path="/products" element={<AddCategory/>} />

          
            </Routes>
          </Box>
      </AuthProvider>
        </Router>
    </ChakraProvider>
  )
}

export default App