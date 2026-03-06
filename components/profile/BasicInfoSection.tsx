import React from 'react';
import { UserProfile } from '../../types';
import { api } from '../../services/api';
import { Upload, X } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
}

export default function BasicInfoSection({ profile, onChange }: Props) {
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const { photo_url } = await api.uploadPhoto(e.target.files[0]);
        onChange('photo_url', photo_url);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Photo Upload */}
      <div className="flex items-center gap-6">
        <div className="relative group w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
          {profile.photo_url ? (
            <img src={profile.photo_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <Upload size={24} />
            </div>
          )}
          <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-white text-xs font-medium">Change</span>
            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handlePhotoUpload} />
          </label>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
          <p className="text-xs text-gray-500 mt-1">
            Recommended 1:1 ratio. Max 5MB. JPG or PNG.
          </p>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.first_name}
            onChange={(e) => onChange('first_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Jane"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.last_name}
            onChange={(e) => onChange('last_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Doe"
          />
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Name
        </label>
        <input
          type="text"
          value={profile.display_name || ''}
          onChange={(e) => onChange('display_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder={profile.first_name + ' ' + profile.last_name}
        />
        <p className="text-xs text-gray-500 mt-1">How your name appears to others.</p>
      </div>

      {/* Headline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline
        </label>
        <input
          type="text"
          value={profile.headline || ''}
          onChange={(e) => onChange('headline', e.target.value)}
          maxLength={80}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          placeholder="Aspiring Software Engineer | React Enthusiast"
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">{(profile.headline?.length || 0)}/80</span>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={profile.bio || ''}
          onChange={(e) => onChange('bio', e.target.value)}
          maxLength={250}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Tell us about yourself..."
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">{(profile.bio?.length || 0)}/250</span>
        </div>
      </div>

      {/* Location & Role */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={profile.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="City, Country"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Role
          </label>
          <input
            type="text"
            value={profile.current_role || ''}
            onChange={(e) => onChange('current_role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Student, Developer, etc."
          />
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Experience Level
        </label>
        <select
          value={profile.experience_level || ''}
          onChange={(e) => onChange('experience_level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
        >
          <option value="">Select Level</option>
          <option value="student">Student</option>
          <option value="junior">Junior (0-2 years)</option>
          <option value="mid">Mid-Level (3-5 years)</option>
          <option value="senior">Senior (5+ years)</option>
          <option value="manager">Manager</option>
        </select>
      </div>
    </div>
  );
}
