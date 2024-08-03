import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const router = express.Router()

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, name, password } = req.body
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const newUser = new User({
      email,
      name,
      password: hashedPassword
    })

    await newUser.save()

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.status(201).json({ token, userId: newUser._id })
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error: error.message })
  }
})

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ token, userId: user._id })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
})

router.get("/logout",(req,res)=>{
  req.userData=null
})

export default router
