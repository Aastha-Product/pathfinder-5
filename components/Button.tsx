import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cta';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group";
  
  const variants = {
    // Exact requested blue: #2F7DF6 for bg, #1E63D6 for hover
    primary: "bg-[#2F7DF6] text-white hover:bg-[#1E63D6] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 border border-transparent hover:-translate-y-0.5",
    cta: "bg-[#19A974] text-white hover:bg-[#148A5F] shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40 border border-transparent hover:-translate-y-0.5",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:border-blue-500/50 hover:bg-slate-50 shadow-sm hover:shadow-md hover:-translate-y-0.5",
    outline: "border border-slate-200 bg-transparent text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "text-sm px-4 py-2 h-9 rounded-lg",
    md: "text-sm px-5 py-2.5 h-10 rounded-xl", // Slightly more rounded as per spec
    lg: "text-base px-6 py-3 h-12 rounded-xl",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};