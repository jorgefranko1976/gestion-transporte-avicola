
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileReport } from '../types';

interface FilesTableProps {
  files: FileReport[];
}

export const FilesTable = ({ files }: FilesTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Nombre</th>
              <th className="px-4 py-3 text-left font-medium">Tipo</th>
              <th className="px-4 py-3 text-left font-medium">Fecha de Subida</th>
              <th className="px-4 py-3 text-left font-medium">Subido Por</th>
              <th className="px-4 py-3 text-left font-medium">REPRO</th>
              <th className="px-4 py-3 text-left font-medium">ENGORDE</th>
              <th className="px-4 py-3 text-left font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{file.name}</td>
                <td className="px-4 py-3">{file.type}</td>
                <td className="px-4 py-3">
                  {format(file.uploadedAt, "dd MMM yyyy, HH:mm", { locale: es })}
                </td>
                <td className="px-4 py-3">{file.uploadedBy}</td>
                <td className="px-4 py-3">{file.reproCount || 0}</td>
                <td className="px-4 py-3">{file.engordeCount || 0}</td>
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
  );
};
