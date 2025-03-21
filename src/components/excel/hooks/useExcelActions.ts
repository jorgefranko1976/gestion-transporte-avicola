
import { toast } from 'sonner';
import { ExcelStateSetters } from '../types/excelTypes';
import { generatePreviewData, transformToApplicationData } from '../utils/excelParsingUtils';

/**
 * Hook for handling Excel file upload actions
 */
export const useExcelActions = (state: ExcelStateSetters) => {
  const {
    setSelectedFile,
    setPreviewData,
    setIsUploading,
    setShowUploadModal,
    setExcelData,
    setLastUpdateDate
  } = state;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Generate preview data from the file
      const preview = generatePreviewData(file);
      setPreviewData(preview);
    }
  };

  const handleUpload = (selectedFile: File | null, previewData: any) => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      
      // Transform and store the data
      const transformedData = transformToApplicationData(previewData);
      setExcelData(transformedData);
      setLastUpdateDate(new Date().toLocaleString());
      
      toast.success("Archivo subido con éxito", {
        description: `Se procesaron ${previewData.totalRecords} registros de despacho.`,
      });
      
      setPreviewData({
        reproductora: [],
        engorde: [],
        totalRecords: 0
      });
    }, 2000);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewData({
      reproductora: [],
      engorde: [],
      totalRecords: 0
    });
  };

  return {
    handleFileSelect,
    handleUpload,
    handleRemoveFile
  };
};
