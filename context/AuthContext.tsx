'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types/app.types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginAsRole: (role: 'user' | 'responder' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error) setProfile(data);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    router.push('/');
  };

  const loginAsRole = async (role: 'user' | 'responder' | 'admin') => {
    setLoading(true);
    let email = '';
    let password = '';

    if (role === 'admin') {
      email = 'admin@dean.com';
      password = 'admin123';
    } else if (role === 'responder') {
      email = 'riya@dean.com';
      password = 'resp123';
    } else {
      email = 'arjun@dean.com';
      password = 'user123';
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error('Mock login failed:', error.message);
      setLoading(false);
      return;
    }

    // Explicitly fetch profile to ensure state is ready before redirect
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    setProfile(profileData);
    setUser(data.user);
    setLoading(false);

    if (role === 'admin') router.push('/admin');
    else if (role === 'responder') router.push('/responder');
    else router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, loginAsRole }}>
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
