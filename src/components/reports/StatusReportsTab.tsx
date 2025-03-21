import { useState, useEffect } from 'react';
import { Search, Download, TruckIcon, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, addHours, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatusReport {
  id: string;
  orderId: string;
  vehiclePlate: string;
  driverName: string | null;
  destination: string;
  acceptedAt: Date | null;
  eta: Date | null;
  status: string;
  hoursRemaining: number | null;
  isDelayed: boolean;
}

const StatusReportsTab = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'delayed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatches, setDispatches] = useState<StatusReport[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<StatusReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar despachos
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construir la consulta base
      let query = supabase
        .from('dispatches')
        .select(`
          id, 
          order_id,
          vehicle_plate,
          destination,
          accepted_at,
          eta,
          status,
          driver_id,
          drivers(first_name, last_name)
        `);
      
      // Filtrar por estado
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      } else {
        // Si es "todos", excluir los completados
        query = query.not('status', 'eq', 'completed');
      }
      
      // Ejecutar la consulta
      const { data, error } = await query.order('accepted_at', { ascending: false });
      
      if (error) throw error;
      
      const now = new Date();
      
      // Formatear los datos
      const formattedDispatches = data
        .filter(d => d.status !== 'pending') // Excluir los pendientes
        .map(dispatch => {
          // Calcular horas restantes y si está demorado
          let hoursRemaining = null;
          let isDelayed = false;
          
          if (dispatch.accepted_at) {
            const acceptedDate = new Date(dispatch.accepted_at);
            const expectedEnd = addHours(acceptedDate, 24); // 24 horas después de aceptado
            
            hoursRemaining = differenceInHours(expectedEnd, now);
            isDelayed = hoursRemaining < 0;
          }
          
          let driverName = null;
          // Safely access driver information if it exists
          if (dispatch.drivers && typeof dispatch.drivers === 'object') {
            driverName = `${dispatch.drivers.first_name} ${dispatch.drivers.last_name}`;
          }
          
          return {
            id: dispatch.id,
            orderId: dispatch.order_id,
            vehiclePlate: dispatch.vehicle_plate || 'No asignado',
            driverName: driverName,
            destination: dispatch.destination,
            acceptedAt: dispatch.accepted_at ? new Date(dispatch.accepted_at) : null,
            eta: dispatch.eta ? new Date(dispatch.eta) : null,
            status: dispatch.status,
            hoursRemaining,
            isDelayed
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

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = dispatches.filter(d => 
        d.orderId.toLowerCase().includes(lowercaseSearch) ||
        d.vehiclePlate.toLowerCase().includes(lowercaseSearch) ||
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
      'Vehículo', 
      'Conductor', 
      'Destino', 
      'Aceptado', 
      'Estado',
      'Horas Restantes',
      'Demorado'
    ].join(',');
    
    const csvRows = filteredDispatches.map(d => [
      d.orderId,
      d.vehiclePlate,
      d.driverName || 'No asignado',
      d.destination,
      d.acceptedAt ? format(d.acceptedAt, 'dd/MM/yyyy HH:mm', { locale: es }) : 'No aceptado',
      d.status,
      d.hoursRemaining !== null ? d.hoursRemaining : 'N/A',
      d.isDelayed ? 'Sí' : 'No'
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
          <label className="text-sm font-medium">Estado</label>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos (activos)</SelectItem>
              <SelectItem value="in_progress">En Ruta</SelectItem>
              <SelectItem value="delayed">Demorados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={isLoading}
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
                  <th className="px-4 py-3 text-left font-medium">Vehículo</th>
                  <th className="px-4 py-3 text-left font-medium">Conductor</th>
                  <th className="px-4 py-3 text-left font-medium">Destino</th>
                  <th className="px-4 py-3 text-left font-medium">Aceptado</th>
                  <th className="px-4 py-3 text-left font-medium">Tiempo</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDispatches.map((dispatch) => (
                  <tr key={dispatch.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{dispatch.orderId}</td>
                    <td className="px-4 py-3">{dispatch.vehiclePlate}</td>
                    <td className="px-4 py-3">{dispatch.driverName || 'No asignado'}</td>
                    <td className="px-4 py-3">{dispatch.destination}</td>
                    <td className="px-4 py-3">
                      {dispatch.acceptedAt ? format(dispatch.acceptedAt, "dd MMM yyyy, HH:mm", { locale: es }) : 'No aceptado'}
                    </td>
                    <td className="px-4 py-3">
                      {dispatch.hoursRemaining !== null ? (
                        <div className="flex items-center gap-1">
                          <Clock className={`w-4 h-4 ${dispatch.isDelayed ? 'text-red-500' : 'text-green-500'}`} />
                          <span className={dispatch.isDelayed ? 'text-red-600' : 'text-green-600'}>
                            {dispatch.isDelayed 
                              ? `${Math.abs(dispatch.hoursRemaining)} h demorado` 
                              : `${dispatch.hoursRemaining} h restantes`}
                          </span>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={dispatch.status} isDelayed={dispatch.isDelayed} />
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
          <TruckIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado despachos en progreso</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status, isDelayed }: { status: string, isDelayed: boolean }) => {
  let badgeClass = '';
  let label = '';
  
  if (status === 'cancelled') {
    badgeClass = 'bg-red-100 text-red-800';
    label = 'Cancelado';
  } else if (status === 'completed') {
    badgeClass = 'bg-green-100 text-green-800';
    label = 'Completado';
  } else if (isDelayed) {
    badgeClass = 'bg-orange-100 text-orange-800';
    label = 'Demorado';
  } else if (status === 'accepted' || status === 'in_progress') {
    badgeClass = 'bg-blue-100 text-blue-800';
    label = 'En Ruta';
  } else {
    badgeClass = 'bg-yellow-100 text-yellow-800';
    label = status;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
      {label}
    </span>
  );
};

export default StatusReportsTab;
