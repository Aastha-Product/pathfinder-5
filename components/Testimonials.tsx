import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-8 relative">
              <Quote className="absolute top-8 left-8 h-8 w-8 text-slate-200 -z-0" />
              <div className="relative z-10">
                <p className="text-lg text-slate-800 font-medium italic mb-6">
                  "{t.quote}"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-slate-300 flex-shrink-0 mr-4" /> {/* Placeholder Avatar */}
                  <div>
                    <div className="font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-500">{t.role} at {t.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Company Logos Strip - Visual Filler */}
        <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6">
                Our learners get hired by
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale">
                 {/* Abstract Placeholders for logos */}
                 {['TechFlow', 'GlobalBank', 'StartUp Inc', 'DataSystems'].map(name => (
                     <span key={name} className="text-xl font-bold text-slate-400">{name}</span>
                 ))}
            </div>
        </div>
      </div>
    </section>
  );
};