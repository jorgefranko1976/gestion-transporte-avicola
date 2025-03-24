
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si está cargando, no hacemos nada aún
    if (isLoading) return;
    
    // Si ya está logueado, redirigir al dashboard apropiado según el rol
    if (user) {
      switch (user.role) {
        case 'admin':
        case 'coordinator':
          navigate('/coordinator');
          break;
        case 'driver':
          navigate('/driver');
          break;
        case 'owner':
          navigate('/coordinator'); // Por ahora redirigimos a los propietarios al panel de coordinador
          break;
        default:
          navigate('/driver'); // Por defecto, enviamos al panel de conductor
      }
    }
  }, [user, isLoading, navigate]);

  // Si está cargando, mostramos un indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

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
