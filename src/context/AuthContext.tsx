
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { AuthContextType } from '@/types/auth';

// Crear el contexto con un valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    const maxLoadingTime = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Forzando finalización de carga desde AuthContext');
        setInitializationComplete(true);
      }
    }, 500); // Reducido a 500ms para desarrollo
    
    return () => clearTimeout(maxLoadingTime);
  }, [initializationComplete, setInitializationComplete]);

  // Max 1 second absolute limit for any loading
  useEffect(() => {
    const absoluteMaxTime = setTimeout(() => {
      console.log('Timeout final de seguridad alcanzado, terminando carga');
      setIsLoading(false);
      setInitializationComplete(true);
    }, 1000); // Reducido a 1 segundo para desarrollo
    
    return () => clearTimeout(absoluteMaxTime);
  }, [setIsLoading, setInitializationComplete]);

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
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
