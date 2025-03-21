
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import { VehicleReport } from '../types';

export const exportVehiclesToCSV = (vehicles: VehicleReport[]) => {
  if (vehicles.length === 0) {
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
  
  const csvRows = vehicles.map(v => [
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
