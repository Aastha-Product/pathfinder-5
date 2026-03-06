
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Link as LinkIcon, Mail, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { InterviewPartner } from '../types';
import { api } from '../services/api';

interface InviteInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: InterviewPartner | null;
  onSuccess: () => void;
}

export const InviteInterviewModal: React.FC<InviteInterviewModalProps> = ({ isOpen, onClose, partner, onSuccess }) => {
  const [proposedTimes, setProposedTimes] = useState('');
  const [message, setMessage] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (partner) {
      setMessage(`Hi ${partner.name}, I'd like to practice ${partner.skills[0] || 'mock interviews'}. Does the proposed time work?`);
      setProposedTimes('');
      setMeetingLink('');
      setLinkError('');
    }
  }, [partner]);

  const validateLink = (url: string) => {
      if (!url.startsWith('https://')) {
          setLinkError('Link must start with https://');
          return false;
      }
      setLinkError('');
      return true;
  };

  const handleSubmit = async () => {
    if (!partner) return;
    if (!validateLink(meetingLink)) return;

    setIsLoading(true);
    
    await api.inviteUser({
        invitee_id: partner.id,
        proposed_times: [proposedTimes],
        meeting_link: meetingLink,
        message: message
    });
    
    setIsLoading(false);
    onSuccess();
  };

  if (!isOpen || !partner) return null;

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
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
           {/* Header */}
           <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-white">
               <div>
                   <h3 className="text-xl font-bold text-slate-900">Invite Peer</h3>
                   <p className="text-sm text-slate-500 mt-1">
                       Send an invitation to practice together.
                   </p>
               </div>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0">
                   <X className="w-5 h-5" />
               </button>
           </div>
           
           {/* Body */}
           <div className="p-6 space-y-5 overflow-y-auto black-scrollbar-dark">
               
               {/* Invitee Info */}
               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <img src={partner.avatar_url} alt={partner.name} className="w-10 h-10 rounded-full object-cover" />
                   <div>
                       <div className="font-bold text-slate-900">{partner.name}</div>
                       <div className="text-xs text-slate-500">{partner.role} • {partner.experience_level}</div>
                   </div>
               </div>

               {/* Proposed Times */}
               <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proposed Time <span className="text-red-500">*</span></label>
                   <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="e.g. Tomorrow at 2pm PST"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-sm shadow-sm"
                            value={proposedTimes}
                            onChange={(e) => setProposedTimes(e.target.value)}
                        />
                   </div>
               </div>

               {/* Meeting Link (Mandatory) */}
               <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meeting Link <span className="text-red-500">*</span></label>
                   <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input 
                            type="text"
                            placeholder="https://meet.google.com/..."
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white text-slate-900 focus:outline-none focus:ring-2 transition-all text-sm shadow-sm ${
                                linkError ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary-600 focus:ring-primary-600/20'
                            }`}
                            value={meetingLink}
                            onChange={(e) => {
                                setMeetingLink(e.target.value);
                                if (linkError) validateLink(e.target.value);
                            }}
                            onBlur={() => validateLink(meetingLink)}
                        />
                   </div>
                   {linkError && (
                       <div className="flex items-center gap-1 mt-1.5 text-xs text-red-600 font-medium">
                           <AlertTriangle className="w-3 h-3" /> {linkError}
                       </div>
                   )}
                   <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Must be a valid https:// URL (Zoom, Meet, Teams).</p>
               </div>

               {/* Message */}
               <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message (Optional)</label>
                   <textarea 
                     rows={2}
                     className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all text-sm resize-none shadow-sm"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                   />
               </div>

           </div>

           {/* Footer */}
           <div className="p-6 border-t border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-2 mb-4 text-slate-500 text-[11px]">
                   <Mail className="w-3 h-3" />
                   <span>An email invitation will be simulated.</span>
               </div>
               
               <div className="flex gap-3 justify-end">
                   <Button variant="ghost" onClick={onClose}>Cancel</Button>
                   <Button onClick={handleSubmit} disabled={isLoading || !proposedTimes || !meetingLink || !!linkError}>
                       {isLoading ? "Sending..." : "Send Invite"}
                   </Button>
               </div>
           </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
