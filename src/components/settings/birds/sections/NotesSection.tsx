
import { UseFormReturn } from "react-hook-form";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { BirdEntryFormValues } from "../hooks/useBirdEntryForm";

interface NotesSectionProps {
  form: UseFormReturn<BirdEntryFormValues>;
}

const NotesSection = ({ form }: NotesSectionProps) => {
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

export default NotesSection;
