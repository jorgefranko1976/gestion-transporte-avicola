
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export const LoginTab = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, isLoading } = useAuth();

  // Evitar que los estados se queden atascados
  useEffect(() => {
    return () => {
      setIsLoggingIn(false);
    };
  }, []);

  // Establecer un límite de tiempo para el estado de login
  useEffect(() => {
    if (isLoggingIn) {
      const loginTimeout = setTimeout(() => {
        setIsLoggingIn(false);
        setLoginError('La operación ha tardado demasiado. Por favor, inténtelo de nuevo.');
        toast.error('Tiempo de espera agotado al iniciar sesión');
      }, 8000); // 8 segundos máximo para login
      
      return () => clearTimeout(loginTimeout);
    }
  }, [isLoggingIn]);

  // Validar formulario de inicio de sesión
  const validateLoginForm = () => {
    if (!email.trim()) {
      setLoginError('Por favor, ingrese su correo electrónico');
      return false;
    }
    
    if (!password) {
      setLoginError('Por favor, ingrese su contraseña');
      return false;
    }
    
    return true;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoggingIn) return; // Prevenir múltiples envíos
    
    setLoginError('');
    
    if (!validateLoginForm()) {
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log("Iniciando sesión con:", email);
      const success = await login(email.trim(), password);
      
      if (!success) {
        setLoginError('Credenciales inválidas. Inténtelo de nuevo.');
        setIsLoggingIn(false);
      } else {
        toast.success('Inicio de sesión exitoso');
        // El AuthContext manejará la redirección
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setLoginError('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
      toast.error('Error inesperado al iniciar sesión');
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="space-y-4">
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          placeholder="Ingrese su correo electrónico"
          autoComplete="email"
          disabled={isLoggingIn}
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
          className="w-full"
          placeholder="Ingrese su contraseña"
          autoComplete="current-password"
          disabled={isLoggingIn}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoggingIn}
          />
          <label 
            htmlFor="remember" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
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
        disabled={isLoggingIn}
        className="w-full"
      >
        {isLoggingIn ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Iniciando sesión...</span>
          </div>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
};

export default LoginTab;
