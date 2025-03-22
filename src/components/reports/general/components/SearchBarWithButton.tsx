
import { Button } from '@/components/ui/button';
import { SearchExportBar } from './SearchExportBar';

interface SearchBarWithButtonProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  hasData: boolean;
  isLoading: boolean;
  onExport: () => void;
  onSearch: () => void;
}

const SearchBarWithButton = ({
  searchTerm,
  setSearchTerm,
  hasData,
  isLoading,
  onExport,
  onSearch
}: SearchBarWithButtonProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Button 
        onClick={onSearch} 
        className="w-full md:w-auto"
        disabled={isLoading}
      >
        {isLoading ? 'Buscando...' : 'Buscar Despachos'}
      </Button>
      
      <div className="flex-grow">
        <SearchExportBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
          hasData={hasData}
          onExport={onExport}
        />
      </div>
    </div>
  );
};

export default SearchBarWithButton;
