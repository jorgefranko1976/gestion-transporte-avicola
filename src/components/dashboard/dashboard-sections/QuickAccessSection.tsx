
import { Truck, Users, ShieldAlert } from "lucide-react";
import { QuickNavCard } from "@/components/dashboard/quick-nav-card";
import { useNavigate } from "react-router-dom";

export const QuickAccessSection = () => {
  const navigate = useNavigate();
  
  const navigateToSection = (section: 'vehicles' | 'drivers' | 'pesv') => {
    navigate(`/${section}`);
  };
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Acceso Rápido</h3>
      <div className="grid grid-cols-1 gap-4">
        <QuickNavCard
          icon={<Truck className="w-5 h-5" />}
          title="Gestión de Vehículos"
          description="Administrar vehículos y mantenimientos"
          onClick={() => navigateToSection('vehicles')}
        />
        
        <QuickNavCard
          icon={<Users className="w-5 h-5" />}
          title="Gestión de Conductores"
          description="Administrar conductores y asignaciones"
          onClick={() => navigateToSection('drivers')}
        />
        
        <QuickNavCard
          icon={<ShieldAlert className="w-5 h-5" />}
          title="Plan de Seguridad Vial"
          description="Gestionar PESV y documentación"
          onClick={() => navigateToSection('pesv')}
        />
      </div>
    </div>
  );
};
