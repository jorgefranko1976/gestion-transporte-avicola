
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    role: UserRole;
    identification_type: string;
    identification_number: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    
    // Configurar el listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Obtener datos del perfil del usuario
            const { data: profile, error } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();

            if (error) {
              console.error('Error al obtener perfil:', error);
              setIsLoading(false);
              return;
            }

            if (profile) {
              console.log("Profile fetched:", profile);
              setUser({
                id: currentSession.user.id,
                name: `${profile.first_name} ${profile.last_name}`,
                role: profile.role as UserRole,
                email: currentSession.user.email,
              });
            }
          } catch (error) {
            console.error('Error al procesar sesión:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sesión existente al cargar
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.id);
      if (currentSession?.user) {
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error('Error al obtener perfil:', error);
              setIsLoading(false);
              return;
            }

            if (profile) {
              console.log("Initial profile fetched:", profile);
              setUser({
                id: currentSession.user.id,
                name: `${profile.first_name} ${profile.last_name}`,
                role: profile.role as UserRole,
                email: currentSession.user.email,
              });
            }
            setSession(currentSession);
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    // Limpieza al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error de login:', error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        console.log("Login successful for:", data.user.id);
        // El perfil se actualizará automáticamente a través del listener de onAuthStateChange
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error de login:', error);
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
      role: UserRole;
      identification_type: string;
      identification_number: string;
      phone?: string;
    }
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        }
      });
      
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      toast.success('Registro exitoso. Por favor inicia sesión.');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error de registro:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
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
