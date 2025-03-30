
import { useState } from "react";
import { Filter, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DispatchesList from "./DispatchesList";
import DispatchForm from "./DispatchForm";

interface DispatchesContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const DispatchesContent = ({ 
  searchTerm, 
  setSearchTerm 
}: DispatchesContentProps) => {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Despachos</h2>
          <p className="text-sm text-muted-foreground">
            Monitoreo y control de despachos en tiempo real
          </p>
        </div>
        
        {activeTab === "list" ? (
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar despacho..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[240px]"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
            <Button onClick={() => setActiveTab("create")} className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setActiveTab("list")}>
            Volver a la lista
          </Button>
        )}
      </div>
      
      <div className="mt-6">
        {activeTab === "list" ? (
          <DispatchesList searchTerm={searchTerm} />
        ) : (
          <DispatchForm />
        )}
      </div>
    </div>
  );
};

export default DispatchesContent;
