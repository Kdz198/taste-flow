"use client";

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'
const ButtonDarkMode = () => {
    const { theme, setTheme } = useTheme();
    const isDark = theme === 'dark';
    const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null; // Chặn toàn bộ render khi chưa mounted
    return (
        <div className="flex gap-2 items-center justify-end mr-2 mt-2">
            <div onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className={`flex item-center cursor-pointer transition-transform duration-500
            ${isDark ? 'rotate-180' : 'rotate-0'}`}
            >
                {isDark ?
                    <Sun className="w-full text-yellow-500 rotate-0 transition-all" /> :
                    <Moon className="w-full text-blue-500 rotate-0 transition-all" />}
            </div>
        </div>


    )
}

export default ButtonDarkMode
