
import { useState, useEffect } from 'react';
import { Driver } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DriverSortField = 'name' | 'hire_date';
export type DriverStatusFilter = 'all' | 'active' | 'inactive';

export const useDrivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<DriverStatusFilter>('all');
  const [sortBy, setSortBy] = useState<DriverSortField>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch drivers from Supabase
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('drivers')
          .select('*, driver_documents(*)')
          .order('first_name', { ascending: true });

        if (error) {
          throw error;
        }

        // Convert to our Driver type
        const formattedDrivers = data.map(driver => ({
          id: driver.id,
          firstName: driver.first_name,
          lastName: driver.last_name,
          identificationType: driver.identification_type,
          identificationNumber: driver.identification_number,
          birthDate: new Date(driver.birth_date),
          address: driver.address,
          phone: driver.phone,
          emergencyContact: driver.emergency_contact,
          documents: {
            drivingLicense: driver.driver_documents.find(d => d.document_type === 'drivingLicense')?.document_url || null,
            identification: driver.driver_documents.find(d => d.document_type === 'identification')?.document_url || null,
            resume: driver.driver_documents.find(d => d.document_type === 'resume')?.document_url || null,
            finesClearance: driver.driver_documents.find(d => d.document_type === 'finesClearance')?.document_url || null,
            references: driver.driver_documents.find(d => d.document_type === 'references')?.document_url || null,
            arl: driver.driver_documents.find(d => d.document_type === 'arl')?.document_url || null,
            payroll: driver.driver_documents.find(d => d.document_type === 'payroll')?.document_url || null,
          },
          assignedVehicle: driver.assigned_vehicle_id,
          observations: [],  // We'll load these later if needed
          active: driver.active,
          hireDate: new Date(driver.hire_date),
          terminationDate: driver.termination_date ? new Date(driver.termination_date) : null,
          licenseExpiration: driver.license_expiration ? new Date(driver.license_expiration) : null,
        }));

        setDrivers(formattedDrivers);
        setFilteredDrivers(formattedDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast.error('Error al cargar conductores');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Filter drivers
  useEffect(() => {
    let result = [...drivers];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(d => d.active === (statusFilter === 'active'));
    }
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(driver => 
        driver.firstName.toLowerCase().includes(search) || 
        driver.lastName.toLowerCase().includes(search) || 
        driver.identificationNumber.toLowerCase().includes(search)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
        const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else {
        return sortAsc 
          ? a.hireDate.getTime() - b.hireDate.getTime() 
          : b.hireDate.getTime() - a.hireDate.getTime();
      }
    });
    
    setFilteredDrivers(result);
  }, [drivers, searchTerm, statusFilter, sortBy, sortAsc]);

  // Change sorting
  const toggleSort = (field: DriverSortField) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return {
    drivers,
    filteredDrivers,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortAsc,
    toggleSort
  };
};
