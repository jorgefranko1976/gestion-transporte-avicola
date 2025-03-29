
import { UseFormReturn } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BirdEntryFormValues } from "../hooks/useBirdEntryForm";

interface FarmAndCycleSectionProps {
  form: UseFormReturn<BirdEntryFormValues>;
  farms: Array<{ id: string; name: string }>;
  availableCycles: Array<{ id: string; farmId: string; name: string }>;
  selectedFarmId: string | null;
  onFarmChange: (farmId: string) => void;
}

const FarmAndCycleSection = ({ 
  form, 
  farms, 
  availableCycles, 
  selectedFarmId, 
  onFarmChange 
}: FarmAndCycleSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="farmId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Granja</FormLabel>
            <Select 
              onValueChange={(value) => onFarmChange(value)} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una granja" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {farms.map((farm) => (
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
              value={field.value}
              disabled={!selectedFarmId}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un ciclo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableCycles.map((cycle) => (
                  <SelectItem key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </SelectItem>
                ))}
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

export default FarmAndCycleSection;
