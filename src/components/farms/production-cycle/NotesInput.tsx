
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ProductionCycleFormValues } from "../farmFormSchema";

interface NotesInputProps {
  form: UseFormReturn<ProductionCycleFormValues>;
}

const NotesInput = ({ form }: NotesInputProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem className="col-span-2">
          <FormLabel>Notas</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Notas adicionales para este ciclo de producción" 
              className="resize-none" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NotesInput;
