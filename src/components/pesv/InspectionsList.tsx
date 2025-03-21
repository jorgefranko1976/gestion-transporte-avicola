
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, XCircle, Search, Calendar, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface Inspection {
  id: string;
  vehiclePlate: string;
  driverName: string;
  date: Date;
  tiresOk: boolean;
  lightsOk: boolean;
  brakesOk: boolean;
  mirrorsOk: boolean;
  oilOk: boolean;
  waterOk: boolean;
  kitOk: boolean;
  observations: string | null;
  tirePhotoUrl: string | null;
  kitPhotoUrl: string | null;
}

const InspectionsList = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

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

  // Mostrar detalles de la inspección
  const handleViewDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por vehículo o conductor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[240px]"
            />
          </div>
          
          <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Cargando inspecciones...</p>
        </div>
      ) : filteredInspections.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron inspecciones</p>
          <p className="text-sm text-muted-foreground mt-1">
            Intenta cambiar los filtros o crear una nueva inspección
          </p>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium">Vehículo</th>
                  <th className="px-4 py-3 text-left font-medium">Conductor</th>
                  <th className="px-4 py-3 text-left font-medium">Estado General</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredInspections.map((inspection) => {
                  // Calcular estado general
                  const checks = [
                    inspection.tiresOk,
                    inspection.lightsOk,
                    inspection.brakesOk,
                    inspection.mirrorsOk,
                    inspection.oilOk,
                    inspection.waterOk,
                    inspection.kitOk
                  ];
                  const totalChecks = checks.length;
                  const passedChecks = checks.filter(Boolean).length;
                  const isPassing = passedChecks === totalChecks;
                  
                  return (
                    <tr key={inspection.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{format(inspection.date, "dd MMM yyyy, HH:mm", { locale: es })}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{inspection.vehiclePlate}</td>
                      <td className="px-4 py-3">{inspection.driverName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isPassing ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                              <span className="text-green-600 font-medium">Aprobado</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">
                                {passedChecks}/{totalChecks} puntos
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(inspection)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Diálogo de detalles */}
      {selectedInspection && (
        <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Detalles de Inspección</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Inspección</h3>
                  <p className="font-medium">
                    {format(selectedInspection.date, "PPP 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Vehículo</h3>
                  <p className="font-medium">{selectedInspection.vehiclePlate}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Conductor</h3>
                  <p className="font-medium">{selectedInspection.driverName}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Observaciones</h3>
                  <p className="font-medium whitespace-pre-line">
                    {selectedInspection.observations || 'Sin observaciones'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Checklist de Seguridad</h3>
                  <ul className="space-y-2">
                    <CheckItem
                      label="Llantas en buen estado"
                      checked={selectedInspection.tiresOk}
                    />
                    <CheckItem
                      label="Luces funcionando correctamente"
                      checked={selectedInspection.lightsOk}
                    />
                    <CheckItem
                      label="Sistema de frenos operativo"
                      checked={selectedInspection.brakesOk}
                    />
                    <CheckItem
                      label="Espejos completos y en buen estado"
                      checked={selectedInspection.mirrorsOk}
                    />
                    <CheckItem
                      label="Nivel de aceite correcto"
                      checked={selectedInspection.oilOk}
                    />
                    <CheckItem
                      label="Nivel de agua/refrigerante adecuado"
                      checked={selectedInspection.waterOk}
                    />
                    <CheckItem
                      label="Kit de carretera completo"
                      checked={selectedInspection.kitOk}
                    />
                  </ul>
                </div>
                
                {/* Fotos */}
                {(selectedInspection.tirePhotoUrl || selectedInspection.kitPhotoUrl) && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">Evidencias Fotográficas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedInspection.tirePhotoUrl && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Llantas</p>
                          <img 
                            src={selectedInspection.tirePhotoUrl} 
                            alt="Llantas" 
                            className="rounded-md w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      
                      {selectedInspection.kitPhotoUrl && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Kit de Carretera</p>
                          <img 
                            src={selectedInspection.kitPhotoUrl} 
                            alt="Kit de Carretera" 
                            className="rounded-md w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button>Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Componente para el ítem de verificación
const CheckItem = ({ label, checked }: { label: string; checked: boolean }) => (
  <li className="flex items-center gap-2">
    {checked ? (
      <CheckCircle2 className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    )}
    <span className={checked ? "text-green-600" : "text-red-600"}>
      {label}
    </span>
  </li>
);

export default InspectionsList;
