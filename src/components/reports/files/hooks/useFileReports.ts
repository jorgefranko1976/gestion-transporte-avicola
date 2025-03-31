
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileReport } from '../types';

export const useFileReports = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileReport[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar archivos
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Debes seleccionar un rango de fechas');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('excel_files')
        .select('*')
        .gte('uploaded_at', startDate.toISOString())
        .lte('uploaded_at', new Date(endDate.setHours(23, 59, 59)).toISOString())
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedFiles = data.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        uploadedAt: new Date(file.uploaded_at),
        uploadedBy: file.uploaded_by || 'Sistema',
        records: file.records,
        status: file.status,
        reproCount: file.repro_count,
        engordeCount: file.engorde_count
      }));
      
      setFiles(formattedFiles);
      setFilteredFiles(formattedFiles);
      
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Error al buscar archivos');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = files.filter(f => 
        f.name.toLowerCase().includes(lowercaseSearch) || 
        f.type.toLowerCase().includes(lowercaseSearch) ||
        f.uploadedBy.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(files);
    }
  }, [searchTerm, files]);

  // Exportar a CSV
  const exportToCSV = () => {
    if (filteredFiles.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }
    
    // Crear contenido CSV
    const headers = [
      'Nombre', 
      'Tipo', 
      'Fecha de Subida', 
      'Subido Por', 
      'Registros', 
      'Estado',
      'Registros REPRO',
      'Registros ENGORDE'
    ].join(',');
    
    const csvRows = filteredFiles.map(f => [
      f.name,
      f.type,
      format(f.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: es }),
      f.uploadedBy,
      f.records || 0,
      f.status,
      f.reproCount || 0,
      f.engordeCount || 0
    ].join(','));
    
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `archivos_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
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
  };
};
