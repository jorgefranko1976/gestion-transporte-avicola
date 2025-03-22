
import React from 'react';
import { UserProfile } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import UserForm from '../UserForm';

interface UserFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedUser: UserProfile | null;
  handleSaveUser: (userData: UserProfile) => void;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({ 
  isOpen, 
  setIsOpen, 
  selectedUser, 
  handleSaveUser 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedUser ? 'Editar Usuario' : 'Información de Usuario'}</DialogTitle>
          <DialogDescription>
            {selectedUser 
              ? 'Modifique los datos del usuario según sea necesario.'
              : 'Para crear un nuevo usuario, utilice la función de registro en la página de inicio de sesión.'}
          </DialogDescription>
        </DialogHeader>
        <UserForm 
          onSave={handleSaveUser} 
          initialData={selectedUser || undefined} 
          onCancel={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserFormDialog;
