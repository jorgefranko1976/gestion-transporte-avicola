
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

export const PostgresqlSetupGuide = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>Requisitos previos</AlertTitle>
        <AlertDescription>
          Para configurar una base de datos PostgreSQL local necesitarás instalar PostgreSQL y algunas herramientas adicionales.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="windows">
        <TabsList>
          <TabsTrigger value="windows">Windows</TabsTrigger>
          <TabsTrigger value="mac">Mac</TabsTrigger>
          <TabsTrigger value="linux">Linux</TabsTrigger>
        </TabsList>

        <TabsContent value="windows" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Instalación en Windows</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Descarga el instalador de PostgreSQL desde la{" "}
              <a
                href="https://www.postgresql.org/download/windows/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                página oficial
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>Ejecuta el instalador y sigue el asistente de instalación</li>
            <li>
              Durante la instalación, establece una contraseña para el usuario
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">postgres</code>
            </li>
            <li>
              Asegúrate de mantener el puerto predeterminado{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">5432</code>
            </li>
            <li>Completa la instalación con las opciones predeterminadas</li>
          </ol>
        </TabsContent>

        <TabsContent value="mac" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Instalación en Mac</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              La forma más sencilla es usar Homebrew. Si no lo tienes instalado, instala primero Homebrew desde{" "}
              <a
                href="https://brew.sh"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                brew.sh
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </li>
            <li>
              Abre Terminal y ejecuta:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                brew install postgresql@14
              </pre>
            </li>
            <li>
              Inicia PostgreSQL con:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                brew services start postgresql@14
              </pre>
            </li>
          </ol>
        </TabsContent>

        <TabsContent value="linux" className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold">Instalación en Linux (Ubuntu/Debian)</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Actualiza los repositorios:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                sudo apt update
              </pre>
            </li>
            <li>
              Instala PostgreSQL:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                sudo apt install postgresql postgresql-contrib
              </pre>
            </li>
            <li>
              Inicia el servicio:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                sudo service postgresql start
              </pre>
            </li>
            <li>
              Configura una contraseña para el usuario postgres:
              <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'tucontraseña';"
              </pre>
            </li>
          </ol>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mt-8">
        <h3 className="text-lg font-semibold">Configurando la conexión local</h3>
        <Alert variant="default" className="bg-amber-50 border-amber-200">
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Una vez que hayas instalado PostgreSQL, necesitarás crear una base de datos y configurar los siguientes valores en el archivo <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">src/integrations/supabase/client.ts</code>:
          </AlertDescription>
        </Alert>

        <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
          {`// Para conexión local
const SUPABASE_URL = "http://localhost:54321";
const SUPABASE_ANON_KEY = "tu_clave_anon_generada";`}
        </pre>

        <p>
          Para usar Supabase localmente y facilitar el desarrollo, puedes instalar la CLI de Supabase siguiendo las instrucciones en la{" "}
          <a
            href="https://supabase.com/docs/guides/cli/getting-started"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            documentación oficial
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default PostgresqlSetupGuide;
