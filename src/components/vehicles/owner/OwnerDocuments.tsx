
import React from "react";
import DocumentUploader from "../DocumentUploader";
import { OwnerDocumentsState } from "../VehicleOwnerInfo";

type OwnerDocumentsProps = {
  ownerDocuments: OwnerDocumentsState;
  onDocumentUpload: (type: keyof OwnerDocumentsState, file: File | null) => void;
  onDocumentRemove: (type: keyof OwnerDocumentsState) => void;
};

const OwnerDocuments = ({ 
  ownerDocuments, 
  onDocumentUpload, 
  onDocumentRemove 
}: OwnerDocumentsProps) => {
  return (
    <div>
      <h4 className="text-md font-medium mb-4">Documentos del propietario</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentUploader
          title="Cédula del propietario"
          description="Sube el documento de identidad"
          file={ownerDocuments.identification}
          onUpload={(file) => onDocumentUpload('identification', file)}
          onRemove={() => onDocumentRemove('identification')}
        />
        
        <DocumentUploader
          title="RUT"
          description="Sube el Registro Único Tributario"
          file={ownerDocuments.rut}
          onUpload={(file) => onDocumentUpload('rut', file)}
          onRemove={() => onDocumentRemove('rut')}
        />
        
        <DocumentUploader
          title="Certificación Bancaria"
          description="Sube la certificación bancaria"
          file={ownerDocuments.bankCertification}
          onUpload={(file) => onDocumentUpload('bankCertification', file)}
          onRemove={() => onDocumentRemove('bankCertification')}
        />
        
        <DocumentUploader
          title="Tratamiento de Datos"
          description="Sube el formulario de tratamiento de datos"
          file={ownerDocuments.dataProcessingConsent}
          onUpload={(file) => onDocumentUpload('dataProcessingConsent', file)}
          onRemove={() => onDocumentRemove('dataProcessingConsent')}
        />
      </div>
    </div>
  );
};

export default OwnerDocuments;
