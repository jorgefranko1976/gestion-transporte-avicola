
import { useState, useEffect } from 'react';
import { Search, Download, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DriverReport {
  id: string;
  fullName: string;
  identificationType: string;
  identificationNumber: string;
  phone: string;
  vehiclePlate: string | null;
  hireDate: Date;
  terminationDate: Date | null;
  active: boolean;
}

const DriverReportsTab = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [drivers, setDrivers] = useState<DriverReport[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar conductores
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construir la consulta
      let query = supabase
        .from('drivers')
        .select(`
          id, 
          first_name,
          last_name,
          identification_type,
          identification_number,
          phone,
          assigned_vehicle_id,
          hire_date,
          termination_date,
          active,
          vehicles(plate)
        `)
        .order('last_name');
      
      // Aplicar filtros de estado
      if (statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active');
      }
      
      // Ejecutar la consulta
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Formatear los datos
      const formattedDrivers = data.map(driver => ({
        id: driver.id,
        fullName: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'Sin nombre',
        identificationType: driver.identification_type || 'Sin tipo',
        identificationNumber: driver.identification_number || 'Sin número',
        phone: driver.phone || 'Sin teléfono',
        vehiclePlate: driver.vehicles?.plate || null,
        hireDate: new Date(driver.hire_date),
        terminationDate: driver.termination_date ? new Date(driver.termination_date) : null,
        active: driver.active
      }));
      
      setDrivers(formattedDrivers);
      setFilteredDrivers(formattedDrivers);
      
    } catch (error) {
      console.error('Error searching drivers:', error);
      toast.error('Error al buscar conductores');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = drivers.filter(d => 
        (d.fullName && d.fullName.toLowerCase().includes(lowercaseSearch)) ||
        (d.identificationNumber && d.identificationNumber.toLowerCase().includes(lowercaseSearch)) ||
        (d.phone && d.phone.toLowerCase().includes(lowercaseSearch)) ||
        (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredDrivers(filtered);
    } else {
      setFilteredDrivers(drivers);
    }
  }, [searchTerm, drivers]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredDrivers.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    // Crear contenido CSV
    const headers = [
      'Nombre', 
      'Identificación', 
      'Teléfono', 
      'Vehículo Asignado', 
      'Fecha Contratación',
      'Fecha Retiro',
      'Estado'
    ].join(',');
    
    const csvRows = filteredDrivers.map(d => [
      d.fullName,
      `${d.identificationType}: ${d.identificationNumber}`,
      d.phone,
      d.vehiclePlate || 'No asignado',
      format(d.hireDate, 'dd/MM/yyyy', { locale: es }),
      d.terminationDate ? format(d.terminationDate, 'dd/MM/yyyy', { locale: es }) : 'N/A',
      d.active ? 'Activo' : 'Inactivo'
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `conductores_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Conductores</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
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
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          onClick={handleSearch} 
          className="w-full md:w-auto"
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar Conductores'}
        </Button>
        
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Filtrar resultados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
            disabled={drivers.length === 0}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={exportToCSV}
          disabled={filteredDrivers.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {drivers.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium">Identificación</th>
                  <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                  <th className="px-4 py-3 text-left font-medium">Vehículo</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha Contratación</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha Retiro</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{driver.fullName}</td>
                    <td className="px-4 py-3">{driver.identificationType}: {driver.identificationNumber}</td>
                    <td className="px-4 py-3">{driver.phone}</td>
                    <td className="px-4 py-3">{driver.vehiclePlate || 'No asignado'}</td>
                    <td className="px-4 py-3">
                      {format(driver.hireDate, "dd MMM yyyy", { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      {driver.terminationDate 
                        ? format(driver.terminationDate, "dd MMM yyyy", { locale: es })
                        : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        driver.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {driver.active ? 'Activo' : 'Inactivo'}
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
          <p className="text-muted-foreground">Buscando conductores...</p>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado conductores</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default DriverReportsTab;
