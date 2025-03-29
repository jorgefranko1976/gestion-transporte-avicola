
import { cn } from '@/lib/utils';

type TabType = 'basic' | 'account' | 'documents' | 'observations' | 'vehicle';

interface FormTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const FormTabs = ({ activeTab, setActiveTab }: FormTabsProps) => {
  return (
    <div className="flex border-b mb-6 overflow-x-auto">
      <button
        onClick={() => setActiveTab('basic')}
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
          activeTab === 'basic' 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        Información Básica
      </button>
      <button
        onClick={() => setActiveTab('account')}
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
          activeTab === 'account' 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        Cuenta de Usuario
      </button>
      <button
        onClick={() => setActiveTab('documents')}
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
          activeTab === 'documents' 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        Documentos
      </button>
      <button
        onClick={() => setActiveTab('observations')}
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
          activeTab === 'observations' 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        Observaciones
      </button>
      <button
        onClick={() => setActiveTab('vehicle')}
        className={cn(
          "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
          activeTab === 'vehicle' 
            ? "border-primary text-primary" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
      >
        Asignación de Vehículo
      </button>
    </div>
  );
};

export default FormTabs;
