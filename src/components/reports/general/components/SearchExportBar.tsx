
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchExportBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
  hasData: boolean;
  onExport: () => void;
}

export const SearchExportBar = ({ 
  searchTerm, 
  setSearchTerm, 
  isLoading, 
  hasData, 
  onExport 
}: SearchExportBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filtrar resultados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full"
          disabled={!hasData}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full md:w-auto flex items-center gap-2"
        onClick={onExport}
        disabled={!hasData}
      >
        <Download className="w-4 h-4" />
        <span>Exportar CSV</span>
      </Button>
    </div>
  );
};
