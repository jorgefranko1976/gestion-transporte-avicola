import { FileReportDateFilters } from './files/components/FileReportDateFilters';
import { FileSearchExport } from './files/components/FileSearchExport';
import { FilesTable } from './files/components/FilesTable';
import { FilesLoading } from './files/components/FilesLoading';
import { NoFilesFound } from './files/components/NoFilesFound';
import { useFileReports } from './files/hooks/useFileReports';

const FileReportsTab = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchTerm,
    setSearchTerm,
    files,
    filteredFiles,
    isLoading,
    handleSearch,
    exportToCSV
  } = useFileReports();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Archivos Subidos</h2>
      
      <FileReportDateFilters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
      
      <FileSearchExport
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        exportToCSV={exportToCSV}
        isLoading={isLoading}
        startDate={startDate}
        endDate={endDate}
        filesCount={filteredFiles.length}
      />
      
      {/* Contenido principal */}
      {files.length > 0 ? (
        <FilesTable files={filteredFiles} />
      ) : isLoading ? (
        <FilesLoading />
      ) : (
        <NoFilesFound />
      )}
    </div>
  );
};

export default FileReportsTab;
