
import { TruckIcon } from 'lucide-react';

export const NoDispatchesFound = () => {
  return (
    <div className="text-center py-8 border rounded-md">
      <TruckIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-muted-foreground mb-1">No se han encontrado despachos en progreso</p>
      <p className="text-sm text-muted-foreground">
        Intenta cambiar los criterios de búsqueda
      </p>
    </div>
  );
};
