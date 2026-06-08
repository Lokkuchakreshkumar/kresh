import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-text-primary/5 text-text-secondary border border-border-color",
    green: "bg-kresh-green/10 text-kresh-green border border-kresh-green/20",
    blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    orange: "bg-orange-500/10 text-orange-400 border border-orange-500/20"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
