import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Shield, Eye, MessageSquare, UserPlus, AlertTriangle } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
}

export default function PrivacySection({ profile, onChange }: Props) {
  const [showPublicConfirm, setShowPublicConfirm] = useState(false);

  const handlePublicToggle = (value: string) => {
    if (value === 'public' && profile.profile_completion_percentage < 50) {
      setShowPublicConfirm(true);
    } else {
      onChange('is_public', value);
    }
  };

  const confirmPublic = () => {
    onChange('is_public', 'public');
    setShowPublicConfirm(false);
  };

  return (
    <div className="space-y-8">
      {/* Profile Visibility */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-50 rounded-full text-primary-600">
            <Eye size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Profile Visibility</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Control who can see your profile, skills, and progress.
            </p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="public" 
                  checked={profile.is_public === 'public'} 
                  onChange={() => handlePublicToggle('public')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Public</span>
                  <span className="block text-xs text-gray-500">Visible to everyone. Best for getting invites.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="search_visible" 
                  checked={profile.is_public === 'search_visible'} 
                  onChange={() => onChange('is_public', 'search_visible')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Searchable Only</span>
                  <span className="block text-xs text-gray-500">Visible in search results but details hidden.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="radio" 
                  name="visibility" 
                  value="private" 
                  checked={profile.is_public === 'private'} 
                  onChange={() => onChange('is_public', 'private')}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div>
                  <span className="block text-sm font-medium text-gray-900">Private</span>
                  <span className="block text-xs text-gray-500">Only visible to you.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Granular Controls */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Detailed Settings</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-gray-700">Show Skills Publicly</span>
            <span className="block text-xs text-gray-500">Allow others to see your skill tags.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={profile.show_skills_publicly} 
              onChange={(e) => onChange('show_skills_publicly', e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="block text-sm font-medium text-gray-700">Show Progress Publicly</span>
            <span className="block text-xs text-gray-500">Share your learning milestones.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={profile.show_progress_publicly} 
              onChange={(e) => onChange('show_progress_publicly', e.target.checked)}
              className="sr-only peer" 
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>



      {/* Confirmation Modal */}
      {showPublicConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Profile Incomplete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Your profile completion is below 50%. Public profiles with more details get 3x more interview invites. Are you sure you want to make it public now?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPublicConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPublic}
                className="px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg"
              >
                Make Public Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
