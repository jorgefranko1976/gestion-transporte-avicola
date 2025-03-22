
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock } from 'lucide-react';
import { Dispatch } from '../types';
import { StatusBadge } from './StatusBadge';

interface StatusTableProps {
  dispatches: Dispatch[];
}

export const StatusTable = ({ dispatches }: StatusTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Orden</th>
              <th className="px-4 py-3 text-left font-medium">Vehículo</th>
              <th className="px-4 py-3 text-left font-medium">Conductor</th>
              <th className="px-4 py-3 text-left font-medium">Destino</th>
              <th className="px-4 py-3 text-left font-medium">Aceptado</th>
              <th className="px-4 py-3 text-left font-medium">Tiempo</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {dispatches.map((dispatch) => (
              <tr key={dispatch.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{dispatch.orderId}</td>
                <td className="px-4 py-3">{dispatch.vehiclePlate}</td>
                <td className="px-4 py-3">{dispatch.driverName || 'No asignado'}</td>
                <td className="px-4 py-3">{dispatch.destination}</td>
                <td className="px-4 py-3">
                  {dispatch.acceptedAt 
                    ? format(dispatch.acceptedAt, "dd MMM yyyy, HH:mm", { locale: es }) 
                    : 'No aceptado'}
                </td>
                <td className="px-4 py-3">
                  {dispatch.hoursRemaining !== null ? (
                    <div className="flex items-center gap-1">
                      <Clock className={`w-4 h-4 ${dispatch.isDelayed ? 'text-red-500' : 'text-green-500'}`} />
                      <span className={dispatch.isDelayed ? 'text-red-600' : 'text-green-600'}>
                        {dispatch.isDelayed 
                          ? `${Math.abs(dispatch.hoursRemaining)} h demorado` 
                          : `${dispatch.hoursRemaining} h restantes`}
                      </span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={dispatch.status} isDelayed={dispatch.isDelayed} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
