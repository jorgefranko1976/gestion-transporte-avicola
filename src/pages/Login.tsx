
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Solo redirigir si el usuario está autenticado y no estamos ya en proceso de redirección
    if (user && !isLoading && !isRedirecting) {
      console.log('Usuario autenticado, redirigiendo según rol:', user.role);
      setIsRedirecting(true);
      
      setTimeout(() => {
        switch (user.role) {
          case 'coordinator':
            navigate('/coordinator');
            break;
          case 'admin':
            navigate('/coordinator'); // Los administradores también van al panel de coordinador
            break;
          case 'driver':
            navigate('/driver');
            break;
          case 'owner':
            navigate('/vehicles'); // Suponiendo que los propietarios gestionan vehículos
            break;
          default:
            navigate('/');
        }
      }, 100); // Pequeño retraso para evitar múltiples redirecciones
    }
  }, [user, isLoading, navigate]);

  // Si está cargando o redirigiendo, mostrar un indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="text-lg text-muted-foreground">Cargando...</div>
        </div>
      </div>
    );
  }

  // Si el usuario ya está autenticado y estamos esperando redirigir
  if (user && isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Redirigiendo...</div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar el formulario de inicio de sesión
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <LoginForm className="mt-8" />
        </div>
      </div>
    </div>
  );
};

export default Login;
