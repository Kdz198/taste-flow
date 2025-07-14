'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { TokenSession } from '@/lib/http'
import { RegisterRes } from '@/utils/type'
import meRequest from '@/apiRequest/me'
import { useDispatch } from 'react-redux'
import cartApi from '@/apiRequest/cart'
import { setCart } from '@/store/slice/slice-cart'


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
  children: ReactNode
  token: string | null
}) {
  const [user, setUser] = useState<RegisterRes | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const logout = () => {
    setUser(null)
    setTokenState(null)
    TokenSession.value = ''
    TokenSession.expiresAt = new Date().toISOString()

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('token_expires_at')
    }
  }

  const setToken = (value: string | null) => {
    setTokenState(value)
    TokenSession.value = value ?? ''

    const expiresAt = value
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : new Date().toISOString()

    TokenSession.expiresAt = expiresAt

    if (typeof window !== 'undefined') {
      if (value) {
        localStorage.setItem('token', value)
        localStorage.setItem('token_expires_at', expiresAt)
      } else {
        localStorage.removeItem('token')
        localStorage.removeItem('token_expires_at')
      }
    }
  }


  useEffect(() => {
    if (typeof window === 'undefined') return

    const localToken = localStorage.getItem('token')
    const localExpiresAt = localStorage.getItem('token_expires_at')
    const isExpired = localExpiresAt && localExpiresAt < new Date().toISOString()

    const tokenToUse = initialTokenFromServer || (!isExpired ? localToken : null)

    if (tokenToUse) {
      setToken(tokenToUse)
    } else {
      logout()
    }

    setIsLoading(false)
  }, [initialTokenFromServer])


  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleFocus = () => {
      const localToken = localStorage.getItem('token')
      const localExpiresAt = localStorage.getItem('token_expires_at')
      const isExpired = localExpiresAt && localExpiresAt < new Date().toISOString()

      if (!isExpired && localToken && TokenSession.value !== localToken) {
        TokenSession.value = localToken
        TokenSession.expiresAt = localExpiresAt ?? ''
        setTokenState(localToken)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])


  useEffect(() => {
    if (!token || user) return

    const fetchUser = async () => {
      try {
        const res = await meRequest.get()
        if (res.payload) {
          setUser(res.payload)
          const cartRes = await cartApi.getCart(res.payload.id);
          dispatch(setCart(cartRes.payload))
        }
      } catch (err) {
        console.error('Failed to fetch user from token:', err)
      }
    }

    fetchUser()
  }, [token])


  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isLoading,
        logout,
      }}
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