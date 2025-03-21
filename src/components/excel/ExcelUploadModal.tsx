
import { X, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ExcelUploadModalProps {
  selectedFile: File | null;
  isUploading: boolean;
  onClose: () => void;
  onUpload: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowDetailedPreview: () => void;
}

const ExcelUploadModal = ({
  selectedFile,
  isUploading,
  onClose,
  onUpload,
  onFileSelect,
  onShowDetailedPreview
}: ExcelUploadModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Cargar archivo Excel</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          {!selectedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-4">
                Arrastra tu archivo Excel aquí o haz clic para seleccionarlo
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                El archivo debe contener las hojas REPRO y ENGORDE con el formato adecuado
              </p>
              <input
                type="file"
                id="excel-upload"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={onFileSelect}
              />
              <Button 
                onClick={() => document.getElementById('excel-upload')?.click()}
                variant="outline"
              >
                Seleccionar archivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button 
                  onClick={() => document.getElementById('excel-upload')?.click()}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  Cambiar
                </button>
              </div>
              
              <Button 
                onClick={onShowDetailedPreview}
                variant="outline"
                className="w-full mb-2"
              >
                Ver vista previa detallada
              </Button>
              
              <Button 
                onClick={onUpload} 
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? 'Procesando...' : 'Subir archivo'}
              </Button>
            </div>
          )}
        </div>
        <div className="border-t p-4 flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancelar
          </Button>
          {selectedFile && !isUploading && (
            <Button 
              onClick={onUpload}
            >
              Subir archivo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;
