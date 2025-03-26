
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  // Manejo de redirección después de iniciar sesión
  useEffect(() => {
    // Solo redirigir si hay un usuario autenticado
    if (user && !redirecting) {
      console.log('Usuario autenticado, redirigiendo al dashboard', user.role);
      setRedirecting(true);
      
      const redirectTimer = setTimeout(() => {
        try {
          if (user.role === 'coordinator' || user.role === 'admin') {
            navigate('/coordinator');
          } else if (user.role === 'driver') {
            navigate('/driver');
          } else if (user.role === 'owner') {
            navigate('/owner');
          } else {
            navigate('/driver'); // Opción predeterminada
          }
        } catch (error) {
          console.error('Error durante la redirección:', error);
          setRedirecting(false);
        }
      }, 500);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [user, navigate, redirecting]);

  // Si estamos redirigiendo después de un inicio de sesión exitoso
  if (redirecting) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si está cargando la autenticación pero no estamos redirigiendo
  if (isLoading && !redirecting) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Verificando credenciales...</p>
          </div>
        </div>
      </div>
    );
  }

  // Siempre mostramos el formulario de inicio de sesión si no estamos redirigiendo ni cargando
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
