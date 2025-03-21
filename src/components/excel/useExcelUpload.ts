
import { useState } from 'react';
import { ExcelPreviewData } from '@/lib/types';
import { sampleExcelDataType2 } from '@/data/mockData';
import { toast } from 'sonner';

export const useExcelUpload = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelPreviewData>({
    reproductora: [],
    engorde: [],
    totalRecords: 0
  });
  const [excelData, setExcelData] = useState<any[]>(sampleExcelDataType2);
  const [lastUpdateDate, setLastUpdateDate] = useState('11/03/2025, 09:40 p. m.');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // In a real application, you would parse the Excel file here
      // For this example, we'll simulate it with mock data
      
      // Split the sample data into reproductora and engorde
      const reproData = sampleExcelDataType2.filter(item => item.tipo === 'reproductora');
      const engordeData = sampleExcelDataType2.filter(item => item.tipo === 'engorde');
      
      setPreviewData({
        reproductora: reproData,
        engorde: engordeData,
        totalRecords: sampleExcelDataType2.length
      });
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      
      // Combine both sheets into one excelData array
      const allData = [...previewData.reproductora, ...previewData.engorde];
      setExcelData(allData);
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
    setSelectedFile,
    isUploading,
    previewData,
    excelData,
    lastUpdateDate,
    handleFileSelect,
    handleUpload,
    handleRemoveFile
  };
};
