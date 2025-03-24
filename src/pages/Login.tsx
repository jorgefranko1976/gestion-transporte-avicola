
import { Navbar } from '@/components/Navbar';
import { LoginForm } from '@/components/LoginForm';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard correspondiente
    if (user && !isLoading) {
      if (user.role === 'coordinator' || user.role === 'admin') {
        navigate('/coordinator');
      } else if (user.role === 'driver') {
        navigate('/driver');
      } else if (user.role === 'owner') {
        navigate('/owner');
      } else {
        navigate('/driver'); // Default fallback
      }
    }
  }, [user, isLoading, navigate]);

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
