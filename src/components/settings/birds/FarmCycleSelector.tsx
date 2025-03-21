
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { BirdEntryFormValues } from "./schema";
import { mockFarms, mockCycles } from "./mock-data";

interface FarmCycleSelectorProps {
  form: UseFormReturn<BirdEntryFormValues>;
  selectedFarmId: string | null;
  setSelectedFarmId: (farmId: string) => void;
  availableCycles: typeof mockCycles;
  setAvailableCycles: (cycles: typeof mockCycles) => void;
}

const FarmCycleSelector = ({ 
  form, 
  selectedFarmId, 
  setSelectedFarmId,
  availableCycles, 
  setAvailableCycles 
}: FarmCycleSelectorProps) => {
  
  // Filtrar ciclos según la granja seleccionada
  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    const filtered = mockCycles.filter(cycle => cycle.farmId === farmId);
    setAvailableCycles(filtered);
    form.setValue("farmId", farmId);
    
    // Resetear el ciclo si no está disponible para la granja seleccionada
    const currentCycleId = form.getValues("cycleId");
    if (currentCycleId && !filtered.find(c => c.id === currentCycleId)) {
      form.setValue("cycleId", "");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="farmId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Granja</FormLabel>
            <Select 
              onValueChange={(value) => handleFarmChange(value)} 
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una granja" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {mockFarms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="cycleId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciclo de Producción</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value || undefined}
              disabled={!selectedFarmId}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un ciclo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableCycles.length > 0 ? (
                  availableCycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no_cycles_available" disabled>
                    No hay ciclos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {!selectedFarmId && (
              <FormDescription>
                Selecciona primero una granja
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FarmCycleSelector;
