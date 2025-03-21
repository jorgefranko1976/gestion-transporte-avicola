
import { useState, useEffect } from 'react';
import { Search, Download, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { UploadedFile } from '@/lib/types/file-types';

const FileReportsTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar archivos al iniciar
  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('uploaded_files')
          .select('*')
          .order('uploaded_at', { ascending: false });
          
        if (error) throw error;
        
        // Formatear los datos
        const formattedFiles = data.map(file => ({
          id: file.id,
          name: file.name,
          uploadedAt: new Date(file.uploaded_at),
          uploadedBy: file.uploaded_by,
          type: file.type,
          status: file.status,
          records: file.records,
          previewUrl: file.preview_url
        }));
        
        setFiles(formattedFiles);
        setFilteredFiles(formattedFiles);
        
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Error al cargar los archivos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  // Filtrar resultados por término de búsqueda
  useEffect(() => {
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = files.filter(f => 
        f.name.toLowerCase().includes(lowercaseSearch) ||
        f.uploadedBy.toLowerCase().includes(lowercaseSearch) ||
        f.type.toLowerCase().includes(lowercaseSearch)
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
      'Fecha de subida', 
      'Subido por', 
      'Estado', 
      'Registros'
    ].join(',');
    
    const csvRows = filteredFiles.map(f => [
      f.name,
      f.type === 'dispatch' ? 'Despacho' : 'Documento',
      format(f.uploadedAt, 'dd/MM/yyyy HH:mm', { locale: es }),
      f.uploadedBy,
      f.status === 'completed' ? 'Completado' : 
      f.status === 'processing' ? 'Procesando' : 
      f.status === 'error' ? 'Error' : f.status,
      f.records || 0
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
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar archivos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
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
      {!isLoading ? (
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left font-medium">Tipo</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha</th>
                  <th className="px-4 py-3 text-left font-medium">Subido por</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-left font-medium">Registros</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{file.name}</td>
                    <td className="px-4 py-3">{file.type === 'dispatch' ? 'Despacho' : 'Documento'}</td>
                    <td className="px-4 py-3">
                      {format(file.uploadedAt, "dd MMM yyyy, HH:mm", { locale: es })}
                    </td>
                    <td className="px-4 py-3">{file.uploadedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        file.status === 'completed' 
                          ? "bg-green-100 text-green-800" 
                          : file.status === 'processing'
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {file.status === 'completed' ? 'Completado' : 
                         file.status === 'processing' ? 'Procesando' : 
                         file.status === 'error' ? 'Error' : file.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{file.records || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">Cargando archivos...</p>
        </div>
      )}
      
      {!isLoading && filteredFiles.length === 0 && (
        <div className="text-center py-8 border rounded-md">
          <FileIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground mb-1">No se han encontrado archivos</p>
        </div>
      )}
    </div>
  );
};

export default FileReportsTab;
