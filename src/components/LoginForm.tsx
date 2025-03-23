
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageTransition from './transitions/PageTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      if (!email || !password) {
        setError('Por favor, complete todos los campos');
        setIsSubmitting(false);
        return;
      }
      
      const success = await login(email, password);
      
      if (!success) {
        setError('Credenciales inválidas. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Ocurrió un error al intentar iniciar sesión. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('w-full mx-auto', className)}>
      <div className={cn(
        'glass-morphism rounded-2xl p-8 shadow-subtle',
        isMobile && 'mx-4'
      )}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <p className="text-muted-foreground mt-2">
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Correo Electrónico
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2"
              placeholder="Ingrese su correo electrónico"
              autoComplete="email"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2"
              placeholder="Ingrese su contraseña"
              autoComplete="current-password"
              disabled={isSubmitting}
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
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium transition-all duration-300 ease-apple hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed btn-hover"
          >
            {isSubmitting ? (
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
  );
};

export default LoginForm;
