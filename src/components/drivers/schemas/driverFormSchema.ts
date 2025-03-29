
import { z } from 'zod';

// Schema de validación para el formulario
export const driverFormSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  identificationType: z.enum(['CC', 'CE', 'NIT', 'TI', 'OTRO'], {
    required_error: 'Seleccione un tipo de identificación',
  }),
  identificationNumber: z.string().min(5, 'Número de identificación inválido'),
  birthDate: z.date({
    required_error: 'La fecha de nacimiento es requerida',
  }),
  address: z.string().min(5, 'La dirección es requerida'),
  phone: z.string().min(7, 'Número de teléfono inválido'),
  emergencyContact: z.string().min(7, 'Contacto de emergencia inválido'),
  hireDate: z.date({
    required_error: 'La fecha de contratación es requerida',
  }),
  licenseExpiration: z.date({
    required_error: 'La fecha de vencimiento de licencia es requerida',
  }).optional(),
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo electrónico es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La confirmación de contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;
