
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
import { StatusBadge } from "@/components/ui/status-badge";

interface DispatchesListProps {
  searchTerm: string;
  excelData: any[]; // Agregar datos de Excel
}

const DispatchesList = ({ searchTerm, excelData }: DispatchesListProps) => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  
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
          source: 'database'
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
  
  // Combinar datos de Excel y de la base de datos
  useEffect(() => {
    // Convertir datos de Excel al formato adecuado
    const excelDispatches = excelData.map(item => ({
      id: item.id || `excel-${item.orden}`,
      orderId: item.orden,
      vehiclePlate: item.placa || '',
      driver: item.conductor || '',
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
    
    // Combinar ambas fuentes de datos
    const combined = [...dispatches, ...excelDispatches];
    
    // Eliminar duplicados basados en orderId
    const uniqueMap = new Map();
    combined.forEach(item => {
      // Si existe un registro de base de datos, priorizar ese sobre el de Excel
      if (!uniqueMap.has(item.orderId) || item.source === 'database') {
        uniqueMap.set(item.orderId, item);
      }
    });
    
    setCombinedData(Array.from(uniqueMap.values()));
  }, [dispatches, excelData]);
  
  // Filtrar despachos según término de búsqueda
  const filteredDispatches = combinedData.filter(dispatch => 
    dispatch.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.farm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.loadingCompany?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Generar badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'pendiente':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'accepted':
      case 'aceptado':
        return <Badge variant="secondary">Aceptado</Badge>;
      case 'in_progress':
      case 'en ruta':
      case 'en_ruta':
        return <Badge variant="secondary">En progreso</Badge>;
      case 'delayed':
      case 'demorado':
        return <Badge variant="destructive">Demorado</Badge>;
      case 'completed':
      case 'completado':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completado</Badge>;
      case 'cancelled':
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <StatusBadge status={status} />;
    }
  };
  
  const getDataSourceBadge = (source: string) => {
    return source === 'excel' 
      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Excel</Badge>
      : <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sistema</Badge>;
  };
  
  if (isLoading && excelData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <Truck className="w-12 h-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Cargando despachos...</p>
        </div>
      </div>
    );
  }
  
  if (error && excelData.length === 0) {
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
  
  if (combinedData.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-lg font-medium">No hay despachos</h3>
        <p className="text-muted-foreground">
          Aún no se han creado despachos en el sistema ni se han cargado datos de Excel
        </p>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Origen</TableHead>
            <TableHead>Orden</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Origen</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Granja</TableHead>
            <TableHead>Vehículo</TableHead>
            <TableHead>Conductor</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredDispatches.length > 0 ? (
            filteredDispatches.map(dispatch => (
              <TableRow key={dispatch.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>{getDataSourceBadge(dispatch.source)}</TableCell>
                <TableCell className="font-medium">{dispatch.orderId}</TableCell>
                <TableCell>
                  {dispatch.createdAt && format(new Date(dispatch.createdAt), 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell>{dispatch.loadingCompany}</TableCell>
                <TableCell>{dispatch.destination}</TableCell>
                <TableCell>{dispatch.farm}</TableCell>
                <TableCell>{dispatch.vehiclePlate || 'No asignado'}</TableCell>
                <TableCell>{dispatch.driver || dispatch.driverId || 'No asignado'}</TableCell>
                <TableCell>{dispatch.packages || dispatch.concentrateAmount || 0}</TableCell>
                <TableCell>{getStatusBadge(dispatch.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
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
