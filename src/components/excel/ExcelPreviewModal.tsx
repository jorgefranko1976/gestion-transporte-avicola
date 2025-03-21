
import { useState } from 'react';
import { X, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ExcelPreviewData, ReproductoraDespatch, EngordeDespatch } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExcelPreviewModalProps {
  selectedFile: File | null;
  previewData: ExcelPreviewData;
  isUploading: boolean;
  onClose: () => void;
  onUpload: () => void;
  onRemoveFile: () => void;
}

const ExcelPreviewModal = ({
  selectedFile,
  previewData,
  isUploading,
  onClose,
  onUpload,
  onRemoveFile
}: ExcelPreviewModalProps) => {
  const [activeSheet, setActiveSheet] = useState<'reproductora' | 'engorde'>('reproductora');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 flex flex-col h-[80vh]">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Vista previa del archivo Excel</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex-1 flex flex-col items-center justify-center">
              <FileText className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-4">
                No hay ningún archivo Excel seleccionado
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-4">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button 
                  onClick={onRemoveFile}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
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
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <Tabs 
                  value={activeSheet} 
                  onValueChange={(v) => setActiveSheet(v as 'reproductora' | 'engorde')}
                  className="flex-1 flex flex-col"
                >
                  <TabsList className="mb-2">
                    <TabsTrigger value="reproductora" className="flex items-center gap-1">
                      <span>REPRODUCTORA</span>
                      <span className="bg-primary/10 text-primary text-xs py-0.5 px-1.5 rounded-full">
                        {previewData.reproductora.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="engorde" className="flex items-center gap-1">
                      <span>ENGORDE</span>
                      <span className="bg-primary/10 text-primary text-xs py-0.5 px-1.5 rounded-full">
                        {previewData.engorde.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex-1 overflow-auto border rounded-md">
                    <TabsContent value="reproductora" className="m-0 h-full">
                      {previewData.reproductora.length > 0 ? (
                        <ReproductoraSheetPreview data={previewData.reproductora} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No hay datos de tipo REPRODUCTORA</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="engorde" className="m-0 h-full">
                      {previewData.engorde.length > 0 ? (
                        <EngordeSheetPreview data={previewData.engorde} />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">No hay datos de tipo ENGORDE</p>
                        </div>
                      )}
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button 
            onClick={onUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Procesando...' : 'Subir archivo'}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ReproductoraSheetPreviewProps {
  data: ReproductoraDespatch[];
}

const ReproductoraSheetPreview = ({ data }: ReproductoraSheetPreviewProps) => {
  if (!data.length) return null;
  
  // Define key columns for readability - not showing all columns to save space
  const keyColumns = [
    'ubicacion', 'granja', 'lote', 'planta', 'tipoAlimento', 
    'dia', 'cantidad', 'ton', 'orden', 'conductor', 'placa'
  ];
  
  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {keyColumns.map((column) => (
              <TableHead key={column} className="text-xs whitespace-nowrap">
                {formatColumnName(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keyColumns.map((column) => (
                <TableCell key={`${idx}-${column}`} className="text-xs">
                  {formatCellValue(row[column as keyof ReproductoraDespatch])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface EngordeSheetPreviewProps {
  data: EngordeDespatch[];
}

const EngordeSheetPreview = ({ data }: EngordeSheetPreviewProps) => {
  if (!data.length) return null;
  
  // Define key columns for readability - not showing all columns to save space
  const keyColumns = [
    'granja', 'dia', 'planta', 'nomAlimento', 'cantidad', 
    'toneladas', 'ubicacion', 'tecnico', 'orden', 'conductor', 'placa'
  ];
  
  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {keyColumns.map((column) => (
              <TableHead key={column} className="text-xs whitespace-nowrap">
                {formatColumnName(column)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {keyColumns.map((column) => (
                <TableCell key={`${idx}-${column}`} className="text-xs">
                  {formatCellValue(row[column as keyof EngordeDespatch])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper function to format column names for display
const formatColumnName = (name: string): string => {
  // Convert camelCase to Title Case with spaces
  const formatted = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
  
  return formatted;
};

// Helper function to format cell values
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value.toString();
  return value;
};

export default ExcelPreviewModal;
