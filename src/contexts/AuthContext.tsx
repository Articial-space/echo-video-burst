
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; requiresEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null; message?: string; rateLimited?: boolean }>;
  verifyEmail: (accessToken: string, refreshToken: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session first
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && !error) {
          setSession(session);
          setUser(session.user);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session);
          setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setSession(session);
          setUser(session.user);
        } else if (event === 'USER_UPDATED' && session) {
          setSession(session);
          setUser(session.user);
        }
        
        setLoading(false);
      }
    );

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/email-verification`;
      
      console.log('Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: fullName ? { full_name: fullName } : undefined
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }
      
      console.log('Sign up successful:', data);
      console.log('User email_confirmed_at:', data.user?.email_confirmed_at);
      console.log('Session exists:', !!data.session);
      
      // FORCE email verification for all new signups
      // This handles cases where Supabase auto-confirms emails
      if (data.user) {
        // Check if email is already confirmed (auto-confirm case)
        if (data.user.email_confirmed_at) {
          console.log('Email was auto-confirmed, but forcing verification anyway');
        } else {
          console.log('Email confirmation required for:', email);
        }
        
        // Always require email verification for new signups
        // Sign out the user to prevent auto-login
        if (data.session) {
          console.log('Signing out user to force email verification');
          await supabase.auth.signOut();
        }
        
        return { error: null, requiresEmailConfirmation: true };
      }
      
      return { error: null, requiresEmailConfirmation: false };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error };
      }
      
      // The session should be automatically set by the auth state listener
      // but we can also set it here for immediate response
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        return { error };
      }
      
      console.log('Google sign in initiated:', data);
      // For OAuth, the user will be redirected, so we don't need to set session here
      return { error: null };
    } catch (error) {
      console.error('Google sign in exception:', error);
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      // Security-first approach: Never reveal if email exists or not
      // This prevents user enumeration attacks
      
      if (error) {
        console.error('Reset password error:', error);
        
        // Handle specific error cases without revealing email existence
        if (error.message?.toLowerCase().includes('rate limit')) {
          return { 
            error: new Error("Too many reset attempts. Please wait before trying again."),
            rateLimited: true
          };
        }
        
        // For other errors, don't reveal specifics
        return { 
          error: null, // Don't reveal the actual error
          message: "If that email address is registered with us, we've sent you a reset link. Please check your email (including spam folder)."
        };
      }
      
      // Success case - but don't reveal if email actually exists
      return { 
        error: null,
        message: "If that email address is registered with us, we've sent you a reset link. Please check your email (including spam folder)."
      };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { 
        error: new Error("Unable to send reset email. Please try again later."),
        message: null 
      };
    }
  };

  const verifyEmail = async (accessToken: string, refreshToken: string) => {
    try {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        // Clear local state immediately
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    verifyEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
