import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { api } from '../../services/api';
import { X, Upload, FileText, Link as LinkIcon, Github, Linkedin, Globe } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
}

const SUGGESTED_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Java', 'SQL', 
  'System Design', 'AWS', 'Docker', 'GraphQL', 'Product Management',
  'Data Analysis', 'Machine Learning', 'Figma'
];

export default function ProfessionalInfoSection({ profile, onChange }: Props) {
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !profile.skills.includes(trimmed) && profile.skills.length < 10) {
      onChange('skills', [...profile.skills, trimmed]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    onChange('skills', profile.skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const { resume_url } = await api.uploadResume(e.target.files[0]);
        onChange('resume_url', resume_url);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Role & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Role <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={profile.target_role}
            onChange={(e) => onChange('target_role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Frontend Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            min="0"
            max="50"
            value={profile.years_experience || 0}
            onChange={(e) => onChange('years_experience', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3 p-3 border border-gray-200 rounded-lg bg-gray-50 min-h-[48px]">
          {profile.skills.map(skill => (
            <span key={skill} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} className="ml-1.5 hover:text-primary-900">
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none min-w-[120px] text-sm"
            placeholder={profile.skills.length < 10 ? "Type & press Enter..." : "Max skills reached"}
            disabled={profile.skills.length >= 10}
          />
        </div>
        <p className="text-xs text-gray-500 mb-2">Add up to 10 skills relevant to your target role.</p>
        
        {/* Suggestions */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_SKILLS.filter(s => !profile.skills.includes(s)).slice(0, 6).map(skill => (
            <button
              key={skill}
              onClick={() => handleAddSkill(skill)}
              className="text-xs px-2 py-1 border border-gray-300 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Resume */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume
        </label>
        <div className="flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="p-3 bg-primary-50 rounded-full text-primary-600">
            <FileText size={24} />
          </div>
          <div className="flex-1">
            {profile.resume_url ? (
              <div className="flex items-center justify-between">
                <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary-600 hover:underline truncate max-w-[200px]">
                  View Uploaded Resume
                </a>
                <button onClick={() => onChange('resume_url', '')} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-900">Upload your resume</p>
                <p className="text-xs text-gray-500">PDF only, max 8MB</p>
              </div>
            )}
          </div>
          {!profile.resume_url && (
            <label className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-all">
              Browse
              <input type="file" className="hidden" accept="application/pdf" onChange={handleResumeUpload} />
            </label>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Social Links</h3>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Linkedin size={18} />
          </div>
          <input
            type="url"
            value={profile.linkedin_url || ''}
            onChange={(e) => onChange('linkedin_url', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Github size={18} />
          </div>
          <input
            type="url"
            value={profile.github_url || ''}
            onChange={(e) => onChange('github_url', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="https://github.com/username"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Globe size={18} />
          </div>
          <input
            type="url"
            value={profile.portfolio_url || ''}
            onChange={(e) => onChange('portfolio_url', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="https://yourportfolio.com"
          />
        </div>
      </div>
    </div>
  );
}
