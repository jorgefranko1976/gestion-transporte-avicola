
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
  const [initializationComplete, setInitializationComplete] = useState(false);

  // Función para obtener el perfil del usuario desde Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error al obtener perfil de usuario:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Excepción al obtener perfil de usuario:', error);
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
        console.warn('No se encontró perfil para el usuario', currentSession.user.id);
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
      console.error('Error al establecer estado de usuario:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Configurando listener de estado de autenticación');
    let isSubscribed = true;
    
    // Configurar el listener de cambio de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Estado de autenticación cambiado', event, currentSession?.user?.id);
        
        if (isSubscribed) {
          setSession(currentSession);
          await updateUserState(currentSession);
          if (!initializationComplete) setInitializationComplete(true);
        }
      }
    );

    // Obtener la sesión actual
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log('Sesión actual obtenida', currentSession?.user?.id);
      
      if (isSubscribed) {
        setSession(currentSession);
        await updateUserState(currentSession);
        setInitializationComplete(true);
      }
    }).catch(error => {
      console.error('Error al obtener sesión:', error);
      if (isSubscribed) {
        setIsLoading(false);
        setInitializationComplete(true);
      }
    });

    return () => {
      console.log('Limpiando listener de estado de autenticación');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log('Intentando iniciar sesión para', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Error de inicio de sesión:', error.message);
        toast.error(error.message);
        setIsLoading(false);
        return false;
      }

      console.log('Inicio de sesión exitoso', data.session?.user?.id);
      return true;
    } catch (error) {
      console.error('Excepción de inicio de sesión:', error);
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
    setIsLoading(true);
    try {
      console.log('Intentando cerrar sesión');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        toast.error('Error al cerrar sesión');
      } else {
        toast.success('Sesión cerrada correctamente');
        console.log('Sesión cerrada correctamente');
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Excepción al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, login, signup, logout }}>
      {initializationComplete ? children : 
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-lg">Inicializando aplicación...</p>
          </div>
        </div>
      }
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
