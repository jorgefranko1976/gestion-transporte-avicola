
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Si ya está cargando, no hacemos nada
    if (isLoading) return;

    // Si hay un usuario autenticado, redirigimos según su rol
    if (user) {
      console.log("User authenticated, redirecting to dashboard for role:", user.role);
      setRedirecting(true);
      
      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/settings');
        } else if (user.role === 'coordinator') {
          navigate('/coordinator');
        } else {
          navigate('/driver');
        }
      }, 500); // Pequeño delay para la transición
    }
  }, [user, isLoading, navigate]);

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 flex justify-center">
            <div className="max-w-md w-full">
              <Skeleton className="h-[400px] w-full rounded-2xl" />
            </div>
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
