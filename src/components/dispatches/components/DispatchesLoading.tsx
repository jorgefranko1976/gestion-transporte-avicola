
import { Truck } from "lucide-react";

export const DispatchesLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse flex flex-col items-center">
        <Truck className="w-12 h-12 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Cargando despachos...</p>
      </div>
    </div>
  );
};
