
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Driver } from '@/lib/types';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DriverListProps {
  onRegisterClick: () => void;
}

const DriverList = ({ onRegisterClick }: DriverListProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*')
          .order('first_name', { ascending: true });
        
        if (error) throw error;
        
        // Transform data to match Driver type
        const transformedDrivers: Driver[] = data.map(driver => ({
          id: driver.id,
          firstName: driver.first_name,
          lastName: driver.last_name,
          identificationType: driver.identification_type,
          identificationNumber: driver.identification_number,
          birthDate: new Date(driver.birth_date),
          address: driver.address,
          phone: driver.phone,
          emergencyContact: driver.emergency_contact,
          documents: {
            drivingLicense: null,
            identification: null,
            resume: null,
            finesClearance: null,
            references: null,
            arl: null,
            payroll: null,
          },
          assignedVehicle: driver.assigned_vehicle_id,
          observations: [],
          active: driver.active,
          hireDate: new Date(driver.hire_date),
          terminationDate: driver.termination_date ? new Date(driver.termination_date) : null,
          licenseExpiration: driver.license_expiration ? new Date(driver.license_expiration) : null,
        }));
        
        setDrivers(transformedDrivers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setIsLoading(false);
      }
    };
    
    fetchDrivers();
  }, []);
  
  if (isLoading) {
    return <div>Cargando conductores...</div>;
  }
  
  if (drivers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No hay conductores registrados</h3>
        <p className="text-muted-foreground mb-6">
          Registra conductores para comenzar a gestionar su información y documentación.
        </p>
        <Button onClick={onRegisterClick} className="flex mx-auto items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span>Registrar Conductor</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Nombre</th>
              <th className="text-left p-3 font-medium">Identificación</th>
              <th className="text-left p-3 font-medium">Teléfono</th>
              <th className="text-left p-3 font-medium">Contratación</th>
              <th className="text-left p-3 font-medium">Venc. Licencia</th>
              <th className="text-left p-3 font-medium">Estado</th>
              <th className="text-right p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-muted/30">
                <td className="p-3">
                  {driver.firstName} {driver.lastName}
                </td>
                <td className="p-3">
                  {driver.identificationType} {driver.identificationNumber}
                </td>
                <td className="p-3">{driver.phone}</td>
                <td className="p-3">
                  {driver.hireDate.toLocaleDateString()}
                </td>
                <td className="p-3">
                  {driver.licenseExpiration 
                    ? driver.licenseExpiration.toLocaleDateString()
                    : 'No registrado'}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${driver.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {driver.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm">Ver detalles</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DriverList;
