
import { useState } from 'react';
import { ExcelPreviewData } from '@/lib/types';
import { ExcelState } from '../types/excelTypes';

/**
 * Hook for managing Excel file upload state
 */
export const useExcelState = (): ExcelState => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelPreviewData>({
    reproductora: [],
    engorde: [],
    totalRecords: 0
  });
  const [excelData, setExcelData] = useState<any[]>([]);
  const [lastUpdateDate, setLastUpdateDate] = useState('11/03/2025, 09:40 p. m.');

  return {
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
  };
};
