
import { AlertCircle, Calendar, CheckCircle, Clock, Filter, MapPin, Package, RefreshCw, ShieldAlert, Truck, Users } from "lucide-react";
import { dispatchStats, documentsToExpire, dispatchesByStatus } from "@/data/mockData";
import { StatCard } from "@/components/dashboard/stat-card";
import { DocumentCard } from "@/components/dashboard/document-card";
import { QuickNavCard } from "@/components/dashboard/quick-nav-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart as RechartPieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from "react-router-dom";

interface DashboardContentProps {
  setActiveTab: (tab: 'dashboard' | 'despachos' | 'excel') => void;
  setActiveDispatchStatus: (status: 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado') => void;
}

export const DashboardContent = ({ 
  setActiveTab, 
  setActiveDispatchStatus 
}: DashboardContentProps) => {
  const navigate = useNavigate();
  
  const navigateToSection = (section: 'vehicles' | 'drivers' | 'reports' | 'pesv') => {
    navigate(`/${section}`);
  };

  return (
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
        
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">Documentos por Vencer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documentsToExpire.map(doc => (
              <DocumentCard key={doc.id} {...doc} />
            ))}
          </div>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Estado de Despachos</CardTitle>
          <CardDescription>Distribución actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center">
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
                <RechartsTooltip formatter={(value, name) => [`${value} despachos`, name]} />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardContent;
