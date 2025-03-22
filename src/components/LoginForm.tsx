
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageTransition from './transitions/PageTransition';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, complete todos los campos');
      return;
    }
    
    try {
      const success = await login(loginEmail, loginPassword);
      
      if (success) {
        toast.success('Inicio de sesión exitoso');
        // La redirección se maneja en el componente Login a través del useEffect
      } else {
        setLoginError('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoginError('Error al iniciar sesión. Por favor, intente de nuevo.');
    }
  };

  return (
    <PageTransition>
      <div className={cn('max-w-md w-full mx-auto', className)}>
        <div className="glass-morphism rounded-2xl p-8 shadow-subtle">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Sistema de Transporte</h2>
            <p className="text-muted-foreground mt-2">
              Acceda al sistema con sus credenciales
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{loginError}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full"
                placeholder="correo@ejemplo.com"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full"
                placeholder="Ingrese su contraseña"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border border-input text-primary focus:ring-primary focus:ring-offset-background"
                />
                <label htmlFor="remember" className="ml-2 text-muted-foreground">
                  Recordarme
                </label>
              </div>
              
              <button
                type="button"
                className="text-primary hover:text-primary/80 focus:outline-none focus-visible:underline transition-colors"
              >
                ¿Olvidó su contraseña?
              </button>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginForm;
