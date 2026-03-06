import React, { useState } from 'react';
import { UserProfile, AvailabilitySlot } from '../../types';
import { Clock, Plus, Trash2, Check } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'
];

const FOCUS_AREAS = [
  'Algorithms', 'System Design', 'Frontend', 'Backend', 'Behavioral', 'Databases', 'DevOps', 'Mobile', 'AI/ML'
];

export default function InterviewReadinessSection({ profile, onChange }: Props) {
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<AvailabilitySlot>({ weekday: 1, start_time: '09:00', end_time: '17:00' });

  const handleAddSlot = () => {
    if (newSlot.start_time >= newSlot.end_time) {
      alert('Start time must be before end time');
      return;
    }
    const updated = [...(profile.availability || []), newSlot];
    onChange('availability', updated);
    setIsAddingSlot(false);
    setNewSlot({ weekday: 1, start_time: '09:00', end_time: '17:00' });
  };

  const handleRemoveSlot = (index: number) => {
    const updated = [...(profile.availability || [])];
    updated.splice(index, 1);
    onChange('availability', updated);
  };

  const handleToggleFocus = (area: string) => {
    const current = profile.interview_focus || [];
    if (current.includes(area)) {
      onChange('interview_focus', current.filter(a => a !== area));
    } else {
      if (current.length >= 3) return;
      onChange('interview_focus', [...current, area]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Availability Toggle */}
      <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-100">
        <div>
          <h3 className="text-sm font-medium text-primary-900">Available for Interviews</h3>
          <p className="text-xs text-primary-700 mt-1">
            Turn this on to appear in the match pool for peers and mentors.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={profile.is_available_for_interview} 
            onChange={(e) => onChange('is_available_for_interview', e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      </div>

      {profile.is_available_for_interview && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone <span className="text-red-500">*</span>
              </label>
              <select
                value={profile.timezone || 'UTC'}
                onChange={(e) => onChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability Slots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Weekly Availability <span className="text-red-500">*</span>
              </label>
              <button 
                onClick={() => setIsAddingSlot(true)}
                className="text-xs font-medium text-primary-600 hover:text-primary-800 flex items-center gap-1"
              >
                <Plus size={14} /> Add Slot
              </button>
            </div>
            
            <div className="space-y-2">
              {profile.availability?.map((slot, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900 w-24">{WEEKDAYS[slot.weekday]}</span>
                    <span className="text-sm text-gray-600">{slot.start_time} - {slot.end_time}</span>
                  </div>
                  <button onClick={() => handleRemoveSlot(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              
              {(!profile.availability || profile.availability.length === 0) && !isAddingSlot && (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 text-sm">
                  No availability slots added yet.
                </div>
              )}

              {isAddingSlot && (
                <div className="p-4 bg-gray-50 border border-primary-100 rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <select 
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={newSlot.weekday}
                      onChange={e => setNewSlot({...newSlot, weekday: parseInt(e.target.value)})}
                    >
                      {WEEKDAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                    <input 
                      type="time" 
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={newSlot.start_time}
                      onChange={e => setNewSlot({...newSlot, start_time: e.target.value})}
                    />
                    <span className="self-center text-gray-400">-</span>
                    <input 
                      type="time" 
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={newSlot.end_time}
                      onChange={e => setNewSlot({...newSlot, end_time: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsAddingSlot(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                    <button onClick={handleAddSlot} className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 rounded">Add</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Focus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Focus (Max 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {FOCUS_AREAS.map(area => {
                const isSelected = (profile.interview_focus || []).includes(area);
                return (
                  <button
                    key={area}
                    onClick={() => handleToggleFocus(area)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      isSelected 
                        ? 'bg-primary-100 border-primary-200 text-primary-800' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {area}
                    {isSelected && <Check size={12} className="inline-block ml-1.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Privacy
            </label>
            <select
              value={profile.feedback_public_opt_in || 'private'}
              onChange={(e) => onChange('feedback_public_opt_in', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
            >
              <option value="public">Public (Visible on profile)</option>
              <option value="private">Private (Only you and partner)</option>
              <option value="off">Off (No feedback collection)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Control who can see feedback from your mock interviews.</p>
          </div>

        </div>
      )}
    </div>
  );
}
