
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './AuthContext';
import { AuthUser } from './types';
import { fetchUserProfile, loginUser, signupUser, logoutUser } from './authUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          const userProfile = await fetchUserProfile(currentSession);
          console.log("Fetched user profile:", userProfile);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session on load
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      if (currentSession?.user) {
        fetchUserProfile(currentSession).then(userProfile => {
          console.log("Initial profile fetch:", userProfile);
          setUser(userProfile);
          setSession(currentSession);
          setIsLoading(false);
        });
      } else {
        console.log("No initial session found");
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Login method called with email:", email);
    setIsLoading(true);
    
    const { success, data, error } = await loginUser(email, password);
    
    console.log("Login result:", { success, data: data?.user?.id || null, error });
    
    if (!success) {
      setIsLoading(false);
    }
    
    return success;
  };

  const signup = async (
    email: string, 
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      role: UserRole;
      identification_type: string;
      identification_number: string;
      phone?: string;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    const { success } = await signupUser(email, password, userData);
    
    setIsLoading(false);
    return success;
  };

  const logout = async () => {
    setIsLoading(true);
    await logoutUser();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
