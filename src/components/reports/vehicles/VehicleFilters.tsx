
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface VehicleFiltersProps {
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (value: 'all' | 'active' | 'inactive') => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  vehicleTypes: string[];
}

export const VehicleFilters = ({ 
  statusFilter, 
  setStatusFilter, 
  typeFilter, 
  setTypeFilter,
  vehicleTypes
}: VehicleFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Select 
          value={statusFilter} 
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Tipo de Vehículo</label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">Todos los tipos</SelectItem>
            {vehicleTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
