import React from 'react';
import { UserProfile } from '../../types';
import { Mail, MessageSquare } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
  onNestedChange: (parent: keyof UserProfile, field: string, value: any) => void;
}

export default function NotificationsSection({ profile, onChange, onNestedChange }: Props) {
  // Helper to safely access nested properties
  const getNotificationSetting = (type: 'email' | 'sms', key: string) => {
    return profile.notification_preferences?.[type]?.[key] ?? false;
  };

  const handleToggle = (type: 'email' | 'sms', key: string) => {
    const currentSettings = profile.notification_preferences?.[type] || {};
    onNestedChange('notification_preferences', type, {
      ...currentSettings,
      [key]: !currentSettings[key]
    });
  };

  return (
    <div className="space-y-8">
      {/* Email Notifications */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-primary-50 rounded-full text-primary-600">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose what updates you want to receive via email.
            </p>
          </div>
        </div>

        <div className="space-y-4 pl-16">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-sm font-medium text-gray-900">Interview Invites</span>
              <span className="block text-xs text-gray-500">When someone invites you to a mock interview.</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={getNotificationSetting('email', 'interview_invites')} 
                onChange={() => handleToggle('email', 'interview_invites')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </div>
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-sm font-medium text-gray-900">Session Reminders</span>
              <span className="block text-xs text-gray-500">1 hour before your scheduled session.</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={getNotificationSetting('email', 'session_reminders')} 
                onChange={() => handleToggle('email', 'session_reminders')}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
