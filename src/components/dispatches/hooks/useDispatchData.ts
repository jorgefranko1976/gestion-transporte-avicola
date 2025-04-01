
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch } from "@/lib/types/dispatch-types";

export interface ExcelDispatchEntry {
  id: string;
  orderId: string;
  vehiclePlate?: string;
  driver?: string;
  driverId?: string;
  destination: string;
  farm?: string;
  packages: number;
  status: string;
  eta: Date | null;
  createdAt: Date;
  concentrateAmount: number;
  loadingCompany?: string;
  source: string;
}

interface UseDispatchDataProps {
  searchTerm: string;
  excelData: any[];
}

export function useDispatchData({ searchTerm, excelData }: UseDispatchDataProps) {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combinedData, setCombinedData] = useState<(Dispatch | ExcelDispatchEntry)[]>([]);

  // Fetch dispatches from database
  useEffect(() => {
    const fetchDispatches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from("dispatches")
          .select(`
            id,
            order_id,
            driver_id,
            vehicle_plate,
            loading_company,
            destination,
            zone,
            farm,
            farm_id,
            packages,
            concentrate_amount,
            status,
            accepted_at,
            completed_at,
            eta,
            receipt_image_url,
            created_at
          `)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Error al obtener despachos:", error);
          throw error;
        }
        
        if (!data) {
          throw new Error("No se pudieron obtener los datos de despachos");
        }
        
        // Transform data to match the Dispatch interface
        const formattedDispatches = data.map(d => ({
          id: d.id,
          orderId: d.order_id,
          driverId: d.driver_id || '',
          vehiclePlate: d.vehicle_plate || '',
          loadingCompany: d.loading_company || '',
          destination: d.destination,
          zone: d.zone || '',
          farm: d.farm || '',
          farmId: d.farm_id || '',
          packages: d.packages || 0,
          concentrateAmount: d.concentrate_amount,
          status: d.status as Dispatch['status'],
          acceptedAt: d.accepted_at ? new Date(d.accepted_at) : null,
          completedAt: d.completed_at ? new Date(d.completed_at) : null,
          eta: d.eta ? new Date(d.eta) : null,
          receiptImageUrl: d.receipt_image_url,
          createdAt: new Date(d.created_at),
          source: 'database' as const
        }));
        
        setDispatches(formattedDispatches);
      } catch (err: any) {
        console.error("Error al obtener despachos:", err);
        setError(err.message || "Error al cargar los despachos");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDispatches();
  }, []);
  
  // Combine database and Excel data
  useEffect(() => {
    console.log("Excel data received:", excelData);
    
    // Convert Excel data to the appropriate format
    const excelDispatches: ExcelDispatchEntry[] = excelData.map(item => ({
      id: item.id || `excel-${item.orden}`,
      orderId: item.orden,
      vehiclePlate: item.placa || '',
      driver: item.conductor || '',
      driverId: item.conductorId || '',
      destination: item.planta || item.destino || '',
      farm: item.granja || '',
      packages: parseInt(item.cantidad) || 0,
      status: item.estado || 'pendiente',
      eta: item.horaEstimada || null,
      createdAt: new Date(),
      concentrateAmount: item.ton || item.toneladas || 0,
      loadingCompany: item.ubicacion || '',
      source: 'excel'
    }));
    
    console.log("Formatted excel dispatches:", excelDispatches);
    
    // Combine both data sources
    const combined = [...dispatches, ...excelDispatches];
    
    // Remove duplicates based on orderId
    const uniqueMap = new Map();
    combined.forEach(item => {
      // If there's a database record, prioritize it over Excel
      if (!uniqueMap.has(item.orderId) || (item as any).source === 'database') {
        uniqueMap.set(item.orderId, item);
      }
    });
    
    const uniqueData = Array.from(uniqueMap.values());
    console.log("Combined unique data:", uniqueData);
    
    setCombinedData(uniqueData);
  }, [dispatches, excelData]);
  
  // Filter dispatches based on search term
  const filteredDispatches = combinedData.filter(dispatch => 
    dispatch.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.farm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ('driver' in dispatch && dispatch.driver?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    dispatch.loadingCompany?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    dispatches: filteredDispatches,
    isLoading,
    error,
    isEmpty: combinedData.length === 0
  };
}
