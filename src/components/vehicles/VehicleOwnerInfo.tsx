
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { vehicleFormSchema } from "./vehicleFormSchema";
import { OwnerPersonalInfo, OwnerCreditInfo, OwnerDocuments } from "./owner";

export interface OwnerDocumentsState {
  identification: File | null;
  rut: File | null;
  bankCertification: File | null;
  dataProcessingConsent: File | null;
  settlementCertificate: File | null;
  signedPromissoryNote: File | null;
  blankPromissoryInstructions: File | null;
}

type VehicleOwnerInfoProps = {
  form: UseFormReturn<z.infer<typeof vehicleFormSchema>>;
  ownerDocuments: OwnerDocumentsState;
  setOwnerDocuments: React.Dispatch<React.SetStateAction<OwnerDocumentsState>>;
};

const VehicleOwnerInfo = ({ form, ownerDocuments, setOwnerDocuments }: VehicleOwnerInfoProps) => {
  const handleOwnerDocumentUpload = (
    type: keyof OwnerDocumentsState,
    file: File | null
  ) => {
    setOwnerDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleRemoveOwnerDocument = (
    type: keyof OwnerDocumentsState
  ) => {
    setOwnerDocuments(prev => ({
      ...prev,
      [type]: null
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Información del propietario</h3>
      
      <OwnerPersonalInfo form={form} />
      
      <div className="mt-8">
        <OwnerCreditInfo 
          form={form} 
          ownerDocuments={ownerDocuments} 
          onDocumentUpload={handleOwnerDocumentUpload} 
          onDocumentRemove={handleRemoveOwnerDocument}
        />
      </div>

      <div className="mt-8">
        <OwnerDocuments 
          ownerDocuments={ownerDocuments}
          onDocumentUpload={handleOwnerDocumentUpload}
          onDocumentRemove={handleRemoveOwnerDocument}
        />
      </div>
    </div>
  );
};

export default VehicleOwnerInfo;
