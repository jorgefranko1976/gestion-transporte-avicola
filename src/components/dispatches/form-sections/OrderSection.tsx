
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DispatchFormValues } from '../schemas/dispatchFormSchema';

interface OrderSectionProps {
  form: UseFormReturn<DispatchFormValues>;
}

export const OrderSection: React.FC<OrderSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="orderId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID de Orden</FormLabel>
            <FormControl>
              <Input placeholder="Ej: ORD-12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="loadingCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Empresa de Carga</FormLabel>
            <FormControl>
              <Input placeholder="Empresa de carga" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
