
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
import { colombianDepartments } from "./colombianDepartments";
import { FarmFormValues } from "./farmFormSchema";
import { WaterSource } from "@/lib/types";

interface FarmBasicInfoProps {
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

const FarmBasicInfo = ({ form }: FarmBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default FarmBasicInfo;
