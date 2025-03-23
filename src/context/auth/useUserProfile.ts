
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const getUserProfile = async (authUser: User): Promise<UserProfile | null> => {
  try {
    console.log('Obteniendo perfil para usuario:', authUser.id);
    
    // Obtener el perfil del usuario desde la tabla user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error al consultar el perfil:', error);
      return null;
    }

    if (data) {
      // Convertir el perfil a nuestro formato
      const userProfile: UserProfile = {
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        role: data.role as UserRole,
        email: data.email || authUser.email
      };
      
      console.log('Usuario obtenido:', userProfile);
      return userProfile;
    } else {
      console.log('No se encontró perfil para el usuario:', authUser.id);
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    return null;
  }
};
