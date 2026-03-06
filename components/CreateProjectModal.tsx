
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { Button } from './Button';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
      name: string;
      description: string;
      visibility: string;
      startDate: string;
      endDate: string;
  };
  onSave?: (data: any) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, initialData, onSave }) => {
  const [newProject, setNewProject] = useState({
      name: '',
      description: '',
      visibility: 'Private',
      startDate: '',
      endDate: ''
  });

  React.useEffect(() => {
      if (initialData) {
          setNewProject(initialData as any);
      } else {
          setNewProject({ name: '', description: '', visibility: 'Private', startDate: '', endDate: '' });
      }
  }, [initialData, isOpen]);

  const handleCreateProject = () => {
    // Logic to create project (POST /api/projects) would go here
    if (onSave) {
        onSave(newProject);
    }
    onClose();
    if (!initialData) {
        setNewProject({ name: '', description: '', visibility: 'Private', startDate: '', endDate: '' });
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
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
        >
           <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Project' : 'Create New Project'}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
           </div>
           
           <div className="p-6 space-y-5">
               <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Name <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                     placeholder="e.g. Q4 Marketing Campaign"
                     value={newProject.name}
                     onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                   />
               </div>

               <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                   <textarea 
                     rows={3}
                     className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                     placeholder="What is this project about?"
                     value={newProject.description}
                     onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                   />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1.5">Start Date</label>
                       <div className="relative">
                            <input 
                                type="date"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                value={newProject.startDate}
                                onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                            />
                       </div>
                   </div>
                   <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-1.5">End Date</label>
                       <div className="relative">
                            <input 
                                type="date"
                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                                value={newProject.endDate}
                                onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                            />
                       </div>
                   </div>
               </div>

               <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Visibility</label>
                   <div className="flex gap-4">
                       <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl w-full hover:bg-slate-50 transition-colors">
                           <input 
                             type="radio" 
                             name="visibility" 
                             value="Private"
                             checked={newProject.visibility === 'Private'}
                             onChange={() => setNewProject({...newProject, visibility: 'Private'})}
                             className="text-blue-600 focus:ring-blue-600"
                           />
                           <span className="text-sm font-medium text-slate-900">Private</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-xl w-full hover:bg-slate-50 transition-colors">
                           <input 
                             type="radio" 
                             name="visibility" 
                             value="Public"
                             checked={newProject.visibility === 'Public'}
                             onChange={() => setNewProject({...newProject, visibility: 'Public'})}
                             className="text-blue-600 focus:ring-blue-600"
                           />
                           <span className="text-sm font-medium text-slate-900">Public</span>
                       </label>
                   </div>
               </div>
           </div>

           <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
               <Button variant="ghost" onClick={onClose}>Cancel</Button>
               <Button onClick={handleCreateProject} disabled={!newProject.name}>{initialData ? 'Save Changes' : 'Create Project'}</Button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
