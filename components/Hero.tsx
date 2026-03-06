import React from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { HERO_PILLS, HERO_METRICS } from '../constants';

interface HeroProps {
  onNavigate: (view: 'resources') => void;
  onSearch: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onSearch }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] as const } 
    },
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="lg:col-span-6 text-center lg:text-left mb-12 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-text-900 tracking-tight leading-[1.1]"
            >
              Structured roadmaps. <br />
              Real mock interviews. <br />
              <span className="text-primary-600">Job-ready results.</span>
            </motion.h1>
            
            <motion.h2 
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-text-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Structured roadmaps, best free resources, and peers to practice with. Stop wasting time searching and start learning.
            </motion.h2>

            {/* Buttons */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="w-full sm:w-auto px-8 rounded-full" onClick={() => onNavigate('resources')}>
                Start Learning Free
              </Button>
            </motion.div>
            
            <motion.p variants={itemVariants} className="mt-6 text-xs text-text-400">
               All core features are free. No credit card required.
            </motion.p>

            {/* Search Input */}
            <motion.div variants={itemVariants} className="mt-8 max-w-lg mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-text-400 group-focus-within:text-primary-600 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl leading-5 bg-white placeholder-text-400 focus:placeholder-primary-600/60 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 shadow-sm transition-all"
                  placeholder="What do you want to learn? (SQL, Python, Data Science...)"
                  onKeyDown={handleSearch}
                />
              </div>
            </motion.div>

            {/* Pills */}
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                {HERO_PILLS.map(pill => (
                    <div key={pill} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full opacity-30 blur-[2px] group-hover:opacity-100 transition duration-200"></div>
                        <span 
                            onClick={() => onSearch(pill)}
                            className="relative block px-4 py-1.5 bg-white rounded-full text-xs font-bold text-slate-700 hover:text-primary-600 cursor-pointer transition-colors border border-slate-100 group-hover:border-transparent"
                        >
                            {pill}
                        </span>
                    </div>
                ))}
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            className="lg:col-span-6 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
             <div className="relative group">
                 {/* Gradient Glow Effect */}
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[2rem] opacity-20 blur-lg group-hover:opacity-40 transition duration-500"></div>
                 
                 <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] w-full border border-slate-100/50">
                     <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
                        alt="Students learning together" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                     />
                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                 </div>
             </div>
          </motion.div>

        </div>
      </div>

      {/* Metrics Strip */}
      <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-wrap justify-center gap-12 md:gap-24">
                  {HERO_METRICS.map((metric, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                          <metric.icon className="w-6 h-6 text-primary-600" />
                          <span className="text-lg font-bold text-text-900">{metric.value} <span className="text-base font-normal text-text-500 ml-1">{metric.label}</span></span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </section>
  );
};