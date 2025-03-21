
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PortalLayout } from '@/components/layout/PortalLayout';
import DriversHeader from './DriversHeader';
import DriversTabs from './DriversTabs';

const DriversPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lista");

  const handleRegisterClick = () => {
    setActiveTab("nuevo");
  };

  return (
    <PortalLayout 
      title="Gestión de Conductores" 
      description="Administra la información y documentación de los conductores"
      rightContent={<DriversHeader activeTab={activeTab} onRegisterClick={handleRegisterClick} />}
    >
      <DriversTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onRegisterClick={handleRegisterClick} 
      />
    </PortalLayout>
  );
};

export default DriversPage;
