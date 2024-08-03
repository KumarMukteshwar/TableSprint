import express from 'express'
import SubCategory from '../models/SubCategory.js'
import auth from '../middlewares/auth.js'
import upload from '../middlewares/upload.js'

const router = express.Router()

// Create a new subcategory
router.post('/', auth,upload.single("image"),async (req, res) => {
  try {
    const subcategory = new SubCategory({
        category: req.body.category,
        subCategoryName: req.body.subCategoryName,
        status: req.body.status,
        image: req.file.path,
        sequence: req.body.sequence
    })
    await subcategory.save()
    res.status(201).json(subcategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Get all subcategories
router.get('/', auth,async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('category status sequence')
    res.json(subcategories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get a specific subcategory by ID
router.get('/:id', auth,async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate('category status')
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    res.json(subcategory)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update a subcategory
router.patch('/:id', auth,upload.single("image"),async (req, res) => {
  try {
    const subcategory = await SubCategory.findByIdAndUpdate(req.params.id,{
        category: req.body.category,
        subCategoryName: req.body.subCategoryName,
        status: req.body.status,
        image: req.file.path,
        sequence: req.body.sequence
    }, { new: true, runValidators: true })
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    res.json(subcategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete a subcategory
router.delete('/:id', auth,async (req, res) => {
  try {
    const subcategory = await SubCategory.findByIdAndDelete(req.params.id)
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' })
    }
    res.json({ message: 'Subcategory deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
