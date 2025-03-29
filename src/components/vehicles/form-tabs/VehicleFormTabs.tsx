
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, User } from "lucide-react";

interface VehicleFormTabsProps {
  activeTab: "info" | "documents" | "owner";
  onTabChange: (value: "info" | "documents" | "owner") => void;
  children: React.ReactNode;
}

const VehicleFormTabs = ({ activeTab, onTabChange, children }: VehicleFormTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as any)} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="info" className="flex items-center gap-2">
          <Car className="w-4 h-4" />
          <span>Información Básica</span>
        </TabsTrigger>
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Documentos</span>
        </TabsTrigger>
        <TabsTrigger value="owner" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Propietario</span>
        </TabsTrigger>
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default VehicleFormTabs;
