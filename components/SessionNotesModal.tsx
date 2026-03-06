import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button } from './Button';
import { MockSession } from '../types';

interface SessionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: MockSession | null;
  onSave: (notes: string) => void;
}

export const SessionNotesModal: React.FC<SessionNotesModalProps> = ({ isOpen, onClose, session, onSave }) => {
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      setNotes(session.notes_private || '');
    }
  }, [isOpen, session]);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(notes);
    setIsSaving(false);
    onClose();
  };

  if (!isOpen || !session) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        >
           {/* Header */}
           <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-10">
               <h3 className="text-lg font-bold text-slate-900">Private Session Notes</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                   <X className="w-5 h-5" />
               </button>
           </div>
           
           {/* Body */}
           <div className="p-6">
               <div className="mb-4">
                   <p className="text-sm text-slate-500 mb-2">
                       These notes are private and only visible to you. Use them to track what you learned or need to improve.
                   </p>
                   <textarea 
                       rows={8}
                       placeholder="E.g. Need to practice SQL joins, partner suggested looking into System Design Primer..."
                       className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-sm resize-none"
                       value={notes}
                       onChange={(e) => setNotes(e.target.value)}
                       autoFocus
                   />
               </div>
           </div>

           {/* Footer */}
           <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end items-center gap-3">
               <Button variant="outline" onClick={onClose} disabled={isSaving}>
                   Cancel
               </Button>
               <Button onClick={handleSave} disabled={isSaving}>
                   {isSaving ? "Saving..." : "Save Notes"}
               </Button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
