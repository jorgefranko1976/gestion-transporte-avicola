
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NoDispatchesFound } from "./NoDispatchesFound";

interface Dispatch {
  id: string;
  orderId: string;
  date: Date;
  origin: string;
  destination: string;
  vehiclePlate: string | null;
  driverName: string | null;
}

const DispatchDateRangeReport = () => {
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

  // Cargar orígenes y destinos al montar el componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Obtener orígenes (empresas de cargue)
        const { data: originsData, error: originsError } = await supabase
          .from("dispatches")
          .select("loading_company")
          .order("loading_company");
          
        if (originsError) throw originsError;
        
        // Filtrar empresas únicas
        const uniqueOrigins = [...new Set(originsData.map(item => item.loading_company))];
        setOrigins(uniqueOrigins);
        
        // Obtener destinos
        const { data: destinationsData, error: destinationsError } = await supabase
          .from("dispatches")
          .select("destination")
          .order("destination");
          
        if (destinationsError) throw destinationsError;
        
        // Filtrar destinos únicos
        const uniqueDestinations = [...new Set(destinationsData.map(item => item.destination))];
        setDestinations(uniqueDestinations);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Error al cargar las opciones de filtrado");
      }
    };
    
    fetchOptions();
  }, []);

  // Buscar despachos según los filtros
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error("Debes seleccionar un rango de fechas");
      return;
    }
    
    setIsLoading(true);
    try {
      // Construir la consulta
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
      
      // Aplicar filtros adicionales
      if (origin) {
        query = query.eq("loading_company", origin);
      }
      
      if (destination) {
        query = query.eq("destination", destination);
      }
      
      // Ejecutar la consulta
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Formatear los datos
      const formattedDispatches = data.map(item => ({
        id: item.id,
        orderId: item.order_id,
        date: new Date(item.created_at),
        origin: item.loading_company,
        destination: item.destination,
        vehiclePlate: item.vehicle_plate,
        driverName: null // Los datos de conductores se manejarían en una consulta separada
      }));
      
      setDispatches(formattedDispatches);
      
    } catch (error) {
      console.error("Error searching dispatches:", error);
      toast.error("Error al buscar despachos");
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar a CSV
  const exportToCSV = () => {
    if (dispatches.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }
    
    // Crear contenido CSV
    const headers = [
      "Orden", 
      "Fecha", 
      "Origen", 
      "Destino", 
      "Placa", 
      "Conductor"
    ].join(",");
    
    const csvRows = dispatches.map(d => [
      d.orderId,
      format(d.date, "dd/MM/yyyy HH:mm", { locale: es }),
      d.origin,
      d.destination,
      d.vehiclePlate || "No asignado",
      d.driverName || "No asignado"
    ].join(","));
    
    const csvContent = [headers, ...csvRows].join("\n");
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `despachos_${format(new Date(), "dd-MM-yyyy")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-2">Informe de Despachos por Rango de Fechas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Origen</label>
          <Select value={origin} onValueChange={setOrigin}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los orígenes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los orígenes</SelectItem>
              {origins.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Destino</label>
          <Select value={destination} onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los destinos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos los destinos</SelectItem>
              {destinations.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex space-x-4">
        <Button onClick={handleSearch} disabled={!startDate || !endDate || isLoading}>
          {isLoading ? "Buscando..." : "Buscar Despachos"}
        </Button>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={exportToCSV}
          disabled={dispatches.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {dispatches.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Placa</TableHead>
                <TableHead>Conductor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dispatches.map((dispatch) => (
                <TableRow key={dispatch.id}>
                  <TableCell className="font-medium">{dispatch.orderId}</TableCell>
                  <TableCell>
                    {format(dispatch.date, "dd MMM yyyy, HH:mm", { locale: es })}
                  </TableCell>
                  <TableCell>{dispatch.origin}</TableCell>
                  <TableCell>{dispatch.destination}</TableCell>
                  <TableCell>{dispatch.vehiclePlate || "No asignado"}</TableCell>
                  <TableCell>{dispatch.driverName || "No asignado"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando despachos...</p>
        </div>
      ) : (
        <NoDispatchesFound />
      )}
    </div>
  );
};

export default DispatchDateRangeReport;
