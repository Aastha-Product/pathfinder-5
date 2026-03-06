import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../../types';
import { api } from '../../services/api';
import { 
  User, Briefcase, Calendar, Shield, Lock, Bell, AlertTriangle, 
  CheckCircle, AlertCircle, Save, Loader2, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Section Components (Placeholders for now)
import BasicInfoSection from './BasicInfoSection';
import ProfessionalInfoSection from './ProfessionalInfoSection';
import InterviewReadinessSection from './InterviewReadinessSection';
import PrivacySection from './PrivacySection';
import AccountSection from './AccountSection';
import NotificationsSection from './NotificationsSection';
import DangerZoneSection from './DangerZoneSection';

const SECTIONS = [
  { id: 'basic', label: 'Basic Information', icon: User },
  { id: 'professional', label: 'Professional Information', icon: Briefcase },
  { id: 'readiness', label: 'Interview Readiness', icon: Calendar },
  { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
  { id: 'account', label: 'Account & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, className: 'text-red-500 hover:text-red-600' },
];

export default function ProfileLayout() {
  const [activeSection, setActiveSection] = useState('basic');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draftProfile, setDraftProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [missingItems, setMissingItems] = useState<string[]>([]);

  // Fetch Profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile();
        setProfile(data);
        setDraftProfile(data);
        
        // Check for local draft
        const localDraft = localStorage.getItem('profile_draft');
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          // Simple check if draft is newer or different could go here
          // For now, we'll just use the API data as source of truth on load
          // unless we want to prompt user. Sticking to API data for simplicity.
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // Fetch Checklist
  useEffect(() => {
    const loadChecklist = async () => {
      const items = await api.getMissingChecklist();
      setMissingItems(items);
    };
    loadChecklist();
  }, [profile]);

  // Autosave Draft to LocalStorage
  useEffect(() => {
    if (!isDirty || !draftProfile) return;

    const interval = setInterval(() => {
      localStorage.setItem('profile_draft', JSON.stringify(draftProfile));
      setLastSaved(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [draftProfile, isDirty]);

  const handleFieldChange = useCallback((field: keyof UserProfile, value: any) => {
    setDraftProfile(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
    setIsDirty(true);
  }, []);

  const handleNestedChange = useCallback((parent: keyof UserProfile, field: string, value: any) => {
    setDraftProfile(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        [parent]: {
          ...(prev[parent] as any),
          [field]: value
        }
      };
    });
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    if (!draftProfile) return;
    setSaving(true);
    try {
      const updated = await api.updateProfile(draftProfile);
      setProfile(updated);
      setDraftProfile(updated);
      setIsDirty(false);
      localStorage.removeItem('profile_draft');
      // Show toast (mock)
      // alert(`Profile saved — Completion: ${updated.profile_completion_percentage}%`);
      // Using a more subtle notification or relying on the button state reset
      if ((window as any).showToast) (window as any).showToast('Profile saved successfully');
    } catch (err: any) {
      alert(`Error saving profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-indigo-600" /></div>;
  if (!profile || !draftProfile) return <div>Error loading profile</div>;

  const renderSection = () => {
    const props = { profile: draftProfile, onChange: handleFieldChange, onNestedChange: handleNestedChange };
    switch (activeSection) {
      case 'basic': return <BasicInfoSection {...props} />;
      case 'professional': return <ProfessionalInfoSection {...props} />;
      case 'readiness': return <InterviewReadinessSection {...props} />;
      case 'privacy': return <PrivacySection {...props} />;
      case 'account': return <AccountSection {...props} />;
      case 'notifications': return <NotificationsSection {...props} />;
      case 'danger': return <DangerZoneSection {...props} />;
      default: return <BasicInfoSection {...props} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-full md:w-[280px] bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
             <button 
              onClick={handleBack}
              className="settings-back md:hidden"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Settings</h1>
          </div>
          
          {/* Progress Widget */}
          <div className="mt-6 bg-primary-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary-900">Profile Completion</span>
              <span className="text-sm font-bold text-primary-700">{profile.profile_completion_percentage}%</span>
            </div>
            <div className="w-full bg-primary-200 rounded-full h-2 mb-3">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${profile.profile_completion_percentage}%` }}
              />
            </div>
            <button 
              onClick={() => setShowChecklist(!showChecklist)}
              className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1"
            >
              {missingItems.length > 0 ? `${missingItems.length} steps to interview-ready` : 'All set!'}
              <AlertCircle size={12} />
            </button>
            
            {/* Checklist Popover */}
            <AnimatePresence>
              {showChecklist && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-10 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
                >
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Missing Items</h4>
                  {missingItems.length === 0 ? (
                    <div className="text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle size={16} /> You're ready!
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {missingItems.map((item, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeSection === section.id 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${section.className || ''}`}
            >
              <section.icon size={18} />
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative h-screen overflow-y-auto bg-gray-50/50">
        <div className="max-w-3xl mx-auto min-h-full flex flex-col pb-24"> {/* Added pb-24 for footer space */}
          <header className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm px-6 py-6 md:px-12 md:py-8 border-b border-gray-200/50 flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200/50 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 m-0 leading-none pt-0.5">
              {SECTIONS.find(s => s.id === activeSection)?.label}
            </h2>
          </header>

          <div className="px-6 md:px-12 py-6 flex-1">
             {renderSection()}
          </div>

          {/* Sticky Footer */}
          <div className="fixed bottom-0 right-0 w-full md:w-[calc(100%-280px)] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 md:px-12 md:py-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
               {lastSaved && isDirty && (
                <span className="text-xs text-gray-500 font-medium">
                  Draft saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            <div>
              <button 
                id="settings-save" 
                className={`
                  flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
                  ${!isDirty || saving 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 hover:shadow-md hover:-translate-y-0.5'
                  }
                `}
                type="button" 
                disabled={!isDirty || saving} 
                aria-disabled={!isDirty || saving}
                onClick={handleSave}
              >
                 {saving ? <Loader2 className="animate-spin" size={16} /> : null}
                 {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
