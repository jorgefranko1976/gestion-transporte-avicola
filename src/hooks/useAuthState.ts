
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
        console.log('Forzando finalización de carga desde useAuthState (250ms timeout)');
        setIsLoading(false);
        setInitializationComplete(true);
      }
    }, 250); // Reducido a 250ms para respuesta más rápida
    
    // Configurar el listener para cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Estado de autenticación cambiado', event, currentSession?.user?.id);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        // Si hay una sesión, intentamos obtener el perfil
        if (currentSession?.user) {
          try {
            // Timeout para la obtención del perfil
            const profilePromise = fetchUserProfile(currentSession.user.id);
            
            // Utilizar Promise.race para establecer un límite de tiempo
            const profile = await Promise.race([
              profilePromise,
              new Promise<null>((resolve) => setTimeout(() => resolve(null), 200))
            ]);
            
            if (!mounted) return;
            
            if (profile) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
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
            } else {
              console.warn('No se encontró perfil o timeout alcanzado para el usuario', currentSession.user.id);
              // Si no hay perfil, establecemos un usuario con datos básicos
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: 'Usuario',
                role: 'driver',
              });
            }
          } catch (error) {
            console.error('Error al obtener perfil:', error);
            if (mounted) {
              // En caso de error, configuramos un usuario básico
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || '',
                name: 'Usuario',
                role: 'driver',
              });
            }
          } finally {
            if (mounted) {
              setIsLoading(false);
              setInitializationComplete(true);
            }
          }
        } else {
          // Si no hay sesión, simplemente establecemos user como null
          setUser(null);
          setIsLoading(false);
          setInitializationComplete(true);
        }
      }
    );

    // Cargar la sesión inicial con un timeout agresivo
    const sessionPromise = supabase.auth.getSession()
      .then(({ data: { session: currentSession } }) => {
        console.log('Sesión actual obtenida', currentSession?.user?.id);
        
        if (!mounted) return;
        
        setSession(currentSession);
        
        if (!currentSession) {
          setUser(null);
          setIsLoading(false);
          setInitializationComplete(true);
        }
        // Si hay sesión, dejamos que el listener maneje la actualización del usuario
      })
      .catch(error => {
        console.error('Error al obtener sesión:', error);
        if (mounted) {
          setIsLoading(false);
          setInitializationComplete(true);
        }
      });
    
    // Establecer un timeout para la obtención de la sesión inicial
    const sessionTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log('Timeout alcanzado al obtener sesión inicial');
        setUser(null);
        setIsLoading(false);
        setInitializationComplete(true);
      }
    }, 150);

    // Limpiar
    return () => {
      console.log('Limpiando listener de estado de autenticación');
      mounted = false;
      clearTimeout(forceTimeout);
      clearTimeout(sessionTimeout);
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
