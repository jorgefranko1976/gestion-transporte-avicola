
import { useDrivers } from './hooks/useDrivers';
import { DriverSearch } from './components/DriverSearch';
import { DriverStatusFilterButtons } from './components/DriverStatusFilter';
import { DriversTable } from './components/DriversTable';
import { Button } from "@/components/ui/button";

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
        
        {/* Register button */}
        <Button onClick={onRegisterClick} className="ml-auto">
          Registrar Conductor
        </Button>
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
