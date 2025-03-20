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
  ShieldAlert,
  Eye,
  Download,
  Search,
  List,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const recentVehicles = [
  { id: '1', plate: 'WHK 426', type: 'camion', brand: 'Chevrolet', model: '2020' },
  { id: '2', plate: 'SRD 194', type: 'dobletroque', brand: 'Ford', model: '2019' },
  { id: '3', plate: 'WPK 570', type: 'camioneta', brand: 'Toyota', model: '2021' },
  { id: '4', plate: 'XXB 191', type: 'camion liviano', brand: 'Mitsubishi', model: '2018' },
  { id: '5', plate: 'XXR 556', type: 'tracto camion', brand: 'Kenworth', model: '2017' },
];

const recentDrivers = [
  { id: '1', name: 'ANDRES SABOGAL', identification: 'CC 80311610', plate: 'WHK 426', phone: '300-123-4567' },
  { id: '2', name: 'FERNANDO VANEGAS', identification: 'CC 1003558901', plate: 'SRD 194', phone: '315-765-4321' },
  { id: '3', name: 'MARTIN CHAVEZ', identification: 'CC 19.223.941', plate: 'WPK 570', phone: '310-987-6543' },
  { id: '4', name: 'HENRY ESGUERRA', identification: 'CC 74335546', plate: 'XXB 191', phone: '301-234-5678' },
];

const dispatchStats = {
  pending: 12,
  inProgress: 8,
  completed: 24,
  delayed: 2,
  cancelled: 1,
  total: 47,
};

const sampleExcelDataType2 = [
  {
    id: '1',
    ubicacion: 'GARAGOA',
    granja: 'BARSAL 1',
    lote: '630',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 2 COBB',
    medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MARTES 25',
    cantidad: '275',
    ton: '11',
    orden: '224230',
    conductor: 'ANDRES SABOGAL',
    placa: 'WHK 426',
  },
  {
    id: '2',
    ubicacion: 'GARAGOA',
    granja: 'SAN ESTEBAN 2',
    lote: '652',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'LEVANTE',
    medicacion: 'SIN MEDICAR',
    dia: 'MIERCOLES 26',
    cantidad: '375',
    ton: '15',
    orden: '224231',
    conductor: 'FERNANDO VANEGAS',
    placa: 'SRD 194',
  },
  {
    id: '3',
    ubicacion: 'GARAGOA',
    granja: 'SAN MIGUEL',
    lote: '617',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 3 ROSS',
    medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MIERCOLES 26',
    cantidad: '350',
    ton: '14',
    orden: '224234',
    conductor: 'MARTIN CHAVEZ',
    placa: 'WPK 570',
  },
  {
    id: '4',
    ubicacion: 'GARAGOA',
    granja: 'ZONA CENTRAL BAJA',
    lote: '618',
    planta: 'ITALCOL-FUNZA',
    alimento: 'FASE 2 COBB',
    medicacion: 'PX CYROMICINA-FINBIOX-HEPATOSTAR-OVOCLEAN',
    dia: 'MIERCOLES 26',
    cantidad: '350',
    ton: '14',
    orden: '1114222',
    conductor: 'HENRY ESGUERRA',
    placa: 'XXB191',
  },
  {
    id: '5',
    ubicacion: 'GARAGOA',
    granja: 'ZONA CENTRAL BAJA',
    lote: '618',
    planta: 'ITALCOL-FUNZA',
    alimento: 'MACHOS COBB',
    medicacion: 'SIN MEDICAR',
    dia: 'MIERCOLES 26',
    cantidad: '25',
    ton: '1',
    orden: '1114222',
    conductor: 'HENRY ESGUERRA',
    placa: 'XXB191',
  },
];

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [excelData, setExcelData] = useState<any[]>(sampleExcelDataType2);
  const [activeTab, setActiveTab] = useState<'despachos' | 'excel'>('excel');
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

  const filteredData = excelData.filter(item => {
    return (
      item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.granja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orden.includes(searchTerm)
    );
  });

  const filteredVehicles = recentVehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrivers = recentDrivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl md:text-3xl font-bold">Sistema de Gestión Logística</h1>
                <p className="text-muted-foreground mt-1">
                  Gestiona vehículos, conductores y despachos de manera eficiente
                </p>
              </div>
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors btn-hover focus-ring"
              >
                <Upload className="w-4 h-4" />
                <span>Cargar Excel</span>
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
            
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <div className="flex border-b border-border">
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
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Datos del Excel</h2>
                    <p className="text-sm text-muted-foreground">
                      Última actualización: {lastUpdateDate}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Buscar en los datos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-[300px]"
                      />
                    </div>
                    <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm hover:bg-muted transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Exportar</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mb-4">
                  <div className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Reproductoras (27)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded-full">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Engorde (38)</span>
                  </div>
                </div>
              
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            UBICACIÓN/GRANJA
                          </TableHead>
                          <TableHead>LOTE/PLANTA</TableHead>
                          <TableHead>ALIMENTO/MEDICACIÓN</TableHead>
                          <TableHead>DÍA</TableHead>
                          <TableHead>CANTIDAD/TON</TableHead>
                          <TableHead>CONDUCTOR</TableHead>
                          <TableHead>PLACA</TableHead>
                          <TableHead>ORDEN</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.length > 0 ? (
                          filteredData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/20">
                              <TableCell className="font-medium">
                                <div>{item.ubicacion}</div>
                                <div className="text-xs text-muted-foreground">{item.granja}</div>
                              </TableCell>
                              <TableCell>
                                <div>{item.lote}</div>
                                <div className="text-xs text-muted-foreground">{item.planta}</div>
                              </TableCell>
                              <TableCell>
                                <div>{item.alimento}</div>
                                <div className="text-xs text-muted-foreground">{item.medicacion}</div>
                              </TableCell>
                              <TableCell>{item.dia}</TableCell>
                              <TableCell>
                                <div>{item.cantidad}</div>
                                <div className="text-xs text-muted-foreground">{item.ton} ton</div>
                              </TableCell>
                              <TableCell className="font-medium">{item.conductor}</TableCell>
                              <TableCell>{item.placa}</TableCell>
                              <TableCell>{item.orden}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                              No se encontraron resultados
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="p-2 border-t">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationNext href="#" />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </div>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Placa</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell className="font-medium">{vehicle.plate}</TableCell>
                            <TableCell className="capitalize">{vehicle.type}</TableCell>
                            <TableCell>{vehicle.brand}</TableCell>
                            <TableCell>{vehicle.model}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No se encontraron resultados
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Identificación</TableHead>
                        <TableHead>Vehículo</TableHead>
                        <TableHead>Teléfono</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDrivers.length > 0 ? (
                        filteredDrivers.map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">{driver.name}</TableCell>
                            <TableCell>{driver.identification}</TableCell>
                            <TableCell>{driver.plate}</TableCell>
                            <TableCell>{driver.phone}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No se encontraron resultados
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </PageTransition>
          
          {showUploadModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div 
                className="glass-morphism rounded-xl max-w-5xl w-full max-h-[80vh] overflow-y-auto shadow-lg animate-scale-in"
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
                          <table className="w-full min-w-max">
                            <thead>
                              <tr className="bg-muted/50 border-b border-border">
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">UBICACIÓN</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">GRANJA</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">LOTE</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">ALIMENTO</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">MEDICACIÓN</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">DÍA</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">CANTIDAD</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">CONDUCTOR</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">PLACA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {previewData.slice(0, 5).map((item, i) => (
                                <tr key={i} className="border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.ubicacion}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.granja}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.lote}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.alimento}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.medicacion}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.dia}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.cantidad}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.conductor}</td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{item.placa}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          Mostrando 5 de {previewData.length} registros
                        </p>
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
                            <span>Procesando...</span>
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
