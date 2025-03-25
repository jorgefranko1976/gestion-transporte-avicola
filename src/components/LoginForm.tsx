import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageTransition from './transitions/PageTransition';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { login, signup, isLoading } = useAuth();

  // Evitar que los estados se queden atascados
  useEffect(() => {
    return () => {
      setIsLoggingIn(false);
      setIsRegistering(false);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoggingIn || isLoading) return; // Prevenir múltiples envíos
    
    setLoginError('');
    setIsLoggingIn(true);
    
    try {
      if (!email.trim()) {
        setLoginError('Por favor, ingrese su correo electrónico');
        setIsLoggingIn(false);
        return;
      }
      
      if (!password) {
        setLoginError('Por favor, ingrese su contraseña');
        setIsLoggingIn(false);
        return;
      }
      
      console.log("Iniciando sesión con:", email);
      const success = await login(email.trim(), password);
      
      if (!success) {
        setLoginError('Credenciales inválidas. Inténtelo de nuevo.');
      } else {
        toast.success('Inicio de sesión exitoso');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      setLoginError('Error al iniciar sesión. Inténtelo de nuevo más tarde.');
      toast.error('Error inesperado al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering || isLoading) return; // Prevenir múltiples envíos
    
    setRegisterError('');
    setIsRegistering(true);
    
    try {
      // Validación de campos
      if (!registerEmail.trim()) {
        setRegisterError('Por favor, ingrese un correo electrónico');
        setIsRegistering(false);
        return;
      }
      
      if (!registerPassword) {
        setRegisterError('Por favor, ingrese una contraseña');
        setIsRegistering(false);
        return;
      }
      
      if (!confirmPassword) {
        setRegisterError('Por favor, confirme su contraseña');
        setIsRegistering(false);
        return;
      }
      
      if (!firstName.trim()) {
        setRegisterError('Por favor, ingrese su nombre');
        setIsRegistering(false);
        return;
      }
      
      if (!lastName.trim()) {
        setRegisterError('Por favor, ingrese su apellido');
        setIsRegistering(false);
        return;
      }
      
      if (registerPassword !== confirmPassword) {
        setRegisterError('Las contraseñas no coinciden');
        setIsRegistering(false);
        return;
      }
      
      if (registerPassword.length < 6) {
        setRegisterError('La contraseña debe tener al menos 6 caracteres');
        setIsRegistering(false);
        return;
      }
      
      console.log("Registrando usuario:", registerEmail);
      const success = await signup(
        registerEmail.trim(), 
        registerPassword, 
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          role: 'driver' // Por defecto, todos los nuevos usuarios son conductores
        }
      );
      
      if (success) {
        // Cambiar a la pestaña de login después de un registro exitoso
        setActiveTab('login');
        setEmail(registerEmail);
        setPassword('');
        toast.success('Registro exitoso. Ahora puede iniciar sesión.');
        
        // Limpiar los campos de registro
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        setFirstName('');
        setLastName('');
      } else {
        toast.error('No se pudo completar el registro. Inténtelo nuevamente.');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      setRegisterError('Error al registrar usuario. Inténtelo de nuevo más tarde.');
      toast.error('Error inesperado durante el registro');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <PageTransition>
      <div className={cn('max-w-md w-full mx-auto', className)}>
        <div className="glass-morphism rounded-2xl p-8 shadow-subtle">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-muted-foreground mt-2">
              Accede al sistema de transporte avícola
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                    disabled={isLoggingIn || isLoading}
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
                    disabled={isLoggingIn || isLoading}
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
                  disabled={isLoggingIn || isLoading}
                  className="w-full"
                >
                  {isLoggingIn || isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {registerError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{registerError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      Nombre
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                      placeholder="Nombre"
                      disabled={isRegistering || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Apellido
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full"
                      placeholder="Apellido"
                      disabled={isRegistering || isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="registerEmail" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input
                    id="registerEmail"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full"
                    placeholder="Ingrese su correo electrónico"
                    autoComplete="email"
                    disabled={isRegistering || isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="registerPassword" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    autoComplete="new-password"
                    disabled={isRegistering || isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar Contraseña
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    placeholder="Confirmar contraseña"
                    autoComplete="new-password"
                    disabled={isRegistering || isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isRegistering || isLoading}
                  className="w-full"
                >
                  {isRegistering || isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando...</span>
                    </div>
                  ) : (
                    "Registrarse"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginForm;
