
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileReport, FileReportState } from '../types';
import { useAuth } from '@/context/AuthContext';

export const useFileReports = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [state, setState] = useState<FileReportState>({
    files: [],
    filteredFiles: [],
    isLoading: false,
    error: null
  });

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = state.files.filter(f => 
        f.name.toLowerCase().includes(lowercaseSearch) || 
        f.type.toLowerCase().includes(lowercaseSearch) ||
        f.uploadedBy.toLowerCase().includes(lowercaseSearch)
      );
      setState(prev => ({ ...prev, filteredFiles: filtered }));
    } else {
      setState(prev => ({ ...prev, filteredFiles: prev.files }));
    }
  }, [searchTerm, state.files]);

  // Buscar archivos
  const handleSearch = useCallback(async () => {
    if (!startDate || !endDate) {
      toast.error('Debes seleccionar un rango de fechas');
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Modified query - we need to get each part separately to avoid the join error
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .gte('uploaded_at', startDate.toISOString())
        .lte('uploaded_at', new Date(endDate.setHours(23, 59, 59)).toISOString())
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      // Process files and fetch user profiles separately when needed
      const formattedFiles = await Promise.all(data.map(async (file) => {
        let userName = 'Sistema';
        
        // If there's an uploaded_by ID, try to fetch the user profile
        if (file.uploaded_by) {
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .select('first_name, last_name')
            .eq('id', file.uploaded_by)
            .single();
            
          if (!profileError && profileData) {
            userName = `${profileData.first_name} ${profileData.last_name}`;
          }
        }
          
        return {
          id: file.id,
          name: file.name,
          type: file.type,
          uploadedAt: new Date(file.uploaded_at),
          uploadedBy: userName,
          uploadedById: file.uploaded_by,
          records: file.records,
          status: file.status,
          reproCount: file.repro_count,
          engordeCount: file.engorde_count
        };
      }));
      
      setState({
        files: formattedFiles,
        filteredFiles: formattedFiles,
        isLoading: false,
        error: null
      });
      
      toast.success(`Se encontraron ${formattedFiles.length} archivos`);
      
    } catch (error: any) {
      console.error('Error fetching files:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al buscar archivos' 
      }));
      toast.error('Error al buscar archivos', {
        description: error.message
      });
    }
  }, [startDate, endDate]);

  // Exportar a CSV
  const exportToCSV = useCallback(() => {
    if (state.filteredFiles.length === 0) {
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
    
    const csvRows = state.filteredFiles.map(f => [
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
    
    toast.success(`${state.filteredFiles.length} registros exportados a CSV`);
  }, [state.filteredFiles]);

  // Cargar automáticamente al iniciar
  useEffect(() => {
    if (startDate && endDate) {
      handleSearch();
    }
  }, []);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchTerm,
    setSearchTerm,
    files: state.files,
    filteredFiles: state.filteredFiles,
    isLoading: state.isLoading,
    error: state.error,
    handleSearch,
    exportToCSV
  };
};
