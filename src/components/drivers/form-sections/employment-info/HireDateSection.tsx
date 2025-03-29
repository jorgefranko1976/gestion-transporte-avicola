
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DriverFormValues } from '../../schemas/driverFormSchema';

interface HireDateSectionProps {
  form: UseFormReturn<DriverFormValues>;
}

const HireDateSection = ({ form }: HireDateSectionProps) => {
  // Cálculo de límites para el calendario
  const currentYear = new Date().getFullYear();
  const fromYear = currentYear - 10; // Permitir fechas desde 10 años atrás
  const toYear = currentYear + 2; // Permitir fechas hasta 2 años en el futuro
  
  return (
    <FormField
      control={form.control}
      name="hireDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Fecha de Contratación <span className="text-red-500">*</span></FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                captionLayout="dropdown-buttons"
                fromYear={fromYear}
                toYear={toYear}
                classNames={{
                  caption_dropdowns: "flex justify-center gap-1",
                  caption_label: "text-sm font-medium hidden",
                  dropdown: "p-1",
                  dropdown_month: "text-sm py-1 px-2 rounded hover:bg-accent",
                  dropdown_year: "text-sm py-1 px-2 rounded hover:bg-accent",
                  vhidden: "sr-only",
                }}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default HireDateSection;
