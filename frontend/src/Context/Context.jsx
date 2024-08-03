import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
const navigate=useNavigate()
useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== null) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing stored user data:', error.message)
        localStorage.removeItem('user') // Remove invalid data
        setIsLoggedIn(false)
        navigate('/login')
      }
    } else {
      setIsLoggedIn(false)
      navigate('/login')
    }
  }, [])
  

  const login = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const signup = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
