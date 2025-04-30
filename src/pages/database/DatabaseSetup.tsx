
import { PostgresqlSetupGuide } from "@/components/settings/database-setup/PostgresqlSetupGuide";
import { DatabaseConnectionCheck } from "@/components/ui/database-connection-check";

const DatabaseSetup = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Configuración de Base de Datos Local</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <DatabaseConnectionCheck />
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Guía de instalación</h2>
          <PostgresqlSetupGuide />
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetup;
