
import { UseFormReturn } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BirdEntryFormValues } from "../hooks/useBirdEntryForm";

interface DateAndBreedSectionProps {
  form: UseFormReturn<BirdEntryFormValues>;
}

const DateAndBreedSection = ({ form }: DateAndBreedSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="entryDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Fecha de Ingreso</FormLabel>
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
                      format(field.value, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="breed"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Raza</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una raza" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="cobb500">Cobb 500</SelectItem>
                <SelectItem value="ross308">Ross 308</SelectItem>
                <SelectItem value="hubbard">Hubbard</SelectItem>
                <SelectItem value="arbor_acres">Arbor Acres</SelectItem>
                <SelectItem value="otras">Otras</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DateAndBreedSection;
