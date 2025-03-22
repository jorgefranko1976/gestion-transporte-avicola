
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateFilterType } from '../types/inspection-types';

interface InspectionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: DateFilterType;
  setDateFilter: (value: DateFilterType) => void;
}

const InspectionFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  dateFilter, 
  setDateFilter 
}: InspectionFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por vehículo o conductor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-[240px]"
          />
        </div>
        
        <Select 
          value={dateFilter} 
          onValueChange={(value: DateFilterType) => setDateFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fechas</SelectItem>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default InspectionFilters;
