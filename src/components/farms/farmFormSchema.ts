
import * as z from "zod";

export const farmFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  department: z.string().min(1, "Debes seleccionar un departamento"),
  zone: z.string().min(1, "La zona es requerida"),
  internalId: z.string().min(1, "El identificador interno es requerido"),
  waterSource: z.enum(["acueducto", "carrotanque", "pozo", "nacedero", "rio", "caño"] as const),
  contactPerson: z.string().min(3, "El nombre de la persona de contacto es requerido"),
  contactPhone: z.string().min(7, "El teléfono debe tener al menos 7 dígitos"),
  chickenCapacity: z.coerce.number().min(1, "La capacidad debe ser mayor a 0"),
  concentrateCapacity: z.coerce.number().min(0.1, "La capacidad debe ser mayor a 0"),
  shedsCount: z.coerce.number().int().min(1, "Debe haber al menos un galpón"),
});

export type FarmFormValues = z.infer<typeof farmFormSchema>;
