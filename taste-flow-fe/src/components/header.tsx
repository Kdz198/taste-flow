import React from 'react';
import { Button } from './ui/button';
import { ShoppingCart, Bookmark, Search } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-[#1B1B1B] text-white shadow-md  ">
      <nav className="max-w-8xl mx-auto flex items-center justify-between py-4 px-6 md:px-10 ">

        {/* Logo + Menu */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://wallpaperaccess.com/full/3692914.jpg"
                alt="Forkful Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-2xl font-bold text-orange-500">Forkful</h1>
            </div>

          </Link>
          {/* Menu items */}
          <div className="hidden md:flex space-x-6 text-md text-gray-400">
            <a href="#" className="hover:text-orange-400 transition">Popular</a>
            <a href="#" className="hover:text-orange-400 transition">Meat & Seafood</a>
            <a href="#" className="hover:text-orange-400 transition">Healthy & Diet</a>
          </div>
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-3">
          {[Search, Bookmark, ShoppingCart].map((Icon, i) => (
            <Button
              key={i}
              variant="ghost"
              className="text-gray-400 hover:text-white bg-[#2B2B2B] hover:bg-[#3A3A3A] p-2 rounded-full w-10 h-10 flex items-center justify-center transition"
            >
              <Icon size={20} />
            </Button>
          ))}
          <div>
            <Link href="/auth/login" className="text-gray-400 hover:text-white transition">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md transition">
                Sign In
              </Button>
            </Link>

          </div>
        </div>

      </nav>
    </header>
  );
}
