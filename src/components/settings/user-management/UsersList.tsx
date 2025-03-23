
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Plus, Search, Trash2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserForm from './UserForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        const mappedUsers: UserProfile[] = data.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email || '',
          role: user.role,
          identificationType: user.identification_type,
          identificationNumber: user.identification_number,
          phone: user.phone || '',
          active: user.active,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at)
        }));
        
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.identificationNumber.includes(searchTerm)
  );

  const handleSaveUser = async (userData: UserProfile) => {
    if (selectedUser) {
      // Actualizar usuario existente
      try {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            email: userData.email,
            role: userData.role,
            identification_type: userData.identificationType,
            identification_number: userData.identificationNumber,
            phone: userData.phone || null,
            active: userData.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);

        if (error) throw error;
        
        // Actualizar estado local
        setUsers(users.map(user => user.id === userData.id ? userData : user));
        toast.success('Usuario actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        toast.error('Error al actualizar el usuario');
      }
    }
    
    // Para nuevos usuarios, no es necesario hacer nada aquí porque ya se 
    // registraron a través del signUp en UserForm
    
    setIsAddUserDialogOpen(false);
    setSelectedUser(null);
    fetchUsers(); // Refrescar la lista para asegurar que tenemos los datos actualizados
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        // No eliminamos usuarios realmente, solo los marcamos como inactivos
        const { error } = await supabase
          .from('user_profiles')
          .update({ active: false })
          .eq('id', userId);

        if (error) throw error;
        
        // Actualizar estado local
        setUsers(users.map(user => 
          user.id === userId ? { ...user, active: false } : user
        ));
        
        toast.success('Usuario desactivado correctamente');
      } catch (error) {
        console.error('Error al desactivar usuario:', error);
        toast.error('Error al desactivar el usuario');
      }
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsAddUserDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando usuarios...</span>
      </div>
    );
  }

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
