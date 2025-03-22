
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import UserSearchBar from './components/UserSearchBar';
import UsersTable from './components/UsersTable';
import UserFormDialog from './components/UserFormDialog';
import { useUsersList } from './hooks/useUsersList';

const UsersList = () => {
  const {
    users,
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
  } = useUsersList();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <UserSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Button 
          onClick={() => {
            setSelectedUser(null);
            setIsAddUserDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Administrar Usuario
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="relative overflow-x-auto">
          <UsersTable 
            users={users}
            isLoading={isLoading}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
          />
        </div>
      </div>

      <UserFormDialog 
        isOpen={isAddUserDialogOpen} 
        setIsOpen={setIsAddUserDialogOpen}
        selectedUser={selectedUser}
        handleSaveUser={handleSaveUser}
      />
    </div>
  );
};

export default UsersList;
