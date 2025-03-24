
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { UserRole } from '@/lib/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, User, Key, AtSign, UserPlus, LogIn } from 'lucide-react';
import PageTransition from './transitions/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  // Registro
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    const success = await login(username, password);
    
    if (success) {
      // La redirección se maneja en el componente Login.tsx basado en el rol del usuario
      toast.success('Inicio de sesión exitoso');
    } else {
      setError('Credenciales inválidas. Inténtelo de nuevo.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!registerEmail || !registerPassword || !registerConfirmPassword || !firstName || !lastName) {
      setError('Por favor, complete todos los campos');
      return;
    }
    
    if (registerPassword !== registerConfirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (registerPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await signup(
      registerEmail, 
      registerPassword, 
      selectedRole,
      firstName,
      lastName
    );
    
    if (success) {
      // En caso de registro exitoso, vamos a la página de inicio de sesión
      toast.success('Registro exitoso. Por favor revisa tu correo para verificar tu cuenta.');
    }
  };

  return (
    <PageTransition>
      <div className={cn('max-w-md w-full mx-auto', className)}>
        <div className="glass-morphism rounded-2xl p-8 shadow-subtle">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Sistema de Transporte Avícola</h2>
            <p className="text-muted-foreground mt-2">
              Accede al sistema para gestionar operaciones de transporte
            </p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-1.5">
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium flex items-center gap-1.5">
                    <AtSign className="w-4 h-4" />
                    Correo Electrónico
                  </label>
                  <input
                    id="username"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                    placeholder="correo@ejemplo.com"
                    autoComplete="email"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                    placeholder="**********"
                    autoComplete="current-password"
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
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-medium transition-all duration-300 ease-apple hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed btn-hover"
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
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Nombres
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                      placeholder="Nombres"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      Apellidos
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                      placeholder="Apellidos"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="registerEmail" className="text-sm font-medium flex items-center gap-1.5">
                    <AtSign className="w-4 h-4" />
                    Correo Electrónico
                  </label>
                  <input
                    id="registerEmail"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="rol" className="text-sm font-medium">
                    Rol de Usuario
                  </label>
                  <select
                    id="rol"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                  >
                    <option value="admin">Administrador</option>
                    <option value="coordinator">Coordinador</option>
                    <option value="driver">Conductor</option>
                    <option value="owner">Propietario</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="registerPassword" className="text-sm font-medium flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    Contraseña
                  </label>
                  <input
                    id="registerPassword"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1.5">
                    <Key className="w-4 h-4" />
                    Confirmar Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all duration-300 ease-apple"
                    placeholder="Confirmar contraseña"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-medium transition-all duration-300 ease-apple hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed btn-hover"
                >
                  {isLoading ? (
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
          
          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>Sistema de Gestión de Transporte para la Industria Avícola</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginForm;
