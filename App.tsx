
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ResourcePreview } from './components/ResourcePreview';
import { HowItWorks } from './components/HowItWorks';
import { PracticeWithOthers } from './components/PracticeWithOthers';
import { Outcomes } from './components/Outcomes';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { PasswordReset } from './components/PasswordReset';
import { Projects } from './components/Projects';
import { MockInterviews } from './components/MockInterviews';
import { CommunityFeed } from './components/CommunityFeed';
import { ResourcesRoadmap } from './components/ResourcesRoadmap';
import ProfileLayout from './components/profile/ProfileLayout';
import { ProfileSuccessModal } from './components/ProfileSuccessModal';
import { AuthProvider, useAuth } from './context/AuthContext';

type ViewState = 'landing' | 'login' | 'signup' | 'password-reset' | 'projects' | 'mock-interviews' | 'community' | 'resources' | 'profile';

// Protected Routes Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; fallback: () => void }> = ({ children, fallback }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      fallback();
    }
  }, [user, loading, fallback]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!user) return null;

  return <>{children}</>;
};

function AppContent() {
  const [isProfileSuccessOpen, setIsProfileSuccessOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');
  const [targetCourseSlug, setTargetCourseSlug] = useState<string | undefined>(undefined);
  
  const { user } = useAuth();

  // Redirect to resources if logged in and accessing auth pages
  useEffect(() => {
      if (user && (currentView === 'login' || currentView === 'signup' || currentView === 'password-reset' || currentView === 'landing')) {
          setCurrentView('resources');
      }
  }, [user]);

  // Handle navigation
  const navigateTo = (view: ViewState, slug?: string) => {
    if (slug) {
      setTargetCourseSlug(slug);
    } else if (view !== 'resources') {
      setTargetCourseSlug(undefined);
    } else {
       setTargetCourseSlug(undefined);
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
    
    // Sync with URL
    const url = new URL(window.location.href);
    url.searchParams.set('view', view);
    if (slug) {
      url.searchParams.set('slug', slug);
    } else {
      url.searchParams.delete('slug');
    }
    window.history.pushState({ view, slug }, '', url.toString());
    window.dispatchEvent(new Event('locationchange'));
  };

  // Handle popstate
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentView(event.state.view);
        if (event.state.slug) {
            setTargetCourseSlug(event.state.slug);
        } else {
            setTargetCourseSlug(undefined);
        }
      } else {
        // Fallback to URL params
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') as ViewState;
        const slug = params.get('slug');
        if (view) {
            setCurrentView(view);
            if (slug) setTargetCourseSlug(slug);
        } else {
            setCurrentView('landing');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial load from URL
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') as ViewState;
    const slug = params.get('slug');
    if (view) {
        setCurrentView(view);
        if (slug) setTargetCourseSlug(slug);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // IntersectionObserver for .fade-up
  useEffect(() => {
    const ioOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, ioOptions);

    // Observe existing elements
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // MutationObserver to observe new elements
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    if (node.classList.contains('fade-up')) {
                        observer.observe(node);
                    }
                    node.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
                }
            });
        });
    });
    
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
        observer.disconnect();
        mutationObserver.disconnect();
    };
  }, []);

  // Render content based on current view
  const renderContent = () => {
    if (currentView === 'login') {
      return <Login onNavigate={(view) => navigateTo(view as ViewState)} />;
    }
    
    if (currentView === 'signup') {
      return <SignUp onNavigate={(view) => navigateTo(view as ViewState)} />;
    }

    if (currentView === 'password-reset') {
      return <PasswordReset onNavigate={(view) => navigateTo(view as ViewState)} />;
    }

    // Protected Views
    if (['projects', 'mock-interviews', 'community', 'profile'].includes(currentView)) {
        return (
            <ProtectedRoute fallback={() => navigateTo('login')}>
                <>
                    <Header 
                        onNavigate={(view) => navigateTo(view as ViewState)}
                        onOpenProfile={() => navigateTo('profile')}
                    />
                    {currentView === 'projects' && (
                        <Projects 
                            onNavigate={(view) => navigateTo(view as ViewState)} 
                        />
                    )}
                    {currentView === 'mock-interviews' && <MockInterviews />}
                    {currentView === 'community' && <CommunityFeed />}
                    {currentView === 'profile' && <ProfileLayout />}
                </>
            </ProtectedRoute>
        );
    }

    if (currentView === 'resources') {
        return (
          <>
            <Header 
              onNavigate={(view) => navigateTo(view as ViewState)}
              onOpenProfile={() => navigateTo('profile')}
            />
            <ResourcesRoadmap 
              onNavigate={(view) => navigateTo(view as ViewState)} 
              initialSearchTerm={resourceSearchQuery}
              initialCourseSlug={targetCourseSlug}
            />
          </>
        );
      }

    return (
      <>
        <Header 
          onNavigate={(view) => navigateTo(view as ViewState)}
          onOpenProfile={() => navigateTo('profile')}
        />
        <main>
          <Hero 
            onNavigate={(view) => navigateTo(view as ViewState)}
            onSearch={(query) => {
              setResourceSearchQuery(query);
              navigateTo('resources');
            }}
          />
          <ResourcePreview limit={3} onNavigate={(view, slug) => navigateTo(view as ViewState, slug)} />
          <HowItWorks onNavigate={(view) => navigateTo(view as ViewState)} />
          <PracticeWithOthers onNavigate={(view) => navigateTo(view as ViewState)} />
          <Outcomes />
          <FAQ />
        </main>
        <Footer onNavigate={(view) => navigateTo(view as ViewState)} />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white text-text-900 font-sans selection:bg-primary-600/20 selection:text-primary-700">
      {renderContent()}
      <ProfileSuccessModal 
        isOpen={isProfileSuccessOpen} 
        onClose={() => setIsProfileSuccessOpen(false)} 
      />
    </div>
  );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
