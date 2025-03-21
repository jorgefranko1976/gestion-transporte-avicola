
import * as z from "zod";

// Validation schema for the bird entry form
export const birdEntryFormSchema = z.object({
  farmId: z.string({
    required_error: "Debes seleccionar una granja",
  }),
  cycleId: z.string({
    required_error: "Debes seleccionar un ciclo",
  }),
  entryDate: z.date({
    required_error: "La fecha de ingreso es requerida",
  }),
  quantity: z.coerce.number()
    .min(1, "La cantidad debe ser mayor a 0")
    .max(100000, "Cantidad demasiado grande"),
  shedNumber: z.coerce.number()
    .min(1, "El número de galpón debe ser mayor a 0"),
  breed: z.string({
    required_error: "Debes seleccionar una raza",
  }),
  notes: z.string().optional(),
});

export type BirdEntryFormValues = z.infer<typeof birdEntryFormSchema>;
