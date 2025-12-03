'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthUser, LoginPayload, RegisterPayload } from '@/types/services/auth'
import { authService } from '@/modules/services/auth-service'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (credentials: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)

  // On mount -> check session
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await authService.refreshToken() // refresh token via HTTP-only cookie
        setUser(res.user)
      } catch (error: any) {
        console.log('there something wrong wtf', error)
        if (error.response?.status === 401 || error.response?.status === 400) {
          setUser(null)
        } else {
          console.error('Session check failed:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }
    checkUserSession()
  }, [])

  const login = async (credentials: LoginPayload) => {
    const res = await authService.login(credentials)
    setUser(res.user)
  }

  const logout = async () => {
    await authService.logout() // Backend clears refresh cookie
    setUser(null)
    window.location.href = '/login' // Redirect to login page
  }

  const register = async (payload: RegisterPayload) => {
    await authService.register(payload)
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
