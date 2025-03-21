
import { Button } from "@/components/ui/button";

interface VehicleListHeaderProps {
  onRegisterClick: () => void;
}

const VehicleListHeader = ({ onRegisterClick }: VehicleListHeaderProps) => {
  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Vehículos registrados</h3>
        <Button onClick={onRegisterClick}>Registrar Nuevo Vehículo</Button>
      </div>
    </div>
  );
};

export default VehicleListHeader;
