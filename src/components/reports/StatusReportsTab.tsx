
import { StatusFilters } from './status/components/StatusFilters';
import { SearchAndExport } from './status/components/SearchAndExport';
import { StatusTable } from './status/components/StatusTable';
import { NoDispatchesFound } from './status/components/NoDispatchesFound';
import { useStatusReport } from './status/hooks/useStatusReport';

const StatusReportsTab = () => {
  const {
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    dispatches,
    filteredDispatches,
    isLoading,
    handleSearch,
    handleExport
  } = useStatusReport();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Estado de Despachos</h2>
      
      <StatusFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <SearchAndExport 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        isLoading={isLoading}
        dispatchesCount={dispatches.length}
        onExport={handleExport}
      />
      
      {/* Results table */}
      {dispatches.length > 0 ? (
        <StatusTable dispatches={filteredDispatches} />
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando despachos...</p>
        </div>
      ) : (
        <NoDispatchesFound />
      )}
    </div>
  );
};

export default StatusReportsTab;
