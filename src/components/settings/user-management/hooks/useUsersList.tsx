
import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUsersList = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          const formattedUsers: UserProfile[] = data.map(user => ({
            id: user.id,
            email: '', // Set default empty email since it's not in the DB response
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
            identificationType: user.identification_type,
            identificationNumber: user.identification_number,
            phone: user.phone || '',
            active: user.active,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast.error('Error al cargar la lista de usuarios');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    user.identificationNumber.includes(searchTerm)
  );

  const handleSaveUser = async (userData: UserProfile) => {
    try {
      if (selectedUser) {
        // Actualizar usuario existente
        const { error } = await supabase
          .from('user_profiles')
          .update({
            first_name: userData.firstName,
            last_name: userData.lastName,
            identification_type: userData.identificationType,
            identification_number: userData.identificationNumber,
            phone: userData.phone,
            role: userData.role,
            active: userData.active,
            updated_at: new Date().toISOString()
          })
          .eq('id', userData.id);
          
        if (error) throw error;
        
        toast.success('Usuario actualizado correctamente');
        setUsers(users.map(user => user.id === userData.id ? userData : user));
      } else {
        // Aquí solo mostramos un mensaje informativo, ya que la creación real de usuarios
        // se hace a través del registro en la página de login
        toast.info('Para crear nuevos usuarios, utilice la función de registro');
      }
      
      setIsAddUserDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Error al guardar los datos del usuario');
    }
  };

  const handleDeleteUser = (userId: string) => {
    // No implementamos eliminación real por seguridad
    if (confirm('¿Está seguro de deshabilitar este usuario?')) {
      // Marcar como inactivo en lugar de eliminar
      supabase
        .from('user_profiles')
        .update({ active: false })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) {
            toast.error('Error al deshabilitar usuario');
            return;
          }
          setUsers(users.map(user => 
            user.id === userId ? { ...user, active: false } : user
          ));
          toast.success('Usuario deshabilitado correctamente');
        });
    }
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsAddUserDialogOpen(true);
  };

  return {
    users: filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    selectedUser,
    setSelectedUser,
    handleSaveUser,
    handleDeleteUser,
    handleEditUser
  };
};
