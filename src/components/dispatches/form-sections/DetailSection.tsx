
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DispatchFormValues } from '../schemas/dispatchFormSchema';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DetailSectionProps {
  form: UseFormReturn<DispatchFormValues>;
  openCalendar: boolean;
  setOpenCalendar: (open: boolean) => void;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ form, openCalendar, setOpenCalendar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="packages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Paquetes</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min={1} 
                placeholder="Paquetes" 
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="concentrateAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de Concentrado (Ton.)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                placeholder="Cantidad en toneladas" 
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="eta"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha Estimada de Llegada</FormLabel>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? format(field.value, "PPP") : "Seleccionar fecha"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value || undefined}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpenCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
