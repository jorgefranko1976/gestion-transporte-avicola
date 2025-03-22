
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { UserProfile } from '@/lib/types';

interface IdentificationFieldsProps {
  form: UseFormReturn<UserProfile>;
}

const IdentificationFields: React.FC<IdentificationFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="identificationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Identificación</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Identificación" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                <SelectItem value="NIT">NIT</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="identificationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Identificación</FormLabel>
            <FormControl>
              <Input placeholder="Número de Identificación" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default IdentificationFields;
