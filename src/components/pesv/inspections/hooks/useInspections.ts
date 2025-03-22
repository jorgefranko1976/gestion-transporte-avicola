
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Inspection, DateFilterType } from '../types/inspection-types';

export const useInspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');

  // Cargar inspecciones
  useEffect(() => {
    const fetchInspections = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicle_inspections')
          .select(`
            id, 
            inspection_date,
            tire_photo_url,
            kit_photo_url,
            tires_ok,
            lights_ok,
            brakes_ok,
            mirrors_ok,
            oil_ok,
            water_ok,
            kit_ok,
            observations,
            vehicles(plate),
            drivers(first_name, last_name)
          `)
          .order('inspection_date', { ascending: false });

        if (error) throw error;

        const formattedInspections = data.map(item => ({
          id: item.id,
          vehiclePlate: item.vehicles?.plate || 'Desconocido',
          driverName: item.drivers ? `${item.drivers.first_name} ${item.drivers.last_name}` : 'Desconocido',
          date: new Date(item.inspection_date),
          tiresOk: item.tires_ok,
          lightsOk: item.lights_ok,
          brakesOk: item.brakes_ok,
          mirrorsOk: item.mirrors_ok,
          oilOk: item.oil_ok,
          waterOk: item.water_ok,
          kitOk: item.kit_ok,
          observations: item.observations,
          tirePhotoUrl: item.tire_photo_url,
          kitPhotoUrl: item.kit_photo_url
        }));

        setInspections(formattedInspections);
        setFilteredInspections(formattedInspections);
      } catch (error) {
        console.error('Error fetching inspections:', error);
        toast.error('Error al cargar las inspecciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspections();
  }, []);

  // Filtrar inspecciones
  useEffect(() => {
    let filtered = [...inspections];
    
    // Aplicar filtro de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        i => i.vehiclePlate.toLowerCase().includes(term) || 
             i.driverName.toLowerCase().includes(term)
      );
    }
    
    // Aplicar filtro de fecha
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      filtered = filtered.filter(i => {
        const inspectionDate = new Date(i.date);
        inspectionDate.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'today') {
          return inspectionDate.getTime() === today.getTime();
        } else if (dateFilter === 'week') {
          return inspectionDate >= oneWeekAgo;
        } else if (dateFilter === 'month') {
          return inspectionDate >= oneMonthAgo;
        }
        return true;
      });
    }
    
    setFilteredInspections(filtered);
  }, [inspections, searchTerm, dateFilter]);

  return {
    inspections,
    filteredInspections,
    isLoading,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter
  };
};
