
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dispatch } from "@/lib/types/dispatch-types";
import { DispatchStatusBadge } from "./DispatchStatusBadge";
import { DispatchSourceBadge } from "./DispatchSourceBadge";
import { ExcelDispatchEntry } from "../hooks/useDispatchData";

interface DispatchTableRowProps {
  dispatch: Dispatch | ExcelDispatchEntry;
}

export const DispatchTableRow = ({ dispatch }: DispatchTableRowProps) => {
  return (
    <TableRow key={dispatch.id} className="cursor-pointer hover:bg-muted/50">
      <TableCell>
        <DispatchSourceBadge source={'source' in dispatch ? dispatch.source : 'database'} />
      </TableCell>
      <TableCell className="font-medium">{dispatch.orderId}</TableCell>
      <TableCell>
        {dispatch.createdAt && format(new Date(dispatch.createdAt), 'dd MMM yyyy', { locale: es })}
      </TableCell>
      <TableCell>{dispatch.loadingCompany || 'No especificado'}</TableCell>
      <TableCell>{dispatch.destination}</TableCell>
      <TableCell>{dispatch.farm || 'No especificado'}</TableCell>
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
  );
};
