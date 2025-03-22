
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GrowthProfileFormValues } from "@/components/farms/farmFormSchema";

interface ProfileBasicFieldsProps {
  form: UseFormReturn<GrowthProfileFormValues>;
}

const ProfileBasicFields = ({ form }: ProfileBasicFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Perfil</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Engorde Estándar - 45 días" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción (opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Descripción breve..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="breed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Raza</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar raza" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cobb500">Cobb 500</SelectItem>
                <SelectItem value="ross308">Ross 308</SelectItem>
                <SelectItem value="hubbard">Hubbard</SelectItem>
                <SelectItem value="arbor_acres">Arbor Acres</SelectItem>
                <SelectItem value="otras">Otras razas</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sexo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="macho">Machos</SelectItem>
                <SelectItem value="hembra">Hembras</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProfileBasicFields;
