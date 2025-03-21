
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReceiptReport, VehicleData, DriverData } from '../types';

export const useReceiptSearch = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [vehiclePlate, setVehiclePlate] = useState('all_vehicles');
  const [driverId, setDriverId] = useState('all_drivers');
  const [searchTerm, setSearchTerm] = useState('');
  const [receipts, setReceipts] = useState<ReceiptReport[]>([]);
  const [filteredReceipts, setFilteredReceipts] = useState<ReceiptReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);

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
        
        // Filtrar valores nulos o vacíos
        const filteredVehicles = vehiclesData.filter(v => v.plate && v.plate.trim() !== '');
        setVehicles(filteredVehicles);
        
        // Obtener conductores
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .eq('active', true)
          .order('last_name');
          
        if (driversError) throw driversError;
        
        const formattedDrivers = driversData.map(driver => ({
          id: driver.id,
          name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || 'Sin nombre'
        }));
        
        setDrivers(formattedDrivers);
        
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
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
      // Construir la consulta para obtener remisiones
      let query = supabase
        .from('dispatches')
        .select(`
          id, 
          order_id,
          completed_at,
          vehicle_plate,
          driver_id,
          destination,
          receipt_image_url
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
      const { data: dispatchesData, error: dispatchesError } = await query.order('completed_at', { ascending: false });
      
      if (dispatchesError) throw dispatchesError;

      // Para cada remisión, obtener el nombre del conductor si hay driver_id
      const formattedReceipts = await Promise.all(dispatchesData.map(async (receipt) => {
        let driverName = null;
        
        if (receipt.driver_id) {
          const { data: driverData, error: driverError } = await supabase
            .from('drivers')
            .select('first_name, last_name')
            .eq('id', receipt.driver_id)
            .maybeSingle();
            
          if (!driverError && driverData) {
            driverName = `${driverData.first_name || ''} ${driverData.last_name || ''}`.trim();
          }
        }
        
        return {
          id: receipt.id,
          orderId: receipt.order_id || 'Sin ID',
          completedAt: new Date(receipt.completed_at),
          vehiclePlate: receipt.vehicle_plate || 'No asignado',
          driverName: driverName || 'No asignado',
          destination: receipt.destination || 'No especificado',
          receiptImageUrl: receipt.receipt_image_url
        };
      }));
      
      setReceipts(formattedReceipts);
      setFilteredReceipts(formattedReceipts);
      
    } catch (error) {
      console.error('Error al buscar remisiones:', error);
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
        (r.orderId && r.orderId.toLowerCase().includes(lowercaseSearch)) ||
        (r.vehiclePlate && r.vehiclePlate.toLowerCase().includes(lowercaseSearch)) ||
        (r.destination && r.destination.toLowerCase().includes(lowercaseSearch)) ||
        (r.driverName && r.driverName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredReceipts(filtered);
    } else {
      setFilteredReceipts(receipts);
    }
  }, [searchTerm, receipts]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    vehiclePlate,
    setVehiclePlate,
    driverId,
    setDriverId,
    searchTerm,
    setSearchTerm,
    receipts,
    filteredReceipts,
    isLoading,
    vehicles,
    drivers,
    handleSearch
  };
};
