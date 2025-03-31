
import { toast } from 'sonner';
import { ExcelStateSetters } from '../types/excelTypes';
import { generatePreviewData, transformToApplicationData } from '../utils/excelParsingUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook for handling Excel file upload actions
 */
export const useExcelActions = (state: ExcelStateSetters) => {
  const { user } = useAuth();
  
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

  const handleUpload = async (selectedFile: File | null, previewData: any) => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      // Transform the data for application use
      const transformedData = transformToApplicationData(previewData);
      
      // Save file info to Supabase
      const fileName = selectedFile.name;
      const { data: fileData, error: fileError } = await supabase
        .from('excel_files')
        .insert({
          name: fileName,
          type: 'dispatch_data',
          uploaded_by: user?.id,
          records: previewData.totalRecords,
          repro_count: previewData.reproductora.length,
          engorde_count: previewData.engorde.length,
          file_url: 'processed_directly', // No file URL since we're processing directly
          status: 'completed'
        })
        .select()
        .single();

      if (fileError) {
        console.error('Error saving file data:', fileError);
        throw new Error('Error al guardar la información del archivo');
      }
      
      // Store the transformed data in local state
      setExcelData(transformedData);
      setLastUpdateDate(new Date().toLocaleString());
      
      // Success notification
      toast.success("Archivo subido con éxito", {
        description: `Se procesaron ${previewData.totalRecords} registros de despacho.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Error al procesar el archivo", {
        description: error instanceof Error ? error.message : "Hubo un problema al procesar el archivo.",
      });
    } finally {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewData({
        reproductora: [],
        engorde: [],
        totalRecords: 0
      });
    }
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
