
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
import { CalendarIcon, LineChart } from "lucide-react";
import { ChickenBreed, ChickenSex, Farm } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ProductionCycleFormProps {
  farms: Farm[];
  onSuccess?: () => void;
}

const growthProfiles = [
  { id: "profile1", name: "Engorde Estándar - 45 días", breed: "cobb500" as ChickenBreed, sex: "mixto" as ChickenSex },
  { id: "profile2", name: "Engorde Rápido - 38 días", breed: "ross308" as ChickenBreed, sex: "macho" as ChickenSex },
  { id: "profile3", name: "Engorde Extendido - 52 días", breed: "hubbard" as ChickenBreed, sex: "hembra" as ChickenSex },
];

const chickenBreeds = [
  { value: "cobb500", label: "Cobb 500" },
  { value: "ross308", label: "Ross 308" },
  { value: "hubbard", label: "Hubbard" },
  { value: "arbor_acres", label: "Arbor Acres" },
  { value: "otras", label: "Otras razas" },
];

const chickenSexOptions = [
  { value: "macho", label: "Machos" },
  { value: "hembra", label: "Hembras" },
  { value: "mixto", label: "Mixto" },
];

const ProductionCycleForm = ({ farms, onSuccess }: ProductionCycleFormProps) => {
  const { toast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState(growthProfiles);
  
  const form = useForm<ProductionCycleFormValues>({
    resolver: zodResolver(productionCycleFormSchema),
    defaultValues: {
      startDate: new Date(),
      estimatedEndDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      initialBirdCount: 0,
      growthProfileId: "",
      breed: "cobb500",
      sex: "mixto",
      concentrateReserve: 0,
      notes: "",
    },
  });
  
  // Filtra los perfiles de crecimiento según la raza y sexo seleccionados
  const filterProfiles = (breed: ChickenBreed, sex: ChickenSex) => {
    // En una aplicación real, esto podría ser una llamada a API para obtener perfiles
    // que coincidan con la raza y sexo seleccionados
    return growthProfiles.filter(profile => 
      (profile.breed === breed || profile.breed === "otras") && 
      (profile.sex === sex || profile.sex === "mixto")
    );
  };
  
  // Actualiza los perfiles cuando cambia la raza o el sexo
  const handleBreedOrSexChange = () => {
    const breed = form.getValues("breed") as ChickenBreed;
    const sex = form.getValues("sex") as ChickenSex;
    
    const filtered = filterProfiles(breed, sex);
    setFilteredProfiles(filtered);
    
    // Si el perfil actual no está en la lista filtrada, resetea la selección
    const currentProfileId = form.getValues("growthProfileId");
    if (currentProfileId && !filtered.find(p => p.id === currentProfileId)) {
      form.setValue("growthProfileId", "");
    }
  };
  
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
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-sm font-medium flex items-center gap-2 text-blue-800 mb-2">
                  <LineChart className="h-4 w-4" />
                  Información de Curva de Alimentación
                </h3>
                <p className="text-sm text-blue-700">
                  La curva de alimentación determina el consumo diario esperado según la raza y sexo de las aves.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raza de Ave</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleBreedOrSexChange();
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar raza" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chickenBreeds.map((breed) => (
                            <SelectItem key={breed.value} value={breed.value}>
                              {breed.label}
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
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleBreedOrSexChange();
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar sexo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {chickenSexOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                          {filteredProfiles.map((profile) => (
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
              </div>
              
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
