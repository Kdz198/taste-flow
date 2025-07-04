
import React  from 'react';
import { Search, } from 'lucide-react';
import Link from 'next/link';
import HeaderClient from './headerClinet';


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
            <Link href="/menu" className="text-[#858787] hover:text-[#F26D16] transition-colors duration-300 relative group">
             Menu
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
        <HeaderClient/>
      </nav>
    </header>
  );
}