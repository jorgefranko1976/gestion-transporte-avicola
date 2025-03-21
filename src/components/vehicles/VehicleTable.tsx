
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Vehicle } from "@/lib/types";
import VehicleRow from "./VehicleRow";
import { Badge } from "@/components/ui/badge";

interface VehicleTableProps {
  filteredVehicles: Vehicle[];
  onViewDocuments: (vehicle: Vehicle) => void;
}

const VehicleTable = ({ filteredVehicles, onViewDocuments }: VehicleTableProps) => {
  // Agrupar vehículos por propietario para mostrar contador
  const vehiclesByOwner = filteredVehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.ownerId]) {
      acc[vehicle.ownerId] = 0;
    }
    acc[vehicle.ownerId]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Marca/Modelo</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Documentos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <VehicleRow 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onViewDocuments={onViewDocuments}
                  vehicleCount={vehiclesByOwner[vehicle.ownerId]}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No se encontraron vehículos que coincidan con la búsqueda
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehicleTable;
