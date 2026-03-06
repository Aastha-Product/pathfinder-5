
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Lock, Globe, Plus, MoreHorizontal, UserPlus, Share2, Link, Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { PostCard } from './PostCard';
import { InviteModal } from './InviteModal';
import { CreateGroupModal } from './CreateGroupModal';
import { DeleteGroupModal } from './DeleteGroupModal';
import { ManageMembersModal } from './ManageMembersModal';
import { Toast } from './Toast';
import { api } from '../services/api';
import { Group, Post } from '../types';

interface GroupPageProps {
  groupId: string;
  onBack: () => void;
}

export const GroupPage: React.FC<GroupPageProps> = ({ groupId, onBack }) => {
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Menu State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  
  // Post Composer
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({ msg: '', visible: false });

  // Refs for click outside
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      loadGroup();
  }, [groupId]);

  // Click Outside Handler for Menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowMenu(false);
          }
      };

      if (showMenu) {
          document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [showMenu]);

  const loadGroup = async () => {
      setLoading(true);
      const g = await api.getGroupById(groupId);
      if (g) {
          setGroup(g);
          const p = await api.getGroupPosts(groupId);
          setPosts(p);
      }
      setLoading(false);
  };

  const handleCreatePost = async () => {
      if (!newPostContent.trim()) return;
      setIsPosting(true);
      try {
          // Pass groupId to createPost to associate it
          const post = await api.createPost(newPostContent, [], groupId);
          setPosts(prev => [post, ...prev]);
          setNewPostContent('');
      } catch (e) {
          console.error(e);
      } finally {
          setIsPosting(false);
      }
  };

  const handleInvite = async (emails: string[]) => {
      await api.inviteToGroup(groupId, emails);
      setShowInviteModal(false);
      setToast({ msg: 'Invites sent successfully', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 3000);
  };

  const handleRemoveMember = (memberName: string) => {
      if (!group) return;
      const updatedMembers = group.members.filter(m => m !== memberName);
      const updatedGroup = { ...group, members: updatedMembers, memberCount: updatedMembers.length };
      setGroup(updatedGroup);
      setToast({ msg: `${memberName} removed from group`, visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 3000);
  };

  // --- Menu Actions ---

  const handleShareLink = () => {
      // Mock share link
      const link = `https://app.domain.com/join-group/${groupId}?token=xyz123`;
      navigator.clipboard.writeText(link);
      setToast({ msg: 'Link copied to clipboard', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 2000);
      setShowMenu(false);
  };

  const handleDeleteGroup = async () => {
      await api.deleteGroup(groupId);
      setShowDeleteModal(false);
      onBack(); // Return to feed
  };

  const handleGroupUpdated = (updatedGroup: Group) => {
      setGroup(updatedGroup);
      setToast({ msg: 'Group updated successfully', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 3000);
  };

  if (loading) return <div className="p-8 text-center">Loading group...</div>;
  if (!group) return <div className="p-8 text-center">Group not found</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
        <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 mb-6 font-medium text-sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Feed
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Group Info & Members */}
            <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold ${group.visibility === 'Public' ? 'bg-blue-500' : 'bg-indigo-500'}`}>
                            {group.name[0]}
                        </div>
                        
                        {/* Three-Dot Menu */}
                        {group.ownerId === 'me' && (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setShowMenu(!showMenu)} 
                                    className={`p-1.5 rounded-lg transition-colors ${showMenu ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                    title="Group actions"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                <AnimatePresence>
                                    {showMenu && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 z-50 overflow-hidden"
                                        >
                                            <div className="py-1">
                                                <button 
                                                    onClick={handleShareLink}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                >
                                                    <Link className="w-4 h-4 text-slate-400" />
                                                    Share Group Link
                                                </button>
                                                <button 
                                                    onClick={() => { setShowMenu(false); setShowManageMembersModal(true); }}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                >
                                                    <Users className="w-4 h-4 text-slate-400" />
                                                    Manage Members
                                                </button>
                                                <button 
                                                    onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                                                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-slate-400" />
                                                    Edit Group
                                                </button>
                                                <div className="h-px bg-slate-100 my-1"></div>
                                                <button 
                                                    onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete Group
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                    
                    <h1 className="text-xl font-bold text-slate-900 mb-2 leading-tight break-words">{group.name}</h1>
                    <p className="text-sm text-slate-500 mb-6">{group.description}</p>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            {group.visibility === 'Public' ? <Globe className="w-4 h-4 text-slate-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
                            <span>{group.visibility} Group</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>{group.memberCount} / {group.maxMembers} Members</span>
                        </div>
                        {(group.startDate || group.endDate) && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span>{group.startDate ? new Date(group.startDate).toLocaleDateString() : 'Start'} - {group.endDate ? new Date(group.endDate).toLocaleDateString() : 'Ongoing'}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={() => setShowInviteModal(true)} className="w-full text-sm">
                            <UserPlus className="w-4 h-4 mr-2" /> Invite Members
                        </Button>
                        <Button variant="outline" className="w-full text-sm" onClick={handleShareLink}>
                            <Share2 className="w-4 h-4 mr-2" /> Share Link
                        </Button>
                    </div>
                </div>

                {/* Member List */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-900 text-sm mb-4">Members</h3>
                    <div className="space-y-3">
                        {group.members.map((member, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {member[0]}
                                </div>
                                <span className="text-sm text-slate-700 font-medium">{member}</span>
                                {member === 'You' && <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Owner</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle: Posts Feed */}
            <div className="lg:col-span-6 space-y-6">
                
                {/* Composer */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                   <div className="flex gap-4">
                       <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                           You
                       </div>
                       <div className="flex-1">
                           <textarea 
                             value={newPostContent}
                             onChange={(e) => setNewPostContent(e.target.value)}
                             rows={2}
                             className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 text-base resize-none p-0"
                             placeholder={`Post to ${group.name}...`}
                           />
                           <div className="flex justify-end mt-2 pt-2 border-t border-slate-50">
                               <Button size="sm" onClick={handleCreatePost} disabled={!newPostContent.trim() || isPosting}>
                                   {isPosting ? 'Posting...' : 'Post'}
                               </Button>
                           </div>
                       </div>
                   </div>
                </div>

                {/* Feed */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {posts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onDm={() => {}} // DM not primary flow here
                                onPostDeleted={(id) => setPosts(posts.filter(p => p.id !== id))}
                            />
                        ))}
                    </AnimatePresence>
                    {posts.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                            <p className="text-slate-500">No posts yet. Start the conversation!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Quick Stats (Optional) */}
            <div className="hidden lg:block lg:col-span-3">
               <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                   <h4 className="font-bold text-blue-900 text-sm mb-2">Group Activity</h4>
                   <p className="text-xs text-blue-700 leading-relaxed">
                       Groups with active discussions are 3x more likely to complete their goals. Post a question or update!
                   </p>
               </div>
            </div>

        </div>

        {/* Modals */}
        <InviteModal 
            isOpen={showInviteModal} 
            onClose={() => setShowInviteModal(false)} 
            onInvite={handleInvite} 
        />

        <CreateGroupModal 
            isOpen={showEditModal} 
            onClose={() => setShowEditModal(false)} 
            onGroupCreated={handleGroupUpdated} // Updates group state directly
            initialGroup={group}
        />

        <DeleteGroupModal 
            isOpen={showDeleteModal} 
            onClose={() => setShowDeleteModal(false)} 
            onDelete={handleDeleteGroup}
            groupName={group.name}
        />

        <ManageMembersModal
            isOpen={showManageMembersModal}
            onClose={() => setShowManageMembersModal(false)}
            members={group.members}
            onRemoveMember={handleRemoveMember}
        />

        <Toast message={toast.msg} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
};
