import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js'
import categoryRouter from './routes/categoryRoutes.js'
import subcategoryRouter from './routes/subcategoryRoutes.js'
import connectDB from './config/db.js'
connectDB()


const app = express()

app.use(cors())
app.use(express.json())

// Routes will be added here
app.use('/api/v1/auth', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/subcategory', subcategoryRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

export default app
