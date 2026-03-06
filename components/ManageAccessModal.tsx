
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Link, Trash2 } from 'lucide-react';
import { ProjectMember } from '../types';
import { Toast } from './Toast';

interface ManageAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ProjectMember[];
  onRoleChange: (id: string, newRole: 'Admin' | 'Member' | 'Viewer' | 'Owner') => void;
  onRemoveMember: (id: string) => void;
}

export const ManageAccessModal: React.FC<ManageAccessModalProps> = ({ isOpen, onClose, members, onRoleChange, onRemoveMember }) => {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    if (!isOpen) return null;

    const handleCopyLink = () => {
        navigator.clipboard.writeText("https://pathfinder.app/projects/current-id");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const handleRoleSelect = (id: string, role: 'Admin' | 'Member' | 'Viewer') => {
        onRoleChange(id, role);
        setOpenDropdownId(null);
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
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 pb-2 flex justify-between items-start">
                        <h2 className="text-xl font-medium text-slate-900">People with access</h2>
                        {/* Removed icons as requested */}
                    </div>

                    {/* Users List */}
                    <div className="px-4 pb-4">
                        <div className="space-y-4 mt-2 max-h-96 overflow-y-auto black-scrollbar-dark pr-1">
                            {members.map((user) => (
                                <div key={user.id} className="flex items-center justify-between group relative">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                                        <div>
                                            <div className="text-sm font-medium text-slate-900 leading-none mb-0.5">{user.name}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="text-sm text-slate-500 font-medium relative">
                                        {user.role === 'Owner' ? (
                                            <span className="text-slate-400 px-2">Owner</span>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => toggleDropdown(user.id)}
                                                    className="flex items-center gap-1 hover:bg-slate-50 px-2 py-1 rounded transition-colors text-slate-700"
                                                >
                                                    {user.role} <ChevronDown className="w-3 h-3" />
                                                </button>

                                                {/* Dropdown Menu - mimicking ProjectMembers style */}
                                                {openDropdownId === user.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10 cursor-default" onClick={() => setOpenDropdownId(null)}></div>
                                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 z-20 overflow-hidden">
                                                            <div className="py-1">
                                                                {['Admin', 'Member', 'Viewer'].map((role) => (
                                                                    <button 
                                                                        key={role}
                                                                        onClick={() => handleRoleSelect(user.id, role as any)}
                                                                        className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${user.role === role ? 'font-bold text-blue-600' : 'text-slate-600'}`}
                                                                    >
                                                                        {role}
                                                                    </button>
                                                                ))}
                                                                <div className="h-px bg-slate-100 my-1"></div>
                                                                <button 
                                                                    onClick={() => { onRemoveMember(user.id); setOpenDropdownId(null); }}
                                                                    className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                                                >
                                                                    <Trash2 className="w-3 h-3" /> Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Removed General Access Section */}

                    {/* Footer Actions */}
                    <div className="p-6 pt-2 flex justify-between items-center mt-auto">
                        <button 
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-colors"
                        >
                            <Link className="w-4 h-4" /> Copy link
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-8 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>

                    {/* Local Toast for Copy Link */}
                    <Toast message="Link copied to clipboard" isVisible={showToast} onClose={() => setShowToast(false)} />

                </motion.div>
            </div>
        </AnimatePresence>
    );
};
