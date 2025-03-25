
import { cn } from '@/lib/utils';
import { useState } from 'react';
import PageTransition from './transitions/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginTab from './auth/LoginTab';
import RegisterTab from './auth/RegisterTab';

interface LoginFormProps {
  className?: string;
}

export const LoginForm = ({ className }: LoginFormProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  
  const handleSuccessfulRegister = (email: string) => {
    setEmail(email);
    setActiveTab('login');
  };

  return (
    <PageTransition>
      <div className={cn('max-w-md w-full mx-auto', className)}>
        <div className="glass-morphism rounded-2xl p-8 shadow-subtle">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Bienvenido</h2>
            <p className="text-muted-foreground mt-2">
              Acceda al sistema de transporte avícola
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'login' | 'register')} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginTab />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterTab onSuccessfulRegister={handleSuccessfulRegister} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginForm;
