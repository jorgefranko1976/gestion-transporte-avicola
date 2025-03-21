
import { Clock, CheckCircle, AlertCircle, Package } from "lucide-react";
import { dispatchStats } from "@/data/mockData";
import { StatCard } from "@/components/dashboard/stat-card";

interface StatsSectionProps {
  setActiveTab: (tab: 'dashboard' | 'despachos' | 'excel') => void;
  setActiveDispatchStatus: (status: 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado') => void;
}

export const StatsSection = ({ setActiveTab, setActiveDispatchStatus }: StatsSectionProps) => {
  return (
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
  );
};
