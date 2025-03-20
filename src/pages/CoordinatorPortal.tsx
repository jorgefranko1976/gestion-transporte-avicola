
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  PieChart,
  TrendingUp,
  FileWarning,
  Filter,
  RefreshCw,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart as RechartBarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
} from 'recharts';

const recentVehicles = [
  { id: '1', plate: 'WHK 426', type: 'camion', brand: 'Chevrolet', model: '2020', status: 'activo' },
  { id: '2', plate: 'SRD 194', type: 'dobletroque', brand: 'Ford', model: '2019', status: 'activo' },
  { id: '3', plate: 'WPK 570', type: 'camioneta', brand: 'Toyota', model: '2021', status: 'mantenimiento' },
  { id: '4', plate: 'XXB 191', type: 'camion liviano', brand: 'Mitsubishi', model: '2018', status: 'activo' },
  { id: '5', plate: 'XXR 556', type: 'tracto camion', brand: 'Kenworth', model: '2017', status: 'activo' },
];

const recentDrivers = [
  { id: '1', name: 'ANDRES SABOGAL', identification: 'CC 80311610', plate: 'WHK 426', phone: '300-123-4567', status: 'en ruta' },
  { id: '2', name: 'FERNANDO VANEGAS', identification: 'CC 1003558901', plate: 'SRD 194', phone: '315-765-4321', status: 'en ruta' },
  { id: '3', name: 'MARTIN CHAVEZ', identification: 'CC 19.223.941', plate: 'WPK 570', phone: '310-987-6543', status: 'disponible' },
  { id: '4', name: 'HENRY ESGUERRA', identification: 'CC 74335546', plate: 'XXB 191', phone: '301-234-5678', status: 'en ruta' },
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
    tipo: 'reproductora',
    estado: 'en ruta',
    horaEstimada: '14:30',
    horaDespacho: '09:15'
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
    tipo: 'reproductora',
    estado: 'pendiente',
    horaEstimada: '16:45',
    horaDespacho: '10:30'
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
    tipo: 'engorde',
    estado: 'completado',
    horaEstimada: '12:30',
    horaDespacho: '08:15'
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
    tipo: 'engorde',
    estado: 'demorado',
    horaEstimada: '11:15',
    horaDespacho: '07:30'
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
    tipo: 'engorde',
    estado: 'completado',
    horaEstimada: '09:45',
    horaDespacho: '06:30'
  },
  {
    id: '6',
    ubicacion: 'TUNJA',
    granja: 'LAS BRISAS',
    lote: '712',
    planta: 'ALBATEQ-ALBATEQ',
    alimento: 'FASE 1 ROSS',
    medicacion: 'SIN MEDICAR',
    dia: 'JUEVES 27',
    cantidad: '320',
    ton: '13',
    orden: '224250',
    conductor: 'ANDRES SABOGAL',
    placa: 'WHK 426',
    tipo: 'reproductora',
    estado: 'pendiente',
    horaEstimada: '15:00',
    horaDespacho: '10:15'
  },
  {
    id: '7',
    ubicacion: 'TUNJA',
    granja: 'VIENTO LIBRE',
    lote: '680',
    planta: 'ITALCOL-FUNZA',
    alimento: 'FASE 2 ROSS',
    medicacion: 'FINBIOX-HEPATOSTAR',
    dia: 'JUEVES 27',
    cantidad: '290',
    ton: '12',
    orden: '1114240',
    conductor: 'FERNANDO VANEGAS',
    placa: 'SRD 194',
    tipo: 'engorde',
    estado: 'pendiente',
    horaEstimada: '16:30',
    horaDespacho: '11:00'
  },
];

// Datos para gráficos
const dispatchesByStatus = [
  { name: 'Pendientes', value: 12, color: '#64748b' },
  { name: 'En Ruta', value: 8, color: '#3b82f6' },
  { name: 'Completados', value: 24, color: '#22c55e' },
  { name: 'Demorados', value: 2, color: '#f59e0b' },
  { name: 'Cancelados', value: 1, color: '#ef4444' },
];

const weeklyDispatchData = [
  { name: 'Lun', pendientes: 8, enRuta: 5, completados: 20 },
  { name: 'Mar', pendientes: 10, enRuta: 6, completados: 22 },
  { name: 'Mié', pendientes: 12, enRuta: 8, completados: 24 },
  { name: 'Jue', pendientes: 9, enRuta: 7, completados: 21 },
  { name: 'Vie', pendientes: 11, enRuta: 6, completados: 23 },
  { name: 'Sáb', pendientes: 7, enRuta: 4, completados: 18 },
  { name: 'Dom', pendientes: 4, enRuta: 2, completados: 10 },
];

const documentsToExpire = [
  { id: 1, type: 'SOAT', vehicle: 'WPK 570', expireDate: '18/04/2025', daysRemaining: 15 },
  { id: 2, type: 'Tecnicomecánica', vehicle: 'XXB 191', expireDate: '24/04/2025', daysRemaining: 21 },
  { id: 3, type: 'Licencia', driver: 'FERNANDO VANEGAS', expireDate: '30/04/2025', daysRemaining: 27 },
  { id: 4, type: 'Seguro Contractual', vehicle: 'SRD 194', expireDate: '05/05/2025', daysRemaining: 32 },
];

const chartConfig = {
  pendientes: { label: "Pendientes", color: "#64748b" },
  enRuta: { label: "En Ruta", color: "#3b82f6" },
  completados: { label: "Completados", color: "#22c55e" },
  demorados: { label: "Demorados", color: "#f59e0b" },
  cancelados: { label: "Cancelados", color: "#ef4444" },
};

const CoordinatorPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  // Filtrar datos según la búsqueda, el tipo activo y estado
  const filteredData = excelData.filter(item => {
    const matchesSearchTerm =
      item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.granja.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.orden.includes(searchTerm);

    const matchesType = activeDataType === 'todos' || item.tipo === activeDataType;
    const matchesStatus = activeDispatchStatus === 'todos' || item.estado === activeDispatchStatus;

    return matchesSearchTerm && matchesType && matchesStatus;
  });

  const reproductoraCounts = excelData.filter(item => item.tipo === 'reproductora').length;
  const engordeCounts = excelData.filter(item => item.tipo === 'engorde').length;
  
  const pendienteCounts = excelData.filter(item => item.estado === 'pendiente').length;
  const enRutaCounts = excelData.filter(item => item.estado === 'en ruta').length;
  const completadoCounts = excelData.filter(item => item.estado === 'completado').length;
  const demoradoCounts = excelData.filter(item => item.estado === 'demorado').length;

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

  // Obtener el color según el estado
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-slate-400 text-white';
      case 'en ruta':
        return 'bg-blue-500 text-white';
      case 'completado':
        return 'bg-green-500 text-white';
      case 'demorado':
        return 'bg-amber-500 text-white';
      case 'cancelado':
        return 'bg-red-500 text-white';
      case 'mantenimiento':
        return 'bg-orange-400 text-white';
      case 'disponible':
        return 'bg-emerald-500 text-white';
      case 'activo':
        return 'bg-emerald-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`${getStatusColor(status)} text-xs px-2 py-1 rounded-full font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const navigateToSection = (section: 'vehicles' | 'drivers' | 'reports' | 'pesv') => {
    navigate(`/${section}`);
  };

  const QuickNavCard = ({ 
    icon, 
    title, 
    description, 
    onClick 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    onClick: () => void;
  }) => (
    <div 
      onClick={onClick}
      className="group p-6 border border-border rounded-2xl bg-card transition-all duration-300 ease-apple hover:shadow-subtle hover:-translate-y-1 flex gap-4 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 ease-apple flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  );

  const StatCard = ({ 
    icon, 
    title, 
    value, 
    trend,
    colorClass = "bg-primary/10 text-primary",
    onClick
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: string | number;
    trend?: { value: number; isUp: boolean };
    colorClass?: string;
    onClick?: () => void;
  }) => (
    <Card className={cn("transition-all duration-300 ease-apple hover:shadow-subtle", onClick ? "cursor-pointer hover:-translate-y-1" : "")} onClick={onClick}>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorClass)}>
              {icon}
            </div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend.isUp ? "text-green-500" : "text-red-500"
            )}>
              {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-muted-foreground">
        Comparado con periodo anterior
      </CardFooter>
    </Card>
  );
  
  const DocumentCard = ({ 
    id, 
    type, 
    vehicle, 
    driver, 
    expireDate, 
    daysRemaining 
  }: { 
    id: number, 
    type: string, 
    vehicle?: string, 
    driver?: string, 
    expireDate: string, 
    daysRemaining: number 
  }) => (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{type}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {vehicle && `Vehículo: ${vehicle}`}
            {driver && `Conductor: ${driver}`}
          </p>
        </div>
        <div className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          daysRemaining <= 15 ? "bg-red-100 text-red-700" : 
          daysRemaining <= 30 ? "bg-amber-100 text-amber-700" : 
          "bg-green-100 text-green-700"
        )}>
          {daysRemaining} días
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">Vence: {expireDate}</span>
        <Button variant="outline" size="sm" className="h-8">Ver documento</Button>
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
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Panel de Control</h2>
                      <p className="text-sm text-muted-foreground">
                        Resumen de operaciones y métricas clave
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Hoy</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <RefreshCw className="w-4 h-4" />
                        <span>Actualizar</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="w-4 h-4" />
                        <span>Filtros</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                    <StatCard 
                      icon={<Package className="w-5 h-5" />} 
                      title="Despachos Totales" 
                      value={dispatchStats.total}
                      trend={{ value: 12, isUp: true }}
                      onClick={() => setActiveTab('despachos')}
                    />
                    
                    <StatCard 
                      icon={<Clock className="w-5 h-5" />} 
                      title="En Progreso" 
                      value={dispatchStats.inProgress}
                      trend={{ value: 5, isUp: true }}
                      colorClass="bg-blue-50 text-blue-600"
                      onClick={() => {
                        setActiveTab('despachos');
                        setActiveDispatchStatus('en ruta');
                      }}
                    />
                    
                    <StatCard 
                      icon={<CheckCircle className="w-5 h-5" />} 
                      title="Completados Hoy" 
                      value={dispatchStats.completed}
                      trend={{ value: 8, isUp: true }}
                      colorClass="bg-green-50 text-green-600"
                      onClick={() => {
                        setActiveTab('despachos');
                        setActiveDispatchStatus('completado');
                      }}
                    />
                    
                    <StatCard 
                      icon={<AlertCircle className="w-5 h-5" />} 
                      title="Retrasados" 
                      value={dispatchStats.delayed}
                      trend={{ value: 3, isUp: false }}
                      colorClass="bg-yellow-50 text-yellow-600"
                      onClick={() => {
                        setActiveTab('despachos');
                        setActiveDispatchStatus('demorado');
                      }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg">Despachos por Día</CardTitle>
                        <CardDescription>Últimos 7 días</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ChartContainer config={chartConfig}>
                            <RechartBarChart data={weeklyDispatchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Bar dataKey="pendientes" name="Pendientes" fill="#64748b" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="enRuta" name="En Ruta" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                              <Bar dataKey="completados" name="Completados" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </RechartBarChart>
                          </ChartContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Estado de Despachos</CardTitle>
                        <CardDescription>Distribución actual</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartPieChart>
                              <Pie
                                data={dispatchesByStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {dispatchesByStatus.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [`${value} despachos`, name]} />
                            </RechartPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Documentos por Vencer</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentsToExpire.map(doc => (
                          <DocumentCard key={doc.id} {...doc} />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Acceso Rápido</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <QuickNavCard
                          icon={<Truck className="w-5 h-5" />}
                          title="Gestión de Vehículos"
                          description="Administrar vehículos y mantenimientos"
                          onClick={() => navigateToSection('vehicles')}
                        />
                        
                        <QuickNavCard
                          icon={<Users className="w-5 h-5" />}
                          title="Gestión de Conductores"
                          description="Administrar conductores y asignaciones"
                          onClick={() => navigateToSection('drivers')}
                        />
                        
                        <QuickNavCard
                          icon={<ShieldAlert className="w-5 h-5" />}
                          title="Plan de Seguridad Vial"
                          description="Gestionar PESV y documentación"
                          onClick={() => navigateToSection('pesv')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'despachos' && (
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">Gestión de Despachos</h2>
                      <p className="text-sm text-muted-foreground">
                        Monitoreo y control de despachos en tiempo real
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Buscar despacho..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 w-[240px]"
                        />
                      </div>
                      <Button variant="outline" className="flex items-center gap-1">
                        <Filter className="w-4 h-4" />
                        <span>Filtros</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs 
                    value={activeDispatchStatus} 
                    onValueChange={(value) => setActiveDispatchStatus(value as any)}
                    className="mb-4"
                  >
                    <TabsList>
                      <TabsTrigger value="todos" className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Todos ({excelData.length})</span>
                      </TabsTrigger>
                      <TabsTrigger value="pendiente" className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pendientes ({pendienteCounts})</span>
                      </TabsTrigger>
                      <TabsTrigger value="en ruta" className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>En Ruta ({enRutaCounts})</span>
                      </TabsTrigger>
                      <TabsTrigger value="completado" className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completados ({completadoCounts})</span>
                      </TabsTrigger>
                      <TabsTrigger value="demorado" className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Demorados ({demoradoCounts})</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={activeDispatchStatus}>
                      <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto max-h-[600px]">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>ESTADO</TableHead>
                                <TableHead className="min-w-[200px]">UBICACIÓN/GRANJA</TableHead>
                                <TableHead>ALIMENTO</TableHead>
                                <TableHead>CONDUCTOR/PLACA</TableHead>
                                <TableHead>CANTIDAD</TableHead>
                                <TableHead>HORA DESPACHO</TableHead>
                                <TableHead>HORA ESTIMADA</TableHead>
                                <TableHead>ACCIÓN</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                  <TableRow key={item.id} className="hover:bg-muted/20">
                                    <TableCell>
                                      <StatusBadge status={item.estado} />
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      <div>{item.ubicacion}</div>
                                      <div className="text-xs text-muted-foreground">{item.granja}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">{item.alimento}</div>
                                      <div className="text-xs text-muted-foreground">Orden: {item.orden}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">{item.conductor}</div>
                                      <div className="text-xs text-muted-foreground">{item.placa}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div>{item.cantidad}</div>
                                      <div className="text-xs text-muted-foreground">{item.ton} ton</div>
                                    </TableCell>
                                    <TableCell>{item.horaDespacho}</TableCell>
                                    <TableCell>{item.horaEstimada}</TableCell>
                                    <TableCell>
                                      <Button variant="outline" size="sm" className="h-8">
                                        Detalles
                                      </Button>
                                    </TableCell>
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
                        
                        <div className="p-2 border-t border rounded-b-lg">
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
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {activeTab === 'excel' && (
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
                      <Button variant="outline" className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Tabs 
                    value={activeDataType} 
                    onValueChange={(value) => setActiveDataType(value as 'reproductora' | 'engorde')}
                    className="mb-4"
                  >
                    <TabsList>
                      <TabsTrigger value="reproductora" className="flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Reproductoras ({reproductoraCounts})</span>
                      </TabsTrigger>
                      <TabsTrigger value="engorde" className="flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>Engorde ({engordeCounts})</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="reproductora">
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
                                    No se encontraron resultados para Reproductoras
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="engorde">
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
                                    No se encontraron resultados para Engorde
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="p-2 border-t border rounded-b-lg">
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
              )}
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
                        <TableHead>Estado</TableHead>
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
                            <TableCell>
                              <StatusBadge status={vehicle.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
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
                        <TableHead>Estado</TableHead>
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
                            <TableCell>
                              <StatusBadge status={driver.status} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
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
