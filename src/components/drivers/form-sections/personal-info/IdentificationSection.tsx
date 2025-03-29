
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DriverFormValues } from '../../schemas/driverFormSchema';

interface IdentificationSectionProps {
  form: UseFormReturn<DriverFormValues>;
}

const IdentificationSection = ({ form }: IdentificationSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="identificationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Identificación <span className="text-red-500">*</span></FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="CC">CC</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
                <SelectItem value="NIT">NIT</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="OTRO">Otro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="identificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Identificación <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Número de identificación" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default IdentificationSection;
