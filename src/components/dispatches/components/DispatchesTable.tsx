
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Dispatch } from "@/lib/types/dispatch-types";
import { ExcelDispatchEntry } from "../hooks/useDispatchData";
import { DispatchTableRow } from "./DispatchTableRow";

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
              <DispatchTableRow key={dispatch.id} dispatch={dispatch} />
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
