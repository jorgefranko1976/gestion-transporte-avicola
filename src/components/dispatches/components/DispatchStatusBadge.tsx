
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";

interface DispatchStatusBadgeProps {
  status: string;
}

export const DispatchStatusBadge = ({ status }: DispatchStatusBadgeProps) => {
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
