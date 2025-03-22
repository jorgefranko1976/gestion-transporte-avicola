
import { useState } from "react";
import { RequiredDocuments, VehiclePhotos } from "./document-sections";
import { useVehicleDocuments } from "./hooks/useVehicleDocuments";

export interface VehicleDocumentsState {
  soat: File | null;
  soatExpiration: Date | null;
  technicalInspection: File | null;
  technicalInspectionExpiration: Date | null;
  rcPolicy: File | null;
  rcPolicyExpiration: Date | null;
  companyContract: File | null;
  propertyCard: File | null;
  photos: File[];
}

type VehicleDocumentsProps = {
  documents: VehicleDocumentsState;
  setDocuments: React.Dispatch<React.SetStateAction<VehicleDocumentsState>>;
};

const VehicleDocuments = ({ documents: initialDocuments, setDocuments }: VehicleDocumentsProps) => {
  const { 
    documents, 
    handleDocumentUpload, 
    handleExpirationDateChange, 
    handleRemoveDocument 
  } = useVehicleDocuments({
    initialDocuments,
    onDocumentsChange: setDocuments
  });

  const handlePhotoUpload = (file: File | null) => {
    if (file) {
      handleDocumentUpload('photos', file, true);
    }
  };

  const handlePhotoRemove = (index: number) => {
    handleRemoveDocument('photos', index);
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Documentos del vehículo</h3>
      
      <RequiredDocuments 
        documents={documents}
        onDocumentUpload={handleDocumentUpload}
        onRemoveDocument={handleRemoveDocument}
        onExpirationDateChange={handleExpirationDateChange}
      />

      <VehiclePhotos 
        photos={documents.photos}
        onPhotoUpload={handlePhotoUpload}
        onPhotoRemove={handlePhotoRemove}
      />
    </div>
  );
};

export default VehicleDocuments;
