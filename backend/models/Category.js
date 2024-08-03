
import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    sequence: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    }
}, {
    timestamps: true
})

const Category = mongoose.model('Category', categorySchema)

export default Category
