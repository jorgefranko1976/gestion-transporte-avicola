
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

interface BirthDateSectionProps {
  form: UseFormReturn<DriverFormValues>;
  calculateAge: (birthDate: Date | undefined) => string;
}

const BirthDateSection = ({ form, calculateAge }: BirthDateSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="birthDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Fecha de Nacimiento <span className="text-red-500">*</span></FormLabel>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
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
                  disabled={(date) =>
                    date > new Date() || date < new Date("1940-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="text-sm text-muted-foreground">
              {field.value ? calculateAge(field.value) : ''}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BirthDateSection;
