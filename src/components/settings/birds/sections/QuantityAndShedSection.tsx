
import { UseFormReturn } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BirdEntryFormValues } from "../hooks/useBirdEntryForm";

interface QuantityAndShedSectionProps {
  form: UseFormReturn<BirdEntryFormValues>;
}

const QuantityAndShedSection = ({ form }: QuantityAndShedSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de Aves</FormLabel>
            <FormControl>
              <Input type="number" placeholder="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="shedNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Galpón</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default QuantityAndShedSection;
