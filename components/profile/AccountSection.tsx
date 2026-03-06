import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { api } from '../../services/api';
import { Mail, ShieldCheck, Lock, CheckCircle, AlertCircle, Github, Linkedin, Chrome } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
  onNestedChange: (parent: keyof UserProfile, field: string, value: any) => void;
}

export default function AccountSection({ profile, onChange, onNestedChange }: Props) {
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    try {
      await api.verifyEmail();
      onChange('email_verified', true);
    } catch (err) {
      alert('Verification failed');
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Email */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-50 rounded-full text-primary-600">
            <Mail size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Email Address</h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-900 font-medium">{profile.email}</span>
              {profile.email_verified ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  <CheckCircle size={12} /> Verified
                </span>
              ) : (
                <button 
                  onClick={handleVerifyEmail}
                  disabled={verifyingEmail}
                  className="text-xs font-medium text-primary-600 hover:text-primary-800 underline"
                >
                  {verifyingEmail ? 'Sending...' : 'Verify Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Change Password</h3>
        <div className="grid grid-cols-1 gap-4 max-w-md">
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.current}
            onChange={(e) => handlePasswordChange('current', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            type="password"
            placeholder="New Password (min 12 chars)"
            value={passwords.new}
            onChange={(e) => handlePasswordChange('new', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirm}
            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Connected Accounts</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Chrome size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Google</span>
            </div>
            <button 
              onClick={() => onNestedChange('connected_accounts', 'google', !profile.connected_accounts?.google)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                profile.connected_accounts?.google 
                  ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {profile.connected_accounts?.google ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Github size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">GitHub</span>
            </div>
            <button 
              onClick={() => onNestedChange('connected_accounts', 'github', !profile.connected_accounts?.github)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                profile.connected_accounts?.github 
                  ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {profile.connected_accounts?.github ? 'Disconnect' : 'Connect'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Linkedin size={20} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-700">LinkedIn</span>
            </div>
            <button 
              onClick={() => onNestedChange('connected_accounts', 'linkedin', !profile.connected_accounts?.linkedin)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                profile.connected_accounts?.linkedin 
                  ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' 
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {profile.connected_accounts?.linkedin ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
