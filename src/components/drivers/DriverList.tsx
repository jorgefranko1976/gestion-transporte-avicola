
import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Driver } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface DriverListProps {
  onRegisterClick: () => void;
}

const DriverList = ({ onRegisterClick }: DriverListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'hire_date'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Cargar conductores de Supabase
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

        // Convertir a nuestro tipo Driver
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
          observations: [],  // Se cargarán después si es necesario
          active: driver.active,
          hireDate: new Date(driver.hire_date),
          terminationDate: driver.termination_date ? new Date(driver.termination_date) : null,
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

  // Filtrar conductores
  useEffect(() => {
    let result = [...drivers];
    
    // Aplicar filtro de estado
    if (statusFilter !== 'all') {
      result = result.filter(d => d.active === (statusFilter === 'active'));
    }
    
    // Aplicar búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(driver => 
        driver.firstName.toLowerCase().includes(search) || 
        driver.lastName.toLowerCase().includes(search) || 
        driver.identificationNumber.toLowerCase().includes(search)
      );
    }
    
    // Aplicar ordenamiento
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

  // Cambiar ordenamiento
  const toggleSort = (field: 'name' | 'hire_date') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Buscador y filtros */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[240px]"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={statusFilter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Todos
            </Button>
            <Button 
              variant={statusFilter === 'active' ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Activos
            </Button>
            <Button 
              variant={statusFilter === 'inactive' ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter('inactive')}
            >
              Inactivos
            </Button>
          </div>
        </div>
        
        {/* Botón de registro */}
        <Button onClick={onRegisterClick} className="ml-auto">
          Registrar Conductor
        </Button>
      </div>
      
      {/* Tabla de conductores */}
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th 
                  className="px-4 py-3 text-left font-medium cursor-pointer"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Nombre
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Identificación
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Teléfono
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Vehículo Asignado
                </th>
                <th 
                  className="px-4 py-3 text-left font-medium cursor-pointer"
                  onClick={() => toggleSort('hire_date')}
                >
                  <div className="flex items-center gap-1">
                    Fecha Contratación
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium">
                  Estado
                </th>
                <th className="px-4 py-3 text-right font-medium">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Cargando conductores...
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No se encontraron conductores
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">{driver.firstName} {driver.lastName}</td>
                    <td className="px-4 py-3">{driver.identificationType}: {driver.identificationNumber}</td>
                    <td className="px-4 py-3">{driver.phone}</td>
                    <td className="px-4 py-3">
                      {driver.assignedVehicle ? driver.assignedVehicle : "No asignado"}
                    </td>
                    <td className="px-4 py-3">
                      {format(driver.hireDate, 'dd MMM yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        driver.active 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {driver.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm">Ver</Button>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverList;
