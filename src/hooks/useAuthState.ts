
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { fetchUserProfile } from '@/hooks/useUserProfile';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);

  useEffect(() => {
    console.log('Configurando listener de estado de autenticación');
    let mounted = true;
    
    // Establecer un temporizador que forzará la finalización de carga
    const forceTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Forzando finalización de carga desde useAuthState');
        setIsLoading(false);
        setInitializationComplete(true);
      }
    }, 2000);
    
    // Función para actualizar el estado del usuario con datos de perfil
    const updateUserWithProfile = async (currentSession: Session | null) => {
      if (!currentSession?.user) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
          setInitializationComplete(true);
        }
        return;
      }

      try {
        const profile = await fetchUserProfile(currentSession.user.id);
        
        if (!profile && mounted) {
          console.warn('No se encontró perfil para el usuario', currentSession.user.id);
          setUser(null);
          setIsLoading(false);
          setInitializationComplete(true);
          return;
        }
        
        if (mounted) {
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email,
            name: profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario',
            role: (profile?.role || 'driver') as User['role'],
            profile: profile ? {
              first_name: profile.first_name,
              last_name: profile.last_name,
              phone: profile.phone,
              identification_type: profile.identification_type,
              identification_number: profile.identification_number
            } : undefined
          });
          setIsLoading(false);
          setInitializationComplete(true);
        }
      } catch (error) {
        console.error('Error al establecer estado de usuario:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    };

    // Configurar el listener para cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Estado de autenticación cambiado', event, currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          // Si no hay sesión, simplemente terminamos
          if (!currentSession) {
            setUser(null);
            setIsLoading(false);
            setInitializationComplete(true);
          } else {
            // Para evitar bloqueos, ejecutamos la carga del perfil de manera aislada
            setTimeout(() => {
              updateUserWithProfile(currentSession);
            }, 0);
          }
        }
      }
    );

    // Cargar la sesión inicial
    supabase.auth.getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log('Sesión actual obtenida', currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          if (!currentSession) {
            setUser(null);
            setIsLoading(false);
            setInitializationComplete(true);
          } else {
            // Ejecutamos la carga del perfil de manera aislada
            setTimeout(() => {
              updateUserWithProfile(currentSession);
            }, 0);
          }
        }
      })
      .catch(error => {
        console.error('Error al obtener sesión:', error);
        if (mounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      });

    // Limpiar
    return () => {
      console.log('Limpiando listener de estado de autenticación');
      mounted = false;
      clearTimeout(forceTimeout);
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    isLoading,
    initializationComplete,
    setUser,
    setSession,
    setIsLoading,
    setInitializationComplete
  };
}
