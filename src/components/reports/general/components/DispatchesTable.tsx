
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
}

interface DispatchesTableProps {
  dispatches: Dispatch[];
}

export const DispatchesTable = ({ dispatches }: DispatchesTableProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Placa</TableHead>
            <TableHead>Conductor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispatches.map((dispatch) => (
            <TableRow key={dispatch.id}>
              <TableCell className="font-medium">{dispatch.orderId}</TableCell>
              <TableCell>
                {format(dispatch.date, "dd MMM yyyy, HH:mm", { locale: es })}
              </TableCell>
              <TableCell>{dispatch.origin}</TableCell>
              <TableCell>{dispatch.destination}</TableCell>
              <TableCell>{dispatch.vehiclePlate || "No asignado"}</TableCell>
              <TableCell>{dispatch.driverName || "No asignado"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
