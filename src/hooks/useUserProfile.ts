
import { supabase } from '@/integrations/supabase/client';

// Función para obtener el perfil del usuario desde Supabase
export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al obtener perfil de usuario:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Excepción al obtener perfil de usuario:', error);
    return null;
  }
}
