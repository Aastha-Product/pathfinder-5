
import React from 'react';
import { Sparkles } from 'lucide-react';
import { AIPlanTask } from '../types';
import { Button } from './Button';

interface PracticePlanCardProps {
  tasks: AIPlanTask[];
  onStartPlan: () => void;
}

export const PracticePlanCard: React.FC<PracticePlanCardProps> = ({ tasks, onStartPlan }) => {
  return (
    <div>
         <div className="bg-slate-50 rounded-[20px] p-6 border border-slate-100">
             <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-semibold text-slate-900">Practice Plan</h2>
                <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <Sparkles className="w-3 h-3 mr-1 text-indigo-500" /> AI Generated
                </span>
             </div>

             <div className="mb-6">
                 <h3 className="font-medium text-slate-900 mb-1 text-[15px]">Suggested for you</h3>
                 <p className="text-[14px] text-slate-500 leading-relaxed">
                     Based on your recent performance, we've generated {tasks.length} targeted exercises to improve your weak areas.
                 </p>
             </div>

             <div className="flex items-center gap-3 mb-8">
                 <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 text-[10px] font-bold shadow-sm">SQL</div>
                     <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-purple-600 text-[10px] font-bold shadow-sm">DSA</div>
                 </div>
                 <span className="text-[13px] text-slate-400 font-medium">+ Behavioral</span>
             </div>
             
             <Button 
                onClick={onStartPlan} 
                className="w-full h-[44px] rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white font-medium text-[14px] shadow-md shadow-blue-900/20 transition-all hover:shadow-lg border-0"
             >
                 View Practice Plan
             </Button>
         </div>
    </div>
  );
};
