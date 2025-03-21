
import { useState } from 'react';
import { Download, TruckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { NoVehiclesFound } from './NoVehiclesFound';
import { VehicleTable } from './VehicleTable';
import { VehicleFilters } from './VehicleFilters';
import { useVehicleSearch } from './hooks/useVehicleSearch';
import { exportVehiclesToCSV } from './utils/exportUtils';

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
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar Vehículos'}
        </Button>
        
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar resultados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            disabled={vehicles.length === 0}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={() => exportVehiclesToCSV(filteredVehicles)}
          disabled={filteredVehicles.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {vehicles.length > 0 ? (
        <VehicleTable vehicles={filteredVehicles} />
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando vehículos...</p>
        </div>
      ) : (
        <NoVehiclesFound />
      )}
    </div>
  );
};

export default VehicleReportsTab;
