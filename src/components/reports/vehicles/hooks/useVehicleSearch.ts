import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface VehicleReport {
  id: string;
  plate: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  ownerName: string;
  driverName: string;
  status: string;
}

export const useVehicleSearch = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<VehicleReport[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: typesData, error: typesError } = await supabase
          .from('vehicles')
          .select('type')
          .order('type');
          
        if (typesError) throw typesError;
        
        const uniqueTypes = [...new Set(typesData.map(item => item.type))];
        setVehicleTypes(uniqueTypes);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };
    
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = vehicles.filter(v => 
        v.plate.toLowerCase().includes(lowercaseSearch) ||
        v.type.toLowerCase().includes(lowercaseSearch) ||
        v.brand.toLowerCase().includes(lowercaseSearch) ||
        v.model.toLowerCase().includes(lowercaseSearch) ||
        v.ownerName.toLowerCase().includes(lowercaseSearch) ||
        v.driverName.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('vehicles')
        .select(`
          id,
          plate,
          type,
          brand,
          model,
          year,
          status,
          vehicle_owners (name),
          drivers (first_name, last_name)
        `);
      
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      
      const { data, error } = await query.order('plate', { ascending: false });
      
      if (error) throw error;
      
      const formattedVehicles = formatVehicleData(data);
      
      setVehicles(formattedVehicles);
      setFilteredVehicles(formattedVehicles);
      
    } catch (error) {
      console.error('Error searching vehicles:', error);
      toast.error('Error al buscar vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  // This is where the TypeScript errors were occurring - we need to handle the case when drivers or owners are null
  const formatVehicleData = (data: any[]): VehicleReport[] => {
    return data.map(item => {
      // Safely access nested properties using optional chaining
      const ownerName = item.vehicle_owners?.name || 'No registrado';
      const driverName = item.drivers?.first_name && item.drivers?.last_name
        ? `${item.drivers.first_name} ${item.drivers.last_name}`
        : 'No asignado';
      
      return {
        id: item.id,
        plate: item.plate,
        type: item.type,
        brand: item.brand,
        model: item.model,
        year: item.year,
        ownerName: ownerName,
        driverName: driverName,
        status: item.status
      };
    });
  };

  return {
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    searchTerm,
    setSearchTerm,
    vehicles,
    filteredVehicles,
    isLoading,
    vehicleTypes,
    handleSearch
  };
};
