
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface VehicleSearchFieldProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const VehicleSearchField = ({ searchQuery, setSearchQuery }: VehicleSearchFieldProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Buscar por placa, marca, modelo o propietario..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default VehicleSearchField;
