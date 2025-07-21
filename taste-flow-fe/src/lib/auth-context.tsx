'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react'
import { TokenSession } from '@/lib/http'
import { RegisterRes } from '@/utils/type'
import meRequest from '@/apiRequest/me'
import cartApi from '@/apiRequest/cart'
import { useDispatch } from 'react-redux'
import cartSlice, { setCart } from '@/store/slice/slice-cart'

type AuthContextType = {
  user: RegisterRes | null
  setUser: (user: RegisterRes | null) => void
  isLoading: boolean,
  setIsLoading: (loading: boolean) => void
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
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()

  // Gán token từ server khi F5 / reload
  useEffect(() => {
    console.log(1)
    if (initialTokenFromServer && typeof window !== 'undefined') {
      TokenSession.value = initialTokenFromServer
      TokenSession.expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // tùy logic set thời hạn
    }
  }, [initialTokenFromServer])

  useEffect(() => {
    const fetchUser = async () => {

      if (user || !TokenSession.value) return
      try {
        console.log(2)
        const res = await meRequest.get()
        if (res.payload) {
          setUser(res.payload)
          const cartRes = await cartApi.getCart(res.payload.id)
          dispatch(setCart(cartRes.payload))
        }
      } catch (err) {
        console.error('Failed to fetch user from token:', err)
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [user])

  const logout = () => {
    setUser(null)
    TokenSession.value = ''
    TokenSession.expiresAt = new Date().toISOString();
    // Xóa giỏ hàng khi logout
    dispatch(cartSlice.actions.clearCart())
  }
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
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
