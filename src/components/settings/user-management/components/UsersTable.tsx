
import React from 'react';
import { UserProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { getRoleBadgeColor, getRoleDisplayName } from '../utils/roleUtils';

interface UsersTableProps {
  users: UserProfile[];
  isLoading: boolean;
  handleEditUser: (user: UserProfile) => void;
  handleDeleteUser: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  isLoading, 
  handleEditUser, 
  handleDeleteUser 
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Cargando usuarios...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <tr className="bg-card border-b">
        <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
          No se encontraron usuarios que coincidan con la búsqueda
        </td>
      </tr>
    );
  }

  return (
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
        <tr>
          <th scope="col" className="px-6 py-3">Nombre</th>
          <th scope="col" className="px-6 py-3">Email</th>
          <th scope="col" className="px-6 py-3">Identificación</th>
          <th scope="col" className="px-6 py-3">Teléfono</th>
          <th scope="col" className="px-6 py-3">Rol</th>
          <th scope="col" className="px-6 py-3">Estado</th>
          <th scope="col" className="px-6 py-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="bg-card border-b hover:bg-muted/50">
            <td className="px-6 py-4 font-medium">
              {user.firstName} {user.lastName}
            </td>
            <td className="px-6 py-4">{user.email}</td>
            <td className="px-6 py-4">{user.identificationType} {user.identificationNumber}</td>
            <td className="px-6 py-4">{user.phone}</td>
            <td className="px-6 py-4">
              <Badge className={`${getRoleBadgeColor(user.role)} hover:${getRoleBadgeColor(user.role)}`}>
                {getRoleDisplayName(user.role)}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <Badge variant={user.active ? "default" : "destructive"}>
                {user.active ? "Activo" : "Inactivo"}
              </Badge>
            </td>
            <td className="px-6 py-4 text-right space-x-2">
              <Button size="sm" variant="ghost" onClick={() => handleEditUser(user)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteUser(user.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersTable;
