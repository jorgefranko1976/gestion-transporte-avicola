
import { Package } from "lucide-react";

export const DispatchesEmpty = () => {
  return (
    <div className="text-center py-10 border rounded-md">
      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
      <h3 className="text-lg font-medium">No hay despachos</h3>
      <p className="text-muted-foreground">
        Aún no se han creado despachos en el sistema ni se han cargado datos de Excel
      </p>
    </div>
  );
};
