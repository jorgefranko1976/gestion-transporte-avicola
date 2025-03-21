
import { Vehicle } from "@/lib/types";
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface VehicleRowProps {
  vehicle: Vehicle;
  onViewDocuments: (vehicle: Vehicle) => void;
  vehicleCount: number; // Añadimos este prop para mostrar el contador de vehículos por propietario
}

const VehicleRow = ({ vehicle, onViewDocuments, vehicleCount }: VehicleRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{vehicle.plate}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {vehicle.vehicleType.replace(/-/g, ' ')}
        </Badge>
      </TableCell>
      <TableCell>{vehicle.brand} / {vehicle.model}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{vehicle.owner.firstName} {vehicle.owner.lastName}</span>
          <Badge variant="outline" className="w-fit mt-1">
            {vehicleCount} vehículo{vehicleCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={vehicle.active ? "success" : "secondary"}>
          {vehicle.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1 text-primary"
          onClick={() => onViewDocuments(vehicle)}
        >
          <FileText className="h-4 w-4" />
          <span>Ver</span>
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar vehículo</DropdownMenuItem>
            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              {vehicle.active ? "Desactivar" : "Activar"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default VehicleRow;
