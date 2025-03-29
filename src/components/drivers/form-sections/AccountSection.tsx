
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DriverFormValues } from '../schemas/driverFormSchema';

interface AccountSectionProps {
  form: UseFormReturn<DriverFormValues>;
}

const AccountSection = ({ form }: AccountSectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Información de cuenta de usuario</h3>
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo Electrónico <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="ejemplo@correo.com" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Confirme su contraseña" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
        <p>Al crear un conductor, se creará automáticamente una cuenta con el rol "Conductor" que le permitirá acceder al sistema con las credenciales indicadas.</p>
      </div>
    </div>
  );
};

export default AccountSection;
