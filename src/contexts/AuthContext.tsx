import React, { createContext, useContext, useState, useEffect } from 'react'
import { blink } from '../blink/client'

interface User {
  id: string
  username: string
  role: 'cashier' | 'manager' | 'gm'
  fullName: string
  email?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    try {
      const storedUser = localStorage.getItem('nightclub_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error loading stored user:', error)
      localStorage.removeItem('nightclub_user')
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Query the users table for authentication
      const users = await blink.db.users.list({
        where: { 
          username: username,
          password_hash: password, // In production, this should be properly hashed
          is_active: "1"
        }
      })

      if (users.length > 0) {
        const userData = users[0]
        const user: User = {
          id: userData.id,
          username: userData.username,
          role: userData.role as 'cashier' | 'manager' | 'gm',
          fullName: userData.full_name,
          email: userData.email
        }
        
        setUser(user)
        localStorage.setItem('nightclub_user', JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('nightclub_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}