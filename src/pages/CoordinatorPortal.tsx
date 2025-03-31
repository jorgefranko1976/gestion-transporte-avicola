import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import DashboardContent from '@/components/dashboard/dashboard-content';
import DispatchesContent from '@/components/dispatches/dispatches-content';
import ExcelContent from '@/components/excel/excel-content';
import ExcelPreviewModal from '@/components/excel/ExcelPreviewModal';
import ExcelUploadModal from '@/components/excel/ExcelUploadModal';
import CoordinatorHeader from '@/components/coordinator/CoordinatorHeader';
import CoordinatorTabs from '@/components/coordinator/CoordinatorTabs';
import { useExcelUpload } from '@/components/excel/useExcelUpload';
import { PortalLayout } from '@/components/layout/PortalLayout';

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'despachos' | 'excel'>('dashboard');
  const [activeDataType, setActiveDataType] = useState<'reproductora' | 'engorde'>('reproductora');
  const [activeDispatchStatus, setActiveDispatchStatus] = useState<'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const {
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
  } = useExcelUpload();

  useEffect(() => {
    const fetchLatestExcelData = async () => {
      if (!user) {
        console.log('No hay usuario autenticado para cargar datos de Excel');
        return;
      }
      
      try {
        console.log('Buscando el archivo Excel más reciente...');
        const { data: latestFile, error: fileError } = await supabase
          .from('excel_files')
          .select('*')
          .order('uploaded_at', { ascending: false })
          .limit(1);

        if (fileError) {
          console.error('Error al buscar el archivo más reciente:', fileError);
          return;
        }

        if (latestFile && latestFile.length > 0) {
          const lastFile = latestFile[0];
          setLastUpdateDate(new Date(lastFile.uploaded_at).toLocaleString());
          
          console.log('Archivo Excel encontrado:', lastFile);
          
          toast.info("Datos Excel disponibles", {
            description: `Se encontró un archivo subido previamente con ${lastFile.records || 0} registros.`,
          });
        } else {
          console.log('No se encontraron archivos Excel previos');
        }
      } catch (error) {
        console.error('Error al cargar datos Excel:', error);
        toast.error('Error al cargar datos Excel previos');
      }
    };

    fetchLatestExcelData();
  }, [user, setLastUpdateDate]);

  const handleShowDetailedPreview = () => {
    setShowUploadModal(false);
    setShowPreviewModal(true);
  };

  return (
    <PortalLayout title="Panel de Coordinador">
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
        <CoordinatorTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
        
        {activeTab === 'dashboard' && (
          <DashboardContent 
            setActiveTab={setActiveTab} 
            setActiveDispatchStatus={setActiveDispatchStatus} 
          />
        )}
        
        {activeTab === 'despachos' && (
          <DispatchesContent 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        )}

        {activeTab === 'excel' && (
          <ExcelContent 
            excelData={excelData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeDataType={activeDataType}
            setActiveDataType={setActiveDataType}
            activeDispatchStatus={activeDispatchStatus}
            setActiveDispatchStatus={setActiveDispatchStatus}
            lastUpdateDate={lastUpdateDate}
            onUploadClick={() => setShowUploadModal(true)}
          />
        )}
      </div>
      
      {showUploadModal && (
        <ExcelUploadModal
          selectedFile={selectedFile}
          isUploading={isUploading}
          onClose={() => setShowUploadModal(false)}
          onUpload={() => selectedFile && handleUpload(selectedFile, previewData)}
          onFileSelect={handleFileSelect}
          onShowDetailedPreview={handleShowDetailedPreview}
        />
      )}
      
      {showPreviewModal && selectedFile && (
        <ExcelPreviewModal
          selectedFile={selectedFile}
          previewData={previewData}
          isUploading={isUploading}
          onClose={() => {
            setShowPreviewModal(false);
            setShowUploadModal(true);
          }}
          onUpload={() => handleUpload(selectedFile, previewData)}
          onRemoveFile={handleRemoveFile}
        />
      )}
    </PortalLayout>
  );
};

export default CoordinatorPortal;
