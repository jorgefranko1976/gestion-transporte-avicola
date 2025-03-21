
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { birdEntryFormSchema, BirdEntryFormValues } from "./schema";
import { mockCycles } from "./mock-data";

interface UseBirdEntryFormProps {
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
  
  return {
    form,
    selectedFarmId,
    setSelectedFarmId,
    availableCycles,
    setAvailableCycles,
    onSubmit
  };
};
