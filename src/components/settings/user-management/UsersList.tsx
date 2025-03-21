
import React, { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from './UserForm';

const mockUsers: UserProfile[] = [
  {
    id: '1',
    email: 'admin@transportapp.com',
    firstName: 'Admin',
    lastName: 'Principal',
    role: 'admin',
    identificationType: 'CC',
    identificationNumber: '123456789',
    phone: '3001234567',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'coordinador@transportapp.com',
    firstName: 'Coordinador',
    lastName: 'Despachos',
    role: 'coordinator',
    identificationType: 'CC',
    identificationNumber: '987654321',
    phone: '3007654321',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'conductor@transportapp.com',
    firstName: 'Juan',
    lastName: 'Conductor',
    role: 'driver',
    identificationType: 'CC',
    identificationNumber: '1122334455',
    phone: '3009876543',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    driverId: 'driver-123',
  },
  {
    id: '4',
    email: 'propietario@transportapp.com',
    firstName: 'Pedro',
    lastName: 'Propietario',
    role: 'owner',
    identificationType: 'CC',
    identificationNumber: '5544332211',
    phone: '3001234567',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ownedVehicleIds: ['vehicle-1', 'vehicle-2'],
  },
];

const getRoleBadgeColor = (role: string) => {
  switch(role) {
    case 'admin': return 'bg-red-500';
    case 'coordinator': return 'bg-blue-500';
    case 'driver': return 'bg-green-500';
    case 'owner': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

const getRoleDisplayName = (role: string) => {
  switch(role) {
    case 'admin': return 'Administrador';
    case 'coordinator': return 'Coordinador';
    case 'driver': return 'Conductor';
    case 'owner': return 'Propietario';
    default: return role;
  }
};

const UsersList = () => {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.identificationNumber.includes(searchTerm)
  );

  const handleSaveUser = (userData: UserProfile) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(user => user.id === userData.id ? userData : user));
    } else {
      // Add new user
      setUsers([...users, { ...userData, id: `user-${Date.now()}`, createdAt: new Date(), updatedAt: new Date() }]);
    }
    setIsAddUserDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsAddUserDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => {
            setSelectedUser(null);
            setIsAddUserDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
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
              {filteredUsers.length === 0 ? (
                <tr className="bg-card border-b">
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    No se encontraron usuarios que coincidan con la búsqueda
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</DialogTitle>
            <DialogDescription>
              {selectedUser 
                ? 'Modifique los datos del usuario según sea necesario.'
                : 'Complete el formulario para crear un nuevo usuario en el sistema.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            onSave={handleSaveUser} 
            initialData={selectedUser || undefined} 
            onCancel={() => setIsAddUserDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersList;
