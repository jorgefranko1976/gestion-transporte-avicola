
import React from "react";
import DocumentUploader from "../DocumentUploader";
import { VehicleDocumentsState } from "../VehicleDocuments";

interface RequiredDocumentsProps {
  documents: VehicleDocumentsState;
  onDocumentUpload: (type: keyof VehicleDocumentsState, file: File | null) => void;
  onRemoveDocument: (type: keyof VehicleDocumentsState) => void;
  onExpirationDateChange: (
    type: 'soatExpiration' | 'technicalInspectionExpiration' | 'rcPolicyExpiration',
    date: Date | null
  ) => void;
}

const RequiredDocuments: React.FC<RequiredDocumentsProps> = ({
  documents,
  onDocumentUpload,
  onRemoveDocument,
  onExpirationDateChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DocumentUploader
        title="SOAT"
        description="Sube el documento SOAT del vehículo"
        file={documents.soat}
        onUpload={(file) => onDocumentUpload('soat', file)}
        onRemove={() => onRemoveDocument('soat')}
        hasExpiration={true}
        expirationDate={documents.soatExpiration}
        onExpirationChange={(date) => onExpirationDateChange('soatExpiration', date)}
      />
      
      <DocumentUploader
        title="Técnico-mecánica"
        description="Sube el certificado técnico-mecánico"
        file={documents.technicalInspection}
        onUpload={(file) => onDocumentUpload('technicalInspection', file)}
        onRemove={() => onRemoveDocument('technicalInspection')}
        hasExpiration={true}
        expirationDate={documents.technicalInspectionExpiration}
        onExpirationChange={(date) => onExpirationDateChange('technicalInspectionExpiration', date)}
      />
      
      <DocumentUploader
        title="Póliza RC"
        description="Sube la póliza de responsabilidad civil"
        file={documents.rcPolicy}
        onUpload={(file) => onDocumentUpload('rcPolicy', file)}
        onRemove={() => onRemoveDocument('rcPolicy')}
        hasExpiration={true}
        expirationDate={documents.rcPolicyExpiration}
        onExpirationChange={(date) => onExpirationDateChange('rcPolicyExpiration', date)}
      />
      
      <DocumentUploader
        title="Contrato Empresa"
        description="Sube el contrato con la empresa"
        file={documents.companyContract}
        onUpload={(file) => onDocumentUpload('companyContract', file)}
        onRemove={() => onRemoveDocument('companyContract')}
      />
      
      <DocumentUploader
        title="Tarjeta de Propiedad"
        description="Sube la tarjeta de propiedad del vehículo"
        file={documents.propertyCard}
        onUpload={(file) => onDocumentUpload('propertyCard', file)}
        onRemove={() => onRemoveDocument('propertyCard')}
      />
    </div>
  );
};

export default RequiredDocuments;
