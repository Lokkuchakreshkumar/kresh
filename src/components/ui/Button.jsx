import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[6px] focus-visible:focus-ring select-none";
  
  const sizes = {
    small: "h-8 px-1.5 text-[14px] leading-5", // 32px height, 6px padding
    medium: "h-10 px-2.5 text-[14px] leading-5", // 40px height, 10px padding
    large: "h-12 px-3.5 text-[16px] leading-5" // 48px height, 14px padding
  };

  const variants = {
    primary: "bg-[var(--gray-1000)] text-[var(--background-100)] hover:bg-[var(--gray-900)] active:bg-[var(--gray-800)] border border-transparent",
    secondary: "bg-[var(--background-100)] text-[var(--primary)] border border-[var(--gray-alpha-400)] hover:border-[var(--gray-alpha-500)] hover:bg-[var(--gray-100)] active:border-[var(--gray-alpha-600)] active:bg-[var(--gray-200)]",
    tertiary: "bg-transparent text-[var(--primary)] hover:bg-[var(--gray-alpha-100)] active:bg-[var(--gray-alpha-200)] border border-transparent",
    error: "bg-[var(--red-800)] text-white hover:bg-[var(--red-900)] active:bg-[var(--red-1000)] border border-transparent"
  };

  const disabledStyle = "bg-[var(--gray-100)] text-[var(--gray-700)] cursor-not-allowed border-transparent";

  return (
    <button 
      className={`${baseStyle} ${sizes[size]} ${disabled ? disabledStyle : variants[variant]} ${className}`} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
