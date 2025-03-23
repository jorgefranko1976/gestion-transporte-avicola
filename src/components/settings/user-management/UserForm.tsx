
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserProfile, UserRole } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Switch,
} from '@/components/ui/switch';

// Esquema de validación con zod
const userFormSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').optional(),
  role: z.enum(['admin', 'coordinator', 'driver', 'owner']),
  identificationType: z.enum(['CC', 'CE', 'NIT']),
  identificationNumber: z.string().min(3, 'Número de identificación inválido'),
  phone: z.string().optional(),
  active: z.boolean(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  initialData?: UserProfile;
  onSave: (data: UserProfile) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ initialData, onSave, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData 
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email ?? '',
          role: initialData.role as UserRole,
          identificationType: initialData.identificationType as 'CC' | 'CE' | 'NIT',
          identificationNumber: initialData.identificationNumber,
          phone: initialData.phone ?? '',
          active: initialData.active,
        } 
      : {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'driver',
          identificationType: 'CC',
          identificationNumber: '',
          phone: '',
          active: true,
        },
  });

  const handleSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Si es un nuevo usuario y tenemos contraseña
      if (!initialData && data.password) {
        const result = await signUp({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role as UserRole,
          identificationType: data.identificationType,
          identificationNumber: data.identificationNumber,
          phone: data.phone
        });

        if (!result.success) {
          toast.error(result.error || 'Error al crear usuario');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Siempre llamamos a onSave para actualizar la UI
      const userData: UserProfile = {
        id: initialData?.id || `new-${Date.now()}`, // En realidad su ID será asignada por Supabase
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        identificationType: data.identificationType,
        identificationNumber: data.identificationNumber,
        phone: data.phone || '',
        active: data.active,
        createdAt: initialData?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      
      onSave(userData);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Ha ocurrido un error al guardar el usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input type="email" placeholder="correo@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo de contraseña solo para nuevos usuarios */}
        {!initialData && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña</FormLabel>
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
        )}

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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol de Usuario</FormLabel>
                <Select
                  onValueChange={field.onChange as (value: string) => void}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="coordinator">Coordinador</SelectItem>
                    <SelectItem value="driver">Conductor</SelectItem>
                    <SelectItem value="owner">Propietario de Vehículo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Estado del Usuario</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {field.value ? 'Usuario activo en el sistema' : 'Usuario inactivo en el sistema'}
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{initialData ? 'Actualizando...' : 'Creando...'}</span>
              </div>
            ) : (
              initialData ? 'Actualizar Usuario' : 'Crear Usuario'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
