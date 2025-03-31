
import { FileReportDateFilters } from './files/components/FileReportDateFilters';
import { FileSearchExport } from './files/components/FileSearchExport';
import { FilesTable } from './files/components/FilesTable';
import { FilesLoading } from './files/components/FilesLoading';
import { NoFilesFound } from './files/components/NoFilesFound';
import { useFileReports } from './files/hooks/useFileReports';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
    error,
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
      
      {/* Mostrar error si existe */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Contenido principal */}
      {isLoading ? (
        <FilesLoading />
      ) : files.length > 0 ? (
        <FilesTable files={filteredFiles} />
      ) : (
        <NoFilesFound />
      )}
    </div>
  );
};

export default FileReportsTab;
