import * as z from "zod";
import { ChickenBreedType, ChickenSex, DailyConsumption } from "@/lib/types";

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
  minConcentrateReserve: z.coerce.number().min(0, "La reserva mínima no puede ser negativa").optional(),
});

export type FarmFormValues = z.infer<typeof farmFormSchema>;

// Esquema para ciclos de producción
export const productionCycleFormSchema = z.object({
  startDate: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  estimatedEndDate: z.date({
    required_error: "La fecha de finalización estimada es requerida",
  }),
  initialBirdCount: z.coerce.number().min(1, "La cantidad inicial de aves debe ser mayor a 0"),
  growthProfileId: z.string().min(1, "Debes seleccionar un perfil de crecimiento"),
  breed: z.enum(["cobb500", "ross308", "hubbard", "arbor_acres", "otras"] as const, {
    required_error: "Debes seleccionar una raza",
  }),
  sex: z.enum(["macho", "hembra", "mixto"] as const, {
    required_error: "Debes seleccionar el sexo de las aves",
  }),
  concentrateReserve: z.coerce.number().min(0, "La reserva de concentrado no puede ser negativa"),
  notes: z.string().optional(),
});

export type ProductionCycleFormValues = z.infer<typeof productionCycleFormSchema>;

// Esquema para registros diarios
export const dailyRecordFormSchema = z.object({
  date: z.date({
    required_error: "La fecha del registro es requerida",
  }),
  birdCount: z.coerce.number().min(0, "La cantidad de aves no puede ser negativa"),
  mortality: z.coerce.number().min(0, "La mortalidad no puede ser negativa"),
  actualConsumption: z.coerce.number().min(0, "El consumo real no puede ser negativa"),
  actualWaterConsumption: z.coerce.number().min(0, "El consumo de agua no puede ser negativo").optional(),
  birdWeight: z.coerce.number().min(0, "El peso no puede ser negativo").optional(),
  concentrateReceived: z.coerce.number().min(0, "La cantidad recibida no puede ser negativa"),
  notes: z.string().optional(),
});

export type DailyRecordFormValues = z.infer<typeof dailyRecordFormSchema>;

// Esquema para perfiles de crecimiento (CurveFeed)
export const growthProfileFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().optional(),
  breed: z.enum(["cobb500", "ross308", "hubbard", "arbor_acres", "otras"] as const, {
    required_error: "Debes seleccionar una raza",
  }),
  sex: z.enum(["macho", "hembra", "mixto"] as const, {
    required_error: "Debes seleccionar el sexo",
  }),
  isDefault: z.boolean().optional(),
  active: z.boolean().default(true),
  dailyConsumption: z.array(
    z.object({
      day: z.coerce.number().min(1, "El día debe ser mayor a 0"),
      amountPerBird: z.coerce.number().min(0, "La cantidad por ave no puede ser negativa"),
      waterPerBird: z.coerce.number().min(0, "La cantidad de agua por ave no puede ser negativa"),
      expectedWeight: z.coerce.number().min(0, "El peso esperado no puede ser negativo"),
    })
  ).min(1, "Debe haber al menos un registro de consumo diario"),
});

export type GrowthProfileFormValues = z.infer<typeof growthProfileFormSchema>;

// Esquema para importar curvas de alimentación desde archivo
export const curveFeedImportSchema = z.object({
  file: z.instanceof(File, { message: "Debes seleccionar un archivo" }),
  breed: z.enum(["cobb500", "ross308", "hubbard", "arbor_acres", "otras"] as const),
  sex: z.enum(["macho", "hembra", "mixto"] as const),
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
});

export type CurveFeedImportValues = z.infer<typeof curveFeedImportSchema>;
