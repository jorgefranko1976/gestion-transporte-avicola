
import { useState } from 'react';
import { cn } from '@/lib/utils';

type TabId = 'basic' | 'documents' | 'observations' | 'vehicle';

interface Tab {
  id: TabId;
  label: string;
}

interface TabsContainerProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const tabs: Tab[] = [
  { id: 'basic', label: 'Información Básica' },
  { id: 'documents', label: 'Documentos' },
  { id: 'observations', label: 'Observaciones' },
  { id: 'vehicle', label: 'Asignación de Vehículo' },
];

const TabsContainer = ({ activeTab, setActiveTab }: TabsContainerProps) => {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors",
            activeTab === tab.id 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsContainer;
export type { TabId };
