// File: src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')))

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    sessionStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  const isAuthenticated = !!user || !!sessionStorage.getItem('user')

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
