import React from 'react';
import { Button } from './Button';
import { AuthLayout } from './AuthLayout';

interface PasswordResetProps {
  onNavigate: (view: 'login') => void;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ onNavigate }) => {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter the email associated with your account and we'll send you instructions to reset your password."
      onBack={() => onNavigate('login')}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-900">Forgot password?</h2>
        <p className="text-text-500 mt-2">No worries, we'll help you get back into your account.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder-slate-400 text-text-900 bg-surface-50 focus:bg-white"
          />
        </div>

        <Button className="w-full mt-2" size="lg">Send Reset Link</Button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => onNavigate('login')} 
          className="text-sm font-semibold text-text-500 hover:text-text-900 transition-colors flex items-center justify-center w-full gap-2"
        >
          ← Back to log in
        </button>
      </div>
    </AuthLayout>
  );
};