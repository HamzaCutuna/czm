"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  isAllowedEmail: (email: string) => boolean;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session with error handling
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn('Session error:', error.message);
          // If refresh token is invalid, clear the session
          if (error.message.includes('refresh_token_not_found') || 
              error.message.includes('Invalid Refresh Token')) {
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(session?.user ?? null);
          }
        } else {
          setUser(session?.user ?? null);
        }
      } catch (err) {
        console.error('Failed to get session:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email, session?.user?.email_confirmed_at);

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with email:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Sign in response:', { data, error });

    if (error) {
      console.error('Sign in error:', error);
    } else {
      console.log('Sign in successful, user:', data.user?.email);
    }

    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log('Attempting to sign up with email:', email);

    // Temporarily disable domain restriction for testing
    // if (!isAllowedEmail(email)) {
    //   return { error: { message: 'Email domain not allowed. Only @edu.fit.ba and @gmail.com are permitted.' } };
    // }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/signin`,
      }
    });

    console.log('Sign up response:', { data, error });

    if (error) {
      console.error('Sign up error:', error);
    } else {
      console.log('Sign up successful, user:', data.user?.email);
    }

    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Sign out error:', error.message);
      }
      // Clear user state regardless of error
      setUser(null);
      return { error };
    } catch (err) {
      console.error('Failed to sign out:', err);
      setUser(null);
      return { error: err };
    }
  };

  const isAllowedEmail = (email: string): boolean => {
    return /@(edu\.fit\.ba|gmail\.com)$/.test(email);
  };

  const clearSession = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Failed to clear session:', err);
      setUser(null);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAllowedEmail,
    clearSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
