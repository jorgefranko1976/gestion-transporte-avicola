
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { addDays, format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Calendar, Car, Check, FileText, Image, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { IdentificationType, VehicleType } from "@/lib/types";
import DocumentUploader from "./DocumentUploader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Esquema de validación para el formulario de vehículo
const vehicleFormSchema = z.object({
  plate: z.string().min(6, "La placa debe tener al menos 6 caracteres"),
  vehicleType: z.enum(["camion", "camion liviano", "dobletroque", "camioneta", "tracto camion"] as const),
  brand: z.string().min(2, "La marca debe tener al menos 2 caracteres"),
  model: z.string().min(4, "El modelo debe tener al menos 4 caracteres"),
  line: z.string().min(1, "La línea es requerida"),
  color: z.string().min(3, "El color debe tener al menos 3 caracteres"),
  pbvRunt: z.string().min(1, "El PBV RUNT es requerido"),
  emptyWeight: z.string().min(1, "El peso vacío es requerido"),
  cargoLength: z.string().min(1, "El largo de carrocería es requerido"),
  power: z.string().min(1, "La potencia es requerida"),
  engineNumber: z.string().min(1, "El número de motor es requerido"),
  chassisNumber: z.string().min(1, "El número de chasis es requerido"),
  
  // Campos del propietario
  ownerFirstName: z.string().min(2, "El nombre del propietario es requerido"),
  ownerLastName: z.string().min(2, "Los apellidos del propietario son requeridos"),
  ownerIdentificationType: z.enum(["CC", "NIT", "CE"] as const),
  ownerIdentificationNumber: z.string().min(5, "El número de identificación es requerido"),
  ownerAddress: z.string().min(5, "La dirección es requerida"),
  ownerCity: z.string().min(2, "La ciudad es requerida"),
  ownerPhone: z.string().min(7, "El teléfono es requerido"),
  ownerHasCredit: z.enum(["si", "no"]),
  ownerCreditAmount: z.string().optional(),
  ownerCreditTerm: z.string().optional(),
  ownerCreditEndDate: z.date().optional(),
});

const VehicleForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "owner">("info");
  const [creditIsPaid, setCreditIsPaid] = useState<boolean | null>(null);
  
  // Documentos del vehículo
  const [documents, setDocuments] = useState({
    soat: null as File | null,
    technicalInspection: null as File | null,
    rcPolicy: null as File | null,
    companyContract: null as File | null,
    propertyCard: null as File | null,
    photos: [] as File[],
  });

  // Documentos del propietario
  const [ownerDocuments, setOwnerDocuments] = useState({
    identification: null as File | null,
    rut: null as File | null,
    bankCertification: null as File | null,
    dataProcessingConsent: null as File | null,
    settlementCertificate: null as File | null,
  });

  // Configuración del formulario con react-hook-form
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plate: "",
      vehicleType: "camion",
      brand: "",
      model: "",
      line: "",
      color: "",
      pbvRunt: "",
      emptyWeight: "",
      cargoLength: "",
      power: "",
      engineNumber: "",
      chassisNumber: "",
      
      // Valores por defecto para propietario
      ownerFirstName: "",
      ownerLastName: "",
      ownerIdentificationType: "CC",
      ownerIdentificationNumber: "",
      ownerAddress: "",
      ownerCity: "",
      ownerPhone: "",
      ownerHasCredit: "no",
      ownerCreditAmount: "",
      ownerCreditTerm: "",
    },
  });

  // Observar cambios en campos de crédito
  const hasCredit = form.watch("ownerHasCredit");
  const creditEndDate = form.watch("ownerCreditEndDate");

  // Verificar si el crédito está pagado basado en la fecha de finalización
  useEffect(() => {
    if (hasCredit === "si" && creditEndDate) {
      const isPaid = isAfter(new Date(), creditEndDate);
      setCreditIsPaid(isPaid);
    } else {
      setCreditIsPaid(null);
    }
  }, [hasCredit, creditEndDate]);

  // Función para manejar la subida de documentos del vehículo
  const handleDocumentUpload = (
    type: keyof typeof documents, 
    file: File | null, 
    isPhoto: boolean = false
  ) => {
    if (isPhoto && file) {
      setDocuments(prev => ({
        ...prev,
        photos: [...prev.photos, file]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [type]: file
      }));
    }

    toast({
      title: "Documento subido",
      description: `El documento ha sido cargado correctamente.`,
    });
  };

  // Función para manejar la subida de documentos del propietario
  const handleOwnerDocumentUpload = (
    type: keyof typeof ownerDocuments,
    file: File | null
  ) => {
    setOwnerDocuments(prev => ({
      ...prev,
      [type]: file
    }));

    toast({
      title: "Documento subido",
      description: `El documento ha sido cargado correctamente.`,
    });
  };

  // Función para eliminar un documento del vehículo
  const handleRemoveDocument = (
    type: keyof typeof documents, 
    index: number = -1
  ) => {
    if (type === 'photos' && index >= 0) {
      setDocuments(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [type]: null
      }));
    }

    toast({
      title: "Documento eliminado",
      description: `El documento ha sido eliminado correctamente.`,
    });
  };

  // Función para eliminar un documento del propietario
  const handleRemoveOwnerDocument = (
    type: keyof typeof ownerDocuments
  ) => {
    setOwnerDocuments(prev => ({
      ...prev,
      [type]: null
    }));

    toast({
      title: "Documento eliminado",
      description: `El documento ha sido eliminado correctamente.`,
    });
  };

  // Función para enviar el formulario
  const onSubmit = (data: z.infer<typeof vehicleFormSchema>) => {
    // Aquí se manejaría la lógica para guardar el vehículo
    console.log("Datos del vehículo:", data);
    console.log("Documentos del vehículo:", documents);
    console.log("Documentos del propietario:", ownerDocuments);
    
    toast({
      title: "Vehículo guardado",
      description: `El vehículo con placa ${data.plate} ha sido guardado correctamente.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Car className="w-4 h-4" />
            <span>Información Básica</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Documentos</span>
          </TabsTrigger>
          <TabsTrigger value="owner" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span>Propietario</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="info" className="mt-6">
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-medium border-b pb-3">Información del vehículo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Placa del vehículo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: ABC123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de vehículo</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="camion">Camión</SelectItem>
                            <SelectItem value="camion liviano">Camión liviano</SelectItem>
                            <SelectItem value="dobletroque">Dobletroque</SelectItem>
                            <SelectItem value="camioneta">Camioneta</SelectItem>
                            <SelectItem value="tracto camion">Tracto camión</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Ford, Toyota" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo (Año)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="line"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Línea</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Cargo, Hilux" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Blanco, Azul" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="pbvRunt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PBV RUNT</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 10000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emptyWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso vacío (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cargoLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Largo carrocería (m)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="power"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Potencia (HP)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 300" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="engineNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Motor</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: MF12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chassisNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número Chasis</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: CF67890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-medium border-b pb-3">Documentos del vehículo</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DocumentUploader
                    title="SOAT"
                    description="Sube el documento SOAT del vehículo"
                    file={documents.soat}
                    onUpload={(file) => handleDocumentUpload('soat', file)}
                    onRemove={() => handleRemoveDocument('soat')}
                  />
                  
                  <DocumentUploader
                    title="Técnico-mecánica"
                    description="Sube el certificado técnico-mecánico"
                    file={documents.technicalInspection}
                    onUpload={(file) => handleDocumentUpload('technicalInspection', file)}
                    onRemove={() => handleRemoveDocument('technicalInspection')}
                  />
                  
                  <DocumentUploader
                    title="Póliza RC"
                    description="Sube la póliza de responsabilidad civil"
                    file={documents.rcPolicy}
                    onUpload={(file) => handleDocumentUpload('rcPolicy', file)}
                    onRemove={() => handleRemoveDocument('rcPolicy')}
                  />
                  
                  <DocumentUploader
                    title="Contrato Empresa"
                    description="Sube el contrato con la empresa"
                    file={documents.companyContract}
                    onUpload={(file) => handleDocumentUpload('companyContract', file)}
                    onRemove={() => handleRemoveDocument('companyContract')}
                  />
                  
                  <DocumentUploader
                    title="Tarjeta de Propiedad"
                    description="Sube la tarjeta de propiedad del vehículo"
                    file={documents.propertyCard}
                    onUpload={(file) => handleDocumentUpload('propertyCard', file)}
                    onRemove={() => handleRemoveDocument('propertyCard')}
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Fotos del Vehículo</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sube hasta 3 fotos del interior de la carrocería del vehículo
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <DocumentUploader
                        key={index}
                        title={`Foto ${index + 1}`}
                        description={`Interior de carrocería ${index + 1}`}
                        file={documents.photos[index] || null}
                        onUpload={(file) => handleDocumentUpload('photos', file, true)}
                        onRemove={() => handleRemoveDocument('photos', index)}
                        isPhoto
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="owner" className="mt-6">
              <div className="bg-white p-6 rounded-lg border space-y-6">
                <h3 className="text-lg font-medium border-b pb-3">Información del propietario</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ownerFirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombres del propietario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerLastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellidos del propietario" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerIdentificationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de identificación</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CC">CC - Cédula de Ciudadanía</SelectItem>
                            <SelectItem value="NIT">NIT - Número de Identificación Tributaria</SelectItem>
                            <SelectItem value="CE">CE - Cédula de Extranjería</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerIdentificationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de identificación</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerAddress"
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
                  
                  <FormField
                    control={form.control}
                    name="ownerCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Ciudad de residencia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de contacto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Información de crédito</h4>
                  
                  <FormField
                    control={form.control}
                    name="ownerHasCredit"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>¿Tiene crédito?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="si" />
                              </FormControl>
                              <FormLabel className="font-normal">Sí</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {hasCredit === "si" && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="ownerCreditAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor del crédito</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 50000000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownerCreditTerm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plazo del crédito (meses)</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 36" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ownerCreditEndDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha finalización del crédito</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <CalendarComponent
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                  locale={es}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex items-center col-span-full">
                        {creditIsPaid !== null && (
                          <Alert className={creditIsPaid ? "bg-green-50" : "bg-amber-50"}>
                            <div className="flex items-center">
                              {creditIsPaid ? (
                                <Check className="h-5 w-5 text-green-500 mr-2" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                              )}
                              <div>
                                <AlertTitle>
                                  Estado: {creditIsPaid ? "PAGADO" : "PENDIENTE"}
                                </AlertTitle>
                                <AlertDescription>
                                  {creditIsPaid 
                                    ? "El crédito ya ha sido pagado según la fecha de finalización."
                                    : "El crédito aún está pendiente de pago según la fecha de finalización."}
                                </AlertDescription>
                              </div>
                            </div>
                          </Alert>
                        )}
                      </div>
                      
                      <div className="col-span-full">
                        <DocumentUploader
                          title="Paz y Salvo"
                          description="Sube el documento Paz y Salvo del crédito"
                          file={ownerDocuments.settlementCertificate}
                          onUpload={(file) => handleOwnerDocumentUpload('settlementCertificate', file)}
                          onRemove={() => handleRemoveOwnerDocument('settlementCertificate')}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <h4 className="text-md font-medium mb-4">Documentos del propietario</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentUploader
                      title="Cédula del propietario"
                      description="Sube el documento de identidad"
                      file={ownerDocuments.identification}
                      onUpload={(file) => handleOwnerDocumentUpload('identification', file)}
                      onRemove={() => handleRemoveOwnerDocument('identification')}
                    />
                    
                    <DocumentUploader
                      title="RUT"
                      description="Sube el Registro Único Tributario"
                      file={ownerDocuments.rut}
                      onUpload={(file) => handleOwnerDocumentUpload('rut', file)}
                      onRemove={() => handleRemoveOwnerDocument('rut')}
                    />
                    
                    <DocumentUploader
                      title="Certificación Bancaria"
                      description="Sube la certificación bancaria"
                      file={ownerDocuments.bankCertification}
                      onUpload={(file) => handleOwnerDocumentUpload('bankCertification', file)}
                      onRemove={() => handleRemoveOwnerDocument('bankCertification')}
                    />
                    
                    <DocumentUploader
                      title="Tratamiento de Datos"
                      description="Sube el formulario de tratamiento de datos"
                      file={ownerDocuments.dataProcessingConsent}
                      onUpload={(file) => handleOwnerDocumentUpload('dataProcessingConsent', file)}
                      onRemove={() => handleRemoveOwnerDocument('dataProcessingConsent')}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <div className="mt-6 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  setDocuments({
                    soat: null,
                    technicalInspection: null,
                    rcPolicy: null,
                    companyContract: null,
                    propertyCard: null,
                    photos: [],
                  });
                  setOwnerDocuments({
                    identification: null,
                    rut: null,
                    bankCertification: null,
                    dataProcessingConsent: null,
                    settlementCertificate: null,
                  });
                  setCreditIsPaid(null);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Guardar Vehículo</Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default VehicleForm;
