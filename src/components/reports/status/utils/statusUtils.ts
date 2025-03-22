
import { format, addHours, differenceInHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { Dispatch } from '../types';

export const getDriverName = (dispatch: any): string => {
  if (!dispatch.drivers) return 'No asignado';
  return dispatch.drivers.first_name && dispatch.drivers.last_name
    ? `${dispatch.drivers.first_name} ${dispatch.drivers.last_name}`
    : 'No asignado';
};

export const formatDispatchData = (data: any[]): Dispatch[] => {
  const now = new Date();
  
  return data
    .filter(d => d.status !== 'pending')
    .map(dispatch => {
      let hoursRemaining = null;
      let isDelayed = false;
      
      if (dispatch.accepted_at) {
        const acceptedDate = new Date(dispatch.accepted_at);
        const expectedEnd = addHours(acceptedDate, 24);
        
        hoursRemaining = differenceInHours(expectedEnd, now);
        isDelayed = hoursRemaining < 0;
      }
      
      const driverName = getDriverName(dispatch);
      
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
};

export const exportToCSV = (dispatches: Dispatch[]) => {
  if (dispatches.length === 0) {
    return false;
  }
  
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
  
  const csvRows = dispatches.map(d => [
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
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `estado_despachos_${format(new Date(), 'dd-MM-yyyy')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};
