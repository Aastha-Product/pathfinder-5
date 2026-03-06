
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageSquare, Edit2, Trash2, MoreHorizontal, MoreVertical, Ban, ExternalLink, Plus, Users, FileText, Share2, MessageCircle, Send, X, ChevronLeft } from 'lucide-react';
import { ActivityItem, ActivityType, Group, Conversation, ChatMessage } from '../types';
import { api } from '../services/api';
import { Button } from './Button';
import { EditContentModal } from './EditContentModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { Toast } from './Toast';

type ViewType = 'Groups' | 'Posts' | 'Comments' | 'Messages';

interface MyActivityProps {
    onOpenGroup: (groupId: string) => void;
    initialView?: ViewType;
    initialRecipient?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Updated per spec: 280ms duration, specific easing
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
          duration: 0.28,
          ease: [0.2, 0.9, 0.2, 1] 
      } 
  }
};

export const MyActivity: React.FC<MyActivityProps> = ({ onOpenGroup, initialView = 'Groups', initialRecipient }) => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Data
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [stats, setStats] = useState({ groups: 0, posts: 0, comments: 0 });
  const [loading, setLoading] = useState(true);

  // Message State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Actions
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ActivityItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ActivityItem | null>(null);
  const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({ msg: '', visible: false });

  const menuRef = useRef<HTMLDivElement>(null);

  // Sync initial props
  useEffect(() => {
      if (initialView) setCurrentView(initialView);
      if (initialView === 'Messages' && initialRecipient) {
          // Logic to handle auto-select recipient will be in loadData
      }
  }, [initialView, initialRecipient]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load Data Effect
  useEffect(() => {
      loadData();
  }, [currentView]);

  // Click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setActiveMenuId(null);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadData = async () => {
      setLoading(true);
      setActiveMenuId(null);
      
      try {
          // Always load stats
          const statsData = await api.getMyStats();
          setStats(statsData);

          if (currentView === 'Groups') {
              const myGroups = await api.getMyGroups();
              setGroups(myGroups);
          } else if (currentView === 'Posts') {
              const posts = await api.getMyActivity('posts');
              setActivityItems(posts);
          } else if (currentView === 'Comments') {
              const comments = await api.getMyActivity('comments');
              setActivityItems(comments);
          } else if (currentView === 'Messages') {
              const convs = await api.getConversations();
              setConversations(convs);
              // Handle Deep Link to Message
              if (initialRecipient) {
                  const target = convs.find(c => c.recipientName === initialRecipient);
                  if (target) {
                      handleSelectConversation(target);
                  } else {
                      // Mock creating new if not found (or just select first for demo)
                      const newMockConv: Conversation = {
                          id: 'new',
                          recipientName: initialRecipient,
                          recipientAvatar: '?',
                          lastMessage: 'Start a conversation',
                          timestamp: 'Now',
                          unreadCount: 0
                      };
                      setConversations([newMockConv, ...convs]);
                      handleSelectConversation(newMockConv);
                  }
              }
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleSelectConversation = async (conv: Conversation) => {
      setSelectedConversation(conv);
      const msgs = await api.getMessages(conv.id);
      setMessages(msgs);
  };

  const handleSendMessage = async () => {
      if (!messageInput.trim() || !selectedConversation) return;
      const newMsg = await api.sendMessage(selectedConversation.id, messageInput);
      setMessages([...messages, newMsg]);
      setMessageInput('');
  };

  // --- CRUD Handlers (Reuse existing logic) ---
  const handleEdit = (content: string, tags?: string[]) => {
      if (!editingItem) return;
      setActivityItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, content, metadata: { ...item.metadata, tags } } : item));
      if (editingItem.type === 'post') api.updatePost(editingItem.id, content).catch(() => loadData());
      if (editingItem.type === 'comment') api.updateComment(editingItem.metadata.postId!, editingItem.id, content).catch(() => loadData());
      setToast({ msg: 'Updated successfully', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 2000);
  };

  const handleDelete = async () => {
      if (!deletingItem) return;
      if (deletingItem.type === 'post') await api.deletePost(deletingItem.id);
      else if (deletingItem.type === 'comment') await api.deleteComment(deletingItem.metadata.postId!, deletingItem.id);
      setActivityItems(prev => prev.filter(i => i.id !== deletingItem.id));
      setToast({ msg: 'Deleted successfully', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 2000);
      setDeletingItem(null);
  };

  const handleDeleteChat = () => {
      if (!selectedConversation) return;
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      setSelectedConversation(null);
      setShowDeleteChatModal(false);
      setToast({ msg: 'Chat deleted', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 2000);
  };

  const handleBlockUser = () => {
      if (!selectedConversation) return;
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id));
      setSelectedConversation(null);
      setShowBlockUserModal(false);
      setToast({ msg: 'User blocked', visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 2000);
  };

  // --- Render Sections ---

  const renderStats = () => (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="text-2xl font-bold text-indigo-600 group-hover:scale-110 transition-transform">{stats.groups}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Groups</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-blue-200 hover:shadow-md transition-all group">
              <div className="text-2xl font-bold text-blue-600 group-hover:scale-110 transition-transform">{stats.posts}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Posts</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center hover:border-emerald-200 hover:shadow-md transition-all group">
              <div className="text-2xl font-bold text-emerald-600 group-hover:scale-110 transition-transform">{stats.comments}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Comments</div>
          </div>
      </motion.div>
  );

  const renderGroups = () => {
      const filtered = groups.filter(g => g.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
      return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
              {filtered.map(group => (
                  <motion.div 
                    key={group.id} 
                    variants={itemVariants}
                    onClick={() => onOpenGroup(group.id)} 
                    className="relative bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                  >
                      {/* Background Gradient Wrapper (Clipped) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                          <div className="absolute -top-[30%] -left-[20%] w-[220%] h-[120%] bg-gradient-to-br from-blue-400 to-indigo-600 opacity-[0.06] blur-xl -rotate-12"></div>
                          {/* Gradient Accent Stripe */}
                          <div className={`absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b ${group.visibility === 'Public' ? 'from-blue-400 to-blue-600' : 'from-indigo-400 to-indigo-600'} opacity-80 group-hover:scale-x-150 transition-transform origin-left duration-300`}></div>
                      </div>

                      {/* Content Wrapper (Visible Overflow) */}
                      <div className="relative z-10 p-5 pl-7">
                          <div className="flex items-center justify-between mb-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${group.visibility === 'Public' ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600'}`}>
                                  {group.name[0]}
                              </div>
                              <span className="bg-white border border-slate-200 text-[#6b7280] text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">{group.visibility}</span>
                          </div>
                          
                          <h3 className="font-bold text-[#0f172a] mb-1 group-hover:text-blue-600 transition-colors">{group.name}</h3>
                          <p className="text-xs text-[#6b7280] line-clamp-2 mb-4 h-8">{group.description}</p>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-[#6b7280]">
                              <div className="flex items-center gap-2">
                                  <div className="flex -space-x-2">
                                      <div className="w-5 h-5 rounded-full bg-slate-200 border border-white"></div>
                                      <div className="w-5 h-5 rounded-full bg-slate-300 border border-white"></div>
                                      <div className="w-5 h-5 rounded-full bg-blue-100 border border-white flex items-center justify-center text-[8px] font-bold text-blue-600">+{group.memberCount}</div>
                                  </div>
                                  <span>{group.memberCount} members</span>
                              </div>
                              <span className="font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">View Group &rarr;</span>
                          </div>
                      </div>
                  </motion.div>
              ))}
              {filtered.length === 0 && <div className="col-span-full text-center py-12 text-slate-400">No groups found.</div>}
          </motion.div>
      );
  };

  const renderPostsOrComments = () => {
      const filtered = activityItems.filter(item => item.content.toLowerCase().includes(debouncedSearch.toLowerCase()));
      
      return (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
              {filtered.map(item => (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    className="relative group rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                      {/* Background Gradient Wrapper (Clipped) */}
                      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                          <div className="absolute -top-[30%] -left-[20%] w-[220%] h-[120%] bg-gradient-to-br from-blue-400 to-indigo-600 opacity-[0.06] blur-xl -rotate-12"></div>
                      </div>

                      {/* Content Wrapper (Visible Overflow for Menu) */}
                      <div className="relative z-10 p-5">
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${item.type === 'post' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                  <div className="text-xs text-[#6b7280] font-medium">
                                      {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                  </div>
                              </div>
                              <div className="relative">
                                  <button onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === item.id ? null : item.id); }} className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 transition-colors">
                                      <MoreHorizontal className="w-4 h-4" />
                                  </button>
                                  {activeMenuId === item.id && (
                                      <div ref={menuRef} className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                          <button onClick={() => { setEditingItem(item); setActiveMenuId(null); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Edit2 className="w-3 h-3" /> Edit</button>
                                          <button onClick={() => { setDeletingItem(item); setActiveMenuId(null); }} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-3 h-3" /> Delete</button>
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          {currentView === 'Comments' && item.metadata.postTitle && (
                              <div className="text-xs text-[#6b7280] mb-3 pl-3 border-l-2 border-slate-200 py-1 bg-slate-50/50 rounded-r-md">
                                  Reply to: <span className="font-semibold text-slate-700 italic">"{item.metadata.postTitle}"</span>
                              </div>
                          )}

                          <p className="text-sm text-[#6b7280] leading-relaxed whitespace-pre-wrap">{item.content}</p>
                          
                          {currentView === 'Posts' && (
                              <div className="flex items-center gap-4 text-xs text-[#6b7280] mt-4 pt-3 border-t border-slate-50">
                                  <div className="flex items-center gap-1"><span className="font-bold text-slate-700">{item.metadata.likes}</span> likes</div>
                                  <div className="flex items-center gap-1"><span className="font-bold text-slate-700">{item.metadata.comments}</span> comments</div>
                                  <div className="flex gap-1 ml-auto">{item.metadata.tags?.map(t => <span key={t} className="pf-tag py-0.5 text-[10px]">#{t}</span>)}</div>
                              </div>
                          )}
                      </div>
                  </motion.div>
              ))}
              {filtered.length === 0 && <div className="text-center py-12 text-slate-400">No {currentView.toLowerCase()} found.</div>}
          </motion.div>
      );
  };

  const renderMessages = () => {
      // Split view Logic
      return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex h-[600px]"
          >
              {/* List Column */}
              <div className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                  <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                      <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                              type="text" 
                              placeholder="Search messages..."
                              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-primary-500 focus:border-primary-500 transition-all"
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                          />
                      </div>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                      {conversations.filter(c => c.recipientName.toLowerCase().includes(debouncedSearch.toLowerCase())).map(conv => (
                          <div 
                              key={conv.id} 
                              onClick={() => handleSelectConversation(conv)}
                              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                          >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm border border-white shadow-sm">
                                  {conv.recipientAvatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-0.5">
                                      <h5 className="font-bold text-sm text-slate-900 truncate">{conv.recipientName}</h5>
                                      <span className="text-[10px] text-slate-400 font-medium">{conv.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Chat Thread Column */}
              <div className={`w-full md:w-2/3 flex flex-col ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                  {selectedConversation ? (
                      <>
                          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10">
                              <div className="flex items-center gap-3">
                                  <button onClick={() => setSelectedConversation(null)} className="md:hidden p-1 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                                  <div className="font-bold text-slate-900">{selectedConversation.recipientName}</div>
                              </div>
                              <div className="relative">
                                  <button 
                                      onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === 'chat-menu' ? null : 'chat-menu'); }} 
                                      className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                                  >
                                      <MoreVertical className="w-5 h-5" />
                                  </button>
                                  {activeMenuId === 'chat-menu' && (
                                      <div ref={menuRef} className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-50 overflow-hidden py-1">
                                          <button 
                                              onClick={() => { setShowDeleteChatModal(true); setActiveMenuId(null); }} 
                                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                          >
                                              <Trash2 className="w-4 h-4" /> Delete Chat
                                          </button>
                                          <button 
                                              onClick={() => { setShowBlockUserModal(true); setActiveMenuId(null); }} 
                                              className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                          >
                                              <Ban className="w-4 h-4" /> Block User
                                          </button>
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                              {messages.map(msg => (
                                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'me' ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                                          <p>{msg.text}</p>
                                          <div className={`text-[9px] mt-1 text-right font-bold ${msg.sender === 'me' ? 'text-blue-100' : 'text-slate-400'}`}>{msg.timestamp}</div>
                                      </div>
                                  </div>
                              ))}
                          </div>

                          <div className="p-4 border-t border-slate-100 bg-white">
                              <div className="flex gap-2">
                                  <input 
                                      type="text" 
                                      value={messageInput}
                                      onChange={e => setMessageInput(e.target.value)}
                                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                      placeholder="Write a message..."
                                      className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                  />
                                  <button onClick={handleSendMessage} disabled={!messageInput.trim()} className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md shadow-blue-200">
                                      <Send className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                              <MessageCircle className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="font-medium text-slate-500">Select a conversation</p>
                      </div>
                  )}
              </div>
          </motion.div>
      );
  };

  return (
    <div className="space-y-6">
        {/* Top Controls: Search + View Selector */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder={`Search ${currentView.toLowerCase()}...`}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            
            <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
                {['Groups', 'Posts', 'Comments', 'Messages'].map((view) => (
                    <button
                        key={view}
                        onClick={() => setCurrentView(view as ViewType)}
                        className={`flex-1 md:flex-none px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${
                            currentView === view 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {view}
                    </button>
                ))}
            </div>
        </div>

        {/* Content Area */}
        <div>
            {currentView !== 'Messages' && renderStats()}
            
            {loading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <>
                    {currentView === 'Groups' && renderGroups()}
                    {(currentView === 'Posts' || currentView === 'Comments') && renderPostsOrComments()}
                    {currentView === 'Messages' && renderMessages()}
                </>
            )}
        </div>

        {/* Modals */}
        <EditContentModal 
            isOpen={!!editingItem} 
            onClose={() => setEditingItem(null)} 
            onSave={handleEdit}
            initialContent={editingItem?.content || ''}
            initialTags={editingItem?.metadata.tags}
            type={editingItem?.type === 'comment' ? 'comment' : 'post'}
        />

        <DeleteConfirmationModal 
            isOpen={!!deletingItem} 
            onClose={() => setDeletingItem(null)} 
            onConfirm={handleDelete}
            title="Delete Item"
            message="Are you sure? This cannot be undone."
            isDeleting={false}
        />

        <DeleteConfirmationModal 
            isOpen={showDeleteChatModal} 
            onClose={() => setShowDeleteChatModal(false)} 
            onConfirm={handleDeleteChat}
            title="Delete Chat"
            message="Are you sure you want to delete this chat?"
            isDeleting={false}
        />

        <DeleteConfirmationModal 
            isOpen={showBlockUserModal} 
            onClose={() => setShowBlockUserModal(false)} 
            onConfirm={handleBlockUser}
            title="Block User"
            message="Are you sure you want to block this user?"
            confirmLabel="Block"
            isDeleting={false}
        />

        <Toast message={toast.msg} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
};
