
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { vehicleFormSchema } from "../vehicleFormSchema";

type OwnerPersonalInfoProps = {
  form: UseFormReturn<z.infer<typeof vehicleFormSchema>>;
};

const OwnerPersonalInfo = ({ form }: OwnerPersonalInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="ownerFirstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombres</FormLabel>
            <FormControl>
              <Input placeholder="Nombres del propietario" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerLastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apellidos</FormLabel>
            <FormControl>
              <Input placeholder="Apellidos del propietario" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerIdentificationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de identificación</FormLabel>
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
                <SelectItem value="CC">CC - Cédula de Ciudadanía</SelectItem>
                <SelectItem value="NIT">NIT - Número de Identificación Tributaria</SelectItem>
                <SelectItem value="CE">CE - Cédula de Extranjería</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerIdentificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de identificación</FormLabel>
            <FormControl>
              <Input placeholder="Ej: 1234567890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dirección</FormLabel>
            <FormControl>
              <Input placeholder="Dirección completa" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerCity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <FormControl>
              <Input placeholder="Ciudad de residencia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ownerPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Teléfono</FormLabel>
            <FormControl>
              <Input placeholder="Número de contacto" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default OwnerPersonalInfo;
