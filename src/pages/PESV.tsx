
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PreOperationalForm from '@/components/pesv/PreOperationalForm';
import InspectionsList from '@/components/pesv/inspections/InspectionsList';
import { PortalLayout } from '@/components/layout/PortalLayout';

const PESV = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  return (
    <PortalLayout 
      title="Plan Estratégico de Seguridad Vial" 
      description="Gestión de inspecciones vehiculares y chequeos preoperacionales"
    >
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b border-border rounded-none bg-card h-auto p-0">
            <TabsTrigger 
              value="lista" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Inspecciones Realizadas
            </TabsTrigger>
            <TabsTrigger 
              value="nuevo" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6"
            >
              Nueva Inspección
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lista" className="p-6">
            <InspectionsList />
          </TabsContent>
          
          <TabsContent value="nuevo" className="p-6">
            <PreOperationalForm />
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
};

export default PESV;
