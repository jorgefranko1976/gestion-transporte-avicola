
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DispatchFormValues } from '../schemas/dispatchFormSchema';

interface FarmSectionProps {
  form: UseFormReturn<DispatchFormValues>;
}

export const FarmSection: React.FC<FarmSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="farm"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Granja</FormLabel>
            <FormControl>
              <Input placeholder="Nombre de la granja" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="farmId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID de Granja</FormLabel>
            <FormControl>
              <Input placeholder="ID de la granja" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
