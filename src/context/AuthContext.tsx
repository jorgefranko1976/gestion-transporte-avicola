
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

type UserProfile = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole, 
    identificationType: string, 
    identificationNumber: string,
    phone?: string
  }) => Promise<{success: boolean, error?: string}>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar el listener de cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        
        if (currentSession) {
          await getUserProfile(currentSession.user);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sesión actual al cargar
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        if (currentSession) {
          await getUserProfile(currentSession.user);
        }
      } catch (error) {
        console.error('Error al obtener la sesión:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getUserProfile = async (authUser: User) => {
    try {
      // Obtener el perfil del usuario desde la tabla user_profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Convertir el perfil a nuestro formato
        const userProfile: UserProfile = {
          id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          role: data.role,
          email: data.email || authUser.email
        };
        
        setUser(userProfile);
        console.log('Usuario obtenido:', userProfile);
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        console.error('Error de login:', error.message);
        setIsLoading(false);
        return false;
      }
      
      if (data.user) {
        toast({
          title: "¡Bienvenido!",
          description: `Has iniciado sesión correctamente.`,
          duration: 3000,
        });
        
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error durante el login:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado durante el inicio de sesión.",
        variant: "destructive",
        duration: 3000,
      });
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole, 
    identificationType: string, 
    identificationNumber: string,
    phone?: string
  }): Promise<{success: boolean, error?: string}> => {
    try {
      // Registrar el usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
            identification_type: userData.identificationType,
            identification_number: userData.identificationNumber,
            phone: userData.phone || ''
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('Error al registrar usuario:', error);
        return { 
          success: false, 
          error: error.message 
        };
      }

      // Si el usuario se creó exitosamente
      if (data.user) {
        toast({
          title: "Usuario creado",
          description: "El usuario ha sido creado exitosamente.",
          duration: 3000,
        });
        
        return { success: true };
      }

      return {
        success: false,
        error: "No se pudo crear el usuario por un error desconocido"
      };
    } catch (error: any) {
      console.error('Error en el registro:', error);
      return {
        success: false,
        error: error.message || "Error desconocido durante el registro"
      };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      setUser(null);
      setSession(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente.",
        duration: 3000,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, logout, signUp }}>
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
