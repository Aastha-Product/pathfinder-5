import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { HOW_IT_WORKS_STEPS } from '../constants';

interface HowItWorksProps {
  onNavigate?: (view: string) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
            
            {/* Left Column: Content */}
            <div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold text-text-900 mb-6">Your path to mastery</h2>
                    <p className="text-lg text-text-500 mb-12 leading-relaxed">
                        Pathfinder bridges the gap between random tutorials and job-ready skills in three structured steps.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {HOW_IT_WORKS_STEPS.map((step, index) => (
                        <motion.div 
                            key={step.number}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="flex gap-6"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xl shadow-lg shadow-primary-600/30">
                                    {step.number}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-900 mb-2">{step.title}</h3>
                                <p className="text-text-500 leading-relaxed max-w-md">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12"
                >
                    <Button 
                        size="lg" 
                        className="rounded-full px-8"
                        onClick={() => onNavigate && onNavigate('resources')}
                    >
                        Start your journey <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </motion.div>
            </div>

            {/* Right Column: Image */}
            <motion.div 
                className="hidden lg:block relative"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                 <div className="rounded-3xl overflow-hidden shadow-2xl relative aspect-video">
                     <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
                        alt="Team collaborating" 
                        className="w-full h-full object-cover"
                     />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute -z-10 top-10 right-10 w-full h-full bg-slate-50 rounded-3xl transform translate-x-4 translate-y-4"></div>
            </motion.div>

        </div>
      </div>
    </section>
  );
};