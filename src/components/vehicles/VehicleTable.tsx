
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Vehicle } from "@/lib/types";
import VehicleRow from "./VehicleRow";

interface VehicleTableProps {
  filteredVehicles: Vehicle[];
  onViewDocuments: (vehicle: Vehicle) => void;
}

const VehicleTable = ({ filteredVehicles, onViewDocuments }: VehicleTableProps) => {
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
