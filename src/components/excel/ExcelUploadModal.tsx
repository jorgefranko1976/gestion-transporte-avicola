
import { X, Upload } from 'lucide-react';
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
            <Button 
              onClick={onShowDetailedPreview}
              className="w-full"
            >
              Ver vista previa detallada
            </Button>
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

export default ExcelUploadModal;
