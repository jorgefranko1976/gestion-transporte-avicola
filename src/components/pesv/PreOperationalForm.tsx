
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PhotoUploader from './PhotoUploader';

// Esquema para el formulario
const preOperationalSchema = z.object({
  vehicleId: z.string({
    required_error: 'Debes seleccionar un vehículo',
  }),
  driverId: z.string({
    required_error: 'Debes seleccionar un conductor',
  }),
  tiresOk: z.boolean().default(false),
  lightsOk: z.boolean().default(false),
  brakesOk: z.boolean().default(false),
  mirrorsOk: z.boolean().default(false),
  oilOk: z.boolean().default(false),
  waterOk: z.boolean().default(false),
  kitOk: z.boolean().default(false),
  observations: z.string().optional(),
});

type PreOperationalFormValues = z.infer<typeof preOperationalSchema>;

const PreOperationalForm = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<{ id: string; plate: string }[]>([]);
  const [drivers, setDrivers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tirePhoto, setTirePhoto] = useState<File | null>(null);
  const [kitPhoto, setKitPhoto] = useState<File | null>(null);

  // Inicializar el formulario
  const form = useForm<PreOperationalFormValues>({
    resolver: zodResolver(preOperationalSchema),
    defaultValues: {
      tiresOk: false,
      lightsOk: false,
      brakesOk: false,
      mirrorsOk: false,
      oilOk: false,
      waterOk: false,
      kitOk: false,
      observations: '',
    },
  });

  // Cargar vehículos y conductores al iniciar
  useState(() => {
    const loadInitialData = async () => {
      try {
        // Obtener vehículos
        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('id, plate')
          .eq('active', true)
          .eq('status', 'available');

        if (vehiclesData) {
          setVehicles(vehiclesData.map(v => ({ id: v.id, plate: v.plate })));
        }

        // Obtener conductores
        const { data: driversData } = await supabase
          .from('drivers')
          .select('id, first_name, last_name')
          .eq('active', true);

        if (driversData) {
          setDrivers(driversData.map(d => ({ 
            id: d.id, 
            name: `${d.first_name} ${d.last_name}` 
          })));
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Error al cargar datos iniciales');
      }
    };

    loadInitialData();
  }, []);

  const onSubmit = async (values: PreOperationalFormValues) => {
    setIsLoading(true);
    try {
      // Insertar la inspección en la base de datos
      const { data: inspection, error } = await supabase
        .from('vehicle_inspections')
        .insert({
          vehicle_id: values.vehicleId,
          driver_id: values.driverId,
          tires_ok: values.tiresOk,
          lights_ok: values.lightsOk,
          brakes_ok: values.brakesOk,
          mirrors_ok: values.mirrorsOk,
          oil_ok: values.oilOk,
          water_ok: values.waterOk,
          kit_ok: values.kitOk,
          observations: values.observations || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Subir fotos si existen
      let tirePhotoUrl = null;
      let kitPhotoUrl = null;

      if (tirePhoto) {
        const fileName = `${inspection.id}/tire_${Date.now()}`;
        await supabase.storage
          .from('vehicle_inspections')
          .upload(fileName, tirePhoto);

        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_inspections')
          .getPublicUrl(fileName);
          
        tirePhotoUrl = publicUrl;
      }

      if (kitPhoto) {
        const fileName = `${inspection.id}/kit_${Date.now()}`;
        await supabase.storage
          .from('vehicle_inspections')
          .upload(fileName, kitPhoto);

        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_inspections')
          .getPublicUrl(fileName);
          
        kitPhotoUrl = publicUrl;
      }

      // Actualizar la inspección con las URLs de las fotos
      if (tirePhotoUrl || kitPhotoUrl) {
        await supabase
          .from('vehicle_inspections')
          .update({ 
            tire_photo_url: tirePhotoUrl,
            kit_photo_url: kitPhotoUrl
          })
          .eq('id', inspection.id);
      }

      toast.success('Inspección registrada exitosamente');
      
      // Reiniciar formulario
      form.reset();
      setTirePhoto(null);
      setKitPhoto(null);
      
    } catch (error) {
      console.error('Error registrando inspección:', error);
      toast.error('Error al registrar inspección');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Información General</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehículo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar vehículo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vehicles.map(vehicle => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.plate}
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
                  name="driverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conductor</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar conductor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {drivers.map(driver => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-3">Observaciones</h4>
                  <FormField
                    control={form.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Observaciones adicionales sobre el estado del vehículo..."
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Checklist de Seguridad</h3>
                
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="tiresOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Llantas en buen estado</FormLabel>
                          <FormDescription>
                            Verificar presión y desgaste de todas las llantas
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lightsOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Luces funcionando correctamente</FormLabel>
                          <FormDescription>
                            Luces delanteras, traseras, direccionales y de freno
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brakesOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Sistema de frenos operativo</FormLabel>
                          <FormDescription>
                            Frenos responden correctamente al ser accionados
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="mirrorsOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Espejos completos y en buen estado</FormLabel>
                          <FormDescription>
                            Espejos laterales y retrovisor bien ajustados
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="oilOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Nivel de aceite correcto</FormLabel>
                          <FormDescription>
                            Revisar la varilla de medición del aceite
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="waterOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Nivel de agua/refrigerante adecuado</FormLabel>
                          <FormDescription>
                            Verificar el depósito de agua/refrigerante
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="kitOk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Kit de carretera completo</FormLabel>
                          <FormDescription>
                            Extintor, botiquín, herramientas y señalización
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Evidencias Fotográficas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PhotoUploader
                    title="Foto de Llantas"
                    description="Tomar foto del estado de las llantas"
                    file={tirePhoto}
                    onUpload={setTirePhoto}
                    onRemove={() => setTirePhoto(null)}
                  />
                  
                  <PhotoUploader
                    title="Foto Kit de Carretera"
                    description="Tomar foto del kit de carretera completo"
                    file={kitPhoto}
                    onUpload={setKitPhoto}
                    onRemove={() => setKitPhoto(null)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar Inspección'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreOperationalForm;
