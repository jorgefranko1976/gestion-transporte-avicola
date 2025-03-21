
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Farm } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Tree, Droplet, User, Package, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FarmListProps {
  farms: Farm[];
}

// Componente para mostrar la fuente de agua con un ícono
const WaterSourceBadge = ({ source }: { source: string }) => {
  return (
    <div className="flex items-center">
      <Droplet className="h-4 w-4 mr-1 text-blue-500" />
      <span className="capitalize">{source}</span>
    </div>
  );
};

const FarmList = ({ farms }: FarmListProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Identificador</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Departamento/Zona</TableHead>
            <TableHead>Fuente de Agua</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {farms.length > 0 ? (
            farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">{farm.internalId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Tree className="h-4 w-4 mr-2 text-green-500" />
                    {farm.name}
                  </div>
                </TableCell>
                <TableCell>{farm.department} / {farm.zone}</TableCell>
                <TableCell>
                  <WaterSourceBadge source={farm.waterSource} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{farm.contactPerson}</span>
                    </div>
                    <span className="text-xs text-gray-500">{farm.contactPhone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{farm.chickenCapacity.toLocaleString()} pollos</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1 text-gray-500" />
                      <span>{farm.shedsCount} galpones</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={farm.active ? "success" : "destructive"}>
                    {farm.active ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No se encontraron granjas que coincidan con la búsqueda
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FarmList;
