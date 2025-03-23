
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Mostrar un mensaje de carga solo si está cargando y no estamos en proceso de redirección
  if (isLoading && !isRedirecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            <Skeleton className="h-10 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  // Si el usuario ya está autenticado, redirigirlo según su rol
  if (user && !isRedirecting) {
    setIsRedirecting(true);
    
    console.log('Usuario autenticado, redirigiendo a:', user.role);
    
    setTimeout(() => {
      switch (user.role) {
        case 'coordinator':
        case 'admin':
          navigate('/coordinator');
          break;
        case 'driver':
          navigate('/driver');
          break;
        case 'owner':
          navigate('/vehicles');
          break;
        default:
          navigate('/');
      }
    }, 300);
    
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-lg text-muted-foreground animate-pulse">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Si está en proceso de redirección, mostrar un indicador
  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <p className="text-lg text-muted-foreground animate-pulse">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar el formulario de inicio de sesión
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="container px-4 max-w-md">
          <LoginForm className="mt-8" />
        </div>
      </div>
    </div>
  );
};

export default Login;
