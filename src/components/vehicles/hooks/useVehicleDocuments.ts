
import { useState } from "react";
import { VehicleDocumentsState } from "../VehicleDocuments";

interface UseVehicleDocumentsProps {
  initialDocuments: VehicleDocumentsState;
  onDocumentsChange: (documents: VehicleDocumentsState) => void;
}

export function useVehicleDocuments({
  initialDocuments,
  onDocumentsChange,
}: UseVehicleDocumentsProps) {
  const [documents, setDocuments] = useState<VehicleDocumentsState>(initialDocuments);

  const handleDocumentUpload = (
    type: keyof VehicleDocumentsState, 
    file: File | null, 
    isPhoto: boolean = false
  ) => {
    if (isPhoto && file) {
      const updatedDocs = {
        ...documents,
        photos: [...documents.photos, file]
      };
      setDocuments(updatedDocs);
      onDocumentsChange(updatedDocs);
    } else {
      const updatedDocs = {
        ...documents,
        [type]: file
      };
      setDocuments(updatedDocs);
      onDocumentsChange(updatedDocs);
    }
  };

  const handleExpirationDateChange = (
    type: 'soatExpiration' | 'technicalInspectionExpiration' | 'rcPolicyExpiration',
    date: Date | null
  ) => {
    const updatedDocs = {
      ...documents,
      [type]: date
    };
    setDocuments(updatedDocs);
    onDocumentsChange(updatedDocs);
  };

  const handleRemoveDocument = (
    type: keyof VehicleDocumentsState, 
    index: number = -1
  ) => {
    let updatedDocs: VehicleDocumentsState;

    if (type === 'photos' && index >= 0) {
      updatedDocs = {
        ...documents,
        photos: documents.photos.filter((_, i) => i !== index)
      };
    } else {
      if (type === 'soat') {
        updatedDocs = {
          ...documents,
          soat: null,
          soatExpiration: null
        };
      } else if (type === 'technicalInspection') {
        updatedDocs = {
          ...documents,
          technicalInspection: null,
          technicalInspectionExpiration: null
        };
      } else if (type === 'rcPolicy') {
        updatedDocs = {
          ...documents,
          rcPolicy: null,
          rcPolicyExpiration: null
        };
      } else {
        updatedDocs = {
          ...documents,
          [type]: null
        };
      }
    }

    setDocuments(updatedDocs);
    onDocumentsChange(updatedDocs);
  };

  return {
    documents,
    handleDocumentUpload,
    handleExpirationDateChange,
    handleRemoveDocument
  };
}
