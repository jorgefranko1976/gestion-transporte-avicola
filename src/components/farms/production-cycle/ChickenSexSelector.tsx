
import { ChickenSex } from "@/lib/types";
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
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProductionCycleFormValues } from "../farmFormSchema";

interface ChickenSexSelectorProps {
  form: UseFormReturn<ProductionCycleFormValues>;
  onSexChange: () => void;
}

const chickenSexOptions = [
  { value: "macho", label: "Machos" },
  { value: "hembra", label: "Hembras" },
  { value: "mixto", label: "Mixto" },
];

const ChickenSexSelector = ({ form, onSexChange }: ChickenSexSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="sex"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sexo</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onSexChange();
            }} 
            defaultValue={field.value || "pending_selection"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sexo" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {chickenSexOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ChickenSexSelector;
