
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export function DatabaseConnectionCheck() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const checkConnection = async () => {
    setStatus('checking');
    setErrorMessage(null);
    
    try {
      // Intentar una consulta simple para verificar la conexión
      const { data, error } = await supabase
        .from('vehicles')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      
      setStatus('connected');
      console.log('Conexión a base de datos exitosa', data);
    } catch (error: any) {
      console.error('Error conectando a la base de datos:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Error desconocido al conectar a la base de datos');
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Estado de conexión a la base de datos</CardTitle>
        <CardDescription>
          Verificando conexión con PostgreSQL local
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          {status === 'checking' && (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
              <p>Verificando conexión...</p>
            </>
          )}
          
          {status === 'connected' && (
            <>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <p className="text-green-600">Conexión establecida exitosamente</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-red-600">Error de conexión</p>
                {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={checkConnection}
          disabled={status === 'checking'}
        >
          {status === 'checking' ? 'Verificando...' : 'Verificar conexión'}
        </Button>
      </CardFooter>
    </Card>
  );
}
