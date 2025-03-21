
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Farm, ChickenBreedType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Bird } from "lucide-react";
import { cn } from "@/lib/utils";

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

type BirdEntryFormValues = z.infer<typeof birdEntryFormSchema>;

// Datos de muestra para testing
const mockFarms = [
  { id: "1", name: "Granja El Encanto" },
  { id: "2", name: "Granja Los Pinos" },
];

const mockCycles = [
  { id: "1", farmId: "1", name: "Ciclo Junio-Julio 2023" },
  { id: "2", farmId: "2", name: "Ciclo Mayo-Junio 2023" },
];

interface BirdEntryFormProps {
  onSuccess?: () => void;
}

const BirdEntryForm = ({ onSuccess }: BirdEntryFormProps) => {
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="farmId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Granja</FormLabel>
                <Select 
                  onValueChange={(value) => handleFarmChange(value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una granja" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {mockFarms.map((farm) => (
                      <SelectItem key={farm.id} value={farm.id}>
                        {farm.name}
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
            name="cycleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciclo de Producción</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                  disabled={!selectedFarmId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un ciclo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCycles.map((cycle) => (
                      <SelectItem key={cycle.id} value={cycle.id}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!selectedFarmId && (
                  <FormDescription>
                    Selecciona primero una granja
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Ingreso</FormLabel>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>Selecciona una fecha</span>
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
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una raza" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cobb500">Cobb 500</SelectItem>
                    <SelectItem value="ross308">Ross 308</SelectItem>
                    <SelectItem value="hubbard">Hubbard</SelectItem>
                    <SelectItem value="arbor_acres">Arbor Acres</SelectItem>
                    <SelectItem value="otras">Otras</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de Aves</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="shedNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Galpón</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ingresa cualquier observación sobre el estado de las aves..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancelar
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Bird className="h-4 w-4" />
            Registrar Ingreso
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BirdEntryForm;
