
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserRole = 'admin' | 'coordinator' | 'driver' | 'owner';

type User = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    identification_type?: string;
    identification_number?: string;
  };
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    role?: UserRole;
    identification_type?: string;
    identification_number?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener el perfil del usuario desde Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  // Actualizar el estado del usuario con los datos de la sesión y el perfil
  const updateUserState = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchUserProfile(currentSession.user.id);
      
      if (!profile) {
        console.warn('No profile found for user', currentSession.user.id);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      setUser({
        id: currentSession.user.id,
        email: currentSession.user.email,
        name: `${profile.first_name} ${profile.last_name}`,
        role: (profile.role || 'driver') as UserRole,
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          identification_type: profile.identification_type,
          identification_number: profile.identification_number
        }
      });
    } catch (error) {
      console.error('Error setting user state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    // Configurar el listener de cambio de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed', event, currentSession?.user?.id);
        setSession(currentSession);
        await updateUserState(currentSession);
      }
    );

    // Obtener la sesión actual
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Got current session', currentSession?.user?.id);
      setSession(currentSession);
      await updateUserState(currentSession);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting login for', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      console.log('Login successful', data.session?.user?.id);
      // La actualización del estado del usuario se maneja en el listener
      return true;
    } catch (error) {
      console.error('Login exception:', error);
      toast.error('Error al iniciar sesión');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    userData: {
      first_name: string;
      last_name: string;
      role?: UserRole;
      identification_type?: string;
      identification_number?: string;
      phone?: string;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Attempting signup for', email);
      // Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role || 'driver',
            identification_type: userData.identification_type || 'CC',
            identification_number: userData.identification_number || '',
            phone: userData.phone || ''
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      // Si es exitoso, mostrar mensaje de éxito
      toast.success('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      console.log('Signup successful', data.user?.id);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup exception:', error);
      toast.error('Error al registrar usuario');
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        toast.error('Error al cerrar sesión');
      } else {
        toast.success('Sesión cerrada correctamente');
        console.log('Logout successful');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
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
