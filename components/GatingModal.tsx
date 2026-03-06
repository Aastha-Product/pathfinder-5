
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Globe, Clock, Briefcase, Check } from 'lucide-react';
import { Button } from './Button';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface GatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const GatingModal: React.FC<GatingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
      target_role: '',
      skills: [],
      timezone: '',
      availability_notes: ''
  });
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && skillInput.trim()) {
          e.preventDefault();
          setFormData(prev => ({
              ...prev,
              skills: [...(prev.skills || []), skillInput.trim()]
          }));
          setSkillInput('');
      }
  };

  const handleCompleteProfile = async () => {
    setIsLoading(true);
    // Determine if form is valid (mock validation)
    const isReady = !!formData.target_role && !!formData.timezone && !!formData.availability_notes;
    
    await api.updateProfile({ 
        ...formData,
        is_interview_ready: isReady 
    });
    
    setIsLoading(false);
    
    if (isReady) {
        // Analytics & One-time success popup logic
        const hasShown = localStorage.getItem('profileSuccessShown');
        if (!hasShown) {
            localStorage.setItem('profileSuccessShown', 'true');
            console.log('Event: profile_success_popup_shown');
        }
        onComplete();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="complete-profile-reminder" className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        >
           <div className="p-8 pb-4 text-center border-b border-slate-100">
               <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                   <User className="w-6 h-6 text-primary-600" />
               </div>
               
               <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">Complete your profile to start sending interview invitations.</h3>
               <p className="text-slate-500 text-sm leading-relaxed">
                   Peers need to know your role, timezone, and availability to accept invites.
               </p>
           </div>

           <div className="p-6 space-y-4 overflow-y-auto">
               <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Role</label>
                   <div className="relative">
                       <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                       <input 
                         type="text" 
                         className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm"
                         placeholder="e.g. Frontend Engineer"
                         value={formData.target_role}
                         onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                       />
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Skills</label>
                   <div className="flex flex-wrap gap-2 mb-2">
                       {formData.skills?.map(skill => (
                           <span key={skill} className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">
                               {skill}
                           </span>
                       ))}
                   </div>
                   <input 
                     type="text" 
                     className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm"
                     placeholder="Add skills (press Enter)..."
                     value={skillInput}
                     onChange={(e) => setSkillInput(e.target.value)}
                     onKeyDown={handleAddSkill}
                   />
               </div>

               <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Timezone</label>
                   <div className="relative">
                       <Globe className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                       <select 
                         className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm"
                         value={formData.timezone}
                         onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                       >
                           <option value="">Select Timezone</option>
                           <option value="PST">Pacific Time (PST)</option>
                           <option value="EST">Eastern Time (EST)</option>
                           <option value="UTC">UTC</option>
                           <option value="IST">India Standard Time (IST)</option>
                       </select>
                   </div>
               </div>

               <div>
                   <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Availability</label>
                   <div className="relative">
                       <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                       <textarea 
                         rows={2}
                         className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm resize-none"
                         placeholder="e.g. Weekdays after 5pm EST"
                         value={formData.availability_notes}
                         onChange={(e) => setFormData({...formData, availability_notes: e.target.value})}
                       />
                   </div>
               </div>
           </div>

           <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-3">
               <Button onClick={handleCompleteProfile} disabled={isLoading || !formData.target_role || !formData.timezone} className="w-full">
                   {isLoading ? "Saving..." : "Complete Profile"}
               </Button>
               <button onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                   Cancel
               </button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
