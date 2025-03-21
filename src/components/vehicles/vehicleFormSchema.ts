
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
  
  // Campo para seleccionar propietario existente o crear uno nuevo
  ownerOption: z.enum(["existing", "new"]),
  ownerId: z.string().optional(),

  // Estos campos solo se usan cuando se crea un nuevo propietario
  ownerFirstName: z.string().optional(),
  ownerLastName: z.string().optional(),
  ownerIdentificationType: z.enum(["CC", "NIT", "CE"] as const).optional(),
  ownerIdentificationNumber: z.string().optional(),
  ownerAddress: z.string().optional(),
  ownerCity: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerHasCredit: z.enum(["si", "no"]).optional(),
  ownerCreditAmount: z.string().optional(),
  ownerCreditTerm: z.string().optional(),
  ownerCreditEndDate: z.date().optional(),
}).refine((data) => {
  // Validación adicional: si se selecciona propietario existente, debe especificarse un ID
  if (data.ownerOption === "existing") {
    return !!data.ownerId;
  }
  
  // Si se crea un nuevo propietario, todos los campos obligatorios deben estar presentes
  if (data.ownerOption === "new") {
    return !!(
      data.ownerFirstName &&
      data.ownerLastName &&
      data.ownerIdentificationType &&
      data.ownerIdentificationNumber &&
      data.ownerAddress &&
      data.ownerCity &&
      data.ownerPhone &&
      data.ownerHasCredit
    );
  }
  
  return true;
}, {
  message: "Debe seleccionar un propietario existente o completar todos los campos para crear uno nuevo",
  path: ["ownerOption"],
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
