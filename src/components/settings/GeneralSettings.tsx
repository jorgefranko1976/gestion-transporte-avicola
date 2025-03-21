
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DispatchDateRangeReport from "../reports/general/DispatchDateRangeReport";

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Configuración General</h2>
          <p className="text-muted-foreground">
            Ajustes generales del sistema e informes
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="informes">Informes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Módulo en Desarrollo</h3>
            <p className="text-muted-foreground max-w-md">
              Esta sección estará disponible próximamente. Aquí podrás configurar parámetros generales
              del sistema como notificaciones, unidades de medida y más.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="informes" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Informes Disponibles</h3>
              
              <div className="space-y-6">
                <DispatchDateRangeReport />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneralSettings;
