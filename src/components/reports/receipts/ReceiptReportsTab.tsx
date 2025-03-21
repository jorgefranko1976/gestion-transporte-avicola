
import { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { ReceiptFilters } from './ReceiptFilters';
import { ReceiptTable } from './ReceiptTable';
import { NoReceiptsFound } from './NoReceiptsFound';
import { ReceiptImageModal } from './ReceiptImageModal';
import { exportToCSV } from './utils/exportUtils';
import { useReceiptSearch } from './hooks/useReceiptSearch';

const ReceiptReportsTab = () => {
  const {
    startDate, setStartDate,
    endDate, setEndDate,
    vehiclePlate, setVehiclePlate,
    driverId, setDriverId,
    searchTerm, setSearchTerm,
    receipts, filteredReceipts,
    isLoading, vehicles, drivers,
    handleSearch
  } = useReceiptSearch();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Ver imagen de remisión
  const handleViewReceipt = (imageUrl: string | null) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    } else {
      toast.error('No hay imagen de remisión disponible');
    }
  };

  // Exportar resultados a CSV
  const handleExportCSV = () => {
    if (filteredReceipts.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    exportToCSV(filteredReceipts, `remisiones_${format(new Date(), 'dd-MM-yyyy')}.csv`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Remisiones</h2>
      
      <ReceiptFilters 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        vehiclePlate={vehiclePlate}
        setVehiclePlate={setVehiclePlate}
        driverId={driverId}
        setDriverId={setDriverId}
        vehicles={vehicles}
        drivers={drivers}
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={!startDate || !endDate || isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar Remisiones'}
        </Button>
        
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar resultados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            disabled={receipts.length === 0}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={handleExportCSV}
          disabled={filteredReceipts.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {receipts.length > 0 ? (
        <ReceiptTable 
          receipts={filteredReceipts} 
          onViewReceipt={handleViewReceipt} 
        />
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando remisiones...</p>
        </div>
      ) : (
        <NoReceiptsFound />
      )}
      
      {/* Modal para ver la imagen */}
      <ReceiptImageModal 
        imageUrl={selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </div>
  );
};

export default ReceiptReportsTab;
