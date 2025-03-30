
import { z } from 'zod';

// Esquema de validación para el formulario de despacho
export const dispatchFormSchema = z.object({
  orderId: z.string().min(3, 'El ID de orden es requerido'),
  loadingCompany: z.string().min(2, 'La empresa de carga es requerida'),
  destination: z.string().min(2, 'El destino es requerido'),
  zone: z.string().optional(),
  farm: z.string().min(2, 'La granja es requerida'),
  farmId: z.string().min(2, 'La ID de granja es requerida'),
  packages: z.number().min(1, 'El número de paquetes debe ser mayor a 0'),
  concentrateAmount: z.number().optional(),
  eta: z.date().optional().nullable()
});

export type DispatchFormValues = z.infer<typeof dispatchFormSchema>;
