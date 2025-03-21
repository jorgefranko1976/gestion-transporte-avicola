
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverList from '@/components/drivers/DriverList';
import DriverForm from '@/components/drivers/DriverForm';

const Drivers = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  const handleRegisterClick = () => {
    setActiveTab("nuevo");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Gestión de Conductores</h1>
                <p className="text-muted-foreground mt-1">
                  Administra la información y documentación de los conductores
                </p>
              </div>
            </div>
            
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
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default Drivers;
