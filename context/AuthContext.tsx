'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '@/lib/types/app.types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsRole: (role: 'user' | 'responder' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIXED PROTOTYPE IDS matching the SQL script
const MOCK_PROFILES: Record<string, Profile> = {
  user: { id: '00000000-0000-0000-0000-000000000001', name: 'Arjun Rao', email: 'arjun@dean.com', role: 'user' },
  responder: { id: '00000000-0000-0000-0000-000000000002', name: 'Riya Sharma', email: 'riya@dean.com', role: 'responder' },
  admin: { id: '00000000-0000-0000-0000-000000000003', name: 'System Admin', email: 'admin@dean.com', role: 'admin' },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for persisted role
    const savedRole = localStorage.getItem('dean_prototype_role');
    if (savedRole && MOCK_PROFILES[savedRole]) {
      const mockProfile = MOCK_PROFILES[savedRole];
      setProfile(mockProfile);
      
      // Ensure cookies are also set for server-side
      document.cookie = `dean_prototype_user_id=${mockProfile.id}; path=/; max-age=31536000`;
      document.cookie = `dean_prototype_role=${savedRole}; path=/; max-age=31536000`;
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    localStorage.removeItem('dean_prototype_role');
    document.cookie = 'dean_prototype_user_id=; path=/; max-age=0';
    document.cookie = 'dean_prototype_role=; path=/; max-age=0';
    setProfile(null);
    router.push('/');
  };

  const loginAsRole = async (role: 'user' | 'responder' | 'admin') => {
    setLoading(true);
    const mockProfile = MOCK_PROFILES[role];
    setProfile(mockProfile);
    localStorage.setItem('dean_prototype_role', role);
    
    // Set cookies for server-side access
    document.cookie = `dean_prototype_user_id=${mockProfile.id}; path=/; max-age=31536000`;
    document.cookie = `dean_prototype_role=${role}; path=/; max-age=31536000`;

    setLoading(false);

    if (role === 'admin') router.push('/admin');
    else if (role === 'responder') router.push('/responder');
    else router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, signOut, loginAsRole }}>
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
