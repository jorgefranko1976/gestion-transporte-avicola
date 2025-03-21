
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
import { colombianDepartments } from "../colombianDepartments";
import { FarmFormValues } from "../farmFormSchema";

interface FarmIdentificationSectionProps {
  form: UseFormReturn<FarmFormValues>;
}

const FarmIdentificationSection = ({ form }: FarmIdentificationSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de la Granja</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. Granja El Encanto" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="internalId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identificador Interno</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. GRA-001" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Departamento</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un departamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {colombianDepartments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
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
        name="zone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zona</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Ej. Norte, Sur, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FarmIdentificationSection;
