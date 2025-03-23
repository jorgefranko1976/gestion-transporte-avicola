
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya ha iniciado sesión y la carga ha terminado, redirigir según el rol
    if (user && !isLoading) {
      console.log('Usuario autenticado, redirigiendo según rol:', user.role);
      
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
    }
  }, [user, isLoading, navigate]);

  // Si está cargando, mostrar un indicador
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="text-lg text-muted-foreground">Cargando...</div>
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
