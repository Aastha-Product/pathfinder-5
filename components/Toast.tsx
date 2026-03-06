
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[150] bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="font-medium text-sm">{message}</span>
          <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
