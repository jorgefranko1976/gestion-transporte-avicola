
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralSettings from "@/components/settings/GeneralSettings";
import UsersSettings from "@/components/settings/user-management/UsersSettings";
import BreedsSettings from "@/components/settings/BreedsSettings";
import GrowthProfilesSettings from "@/components/settings/GrowthProfilesSettings";
import { DatabaseConnectionCheck } from "@/components/ui/database-connection-check";

const Settings = () => {
  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6">Configuración</h1>
      
      <div className="mb-8">
        <DatabaseConnectionCheck />
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="breeds">Razas</TabsTrigger>
          <TabsTrigger value="growth-profiles">Perfiles de Crecimiento</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="users">
          <UsersSettings />
        </TabsContent>
        <TabsContent value="breeds">
          <BreedsSettings />
        </TabsContent>
        <TabsContent value="growth-profiles">
          <GrowthProfilesSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
