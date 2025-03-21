
import { z } from 'zod';
import { IdentificationType } from '@/lib/types';

// Schema de validación para el formulario
export const driverFormSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  identificationType: z.enum(['CC', 'CE', 'NIT', 'TI', 'OTRO']),
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
  licenseExpiration: z.date().optional(),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

// Estado para los documentos
export interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}
