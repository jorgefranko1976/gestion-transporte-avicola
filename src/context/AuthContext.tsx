
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

type User = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('transportUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('transportUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // This is a mock authentication - in a real app, this would be an API call
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication logic
      if (username && password) {
        // For demo purposes only - in a real app, this would verify credentials with a backend
        let role: UserRole = 'driver';
        
        if (username.includes('admin')) {
          role = 'admin';
        } else if (username.includes('coord')) {
          role = 'coordinator';
        } else if (username.includes('owner')) {
          role = 'owner';
        }
        
        const mockUser: User = {
          id: '1',
          name: username,
          role,
          email: `${username}@example.com`,
        };
        
        setUser(mockUser);
        localStorage.setItem('transportUser', JSON.stringify(mockUser));
        
        // Mostrar notificación de bienvenida
        toast({
          title: "¡Bienvenido!",
          description: `Iniciaste sesión como ${role === 'driver' ? 'conductor' : 'coordinador'}.`,
          duration: 3000,
        });
        
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transportUser');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
      duration: 3000,
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
