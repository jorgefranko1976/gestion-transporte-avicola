
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Search, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FileReport {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  records: number | null;
  status: string;
}

const FileReportsTab = () => {
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
        .from('uploaded_files')
        .select('*')
        .gte('uploaded_at', startDate.toISOString())
        .lte('uploaded_at', new Date(endDate.setHours(23, 59, 59)).toISOString())
        .order('uploaded_at', { ascending: false });
        
      if (error) throw error;
      
      const formattedFiles = data.map(file => ({
        id: file.id,
        name: file.name || 'Sin nombre',
        type: file.type || 'Desconocido',
        uploadedAt: new Date(file.uploaded_at),
        uploadedBy: file.uploaded_by || 'Usuario desconocido',
        records: file.records,
        status: file.status || 'unknown'
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
        (f.name && f.name.toLowerCase().includes(lowercaseSearch)) || 
        (f.type && f.type.toLowerCase().includes(lowercaseSearch)) ||
        (f.uploadedBy && f.uploadedBy.toLowerCase().includes(lowercaseSearch))
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
      'Estado'
    ].join(',');
    
    const csvRows = filteredFiles.map(f => [
      f.name,
      f.type,
      format(f.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: es }),
      f.uploadedBy,
      f.records || 0,
      f.status
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Archivos Subidos al Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Inicio</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha Fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
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
            disabled={files.length === 0}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2"
          onClick={exportToCSV}
          disabled={filteredFiles.length === 0}
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV</span>
        </Button>
      </div>
      
      {/* Tabla de resultados */}
      {files.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha de Subida</th>
                  <th className="px-4 py-3 text-left font-medium">Subido Por</th>
                  <th className="px-4 py-3 text-left font-medium">Registros</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{file.name}</td>
                    <td className="px-4 py-3">{file.type}</td>
                    <td className="px-4 py-3">
                      {format(file.uploadedAt, "dd MMM yyyy, HH:mm", { locale: es })}
                    </td>
                    <td className="px-4 py-3">{file.uploadedBy}</td>
                    <td className="px-4 py-3">{file.records || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file.status === 'completed' 
                          ? "bg-green-100 text-green-800" 
                          : file.status === 'processing'
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {file.status === 'completed' ? 'Completado' : 
                         file.status === 'processing' ? 'Procesando' : 'Error'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : isLoading ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Buscando archivos...</p>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado archivos</p>
          <p className="text-sm text-muted-foreground">
            Intenta cambiar los criterios de búsqueda
          </p>
        </div>
      )}
    </div>
  );
};

export default FileReportsTab;
