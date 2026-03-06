import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from './Button';

interface ProfileSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSuccessModal: React.FC<ProfileSuccessModalProps> = ({ isOpen, onClose }) => {
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center p-8"
        >
           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <Check className="w-8 h-8 text-green-600" />
           </div>
           
           <h3 className="text-2xl font-bold text-slate-900 mb-3">Congratulations! Your profile is complete.</h3>
           <p className="text-slate-500 mb-8 leading-relaxed">
               You can now send interview invitations
           </p>

           <Button onClick={onClose} className="w-full">
               Explore & Invite
           </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
