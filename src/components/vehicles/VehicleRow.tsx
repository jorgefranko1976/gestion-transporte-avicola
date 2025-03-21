
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, FileText, Trash2 } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface VehicleRowProps {
  vehicle: Vehicle;
  onViewDocuments: (vehicle: Vehicle) => void;
}

const VehicleRow = ({ vehicle, onViewDocuments }: VehicleRowProps) => {
  const getVehicleTypeLabel = (type: string): string => {
    switch (type) {
      case "camion":
        return "Camión";
      case "camion liviano":
        return "Camión liviano";
      case "dobletroque":
        return "Dobletroque";
      case "camioneta":
        return "Camioneta";
      case "tracto camion":
        return "Tracto camión";
      default:
        return type;
    }
  };

  return (
    <TableRow key={vehicle.id}>
      <TableCell className="font-medium">{vehicle.plate}</TableCell>
      <TableCell>{getVehicleTypeLabel(vehicle.vehicleType)}</TableCell>
      <TableCell>{`${vehicle.brand} / ${vehicle.model}`}</TableCell>
      <TableCell>{`${vehicle.owner.firstName} ${vehicle.owner.lastName}`}</TableCell>
      <TableCell>
        <Badge variant={vehicle.active ? "default" : "destructive"}>
          {vehicle.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onViewDocuments(vehicle)}
        >
          <FileText className="h-4 w-4" />
          <span>Ver</span>
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default VehicleRow;
