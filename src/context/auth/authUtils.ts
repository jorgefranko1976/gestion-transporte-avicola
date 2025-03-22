
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AuthUser } from './types';
import { Session } from '@supabase/supabase-js';

export const fetchUserProfile = async (session: Session): Promise<AuthUser | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    if (profile) {
      console.log("Profile fetched:", profile);
      return {
        id: session.user.id,
        name: `${profile.first_name} ${profile.last_name}`,
        role: profile.role,
        email: session.user.email,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error processing session:', error);
    return null;
  }
};

export const loginUser = async (email: string, password: string) => {
  console.log("Attempting login for:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Login error:', error.message);
      toast.error(error.message);
      return { success: false, data: null, error: error.message };
    }

    console.log("Login response:", data);
    
    if (data.user) {
      console.log("Login successful for:", data.user.id);
      return { success: true, data, error: null };
    }
    
    return { success: false, data: null, error: 'Unknown error occurred' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, data: null, error: 'An unexpected error occurred' };
  }
};

export const signupUser = async (
  email: string, 
  password: string,
  userData: {
    first_name: string;
    last_name: string;
    role: string;
    identification_type: string;
    identification_number: string;
    phone?: string;
  }
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    if (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }

    toast.success('Registro exitoso. Por favor inicia sesión.');
    return { success: true, data };
  } catch (error) {
    console.error('Error de registro:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Failed to log out' };
  }
};
