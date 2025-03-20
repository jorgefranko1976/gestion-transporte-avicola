
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, FileText, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { vehicleFormSchema } from "./vehicleFormSchema";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehicleDocuments, { VehicleDocumentsState } from "./VehicleDocuments";
import VehicleOwnerInfo, { OwnerDocumentsState } from "./VehicleOwnerInfo";

const VehicleForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "owner">("info");
  
  const [documents, setDocuments] = useState<VehicleDocumentsState>({
    soat: null,
    soatExpiration: null,
    technicalInspection: null,
    technicalInspectionExpiration: null,
    rcPolicy: null,
    rcPolicyExpiration: null,
    companyContract: null,
    propertyCard: null,
    photos: [],
  });

  const [ownerDocuments, setOwnerDocuments] = useState<OwnerDocumentsState>({
    identification: null,
    rut: null,
    bankCertification: null,
    dataProcessingConsent: null,
    settlementCertificate: null,
    signedPromissoryNote: null,
    blankPromissoryInstructions: null,
  });

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

  const onSubmit = (data: z.infer<typeof vehicleFormSchema>) => {
    console.log("Datos del vehículo:", data);
    console.log("Documentos del vehículo:", documents);
    console.log("Documentos del propietario:", ownerDocuments);
    
    toast({
      title: "Vehículo guardado",
      description: `El vehículo con placa ${data.plate} ha sido guardado correctamente.`,
    });
  };

  const resetForm = () => {
    form.reset();
    setDocuments({
      soat: null,
      soatExpiration: null,
      technicalInspection: null,
      technicalInspectionExpiration: null,
      rcPolicy: null,
      rcPolicyExpiration: null,
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
      signedPromissoryNote: null,
      blankPromissoryInstructions: null,
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
              <VehicleBasicInfo form={form} />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <VehicleDocuments 
                documents={documents} 
                setDocuments={setDocuments} 
              />
            </TabsContent>
            
            <TabsContent value="owner" className="mt-6">
              <VehicleOwnerInfo 
                form={form} 
                ownerDocuments={ownerDocuments} 
                setOwnerDocuments={setOwnerDocuments} 
              />
            </TabsContent>

            <div className="mt-6 flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
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
