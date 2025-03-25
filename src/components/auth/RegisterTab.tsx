
import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const RegisterTab = ({ onSuccessfulRegister }: { onSuccessfulRegister: (email: string) => void }) => {
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { signup, isLoading } = useAuth();

  // Evitar que los estados se queden atascados
  useEffect(() => {
    return () => {
      setIsRegistering(false);
    };
  }, []);

  // Validar formulario de registro
  const validateRegisterForm = () => {
    if (!registerEmail.trim()) {
      setRegisterError('Por favor, ingrese un correo electrónico');
      return false;
    }
    
    if (!registerPassword) {
      setRegisterError('Por favor, ingrese una contraseña');
      return false;
    }
    
    if (!confirmPassword) {
      setRegisterError('Por favor, confirme su contraseña');
      return false;
    }
    
    if (!firstName.trim()) {
      setRegisterError('Por favor, ingrese su nombre');
      return false;
    }
    
    if (!lastName.trim()) {
      setRegisterError('Por favor, ingrese su apellido');
      return false;
    }
    
    if (registerPassword !== confirmPassword) {
      setRegisterError('Las contraseñas no coinciden');
      return false;
    }
    
    if (registerPassword.length < 6) {
      setRegisterError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering || isLoading) return; // Prevenir múltiples envíos
    
    setRegisterError('');
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setIsRegistering(true);
    
    try {
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
        onSuccessfulRegister(registerEmail);
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
      
      setIsRegistering(false);
    } catch (error) {
      console.error('Error durante el registro:', error);
      setRegisterError('Error al registrar usuario. Inténtelo de nuevo más tarde.');
      toast.error('Error inesperado durante el registro');
      setIsRegistering(false);
    }
  };

  return (
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
  );
};

export default RegisterTab;
