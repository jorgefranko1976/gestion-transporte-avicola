
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DriverFormValues } from '../../schemas/driverFormSchema';

interface ContactSectionProps {
  form: UseFormReturn<DriverFormValues>;
}

const ContactSection = ({ form }: ContactSectionProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Dirección completa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contacto de Emergencia <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Número de contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ContactSection;
