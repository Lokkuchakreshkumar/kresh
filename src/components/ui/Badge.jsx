import React from 'react';

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-[var(--gray-100)] text-[var(--gray-900)] border border-[var(--gray-alpha-400)]",
    green: "bg-[var(--green-100)] text-[var(--green-900)] border border-[var(--green-400)]",
    blue: "bg-[var(--blue-100)] text-[var(--blue-900)] border border-[var(--blue-400)]",
    purple: "bg-[var(--purple-100)] text-[var(--purple-900)] border border-[var(--purple-400)]",
    orange: "bg-[var(--amber-100)] text-[var(--amber-900)] border border-[var(--amber-400)]"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[12px] leading-[16px] font-medium uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
