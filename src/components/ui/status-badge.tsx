
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendiente':
      return 'bg-slate-400 text-white';
    case 'en ruta':
      return 'bg-blue-500 text-white';
    case 'completado':
      return 'bg-green-500 text-white';
    case 'demorado':
      return 'bg-amber-500 text-white';
    case 'cancelado':
      return 'bg-red-500 text-white';
    case 'mantenimiento':
      return 'bg-orange-400 text-white';
    case 'disponible':
      return 'bg-emerald-500 text-white';
    case 'activo':
      return 'bg-emerald-500 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span className={cn(
    `${getStatusColor(status)} text-xs px-2 py-1 rounded-full font-medium`,
    className
  )}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;
