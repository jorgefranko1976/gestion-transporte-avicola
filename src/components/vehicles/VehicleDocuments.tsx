
import { useState } from "react";
import DocumentUploader from "./DocumentUploader";

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

const VehicleDocuments = ({ documents, setDocuments }: VehicleDocumentsProps) => {
  const handleDocumentUpload = (
    type: keyof VehicleDocumentsState, 
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
  };

  const handleExpirationDateChange = (
    type: 'soatExpiration' | 'technicalInspectionExpiration' | 'rcPolicyExpiration',
    date: Date | null
  ) => {
    setDocuments(prev => ({
      ...prev,
      [type]: date
    }));
  };

  const handleRemoveDocument = (
    type: keyof VehicleDocumentsState, 
    index: number = -1
  ) => {
    if (type === 'photos' && index >= 0) {
      setDocuments(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    } else {
      if (type === 'soat') {
        setDocuments(prev => ({
          ...prev,
          soat: null,
          soatExpiration: null
        }));
      } else if (type === 'technicalInspection') {
        setDocuments(prev => ({
          ...prev,
          technicalInspection: null,
          technicalInspectionExpiration: null
        }));
      } else if (type === 'rcPolicy') {
        setDocuments(prev => ({
          ...prev,
          rcPolicy: null,
          rcPolicyExpiration: null
        }));
      } else {
        setDocuments(prev => ({
          ...prev,
          [type]: null
        }));
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Documentos del vehículo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentUploader
          title="SOAT"
          description="Sube el documento SOAT del vehículo"
          file={documents.soat}
          onUpload={(file) => handleDocumentUpload('soat', file)}
          onRemove={() => handleRemoveDocument('soat')}
          hasExpiration={true}
          expirationDate={documents.soatExpiration}
          onExpirationChange={(date) => handleExpirationDateChange('soatExpiration', date)}
        />
        
        <DocumentUploader
          title="Técnico-mecánica"
          description="Sube el certificado técnico-mecánico"
          file={documents.technicalInspection}
          onUpload={(file) => handleDocumentUpload('technicalInspection', file)}
          onRemove={() => handleRemoveDocument('technicalInspection')}
          hasExpiration={true}
          expirationDate={documents.technicalInspectionExpiration}
          onExpirationChange={(date) => handleExpirationDateChange('technicalInspectionExpiration', date)}
        />
        
        <DocumentUploader
          title="Póliza RC"
          description="Sube la póliza de responsabilidad civil"
          file={documents.rcPolicy}
          onUpload={(file) => handleDocumentUpload('rcPolicy', file)}
          onRemove={() => handleRemoveDocument('rcPolicy')}
          hasExpiration={true}
          expirationDate={documents.rcPolicyExpiration}
          onExpirationChange={(date) => handleExpirationDateChange('rcPolicyExpiration', date)}
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
  );
};

export default VehicleDocuments;
