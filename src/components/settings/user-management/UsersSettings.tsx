
import React from 'react';
import { Users } from 'lucide-react';
import UsersList from './UsersList';

const UsersSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Gestión de Usuarios y Perfiles</h2>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema y sus permisos de acceso
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="col-span-1 md:col-span-4">
            <div className="rounded-md border p-4 md:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Usuarios del Sistema</h3>
              </div>
              <UsersList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSettings;
