
import { ExcelPreviewData } from '@/lib/types';

interface ExcelSummaryProps {
  selectedFile: File;
  previewData: ExcelPreviewData;
}

const ExcelSummary = ({ selectedFile, previewData }: ExcelSummaryProps) => {
  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
        <div className="flex-1 truncate">
          <p className="font-medium truncate">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {(selectedFile.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium mb-1">Resumen:</p>
        <p className="text-xs text-muted-foreground">
          Se encontraron {previewData.totalRecords} registros de despacho en total:
        </p>
        <ul className="text-xs text-muted-foreground list-disc list-inside mt-1">
          <li>{previewData.reproductora.length} registros tipo REPRODUCTORA</li>
          <li>{previewData.engorde.length} registros tipo ENGORDE</li>
        </ul>
        <p className="text-xs text-primary mt-2 font-medium">
          ℹ️ Se muestran todos los registros encontrados en el archivo.
        </p>
      </div>
    </>
  );
};

export default ExcelSummary;
