
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

// Esquema de validación para el formulario
const birdEntryFormSchema = z.object({
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

// Datos de muestra para testing
const mockFarms = [
  { id: "1", name: "Granja El Encanto" },
  { id: "2", name: "Granja Los Pinos" },
];

const mockCycles = [
  { id: "1", farmId: "1", name: "Ciclo Junio-Julio 2023" },
  { id: "2", farmId: "2", name: "Ciclo Mayo-Junio 2023" },
];

export interface UseBirdEntryFormProps {
  onSuccess?: () => void;
}

export const useBirdEntryForm = ({ onSuccess }: UseBirdEntryFormProps) => {
  const { toast } = useToast();
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [availableCycles, setAvailableCycles] = useState(mockCycles);
  
  const form = useForm<BirdEntryFormValues>({
    resolver: zodResolver(birdEntryFormSchema),
    defaultValues: {
      entryDate: new Date(),
      quantity: 0,
      shedNumber: 1,
      notes: "",
    },
  });
  
  // Filtrar ciclos según la granja seleccionada
  const handleFarmChange = (farmId: string) => {
    setSelectedFarmId(farmId);
    const filtered = mockCycles.filter(cycle => cycle.farmId === farmId);
    setAvailableCycles(filtered);
    form.setValue("farmId", farmId);
    
    // Resetear el ciclo si no está disponible para la granja seleccionada
    const currentCycleId = form.getValues("cycleId");
    if (currentCycleId && !filtered.find(c => c.id === currentCycleId)) {
      form.setValue("cycleId", "");
    }
  };
  
  const onSubmit = (data: BirdEntryFormValues) => {
    console.log("Datos del ingreso de aves:", data);
    
    // Mostrar notificación de éxito
    toast({
      title: "Ingreso registrado",
      description: `Se han registrado ${data.quantity} aves en el galpón ${data.shedNumber}.`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const farms = mockFarms;
  
  return {
    form,
    selectedFarmId,
    availableCycles,
    farms,
    handleFarmChange,
    onSubmit,
    onSuccess
  };
};

export { birdEntryFormSchema };
