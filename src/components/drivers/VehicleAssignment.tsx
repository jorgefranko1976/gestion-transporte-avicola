
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Truck, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface VehicleAssignmentProps {
  selectedVehicleId: string | null;
  setSelectedVehicleId: (id: string | null) => void;
}

interface SimpleVehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  line: string;
  color: string;
  vehicleType: string;
  active: boolean;
  status: string;
}

const VehicleAssignment = ({ selectedVehicleId, setSelectedVehicleId }: VehicleAssignmentProps) => {
  const [vehicles, setVehicles] = useState<SimpleVehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<SimpleVehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<SimpleVehicle | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('active', true)
          .eq('status', 'available');

        if (error) {
          throw error;
        }

        const formattedVehicles = data.map(v => ({
          id: v.id,
          plate: v.plate,
          brand: v.brand,
          model: v.model,
          line: v.line,
          color: v.color,
          vehicleType: v.vehicle_type,
          active: v.active,
          status: v.status
        }));

        setVehicles(formattedVehicles);
        setFilteredVehicles(formattedVehicles);

        // Si hay un vehículo seleccionado, obtener sus datos
        if (selectedVehicleId) {
          const selectedVehicle = formattedVehicles.find(v => v.id === selectedVehicleId);
          if (selectedVehicle) {
            setSelected(selectedVehicle);
          }
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Error al cargar vehículos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [selectedVehicleId]);

  // Filtrar vehículos
  useEffect(() => {
    const filtered = vehicles.filter(
      v => v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
           v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
           v.line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm]);

  const handleVehicleSelect = (vehicle: SimpleVehicle) => {
    setSelected(vehicle);
    setSelectedVehicleId(vehicle.id);
  };

  const handleClearSelection = () => {
    setSelected(null);
    setSelectedVehicleId(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Asignación de Vehículo</h3>
      
      {selected ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-medium">{selected.plate}</p>
                <p className="text-sm text-muted-foreground">
                  {selected.brand} {selected.line} {selected.model}
                </p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={handleClearSelection}
            >
              Cambiar vehículo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
            <div>
              <p className="text-sm text-muted-foreground">Marca</p>
              <p className="font-medium">{selected.brand}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="font-medium">{selected.model}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Línea</p>
              <p className="font-medium">{selected.line}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{selected.color}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tipo</p>
              <p className="font-medium">{selected.vehicleType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <p className="font-medium">Disponible</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vehículo por placa, marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando vehículos...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No se encontraron vehículos disponibles</p>
              <p className="text-sm text-muted-foreground mt-1">
                Todos los vehículos están asignados o no están disponibles
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Placa</th>
                      <th className="px-4 py-3 text-left font-medium">Marca</th>
                      <th className="px-4 py-3 text-left font-medium">Modelo</th>
                      <th className="px-4 py-3 text-left font-medium">Línea</th>
                      <th className="px-4 py-3 text-left font-medium">Tipo</th>
                      <th className="px-4 py-3 text-right font-medium">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredVehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{vehicle.plate}</td>
                        <td className="px-4 py-3">{vehicle.brand}</td>
                        <td className="px-4 py-3">{vehicle.model}</td>
                        <td className="px-4 py-3">{vehicle.line}</td>
                        <td className="px-4 py-3">{vehicle.vehicleType}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVehicleSelect(vehicle)}
                          >
                            Asignar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VehicleAssignment;
