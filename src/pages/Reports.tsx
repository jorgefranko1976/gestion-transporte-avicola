
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DispatchReportsTab from '@/components/reports/DispatchReportsTab';
import FileReportsTab from '@/components/reports/FileReportsTab';
import VehicleReportsTab from '@/components/reports/VehicleReportsTab';
import DriverReportsTab from '@/components/reports/DriverReportsTab';
import StatusReportsTab from '@/components/reports/StatusReportsTab';
import ReceiptReportsTab from '@/components/reports/ReceiptReportsTab';
import { BarChart3, Users, FileText, Truck, ClipboardCheck, Receipt } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dispatches");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Informes y Reportes</h1>
                <p className="text-muted-foreground mt-1">
                  Consulta, filtra y exporta reportes del sistema
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="overflow-x-auto">
                  <TabsList className="w-full border-b border-border rounded-none bg-card h-auto p-0 flex-nowrap min-w-max">
                    <TabsTrigger 
                      value="dispatches" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Despachos</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="files" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Archivos Subidos</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vehicles" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Vehículos</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="drivers" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Conductores</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="status" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>Estado</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="receipts" 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12 px-6 flex items-center gap-2"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>Remisiones</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="dispatches" className="p-6">
                  <DispatchReportsTab />
                </TabsContent>
                
                <TabsContent value="files" className="p-6">
                  <FileReportsTab />
                </TabsContent>
                
                <TabsContent value="vehicles" className="p-6">
                  <VehicleReportsTab />
                </TabsContent>
                
                <TabsContent value="drivers" className="p-6">
                  <DriverReportsTab />
                </TabsContent>
                
                <TabsContent value="status" className="p-6">
                  <StatusReportsTab />
                </TabsContent>
                
                <TabsContent value="receipts" className="p-6">
                  <ReceiptReportsTab />
                </TabsContent>
              </Tabs>
            </div>
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

export default Reports;
