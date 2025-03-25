
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Solo intentar redirección si tenemos un usuario autenticado y no estamos cargando
    if (user && !isLoading) {
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
  }, [user, isLoading, navigate]);

  // Si estamos en estado de carga, mostramos un spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

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

  // Si no hay usuario autenticado, mostrar el formulario de inicio de sesión
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
