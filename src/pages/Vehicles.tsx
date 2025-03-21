
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VehiclesList from '@/components/vehicles/VehiclesList';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { PortalLayout } from '@/components/layout/PortalLayout';

const Vehicles = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  const handleRegisterClick = () => {
    setActiveTab("nuevo");
  };

  return (
    <PortalLayout 
      title="Gestión de Vehículos" 
      description="Administra la información y documentación de los vehículos"
    >
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b border-border rounded-none bg-card h-auto p-0">
            <TabsTrigger 
              value="lista" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Lista de Vehículos
            </TabsTrigger>
            <TabsTrigger 
              value="nuevo" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Nuevo Vehículo
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista" className="p-6">
            <VehiclesList onRegisterClick={handleRegisterClick} />
          </TabsContent>
          
          <TabsContent value="nuevo" className="p-6">
            <VehicleForm />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default Vehicles;
