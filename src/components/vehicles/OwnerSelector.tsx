
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues } from "./vehicleFormSchema";
import { VehicleOwner } from "@/lib/types";

// Normalmente esto vendría de una base de datos
import { mockOwners } from "@/data/mockData";

interface OwnerSelectorProps {
  form: UseFormReturn<VehicleFormValues>;
  onOwnerTypeChange: (type: "existing" | "new") => void;
}

const OwnerSelector = ({ form, onOwnerTypeChange }: OwnerSelectorProps) => {
  const [owners, setOwners] = useState<VehicleOwner[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOwners, setFilteredOwners] = useState<VehicleOwner[]>([]);
  
  const ownerOption = form.watch("ownerOption");

  // Simulando carga de propietarios, en una implementación real esto vendría de una API
  useEffect(() => {
    setOwners(mockOwners || []);
    setFilteredOwners(mockOwners || []);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = owners.filter(owner => 
        `${owner.firstName || ''} ${owner.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (owner.identificationNumber && owner.identificationNumber.includes(searchTerm))
      );
      setFilteredOwners(filtered);
    } else {
      setFilteredOwners(owners);
    }
  }, [searchTerm, owners]);

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="ownerOption"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Propietario del vehículo</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  onOwnerTypeChange(value as "existing" | "new");
                }}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="existing" />
                  </FormControl>
                  <FormLabel className="font-normal flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Seleccionar propietario existente
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="new" />
                  </FormControl>
                  <FormLabel className="font-normal flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar nuevo propietario
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {ownerOption === "existing" && (
        <div className="space-y-4">
          <Input
            placeholder="Buscar propietario por nombre o identificación"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          <FormField
            control={form.control}
            name="ownerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seleccionar propietario</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar propietario" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id || "no_id"}>
                        {owner.firstName || ""} {owner.lastName || ""} - {owner.identificationType || ""}: {owner.identificationNumber || ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default OwnerSelector;
