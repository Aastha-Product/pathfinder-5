
import React from 'react';
import { Video, Plus, FileText } from 'lucide-react';
import { Button } from './Button';
import { PracticeLogEntry, MockSession } from '../types';

interface PracticeLogListProps {
  logs: PracticeLogEntry[];
  sessions: MockSession[];
  onAddManual: () => void;
  onOpenFeedback: (session: MockSession) => void;
}

export const PracticeLogList: React.FC<PracticeLogListProps> = ({ logs, sessions, onAddManual, onOpenFeedback }) => {
  return (
    <div className="lg:col-span-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Practice Log</h2>
            <div className="flex gap-2">
                 <Button variant="outline" size="sm" className="text-xs h-9">Export CSV</Button>
                 <Button variant="secondary" size="sm" className="text-xs h-9 border-dashed border-slate-300" onClick={onAddManual}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Manual Entry
                 </Button>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {logs.length > 0 || sessions.length > 0 ? (
                <div className="divide-y divide-slate-100">
                    {/* Combine Completed Logs and Pending Sessions for Display */}
                    {sessions.filter(s => s.status === 'pending' || s.status === 'confirmed').map(session => (
                        <div key={session.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-blue-50/30">
                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">Scheduled: {session.partner_name}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">Times: {session.proposed_times}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    {session.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                </span>
                                {session.status === 'confirmed' && (
                                    <Button size="sm" className="text-xs h-8" onClick={() => onOpenFeedback(session)}>
                                        Submit Feedback
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    {logs.map((log) => (
                        <div key={log.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.type === 'Mock Interview' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {log.type === 'Mock Interview' ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">
                                        {log.type === 'Mock Interview' ? `Session with ${log.partner_name}` : 'Self Practice'}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{log.date} • {log.duration_minutes} min</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                                <div className="flex flex-col items-end">
                                    {log.self_score ? (
                                        <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                                            log.self_score >= 90 ? 'bg-emerald-100 text-emerald-700' : 
                                            log.self_score >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {log.self_score}% Score
                                        </span>
                                    ) : (
                                        <span className="text-xs font-medium text-slate-400 italic">No score</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold mb-1">No sessions yet</h3>
                    <p className="text-slate-500 text-sm mb-4">Invite a mentor or schedule your first mock.</p>
                </div>
            )}
        </div>
    </div>
  );
};

const ClockIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
