import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, Calendar } from 'lucide-react';
import { Button } from './Button';

interface PracticeWithOthersProps {
  onNavigate?: (view: string) => void;
}

export const PracticeWithOthers: React.FC<PracticeWithOthersProps> = ({ onNavigate }) => {
  const cards = [
    {
      icon: UserPlus,
      title: 'Find a Mock Interview Partner',
      buttonText: 'Find a Partner',
      footerText: '24 sessions happening now',
      action: () => onNavigate && onNavigate('mock-interviews')
    },
    {
      icon: Users,
      title: 'Join Study Groups',
      buttonText: 'Join a Group',
      footerText: '24 sessions happening now',
      action: () => onNavigate && onNavigate('community')
    },
    {
      icon: Calendar,
      title: 'Schedule Practice Sessions',
      buttonText: 'Book a Session',
      footerText: '24 sessions happening now',
      action: () => onNavigate && onNavigate('mock-interviews')
    },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Practice with Others</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Improve faster by practicing technical interviews and studying with fellow learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 hover:border-primary-500/50 transition-all group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-6 group-hover:bg-primary-900/30 group-hover:text-primary-400 transition-colors">
                <card.icon className="w-8 h-8 text-slate-300 group-hover:text-primary-400 transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold mb-8 min-h-[3.5rem] flex items-center justify-center">
                {card.title}
              </h3>

              <Button 
                className="w-full mb-4 bg-primary-600 hover:bg-primary-500 text-white border-none"
                onClick={card.action}
              >
                {card.buttonText}
              </Button>

              <p className="text-xs text-slate-500 font-medium">
                {card.footerText}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
