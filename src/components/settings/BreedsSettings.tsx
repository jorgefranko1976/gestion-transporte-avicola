
import { Button } from "@/components/ui/button";
import { Tags } from "lucide-react";

const BreedsSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Razas de Aves</h2>
          <p className="text-muted-foreground">
            Gestiona las razas disponibles y sus características
          </p>
        </div>
      </div>
      
      <div className="rounded-md border p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-primary/10 p-3 rounded-full">
          <Tags className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium">Módulo en Desarrollo</h3>
        <p className="text-muted-foreground max-w-md">
          Esta sección estará disponible próximamente. Aquí podrás configurar razas adicionales
          y sus características específicas.
        </p>
      </div>
    </div>
  );
};

export default BreedsSettings;
