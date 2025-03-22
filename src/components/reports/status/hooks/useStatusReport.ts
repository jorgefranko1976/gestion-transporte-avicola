
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dispatch, StatusFilterType } from '../types';
import { formatDispatchData, exportToCSV } from '../utils/statusUtils';

export const useStatusReport = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter dispatches when search term changes
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

  const handleSearch = async () => {
    setIsLoading(true);
    try {
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
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      } else {
        query = query.not('status', 'eq', 'completed');
      }
      
      const { data, error } = await query.order('accepted_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedDispatches = formatDispatchData(data);
      
      setDispatches(formattedDispatches);
      setFilteredDispatches(formattedDispatches);
      
    } catch (error) {
      console.error('Error searching dispatches:', error);
      toast.error('Error al buscar despachos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (filteredDispatches.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    const success = exportToCSV(filteredDispatches);
    if (success) {
      toast.success('Datos exportados correctamente');
    }
  };

  return {
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    dispatches,
    filteredDispatches,
    isLoading,
    handleSearch,
    handleExport
  };
};
