
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, LineChart, Tags, Settings as SettingsIcon, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import GrowthProfilesSettings from "@/components/settings/GrowthProfilesSettings";
import BreedsSettings from "@/components/settings/BreedsSettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import UsersSettings from "@/components/settings/user-management/UsersSettings";
import PageTransition from "@/components/transitions/PageTransition";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("growth-profiles");

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-10">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
            <p className="text-muted-foreground">
              Gestiona los parámetros y configuraciones del sistema
            </p>
          </div>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="mb-8 grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="growth-profiles" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span>Perfiles de Crecimiento</span>
              </TabsTrigger>
              <TabsTrigger value="breeds" className="flex items-center gap-2">
                <Tags className="h-4 w-4" />
                <span>Razas</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Usuarios</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="growth-profiles" className="space-y-8">
              <GrowthProfilesSettings />
            </TabsContent>
            
            <TabsContent value="breeds" className="space-y-8">
              <BreedsSettings />
            </TabsContent>
            
            <TabsContent value="users" className="space-y-8">
              <UsersSettings />
            </TabsContent>
            
            <TabsContent value="general" className="space-y-8">
              <GeneralSettings />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
};

export default Settings;
