
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverList from '@/components/drivers/DriverList';
import DriverForm from '@/components/drivers/DriverForm';

interface DriversTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onRegisterClick: () => void;
}

const DriversTabs = ({ activeTab, setActiveTab, onRegisterClick }: DriversTabsProps) => {
  return (
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
          <DriverList onRegisterClick={onRegisterClick} />
        </TabsContent>
        
        <TabsContent value="nuevo" className="p-6">
          <DriverForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriversTabs;
