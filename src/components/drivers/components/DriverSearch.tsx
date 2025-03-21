
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DriverSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const DriverSearch = ({ searchTerm, setSearchTerm }: DriverSearchProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar conductor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-9 w-[240px]"
      />
    </div>
  );
};
