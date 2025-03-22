
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LineChart, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { GrowthProfile, DailyConsumption, ChickenBreedType, ChickenSex } from "@/lib/types";
import { growthProfileFormSchema, GrowthProfileFormValues } from "@/components/farms/farmFormSchema";
import DailyConsumptionTable from "./DailyConsumptionTable";

interface GrowthProfileFormProps {
  profile: GrowthProfile | null;
  onSave: (profile: GrowthProfile, isNew: boolean) => void;
  onCancel: () => void;
}

const GrowthProfileForm = ({ 
  profile, 
  onSave, 
  onCancel 
}: GrowthProfileFormProps) => {
  const isNewProfile = !profile;
  
  // Create default daily consumption with required non-optional properties
  const defaultDailyConsumption: DailyConsumption[] = [
    { day: 1, amountPerBird: 12, waterPerBird: 25, expectedWeight: 55 },
    { day: 7, amountPerBird: 35, waterPerBird: 70, expectedWeight: 175 },
    { day: 14, amountPerBird: 68, waterPerBird: 140, expectedWeight: 430 },
    { day: 21, amountPerBird: 110, waterPerBird: 220, expectedWeight: 830 },
    { day: 28, amountPerBird: 155, waterPerBird: 310, expectedWeight: 1345 },
    { day: 35, amountPerBird: 190, waterPerBird: 380, expectedWeight: 1950 },
    { day: 42, amountPerBird: 205, waterPerBird: 410, expectedWeight: 2580 },
  ];
  
  const form = useForm<GrowthProfileFormValues>({
    resolver: zodResolver(growthProfileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      description: profile?.description || "",
      breed: profile?.breed || "cobb500",
      sex: profile?.sex || "mixto",
      isDefault: profile?.isDefault || false,
      active: profile?.active !== undefined ? profile.active : true,
      dailyConsumption: profile?.dailyConsumption || defaultDailyConsumption,
    },
  });

  const handleUpdateDailyConsumption = (updatedItems: DailyConsumption[]) => {
    form.setValue("dailyConsumption", updatedItems);
  };

  const onSubmit = (data: GrowthProfileFormValues) => {
    const savedProfile: GrowthProfile = {
      id: profile?.id || uuidv4(),
      name: data.name,
      description: data.description,
      breed: data.breed as ChickenBreedType,
      sex: data.sex as ChickenSex,
      dailyConsumption: data.dailyConsumption as DailyConsumption[],
      isDefault: data.isDefault || false,
      active: data.active,
      createdAt: profile?.createdAt || new Date(),
      updatedAt: profile ? new Date() : undefined,
    };
    
    onSave(savedProfile, isNewProfile);
  };

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-card">
      <div className="flex items-center gap-2 text-primary">
        <LineChart className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          {isNewProfile ? "Crear nuevo perfil de crecimiento" : "Editar perfil de crecimiento"}
        </h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Perfil</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Engorde Estándar - 45 días" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción breve..." {...field} />
                  </FormControl>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar raza" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cobb500">Cobb 500</SelectItem>
                      <SelectItem value="ross308">Ross 308</SelectItem>
                      <SelectItem value="hubbard">Hubbard</SelectItem>
                      <SelectItem value="arbor_acres">Arbor Acres</SelectItem>
                      <SelectItem value="otras">Otras razas</SelectItem>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="macho">Machos</SelectItem>
                      <SelectItem value="hembra">Hembras</SelectItem>
                      <SelectItem value="mixto">Mixto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado Activo</FormLabel>
                    <FormDescription>
                      Solo los perfiles activos aparecerán en los selectores
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Perfil por Defecto</FormLabel>
                    <FormDescription>
                      Se preseleccionará automáticamente para la raza y sexo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Consumo Diario</h4>
            <DailyConsumptionTable 
              items={form.watch("dailyConsumption")}
              onChange={handleUpdateDailyConsumption}
            />
          </div>
          
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {isNewProfile ? "Crear Perfil" : "Actualizar Perfil"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GrowthProfileForm;
