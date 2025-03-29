
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { UserProfile } from '@/lib/types';

interface RoleAndPhoneSectionProps {
  form: UseFormReturn<UserProfile>;
}

const RoleAndPhoneSection = ({ form }: RoleAndPhoneSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input placeholder="Teléfono" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rol de Usuario</FormLabel>
            <Select
              onValueChange={field.onChange as (value: string) => void}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="coordinator">Coordinador</SelectItem>
                <SelectItem value="driver">Conductor</SelectItem>
                <SelectItem value="owner">Propietario de Vehículo</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RoleAndPhoneSection;
