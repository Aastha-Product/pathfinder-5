import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Check, UserPlus } from 'lucide-react';
import { Button } from './Button';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (emails: string[]) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, onInvite }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [role, setRole] = useState('Member');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEmail = (e: React.KeyboardEvent) => {
    if (['Enter', ' ', ','].includes(e.key)) {
      e.preventDefault();
      if (emailInput && emailInput.includes('@')) {
        setEmails([...emails, emailInput.trim()]);
        setEmailInput('');
      }
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
        onInvite(emails);
        setIsLoading(false);
        setEmails([]);
        onClose();
    }, 800);
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
          transition={{ duration: 0.18 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
        >
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Invite Members
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Addresses
              </label>
              {/* Clean white box container */}
              <div 
                className="min-h-[56px] p-2 border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex flex-wrap gap-2 cursor-text"
                onClick={() => document.getElementById('email-input')?.focus()}
              >
                {emails.map(email => (
                  <span key={email} className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-sm font-medium border border-slate-200">
                    {email}
                    <button onClick={(e) => { e.stopPropagation(); removeEmail(email); }} className="ml-1.5 text-slate-400 hover:text-red-500">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <input 
                  id="email-input"
                  type="text" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleAddEmail}
                  placeholder={emails.length === 0 ? "colleague@company.com" : ""}
                  className="flex-1 min-w-[140px] outline-none text-sm text-slate-900 placeholder-slate-400 bg-transparent py-1"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Press Enter, Space, or Comma to add multiple emails.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                <option value="Member">Member (Can edit tasks)</option>
                <option value="Admin">Admin (Full access)</option>
                <option value="Viewer">Viewer (Read only)</option>
              </select>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg">
                 <div className="mt-0.5 text-blue-600">
                    <Mail className="w-4 h-4" />
                 </div>
                 <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Invited members will receive an email with a magic link to join this project board immediately.
                 </p>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading || (emails.length === 0 && !emailInput)}>
               {isLoading ? "Sending..." : "Send Invites"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};