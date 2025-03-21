
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VehicleReport } from '../types';

export const useVehicleSearch = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all_types');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState<VehicleReport[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);

  // Cargar tipos de vehículos al iniciar
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('vehicle_type')
          .order('vehicle_type');
          
        if (error) throw error;
        
        // Filtrar tipos únicos y eliminar valores nulos o vacíos
        const uniqueTypes = [...new Set(data
          .map(item => item.vehicle_type)
          .filter(type => type && type.trim() !== '')
        )];
        
        setVehicleTypes(uniqueTypes);
        
      } catch (error) {
        console.error('Error al obtener tipos de vehículos:', error);
      }
    };
    
    fetchVehicleTypes();
  }, []);

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = vehicles.filter(v => 
        (v.plate && v.plate.toLowerCase().includes(lowercaseSearch)) ||
        (v.brand && v.brand.toLowerCase().includes(lowercaseSearch)) ||
        (v.model && v.model.toLowerCase().includes(lowercaseSearch)) ||
        (v.line && v.line.toLowerCase().includes(lowercaseSearch)) ||
        (v.ownerName && v.ownerName.toLowerCase().includes(lowercaseSearch))
      );
      setFilteredVehicles(filtered);
    } else {
      setFilteredVehicles(vehicles);
    }
  }, [searchTerm, vehicles]);

  // Buscar vehículos
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // Construir la consulta básica
      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .select(`
          id, 
          plate,
          vehicle_type,
          brand,
          model,
          line,
          active,
          soat_expiration,
          technical_inspection_expiration,
          status,
          owner_id
        `)
        .order('plate');
      
      if (vehiclesError) throw vehiclesError;
      
      // Obtener vehículos con filtros de estado aplicados
      let filteredData = vehiclesData;
      if (statusFilter !== 'all') {
        filteredData = vehiclesData.filter(v => v.active === (statusFilter === 'active'));
      }
      
      // Aplicar filtro de tipo
      if (typeFilter && typeFilter !== 'all_types') {
        filteredData = filteredData.filter(v => v.vehicle_type === typeFilter);
      }
      
      // Procesar cada vehículo para obtener información del propietario
      const formattedVehicles = await Promise.all(filteredData.map(async vehicle => {
        let ownerName = null;
        
        if (vehicle.owner_id) {
          const { data: ownerData, error: ownerError } = await supabase
            .from('vehicle_owners')
            .select('name, first_name, last_name')
            .eq('id', vehicle.owner_id)
            .maybeSingle();
          
          if (!ownerError && ownerData) {
            ownerName = ownerData.name || `${ownerData.first_name || ''} ${ownerData.last_name || ''}`.trim();
          }
        }
        
        return {
          id: vehicle.id,
          plate: vehicle.plate || 'Sin placa',
          type: vehicle.vehicle_type || 'Desconocido',
          brand: vehicle.brand || 'Desconocido',
          model: vehicle.model || 'Desconocido',
          line: vehicle.line || 'Desconocido',
          active: vehicle.active,
          ownerName: ownerName || 'No especificado',
          soatExpiration: vehicle.soat_expiration ? new Date(vehicle.soat_expiration) : null,
          techExpiration: vehicle.technical_inspection_expiration ? new Date(vehicle.technical_inspection_expiration) : null,
          status: vehicle.status || 'available'
        };
      }));
      
      setVehicles(formattedVehicles);
      setFilteredVehicles(formattedVehicles);
      
    } catch (error) {
      console.error('Error al buscar vehículos:', error);
      toast.error('Error al buscar vehículos');
    } finally {
      setIsLoading(false);
    }
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
