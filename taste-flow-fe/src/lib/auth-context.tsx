'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { TokenSession } from '@/lib/http'
import { RegisterRes } from '@/utils/type'



type AuthContextType = {
  user: RegisterRes | null
  setUser: (user: RegisterRes | null) => void
  token: string | null
  setToken: (token: string | null) => void
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  token: initialTokenFromServer,
}: {
  children: React.ReactNode
  token: string | null
}) {
  const [user, setUser] = useState<RegisterRes | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = () => {
    setUser(null)
    setToken(null)
    TokenSession.value = ''
    localStorage.removeItem('token')
  }

  useEffect(() => {
    let tokenToUse = initialTokenFromServer

    if (typeof window !== 'undefined') {
      const sessionToken = localStorage.getItem('token')
      if (!tokenToUse && sessionToken) {
        tokenToUse = sessionToken
      }

      if (tokenToUse) {
        try {
          setToken(tokenToUse)
          TokenSession.value = tokenToUse
        } catch (err) {
          console.error('Invalid token', err)
          logout()
        }
      } else {
        logout()
      }

      setIsLoading(false)
    }
  }, [initialTokenFromServer])

  useEffect(() => {
    if (token && typeof window !== 'undefined') {
      TokenSession.value = token
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{ user, setUser, token, setToken, isLoading, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
