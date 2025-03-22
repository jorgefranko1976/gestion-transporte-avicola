
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { exportDispatchesToCSV } from '../utils/exportUtils';

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
  status: string;
}

export const useDispatchReport = () => {
  // Date filters
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Location filters
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  
  // Results and loading state
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [filteredDispatches, setFilteredDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter options
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // Load filter options when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: originsData, error: originsError } = await supabase
          .from('dispatches')
          .select('loading_company')
          .order('loading_company');
          
        if (originsError) throw originsError;
        
        const uniqueOrigins = [...new Set(originsData.map(item => item.loading_company))];
        setOrigins(uniqueOrigins);
        
        const { data: destinationsData, error: destinationsError } = await supabase
          .from('dispatches')
          .select('destination')
          .order('destination');
          
        if (destinationsError) throw destinationsError;
        
        const uniqueDestinations = [...new Set(destinationsData.map(item => item.destination))];
        setDestinations(uniqueDestinations);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };
    
    fetchInitialData();
  }, []);

  // Filter dispatches when search term changes
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = dispatches.filter(d => 
        d.orderId.toLowerCase().includes(lowercaseSearch) ||
        d.origin.toLowerCase().includes(lowercaseSearch) ||
        d.destination.toLowerCase().includes(lowercaseSearch) ||
        (d.vehiclePlate && d.vehiclePlate.toLowerCase().includes(lowercaseSearch)) ||
        (d.driverName && d.driverName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredDispatches(filtered);
    } else {
      setFilteredDispatches(dispatches);
    }
  }, [searchTerm, dispatches]);

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
          created_at,
          loading_company,
          destination,
          vehicle_plate,
          driver_id,
          drivers(first_name, last_name),
          status
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', new Date(endDate.setHours(23, 59, 59)).toISOString());
      
      if (origin) {
        query = query.eq('loading_company', origin);
      }
      
      if (destination) {
        query = query.eq('destination', destination);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedDispatches = data.map(item => {
        let driverName = getDriverName(item);
        
        return {
          id: item.id,
          orderId: item.order_id,
          date: new Date(item.created_at),
          origin: item.loading_company,
          destination: item.destination,
          vehiclePlate: item.vehicle_plate || 'No asignado',
          driverName: driverName,
          status: item.status
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

  const exportToCSV = () => {
    if (filteredDispatches.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    const success = exportDispatchesToCSV(filteredDispatches);
    if (success) {
      toast.success('Datos exportados correctamente');
    } else {
      toast.error('Error al exportar los datos');
    }
  };

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    origin,
    setOrigin,
    destination,
    setDestination,
    searchTerm,
    setSearchTerm,
    dispatches,
    filteredDispatches,
    isLoading,
    origins,
    destinations,
    handleSearch,
    exportToCSV
  };
};

// Helper function to get driver name from dispatch item
const getDriverName = (item: any) => {
  if (!item.drivers) return 'No asignado';
  return item.drivers.first_name && item.drivers.last_name
    ? `${item.drivers.first_name} ${item.drivers.last_name}`
    : 'No asignado';
};
