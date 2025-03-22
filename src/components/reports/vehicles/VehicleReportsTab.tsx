
import { NoVehiclesFound } from './NoVehiclesFound';
import { VehicleTable } from './VehicleTable';
import { VehicleFilters } from './VehicleFilters';
import { useVehicleSearch } from './hooks/useVehicleSearch';
import { VehicleSearchExport } from './components/VehicleSearchExport';
import { VehiclesLoading } from './components/VehiclesLoading';

const VehicleReportsTab = () => {
  const {
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchTerm,
    setSearchTerm,
    vehicles,
    filteredVehicles,
    isLoading,
    vehicleTypes,
    handleSearch
  } = useVehicleSearch();

  const renderContent = () => {
    if (vehicles.length > 0) {
      return <VehicleTable vehicles={filteredVehicles} />;
    } 
    
    if (isLoading) {
      return <VehiclesLoading />;
    }
    
    return <NoVehiclesFound />;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Vehículos</h2>
      
      <VehicleFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        vehicleTypes={vehicleTypes}
      />
      
      <VehicleSearchExport
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={isLoading}
        handleSearch={handleSearch}
        vehicles={vehicles}
        filteredVehicles={filteredVehicles}
      />
      
      {renderContent()}
    </div>
  );
};

export default VehicleReportsTab;
