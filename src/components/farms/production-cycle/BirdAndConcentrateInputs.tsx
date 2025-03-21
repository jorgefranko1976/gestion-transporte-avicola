
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductionCycleFormValues } from "../farmFormSchema";
import { Farm } from "@/lib/types";

interface BirdAndConcentrateInputsProps {
  form: UseFormReturn<ProductionCycleFormValues>;
  selectedFarm: Farm | null;
}

const BirdAndConcentrateInputs = ({ form, selectedFarm }: BirdAndConcentrateInputsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="initialBirdCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad Inicial de Aves</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="1" 
                max={selectedFarm?.chickenCapacity} 
                {...field} 
              />
            </FormControl>
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
