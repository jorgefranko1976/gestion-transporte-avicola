
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Terminal, Info, AlertTriangle } from "lucide-react";

export function PostgresqlSetupGuide() {
  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Guía de instalación de PostgreSQL local</AlertTitle>
        <AlertDescription>
          Siga estos pasos para configurar una base de datos PostgreSQL local para esta aplicación.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Paso 1: Instalar PostgreSQL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Windows:</h3>
            <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
              <li>Descargue el instalador desde <a href="https://www.postgresql.org/download/windows/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">postgresql.org</a></li>
              <li>Ejecute el instalador y siga las instrucciones</li>
              <li>Recuerde la contraseña que establezca para el usuario 'postgres'</li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium">macOS:</h3>
            <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
              <li>Instale con Homebrew: <code className="bg-muted px-2 py-1 rounded">brew install postgresql</code></li>
              <li>Inicie el servicio: <code className="bg-muted px-2 py-1 rounded">brew services start postgresql</code></li>
            </ol>
          </div>

          <div>
            <h3 className="font-medium">Linux:</h3>
            <ol className="list-decimal pl-5 space-y-2 mt-2 text-sm">
              <li>Ubuntu: <code className="bg-muted px-2 py-1 rounded">sudo apt update && sudo apt install postgresql postgresql-contrib</code></li>
              <li>Inicie el servicio: <code className="bg-muted px-2 py-1 rounded">sudo service postgresql start</code></li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Paso 2: Crear la base de datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-5 space-y-3 mt-2 text-sm">
            <li>
              Acceda a la consola de PostgreSQL:
              <div className="bg-muted p-2 rounded mt-1 font-mono text-xs">
                <p>Windows: Busque "SQL Shell (psql)" en el menú inicio</p>
                <p>macOS/Linux: <code>psql -U postgres</code></p>
              </div>
            </li>
            <li>
              Cree una nueva base de datos:
              <div className="bg-muted p-2 rounded mt-1 font-mono text-xs">
                <code>CREATE DATABASE transportapp;</code>
              </div>
            </li>
            <li>
              Cree un usuario para la aplicación:
              <div className="bg-muted p-2 rounded mt-1 font-mono text-xs">
                <code>CREATE USER transport_user WITH ENCRYPTED PASSWORD 'suContraseñaSegura';</code>
              </div>
            </li>
            <li>
              Otorgue permisos al usuario:
              <div className="bg-muted p-2 rounded mt-1 font-mono text-xs">
                <code>GRANT ALL PRIVILEGES ON DATABASE transportapp TO transport_user;</code>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Paso 3: Estructura de la base de datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">Ejecute este script SQL para crear las tablas necesarias:</p>
          
          <div className="bg-muted p-3 rounded font-mono text-xs overflow-auto max-h-96">
            <pre>{`
-- Conectarse a la base de datos
\\c transportapp

-- Tabla de vehículos
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate VARCHAR(20) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT,
  vehicle_type VARCHAR(50) NOT NULL,
  line VARCHAR(100),
  color VARCHAR(50),
  chassis_number VARCHAR(100),
  engine_number VARCHAR(100),
  soat_expiration TIMESTAMP,
  technical_inspection_expiration TIMESTAMP,
  owner_id UUID,
  status VARCHAR(50),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de conductores
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  identification_type VARCHAR(50) NOT NULL,
  identification_number VARCHAR(50) NOT NULL UNIQUE,
  birth_date TIMESTAMP,
  address TEXT,
  phone VARCHAR(50),
  emergency_contact VARCHAR(100),
  assigned_vehicle_id UUID REFERENCES vehicles(id),
  active BOOLEAN DEFAULT true,
  hire_date TIMESTAMP NOT NULL,
  termination_date TIMESTAMP,
  license_expiration TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Más tablas...
-- (Las demás tablas necesarias para la aplicación)`}</pre>
          </div>

          <Alert variant="warning" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Importante</AlertTitle>
            <AlertDescription>
              Este es un esquema básico. Deberá adaptarlo según las necesidades específicas de su instalación.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Paso 4: Configurar la conexión en la aplicación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">El cliente de Supabase ha sido configurado para conectarse a http://localhost:54321, que es la dirección predeterminada de Supabase CLI.</p>
          
          <p className="text-sm">Si prefiere conectarse directamente a PostgreSQL sin usar Supabase CLI, deberá modificar el archivo src/integrations/supabase/client.ts con los datos de su conexión local.</p>
          
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Recomendación</AlertTitle>
            <AlertDescription>
              Para desarrollo local, considere usar Supabase CLI que proporciona una experiencia similar a la nube de Supabase pero en su entorno local.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
