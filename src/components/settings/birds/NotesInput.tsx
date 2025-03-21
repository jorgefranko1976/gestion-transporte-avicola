
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BirdEntryFormValues } from "./schema";

interface NotesInputProps {
  form: UseFormReturn<BirdEntryFormValues>;
}

const NotesInput = ({ form }: NotesInputProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Observaciones</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Ingresa cualquier observación sobre el estado de las aves..." 
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
