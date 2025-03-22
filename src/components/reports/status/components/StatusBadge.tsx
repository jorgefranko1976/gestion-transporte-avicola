
interface StatusBadgeProps {
  status: string;
  isDelayed: boolean;
}

export const StatusBadge = ({ status, isDelayed }: StatusBadgeProps) => {
  let badgeClass = '';
  let label = '';
  
  if (status === 'cancelled') {
    badgeClass = 'bg-red-100 text-red-800';
    label = 'Cancelado';
  } else if (status === 'completed') {
    badgeClass = 'bg-green-100 text-green-800';
    label = 'Completado';
  } else if (isDelayed) {
    badgeClass = 'bg-orange-100 text-orange-800';
    label = 'Demorado';
  } else if (status === 'accepted' || status === 'in_progress') {
    badgeClass = 'bg-blue-100 text-blue-800';
    label = 'En Ruta';
  } else {
    badgeClass = 'bg-yellow-100 text-yellow-800';
    label = status;
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
      {label}
    </span>
  );
};
