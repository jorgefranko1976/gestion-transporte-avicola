
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
    }, 1500); // Reducido a 1.5 segundos
    
    // Configurar el listener para cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Estado de autenticación cambiado', event, currentSession?.user?.id);
        
        if (mounted) {
          setSession(currentSession);
          
          // Si hay una sesión, intentamos obtener el perfil
          if (currentSession?.user) {
            // Para evitar bloqueos, ejecutamos de manera asíncrona
            setTimeout(async () => {
              try {
                const profile = await fetchUserProfile(currentSession.user.id);
                
                if (mounted) {
                  if (profile) {
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
                  } else {
                    console.warn('No se encontró perfil para el usuario', currentSession.user.id);
                    // Si no hay perfil, establecemos un usuario con datos básicos
                    setUser({
                      id: currentSession.user.id,
                      email: currentSession.user.email,
                      name: 'Usuario',
                      role: 'driver',
                    });
                  }
                  
                  setIsLoading(false);
                  setInitializationComplete(true);
                }
              } catch (error) {
                console.error('Error al obtener perfil:', error);
                if (mounted) {
                  // En caso de error, configuramos un usuario básico
                  setUser({
                    id: currentSession.user.id,
                    email: currentSession.user.email,
                    name: 'Usuario',
                    role: 'driver',
                  });
                  setIsLoading(false);
                  setInitializationComplete(true);
                }
              }
            }, 0);
          } else {
            // Si no hay sesión, simplemente establecemos user como null
            setUser(null);
            setIsLoading(false);
            setInitializationComplete(true);
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
            // Aquí dejamos que el listener maneje la actualización del usuario
            // para evitar duplicación de código y posibles condiciones de carrera
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
