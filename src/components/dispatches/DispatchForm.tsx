
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useDispatchCreation } from './hooks/useDispatchCreation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Esquema de validación para el formulario de despacho
const dispatchFormSchema = z.object({
  orderId: z.string().min(3, 'El ID de orden es requerido'),
  loadingCompany: z.string().min(2, 'La empresa de carga es requerida'),
  destination: z.string().min(2, 'El destino es requerido'),
  zone: z.string().optional(),
  farm: z.string().min(2, 'La granja es requerida'),
  farmId: z.string().min(2, 'La ID de granja es requerida'),
  packages: z.number().min(1, 'El número de paquetes debe ser mayor a 0'),
  concentrateAmount: z.number().optional(),
  eta: z.date().optional().nullable()
});

type DispatchFormValues = z.infer<typeof dispatchFormSchema>;

const DispatchForm = () => {
  const { isCreating, createDispatch } = useDispatchCreation();
  const [openCalendar, setOpenCalendar] = useState(false);

  // Inicializar el formulario
  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(dispatchFormSchema),
    defaultValues: {
      orderId: '',
      loadingCompany: '',
      destination: '',
      zone: '',
      farm: '',
      farmId: '',
      packages: 1,
      concentrateAmount: undefined,
      eta: null
    }
  });

  const onSubmit = async (values: DispatchFormValues) => {
    const result = await createDispatch(values);
    if (result) {
      form.reset();
      toast.success('Despacho creado correctamente');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h2 className="text-xl font-semibold mb-6">Crear Nuevo Despacho</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Orden</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: ORD-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="loadingCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa de Carga</FormLabel>
                  <FormControl>
                    <Input placeholder="Empresa de carga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destino</FormLabel>
                  <FormControl>
                    <Input placeholder="Destino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zona (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Zona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="farm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Granja</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la granja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="farmId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Granja</FormLabel>
                  <FormControl>
                    <Input placeholder="ID de la granja" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="packages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Paquetes</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      placeholder="Paquetes" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="concentrateAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de Concentrado (Ton.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Cantidad en toneladas" 
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="eta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha Estimada de Llegada</FormLabel>
                  <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : "Seleccionar fecha"}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenCalendar(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Despacho'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DispatchForm;
