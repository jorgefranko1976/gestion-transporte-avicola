
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ReceiptReport } from '../types';

export const exportToCSV = (data: ReceiptReport[], filename: string) => {
  // Crear contenido CSV
  const headers = [
    'Orden', 
    'Fecha', 
    'Vehículo', 
    'Conductor', 
    'Destino', 
    'Remisión'
  ].join(',');
  
  const csvRows = data.map(r => [
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
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
