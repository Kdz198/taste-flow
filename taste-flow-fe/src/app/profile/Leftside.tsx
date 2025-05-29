"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User, Settings, Heart, BookOpen, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Leftside() {
  const [activeItem, setActiveItem] = useState<string>('Personal Info');
  const menuItems = [
    { icon: User, label: 'Personal Info', active: true, route: '/profile/information' },
    { icon: Settings, label: 'Account Settings', active: false, route: '/profile/accountsetting' },
    { icon: Heart, label: 'Favorite Recipes', active: false, route: '/profile/favoriterecipes' },
    { icon: BookOpen, label: 'My Recipes', active: false, route: '/profile/myrecipes' },
  ];

  return (
    <div className="bg-[#2A2A2A] rounded-2xl p-6 shadow-lg">
      {/* Profile Picture */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-[#F26D16] rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={40} className="text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">John Doe</h3>
        <p className="text-[#858787] text-sm">Food Enthusiast</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => (
          <Link href={item.route} key={index} className="w-full">
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeItem === item.label
                  ? 'bg-[#F26D16] text-white'
                  : 'text-[#858787] hover:bg-[#3A3A3A] hover:text-white'
                }`}
              onClick={() => setActiveItem(item.label)}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <Button className="w-full bg-transparent border border-[#F26D16] text-[#F26D16] hover:bg-[#F26D16] hover:text-white rounded-lg">
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </div>
  );
}