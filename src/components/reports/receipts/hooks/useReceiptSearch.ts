
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReceiptReport, VehicleData, DriverData } from '../types';

export const useReceiptSearch = () => {
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
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [drivers, setDrivers] = useState<DriverData[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('plate')
          .eq('active', true)
          .order('plate');
          
        if (vehiclesError) throw vehiclesError;
        setVehicles(vehiclesData);
        
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
      
      if (vehiclePlate && vehiclePlate !== 'all_vehicles') {
        query = query.eq('vehicle_plate', vehiclePlate);
      }
      
      if (driverId && driverId !== 'all_drivers') {
        query = query.eq('driver_id', driverId);
      }
      
      const { data, error } = await query.order('completed_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedReceipts = data.map(receipt => {
        let driverName = null;
        if (receipt.drivers && typeof receipt.drivers === 'object') {
          driverName = `${receipt.drivers?.first_name || ''} ${receipt.drivers?.last_name || ''}`.trim();
        }
        
        return {
          id: receipt.id,
          orderId: receipt.order_id,
          completedAt: new Date(receipt.completed_at),
          vehiclePlate: receipt.vehicle_plate || 'No asignado',
          driverName: driverName,
          destination: receipt.destination,
          receiptImageUrl: receipt.receipt_image_url
        };
      });
      
      setReceipts(formattedReceipts);
      setFilteredReceipts(formattedReceipts);
      
    } catch (error) {
      console.error('Error searching receipts:', error);
      toast.error('Error al buscar remisiones');
    } finally {
      setIsLoading(false);
    }
  };

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
