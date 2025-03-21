
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { VehicleReport } from './types';

interface VehicleTableProps {
  vehicles: VehicleReport[];
}

export const VehicleTable = ({ vehicles }: VehicleTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Placa</th>
              <th className="px-4 py-3 text-left font-medium">Tipo</th>
              <th className="px-4 py-3 text-left font-medium">Marca</th>
              <th className="px-4 py-3 text-left font-medium">Modelo</th>
              <th className="px-4 py-3 text-left font-medium">Propietario</th>
              <th className="px-4 py-3 text-left font-medium">Venc. SOAT</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{vehicle.plate}</td>
                <td className="px-4 py-3">{vehicle.type}</td>
                <td className="px-4 py-3">{vehicle.brand}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">{vehicle.ownerName || 'No especificado'}</td>
                <td className="px-4 py-3">
                  {vehicle.soatExpiration 
                    ? format(vehicle.soatExpiration, "dd MMM yyyy", { locale: es })
                    : 'No registrado'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {vehicle.active ? 'Activo' : 'Inactivo'}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.status === 'available' 
                        ? "bg-green-100 text-green-800" 
                        : vehicle.status === 'in_route'
                        ? "bg-blue-100 text-blue-800"
                        : vehicle.status === 'suspended'
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {vehicle.status === 'available' ? 'Disponible' : 
                      vehicle.status === 'in_route' ? 'En Ruta' : 
                      vehicle.status === 'suspended' ? 'Suspendido' : 
                      vehicle.status === 'maintenance' ? 'Mantenimiento' : 
                      vehicle.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
