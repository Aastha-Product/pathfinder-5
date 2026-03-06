import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Trash2, AlertTriangle, PauseCircle } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onChange: (field: keyof UserProfile, value: any) => void;
}

export default function DangerZoneSection({ profile, onChange }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const handleDeleteAccount = () => {
    if (deleteConfirmationText === 'DELETE') {
      alert('Account deletion requested. This would trigger an API call.');
      // api.deleteAccount()
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-red-50 border border-red-100 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full text-red-600">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
            <p className="text-sm text-red-700 mt-1 mb-6">
              Irreversible actions. Please proceed with caution.
            </p>

            <div className="space-y-6">
              {/* Pause Account */}
              <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Pause Account</h4>
                  <p className="text-xs text-gray-500">Temporarily hide your profile and pause notifications.</p>
                </div>
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={() => alert('Account paused')}
                >
                  <PauseCircle size={16} /> Pause
                </button>
              </div>

              {/* Delete Account */}
              <div className="flex items-center justify-between p-4 bg-white border border-red-100 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                  <p className="text-xs text-gray-500">Permanently delete your account and all data.</p>
                </div>
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Delete Account?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              This action cannot be undone. All your data, including interview history and feedback, will be permanently deleted.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </label>
              <input 
                type="text" 
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="DELETE"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== 'DELETE'}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
