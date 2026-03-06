
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Globe, Lock, Calendar } from 'lucide-react';
import { Button } from './Button';
import { api } from '../services/api';
import { Group } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: (group: Group) => void;
  initialGroup?: Group | null; // For Edit Mode
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onGroupCreated, initialGroup }) => {
  const [formData, setFormData] = useState({
     name: '',
     description: '',
     maxMembers: 5,
     visibility: 'Private' as 'Private' | 'Public',
     startDate: '',
     endDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if editing
  useEffect(() => {
      if (initialGroup && isOpen) {
          setFormData({
              name: initialGroup.name,
              description: initialGroup.description,
              maxMembers: initialGroup.maxMembers,
              visibility: initialGroup.visibility as 'Private' | 'Public', // Casting for safe typing
              startDate: initialGroup.startDate || '',
              endDate: initialGroup.endDate || ''
          });
      } else if (!initialGroup && isOpen) {
          // Reset if creating new
          setFormData({ name: '', description: '', maxMembers: 5, visibility: 'Private', startDate: '', endDate: '' });
      }
  }, [initialGroup, isOpen]);

  const handleSubmit = async () => {
      if (!formData.name) return;
      setIsSubmitting(true);
      try {
          let resultGroup: Group;
          
          if (initialGroup) {
              // Edit Mode
              resultGroup = await api.updateGroup(initialGroup.id, {
                  name: formData.name,
                  description: formData.description,
                  maxMembers: formData.maxMembers,
                  visibility: formData.visibility,
                  startDate: formData.startDate,
                  endDate: formData.endDate
              });
          } else {
              // Create Mode
              resultGroup = await api.createGroup({
                  name: formData.name,
                  description: formData.description,
                  maxMembers: formData.maxMembers,
                  visibility: formData.visibility,
                  startDate: formData.startDate,
                  endDate: formData.endDate
              });
          }

          onGroupCreated?.(resultGroup);
          onClose();
      } catch (e) {
          console.error(e);
      } finally {
          setIsSubmitting(false);
      }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-text-900">
                {initialGroup ? 'Edit Group' : 'Create New Group'}
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
             <p className="text-text-500 text-sm">
                 {initialGroup ? 'Update details for your study group.' : 'Create a space for collaboration, study, or projects.'}
             </p>
             
             <div>
                <label className="block text-sm font-medium text-text-700 mb-1.5">Group Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                  placeholder="e.g. SQL Weekend Warriors"
                  value={formData.name}
                  maxLength={60}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-text-700 mb-1.5">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm resize-none"
                  placeholder="What is this group about?"
                  value={formData.description}
                  maxLength={500}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-text-700 mb-1.5">Max Members</label>
                    <input 
                      type="number" 
                      min={3}
                      max={10}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-surface-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm"
                      value={formData.maxMembers}
                      onChange={e => setFormData({...formData, maxMembers: parseInt(e.target.value)})}
                    />
                    <p className="text-xs text-slate-400 mt-1">Limit 3 to 10 members.</p>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-text-700 mb-2">Visibility</label>
                    <div className="flex gap-2">
                       <label className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${formData.visibility === 'Public' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="visibility" 
                            value="Public" 
                            checked={formData.visibility === 'Public'}
                            onChange={e => setFormData({...formData, visibility: e.target.value as 'Public'})}
                            className="hidden"
                          />
                          <Globe className="w-4 h-4" />
                          <span className="text-sm font-medium">Public</span>
                       </label>
                       <label className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${formData.visibility === 'Private' ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-slate-200 hover:bg-slate-50'}`}>
                          <input 
                            type="radio" 
                            name="visibility" 
                            value="Private" 
                            checked={formData.visibility === 'Private'}
                            onChange={e => setFormData({...formData, visibility: e.target.value as 'Private'})}
                            className="hidden"
                          />
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-medium">Private</span>
                       </label>
                    </div>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                 <div>
                     <label className="block text-sm font-medium text-text-700 mb-1.5">Start Date</label>
                     <div className="relative">
                         <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                         <input 
                            type="date"
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-surface-50 focus:bg-white text-sm focus:outline-none focus:border-primary-600"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                         />
                     </div>
                 </div>
                 <div>
                     <label className="block text-sm font-medium text-text-700 mb-1.5">Est. End Date</label>
                     <div className="relative">
                         <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                         <input 
                            type="date"
                            className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-surface-50 focus:bg-white text-sm focus:outline-none focus:border-primary-600"
                            value={formData.endDate}
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                         />
                     </div>
                 </div>
             </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-surface-50">
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button onClick={handleSubmit} disabled={!formData.name || isSubmitting}>
                 {isSubmitting ? (initialGroup ? 'Saving...' : 'Creating...') : (initialGroup ? 'Save Changes' : 'Create Group')}
             </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
