import React from 'react';

export function Glass({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-[var(--background-100)] border border-[var(--gray-400)] shadow-card rounded-[12px] relative ${className}`} 
      {...props}
    >
      <div className="relative z-10 w-full h-full rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}
