
import { DashboardHeader } from "./dashboard-sections/DashboardHeader";
import { StatsSection } from "./dashboard-sections/StatsSection";
import { DocumentAndQuickAccessSection } from "./dashboard-sections/DocumentAndQuickAccessSection";
import { DispatchStatusChart } from "./dashboard-sections/DispatchStatusChart";

interface DashboardContentProps {
  setActiveTab: (tab: 'dashboard' | 'despachos' | 'excel') => void;
  setActiveDispatchStatus: (status: 'todos' | 'pendiente' | 'en ruta' | 'completado' | 'demorado') => void;
}

export const DashboardContent = ({ 
  setActiveTab, 
  setActiveDispatchStatus 
}: DashboardContentProps) => {
  return (
    <div className="p-6">
      <DashboardHeader />
      <StatsSection 
        setActiveTab={setActiveTab} 
        setActiveDispatchStatus={setActiveDispatchStatus} 
      />
      <DocumentAndQuickAccessSection />
      <DispatchStatusChart />
    </div>
  );
};

export default DashboardContent;
