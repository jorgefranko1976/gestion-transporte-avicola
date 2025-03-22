
import { File } from 'lucide-react';
import { ExcelPreviewData } from '@/lib/types';

interface ExcelSummaryProps {
  selectedFile: File;
  previewData: ExcelPreviewData;
}

const ExcelSummary = ({ selectedFile, previewData }: ExcelSummaryProps) => {
  return (
    <div className="bg-muted/30 rounded-md p-3 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <File className="w-4 h-4 text-primary" />
        <h4 className="font-medium">Resumen del archivo</h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Tamaño</p>
          <p className="font-medium">{(selectedFile.size / 1024).toFixed(1)} KB</p>
        </div>
        
        <div>
          <p className="text-muted-foreground">Total registros</p>
          <p className="font-medium">{previewData.totalRecords}</p>
        </div>
        
        <div>
          <p className="text-muted-foreground">Reproductora</p>
          <p className="font-medium">{previewData.reproductora.length} registros</p>
        </div>
        
        <div>
          <p className="text-muted-foreground">Engorde</p>
          <p className="font-medium">{previewData.engorde.length} registros</p>
        </div>
      </div>
    </div>
  );
};

export default ExcelSummary;
