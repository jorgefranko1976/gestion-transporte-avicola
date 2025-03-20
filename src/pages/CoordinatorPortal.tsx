
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Users, 
  FileSpreadsheet, 
  BarChart3, 
  Upload, 
  Package, 
  AlertCircle, 
  Clock,
  CheckCircle,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for demonstration
const recentVehicles = [
  { id: '1', plate: 'ABC123', type: 'camion', brand: 'Chevrolet', model: '2020' },
  { id: '2', plate: 'XYZ789', type: 'dobletroque', brand: 'Ford', model: '2019' },
  { id: '3', plate: 'DEF456', type: 'camioneta', brand: 'Toyota', model: '2021' },
  { id: '4', plate: 'GHI789', type: 'camion liviano', brand: 'Mitsubishi', model: '2018' },
  { id: '5', plate: 'JKL012', type: 'tracto camion', brand: 'Kenworth', model: '2017' },
];

const recentDrivers = [
  { id: '1', name: 'Carlos Rodríguez', identification: 'CC 12345678', plate: 'ABC123', phone: '300-123-4567' },
  { id: '2', name: 'Luis Martínez', identification: 'CC 87654321', plate: 'XYZ789', phone: '315-765-4321' },
  { id: '3', name: 'Juan Pérez', identification: 'CC 98765432', plate: 'DEF456', phone: '310-987-6543' },
];

const dispatchStats = {
  pending: 12,
  inProgress: 8,
  completed: 24,
  delayed: 2,
  cancelled: 1,
  total: 47,
};

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<string[][]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // In a real app, this would be server-side parsing
      // This is just a mock preview
      setPreviewData([
        ['Orden', 'Conductor', 'Placa', 'Empresa', 'Destino', 'Bultos'],
        ['ORD-2023-0542', 'Carlos Rodríguez', 'ABC123', 'Distribuidora Avícola S.A.', 'Medellín', '250'],
        ['ORD-2023-0543', 'Luis Martínez', 'XYZ789', 'Pollos del Valle S.A.S.', 'Cali', '180'],
        ['ORD-2023-0544', 'Juan Pérez', 'DEF456', 'Avícola del Este', 'Bogotá', '320'],
      ]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPreviewData([]);
      
      // In a real app, this would show a success message via a toast
    }, 2000);
  };

  const QuickNavCard = ({ 
    icon, 
    title, 
    description, 
    to 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    to: string 
  }) => (
    <Link 
      to={to} 
      className="group p-6 border border-border rounded-2xl bg-card transition-all duration-300 ease-apple hover:shadow-subtle hover:-translate-y-1 flex gap-4"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-apple flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </Link>
  );

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    colorClass = "bg-primary/10 text-primary" 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string | number; 
    colorClass?: string 
  }) => (
    <div className="p-6 border border-border rounded-2xl bg-card flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Panel de Coordinador</h1>
                <p className="text-muted-foreground mt-1">
                  Gestiona vehículos, conductores y despachos de manera eficiente
                </p>
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors btn-hover focus-ring"
              >
                <Upload className="w-4 h-4" />
                <span>Subir Excel</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={<Package className="w-6 h-6" />} 
                title="Despachos Totales" 
                value={dispatchStats.total}
              />
              
              <StatCard 
                icon={<Clock className="w-6 h-6" />} 
                title="En Progreso" 
                value={dispatchStats.inProgress}
                colorClass="bg-blue-50 text-blue-600"
              />
              
              <StatCard 
                icon={<CheckCircle className="w-6 h-6" />} 
                title="Completados" 
                value={dispatchStats.completed}
                colorClass="bg-green-50 text-green-600"
              />
              
              <StatCard 
                icon={<AlertCircle className="w-6 h-6" />} 
                title="Retrasados/Cancelados" 
                value={dispatchStats.delayed + dispatchStats.cancelled}
                colorClass="bg-yellow-50 text-yellow-600"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <QuickNavCard
                icon={<Truck className="w-6 h-6" />}
                title="Gestión de Vehículos"
                description="Enrola nuevos vehículos o gestiona los existentes"
                to="/vehicles"
              />
              
              <QuickNavCard
                icon={<Users className="w-6 h-6" />}
                title="Gestión de Conductores"
                description="Administra conductores y asignación de vehículos"
                to="/drivers"
              />
              
              <QuickNavCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Reportes y Análisis"
                description="Genera informes detallados de operaciones"
                to="/reports"
              />
              
              <QuickNavCard
                icon={<ShieldAlert className="w-6 h-6" />}
                title="Plan de Seguridad Vial"
                description="Gestiona documentos y seguimiento PESV"
                to="/pesv"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-morphism rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Vehículos Recientes</h2>
                    <Link 
                      to="/vehicles" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver todos
                    </Link>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Placa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Marca</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Modelo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">{vehicle.plate}</td>
                          <td className="px-6 py-4 text-sm capitalize">{vehicle.type}</td>
                          <td className="px-6 py-4 text-sm">{vehicle.brand}</td>
                          <td className="px-6 py-4 text-sm">{vehicle.model}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="glass-morphism rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">Conductores Recientes</h2>
                    <Link 
                      to="/drivers" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Ver todos
                    </Link>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Nombre</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Identificación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Vehículo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground">Teléfono</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {recentDrivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium">{driver.name}</td>
                          <td className="px-6 py-4 text-sm">{driver.identification}</td>
                          <td className="px-6 py-4 text-sm">{driver.plate}</td>
                          <td className="px-6 py-4 text-sm">{driver.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </PageTransition>
          
          {/* Upload Modal */}
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div 
                className="glass-morphism rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Subir Archivo de Despachos</h2>
                    <button 
                      onClick={() => {
                        setShowUploadModal(false);
                        setSelectedFile(null);
                        setPreviewData([]);
                      }}
                      className="p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Seleccionar archivo Excel
                      </label>
                      
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center">
                          <FileSpreadsheet className="w-10 h-10 text-muted-foreground mb-3" />
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {selectedFile 
                              ? `Archivo seleccionado: ${selectedFile.name}` 
                              : 'Arrastra y suelta o haz clic para seleccionar'
                            }
                          </p>
                          
                          <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                          />
                          
                          <label
                            htmlFor="file-upload"
                            className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors cursor-pointer btn-hover"
                          >
                            Seleccionar Archivo
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {previewData.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Vista previa</h3>
                        
                        <div className="border border-border rounded-lg overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-muted/50 border-b border-border">
                                {previewData[0].map((header, i) => (
                                  <th key={i} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.slice(1).map((row, i) => (
                                <tr key={i} className="border-b border-border/50 last:border-b-0">
                                  {row.map((cell, j) => (
                                    <td key={j} className="px-4 py-2 text-sm">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setShowUploadModal(false);
                          setSelectedFile(null);
                          setPreviewData([]);
                        }}
                        className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </button>
                      
                      <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 btn-hover"
                      >
                        {isUploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Subiendo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Subir Archivo</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CoordinatorPortal;
