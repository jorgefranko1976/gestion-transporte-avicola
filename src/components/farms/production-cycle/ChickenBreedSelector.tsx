
import { ChickenBreed } from "@/lib/types";
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

interface ChickenBreedSelectorProps {
  form: UseFormReturn<ProductionCycleFormValues>;
  onBreedChange: () => void;
}

const chickenBreeds = [
  { value: "cobb500", label: "Cobb 500" },
  { value: "ross308", label: "Ross 308" },
  { value: "hubbard", label: "Hubbard" },
  { value: "arbor_acres", label: "Arbor Acres" },
  { value: "otras", label: "Otras razas" },
];

const ChickenBreedSelector = ({ form, onBreedChange }: ChickenBreedSelectorProps) => {
  return (
    <FormField
      control={form.control}
      name="breed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Raza de Ave</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onBreedChange();
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar raza" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {chickenBreeds.map((breed) => (
                <SelectItem key={breed.value} value={breed.value}>
                  {breed.label}
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

export default ChickenBreedSelector;
