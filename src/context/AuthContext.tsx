
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

  // Función para obtener el perfil del usuario
  const getUserProfile = async (authUser: User) => {
    try {
      console.log('Obteniendo perfil para usuario:', authUser.id);
      
      // Obtener el perfil del usuario desde la tabla user_profiles
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        console.error('Error al consultar el perfil:', error);
        return null;
      }

      if (data) {
        // Convertir el perfil a nuestro formato
        const userProfile: UserProfile = {
          id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          role: data.role as UserRole,
          email: data.email || authUser.email
        };
        
        console.log('Usuario obtenido:', userProfile);
        return userProfile;
      } else {
        console.log('No se encontró perfil para el usuario:', authUser.id);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
      return null;
    }
  };

  // Inicializar la autenticación
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Inicializando autenticación...');
        
        // Configurar el listener de cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            console.log('Cambio de estado de autenticación:', event);
            setSession(currentSession);
            
            if (currentSession?.user) {
              const profile = await getUserProfile(currentSession.user);
              setUser(profile);
            } else {
              setUser(null);
            }
          }
        );
        
        // Verificar si hay una sesión existente
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        
        if (existingSession?.user) {
          console.log('Sesión existente encontrada');
          const profile = await getUserProfile(existingSession.user);
          setUser(profile);
        } else {
          console.log('No hay sesión existente');
        }
        
        // Terminar la carga
        setIsLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Intentando iniciar sesión con:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error de inicio de sesión:', error.message);
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return false;
      }
      
      if (data.user) {
        console.log('Inicio de sesión exitoso para:', data.user.email);
        toast({
          title: "¡Bienvenido!",
          description: `Has iniciado sesión correctamente.`,
          duration: 3000,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error durante el login:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado durante el inicio de sesión.",
        variant: "destructive",
        duration: 3000,
      });
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
    console.log('Cerrando sesión...');
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error);
        toast({
          title: "Error",
          description: "No se pudo cerrar la sesión correctamente.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        setUser(null);
        setSession(null);
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado al cerrar sesión.",
        variant: "destructive",
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
