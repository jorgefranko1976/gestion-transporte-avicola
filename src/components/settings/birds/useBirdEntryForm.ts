
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BirdEntryFormValues>({
    resolver: zodResolver(birdEntryFormSchema),
    defaultValues: {
      entryDate: new Date(),
      quantity: 0,
      shedNumber: 1,
      notes: "",
    },
  });
  
  const onSubmit = async (data: BirdEntryFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Datos del ingreso de aves:", data);
      
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mostrar notificación de éxito
      toast({
        title: "Ingreso registrado",
        description: `Se han registrado ${data.quantity} aves en el galpón ${data.shedNumber}.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error al registrar ingreso",
        description: "Ocurrió un error al registrar el ingreso de aves. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    selectedFarmId,
    setSelectedFarmId,
    availableCycles,
    setAvailableCycles,
    onSubmit,
    isSubmitting
  };
};
