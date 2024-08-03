import mongoose from 'mongoose'


const subCategorySchema = new mongoose.Schema({
  subCategoryName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  status: {
    type: String,
    ref: 'Category',
    required: true
  },
  image:{
    type: String,
    required: true
  },
  sequence: {
    type: String,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
})

const SubCategory = mongoose.model('SubCategory', subCategorySchema)

export default SubCategory
