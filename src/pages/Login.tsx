
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
    console.log("Login page - Auth state:", { user, isLoading });
    
    // If still loading auth state, don't do anything
    if (isLoading) return;

    // If there's an authenticated user, redirect based on role
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
      }, 500); // Small delay for transition
    }
  }, [user, isLoading, navigate]);

  // If we're in a loading or redirecting state, show a skeleton
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
        <div className="container mx-auto px-4 flex justify-center">
          <LoginForm className="mt-8" />
        </div>
      </div>
    </div>
  );
};

export default Login;
