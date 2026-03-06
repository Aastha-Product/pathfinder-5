
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, Sparkles, Folder, Activity, Globe } from 'lucide-react';
import { Post, InterviewPartner, Group, UserProfile } from '../types';
import { api } from '../services/api';
import { PostCard } from './PostCard';
import { Button } from './Button';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupPage } from './GroupPage';
import { MyActivity } from './MyActivity'; 
import { Toast } from './Toast';
import { PeerProfileModal } from './PeerProfileModal';
import { GROUPS_ENABLED } from '../constants';

export const CommunityFeed: React.FC = () => {
  // Navigation State
  const [activeView, setActiveView] = useState<'feed' | 'group'>('feed');
  const [activeTab, setActiveTab] = useState<'recent' | 'activity'>('recent'); 
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Pass these to MyActivity to handle deep linking
  const [initialActivityView, setInitialActivityView] = useState<'Groups' | 'Posts' | 'Comments' | 'Messages'>('Groups');
  const [initialDmRecipient, setInitialDmRecipient] = useState<string | null>(null);

  // Feed State
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // Discover Peers State
  const [peers, setPeers] = useState<InterviewPartner[]>([]);
  const [peerSearchQuery, setPeerSearchQuery] = useState('');
  const [selectedPeer, setSelectedPeer] = useState<UserProfile | null>(null);
  
  // Toast
  const [toast, setToast] = useState<{msg: string, visible: boolean}>({ msg: '', visible: false });

  // Mock Viewer Profile (In a real app, this comes from AuthContext)
  const viewerProfile: UserProfile = {
      id: 'me',
      first_name: 'You',
      last_name: '',
      email: 'you@example.com',
      email_verified: true,
      profile_completion_percentage: 75,
      skills: ['React', 'TypeScript'],
      is_available_for_interview: true,
      is_public: 'public',
      allow_direct_messages: 'everyone',
      who_can_invite_me: 'everyone',
      show_skills_publicly: true,
      show_progress_publicly: true,
      // Add other required fields with defaults
      display_name: 'You',
      headline: 'Frontend Developer',
      bio: 'Learning React',
      location: 'Remote',
      target_role: 'Frontend Engineer',
      years_experience: 2,
      interview_focus: ['Frontend'],
      availability: [],
      projects: [],
      connected_accounts: {},
      notification_preferences: { email: {}, in_app: {} },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  } as UserProfile;

  // --- Initialization & Polling ---
  const fetchData = async () => {
      // Only fetch feed data if on recent tab
      if (activeTab === 'recent') {
          const [fetchedPosts, fetchedPeers] = await Promise.all([
              api.getPosts(),
              api.getPeers(peerSearchQuery)
          ]);
          setPosts(fetchedPosts);
          setPeers(fetchedPeers.slice(0, 4)); // Show top 4 initially
          setLoadingPosts(false);
      }
  };

  useEffect(() => {
      fetchData();
      const interval = setInterval(fetchData, 10000); // Poll every 10s
      return () => clearInterval(interval);
  }, [activeTab]); // Re-fetch on tab change

  // Update peers when search query changes
  useEffect(() => {
      if (activeTab === 'recent') {
          const searchPeers = async () => {
              const p = await api.getPeers(peerSearchQuery);
              setPeers(p.slice(0, 5));
          };
          const timer = setTimeout(searchPeers, 300);
          return () => clearTimeout(timer);
      }
  }, [peerSearchQuery, activeTab]);

  // --- Handlers ---

  const handleCreatePost = async () => {
      if (!newPostContent.trim()) return;
      setIsPosting(true);
      try {
          const post = await api.createPost(newPostContent, newPostTags);
          setPosts(prev => [post, ...prev]);
          setNewPostContent('');
          setNewPostTags([]);
          setToast({ msg: "Post created successfully", visible: true });
          setTimeout(() => setToast({ msg: '', visible: false }), 3000);
      } catch (err) {
          console.error(err);
      } finally {
          setIsPosting(false);
      }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (['Enter', ' ', ','].includes(e.key) && tagInput.trim()) {
          e.preventDefault();
          if (newPostTags.length < 5 && !newPostTags.includes(tagInput.trim())) {
              setNewPostTags([...newPostTags, tagInput.trim()]);
              setTagInput('');
          }
      }
  };

  const removeTag = (tag: string) => {
      setNewPostTags(newPostTags.filter(t => t !== tag));
  };

  const handleGroupCreated = (group: Group) => {
      setToast({ msg: "Group created!", visible: true });
      setTimeout(() => setToast({ msg: '', visible: false }), 3000);
      // Navigate to My Activity -> Groups and Open the group
      setSelectedGroupId(group.id);
      setActiveView('group');
  };

  const handleDm = (recipientName: string) => {
      setInitialActivityView('Messages');
      setInitialDmRecipient(recipientName);
      setActiveTab('activity');
  };

  const handleOpenGroup = (groupId: string) => {
      setSelectedGroupId(groupId);
      setActiveView('group');
  };

  const handleScrollToComposer = () => {
      const composer = document.getElementById('post-composer');
      const input = document.getElementById('post-composer-input');
      if (composer) {
          composer.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => input?.focus(), 500);
      }
  };

  const handlePeerClick = (peer: InterviewPartner) => {
    // Convert InterviewPartner to UserProfile for the modal
    // In a real app, we would fetch the full profile by ID here
    const profile: UserProfile = {
        id: peer.id,
        first_name: peer.name.split(' ')[0],
        last_name: peer.name.split(' ')[1] || '',
        display_name: peer.name,
        photo_url: peer.avatar_url,
        headline: peer.short_bio || peer.role,
        bio: peer.short_bio, // Use short_bio as bio for now
        location: 'Remote', // Mock
        is_available_for_interview: peer.availability_published,
        profile_completion_percentage: Math.floor(Math.random() * 40) + 60, // Mock 60-100%
        skills: peer.skills,
        target_role: peer.role === 'Peer' ? 'Software Engineer' : peer.role,
        years_experience: peer.experience_level === 'Senior' ? 5 : peer.experience_level === 'Intermediate' ? 3 : 1,
        preferred_interview_type: 'peer',
        interview_focus: peer.skills.slice(0, 2),
        availability: peer.availability_published ? [
            { weekday: 1, start_time: '18:00', end_time: '20:00' },
            { weekday: 3, start_time: '19:00', end_time: '21:00' }
        ] : [],
        projects: [
            { title: 'Portfolio Website', summary: 'Built with React, TypeScript and Tailwind CSS.' },
            { title: 'Task Management App', summary: 'Fullstack application using Node.js and PostgreSQL.' }
        ],
        linkedin_url: 'https://linkedin.com',
        github_url: 'https://github.com',
        is_public: 'public',
        who_can_invite_me: 'everyone',
        email: peer.email,
        email_verified: true,
        show_skills_publicly: true,
        show_progress_publicly: true,
        allow_direct_messages: 'everyone',
        connected_accounts: {},
        notification_preferences: { email: {}, in_app: {} },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    } as UserProfile;
    
    setSelectedPeer(profile);
  };

  // --- Render Components ---

  const DiscoverPeerCard: React.FC<{ peer: InterviewPartner }> = ({ peer }) => (
      <div 
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow cursor-pointer group"
        onClick={() => handlePeerClick(peer)}
      >
          <img src={peer.avatar_url} alt={peer.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
          <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-primary-600 transition-colors">{peer.name}</h4>
              <p className="text-xs text-slate-500 truncate">{peer.role} • {peer.skills[0]}</p>
              <div className="mt-2.5 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-7 text-[10px] font-bold"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDm(peer.name);
                    }}
                  >
                      Message
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1 h-7 text-[10px] font-bold"
                  >
                      View
                  </Button>
              </div>
          </div>
      </div>
  );

  // --- Main Render ---

  if (activeView === 'group' && selectedGroupId) {
      return <GroupPage groupId={selectedGroupId} onBack={() => setActiveView('feed')} />;
  }

  return (
    <div className="min-h-screen bg-surface-50 pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Page Header with Tabs */}
        <div className="mb-8">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
               <div>
                  <h1 className="text-3xl font-bold text-black tracking-tight">Community</h1>
                  <p className="text-slate-500 mt-1">Connect with peers, share updates, and find study partners.</p>
               </div>
               {/* Create Buttons only on Recent Activity */}
               {activeTab === 'recent' && (
                   <div className="flex gap-2 mt-4 sm:mt-0">
                        {GROUPS_ENABLED && (
                            <Button onClick={() => setIsGroupModalOpen(true)} variant="secondary" className="border-slate-200">
                                <Plus className="w-4 h-4 mr-2" /> New Group
                            </Button>
                        )}
                        <Button onClick={handleScrollToComposer}>
                            <Plus className="w-4 h-4 mr-2" /> New Post
                        </Button>
                   </div>
               )}
           </div>

           {/* Tab Navigation */}
           <div className="flex gap-8 border-b border-slate-200">
               <button 
                 onClick={() => setActiveTab('recent')}
                 className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'recent' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                   <Globe className="w-4 h-4" /> Recent Activity
               </button>
               <button 
                 onClick={() => {
                     setActiveTab('activity');
                     setInitialActivityView('Groups'); // Default to groups if clicking tab directly
                     setInitialDmRecipient(null);
                 }}
                 className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'activity' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                   <Activity className="w-4 h-4" /> My Activity
               </button>
           </div>
        </div>

        {/* Content based on Tab */}
        {activeTab === 'activity' && (
            <MyActivity 
                onOpenGroup={handleOpenGroup}
                initialView={initialActivityView}
                initialRecipient={initialDmRecipient}
            />
        )}

        {activeTab === 'recent' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Feed (2/3) */}
                <div className="lg:col-span-8">
                   
                   {/* Post Composer */}
                   <div id="post-composer" className="bg-white rounded-xl border border-slate-200 p-5 mb-8 shadow-sm scroll-mt-24">
                       <div className="flex gap-4">
                           <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                               You
                           </div>
                           <div className="flex-1">
                               <textarea 
                                 id="post-composer-input"
                                 value={newPostContent}
                                 onChange={(e) => setNewPostContent(e.target.value)}
                                 rows={2}
                                 className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 text-base resize-none p-0 leading-relaxed"
                                 placeholder="Share an update or ask for a study partner..."
                                 maxLength={1000}
                               />
                               
                               {newPostTags.length > 0 && (
                                   <div className="flex flex-wrap gap-2 mt-2 mb-2">
                                       {newPostTags.map(tag => (
                                           <span key={tag} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                               #{tag}
                                               <button onClick={() => removeTag(tag)} className="hover:text-blue-900"><div className="w-3 h-3 text-current">×</div></button>
                                           </span>
                                       ))}
                                   </div>
                               )}

                               <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                                   <div className="flex items-center gap-2">
                                       <input 
                                         type="text" 
                                         value={tagInput}
                                         onChange={(e) => setTagInput(e.target.value)}
                                         onKeyDown={handleAddTag}
                                         placeholder="# Add tags"
                                         className="text-xs bg-slate-50 px-2 py-1.5 rounded-lg border-none focus:ring-1 focus:ring-primary-500 w-32 transition-all focus:w-48 placeholder-slate-400"
                                       />
                                   </div>
                                   <Button 
                                      size="sm" 
                                      onClick={handleCreatePost} 
                                      disabled={!newPostContent.trim() || isPosting}
                                      className="px-6"
                                   >
                                      {isPosting ? 'Posting...' : 'Post'}
                                   </Button>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Feed List */}
                   <div className="space-y-6">
                       {loadingPosts ? (
                           <div className="space-y-6">
                               {[1,2].map(i => (
                                   <div key={i} className="bg-white h-48 rounded-xl border border-slate-200 animate-pulse"></div>
                               ))}
                           </div>
                       ) : posts.length > 0 ? (
                           <AnimatePresence>
                               {posts.map(post => (
                                   <PostCard 
                                     key={post.id} 
                                     post={post} 
                                     onDm={handleDm}
                                     onPostDeleted={(id) => setPosts(posts.filter(p => p.id !== id))}
                                   />
                               ))}
                           </AnimatePresence>
                       ) : (
                           <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                               <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                   <Sparkles className="w-6 h-6 text-slate-300" />
                               </div>
                               <h3 className="font-bold text-slate-900">No posts yet</h3>
                               <p className="text-slate-500 text-sm mt-1">Create the first post to start the conversation.</p>
                           </div>
                       )}
                   </div>
                </div>

                {/* Right Column: Discover Peers (1/3) */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    
                    {/* Search Peers Widget */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-[0_6px_14px_rgba(25,40,80,0.04)]">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-900">Explore Peers</h3>
                        </div>
                        
                        {/* Search Input */}
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all"
                                placeholder="Search name or tag..."
                                value={peerSearchQuery}
                                onChange={(e) => setPeerSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="space-y-3">
                            {peers.length > 0 ? (
                                peers.map(peer => (
                                    <DiscoverPeerCard key={peer.id} peer={peer} />
                                ))
                            ) : (
                                <div className="text-center py-4 text-slate-400 text-sm">No peers found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      <CreateGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onGroupCreated={handleGroupCreated}
      />
      
      {selectedPeer && (
        <PeerProfileModal 
            isOpen={!!selectedPeer}
            onClose={() => setSelectedPeer(null)}
            profile={selectedPeer}
            viewer={viewerProfile}
        />
      )}
      
      <Toast message={toast.msg} isVisible={toast.visible} onClose={() => setToast({ ...toast, visible: false })} />
    </div>
  );
};
