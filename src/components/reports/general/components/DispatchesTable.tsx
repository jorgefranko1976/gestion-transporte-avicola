
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
  status: string;
}

interface DispatchesTableProps {
  dispatches: Dispatch[];
}

export const DispatchesTable = ({ dispatches }: DispatchesTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Orden</th>
              <th className="px-4 py-3 text-left font-medium">Fecha</th>
              <th className="px-4 py-3 text-left font-medium">Origen</th>
              <th className="px-4 py-3 text-left font-medium">Destino</th>
              <th className="px-4 py-3 text-left font-medium">Placa</th>
              <th className="px-4 py-3 text-left font-medium">Conductor</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {dispatches.map((dispatch) => (
              <tr key={dispatch.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{dispatch.orderId}</td>
                <td className="px-4 py-3">
                  {format(dispatch.date, "dd MMM yyyy, HH:mm", { locale: es })}
                </td>
                <td className="px-4 py-3">{dispatch.origin}</td>
                <td className="px-4 py-3">{dispatch.destination}</td>
                <td className="px-4 py-3">{dispatch.vehiclePlate}</td>
                <td className="px-4 py-3">{dispatch.driverName || 'No asignado'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dispatch.status === 'completed' 
                      ? "bg-green-100 text-green-800" 
                      : dispatch.status === 'pending'
                      ? "bg-yellow-100 text-yellow-800"
                      : dispatch.status === 'cancelled'
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {dispatch.status === 'completed' ? 'Completado' :
                     dispatch.status === 'pending' ? 'Pendiente' :
                     dispatch.status === 'cancelled' ? 'Cancelado' :
                     dispatch.status === 'accepted' ? 'Aceptado' :
                     dispatch.status === 'in_progress' ? 'En Progreso' :
                     dispatch.status === 'delayed' ? 'Demorado' : 
                     dispatch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
