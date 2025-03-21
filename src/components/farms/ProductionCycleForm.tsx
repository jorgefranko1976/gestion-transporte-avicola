
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { productionCycleFormSchema, ProductionCycleFormValues } from "./farmFormSchema";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Farm } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ProductionCycleFormProps {
  farms: Farm[];
  onSuccess?: () => void;
}

const growthProfiles = [
  { id: "profile1", name: "Engorde Estándar - 45 días" },
  { id: "profile2", name: "Engorde Rápido - 38 días" },
  { id: "profile3", name: "Engorde Extendido - 52 días" },
];

const ProductionCycleForm = ({ farms, onSuccess }: ProductionCycleFormProps) => {
  const { toast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  
  const form = useForm<ProductionCycleFormValues>({
    resolver: zodResolver(productionCycleFormSchema),
    defaultValues: {
      startDate: new Date(),
      estimatedEndDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      initialBirdCount: 0,
      growthProfileId: "",
      concentrateReserve: 0,
      notes: "",
    },
  });
  
  const onSubmit = (data: ProductionCycleFormValues) => {
    if (!selectedFarm) {
      toast({
        title: "Error",
        description: "Debes seleccionar una granja",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Datos del ciclo:", { 
      ...data, 
      farmId: selectedFarm.id,
      farmName: selectedFarm.name
    });
    
    toast({
      title: "Ciclo creado",
      description: `Se ha creado un nuevo ciclo de producción para la granja ${selectedFarm.name}.`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const handleFarmChange = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    setSelectedFarm(farm || null);
    
    if (farm) {
      form.setValue("initialBirdCount", farm.chickenCapacity);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormItem className="space-y-0">
            <FormLabel>Granja</FormLabel>
            <Select onValueChange={handleFarmChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar granja" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {farms.filter(farm => farm.active).map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} - {farm.internalId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
          
          {selectedFarm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="estimatedEndDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha Estimada de Finalización</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < form.getValues("startDate")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initialBirdCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad Inicial de Aves</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max={selectedFarm?.chickenCapacity} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="growthProfileId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil de Crecimiento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {growthProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="concentrateReserve"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reserva de Concentrado (toneladas)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.1" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas adicionales para este ciclo de producción" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={!selectedFarm}>
            Crear Ciclo
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductionCycleForm;
