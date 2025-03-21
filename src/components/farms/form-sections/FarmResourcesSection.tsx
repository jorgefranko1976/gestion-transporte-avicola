
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WaterSource } from "@/lib/types";
import { FarmFormValues } from "../farmFormSchema";

interface FarmResourcesSectionProps {
  form: UseFormReturn<FarmFormValues>;
}

const waterSourceOptions: { value: WaterSource; label: string }[] = [
  { value: "acueducto", label: "Acueducto" },
  { value: "carrotanque", label: "Carrotanque" },
  { value: "pozo", label: "Pozo" },
  { value: "nacedero", label: "Nacedero" },
  { value: "rio", label: "Río" },
  { value: "caño", label: "Caño" },
];

const FarmResourcesSection = ({ form }: FarmResourcesSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="waterSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fuente de Agua</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una fuente de agua" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {waterSourceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
        name="chickenCapacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacidad en Pollos</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                min="1" 
                step="1" 
                placeholder="Ej. 10000" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="concentrateCapacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacidad en Toneladas de Concentrado</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                min="0.1" 
                step="0.1" 
                placeholder="Ej. 5.5" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="shedsCount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de Galpones</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="number" 
                min="1" 
                step="1" 
                placeholder="Ej. 5" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FarmResourcesSection;
