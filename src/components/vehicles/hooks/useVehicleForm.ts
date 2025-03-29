
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { vehicleFormSchema } from "../vehicleFormSchema";
import { VehicleDocumentsState } from "../VehicleDocuments";
import { OwnerDocumentsState } from "../VehicleOwnerInfo";

export const useVehicleForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"info" | "documents" | "owner">("info");
  const [showOwnerInfo, setShowOwnerInfo] = useState(false);
  
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
      
      ownerOption: "new",
      ownerId: "",
      
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

  // Manejar el cambio en la opción de propietario
  const handleOwnerTypeChange = (type: "existing" | "new") => {
    setShowOwnerInfo(type === "new");
    
    // Si cambiamos a propietario existente, limpiar los campos de nuevo propietario
    if (type === "existing") {
      form.setValue("ownerFirstName", "");
      form.setValue("ownerLastName", "");
      // ... limpiar otros campos del propietario
    }
  };

  // Detectar cambios en la opción de propietario
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "ownerOption") {
        setShowOwnerInfo(value.ownerOption === "new");
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = (data: z.infer<typeof vehicleFormSchema>) => {
    console.log("Datos del vehículo:", data);
    console.log("Documentos del vehículo:", documents);
    console.log("Documentos del propietario:", ownerDocuments);
    
    toast({
      title: "Vehículo guardado",
      description: `El vehículo con placa ${data.plate} ha sido ${data.ownerOption === "existing" ? "asociado al propietario existente" : "registrado con nuevo propietario"}.`,
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

  return {
    form,
    activeTab,
    setActiveTab,
    showOwnerInfo,
    documents,
    setDocuments,
    ownerDocuments,
    setOwnerDocuments,
    handleOwnerTypeChange,
    onSubmit,
    resetForm
  };
};
