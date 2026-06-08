import React from 'react';

export function Glass({ children, className = '', ...props }) {
  return (
    <div 
      className={`glass relative rounded-2xl overflow-hidden ${className}`}
      {...props}
    >
      {children}
      {/* Specular highlight simulation based on GLASS.md concepts */}
      <div className="absolute inset-0 border border-border-color rounded-2xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-primary/20 to-transparent pointer-events-none" />
    </div>
  );
}
