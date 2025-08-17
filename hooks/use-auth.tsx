"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  username: string | null
  login: (username: string, role: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem("isAuthenticated")
      const role = sessionStorage.getItem("userRole")
      const user = sessionStorage.getItem("username")

      if (authStatus === "true" && role && user) {
        setIsAuthenticated(true)
        setUserRole(role)
        setUsername(user)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (username: string, role: string) => {
    sessionStorage.setItem("isAuthenticated", "true")
    sessionStorage.setItem("userRole", role)
    sessionStorage.setItem("username", username)
    setIsAuthenticated(true)
    setUserRole(role)
    setUsername(username)
  }

  const logout = () => {
    sessionStorage.removeItem("isAuthenticated")
    sessionStorage.removeItem("userRole")
    sessionStorage.removeItem("username")
    setIsAuthenticated(false)
    setUserRole(null)
    setUsername(null)
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        username,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
