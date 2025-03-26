
import React, { createContext, useContext } from 'react';
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

  // Evitamos mostrar el indicador de carga indefinidamente agregando un tiempo máximo
  // Si initializationComplete es false después de 3 segundos, mostramos el contenido de igual manera
  React.useEffect(() => {
    if (!initializationComplete) {
      const timer = setTimeout(() => {
        console.log('Tiempo de espera excedido, mostrando contenido...');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [initializationComplete]);

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
