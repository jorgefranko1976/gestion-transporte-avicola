
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DispatchFormValues } from '../schemas/dispatchFormSchema';

interface DestinationSectionProps {
  form: UseFormReturn<DispatchFormValues>;
}

export const DestinationSection: React.FC<DestinationSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Destino</FormLabel>
            <FormControl>
              <Input placeholder="Destino" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="zone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Zona (Opcional)</FormLabel>
            <FormControl>
              <Input placeholder="Zona" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
