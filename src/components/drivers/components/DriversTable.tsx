
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Driver } from '@/lib/types';
import { DriverSortField } from '../hooks/useDrivers';

interface DriversTableProps {
  drivers: Driver[];
  isLoading: boolean;
  sortBy: DriverSortField;
  toggleSort: (field: DriverSortField) => void;
}

export const DriversTable = ({ 
  drivers, 
  isLoading, 
  sortBy, 
  toggleSort 
}: DriversTableProps) => {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th 
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Identificación
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Vehículo Asignado
              </th>
              <th 
                className="px-4 py-3 text-left font-medium cursor-pointer"
                onClick={() => toggleSort('hire_date')}
              >
                <div className="flex items-center gap-1">
                  Fecha Contratación
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Estado
              </th>
              <th className="px-4 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  Cargando conductores...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No se encontraron conductores
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">{driver.firstName} {driver.lastName}</td>
                  <td className="px-4 py-3">{driver.identificationType}: {driver.identificationNumber}</td>
                  <td className="px-4 py-3">{driver.phone}</td>
                  <td className="px-4 py-3">
                    {driver.assignedVehicle ? driver.assignedVehicle : "No asignado"}
                  </td>
                  <td className="px-4 py-3">
                    {format(driver.hireDate, 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      driver.active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {driver.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">Ver</Button>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
