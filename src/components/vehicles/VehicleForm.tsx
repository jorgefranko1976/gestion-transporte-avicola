
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Car, FileText, Image, Upload } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { VehicleType } from "@/lib/types";
import DocumentUploader from "./DocumentUploader";

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
  ownerInfo: z.string().min(3, "La información del propietario es requerida"),
});

const VehicleForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "owner">("info");
  
  // Documentos del vehículo
  const [documents, setDocuments] = useState({
    soat: null as File | null,
    technicalInspection: null as File | null,
    rcPolicy: null as File | null,
    companyContract: null as File | null,
    propertyCard: null as File | null,
    photos: [] as File[],
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
      ownerInfo: "",
    },
  });

  // Función para manejar la subida de documentos
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

  // Función para eliminar un documento
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

  // Función para enviar el formulario
  const onSubmit = (data: z.infer<typeof vehicleFormSchema>) => {
    // Aquí se manejaría la lógica para guardar el vehículo
    console.log("Datos del vehículo:", data);
    console.log("Documentos:", documents);
    
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
                
                <FormField
                  control={form.control}
                  name="ownerInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Información del propietario</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del propietario" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingresa el nombre completo del propietario del vehículo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
