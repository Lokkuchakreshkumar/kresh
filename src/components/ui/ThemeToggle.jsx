"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // Load initial theme safely
  useEffect(() => {
    try {
      setMounted(true);
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const isLight = document.documentElement.classList.contains('light');
        setTheme(isLight ? 'light' : 'dark');
      }
    } catch (err) {
      console.error("Error checking theme in useEffect:", err);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      }
    } catch (err) {
      console.error("Error setting theme in toggleTheme:", err);
    }
  };

  if (!mounted) {
    return (
      <div 
        className="w-[72px] h-[22px] rounded-full bg-white/5 border border-white/10 opacity-50 cursor-not-allowed"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-[72px] h-[22px] rounded-full cursor-pointer select-none bg-white/5 border border-white/10 dark:border-white/10 light:border-black/10 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] outline-none focus-visible:ring-1 focus-visible:ring-kresh-green"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {/* Background Track Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Side: Moon Icon (Centered at X = 11px, size 18px -> left: 2px) */}
        <div 
          className={`absolute left-[2px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[18px] h-[18px] transition-all duration-300 ${
            theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <Moon 
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              theme === 'light' 
                ? 'text-slate-800 fill-slate-800 drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]' 
                : 'text-white fill-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
            }`} 
          />
        </div>

        {/* Right Side: Sun Icon (Centered at X = 61px, size 18px -> left: 52px) */}
        <div 
          className={`absolute left-[52px] top-1/2 -translate-y-1/2 flex items-center justify-center w-[18px] h-[18px] transition-all duration-300 ${
            theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          <Sun 
            className={`w-3.5 h-3.5 transition-colors duration-300 ${
              theme === 'light' 
                ? 'text-slate-800 fill-slate-800 drop-shadow-[0_0_3px_rgba(0,0,0,0.2)]' 
                : 'text-white fill-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]'
            }`} 
          />
        </div>
      </div>

      {/* Dynamic Slide Texts */}
      <div className="absolute inset-0 flex items-center pointer-events-none px-2.5">
        {/* "Dark" Text (Visible when theme is dark - sphere is on the right) */}
        <span 
          className={`text-[9px] font-semibold text-white transition-all duration-300 ${
            theme === 'dark' 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-2'
          }`}
        >
          Dark
        </span>

        {/* "Light" Text (Visible when theme is light - sphere is on the left) */}
        <span 
          className={`text-[9px] font-semibold text-text-primary ml-auto transition-all duration-300 ${
            theme === 'light' 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-2'
          }`}
        >
          Light
        </span>
      </div>

      {/* The 3D Glass Sphere / Lens (Size 32px, overflows by 5px top/bottom, base left is -5px) */}
      <div 
        className="absolute top-1/2 left-[-5px] w-8 h-8 rounded-full glass-sphere pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
        style={{
          transform: `translateY(-50%) translateX(${theme === 'dark' ? '50px' : '0px'})`
        }}
      >
        {/* Top-Left Specular Reflection (WWDC Liquid Glass Highlight) */}
        <div className="absolute top-[8%] left-[16%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_80%)] rotate-[-30deg]" />
        
        {/* Bottom-Right Soft Inner Glow */}
        <div className="absolute bottom-[8%] right-[12%] w-[45%] h-[30%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0)_90%)]" />
        
        {/* Physical glass edge highlighting */}
        <div className="absolute inset-0 rounded-full border border-white/50" />
      </div>
    </button>
  );
}
