
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DispatchesContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const DispatchesContent = ({ 
  searchTerm, 
  setSearchTerm 
}: DispatchesContentProps) => {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">Gestión de Despachos</h2>
          <p className="text-sm text-muted-foreground">
            Monitoreo y control de despachos en tiempo real
          </p>
        </div>
        
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
        </div>
      </div>
    </div>
  );
};

export default DispatchesContent;
