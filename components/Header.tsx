
import React, { useState } from 'react';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from './Button';
import { NAV_ITEMS } from '../constants';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate: (view: 'login' | 'projects' | 'landing' | 'mock-interviews' | 'dashboard' | 'community' | 'resources') => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenProfile }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
        await signOut();
        onNavigate('landing');
    } catch (error) {
        console.error("Failed to sign out", error);
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    
    // View Navigation
    if (label === 'Home') {
        onNavigate('landing');
        setIsMobileMenuOpen(false);
        return;
    }

    const viewMap: Record<string, 'projects' | 'mock-interviews' | 'community' | 'resources'> = {
        'Projects': 'projects',
        'Mock Interviews': 'mock-interviews',
        'Community': 'community',
        'Resources': 'resources'
    };

    if (viewMap[label]) {
        onNavigate(viewMap[label]);
        setIsMobileMenuOpen(false);
        return;
    }

    // Default scroll handling for landing page sections
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Assume we need to go to landing first
        onNavigate('landing');
        setTimeout(() => {
          const el = document.querySelector(href);
          if (el) {
             const offset = 80;
             const elementPosition = el.getBoundingClientRect().top + window.scrollY;
             const offsetPosition = elementPosition - offset;
             window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-4">
              {/* Logo - Image */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <img 
                  src="https://ui-avatars.com/api/?name=PF&background=1e3a8a&color=fff&rounded=true&bold=true&size=128" 
                  alt="Pathfinder Logo" 
                  className="w-10 h-10 rounded-xl shadow-lg shadow-blue-900/20" 
                />
                <span className="text-2xl font-bold text-slate-900 tracking-tight">Pathfinder</span>
              </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href, item.label)}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {!user ? (
                <>
                    <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('login')}
                    className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                    >
                    Sign in
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => onNavigate('resources')} className="shadow-lg shadow-primary-600/20 ml-2 px-6">
                        Start Learning Free
                    </Button>
                </>
            ) : (
                <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                    {onOpenProfile && (
                        <button 
                            onClick={onOpenProfile}
                            className="group relative focus:outline-none"
                            title="Edit Profile"
                        >
                            <div className="w-11 h-11 rounded-full bg-[#0ea5e9] border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-medium text-lg tracking-normal">
                                        {(() => {
                                            const name = user.displayName || 'User';
                                            const parts = name.trim().split(/\s+/);
                                            if (parts.length === 0) return 'U';
                                            if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
                                            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                                        })()}
                                    </span>
                                )}
                            </div>
                        </button>
                    )}
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-medium group"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black hover:text-primary-600 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-100 shadow-lg py-4 px-4 flex flex-col space-y-4 h-screen">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleScroll(e, item.href, item.label)}
              className="block text-lg font-bold text-black hover:bg-slate-50 hover:text-primary-600 px-3 py-2 rounded-md"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-6 border-t border-slate-100 flex flex-col space-y-4">
            {!user ? (
                <>
                    <button 
                    onClick={() => {
                        onNavigate('login');
                        setIsMobileMenuOpen(false);
                    }}
                    className="block text-center text-lg font-bold text-black"
                    >
                    Sign in
                    </button>
                    <Button variant="primary" className="w-full" size="lg" onClick={() => {
                    onNavigate('resources');
                    setIsMobileMenuOpen(false);
                    }}>
                    Start Learning Free
                    </Button>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-center gap-2 py-2">
                        <span className="text-slate-500 font-medium">Signed in as {user.email}</span>
                    </div>
                    {onOpenProfile && (
                        <button 
                            onClick={() => {
                                onOpenProfile();
                                setIsMobileMenuOpen(false);
                            }}
                            className="block text-center text-lg font-bold text-slate-600"
                        >
                            Edit Profile
                        </button>
                    )}
                    <button 
                        onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="block text-center text-lg font-bold text-red-500"
                    >
                        Sign Out
                    </button>
                </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
