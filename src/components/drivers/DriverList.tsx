
import { useDrivers } from './hooks/useDrivers';
import { DriverSearch } from './components/DriverSearch';
import { DriverStatusFilterButtons } from './components/DriverStatusFilter';
import { DriversTable } from './components/DriversTable';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportDriversToCSV } from '@/components/reports/general/utils/exportUtils';
import { toast } from 'sonner';

interface DriverListProps {
  onRegisterClick: () => void;
}

const DriverList = ({ onRegisterClick }: DriverListProps) => {
  const {
    filteredDrivers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    toggleSort
  } = useDrivers();

  const handleExportDrivers = () => {
    const success = exportDriversToCSV(filteredDrivers);
    if (success) {
      toast.success('Conductores exportados exitosamente');
    } else {
      toast.error('No hay conductores para exportar');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Search and filters */}
        <div className="flex gap-2">
          <DriverSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          <DriverStatusFilterButtons 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleExportDrivers} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button onClick={onRegisterClick}>
            Registrar Conductor
          </Button>
        </div>
      </div>
      
      {/* Drivers table */}
      <DriversTable 
        drivers={filteredDrivers}
        isLoading={isLoading}
        sortBy={sortBy}
        toggleSort={toggleSort}
      />
    </div>
  );
};

export default DriverList;
