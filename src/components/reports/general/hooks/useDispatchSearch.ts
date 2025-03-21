
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
}

export function useDispatchSearch() {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  // Load origins and destinations when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Get origins (loading companies)
        const { data: originsData, error: originsError } = await supabase
          .from("dispatches")
          .select("loading_company")
          .order("loading_company");
          
        if (originsError) throw originsError;
        
        // Filter unique companies
        const uniqueOrigins = [...new Set(originsData.map(item => item.loading_company))];
        setOrigins(uniqueOrigins);
        
        // Get destinations
        const { data: destinationsData, error: destinationsError } = await supabase
          .from("dispatches")
          .select("destination")
          .order("destination");
          
        if (destinationsError) throw destinationsError;
        
        // Filter unique destinations
        const uniqueDestinations = [...new Set(destinationsData.map(item => item.destination))];
        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Error al cargar las opciones de filtrado");
      }
    };
    
    fetchOptions();
  }, []);

  // Search for dispatches based on filters
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error("Debes seleccionar un rango de fechas");
      return;
    }
    
    setIsLoading(true);
    try {
      // Build the query
      let query = supabase
        .from("dispatches")
        .select(`
          id, 
          order_id,
          created_at,
          loading_company,
          destination,
          vehicle_plate,
          driver_id
        `)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", new Date(endDate.setHours(23, 59, 59)).toISOString());
      
      // Apply additional filters
      if (origin) {
        query = query.eq("loading_company", origin);
      }
      
      if (destination) {
        query = query.eq("destination", destination);
      }
      
      // Execute the query
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Format the data
      const formattedDispatches = data.map(item => ({
        id: item.id,
        orderId: item.order_id,
        date: new Date(item.created_at),
        origin: item.loading_company,
        destination: item.destination,
        vehiclePlate: item.vehicle_plate,
        driverName: null // Driver data would be handled in a separate query
      }));
      
      setDispatches(formattedDispatches);
      
    } catch (error) {
      console.error("Error searching dispatches:", error);
      toast.error("Error al buscar despachos");
    } finally {
      setIsLoading(false);
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
    dispatches,
    isLoading,
    origins,
    destinations,
    handleSearch
  };
}
