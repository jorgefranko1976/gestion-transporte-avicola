
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Save, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DriverDocuments from './DriverDocuments';
import DriverObservations from './DriverObservations';
import VehicleAssignment from './VehicleAssignment';

// Schema de validación para el formulario
const driverFormSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  identificationType: z.enum(['CC', 'CE', 'NIT', 'TI', 'OTRO']),
  identificationNumber: z.string().min(5, 'Número de identificación inválido'),
  birthDate: z.date({
    required_error: 'La fecha de nacimiento es requerida',
  }),
  address: z.string().min(5, 'La dirección es requerida'),
  phone: z.string().min(7, 'Número de teléfono inválido'),
  emergencyContact: z.string().min(7, 'Contacto de emergencia inválido'),
  hireDate: z.date({
    required_error: 'La fecha de contratación es requerida',
  }),
  licenseExpiration: z.date().optional(),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'La confirmación de contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

// Estado para los documentos
interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}

const DriverForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<DocumentsState>({
    drivingLicense: null,
    identification: null,
    resume: null,
    finesClearance: null,
    references: null,
    arl: null,
    payroll: null,
  });
  const [observations, setObservations] = useState<{ content: string, document: File | null }[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'documents' | 'observations' | 'vehicle' | 'account'>('basic');

  // Inicializar el formulario
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      identificationType: 'CC',
      identificationNumber: '',
      birthDate: undefined,
      address: '',
      phone: '',
      emergencyContact: '',
      hireDate: new Date(),
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Calcular edad
  const calculateAge = (birthDate: Date | undefined) => {
    if (!birthDate) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  // Enviar formulario
  const onSubmit = async (values: DriverFormValues) => {
    setIsSubmitting(true);
    try {
      // Primero, crear el usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: 'driver',
            identification_type: values.identificationType,
            identification_number: values.identificationNumber,
            phone: values.phone
          }
        }
      });

      if (authError) {
        console.error('Error creating user account:', authError);
        toast.error('Error al crear la cuenta de usuario: ' + authError.message);
        setIsSubmitting(false);
        return;
      }

      console.log('Usuario creado exitosamente:', authData.user?.id);
      
      // Si la creación del usuario fue exitosa, procedemos con la creación del conductor
      // Insertar el conductor en la base de datos
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .insert({
          first_name: values.firstName,
          last_name: values.lastName,
          identification_type: values.identificationType,
          identification_number: values.identificationNumber,
          birth_date: values.birthDate.toISOString(),
          address: values.address,
          phone: values.phone,
          emergency_contact: values.emergencyContact,
          hire_date: values.hireDate.toISOString(),
          assigned_vehicle_id: selectedVehicleId,
          license_expiration: values.licenseExpiration?.toISOString() || null,
          active: true
        })
        .select()
        .single();

      if (driverError) {
        console.error('Error registrando conductor:', driverError);
        toast.error('Error al registrar conductor: ' + driverError.message);
        setIsSubmitting(false);
        return;
      }

      // Subir documentos si existen
      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          // Subir archivo al bucket
          const fileName = `${driver.id}/${key}_${Date.now()}`;
          const { data: fileData, error: storageError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

          if (storageError) {
            console.error('Error subiendo documento:', storageError);
            continue;
          }

          // Obtener URL pública
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Guardar referencia en la base de datos
          await supabase
            .from('driver_documents')
            .insert({
              driver_id: driver.id,
              document_type: key,
              document_url: publicUrl
            });
        }
      }

      // Guardar observaciones si existen
      for (const obs of observations) {
        let documentUrl = null;

        if (obs.document) {
          // Subir documento de observación
          const fileName = `${driver.id}/observation_${Date.now()}`;
          await supabase.storage
            .from('documents')
            .upload(fileName, obs.document);

          // Obtener URL pública
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
            
          documentUrl = publicUrl;
        }

        // Insertar observación
        await supabase
          .from('driver_observations')
          .insert({
            driver_id: driver.id,
            content: obs.content,
            document_url: documentUrl
          });
      }

      toast.success('Conductor registrado exitosamente');
      
      // Reiniciar formulario
      form.reset();
      setDocuments({
        drivingLicense: null,
        identification: null,
        resume: null,
        finesClearance: null,
        references: null,
        arl: null,
        payroll: null,
      });
      setObservations([]);
      setSelectedVehicleId(null);
      setActiveTab('basic');
      
    } catch (error) {
      console.error('Error registrando conductor:', error);
      toast.error('Error al registrar conductor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('basic')}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === 'basic' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Información Básica
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === 'account' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Cuenta de Usuario
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === 'documents' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Documentos
        </button>
        <button
          onClick={() => setActiveTab('observations')}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === 'observations' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Observaciones
        </button>
        <button
          onClick={() => setActiveTab('vehicle')}
          className={cn(
            "px-4 py-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
            activeTab === 'vehicle' 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Asignación de Vehículo
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información personal */}
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-medium border-b pb-3">Información personal</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellidos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="identificationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Identificación</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CC">CC</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="NIT">NIT</SelectItem>
                            <SelectItem value="TI">TI</SelectItem>
                            <SelectItem value="OTRO">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="identificationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Identificación</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de identificación" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <div className="flex items-center gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
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
                              disabled={(date) =>
                                date > new Date() || date < new Date("1940-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        
                        <div className="text-sm text-muted-foreground">
                          {field.value ? calculateAge(field.value) : ''}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección completa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de teléfono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contacto de Emergencia</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de contacto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Información laboral */}
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-medium border-b pb-3">Información laboral</h3>
                
                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Contratación</FormLabel>
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
                            disabled={(date) =>
                              date > new Date()
                            }
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
                  name="licenseExpiration"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Vencimiento de Licencia</FormLabel>
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
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'account' && (
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <h3 className="text-lg font-medium border-b pb-3">Información de cuenta de usuario</h3>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="ejemplo@correo.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mínimo 6 caracteres" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirme su contraseña" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                <p>Al crear un conductor, se creará automáticamente una cuenta con el rol "Conductor" que le permitirá acceder al sistema con las credenciales indicadas.</p>
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <DriverDocuments documents={documents} setDocuments={setDocuments} />
          )}
          
          {activeTab === 'observations' && (
            <DriverObservations observations={observations} setObservations={setObservations} />
          )}
          
          {activeTab === 'vehicle' && (
            <VehicleAssignment 
              selectedVehicleId={selectedVehicleId} 
              setSelectedVehicleId={setSelectedVehicleId} 
            />
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">...</span>
                  <span>Guardando</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Conductor</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DriverForm;
