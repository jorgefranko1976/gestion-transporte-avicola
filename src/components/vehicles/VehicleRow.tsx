
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table"
import { Vehicle } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { getFullName } from '@/lib/utils';

interface VehicleRowProps {
  vehicle: Vehicle;
  onViewDocuments: (vehicle: Vehicle) => void;
  vehicleCount?: number;
}

const TypeBadge: React.FC<{ type: Vehicle['vehicleType'] }> = ({ type }) => {
  let color = "bg-blue-100 text-blue-800 hover:bg-blue-200";

  if (type === 'camion liviano') {
    color = "bg-green-100 text-green-800 hover:bg-green-200";
  } else if (type === 'dobletroque') {
    color = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  } else if (type === 'camioneta') {
    color = "bg-red-100 text-red-800 hover:bg-red-200";
  } else if (type === 'tracto camion') {
    color = "bg-purple-100 text-purple-800 hover:bg-purple-200";
  }

  return (
    <Badge className={color}>
      {type}
    </Badge>
  );
};

export const VehicleRow: React.FC<VehicleRowProps> = ({ vehicle, onViewDocuments, vehicleCount }) => {
  const hasValidDocuments =
    vehicle.documents.soatExpiration !== null && vehicle.documents.technicalInspectionExpiration !== null && vehicle.documents.rcPolicyExpiration !== null &&
    vehicle.documents.soatExpiration > new Date() && vehicle.documents.technicalInspectionExpiration > new Date() && vehicle.documents.rcPolicyExpiration > new Date();

  // Modified to handle optional firstName/lastName
  const getOwnerName = (owner: any) => {
    if (owner.name) return owner.name;
    if (owner.firstName && owner.lastName) return `${owner.firstName} ${owner.lastName}`;
    if (owner.first_name && owner.last_name) return `${owner.first_name} ${owner.last_name}`;
    return 'Sin nombre';
  };

  return (
    <TableRow onClick={() => onViewDocuments(vehicle)} className="cursor-pointer hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span>{vehicle.plate}</span>
          <span className="text-xs text-muted-foreground">{vehicle.brand} {vehicle.line}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span>{getOwnerName(vehicle.owner)}</span>
          <span className="text-xs text-muted-foreground">
            {vehicle.owner.identificationType} {vehicle.owner.identificationNumber}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {hasValidDocuments ? (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
            Vigente
          </Badge>
        ) : (
          <Badge variant="destructive">
            Vencido
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-col">
          <TypeBadge type={vehicle.vehicleType} />
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Modelo: {vehicle.model}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={vehicle.active ? "outline" : "destructive"} className={vehicle.active ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
          {vehicle.active ? "Activo" : "Inactivo"}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default VehicleRow;
