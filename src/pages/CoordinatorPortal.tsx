
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useState } from 'react';
import { Eye, Upload, X } from 'lucide-react';
import { sampleExcelDataType2 } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { BarChart3, FileSpreadsheet, List } from 'lucide-react';
import { toast } from 'sonner';
import { ExcelPreviewData } from '@/lib/types';

import DashboardContent from '@/components/dashboard/dashboard-content';
import DispatchesContent from '@/components/dispatches/dispatches-content';
import ExcelContent from '@/components/excel/excel-content';
import ExcelPreviewModal from '@/components/excel/ExcelPreviewModal';

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const { toast: legacyToast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelPreviewData>({
    reproductora: [],
    engorde: [],
    totalRecords: 0
  });
  const [excelData, setExcelData] = useState<any[]>(sampleExcelDataType2);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'despachos' | 'excel'>('dashboard');
  const [activeDataType, setActiveDataType] = useState<'reproductora' | 'engorde'>('reproductora');
  const [activeDispatchStatus, setActiveDispatchStatus] = useState<'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Sistema de Gestión Logística</h1>
                <p className="text-muted-foreground mt-1">
                  Gestiona vehículos, conductores y despachos de manera eficiente
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => setActiveTab('excel')}
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver Excel</span>
                </Button>
                
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 btn-hover"
                >
                  <Upload className="w-4 h-4" />
                  <span>Cargar Excel</span>
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={cn(
                    "px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors",
                    activeTab === 'dashboard' 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => setActiveTab('despachos')}
                  className={cn(
                    "px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors",
                    activeTab === 'despachos' 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="w-4 h-4" />
                  <span>Despachos</span>
                </button>
                <button
                  onClick={() => setActiveTab('excel')}
                  className={cn(
                    "px-6 py-4 flex items-center gap-2 text-sm font-medium transition-colors",
                    activeTab === 'excel' 
                      ? "border-b-2 border-primary text-primary" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Datos Excel</span>
                </button>
              </div>
              
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
                />
              )}
            </div>
          </PageTransition>
        </div>
      </main>

      {/* Excel Preview Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium">Cargar archivo Excel</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    Arrastra tu archivo Excel aquí o haz clic para seleccionarlo
                  </p>
                  <input
                    type="file"
                    id="excel-upload"
                    className="hidden"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                  />
                  <Button 
                    onClick={() => document.getElementById('excel-upload')?.click()}
                    variant="outline"
                  >
                    Seleccionar archivo
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    // Show the detailed preview modal
                    setShowUploadModal(false);
                    // Show the new modal
                    document.getElementById('excel-preview-modal')?.click();
                  }}
                  className="w-full"
                >
                  Ver vista previa detallada
                </Button>
              )}
            </div>
            <div className="border-t p-4 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowUploadModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? 'Procesando...' : 'Subir archivo'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Excel Preview Modal */}
      {selectedFile && (
        <button 
          id="excel-preview-modal" 
          className="hidden"
          onClick={() => {
            /* This is a hidden button that triggers the modal */
          }}
        />
      )}
      
      {selectedFile && (
        <ExcelPreviewModal
          selectedFile={selectedFile}
          previewData={previewData}
          isUploading={isUploading}
          onClose={() => setShowUploadModal(true)}
          onUpload={handleUpload}
          onRemoveFile={() => {
            setSelectedFile(null);
            setPreviewData({
              reproductora: [],
              engorde: [],
              totalRecords: 0
            });
          }}
        />
      )}
    </div>
  );
};

export default CoordinatorPortal;
