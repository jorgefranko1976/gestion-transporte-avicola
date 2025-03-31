
import { ExcelHook } from './types/excelTypes';
import { useExcelState } from './hooks/useExcelState';
import { useExcelActions } from './hooks/useExcelActions';
import { useState, useCallback } from 'react';

/**
 * Hook for managing Excel file uploads and processing
 */
export const useExcelUpload = (): ExcelHook => {
  const {
    showUploadModal,
    selectedFile,
    isUploading,
    previewData,
    excelData,
    lastUpdateDate,
    setShowUploadModal,
    setSelectedFile,
    setIsUploading,
    setPreviewData,
    setExcelData,
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
  const handleUpload = useCallback(() => {
    return baseHandleUpload(selectedFile, previewData);
  }, [baseHandleUpload, selectedFile, previewData]);

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
    handleRemoveFile,
    setExcelData,
    setLastUpdateDate
  };
};
