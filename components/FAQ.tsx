import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../constants';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-surface-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-text-900 text-center mb-12">Common Questions</h2>
        
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-text-900">{item.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-text-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-text-500 leading-relaxed text-sm">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};