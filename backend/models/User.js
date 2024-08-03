import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

userSchema.methods.verifyPassword=async function(pwd,pwdDb){
    return await bcrypt.compare(pwd,pwdDb)
}

const User = mongoose.model('User', userSchema)

export default User
