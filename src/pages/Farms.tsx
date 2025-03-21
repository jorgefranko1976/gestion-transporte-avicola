import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { Button } from "@/components/ui/button";
import { Farm, ProductionCycle } from '@/lib/types';
import { Plus, House, Filter, LineChart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FarmForm from '@/components/farms/FarmForm';
import FarmList from '@/components/farms/FarmList';
import QuickNavCard from '@/components/dashboard/quick-nav-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductionCycleForm from '@/components/farms/ProductionCycleForm';

const mockFarms: Farm[] = [
  {
    id: "1",
    name: "Granja El Encanto",
    department: "Cundinamarca",
    zone: "Norte",
    internalId: "GRA-001",
    waterSource: "acueducto",
    contactPerson: "Juan Pérez",
    contactPhone: "3101234567",
    chickenCapacity: 10000,
    concentrateCapacity: 5.5,
    shedsCount: 5,
    active: true,
    createdAt: new Date()
  },
  {
    id: "2",
    name: "Granja Los Pinos",
    department: "Antioquia",
    zone: "Oriente",
    internalId: "GRA-002",
    waterSource: "pozo",
    contactPerson: "María López",
    contactPhone: "3157654321",
    chickenCapacity: 15000,
    concentrateCapacity: 8.2,
    shedsCount: 8,
    active: true,
    createdAt: new Date()
  },
  {
    id: "3",
    name: "Granja El Paraíso",
    department: "Valle del Cauca",
    zone: "Centro",
    internalId: "GRA-003",
    waterSource: "rio",
    contactPerson: "Carlos Gómez",
    contactPhone: "3009876543",
    chickenCapacity: 8000,
    concentrateCapacity: 4.0,
    shedsCount: 3,
    active: false,
    createdAt: new Date()
  }
];

const mockCycles: ProductionCycle[] = [
  {
    id: "1",
    farmId: "1",
    startDate: new Date(2023, 5, 1),
    estimatedEndDate: new Date(2023, 6, 15),
    initialBirdCount: 9500,
    currentBirdCount: 9350,
    growthProfileId: "profile1",
    dailyRecords: [],
    totalConcentrateReceived: 12.5,
    totalConcentrateConsumed: 10.2,
    concentrateReserve: 2.3,
    status: "active"
  },
  {
    id: "2",
    farmId: "2", 
    startDate: new Date(2023, 4, 15),
    estimatedEndDate: new Date(2023, 6, 1),
    initialBirdCount: 14800,
    currentBirdCount: 14500,
    growthProfileId: "profile2",
    dailyRecords: [],
    totalConcentrateReceived: 18.2,
    totalConcentrateConsumed: 15.8,
    concentrateReserve: 2.4,
    status: "active"
  }
];

const Farms = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [cycles, setCycles] = useState<ProductionCycle[]>(mockCycles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateCycleDialogOpen, setIsCreateCycleDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("farms");

  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCycles = cycles.filter(cycle => cycle.status === "active");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                  <House className="mr-2 h-7 w-7 text-primary" />
                  Gestión de Granjas
                </h1>
                <p className="text-muted-foreground mt-1">
                  Administra las granjas para la distribución de pollos y concentrados
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateCycleDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LineChart className="w-4 h-4" />
                  <span>Nuevo Ciclo</span>
                </Button>
                
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Granja</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <QuickNavCard
                icon={<LineChart className="w-5 h-5" />}
                title="Ciclos Activos"
                description={`${activeCycles.length} ciclos en producción actualmente`}
                onClick={() => setActiveTab("cycles")}
                className="bg-green-50 hover:bg-green-100"
              />
              
              <QuickNavCard
                icon={<House className="w-5 h-5" />}
                title="Total Granjas"
                description={`${farms.length} granjas registradas en el sistema`}
                onClick={() => setActiveTab("farms")}
                className=""
              />
              
              <QuickNavCard
                icon={<Package className="w-5 h-5" />}
                title="Capacidad Total"
                description={`${farms.reduce((sum, farm) => sum + farm.chickenCapacity, 0).toLocaleString()} pollos`}
                onClick={() => {}}
                className=""
              />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="farms">Granjas</TabsTrigger>
                <TabsTrigger value="cycles">Ciclos de Producción</TabsTrigger>
              </TabsList>
              
              <TabsContent value="farms">
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Buscar granjas..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <FarmList farms={filteredFarms} />
                </div>
              </TabsContent>
              
              <TabsContent value="cycles">
                <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                  <div className="p-4 border-b border-border">
                    <h2 className="text-lg font-medium">Ciclos de Producción Activos</h2>
                  </div>
                  
                  {activeCycles.length > 0 ? (
                    <div className="divide-y">
                      {activeCycles.map(cycle => {
                        const farm = farms.find(f => f.id === cycle.farmId);
                        return (
                          <div key={cycle.id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{farm?.name || "Granja desconocida"}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Inicio: {cycle.startDate.toLocaleDateString()} - Fin estimado: {cycle.estimatedEndDate.toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Aves iniciales</p>
                                <p className="font-medium">{cycle.initialBirdCount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Aves actuales</p>
                                <p className="font-medium">{cycle.currentBirdCount.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Alimento recibido</p>
                                <p className="font-medium">{cycle.totalConcentrateReceived} ton</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Alimento consumido</p>
                                <p className="font-medium">{cycle.totalConcentrateConsumed} ton</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex justify-end space-x-2">
                              <Button variant="outline" size="sm">Ver detalles</Button>
                              <Button variant="outline" size="sm">Registrar consumo</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No hay ciclos de producción activos actualmente
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </PageTransition>
        </div>
      </main>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Nueva Granja</DialogTitle>
            <DialogDescription>
              Completa la información para registrar una nueva granja en el sistema.
            </DialogDescription>
          </DialogHeader>
          
          <FarmForm />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCreateCycleDialogOpen} onOpenChange={setIsCreateCycleDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Ciclo de Producción</DialogTitle>
            <DialogDescription>
              Selecciona la granja y configura los parámetros del nuevo ciclo de producción.
            </DialogDescription>
          </DialogHeader>
          
          <ProductionCycleForm 
            farms={farms.filter(farm => farm.active)} 
            onSuccess={() => setIsCreateCycleDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Farms;
