
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { vehicleFormSchema } from "./vehicleFormSchema";

type VehicleBasicInfoProps = {
  form: UseFormReturn<z.infer<typeof vehicleFormSchema>>;
};

const VehicleBasicInfo = ({ form }: VehicleBasicInfoProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Información del vehículo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: ABC123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de vehículo</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="camion">Camión</SelectItem>
                  <SelectItem value="camion liviano">Camión liviano</SelectItem>
                  <SelectItem value="dobletroque">Dobletroque</SelectItem>
                  <SelectItem value="camioneta">Camioneta</SelectItem>
                  <SelectItem value="tracto camion">Tracto camión</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ford, Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo (Año)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 2023" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="line"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Línea</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Cargo, Hilux" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Blanco, Azul" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pbvRunt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PBV RUNT</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 10000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emptyWeight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso vacío (kg)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 5000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cargoLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Largo carrocería (m)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 8" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="power"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potencia (HP)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="engineNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Motor</FormLabel>
              <FormControl>
                <Input placeholder="Ej: MF12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="chassisNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Chasis</FormLabel>
              <FormControl>
                <Input placeholder="Ej: CF67890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default VehicleBasicInfo;
