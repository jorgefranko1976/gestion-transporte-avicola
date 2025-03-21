
import { Button } from "@/components/ui/button";
import { DriverStatusFilter } from "../hooks/useDrivers";

interface DriverStatusFilterProps {
  statusFilter: DriverStatusFilter;
  setStatusFilter: (filter: DriverStatusFilter) => void;
}

export const DriverStatusFilterButtons = ({ 
  statusFilter, 
  setStatusFilter 
}: DriverStatusFilterProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={statusFilter === 'all' ? "default" : "outline"} 
        size="sm"
        onClick={() => setStatusFilter('all')}
      >
        Todos
      </Button>
      <Button 
        variant={statusFilter === 'active' ? "default" : "outline"} 
        size="sm"
        onClick={() => setStatusFilter('active')}
      >
        Activos
      </Button>
      <Button 
        variant={statusFilter === 'inactive' ? "default" : "outline"} 
        size="sm"
        onClick={() => setStatusFilter('inactive')}
      >
        Inactivos
      </Button>
    </div>
  );
};
