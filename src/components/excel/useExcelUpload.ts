
import { ExcelHook } from './types/excelTypes';
import { useExcelState } from './hooks/useExcelState';
import { useExcelActions } from './hooks/useExcelActions';

/**
 * Hook for managing Excel file uploads and processing
 */
export const useExcelUpload = (): ExcelHook => {
  const {
    showUploadModal,
    setShowUploadModal,
    selectedFile,
    setSelectedFile,
    isUploading,
    setIsUploading,
    previewData,
    setPreviewData,
    excelData,
    setExcelData,
    lastUpdateDate,
    setLastUpdateDate
  } = useExcelState();

  const stateSetters = {
    setShowUploadModal,
    setSelectedFile,
    setIsUploading,
    setPreviewData,
    setExcelData,
    setLastUpdateDate
  };

  const { 
    handleFileSelect, 
    handleUpload: baseHandleUpload, 
    handleRemoveFile 
  } = useExcelActions(stateSetters);

  // Wrap the handleUpload to use the current state values
  const handleUpload = () => {
    baseHandleUpload(selectedFile, previewData);
  };

  return {
    showUploadModal,
    setShowUploadModal,
    selectedFile,
    isUploading,
    previewData,
    excelData,
    lastUpdateDate,
    handleFileSelect,
    handleUpload,
    handleRemoveFile
  };
};
