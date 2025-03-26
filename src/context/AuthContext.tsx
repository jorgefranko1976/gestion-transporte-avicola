
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { AuthContextType } from '@/types/auth';

// Crear el contexto con un valor inicial
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    session,
    isLoading,
    initializationComplete,
    setUser,
    setSession,
    setIsLoading,
    setInitializationComplete
  } = useAuthState();

  const { login, signup, logout } = useAuthMethods({ 
    setIsLoading
  });
  
  // Objeto con todos los métodos y estado para el contexto
  const authContextValue: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout
  };

  // Force loading to end after a specific timeout
  useEffect(() => {
    console.log('Configurando timeouts de seguridad en AuthContext');
    const maxLoadingTime = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Forzando finalización de carga desde AuthContext (300ms timeout)');
        setInitializationComplete(true);
      }
    }, 300); // Reducido a 300ms para respuesta más rápida
    
    // Max 700ms absolute limit for any loading
    const absoluteMaxTime = setTimeout(() => {
      console.log('Timeout final de seguridad alcanzado (700ms), terminando carga');
      setIsLoading(false);
      setInitializationComplete(true);
    }, 700); // Reducido a 700ms para desarrollo
    
    return () => {
      clearTimeout(maxLoadingTime);
      clearTimeout(absoluteMaxTime);
    };
  }, [initializationComplete, setIsLoading, setInitializationComplete]);

  console.log('AuthProvider rendering, initializationComplete:', initializationComplete, 'isLoading:', isLoading);

  return (
    <AuthContext.Provider value={authContextValue}>
      {initializationComplete ? children : <LoadingScreen />}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
