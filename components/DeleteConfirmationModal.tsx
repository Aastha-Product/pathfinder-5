
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isDeleting?: boolean;
  confirmLabel?: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  isDeleting = false,
  confirmLabel = 'Delete'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-6 text-center"
        >
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertTriangle className="w-6 h-6 text-red-600" />
           </div>
           
           <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
           <p className="text-slate-500 text-sm mb-6 leading-relaxed">
               {message}
           </p>

           <div className="flex gap-3 justify-center">
               <button 
                 onClick={onClose}
                 className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                 disabled={isDeleting}
               >
                   Cancel
               </button>
               <button 
                 onClick={onConfirm}
                 disabled={isDeleting}
                 className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md shadow-red-500/20 transition-colors disabled:opacity-50"
               >
                   {isDeleting ? 'Deleting...' : confirmLabel}
               </button>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
