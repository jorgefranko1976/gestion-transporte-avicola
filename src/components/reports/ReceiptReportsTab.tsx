
import { useState, useEffect } from 'react';
import { Search, Download, FileCheck, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReceiptReport {
  id: string;
  orderId: string;
  completedAt: Date;
  vehiclePlate: string;
  driverName: string | null;
  destination: string;
  receiptImageUrl: string | null;
}

const ReceiptReportsTab = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [driverId, setDriverId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [receipts, setReceipts] = useState<ReceiptReport[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<{plate: string}[]>([]);
  const [drivers, setDrivers] = useState<{id: string; name: string}[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener vehículos
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('plate')
          .eq('active', true)
          .order('plate');
          
        if (vehiclesError) throw vehiclesError;
        setVehicles(vehiclesData);
        
        // Obtener conductores
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .eq('active', true)
          .order('last_name');
          
        if (driversError) throw driversError;
        
        const formattedDrivers = driversData.map(driver => ({
          id: driver.id,
          name: `${driver.first_name} ${driver.last_name}`
        }));
        
        setDrivers(formattedDrivers);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };
    
    fetchInitialData();
  }, []);

  // Buscar remisiones
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Debes seleccionar un rango de fechas');
      return;
    }
    
    setIsLoading(true);
    try {
      // Construir la consulta
      let query = supabase
        .from('dispatches')
        .select(`
          id, 
          order_id,
          completed_at,
          vehicle_plate,
          driver_id,
          destination,
          receipt_image_url,
          drivers(first_name, last_name)
        `)
        .eq('status', 'completed')
        .gte('completed_at', startDate.toISOString())
        .lte('completed_at', new Date(endDate.setHours(23, 59, 59)).toISOString());
      
      // Aplicar filtros adicionales
      if (vehiclePlate && vehiclePlate !== 'all_vehicles') {
        query = query.eq('vehicle_plate', vehiclePlate);
      }
      
      if (driverId && driverId !== 'all_drivers') {
        query = query.eq('driver_id', driverId);
      }
      
      // Ejecutar la consulta
      const { data, error } = await query.order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      // Formatear los datos
      const formattedReceipts = data.map(receipt => ({
        id: receipt.id,
        orderId: receipt.order_id,
        completedAt: new Date(receipt.completed_at),
        vehiclePlate: receipt.vehicle_plate || 'No asignado',
        driverName: receipt.drivers ? `${receipt.drivers.first_name} ${receipt.drivers.last_name}` : null,
        destination: receipt.destination,
        receiptImageUrl: receipt.receipt_image_url
      }));
      
      setReceipts(formattedReceipts);
      setFilteredReceipts(formattedReceipts);
      
    } catch (error) {
      console.error('Error searching receipts:', error);
      toast.error('Error al buscar remisiones');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = receipts.filter(r => 
        r.orderId.toLowerCase().includes(lowercaseSearch) ||
        r.vehiclePlate.toLowerCase().includes(lowercaseSearch) ||
        r.destination.toLowerCase().includes(lowercaseSearch) ||
        (r.driverName && r.driverName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredReceipts(filtered);
    } else {
      setFilteredReceipts(receipts);
    }
  }, [searchTerm, receipts]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredReceipts.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    // Crear contenido CSV
    const headers = [
      'Orden', 
      'Fecha', 
      'Vehículo', 
      'Conductor', 
      'Destino', 
      'Remisión'
    ].join(',');
    
    const csvRows = filteredReceipts.map(r => [
      r.orderId,
      format(r.completedAt, 'dd/MM/yyyy HH:mm', { locale: es }),
      r.vehiclePlate,
      r.driverName || 'No asignado',
      r.destination,
      r.receiptImageUrl ? 'Sí' : 'No'
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `remisiones_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ver imagen de remisión
  const handleViewReceipt = (imageUrl: string | null) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    } else {
      toast.error('No hay imagen de remisión disponible');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Remisiones</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Vehículo</label>
          <Select value={vehiclePlate} onValueChange={setVehiclePlate}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los vehículos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_vehicles">Todos los vehículos</SelectItem>
              {vehicles.map(v => (
                <SelectItem key={v.plate} value={v.plate}>{v.plate}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Conductor</label>
          <Select value={driverId} onValueChange={setDriverId}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los conductores" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_drivers">Todos los conductores</SelectItem>
              {drivers.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
          onClick={exportToCSV}
          disabled={filteredReceipts.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {receipts.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Orden</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium">Vehículo</th>
                  <th className="px-4 py-3 text-left font-medium">Conductor</th>
                  <th className="px-4 py-3 text-left font-medium">Destino</th>
                  <th className="px-4 py-3 text-left font-medium">Remisión</th>
                  <th className="px-4 py-3 text-right font-medium">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{receipt.orderId}</td>
                    <td className="px-4 py-3">
                      {format(receipt.completedAt, "dd MMM yyyy, HH:mm", { locale: es })}
                    </td>
                    <td className="px-4 py-3">{receipt.vehiclePlate}</td>
                    <td className="px-4 py-3">{receipt.driverName || 'No asignado'}</td>
                    <td className="px-4 py-3">{receipt.destination}</td>
                    <td className="px-4 py-3">
                      {receipt.receiptImageUrl ? (
                        <span className="text-green-600 flex items-center gap-1">
                          <FileCheck className="w-4 h-4" />
                          <span>Disponible</span>
                        </span>
                      ) : (
                        <span className="text-red-600">No disponible</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewReceipt(receipt.receiptImageUrl)}
                        disabled={!receipt.receiptImageUrl}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando remisiones...</p>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <FileCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado remisiones</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
      
      {/* Modal para ver la imagen */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Imagen de Remisión</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-4">
            {selectedImage && (
              <img 
                src={selectedImage} 
                alt="Remisión" 
                className="max-h-[70vh] object-contain rounded-md"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptReportsTab;
