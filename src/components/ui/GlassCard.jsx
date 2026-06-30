import React from 'react';
import { Glass } from './Glass';

export function GlassCard({ children, className = '', interactive = false, ...props }) {
  return (
    <Glass
      className={`p-6 transition-all duration-150 ${interactive ? 'hover:bg-[var(--gray-100)] hover:border-[var(--gray-500)] hover:shadow-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </Glass>
  );
}
