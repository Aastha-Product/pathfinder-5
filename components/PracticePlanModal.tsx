
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { AIPlanTask } from '../types';
import { Button } from './Button';

interface PracticePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: AIPlanTask[];
}

export const PracticePlanModal: React.FC<PracticePlanModalProps> = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                   </div>
                   <div>
                       <h3 className="text-xl font-bold text-slate-900">Your Personalized Plan</h3>
                       <p className="text-sm text-slate-500">Tailored to your recent interview performance</p>
                   </div>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X className="w-5 h-5" />
               </button>
           </div>
           
           <div className="p-6 bg-slate-50/50 overflow-y-auto flex-1">
                <div className="space-y-4">
                    {plan.map((task, idx) => (
                         <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                             <div className="flex justify-between items-start mb-3">
                                 <h4 className="font-bold text-slate-900 text-lg">{task.title}</h4>
                                 <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-xs font-bold text-slate-600">
                                     <Clock className="w-3 h-3" /> {task.expected_minutes} min
                                 </span>
                             </div>
                             
                             <p className="text-sm text-slate-600 mb-4 font-medium">Goal: {task.goal}</p>
                             
                             <div className="space-y-2">
                                 {task.steps.map((step, i) => (
                                     <div key={i} className="flex items-start gap-3">
                                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                                         <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
                                     </div>
                                 ))}
                             </div>
                             
                             <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                                 <Button variant="outline" size="sm" className="text-xs h-8">Start Exercise</Button>
                             </div>
                         </div>
                    ))}
                </div>
           </div>

           <div className="p-5 border-t border-slate-100 bg-white flex justify-end">
               <Button onClick={onClose}>Close Plan</Button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
