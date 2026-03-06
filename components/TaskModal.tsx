
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Calendar, User, CheckSquare, Clock } from 'lucide-react';
import { Button } from './Button';
import { Task, ChecklistItem, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task; // If provided, we are editing
  initialStatus?: string;
}

// Mock members for assignment
const MOCK_MEMBERS = [
    { id: 'u1', name: 'Alex Johnson', avatar: 'AJ' },
    { id: 'u2', name: 'Sarah Chen', avatar: 'SC' },
    { id: 'u3', name: 'Mike T', avatar: 'MT' }
];

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, task, initialStatus }) => {
  const [formData, setFormData] = useState<Partial<Task>>({
      title: '',
      description: '',
      status: initialStatus || 'Backlog',
      priority: 'Medium',
      startDate: '',
      dueDate: '',
      tags: [],
      assigneeId: '',
      checklist: []
  });

  const [tagInput, setTagInput] = useState('');
  const [checklistItemInput, setChecklistItemInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset or populate form when opening
  useEffect(() => {
    if (task) {
      setFormData({ ...task });
    } else {
      setFormData({
          title: '',
          description: '',
          status: initialStatus || 'Backlog',
          priority: 'Medium',
          startDate: '',
          dueDate: '',
          tags: [],
          assigneeId: '',
          checklist: []
      });
    }
    setShowDeleteConfirm(false);
  }, [task, initialStatus, isOpen]);

  const handleSave = () => {
    if (!formData.title) return;
    
    // Calculate subtasks stats from checklist
    const completed = formData.checklist?.filter(i => i.done).length || 0;
    const total = formData.checklist?.length || 0;
    
    onSave({
        ...formData,
        subtasks: { completed, total }
    });
    onClose();
  };

  const addTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && tagInput.trim()) {
          e.preventDefault();
          setFormData(prev => ({
              ...prev,
              tags: [...(prev.tags || []), tagInput.trim()]
          }));
          setTagInput('');
      }
  };

  const removeTag = (tag: string) => {
      setFormData(prev => ({
          ...prev,
          tags: prev.tags?.filter(t => t !== tag)
      }));
  };

  const addChecklistItem = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && checklistItemInput.trim()) {
          e.preventDefault();
          const newItem: ChecklistItem = {
              id: Date.now().toString(),
              text: checklistItemInput.trim(),
              done: false
          };
          setFormData(prev => ({
              ...prev,
              checklist: [...(prev.checklist || []), newItem]
          }));
          setChecklistItemInput('');
      }
  };

  const toggleChecklistItem = (id: string) => {
      setFormData(prev => ({
          ...prev,
          checklist: prev.checklist?.map(item => 
              item.id === id ? { ...item, done: !item.done } : item
          )
      }));
  };

  const removeChecklistItem = (id: string) => {
      setFormData(prev => ({
          ...prev,
          checklist: prev.checklist?.filter(item => item.id !== id)
      }));
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
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-labelledby="task-modal-title"
        >
           {/* Header */}
           <div className="p-6 border-b border-slate-100 flex justify-between items-start">
               <div className="flex-1 mr-4">
                   <input 
                      id="task-modal-title"
                      type="text" 
                      placeholder="Task Title (required)"
                      className="w-full text-xl font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      autoFocus={!task}
                   />
                   <div className="text-xs text-slate-400 mt-1 font-medium px-0.5">
                       in list <span className="text-slate-600 font-semibold">{formData.status}</span>
                   </div>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors">
                   <X className="w-5 h-5" />
               </button>
           </div>
           
           {/* Body */}
           <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {/* Main Content */}
                   <div className="md:col-span-2 space-y-6">
                       
                       {/* Description */}
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                           <textarea 
                             rows={4}
                             placeholder="Add a more detailed description..."
                             className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                             value={formData.description}
                             onChange={e => setFormData({...formData, description: e.target.value})}
                           />
                       </div>

                       {/* Checklist */}
                       <div>
                           <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                               <CheckSquare className="w-4 h-4" /> Checklist
                           </label>
                           
                           <div className="space-y-2 mb-3">
                               {formData.checklist?.map(item => (
                                   <div key={item.id} className="flex items-center gap-3 group">
                                       <input 
                                          type="checkbox" 
                                          checked={item.done}
                                          onChange={() => toggleChecklistItem(item.id)}
                                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                                       />
                                       <span className={`flex-1 text-sm ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                           {item.text}
                                       </span>
                                       <button onClick={() => removeChecklistItem(item.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity">
                                           <X className="w-4 h-4" />
                                       </button>
                                   </div>
                               ))}
                           </div>

                           <div className="flex items-center gap-2">
                               <Plus className="w-4 h-4 text-slate-400" />
                               <input 
                                  type="text" 
                                  placeholder="Add an item (Press Enter)"
                                  className="flex-1 bg-transparent text-sm focus:outline-none placeholder-slate-400 text-slate-900"
                                  value={checklistItemInput}
                                  onChange={e => setChecklistItemInput(e.target.value)}
                                  onKeyDown={addChecklistItem}
                               />
                           </div>
                       </div>

                   </div>

                   {/* Sidebar Controls */}
                   <div className="space-y-5">
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                           <select 
                             className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500"
                             value={formData.status}
                             onChange={e => setFormData({...formData, status: e.target.value})}
                           >
                               <option>Backlog</option>
                               <option>In Progress</option>
                               <option>Review</option>
                               <option>Done</option>
                           </select>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority</label>
                           <div className="flex gap-2">
                               {['Low', 'Medium', 'High'].map(p => (
                                   <button
                                      key={p}
                                      onClick={() => setFormData({...formData, priority: p as Priority})}
                                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                          formData.priority === p 
                                          ? (p === 'High' ? 'bg-red-50 text-red-700 border-red-200' : p === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                      }`}
                                   >
                                       {p}
                                   </button>
                               ))}
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assignee</label>
                           <div className="relative">
                               <select 
                                 className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500 appearance-none"
                                 value={formData.assigneeId}
                                 onChange={e => setFormData({...formData, assigneeId: e.target.value})}
                               >
                                   <option value="">Unassigned</option>
                                   {MOCK_MEMBERS.map(m => (
                                       <option key={m.id} value={m.id}>{m.name}</option>
                                   ))}
                               </select>
                               <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                       </div>

                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date</label>
                           <div className="relative">
                               <input 
                                 type="date"
                                 className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500"
                                 value={formData.startDate}
                                 onChange={e => setFormData({...formData, startDate: e.target.value})}
                               />
                               <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                           <div className="relative">
                               <input 
                                 type="date"
                                 className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-blue-500"
                                 value={formData.dueDate}
                                 onChange={e => setFormData({...formData, dueDate: e.target.value})}
                               />
                               <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags</label>
                           <div className="flex flex-wrap gap-2 mb-2">
                               {formData.tags?.map(tag => (
                                   <span key={tag} className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700">
                                       {tag}
                                       <button onClick={() => removeTag(tag)} className="ml-1 text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                                   </span>
                               ))}
                           </div>
                           <input 
                              type="text" 
                              placeholder="Add tag..."
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                              value={tagInput}
                              onChange={e => setTagInput(e.target.value)}
                              onKeyDown={addTag}
                           />
                       </div>
                   </div>
               </div>
           </div>

           {/* Footer */}
           <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
               {task && onDelete ? (
                   !showDeleteConfirm ? (
                       <button 
                         onClick={() => setShowDeleteConfirm(true)}
                         className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                       >
                           <Trash2 className="w-4 h-4" /> Delete
                       </button>
                   ) : (
                       <div className="flex items-center gap-2">
                           <span className="text-xs text-red-600 font-bold">Sure?</span>
                           <button 
                             onClick={() => { onDelete(task.id); onClose(); }}
                             className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"
                           >
                               Yes, Delete
                           </button>
                           <button 
                             onClick={() => setShowDeleteConfirm(false)}
                             className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                           >
                               Cancel
                           </button>
                       </div>
                   )
               ) : (
                   <div></div>
               )}
               <div className="flex gap-3">
                   <Button variant="ghost" onClick={onClose}>Cancel</Button>
                   <Button onClick={handleSave} disabled={!formData.title}>Save Task</Button>
               </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
