
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dispatch } from "@/lib/types/dispatch-types";
import { DispatchStatusBadge } from "./DispatchStatusBadge";
import { DispatchSourceBadge } from "./DispatchSourceBadge";
import { ExcelDispatchEntry } from "../hooks/useDispatchData";

interface DispatchesTableProps {
  dispatches: (Dispatch | ExcelDispatchEntry)[];
  searchTerm: string;
}

export const DispatchesTable = ({ dispatches, searchTerm }: DispatchesTableProps) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Origen</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Granja</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Conductor</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatches.length > 0 ? (
            dispatches.map(dispatch => (
              <TableRow key={dispatch.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <DispatchSourceBadge source={'source' in dispatch ? dispatch.source : 'database'} />
                </TableCell>
                <TableCell className="font-medium">{dispatch.orderId}</TableCell>
                <TableCell>
                  {dispatch.createdAt && format(new Date(dispatch.createdAt), 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>{dispatch.loadingCompany}</TableCell>
                <TableCell>{dispatch.destination}</TableCell>
                <TableCell>{dispatch.farm}</TableCell>
                <TableCell>{dispatch.vehiclePlate || 'No asignado'}</TableCell>
                <TableCell>
                  {'driver' in dispatch 
                    ? dispatch.driver || 'No asignado' 
                    : dispatch.driverId || 'No asignado'}
                </TableCell>
                <TableCell>{dispatch.packages || dispatch.concentrateAmount || 0}</TableCell>
                <TableCell>
                  <DispatchStatusBadge status={dispatch.status} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                No se encontraron resultados para "{searchTerm}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
