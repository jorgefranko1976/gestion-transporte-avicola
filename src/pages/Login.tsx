
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Login = () => {
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user, isLoading } = useAuth();

  // Mostrar el formulario después de comprobar que no hay usuario autenticado
  useEffect(() => {
    // Si termina de cargar y no hay usuario, mostrar el formulario
    if (!isLoading && !user) {
      setShowForm(true);
    }
    
    // Si hay un usuario autenticado, redirigir
    if (user && !isRedirecting) {
      setIsRedirecting(true);
      
      const role = user.role;
      console.log('Usuario autenticado, redirigiendo a:', role);
      
      setTimeout(() => {
        switch (role) {
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
    }
  }, [user, isLoading, navigate, isRedirecting]);

  // Mostrar un mensaje de carga
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            {isRedirecting ? (
              <p className="text-lg text-muted-foreground animate-pulse">Redirigiendo...</p>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-12 w-48 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
                <Skeleton className="h-10 w-32 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si no está cargando ni redirigiendo, y showForm es true, mostrar el formulario
  if (showForm) {
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
  }

  // Si no se cumple ninguna condición anterior, mostrar un esqueleto
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
};

export default Login;
