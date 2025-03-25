
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
    // Si ya está autenticado, redirigir al dashboard correspondiente
    if (user && !isLoading) {
      console.log('User authenticated, redirecting to dashboard', user.role);
      setRedirecting(true);
      
      setTimeout(() => {
        if (user.role === 'coordinator' || user.role === 'admin') {
          navigate('/coordinator');
        } else if (user.role === 'driver') {
          navigate('/driver');
        } else if (user.role === 'owner') {
          navigate('/owner');
        } else {
          navigate('/driver'); // Default fallback
        }
      }, 500); // Pequeño retraso para asegurar que la redirección funcione
    }
  }, [user, isLoading, navigate]);

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg">
              {isLoading ? "Cargando..." : "Redirigiendo..."}
            </p>
          </div>
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
