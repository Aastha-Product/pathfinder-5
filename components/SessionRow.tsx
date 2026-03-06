
import React, { useState, useRef, useEffect } from 'react';
import { Clock, Video, FileText, MoreHorizontal, ChevronDown, ChevronUp, Edit2, User, Trash2, XCircle } from 'lucide-react';
import { Button } from './Button';
import { MockSession } from '../types';

interface SessionRowProps {
  session: MockSession;
  onOpenFeedback: (session: MockSession) => void;
  onCancel: (session: MockSession) => void;
  onJoin: (link: string) => void;
  onOpenNotes: (session: MockSession) => void;
  onOpenProfile: (partnerId: string) => void;
}

export const SessionRow: React.FC<SessionRowProps> = ({ session, onOpenFeedback, onCancel, onJoin, onOpenNotes, onOpenProfile }) => {
  const isConfirmed = session.status === 'confirmed';
  const isCompleted = session.status === 'completed';
  const isPending = session.status === 'pending';
  const [isNotesExpanded, setIsNotesExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Humanized substatus logic
  const getSubstatus = () => {
    if (isPending) {
        const partnerName = session.partner_name.split(' ')[0];
        return `Waiting for ${partnerName} to confirm`;
    }
    return null;
  };

  const navyGradientClass = "bg-gradient-to-r from-slate-900 to-blue-900 hover:from-slate-800 hover:to-blue-800 text-white shadow-md shadow-blue-900/20 border-0";

  const partnerId = session.inviter_id === 'me' ? session.invitee_id : session.inviter_id;

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl p-5 sm:px-6 sm:py-5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200 relative group">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: User Info */}
            <div className="flex items-start gap-4">
                <div className="relative">
                    <img 
                        src={session.partner_avatar || 'https://via.placeholder.com/40'} 
                        alt="" 
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-sm" 
                    />
                    {/* Status Indicator Dot */}
                    {isConfirmed && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>}
                </div>
                
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900 text-[16px] leading-tight">{session.partner_name}</h4>
                        
                        {/* Status Badges - Soft Colors */}
                        {isConfirmed && (
                            <span className="bg-emerald-500/10 text-emerald-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                                Confirmed
                            </span>
                        )}
                        {isCompleted && (
                            <span className="bg-blue-500/10 text-blue-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                                Completed
                            </span>
                        )}
                        {isPending && (
                            <span className="bg-amber-500/10 text-amber-700 text-[12px] font-medium px-2.5 py-1 rounded-full">
                                Pending
                            </span>
                        )}
                    </div>

                    {/* Meta Text */}
                    <div className="flex items-center gap-3 text-[14px] text-slate-500/90">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{session.proposed_times}</span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>{session.partner_role || 'Peer'}</span>
                        </div>
                    </div>

                    {/* Humanized Substatus */}
                    {isPending && (
                        <div className="mt-1">
                            <span className="text-[13px] text-slate-500/80 font-medium">
                                {getSubstatus()}
                            </span>
                        </div>
                    )}
                    
                    {/* Feedback Status for Completed */}
                    {isCompleted && (
                        <div className="mt-1 flex gap-2">
                             {session.feedback_status === 'submitted' && (
                                <span className="text-[13px] text-purple-600/80 font-medium flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Feedback submitted
                                </span>
                            )}
                            {session.feedback_status === 'pending' && (
                                <span className="text-[13px] text-amber-600/80 font-medium flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> Feedback pending
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 self-end md:self-center">
                
                {/* Primary Action - Only ONE per card */}
                {isConfirmed && (
                    <Button 
                        size="sm" 
                        onClick={() => session.meeting_link && onJoin(session.meeting_link)} 
                        className={`${navyGradientClass} font-medium text-[14px] h-9 px-4 rounded-lg`}
                    >
                        <Video className="w-4 h-4 mr-2" /> Join Call
                    </Button>
                )}

                {isCompleted && session.feedback_status === 'pending' && (
                     <Button 
                        size="sm" 
                        onClick={() => onOpenFeedback(session)}
                        className={`${navyGradientClass} font-medium text-[14px] h-9 px-4 rounded-lg`}
                    >
                        Give Feedback
                    </Button>
                )}

                {isCompleted && session.feedback_status !== 'pending' && (
                     <Button 
                        variant="outline"
                        size="sm" 
                        onClick={() => session.notes_private ? setIsNotesExpanded(!isNotesExpanded) : onOpenNotes(session)}
                        className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-[14px] h-9 px-4 rounded-lg"
                    >
                        {session.notes_private ? (isNotesExpanded ? "Hide Notes" : "View Notes") : "Add Notes"}
                    </Button>
                )}

                {/* Overflow Menu for Secondary/Destructive Actions */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                            <div className="px-3 py-2 border-b border-slate-50">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</p>
                            </div>
                            
                            <button 
                                onClick={() => { setShowMenu(false); onOpenProfile(partnerId); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                            >
                                <User className="w-4 h-4" /> View Profile
                            </button>

                            {isCompleted && (
                                <button 
                                    onClick={() => { setShowMenu(false); onOpenFeedback(session); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                                >
                                    <FileText className="w-4 h-4" /> {session.feedback_status === 'submitted' ? 'Edit Feedback' : 'Give Feedback'}
                                </button>
                            )}
                            
                            {isCompleted && (
                                <button 
                                    onClick={() => { setShowMenu(false); onOpenNotes(session); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" /> {session.notes_private ? 'Edit Notes' : 'Add Notes'}
                                </button>
                            )}

                            <div className="h-px bg-slate-50 my-1"></div>

                            <button 
                                onClick={() => { setShowMenu(false); onCancel(session); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                            >
                                {isPending ? <XCircle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                {isPending ? 'Cancel Request' : 'Delete Session'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Expanded Notes Section */}
        {isCompleted && session.notes_private && isNotesExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Private Notes</h5>
                    <button 
                        onClick={() => onOpenNotes(session)}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                        <Edit2 className="w-3 h-3" /> Edit
                    </button>
                </div>
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                    {session.notes_private}
                </div>
            </div>
        )}
    </div>
  );
};
