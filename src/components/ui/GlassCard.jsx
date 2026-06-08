import React from 'react';
import { Glass } from './Glass';

export function GlassCard({ children, className = '', interactive = false, ...props }) {
  return (
    <Glass 
      className={`p-6 transition-all duration-300 ${interactive ? 'hover:bg-white/5 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </Glass>
  );
}
