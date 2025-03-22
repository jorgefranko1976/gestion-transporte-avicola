import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Search, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DispatchReport {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string;
  driverName: string | null;
  status: string;
}

const DispatchReportsTab = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatches, setDispatches] = useState<DispatchReport[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<DispatchReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: originsData, error: originsError } = await supabase
          .from('dispatches')
          .select('loading_company')
          .order('loading_company');
          
        if (originsError) throw originsError;
        
        const uniqueOrigins = [...new Set(originsData.map(item => item.loading_company))];
        setOrigins(uniqueOrigins);
        
        const { data: destinationsData, error: destinationsError } = await supabase
          .from('dispatches')
          .select('destination')
          .order('destination');
          
        if (destinationsError) throw destinationsError;
        
        const uniqueDestinations = [...new Set(destinationsData.map(item => item.destination))];
        setDestinations(uniqueDestinations);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };
    
    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Debes seleccionar un rango de fechas');
      return;
    }
    
    setIsLoading(true);
    try {
      let query = supabase
        .from('dispatches')
        .select(`
          id, 
          order_id,
          created_at,
          loading_company,
          destination,
          vehicle_plate,
          driver_id,
          drivers(first_name, last_name),
          status
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', new Date(endDate.setHours(23, 59, 59)).toISOString());
      
      if (origin) {
        query = query.eq('loading_company', origin);
      }
      
      if (destination) {
        query = query.eq('destination', destination);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedDispatches = data.map(item => {
        let driverName = null;
        if (item.drivers && typeof item.drivers === 'object') {
          driverName = `${item.drivers.first_name || ''} ${item.drivers.last_name || ''}`.trim();
        }
        
        return {
          id: item.id,
          orderId: item.order_id,
          date: new Date(item.created_at),
          origin: item.loading_company,
          destination: item.destination,
          vehiclePlate: item.vehicle_plate || 'No asignado',
          driverName: driverName,
          status: item.status
        };
      });
      
      setDispatches(formattedDispatches);
      setFilteredDispatches(formattedDispatches);
      
    } catch (error) {
      console.error('Error searching dispatches:', error);
      toast.error('Error al buscar despachos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = dispatches.filter(d => 
        d.orderId.toLowerCase().includes(lowercaseSearch) ||
        d.origin.toLowerCase().includes(lowercaseSearch) ||
        d.destination.toLowerCase().includes(lowercaseSearch) ||
        d.vehiclePlate.toLowerCase().includes(lowercaseSearch) ||
        (d.driverName && d.driverName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredDispatches(filtered);
    } else {
      setFilteredDispatches(dispatches);
    }
  }, [searchTerm, dispatches]);

  const exportToCSV = () => {
    if (filteredDispatches.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    const headers = [
      'Orden', 
      'Fecha', 
      'Origen', 
      'Destino', 
      'Placa', 
      'Conductor', 
      'Estado'
    ].join(',');
    
    const csvRows = filteredDispatches.map(d => [
      d.orderId,
      format(d.date, 'dd/MM/yyyy HH:mm', { locale: es }),
      d.origin,
      d.destination,
      d.vehiclePlate,
      d.driverName || 'No asignado',
      d.status
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `despachos_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Despachos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <label className="text-sm font-medium">Origen</label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas las empresas</SelectItem>
              {origins.map(o => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Destino</label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los destinos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los destinos</SelectItem>
              {destinations.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
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
          {isLoading ? 'Buscando...' : 'Buscar Despachos'}
        </Button>
        
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar resultados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            disabled={dispatches.length === 0}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={exportToCSV}
          disabled={filteredDispatches.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {dispatches.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Orden</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium">Origen</th>
                  <th className="px-4 py-3 text-left font-medium">Destino</th>
                  <th className="px-4 py-3 text-left font-medium">Placa</th>
                  <th className="px-4 py-3 text-left font-medium">Conductor</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{dispatch.orderId}</td>
                    <td className="px-4 py-3">
                      {format(dispatch.date, "dd MMM yyyy, HH:mm", { locale: es })}
                    </td>
                    <td className="px-4 py-3">{dispatch.origin}</td>
                    <td className="px-4 py-3">{dispatch.destination}</td>
                    <td className="px-4 py-3">{dispatch.vehiclePlate}</td>
                    <td className="px-4 py-3">{dispatch.driverName || 'No asignado'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dispatch.status === 'completed' 
                          ? "bg-green-100 text-green-800" 
                          : dispatch.status === 'pending'
                          ? "bg-yellow-100 text-yellow-800"
                          : dispatch.status === 'cancelled'
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {dispatch.status === 'completed' ? 'Completado' :
                         dispatch.status === 'pending' ? 'Pendiente' :
                         dispatch.status === 'cancelled' ? 'Cancelado' :
                         dispatch.status === 'accepted' ? 'Aceptado' :
                         dispatch.status === 'in_progress' ? 'En Progreso' :
                         dispatch.status === 'delayed' ? 'Demorado' : 
                         dispatch.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando despachos...</p>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado despachos</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default DispatchReportsTab;
