
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Bird, ArrowDownToLine, Info, Plus } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useState } from "react";
import BirdEntryForm from "./birds/BirdEntryForm";

// Datos de muestra para ingreso de aves
const mockBirdEntries = [
  {
    id: "1",
    cycleId: "1",
    farmName: "Granja El Encanto",
    entryDate: new Date(2023, 6, 15),
    quantity: 9500,
    shedNumber: 1,
    breed: "cobb500",
    notes: "Ingreso en buenas condiciones",
    createdBy: "Juan Pérez"
  },
  {
    id: "2",
    cycleId: "2",
    farmName: "Granja Los Pinos",
    entryDate: new Date(2023, 5, 20),
    quantity: 8000,
    shedNumber: 2,
    breed: "ross308",
    notes: "Se observaron algunas aves débiles",
    createdBy: "María López"
  }
];

const BreedsSettings = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Ingreso de Aves</h2>
          <p className="text-muted-foreground">
            Gestiona el ingreso de aves a los galpones en los ciclos de producción
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
          <ArrowDownToLine className="h-4 w-4" />
          <span>Registrar Ingreso</span>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Registro de Ingresos Recientes</CardTitle>
          <CardDescription>
            Historial de los últimos ingresos de aves a galpones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Granja</TableHead>
                <TableHead>Galpón</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Registrado por</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBirdEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.entryDate.toLocaleDateString()}</TableCell>
                  <TableCell>{entry.farmName}</TableCell>
                  <TableCell>{entry.shedNumber}</TableCell>
                  <TableCell>{entry.quantity.toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{entry.breed.replace("_", " ")}</TableCell>
                  <TableCell>{entry.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Ingreso de Aves</DialogTitle>
            <DialogDescription>
              Completa el formulario para registrar un nuevo ingreso de aves a un galpón
            </DialogDescription>
          </DialogHeader>
          <BirdEntryForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BreedsSettings;
