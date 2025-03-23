
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from './types';
import { getUserProfile } from './useUserProfile';
import { useAuthOperations } from './useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login, signUp, logout: authLogout } = useAuthOperations();

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

  const logout = async () => {
    await authLogout();
    setUser(null);
    setSession(null);
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
