
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductionCycleFormValues } from "../farmFormSchema";
import { Farm } from "@/lib/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bird, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BirdAndConcentrateInputsProps {
  form: UseFormReturn<ProductionCycleFormValues>;
  selectedFarm: Farm | null;
}

interface ShedEntry {
  shedNumber: number;
  birdCount: number;
}

const BirdAndConcentrateInputs = ({ form, selectedFarm }: BirdAndConcentrateInputsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shedEntries, setShedEntries] = useState<ShedEntry[]>([]);
  const [shedNumber, setShedNumber] = useState<number>(1);
  const [birdCount, setBirdCount] = useState<number>(0);
  
  const totalBirds = shedEntries.reduce((sum, entry) => sum + entry.birdCount, 0);
  
  // Actualizar la cantidad inicial de aves cuando cambia el total
  const updateInitialBirdCount = (total: number) => {
    form.setValue("initialBirdCount", total);
  };
  
  const addShedEntry = () => {
    if (shedNumber > 0 && birdCount > 0) {
      // Verificar si ya existe un galpón con ese número
      const existingIndex = shedEntries.findIndex(entry => entry.shedNumber === shedNumber);
      
      if (existingIndex >= 0) {
        // Actualizar entrada existente
        const updatedEntries = [...shedEntries];
        updatedEntries[existingIndex] = { shedNumber, birdCount };
        setShedEntries(updatedEntries);
      } else {
        // Agregar nueva entrada
        setShedEntries([...shedEntries, { shedNumber, birdCount }]);
      }
      
      // Actualizar total
      const newTotal = [...shedEntries.filter(e => e.shedNumber !== shedNumber), { shedNumber, birdCount }]
        .reduce((sum, entry) => sum + entry.birdCount, 0);
      
      updateInitialBirdCount(newTotal);
      
      // Resetear inputs
      setShedNumber(shedNumber + 1);
      setBirdCount(0);
    }
  };
  
  const removeShedEntry = (shedToRemove: number) => {
    const updatedEntries = shedEntries.filter(entry => entry.shedNumber !== shedToRemove);
    setShedEntries(updatedEntries);
    
    // Actualizar total
    const newTotal = updatedEntries.reduce((sum, entry) => sum + entry.birdCount, 0);
    updateInitialBirdCount(newTotal);
  };
  
  return (
    <>
      <FormField
        control={form.control}
        name="initialBirdCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad Inicial de Aves</FormLabel>
            <div className="flex space-x-2">
              <FormControl>
                <Input 
                  type="number" 
                  min="1" 
                  max={selectedFarm?.chickenCapacity} 
                  readOnly={shedEntries.length > 0}
                  {...field} 
                />
              </FormControl>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" type="button" className="flex items-center gap-1">
                    <Bird className="h-4 w-4" />
                    <span className="hidden sm:inline">Distribución</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Distribución de Aves por Galpón</DialogTitle>
                    <DialogDescription>
                      Especifica cómo serán distribuidas las aves en los galpones de la granja.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-2">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Galpón #</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={shedNumber}
                          onChange={(e) => setShedNumber(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Cantidad de Aves</label>
                        <Input 
                          type="number" 
                          min="1"
                          value={birdCount}
                          onChange={(e) => setBirdCount(parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          variant="secondary" 
                          onClick={addShedEntry}
                          className="mb-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {shedEntries.length > 0 ? (
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm font-medium">Distribución de Aves</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            {shedEntries.map((entry) => (
                              <div key={entry.shedNumber} className="flex justify-between items-center border-b pb-2">
                                <span>Galpón #{entry.shedNumber}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{entry.birdCount.toLocaleString()} aves</span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeShedEntry(entry.shedNumber)}
                                    className="h-6 w-6 p-0"
                                  >
                                    &times;
                                  </Button>
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex justify-between items-center pt-2 font-medium">
                              <span>Total</span>
                              <span>{totalBirds.toLocaleString()} aves</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No hay entradas de galpones. Agrega al menos una.
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Confirmar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {shedEntries.length > 0 && (
              <FormDescription>
                {shedEntries.length} galpón(es) configurados con {totalBirds.toLocaleString()} aves en total
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="concentrateReserve"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reserva de Concentrado (toneladas)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0" 
                step="0.1" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BirdAndConcentrateInputs;
