
import { Farm } from "@/lib/types";
import {
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

interface FarmSelectorProps {
  farms: Farm[];
  onFarmChange: (farmId: string) => void;
}

const FarmSelector = ({ farms, onFarmChange }: FarmSelectorProps) => {
  return (
    <FormItem className="space-y-0">
      <FormLabel>Granja</FormLabel>
      <Select onValueChange={onFarmChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar granja" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {farms.filter(farm => farm.active).map((farm) => (
            <SelectItem key={farm.id} value={farm.id}>
              {farm.name} - {farm.internalId}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default FarmSelector;
