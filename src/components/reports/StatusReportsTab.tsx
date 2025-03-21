
import { useState, useEffect } from 'react';
import { Search, Download, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatusReport {
  id: string;
  orderId: string;
  date: Date;
  vehiclePlate: string | null;
  driverName: string | null;
  destination: string;
  status: string;
  acceptedAt: Date | null;
  completedAt: Date | null;
  daysDelayed: number | null;
}

const StatusReportsTab = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatches, setDispatches] = useState<StatusReport[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<StatusReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar despachos por estado
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
          created_at,
          vehicle_plate,
          driver_id,
          destination,
          status,
          accepted_at,
          completed_at,
          days_delayed,
          drivers(first_name, last_name)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', new Date(endDate.setHours(23, 59, 59)).toISOString());
      
      // Aplicar filtro de estado
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      // Ejecutar la consulta
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Formatear los datos
      const formattedDispatches = data.map(dispatch => ({
        id: dispatch.id,
        orderId: dispatch.order_id,
        date: new Date(dispatch.created_at),
        vehiclePlate: dispatch.vehicle_plate,
        driverName: dispatch.drivers ? `${dispatch.drivers.first_name} ${dispatch.drivers.last_name}` : null,
        destination: dispatch.destination,
        status: dispatch.status,
        acceptedAt: dispatch.accepted_at ? new Date(dispatch.accepted_at) : null,
        completedAt: dispatch.completed_at ? new Date(dispatch.completed_at) : null,
        daysDelayed: dispatch.days_delayed
      }));
      
      setDispatches(formattedDispatches);
      setFilteredDispatches(formattedDispatches);
      
    } catch (error) {
      console.error('Error searching dispatches by status:', error);
      toast.error('Error al buscar despachos');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = dispatches.filter(d => 
        d.orderId.toLowerCase().includes(lowercaseSearch) ||
        (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(lowercaseSearch)) ||
        d.destination.toLowerCase().includes(lowercaseSearch) ||
        (d.driverName && d.driverName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredDispatches(filtered);
    } else {
      setFilteredDispatches(dispatches);
    }
  }, [searchTerm, dispatches]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredDispatches.length === 0) {
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
      'Estado',
      'Fecha aceptación',
      'Fecha finalización',
      'Días de demora'
    ].join(',');
    
    const csvRows = filteredDispatches.map(d => [
      d.orderId,
      format(d.date, 'dd/MM/yyyy', { locale: es }),
      d.vehiclePlate || 'No asignado',
      d.driverName || 'No asignado',
      d.destination,
      d.status === 'completed' ? 'Completado' : 
      d.status === 'in_progress' ? 'En Progreso' : 
      d.status === 'delayed' ? 'Demorado' : 
      d.status === 'cancelled' ? 'Cancelado' : 
      d.status === 'accepted' ? 'Aceptado' : 
      d.status === 'pending' ? 'Pendiente' : d.status,
      d.acceptedAt ? format(d.acceptedAt, 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A',
      d.completedAt ? format(d.completedAt, 'dd/MM/yyyy HH:mm', { locale: es }) : 'N/A',
      d.daysDelayed || 0
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `estado_despachos_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Estado de Despachos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Desde</label>
          <DatePicker date={startDate} setDate={setStartDate} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Hasta</label>
          <DatePicker date={endDate} setDate={setEndDate} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="in_progress">En Ruta</SelectItem>
              <SelectItem value="delayed">Demorados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="accepted">Aceptados</SelectItem>
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
      
      {/* Tabla de resultados */}
      {dispatches.length > 0 ? (
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
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Días de demora</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{dispatch.orderId}</td>
                    <td className="px-4 py-3">
                      {format(dispatch.date, "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-4 py-3">{dispatch.vehiclePlate || 'No asignado'}</td>
                    <td className="px-4 py-3">{dispatch.driverName || 'No asignado'}</td>
                    <td className="px-4 py-3">{dispatch.destination}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dispatch.status === 'completed' 
                          ? "bg-green-100 text-green-800" 
                          : dispatch.status === 'in_progress'
                          ? "bg-blue-100 text-blue-800"
                          : dispatch.status === 'delayed'
                          ? "bg-yellow-100 text-yellow-800"
                          : dispatch.status === 'cancelled'
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {dispatch.status === 'completed' ? 'Completado' : 
                         dispatch.status === 'in_progress' ? 'En Progreso' : 
                         dispatch.status === 'delayed' ? 'Demorado' : 
                         dispatch.status === 'cancelled' ? 'Cancelado' : 
                         dispatch.status === 'accepted' ? 'Aceptado' : 
                         dispatch.status === 'pending' ? 'Pendiente' : 
                         dispatch.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {dispatch.daysDelayed ? (
                        <span className="text-yellow-600 font-medium">{dispatch.daysDelayed} días</span>
                      ) : (
                        <span className="text-muted-foreground">0 días</span>
                      )}
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
          <Truck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado despachos</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar el rango de fechas o el estado
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusReportsTab;
