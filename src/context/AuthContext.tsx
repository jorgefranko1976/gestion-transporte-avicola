
import React, { createContext, useContext } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthMethods } from '@/hooks/useAuthMethods';
import { fetchUserProfile } from '@/hooks/useUserProfile';
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
    setIsLoading
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

  return (
    <AuthContext.Provider value={authContextValue}>
      {initializationComplete ? children : <LoadingScreen />}
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
