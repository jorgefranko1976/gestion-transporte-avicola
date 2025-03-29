
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DriverFormValues } from '../../schemas/driverFormSchema';

interface NameSectionProps {
  form: UseFormReturn<DriverFormValues>;
}

const NameSection = ({ form }: NameSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Nombre" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apellidos <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Apellidos" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default NameSection;
