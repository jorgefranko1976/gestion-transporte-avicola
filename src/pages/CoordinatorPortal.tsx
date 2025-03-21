import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

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
    handleRemoveFile
  } = useExcelUpload();

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
      
      {/* Upload Modal */}
      {showUploadModal && (
        <ExcelUploadModal
          selectedFile={selectedFile}
          isUploading={isUploading}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
          onFileSelect={handleFileSelect}
          onShowDetailedPreview={handleShowDetailedPreview}
        />
      )}
      
      {/* Detailed Excel Preview Modal */}
      {showPreviewModal && selectedFile && (
        <ExcelPreviewModal
          selectedFile={selectedFile}
          previewData={previewData}
          isUploading={isUploading}
          onClose={() => {
            setShowPreviewModal(false);
            setShowUploadModal(true);
          }}
          onUpload={handleUpload}
          onRemoveFile={handleRemoveFile}
        />
      )}
    </PortalLayout>
  );
};

export default CoordinatorPortal;
