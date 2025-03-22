
import { useState, useEffect } from 'react';
import { useInspections } from './hooks/useInspections';
import InspectionFilters from './components/InspectionFilters';
import InspectionsTable from './components/InspectionsTable';
import InspectionDetailsDialog from './components/InspectionDetailsDialog';
import { Inspection } from './types/inspection-types';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';

const InspectionsList = () => {
  const { 
    inspections, 
    filteredInspections, 
    isLoading, 
    searchTerm, 
    setSearchTerm, 
    dateFilter, 
    setDateFilter 
  } = useInspections();
  
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

  return (
    <div>
      <InspectionFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />
      
      {isLoading ? (
        <LoadingState />
      ) : filteredInspections.length === 0 ? (
        <EmptyState />
      ) : (
        <InspectionsTable 
          inspections={filteredInspections}
          onViewDetails={setSelectedInspection}
        />
      )}

      {selectedInspection && (
        <InspectionDetailsDialog
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}
    </div>
  );
};

export default InspectionsList;
