
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dispatch } from "@/lib/types/dispatch-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Package, Truck } from "lucide-react";

interface DispatchesListProps {
  searchTerm: string;
}

const DispatchesList = ({ searchTerm }: DispatchesListProps) => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        
        // Transformar datos para ajustarse a la interfaz
        const formattedDispatches = data.map(d => ({
          id: d.id,
          orderId: d.order_id,
          driverId: d.driver_id || '',
          vehiclePlate: d.vehicle_plate || '',
          loadingCompany: d.loading_company || '',
          destination: d.destination,
          zone: d.zone || '',
          farm: d.farm,
          farmId: d.farm_id || '',
          packages: d.packages,
          concentrateAmount: d.concentrate_amount,
          status: d.status as Dispatch['status'],
          acceptedAt: d.accepted_at ? new Date(d.accepted_at) : null,
          completedAt: d.completed_at ? new Date(d.completed_at) : null,
          eta: d.eta ? new Date(d.eta) : null,
          receiptImageUrl: d.receipt_image_url,
          createdAt: new Date(d.created_at)
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
  
  // Filtrar despachos según término de búsqueda
  const filteredDispatches = dispatches.filter(dispatch => 
    dispatch.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.farm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Generar badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="secondary">Aceptado</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">En progreso</Badge>;
      case 'delayed':
        return <Badge variant="destructive">Demorado</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <Truck className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Cargando despachos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (dispatches.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">No hay despachos</h3>
        <p className="text-muted-foreground">
          Aún no se han creado despachos en el sistema
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Orden</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Granja</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Paquetes</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDispatches.length > 0 ? (
            filteredDispatches.map(dispatch => (
              <TableRow key={dispatch.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{dispatch.orderId}</TableCell>
                <TableCell>{format(dispatch.createdAt, 'dd MMM yyyy', { locale: es })}</TableCell>
                <TableCell>{dispatch.loadingCompany}</TableCell>
                <TableCell>{dispatch.destination}</TableCell>
                <TableCell>{dispatch.farm}</TableCell>
                <TableCell>{dispatch.vehiclePlate || 'No asignado'}</TableCell>
                <TableCell>{dispatch.packages}</TableCell>
                <TableCell>{getStatusBadge(dispatch.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No se encontraron resultados para "{searchTerm}"
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DispatchesList;
