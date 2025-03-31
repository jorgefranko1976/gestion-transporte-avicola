
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileSearchExportProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => Promise<void>;
  exportToCSV: () => void;
  isLoading: boolean;
  startDate: Date | undefined;
  endDate: Date | undefined;
  filesCount: number;
}

export const FileSearchExport = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  exportToCSV,
  isLoading,
  startDate,
  endDate,
  filesCount
}: FileSearchExportProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Button 
        onClick={handleSearch} 
        className="w-full md:w-auto"
        disabled={!startDate || !endDate || isLoading}
      >
        {isLoading ? 'Buscando...' : 'Buscar Archivos'}
      </Button>
      
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filtrar resultados..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full"
          disabled={filesCount === 0}
        />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full md:w-auto flex items-center gap-2"
        onClick={exportToCSV}
        disabled={filesCount === 0}
      >
        <Download className="w-4 h-4" />
        <span>Exportar CSV</span>
      </Button>
    </div>
  );
};
