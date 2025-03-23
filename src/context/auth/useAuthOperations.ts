
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/lib/types';
import { toast } from '@/components/ui/use-toast';

export const useAuthOperations = () => {
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

  const logout = async (): Promise<void> => {
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

  return {
    login,
    signUp,
    logout
  };
};
