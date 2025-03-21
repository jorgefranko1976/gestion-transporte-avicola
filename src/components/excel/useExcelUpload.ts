
import { useState } from 'react';
import { toast } from 'sonner';
import { ExcelPreviewData } from '@/lib/types';
import { ExcelHook } from './types/excelTypes';
import { generatePreviewData, transformToApplicationData } from './utils/excelParsingUtils';

/**
 * Hook for managing Excel file uploads and processing
 */
export const useExcelUpload = (): ExcelHook => {
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Generate preview data from the file
      const preview = generatePreviewData(file);
      setPreviewData(preview);
    }
  };

  const handleUpload = () => {
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
