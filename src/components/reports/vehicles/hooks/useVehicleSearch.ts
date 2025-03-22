
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleReport } from '../types';

// Define an interface for the vehicle data returned from Supabase
interface VehicleData {
  id: string;
  plate: string;
  vehicle_type: string;
  brand: string;
  model: string;
  line?: string;
  year?: number;
  status: string;
  active: boolean;
  vehicle_owners?: { name: string } | null;
  drivers?: { first_name: string; last_name: string } | null;
  soat_expiration?: Date | null;
  technical_inspection_expiration?: Date | null;
}

export const useVehicleSearch = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<VehicleReport[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch unique vehicle types
        const { data: typesData, error: typesError } = await supabase
          .from('vehicles')
          .select('vehicle_type')
          .order('vehicle_type');
          
        if (typesError) throw typesError;
        
        // Extract unique types from the data
        if (typesData) {
          const uniqueTypes = [...new Set(typesData.map(item => item.vehicle_type))];
          setVehicleTypes(uniqueTypes);
        }
        
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
        (v.ownerName && v.ownerName.toLowerCase().includes(lowercaseSearch))
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
          vehicle_type,
          brand,
          model,
          line,
          status,
          active,
          soat_expiration,
          technical_inspection_expiration,
          vehicle_owners (name),
          drivers (first_name, last_name)
        `);
      
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('active', statusFilter === 'active');
      }
      
      if (typeFilter && typeFilter !== 'all_types') {
        query = query.eq('vehicle_type', typeFilter);
      }
      
      const { data, error } = await query.order('plate', { ascending: false });
      
      if (error) throw error;
      
      // Ensure data is the correct type before formatting
      const formattedVehicles = formatVehicleData(data as VehicleData[]);
      
      setVehicles(formattedVehicles);
      setFilteredVehicles(formattedVehicles);
      
    } catch (error) {
      console.error('Error searching vehicles:', error);
      toast.error('Error al buscar vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  // Format the raw Supabase data into the VehicleReport structure
  const formatVehicleData = (data: VehicleData[]): VehicleReport[] => {
    return data.map(item => {
      // Safely access nested properties
      const ownerName = item.vehicle_owners?.name || null;
      
      // Convert to the VehicleReport format defined in types.ts
      return {
        id: item.id,
        plate: item.plate,
        type: item.vehicle_type,
        brand: item.brand,
        model: item.model,
        line: item.line || '',
        active: item.active,
        ownerName: ownerName,
        soatExpiration: item.soat_expiration || null,
        techExpiration: item.technical_inspection_expiration || null,
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
