
import { NoDispatchesFound } from './general/NoDispatchesFound';
import { DateRangeFilters } from './general/components/DateRangeFilters';
import { LocationFilters } from './general/components/LocationFilters';
import { DispatchesTable } from './general/components/DispatchesTable';
import { DispatchesLoading } from './general/components/DispatchesLoading';
import SearchBarWithButton from './general/components/SearchBarWithButton';
import { useDispatchReport } from './general/hooks/useDispatchReport';

const DispatchReportsTab = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    origin,
    setOrigin,
    destination,
    setDestination,
    searchTerm,
    setSearchTerm,
    dispatches,
    filteredDispatches,
    isLoading,
    origins,
    destinations,
    handleSearch,
    exportToCSV
  } = useDispatchReport();

  const renderContent = () => {
    if (dispatches.length > 0) {
      return <DispatchesTable dispatches={filteredDispatches} />;
    }
    
    if (isLoading) {
      return <DispatchesLoading />;
    }
    
    return <NoDispatchesFound />;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Despachos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <DateRangeFilters
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        
        <LocationFilters
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          origins={origins}
          destinations={destinations}
        />
      </div>
      
      <SearchBarWithButton
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        hasData={dispatches.length > 0}
        isLoading={isLoading}
        onExport={exportToCSV}
        onSearch={handleSearch}
      />
      
      {renderContent()}
    </div>
  );
};

export default DispatchReportsTab;
