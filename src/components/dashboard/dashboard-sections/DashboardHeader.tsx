
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Filter } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div>
        <h2 className="text-xl font-semibold">Panel de Control</h2>
        <p className="text-sm text-muted-foreground">
          Resumen de operaciones y métricas clave
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Calendar className="w-4 h-4" />
          <span>Hoy</span>
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <RefreshCw className="w-4 h-4" />
          <span>Actualizar</span>
        </Button>
        <Button variant="outline" size="sm" className="h-9 gap-1">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </Button>
      </div>
    </div>
  );
};
