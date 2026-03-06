
import React, { useState } from 'react';
import { Button } from './Button';
import { AuthLayout } from './AuthLayout';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigate: (view: 'landing' | 'signup' | 'password-reset' | 'dashboard') => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Please enter both email and password.');
        return;
    }

    setError('');

    try {
        await signIn(email);
        onNavigate('dashboard');
    } catch (err: any) {
        console.error(err);
        setError('Failed to log in. Please try again.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back!"
      subtitle="We are glad to see you again! Get access to your roadmaps, study groups, and mock interviews."
      onBack={() => onNavigate('landing')}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-900">Log in</h2>
        <p className="text-text-500 mt-2">Enter your credentials to access your account.</p>
      </div>

      <form className="space-y-5" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Email Address</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all placeholder-slate-400 text-text-900 bg-surface-50 focus:bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-700 mb-1.5">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password"
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <span className="text-text-500 font-normal">Remember me</span>
          </label>
          <button 
            type="button"
            onClick={() => onNavigate('password-reset')}
            className="text-primary-600 font-medium hover:text-primary-700 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <Button className="w-full mt-2" size="lg" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text-500">
        Don't have an account?{' '}
        <button 
          onClick={() => onNavigate('signup')} 
          className="text-primary-600 font-semibold hover:text-primary-700 hover:underline"
        >
          Sign up
        </button>
      </p>
    </AuthLayout>
  );
};
