
import { useState, useEffect } from 'react';
import { Search, Download, TruckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VehicleReport {
  id: string;
  plate: string;
  type: string;
  brand: string;
  model: string;
  line: string;
  active: boolean;
  ownerName: string | null;
  soatExpiration: Date | null;
  techExpiration: Date | null;
  status: string;
}

const VehicleReportsTab = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<VehicleReport[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('vehicle_type')
          .order('vehicle_type');
          
        if (error) throw error;
        
        // Filtrar tipos únicos
        const uniqueTypes = [...new Set(data.map(item => item.vehicle_type))];
        setVehicleTypes(uniqueTypes);
        
      } catch (error) {
        console.error('Error fetching vehicle types:', error);
      }
    };
    
    fetchVehicleTypes();
  }, []);

  // Buscar vehículos
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construir la consulta
      let query = supabase
        .from('vehicles')
        .select(`
          id, 
          plate,
          vehicle_type,
          brand,
          model,
          line,
          active,
          soat_expiration,
          technical_inspection_expiration,
          status,
          vehicle_owners(name, first_name, last_name)
        `)
        .order('plate');
      
      // Aplicar filtros de estado
      if (statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active');
      }
      
      // Aplicar filtro de tipo
      if (typeFilter && typeFilter !== 'all_types') {
        query = query.eq('vehicle_type', typeFilter);
      }
      
      // Ejecutar la consulta
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Formatear los datos
      const formattedVehicles = data.map(vehicle => ({
        id: vehicle.id,
        plate: vehicle.plate,
        type: vehicle.vehicle_type,
        brand: vehicle.brand,
        model: vehicle.model,
        line: vehicle.line,
        active: vehicle.active,
        ownerName: vehicle.vehicle_owners 
          ? (vehicle.vehicle_owners.name || `${vehicle.vehicle_owners.first_name} ${vehicle.vehicle_owners.last_name}`)
          : null,
        soatExpiration: vehicle.soat_expiration ? new Date(vehicle.soat_expiration) : null,
        techExpiration: vehicle.technical_inspection_expiration ? new Date(vehicle.technical_inspection_expiration) : null,
        status: vehicle.status || 'available'
      }));
      
      setVehicles(formattedVehicles);
      setFilteredVehicles(formattedVehicles);
      
    } catch (error) {
      console.error('Error searching vehicles:', error);
      toast.error('Error al buscar vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = vehicles.filter(v => 
        v.plate.toLowerCase().includes(lowercaseSearch) ||
        v.brand.toLowerCase().includes(lowercaseSearch) ||
        v.model.toLowerCase().includes(lowercaseSearch) ||
        v.line.toLowerCase().includes(lowercaseSearch) ||
        (v.ownerName && v.ownerName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredVehicles.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    // Crear contenido CSV
    const headers = [
      'Placa', 
      'Tipo', 
      'Marca', 
      'Modelo', 
      'Línea', 
      'Propietario', 
      'Estado',
      'Venc. SOAT',
      'Venc. Técnico-Mecánica',
      'Estado Operativo'
    ].join(',');
    
    const csvRows = filteredVehicles.map(v => [
      v.plate,
      v.type,
      v.brand,
      v.model,
      v.line,
      v.ownerName || 'No especificado',
      v.active ? 'Activo' : 'Inactivo',
      v.soatExpiration ? format(v.soatExpiration, 'dd/MM/yyyy', { locale: es }) : 'N/A',
      v.techExpiration ? format(v.techExpiration, 'dd/MM/yyyy', { locale: es }) : 'N/A',
      v.status === 'available' ? 'Disponible' : 
      v.status === 'in_route' ? 'En Ruta' : 
      v.status === 'suspended' ? 'Suspendido' : 
      v.status === 'maintenance' ? 'Mantenimiento' : v.status
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vehiculos_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Vehículos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de Vehículo</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">Todos los tipos</SelectItem>
              {vehicleTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
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
          onClick={exportToCSV}
          disabled={filteredVehicles.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {vehicles.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Placa</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Marca</th>
                  <th className="px-4 py-3 text-left font-medium">Modelo</th>
                  <th className="px-4 py-3 text-left font-medium">Propietario</th>
                  <th className="px-4 py-3 text-left font-medium">Venc. SOAT</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{vehicle.plate}</td>
                    <td className="px-4 py-3">{vehicle.type}</td>
                    <td className="px-4 py-3">{vehicle.brand}</td>
                    <td className="px-4 py-3">{vehicle.model}</td>
                    <td className="px-4 py-3">{vehicle.ownerName || 'No especificado'}</td>
                    <td className="px-4 py-3">
                      {vehicle.soatExpiration 
                        ? format(vehicle.soatExpiration, "dd MMM yyyy", { locale: es })
                        : 'No registrado'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {vehicle.active ? 'Activo' : 'Inactivo'}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.status === 'available' 
                            ? "bg-green-100 text-green-800" 
                            : vehicle.status === 'in_route'
                            ? "bg-blue-100 text-blue-800"
                            : vehicle.status === 'suspended'
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {vehicle.status === 'available' ? 'Disponible' : 
                          vehicle.status === 'in_route' ? 'En Ruta' : 
                          vehicle.status === 'suspended' ? 'Suspendido' : 
                          vehicle.status === 'maintenance' ? 'Mantenimiento' : 
                          vehicle.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando vehículos...</p>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <TruckIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado vehículos</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleReportsTab;
