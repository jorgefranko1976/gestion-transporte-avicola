
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { farmFormSchema } from "./farmFormSchema";
import FarmBasicInfo from "./FarmBasicInfo";

const FarmForm = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof farmFormSchema>>({
    resolver: zodResolver(farmFormSchema),
    defaultValues: {
      name: "",
      department: "",
      zone: "",
      internalId: "",
      waterSource: "acueducto",
      contactPerson: "",
      contactPhone: "",
      chickenCapacity: 0,
      concentrateCapacity: 0,
      shedsCount: 1,
    },
  });

  const onSubmit = (data: z.infer<typeof farmFormSchema>) => {
    console.log("Datos de la granja:", data);
    
    toast({
      title: "Granja guardada",
      description: `La granja ${data.name} ha sido registrada exitosamente.`,
    });
  };

  const resetForm = () => {
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FarmBasicInfo form={form} />

          <div className="mt-6 flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={resetForm}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Granja</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FarmForm;
