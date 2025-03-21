
import { cn } from '@/lib/utils';
import { BarChart3, FileSpreadsheet, List } from 'lucide-react';

interface CoordinatorTabsProps {
  activeTab: 'dashboard' | 'despachos' | 'excel';
  onChangeTab: (tab: 'dashboard' | 'despachos' | 'excel') => void;
}

const CoordinatorTabs = ({ activeTab, onChangeTab }: CoordinatorTabsProps) => {
  return (
    <div className="flex border-b border-border">
      <button
        onClick={() => onChangeTab('dashboard')}
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
        onClick={() => onChangeTab('despachos')}
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
        onClick={() => onChangeTab('excel')}
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
  );
};

export default CoordinatorTabs;
