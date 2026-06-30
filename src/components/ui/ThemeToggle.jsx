"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

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
        className="w-16 h-8 rounded-[6px] bg-[var(--background-200)] border border-[var(--gray-400)] opacity-50 cursor-not-allowed"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-16 h-8 rounded-[6px] cursor-pointer select-none bg-[var(--background-200)] border border-[var(--gray-400)] transition-colors hover:bg-[var(--gray-100)] outline-none"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Moon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-[var(--primary)]' : 'text-[var(--gray-600)]'}`} />
        <Sun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-[var(--primary)]' : 'text-[var(--gray-600)]'}`} />
      </div>

      <div
        className="absolute left-1 w-6 h-6 rounded-[4px] bg-[var(--gray-1000)] pointer-events-none transition-transform duration-200 ease-out shadow-sm"
        style={{
          transform: `translateX(${theme === 'dark' ? '0px' : '32px'})`
        }}
      />
    </button>
  );
}
