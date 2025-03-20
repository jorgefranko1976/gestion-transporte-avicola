
import * as z from "zod";

export const vehicleFormSchema = z.object({
  plate: z.string().min(6, "La placa debe tener al menos 6 caracteres"),
  vehicleType: z.enum(["camion", "camion liviano", "dobletroque", "camioneta", "tracto camion"] as const),
  brand: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
  model: z.string().min(4, "El modelo debe tener al menos 4 caracteres"),
  line: z.string().min(1, "La línea es requerida"),
  color: z.string().min(3, "El color debe tener al menos 3 caracteres"),
  pbvRunt: z.string().min(1, "El PBV RUNT es requerido"),
  emptyWeight: z.string().min(1, "El peso vacío es requerido"),
  cargoLength: z.string().min(1, "El largo de carrocería es requerido"),
  power: z.string().min(1, "La potencia es requerida"),
  engineNumber: z.string().min(1, "El número de motor es requerido"),
  chassisNumber: z.string().min(1, "El número de chasis es requerido"),
  
  ownerFirstName: z.string().min(2, "El nombre del propietario es requerido"),
  ownerLastName: z.string().min(2, "Los apellidos del propietario son requeridos"),
  ownerIdentificationType: z.enum(["CC", "NIT", "CE"] as const),
  ownerIdentificationNumber: z.string().min(5, "El número de identificación es requerido"),
  ownerAddress: z.string().min(5, "La dirección es requerida"),
  ownerCity: z.string().min(2, "La ciudad es requerida"),
  ownerPhone: z.string().min(7, "El teléfono es requerido"),
  ownerHasCredit: z.enum(["si", "no"]),
  ownerCreditAmount: z.string().optional(),
  ownerCreditTerm: z.string().optional(),
  ownerCreditEndDate: z.date().optional(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
