
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

  // Función para actualizar el estado del usuario basado en la sesión
  const updateUserState = async (currentSession: Session | null) => {
    if (!currentSession?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const profile = await fetchUserProfile(currentSession.user.id);
      
      if (!profile) {
        console.warn('No se encontró perfil para el usuario', currentSession.user.id);
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      setUser({
        id: currentSession.user.id,
        email: currentSession.user.email,
        name: `${profile.first_name} ${profile.last_name}`,
        role: (profile.role || 'driver') as User['role'],
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          identification_type: profile.identification_type,
          identification_number: profile.identification_number
        }
      });
    } catch (error) {
      console.error('Error al establecer estado de usuario:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Configurando listener de estado de autenticación');
    let mounted = true;
    
    // Inicializar con temporizador de seguridad
    const safetyTimer = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('Temporizador de seguridad activado: forzando finalización de carga');
        setIsLoading(false);
        setInitializationComplete(true);
      }
    }, 3000);
    
    // Configurar el listener de cambio de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Estado de autenticación cambiado', event, currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          // Manejar actualización de usuario de manera sincrónica primero
          if (!currentSession?.user) {
            setUser(null);
            setIsLoading(false);
            setInitializationComplete(true);
          } else {
            // Y luego async para los datos del perfil
            setTimeout(async () => {
              if (mounted) {
                await updateUserState(currentSession);
                setInitializationComplete(true);
              }
            }, 0);
          }
        }
      }
    );

    // Obtener la sesión actual de manera simplificada
    supabase.auth.getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log('Sesión actual obtenida', currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          if (!currentSession) {
            // No hay sesión actual, terminamos la carga
            setUser(null);
            setIsLoading(false);
            setInitializationComplete(true);
          } else {
            // Hay sesión, cargar datos de usuario
            updateUserState(currentSession)
              .finally(() => {
                if (mounted) {
                  setInitializationComplete(true);
                }
              });
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

    return () => {
      console.log('Limpiando listener de estado de autenticación');
      mounted = false;
      clearTimeout(safetyTimer);
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
