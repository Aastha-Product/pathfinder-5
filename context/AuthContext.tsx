
import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User Type
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session to persist across refresh
    const storedUser = localStorage.getItem('pathfinder_mock_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: AuthUser = {
      uid: 'mock-user-123',
      email: email,
      displayName: 'Demo User',
      photoURL: null
    };
    
    setUser(mockUser);
    localStorage.setItem('pathfinder_mock_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signUp = async (email: string, name: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: AuthUser = {
      uid: 'mock-user-123',
      email: email,
      displayName: name,
      photoURL: null
    };
    
    setUser(mockUser);
    localStorage.setItem('pathfinder_mock_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem('pathfinder_mock_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
