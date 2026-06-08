import React from 'react';

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-kresh-green/50";
  
  const variants = {
    primary: "bg-text-primary text-background hover:opacity-90",
    outline: "border border-border-color text-text-primary hover:bg-text-primary/10",
    glass: "glass hover:bg-text-primary/10 text-text-primary",
    ghost: "text-text-secondary hover:text-text-primary hover:bg-text-primary/5"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
