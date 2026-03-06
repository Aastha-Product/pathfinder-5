
import React, { useState } from 'react';
import { MoreHorizontal, Shield, Trash2, X, Edit } from 'lucide-react';
import { ManageAccessModal } from './ManageAccessModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ProjectMember } from '../types';

const MOCK_MEMBERS: ProjectMember[] = [
    { id: '1', name: 'Alex Johnson', email: 'alex@pathfinder.app', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100', role: 'Admin' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@pathfinder.app', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', role: 'Member' },
    { id: '3', name: 'Mike T', email: 'mike@pathfinder.app', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', role: 'Viewer' },
    { id: '4', name: 'Emily Wilson', email: 'emily@pathfinder.app', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', role: 'Member' },
    { id: '5', name: 'David Lee', email: 'david@pathfinder.app', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', role: 'Viewer' },
];

export const ProjectMembers: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isManageAccessOpen, setIsManageAccessOpen] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>(MOCK_MEMBERS);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const handleRoleChange = (id: string, newRole: 'Admin' | 'Member' | 'Viewer' | 'Owner') => {
      setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const removeMember = (id: string) => {
      setMembers(members.filter(m => m.id !== id));
      setMemberToRemove(null);
  };

  return (
    <>
    <div className="relative">
        {/* Avatar Cluster Trigger */}
        <div 
            className="flex -space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsOpen(!isOpen)}
        >
            {members.slice(0, 3).map((m) => (
                    <img 
                        key={m.id} 
                        src={m.avatar} 
                        className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 object-cover" 
                        alt={m.name} 
                    />
            ))}
            {members.length > 3 && (
                <div className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-200 bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    +{members.length - 3}
                </div>
            )}
        </div>

        {/* Dropdown */}
        {isOpen && (
            <>
                <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)}></div>
                <div className="absolute top-full mt-2 left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Members</span>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    
                    {/* List with Scrollbar - Increased height and padding for bottom dropdowns */}
                    <div className="max-h-96 overflow-y-auto black-scrollbar-dark pb-20">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors group relative">
                                <div className="flex items-center gap-3">
                                    <img src={member.avatar} className="w-8 h-8 rounded-full object-cover" alt={member.name} />
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">{member.name}</div>
                                        <div className="text-xs text-slate-500">{member.role}</div>
                                    </div>
                                </div>
                                
                                <div className="relative group/actions">
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Action Submenu - Z-index 50 to appear above others in scroll container if possible */}
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover/actions:block z-50">
                                        <div className="py-1">
                                            <button 
                                                onClick={() => { setIsOpen(false); setIsManageAccessOpen(true); }}
                                                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Edit className="w-3 h-3" /> Edit
                                            </button>
                                            <div className="h-px bg-slate-100 my-1"></div>
                                            <button 
                                                onClick={() => setMemberToRemove(member.id)}
                                                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3 h-3" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t border-slate-50 bg-slate-50/30">
                        <button 
                            onClick={() => { setIsOpen(false); setIsManageAccessOpen(true); }}
                            className="w-full py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                            Manage Access
                        </button>
                    </div>
                </div>
            </>
        )}
    </div>

    {/* Manage Access Modal */}
    <ManageAccessModal 
        isOpen={isManageAccessOpen} 
        onClose={() => setIsManageAccessOpen(false)} 
        members={members}
        onRoleChange={handleRoleChange}
        onRemoveMember={(id) => setMemberToRemove(id)}
    />

    <DeleteConfirmationModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => memberToRemove && removeMember(memberToRemove)}
        title="Remove Access?"
        message="Are you sure you want to remove this person's access? They will no longer be able to view or edit this project."
        confirmLabel="Remove"
    />
    </>
  );
};
