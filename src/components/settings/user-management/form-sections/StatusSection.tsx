
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { UserProfile } from '@/lib/types';

interface StatusSectionProps {
  form: UseFormReturn<UserProfile>;
}

const StatusSection = ({ form }: StatusSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel>Estado del Usuario</FormLabel>
            <div className="text-sm text-muted-foreground">
              {field.value ? 'Usuario activo en el sistema' : 'Usuario inactivo en el sistema'}
            </div>
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default StatusSection;
