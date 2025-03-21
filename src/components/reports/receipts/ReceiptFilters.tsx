
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VehicleData, DriverData } from './types';

interface ReceiptFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  vehiclePlate: string;
  setVehiclePlate: (value: string) => void;
  driverId: string;
  setDriverId: (value: string) => void;
  vehicles: VehicleData[];
  drivers: DriverData[];
}

export const ReceiptFilters = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  vehiclePlate,
  setVehiclePlate,
  driverId,
  setDriverId,
  vehicles,
  drivers
}: ReceiptFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Desde</label>
        <DatePicker date={startDate} setDate={setStartDate} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Hasta</label>
        <DatePicker date={endDate} setDate={setEndDate} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehículo</label>
        <Select value={vehiclePlate} onValueChange={setVehiclePlate}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los vehículos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los vehículos</SelectItem>
            {vehicles.map(vehicle => (
              <SelectItem key={vehicle.plate} value={vehicle.plate}>{vehicle.plate}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Conductor</label>
        <Select value={driverId} onValueChange={setDriverId}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los conductores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los conductores</SelectItem>
            {drivers.map(driver => (
              <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
