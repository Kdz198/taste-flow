'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Search, Bell, Bookmark, ShoppingCart, User, Heart, Settings, LogOut } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useLogout } from '@/hook/useAuth'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'

import { clearAddQueue } from '@/store/slice/slice-add-cart'
import { setCart } from '@/store/slice/slice-cart'
import cartApi from '@/apiRequest/cart'
import { AddToCartRequest } from '@/utils/type'
import { toast } from 'sonner'

export default function HeaderClient() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const dispatch = useDispatch()
  const cartQuantity = useSelector((state: RootState) => state.cart.quantity)
  const itemsToAdd = useSelector((state: RootState) => state.cartAdd.itemsToAdd)
  const handleLogout = useLogout(() => {
    router.push('/login')
  })

  const handleCartClick = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (itemsToAdd.length === 0) {
      router.push('/cart')
      return
    }
    try {
      if (Object.keys(itemsToAdd).length > 0) {
        const body: AddToCartRequest = {
          userId: user.id,
          itemsToAdd
        }

        await cartApi.addToCart(body)
        dispatch(clearAddQueue())
      }

      const res = await cartApi.getCart(user.id)
      dispatch(setCart(res.payload))
      toast.success('Update cart successfully!')
      router.push('/cart')
    } catch (error) {
      console.error('Failed to sync cart:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl animate-pulse" />
        <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl animate-pulse" />
        <div className="w-10 h-10 bg-[#2A2A2A] rounded-xl animate-pulse" />
        <div className="w-10 h-10 bg-[#2A2A2A] rounded-full animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Search Icon for Mobile */}
      <Button
        variant="ghost"
        className="lg:hidden text-[#858787] hover:text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <Search size={18} />
      </Button>

      {/* Notification Bell */}
      <Button
        variant="ghost"
        className="relative text-[#858787] hover:text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <Bell size={18} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#F26D16] rounded-full flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
        </span>
      </Button>

      {/* Bookmarks */}
      <Link href="/profile/favorites">
        <Button
          variant="ghost"
          className="text-[#858787] hover:text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
        >
          <Bookmark size={18} />
        </Button>
      </Link>

      {/* Shopping Cart */}
      <Button
        onClick={handleCartClick}
        variant="ghost"
        className="relative text-[#858787] hover:text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        <ShoppingCart size={18} />
        {cartQuantity > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F26D16] rounded-full flex items-center justify-center text-xs font-bold text-white">
            {cartQuantity}
          </span>
        )}
      </Button>

      {/* Profile Dropdown */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative cursor-pointer ml-2">
              <Avatar className="w-10 h-10 ring-2 ring-[#2A2A2A] hover:ring-[#F26D16]/40 transition-all duration-300">
                <AvatarImage src="https://wallpaperaccess.com/full/3692914.jpg" />
                <AvatarFallback className="bg-[#F26D16] text-white font-semibold">JD</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1B1B1B]" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-[#2A2A2A] border-[#3A3A3A] text-white mr-4 mt-2">
            <DropdownMenuLabel className="text-[#F26D16] font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3A3A3A]" />

            <Link href="/profile/information">
              <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>

            <Link href="/profile/favoriterecipes">
              <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites Recipes</span>
              </DropdownMenuItem>
            </Link>

            <Link href="/profile/accountsettings">
              <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-[#3A3A3A]" />

            <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#3A3A3A]" />

            <DropdownMenuItem
              onClick={() => handleLogout.mutate()}
              className="hover:bg-red-600 cursor-pointer text-red-400 hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="outline"
            className="text-[#F26D16] border-[#F26D16] hover:bg-[#F26D16]/10 hover:text-[#F26D16] transition-all duration-300"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            variant="outline"
            className="text-[#F26D16] border-[#F26D16] hover:bg-[#F26D16]/10 hover:text-[#F26D16] transition-all duration-300"
            asChild
          >
            <Link href="/register">Sign Up</Link>
          </Button>
        </>
      )}
    </div>
  )
}