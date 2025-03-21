
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProductionCycleFormValues } from "../farmFormSchema";

interface GrowthProfileSelectorProps {
  form: UseFormReturn<ProductionCycleFormValues>;
  profiles: Array<{
    id: string;
    name: string;
    breed: string;
    sex: string;
  }>;
}

const GrowthProfileSelector = ({ form, profiles }: GrowthProfileSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="growthProfileId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Perfil de Crecimiento</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar perfil" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default GrowthProfileSelector;
