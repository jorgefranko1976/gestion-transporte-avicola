
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ExcelPreviewData } from '@/lib/types';
import NoFileSelected from './preview/NoFileSelected';
import FileInfoHeader from './preview/FileInfoHeader';
import ExcelSummary from './preview/ExcelSummary';
import PreviewTabs from './preview/PreviewTabs';

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
            <NoFileSelected />
          ) : (
            <>
              <FileInfoHeader 
                selectedFile={selectedFile} 
                onRemoveFile={onRemoveFile} 
              />

              <ExcelSummary 
                selectedFile={selectedFile} 
                previewData={previewData} 
              />
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <PreviewTabs previewData={previewData} />
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

export default ExcelPreviewModal;
