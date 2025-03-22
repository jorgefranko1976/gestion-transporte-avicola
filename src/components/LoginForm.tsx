
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import PageTransition from './transitions/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRole } from '@/lib/types';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identificationType, setIdentificationType] = useState('CC');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('driver');
  const [signupError, setSignupError] = useState('');

  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, complete todos los campos');
      return;
    }
    
    const success = await login(loginEmail, loginPassword);
    
    if (success) {
      navigate('/coordinator');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    
    if (!signupEmail || !signupPassword || !firstName || !lastName || !identificationNumber) {
      setSignupError('Por favor, complete todos los campos obligatorios');
      return;
    }
    
    const success = await signup(
      signupEmail, 
      signupPassword, 
      {
        first_name: firstName,
        last_name: lastName,
        role,
        identification_type: identificationType,
        identification_number: identificationNumber,
        phone
      }
    );
    
    if (success) {
      // Redirigir a login o mostrar mensaje de éxito
      setSignupEmail('');
      setSignupPassword('');
      setFirstName('');
      setLastName('');
      setIdentificationNumber('');
      setPhone('');
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
          
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                {signupError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{signupError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
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
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signupEmail" className="text-sm font-medium">
                    Correo Electrónico
                  </label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signupPassword" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full"
                    placeholder="Cree una contraseña"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label htmlFor="idType" className="text-sm font-medium">
                      Tipo de Identificación
                    </label>
                    <select 
                      id="idType"
                      value={identificationType}
                      onChange={(e) => setIdentificationType(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-input"
                    >
                      <option value="CC">CC</option>
                      <option value="CE">CE</option>
                      <option value="NIT">NIT</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="idNumber" className="text-sm font-medium">
                      Número de Identificación
                    </label>
                    <Input
                      id="idNumber"
                      type="text"
                      value={identificationNumber}
                      onChange={(e) => setIdentificationNumber(e.target.value)}
                      className="w-full"
                      placeholder="Número"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Teléfono
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                    placeholder="Teléfono"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Rol
                  </label>
                  <select 
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-md border border-input"
                  >
                    <option value="driver">Conductor</option>
                    <option value="coordinator">Coordinador</option>
                    <option value="owner">Propietario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
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
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginForm;
