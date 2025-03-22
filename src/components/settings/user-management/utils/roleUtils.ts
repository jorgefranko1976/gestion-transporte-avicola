
export const getRoleBadgeColor = (role: string) => {
  switch(role) {
    case 'admin': return 'bg-red-500';
    case 'coordinator': return 'bg-blue-500';
    case 'driver': return 'bg-green-500';
    case 'owner': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

export const getRoleDisplayName = (role: string) => {
  switch(role) {
    case 'admin': return 'Administrador';
    case 'coordinator': return 'Coordinador';
    case 'driver': return 'Conductor';
    case 'owner': return 'Propietario';
    default: return role;
  }
};
