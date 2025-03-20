
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useState } from 'react';
import { Eye, Upload } from 'lucide-react';
import { sampleExcelDataType2 } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";
import { BarChart3, FileSpreadsheet, List } from 'lucide-react';

import DashboardContent from '@/components/dashboard/dashboard-content';
import DispatchesContent from '@/components/dispatches/dispatches-content';
import ExcelContent from '@/components/excel/excel-content';

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
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
      
      setPreviewData(sampleExcelDataType2);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setExcelData(previewData);
      setLastUpdateDate(new Date().toLocaleString());
      
      toast({
        title: "Archivo subido con éxito",
        description: `Se procesaron ${previewData.length} registros de despacho.`,
      });
      
      setPreviewData([]);
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
    </div>
  );
};

export default CoordinatorPortal;
