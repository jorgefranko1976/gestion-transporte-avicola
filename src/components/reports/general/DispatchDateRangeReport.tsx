
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NoDispatchesFound } from "./NoDispatchesFound";
import { DateRangeFilters } from "./components/DateRangeFilters";
import { LocationFilters } from "./components/LocationFilters";
import { DispatchesTable } from "./components/DispatchesTable";
import { useDispatchSearch } from "./hooks/useDispatchSearch";
import { exportDispatchesToCSV } from "./utils/exportUtils";

// Define local interface to avoid type conflicts with useDispatchReport
interface LocalDispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
}

const DispatchDateRangeReport = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    origin,
    setOrigin,
    destination,
    setDestination,
    dispatches,
    isLoading,
    origins,
    destinations,
    handleSearch
  } = useDispatchSearch();

  const handleExportToCSV = () => {
    if (dispatches.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    
    // The dispatches from useDispatchSearch don't have status property
    // Convert to the format expected by exportDispatchesToCSV
    const dispatchesWithStatus = dispatches.map(d => ({
      ...d,
      status: 'pending' // Add a default status since it's required
    }));
    
    const success = exportDispatchesToCSV(dispatchesWithStatus);
    if (success) {
      toast.success("Datos exportados correctamente");
    } else {
      toast.error("Error al exportar los datos");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-2">Informe de Despachos por Rango de Fechas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DateRangeFilters
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        
        <LocationFilters
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          origins={origins}
          destinations={destinations}
        />
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={handleSearch} disabled={!startDate || !endDate || isLoading}>
          {isLoading ? "Buscando..." : "Buscar Despachos"}
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportToCSV}
          disabled={dispatches.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Results table */}
      {dispatches.length > 0 ? (
        <DispatchesTable dispatches={dispatches as any} />
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando despachos...</p>
        </div>
      ) : (
        <NoDispatchesFound />
      )}
    </div>
  );
};

export default DispatchDateRangeReport;
