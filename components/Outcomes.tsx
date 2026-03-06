import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { OUTCOME_TESTIMONIALS } from '../constants';

export const Outcomes: React.FC = () => {
  return (
    <section className="py-24 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-900 mb-4">Outcomes That Matter</h2>
            <p className="text-lg text-text-500">Real results from real learners. See how Pathfinder accelerates careers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {OUTCOME_TESTIMONIALS.map((t, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col h-full"
                >
                    <div className="flex gap-1 mb-6">
                        {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-teal-400 fill-current" />
                        ))}
                    </div>

                    <p className="text-lg text-text-700 italic mb-8 flex-grow leading-relaxed">
                        "{t.quote}"
                    </p>

                    <div className="pt-6 border-t border-slate-50">
                        <div className="text-primary-600 font-semibold text-sm mb-1">{t.result}</div>
                        <div className="text-xs text-text-400 mb-6">{t.time}</div>
                        
                        <div>
                            <div className="font-bold text-text-900">{t.author}</div>
                            <div className="text-sm text-text-500">{t.role}</div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};