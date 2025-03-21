
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverList from '@/components/drivers/DriverList';
import DriverForm from '@/components/drivers/DriverForm';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { PortalLayout } from '@/components/layout/PortalLayout';

const Drivers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  const handleRegisterClick = () => {
    setActiveTab("nuevo");
  };

  const headerRightContent = activeTab === "lista" && (
    <Button onClick={handleRegisterClick} className="flex items-center gap-2">
      <UserPlus className="w-4 h-4" />
      <span>Registrar Conductor</span>
    </Button>
  );

  return (
    <PortalLayout 
      title="Gestión de Conductores" 
      description="Administra la información y documentación de los conductores"
      rightContent={headerRightContent}
    >
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b border-border rounded-none bg-card h-auto p-0">
            <TabsTrigger 
              value="lista" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Lista de Conductores
            </TabsTrigger>
            <TabsTrigger 
              value="nuevo" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Nuevo Conductor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista" className="p-6">
            <DriverList onRegisterClick={handleRegisterClick} />
          </TabsContent>
          
          <TabsContent value="nuevo" className="p-6">
            <DriverForm />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default Drivers;
