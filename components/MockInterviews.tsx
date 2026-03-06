import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Award, Star, Search, Users, Calendar, Download, Plus, Filter, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { InviteInterviewModal } from './InviteInterviewModal';
import { GatingModal } from './GatingModal';
import { ProfileSuccessModal } from './ProfileSuccessModal';
import { PartnerCard } from './PartnerCard';
import { PracticePlanCard } from './PracticePlanCard';
import { PracticePlanModal } from './PracticePlanModal';
import { SessionRow } from './SessionRow';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { SessionFeedbackModal } from './SessionFeedbackModal';
import { SessionNotesModal } from './SessionNotesModal';
import { PeerProfileModal } from './PeerProfileModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Toast } from './Toast';
import { MockSession, InterviewPartner } from '../types';

// Simple Metric Card Component
const MetricCard = ({ label, value, icon: Icon, iconColor, iconBg, subtext, subtextColor }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-start h-full">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="text-4xl font-bold text-slate-900 mb-1 leading-none">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
        {subtext && (
            <div className={`text-xs font-bold mt-2 ${subtextColor || 'text-slate-400'}`}>
                {subtext}
            </div>
        )}
    </div>
);

export const MockInterviews = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'find' | 'schedule'>('find');
    const [partners, setPartners] = useState<InterviewPartner[]>([]);
    const [sessions, setSessions] = useState<MockSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modals
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<InterviewPartner | null>(null);
    const [showGatingModal, setShowGatingModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showPracticePlanModal, setShowPracticePlanModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<MockSession | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    // Feedback/Notes/Profile Modals
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<MockSession | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'find') {
                const data = await api.getPeers();
                setPartners(data);
            } else {
                const data = await api.getSchedule();
                const allSessions = [
                    ...data.pending,
                    ...data.confirmed,
                    ...data.completed
                ];
                // Sort by date descending
                allSessions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setSessions(allSessions);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = (partner: InterviewPartner) => {
        setSelectedPartner(partner);
        setShowInviteModal(true);
    };

    const handleInviteSuccess = () => {
        setShowInviteModal(false);
        setShowSuccessModal(true);
        setToastMsg("Invitation sent successfully!");
        loadData();
    };

    const handleCancelSession = (session: MockSession) => {
        setSessionToDelete(session);
        setShowDeleteModal(true);
    };

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;
        
        setIsDeleting(true);
        try {
            await api.cancelSession(sessionToDelete.id);
            setToastMsg(sessionToDelete.status === 'pending' ? "Request cancelled." : "Session deleted.");
            loadData(); // Reload schedule
        } catch (e) {
            setToastMsg("Failed to delete session.");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setSessionToDelete(null);
        }
    };

    const handleJoinCall = (session: MockSession) => {
        if (session.meeting_link) {
            window.open(session.meeting_link, '_blank');
        } else {
            setToastMsg("Meeting link not available yet.");
        }
    };

    // Mock Viewer Profile (In a real app, this comes from AuthContext)
    const viewerProfile: any = {
        id: user?.id || 'me',
        first_name: user?.name?.split(' ')[0] || 'You',
        last_name: user?.name?.split(' ')[1] || '',
        email: user?.email || 'you@example.com',
        email_verified: true,
        profile_completion_percentage: 75,
        skills: ['React', 'TypeScript'],
        is_available_for_interview: true,
        is_public: 'public',
        allow_direct_messages: 'everyone',
        who_can_invite_me: 'everyone',
        show_skills_publicly: true,
        show_progress_publicly: true,
        display_name: user?.name || 'You',
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
    };

    const handleOpenProfileFromPartner = (partner: InterviewPartner) => {
        // Convert InterviewPartner to UserProfile for the modal
        const profile: any = {
            id: partner.id,
            first_name: partner.name.split(' ')[0],
            last_name: partner.name.split(' ')[1] || '',
            display_name: partner.name,
            photo_url: partner.avatar_url,
            headline: partner.short_bio || partner.role,
            bio: partner.short_bio,
            location: 'Remote', // Mock
            is_available_for_interview: partner.availability_published,
            profile_completion_percentage: Math.floor(Math.random() * 40) + 60,
            skills: partner.skills,
            target_role: partner.role === 'Peer' ? 'Software Engineer' : partner.role,
            years_experience: partner.experience_level === 'Senior' ? 5 : partner.experience_level === 'Intermediate' ? 3 : 1,
            preferred_interview_type: 'peer',
            interview_focus: partner.skills.slice(0, 2),
            availability: partner.availability_published ? [
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
            email: partner.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            notification_preferences: { email: {}, in_app: {} }
        };
        setSelectedProfile(profile);
        setShowProfileModal(true);
    };

    const handleOpenProfileFromSession = async (partnerId: string) => {
        try {
             // Try to find partner in loaded partners first to avoid API call if possible, or just use API
             const partner = partners.find(p => p.id === partnerId);
             if (partner) {
                 handleOpenProfileFromPartner(partner);
             } else {
                 const profile = await api.getUserProfile(partnerId);
                 setSelectedProfile(profile);
                 setShowProfileModal(true);
             }
        } catch (e) {
            console.error("Failed to load profile", e);
            setToastMsg("Failed to load profile");
        }
    };

    const handleOpenFeedback = (session: MockSession) => {
        setSelectedSession(session);
        setShowFeedbackModal(true);
    };

    const handleOpenNotes = (session: MockSession) => {
        setSelectedSession(session);
        setShowNotesModal(true);
    };

    const filteredPartners = partners.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.company && p.company.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Mock tasks for Practice Plan
    const mockTasks: any[] = [
        { title: "SQL Joins Practice", expected_minutes: 30, steps: ["Review INNER JOIN", "Practice LEFT JOIN"], goal: "Master Joins" },
        { title: "Behavioral STAR Method", expected_minutes: 20, steps: ["Draft 3 stories", "Practice aloud"], goal: "Improve storytelling" }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mock Interviews</h1>
                        <p className="text-slate-500 mt-2">Practice with peers, get feedback, and improve your interview skills.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <button 
                            onClick={() => setActiveTab('find')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'find' 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Find Partner
                        </button>
                        <button 
                            onClick={() => setActiveTab('schedule')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'schedule' 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            My Schedule
                        </button>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <MetricCard 
                        label="Practices Completed" 
                        value="2" 
                        icon={CheckCircle} 
                        iconColor="text-blue-600" 
                        iconBg="bg-blue-50" 
                    />
                    <MetricCard 
                        label="Avg Score" 
                        value="82" 
                        icon={Star} 
                        iconColor="text-amber-500" 
                        iconBg="bg-amber-50"
                        subtext="Top 15%"
                        subtextColor="text-emerald-600"
                    />
                    <MetricCard 
                        label="Improvement" 
                        value="+0%" 
                        icon={TrendingUp} 
                        iconColor="text-emerald-500" 
                        iconBg="bg-emerald-50"
                        subtext="Last 3 sessions"
                        subtextColor="text-emerald-600"
                    />
                    <MetricCard 
                        label="Interview Ready" 
                        value="50%" 
                        icon={Award} 
                        iconColor="text-purple-500" 
                        iconBg="bg-purple-50"
                        subtext="Based on rubric"
                        subtextColor="text-emerald-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        
                        {activeTab === 'find' && (
                            <>
                                {/* Search & Filter */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input 
                                            type="text" 
                                            placeholder="Search by role, company, or name..." 
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Partners Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {loading ? (
                                        [1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-white h-64 rounded-2xl animate-pulse border border-slate-100" />
                                        ))
                                    ) : (
                                        filteredPartners.map(partner => (
                                            <PartnerCard 
                                                key={partner.id} 
                                                partner={partner} 
                                                onInvite={() => handleInvite(partner)} 
                                                onProfileClick={() => handleOpenProfileFromPartner(partner)}
                                            />
                                        ))
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'schedule' && (
                            <div className="pb-32"> {/* Increased padding for menu visibility */}
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white h-32 rounded-2xl animate-pulse border border-slate-100" />
                                        ))}
                                    </div>
                                ) : sessions.length > 0 ? (
                                    <div className="space-y-4">
                                        {sessions.map(session => (
                                            <SessionRow 
                                                key={session.id} 
                                                session={session} 
                                                onCancel={handleCancelSession}
                                                onJoin={handleJoinCall}
                                                onOpenProfile={handleOpenProfileFromSession}
                                                onOpenFeedback={handleOpenFeedback}
                                                onOpenNotes={handleOpenNotes}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">No sessions scheduled</h3>
                                        <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">You haven't scheduled any mock interviews yet. Find a partner to get started!</p>
                                        <Button onClick={() => setActiveTab('find')}>Find a Partner</Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-6 sticky top-24 h-fit">
                        <PracticePlanCard tasks={mockTasks} onStartPlan={() => setShowPracticePlanModal(true)} />
                        
                        {/* Metrics or other sidebar items could go here */}
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-900/20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-bold text-lg">Your Progress</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1 opacity-90">
                                        <span>Weekly Goal</span>
                                        <span className="font-bold">2/3</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white w-2/3 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <div>
                                        <div className="text-2xl font-bold">4.8</div>
                                        <div className="text-xs opacity-70">Avg Rating</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">12</div>
                                        <div className="text-xs opacity-70">Sessions</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <InviteInterviewModal 
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                partner={selectedPartner}
                onSuccess={handleInviteSuccess}
            />

            <ProfileSuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <PracticePlanModal 
                isOpen={showPracticePlanModal}
                onClose={() => setShowPracticePlanModal(false)}
                plan={mockTasks}
            />

            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteSession}
                title={sessionToDelete?.status === 'pending' ? "Cancel Request" : "Delete Session"}
                message={sessionToDelete?.status === 'pending' 
                    ? "Are you sure you want to cancel this interview request? This action cannot be undone." 
                    : "Are you sure you want to delete this session? This will remove it from your history."}
                confirmLabel={sessionToDelete?.status === 'pending' ? "Cancel Request" : "Delete"}
                isDeleting={isDeleting}
            />

            {selectedSession && (
                <>
                    <SessionFeedbackModal 
                        isOpen={showFeedbackModal}
                        onClose={() => setShowFeedbackModal(false)}
                        session={selectedSession}
                        onSubmit={() => {
                            setShowFeedbackModal(false);
                            setToastMsg("Feedback submitted successfully.");
                            loadData();
                        }}
                    />
                    <SessionNotesModal 
                        isOpen={showNotesModal}
                        onClose={() => setShowNotesModal(false)}
                        session={selectedSession}
                        onSave={() => {
                            setShowNotesModal(false);
                            setToastMsg("Notes saved successfully.");
                            loadData();
                        }}
                    />
                </>
            )}

            {selectedProfile && (
                <PeerProfileModal 
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    profile={selectedProfile}
                    viewer={viewerProfile}
                />
            )}
        </div>
    );
};
