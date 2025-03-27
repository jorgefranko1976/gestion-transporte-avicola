
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

type UseAuthMethodsProps = {
  setIsLoading: (isLoading: boolean) => void;
};

export function useAuthMethods({ setIsLoading }: UseAuthMethodsProps) {
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
      // Verificar si hay una sesión activa antes de intentar cerrarla
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        console.log('No hay sesión activa para cerrar');
        toast.info('No hay sesión activa');
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        toast.error('Error al cerrar sesión');
      } else {
        toast.success('Sesión cerrada correctamente');
        console.log('Sesión cerrada correctamente');
      }
    } catch (error) {
      console.error('Excepción al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    signup,
    logout
  };
}
