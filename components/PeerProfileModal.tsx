import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, Clock, Calendar, ExternalLink, Linkedin, Github, Globe, CheckCircle, AlertCircle, MessageSquare, UserPlus, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../services/api'; // Assuming api service exists for invite
import { Button } from './Button';
import { Toast } from './Toast';

interface PeerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  viewer: UserProfile; // The current logged-in user
}

export const PeerProfileModal: React.FC<PeerProfileModalProps> = ({ isOpen, onClose, profile, viewer }) => {
  const [isInviting, setIsInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [expandedSkills, setExpandedSkills] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Focus trap and ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Eligibility Logic
  const isViewerEligible =
    viewer.email_verified &&
    (viewer.profile_completion_percentage || 0) >= 50 &&
    (viewer.skills?.length || 0) >= 1;

  const isTargetAvailable = profile.is_available_for_interview;

  // Check if viewer is allowed to invite based on target's privacy settings
  // Assuming 'connections' logic is mocked as true for now or based on a future 'is_connection' field
  const isConnection = false; // Mocked for now
  const isInviteAllowedByTarget =
    profile.who_can_invite_me === 'everyone' ||
    (profile.who_can_invite_me === 'connections' && isConnection);

  const canInvite = isViewerEligible && isTargetAvailable && isInviteAllowedByTarget;

  // Privacy Logic
  const isProfileVisible =
    profile.is_public === 'public' ||
    (profile.is_public === 'connections' && isConnection) ||
    profile.is_public === 'private'; // 'private' usually means only connections, but let's assume basic info is visible

  // If private and not connected, hide sensitive info
  const showSensitiveInfo = profile.is_public === 'public' || isConnection;

  const handleSendInvite = async () => {
    if (!canInvite) return;
    setIsInviting(true);
    setInviteStatus('idle');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app: await api.sendInvite(profile.id);
      setInviteStatus('success');

      // Analytics
      console.log('send_invite_click', {
        profile_id: profile.id,
        viewer_id: viewer.id,
        result: 'success'
      });
    } catch (error) {
      setInviteStatus('error');
      console.error('Invite failed', error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenChat = () => {
    console.log('open_message_click', { profile_id: profile.id, viewer_id: viewer.id });
    // Navigate to chat or open chat modal
  };

  const handleExternalLink = (type: string) => {
    console.log('external_link_click', { profile_id: profile.id, link_type: type });
  };

  const handleRequestConnect = () => {
    // Note: To actually send the email, a backend service like Firebase Cloud Functions + SendGrid/Nodemailer is required.
    // For now, this simulates the backend call.
    setToastMsg(`Your invite request is sent to their email`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="relative w-full max-w-[760px] max-h-[100vh] sm:max-h-[85vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            tabIndex={-1}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors z-10"
              aria-label="Close profile preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-white shrink-0">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={profile.display_name || profile.first_name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-white shadow-md">
                      {profile.first_name[0]}
                    </div>
                  )}
                  {profile.profile_completion_percentage && profile.profile_completion_percentage >= 60 && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <div className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {profile.profile_completion_percentage}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <h2 id="modal-title" className="text-2xl font-bold text-slate-900 truncate">
                      {profile.display_name || `${profile.first_name} ${profile.last_name}`}
                    </h2>
                    {profile.headline && (
                      <p className="text-slate-500 font-medium text-sm sm:text-base truncate">{profile.headline}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    {profile.is_available_for_interview ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Available for Interview
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-medium border border-slate-200">
                        Not Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 bg-white overscroll-contain">

              {/* Privacy Guard */}
              {!showSensitiveInfo ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">This profile is private</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mt-1">Connect with {profile.first_name} to view their full profile details and availability.</p>
                  </div>
                  <Button variant="outline" size="sm" icon={<UserPlus className="w-4 h-4" />} onClick={handleRequestConnect}>
                    Request to Connect
                  </Button>
                </div>
              ) : (
                <>
                  {/* About */}
                  {profile.bio && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About</h3>
                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{profile.bio}</p>
                    </section>
                  )}

                  {/* Skills */}
                  {profile.skills && profile.skills.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {(expandedSkills ? profile.skills : profile.skills.slice(0, 8)).map((skill) => (
                          <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded-full text-xs font-medium border border-slate-200 hover:border-slate-300 transition-colors cursor-default">
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 8 && !expandedSkills && (
                          <button
                            onClick={() => setExpandedSkills(true)}
                            className="px-3 py-1.5 bg-white text-primary-600 rounded-full text-xs font-bold border border-primary-100 hover:bg-primary-50 transition-colors"
                          >
                            +{profile.skills.length - 8} more
                          </button>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Role & Experience */}
                  {(profile.target_role || (profile.years_experience !== undefined)) && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Role & Experience</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.target_role && (
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 font-medium uppercase">Target Role</div>
                              <div className="font-bold text-slate-900">{profile.target_role}</div>
                            </div>
                          </div>
                        )}
                        {profile.years_experience !== undefined && (
                          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs text-slate-500 font-medium uppercase">Experience</div>
                              <div className="font-bold text-slate-900">{profile.years_experience} Years</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Interview Preferences */}
                  {(profile.preferred_interview_type || (profile.interview_focus && profile.interview_focus.length > 0) || (profile.availability && profile.availability.length > 0)) && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Interview Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {profile.preferred_interview_type && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                              Type: {profile.preferred_interview_type === 'both' ? 'Peer & Mentor' : profile.preferred_interview_type}
                            </span>
                          )}
                          {profile.interview_focus?.map(focus => (
                            <span key={focus} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                              {focus}
                            </span>
                          ))}
                        </div>

                        {profile.availability && profile.availability.length > 0 && (
                          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                            <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>Upcoming Availability</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {profile.availability.slice(0, 3).map((slot, idx) => (
                                <div key={idx} className="bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-center shadow-sm">
                                  <div className="font-bold text-slate-700">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][slot.weekday]}
                                  </div>
                                  <div className="text-slate-500 mt-0.5">
                                    {slot.start} - {slot.end}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-[10px] text-slate-400 text-center">
                              Times shown in your local timezone
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {profile.projects && profile.projects.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Highlighted Projects</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {profile.projects.slice(0, 2).map((project, idx) => (
                          <div key={idx} className="group p-4 rounded-xl border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{project.title}</h4>
                              {project.url && <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary-500" />}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.summary}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* External Links */}
                  {(profile.linkedin_url || profile.github_url || profile.portfolio_url) && (
                    <section className="flex gap-4 pt-2">
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink('linkedin')}
                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-[#0077b5] hover:text-white transition-all"
                          aria-label="LinkedIn Profile"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {profile.github_url && (
                        <a
                          href={profile.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink('github')}
                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-[#333] hover:text-white transition-all"
                          aria-label="GitHub Profile"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {profile.portfolio_url && (
                        <a
                          href={profile.portfolio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => handleExternalLink('portfolio')}
                          className="p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-emerald-500 hover:text-white transition-all"
                          aria-label="Portfolio Website"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </section>
                  )}
                </>
              )}
            </div>

            {/* Footer / CTA */}
            {!showSensitiveInfo && (
              <div className="p-4 sm:p-6 border-t border-slate-100 bg-white shrink-0 flex flex-col sm:flex-row gap-3 sm:items-center justify-between sticky bottom-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
                <div className="w-full">
                  <Button variant="primary" className="w-full justify-center" icon={<UserPlus className="w-4 h-4" />} onClick={handleRequestConnect}>
                    Request to Connect
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
          {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
        </div>
      )}
    </AnimatePresence>
  );
};
