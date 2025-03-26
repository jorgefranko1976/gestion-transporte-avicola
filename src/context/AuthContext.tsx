
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import LoadingScreen from '@/components/auth/LoadingScreen';
import { AuthContextType } from '@/types/auth';

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
  
  // Crear un objeto con todos los métodos y estado para el contexto
  const authContextValue: AuthContextType = {
    user,
    session,
    isLoading,
    login,
    signup,
    logout
  };

  // Forzar la carga después de un tiempo límite
  useEffect(() => {
    // Si aún estamos cargando después de 5 segundos, forzamos la carga
    const forceLoadTimer = setTimeout(() => {
      if (!initializationComplete) {
        console.log('Forzando carga debido a tiempo límite excedido');
        setInitializationComplete(true);
      }
    }, 5000);
    
    return () => clearTimeout(forceLoadTimer);
  }, [initializationComplete, setInitializationComplete]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {initializationComplete || !isLoading ? children : <LoadingScreen />}
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
