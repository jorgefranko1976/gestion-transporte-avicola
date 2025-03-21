
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FarmFormValues } from "../farmFormSchema";

interface FarmContactSectionProps {
  form: UseFormReturn<FarmFormValues>;
}

const FarmContactSection = ({ form }: FarmContactSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="contactPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Persona de Contacto</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. Juan Pérez" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contactPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono de Contacto</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. 3101234567" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FarmContactSection;
