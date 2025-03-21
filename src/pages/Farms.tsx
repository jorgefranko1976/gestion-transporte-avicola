
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { Button } from "@/components/ui/button";
import { Farm } from '@/lib/types';
import { Plus, House, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FarmForm from '@/components/farms/FarmForm';
import FarmList from '@/components/farms/FarmList';

// Mock data para granjas
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

const Farms = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>(mockFarms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFarms = farms.filter(farm => 
    farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.internalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farm.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Granja</span>
              </Button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
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
    </div>
  );
};

export default Farms;
