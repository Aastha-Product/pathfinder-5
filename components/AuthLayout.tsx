import React from 'react';
import { Compass } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onBack: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, onBack }) => {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-600 opacity-90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 z-0" />
        
        <div className="relative z-20 max-w-lg">
            <div className="flex items-center gap-2 mb-8 cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={onBack}>
                <Compass className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold tracking-tight">Pathfinder</span>
            </div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-6 leading-tight"
            >
                {title}
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-blue-100 leading-relaxed"
            >
                {subtitle}
            </motion.p>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-400 opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
         <button 
            onClick={onBack} 
            className="absolute top-6 left-6 flex items-center text-text-500 hover:text-primary-600 transition-colors lg:hidden"
         >
            <Compass className="h-6 w-6 mr-2" />
            <span className="font-bold">Pathfinder</span>
         </button>
        
        <div className="w-full max-w-md">
            {children}
        </div>
      </div>
    </div>
  );
};