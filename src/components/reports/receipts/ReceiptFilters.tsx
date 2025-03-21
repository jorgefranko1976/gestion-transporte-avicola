
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { VehicleData, DriverData } from './types';

interface ReceiptFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  vehiclePlate: string;
  setVehiclePlate: (plate: string) => void;
  driverId: string;
  setDriverId: (id: string) => void;
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
        <label className="text-sm font-medium">Fecha Inicio</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Fecha Fin</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehículo</label>
        <Select value={vehiclePlate} onValueChange={setVehiclePlate}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los vehículos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_vehicles">Todos los vehículos</SelectItem>
            {vehicles.map(v => (
              <SelectItem key={v.plate} value={v.plate || "no_plate"}>{v.plate || "Sin placa"}</SelectItem>
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
            <SelectItem value="all_drivers">Todos los conductores</SelectItem>
            {drivers.map(d => (
              <SelectItem key={d.id} value={d.id || "no_id"}>{d.name || "Sin nombre"}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
