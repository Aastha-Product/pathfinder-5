
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Globe, Clock, Briefcase, X } from 'lucide-react';
import { Button } from './Button';
import { api } from '../services/api';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileComplete?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onProfileComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
      target_role: '',
      skills: [],
      timezone: '',
      availability_notes: ''
  });
  const [skillInput, setSkillInput] = useState('');

  // Fetch current profile when opening
  useEffect(() => {
      if (isOpen) {
          const load = async () => {
              setIsLoading(true);
              const profile = await api.getUserProfile('me');
              setFormData(profile);
              setIsLoading(false);
          };
          load();
      }
  }, [isOpen]);

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

  const removeSkill = (skillToRemove: string) => {
      setFormData(prev => ({
          ...prev,
              skills: prev.skills?.filter(s => s !== skillToRemove)
      }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const isReady = !!formData.target_role && !!formData.timezone && !!formData.availability_notes;
    
    await api.updateProfile({ 
        ...formData,
        is_interview_ready: isReady 
    });
    
    // Trigger Success Logic if Profile is Ready
    if (isReady) {
        const hasShown = localStorage.getItem('profileSuccessShown');
        if (!hasShown) {
            localStorage.setItem('profileSuccessShown', 'true');
            // Analytics Event
            console.log('Event: profile_success_popup_shown');
            if (onProfileComplete) {
                onProfileComplete();
            }
        }
    }
    
    setIsSaving(false);
    onClose();
  };

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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-xl font-bold text-slate-900">Edit Profile</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md">
                   <X className="w-5 h-5" />
               </button>
           </div>

           {isLoading ? (
               <div className="p-8 text-center text-slate-500">Loading profile...</div>
           ) : (
               <div className="p-6 space-y-5 overflow-y-auto">
                   <div>
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Role</label>
                       <div className="relative">
                           <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                           <input 
                             type="text" 
                             className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm"
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
                               <span key={skill} className="px-2 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600 flex items-center gap-1">
                                   {skill}
                                   <button onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                               </span>
                           ))}
                       </div>
                       <input 
                         type="text" 
                         className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm"
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
                             className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm bg-white"
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
                       <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Availability Notes</label>
                       <div className="relative">
                           <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                           <textarea 
                             rows={3}
                             className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 text-sm resize-none"
                             placeholder="e.g. Weekdays after 5pm EST"
                             value={formData.availability_notes}
                             onChange={(e) => setFormData({...formData, availability_notes: e.target.value})}
                           />
                       </div>
                   </div>
               </div>
           )}

           <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
               <Button variant="ghost" onClick={onClose}>Cancel</Button>
               <Button onClick={handleSave} disabled={isSaving || isLoading}>
                   {isSaving ? "Saving..." : "Save Changes"}
               </Button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
