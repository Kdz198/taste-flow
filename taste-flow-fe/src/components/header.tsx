import React from 'react';
import { Button } from './ui/button';
import { ShoppingCart, Bookmark, Search, User, Settings, Heart, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  return (
    <header className="bg-[#1B1B1B] text-white shadow-lg border-b border-[#2A2A2A]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-8">
        
        {/* Logo + Menu */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <img
                  src="https://wallpaperaccess.com/full/3692914.jpg"
                  alt="Forkful Logo"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#F26D16]/20 group-hover:ring-[#F26D16]/40 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-[#F26D16]/0 group-hover:bg-[#F26D16]/10 transition-all duration-300"></div>
              </div>
              <h1 className="text-2xl font-bold text-[#F26D16] group-hover:text-orange-400 transition-colors duration-300">
                Forkful
              </h1>
            </div>
          </Link>

          {/* Menu items */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <Link href="/popular" className="text-[#858787] hover:text-[#F26D16] transition-colors duration-300 relative group">
              Popular
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26D16] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/meat-seafood" className="text-[#858787] hover:text-[#F26D16] transition-colors duration-300 relative group">
              Meat & Seafood
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26D16] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/healthy-diet" className="text-[#858787] hover:text-[#F26D16] transition-colors duration-300 relative group">
              Healthy & Diet
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F26D16] group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
        </div>

        {/* Search Bar - Center */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858787]" />
            <input
              type="text"
              placeholder="Search recipes, ingredients..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl text-white placeholder-[#858787] focus:border-[#F26D16] focus:outline-none focus:ring-2 focus:ring-[#F26D16]/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Icons Section */}
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
            variant="ghost"
            className="relative text-[#858787] hover:text-white bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2.5 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-105"
          >
            <ShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F26D16] rounded-full flex items-center justify-center text-xs font-bold text-white">
              3
            </span>
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer ml-2">
                <Avatar className="w-10 h-10 ring-2 ring-[#2A2A2A] hover:ring-[#F26D16]/40 transition-all duration-300">
                  <AvatarImage src="https://wallpaperaccess.com/full/3692914.jpg" />
                  <AvatarFallback className="bg-[#F26D16] text-white font-semibold">JD</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1B1B1B]"></div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-[#2A2A2A] border-[#3A3A3A] text-white mr-4 mt-2">
              <DropdownMenuLabel className="text-[#F26D16] font-semibold">
                My Account
              </DropdownMenuLabel>
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
              
              <DropdownMenuItem className="hover:bg-[#3A3A3A cursor-pointer">
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="hover:bg-[#3A3A3A] cursor-pointer">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-[#3A3A3A]" />
              
              <DropdownMenuItem className="hover:bg-red-600 cursor-pointer text-red-400 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}