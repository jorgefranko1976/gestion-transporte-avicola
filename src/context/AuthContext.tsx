
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Check for stored user first (for quicker UI updates)
        const storedUser = localStorage.getItem('transportUser');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('transportUser');
          }
        }
        
        // Then verify with Supabase
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Get user profile data
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
          } else if (profileData) {
            const userData: User = {
              id: data.session.user.id,
              name: `${profileData.first_name} ${profileData.last_name}`,
              role: profileData.role as UserRole,
              email: data.session.user.email,
            };
            setUser(userData);
            localStorage.setItem('transportUser', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          localStorage.removeItem('transportUser');
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profileData) {
          const userData: User = {
            id: session.user.id,
            name: `${profileData.first_name} ${profileData.last_name}`,
            role: profileData.role as UserRole,
            email: session.user.email,
          };
          setUser(userData);
          localStorage.setItem('transportUser', JSON.stringify(userData));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('transportUser');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message || 'Error al iniciar sesión');
        setIsLoading(false);
        return false;
      }
      
      if (data.user) {
        // User profile is fetched in the auth state change listener
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error inesperado al iniciar sesión');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    role: UserRole,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
            identification_type: 'CC',
            identification_number: '0',
          },
        },
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message || 'Error al registrar usuario');
        setIsLoading(false);
        return false;
      }
      
      if (data.user) {
        toast.success('Usuario registrado correctamente. Verifica tu correo para confirmar la cuenta.');
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Error inesperado al registrar usuario');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem('transportUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
