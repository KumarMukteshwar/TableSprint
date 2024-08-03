import express from 'express'
import Product from '../models/Product.js'
import upload from '../middlewares/upload.js'
import auth from '../middlewares/auth.js'

const router = express.Router()

// Create a new product
router.post('/',auth ,upload.single("image"),async (req, res) => {
  try {
    const product = new Product({
        productName: req.body.productName,
        category: req.body.category,
        subCategory: req.body.subCategory,
        status: req.body.status,
        image: req.file.path
    })
    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all products
router.get('/', auth,async (req, res) => {
  try {
    const products = await Product.find().populate('category').populate('subCategory').populate('status')
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific product
router.get('/:id', auth,async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category').populate('subCategory').populate('status')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update a product
router.put('/:id', auth,upload.single("image"),async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        productName: req.body.productName,
        category: req.body.category,
        subCategory: req.body.subCategory,
        status: req.body.status,
        image: req.file.path
    }, { new: true })
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(updatedProduct)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a product
router.delete('/:id', auth,async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
