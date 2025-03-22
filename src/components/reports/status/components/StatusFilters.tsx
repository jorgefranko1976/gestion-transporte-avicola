
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusFilterType } from '../types';

interface StatusFiltersProps {
  statusFilter: StatusFilterType;
  setStatusFilter: (value: StatusFilterType) => void;
}

export const StatusFilters = ({ statusFilter, setStatusFilter }: StatusFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Select value={statusFilter} onValueChange={(value: StatusFilterType) => setStatusFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos (activos)</SelectItem>
            <SelectItem value="in_progress">En Ruta</SelectItem>
            <SelectItem value="delayed">Demorados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
