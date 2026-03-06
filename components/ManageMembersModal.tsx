
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';
import { Toast } from './Toast';

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: string[]; // Group members are currently strings
  onRemoveMember: (name: string) => void;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ isOpen, onClose, members, onRemoveMember }) => {
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleRemoveClick = (member: string) => {
        setMemberToRemove(member);
    };

    const confirmRemove = () => {
        if (memberToRemove) {
            onRemoveMember(memberToRemove);
            setMemberToRemove(null);
        }
    };

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
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900">Manage Members</h2>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Users List */}
                    <div className="p-0 overflow-y-auto black-scrollbar-dark flex-1">
                        <div className="divide-y divide-slate-50">
                            {members.map((member, index) => (
                                <div key={index} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                                            {member[0]}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900">{member}</span>
                                    </div>
                                    
                                    {member !== 'You' && (
                                        <button 
                                            onClick={() => handleRemoveClick(member)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove member"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {member === 'You' && (
                                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Owner</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            Done
                        </button>
                    </div>

                </motion.div>
            </div>

            {/* Confirmation Modal for Removal */}
            {memberToRemove && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMemberToRemove(null)}></div>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center"
                    >
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Member?</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            Are you sure you want to remove <span className="font-bold text-slate-900">{memberToRemove}</span> from the group?
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setMemberToRemove(null)}
                                className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmRemove}
                                className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-md shadow-red-500/20"
                            >
                                Remove
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
