
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-primary-600 text-white border-transparent",
    secondary: "bg-slate-100 text-slate-900 border-transparent",
    outline: "text-slate-900 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
