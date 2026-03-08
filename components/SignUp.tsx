
import React, { useState } from 'react';
import { Button } from './Button';
import { AuthLayout } from './AuthLayout';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SignUpProps {
  onNavigate: (view: 'landing' | 'login' | 'dashboard') => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { signUp, loading } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');

    try {
      await signUp(email, name, password);
      onNavigate('dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please log in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    }
  };

  return (
    <AuthLayout
      title="Join the community"
      subtitle="Start your journey to mastery. Create an account to track progress and join mock interviews."
      onBack={() => onNavigate('landing')}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-900">Sign up</h2>
        <p className="text-text-500 mt-2">Create your free account to get started.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSignUp}>
        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder-slate-400 text-text-900 bg-surface-50 focus:bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder-slate-400 text-text-900 bg-surface-50 focus:bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder-slate-400 text-text-900 bg-surface-50 focus:bg-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button className="w-full mt-2" size="lg" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-500">
        Already have an account?{' '}
        <button
          onClick={() => onNavigate('login')}
          className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
        >
          Log in
        </button>
      </p>
    </AuthLayout>
  );
};
