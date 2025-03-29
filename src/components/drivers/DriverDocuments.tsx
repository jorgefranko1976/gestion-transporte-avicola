
import React from "react";
import { documentFields } from "./config/documentFields";
import DocumentCard from "./components/DocumentCard";
import { useDocumentHandling, DocumentType, ExpirationDatesState } from "./hooks/useDocumentHandling";

export interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}

interface DriverDocumentsProps {
  documents: DocumentsState;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentsState>>;
  expirationDates?: ExpirationDatesState;
  setExpirationDates?: React.Dispatch<React.SetStateAction<ExpirationDatesState>>;
}

const DriverDocuments = ({ 
  documents, 
  setDocuments, 
  expirationDates = { drivingLicense: null }, 
  setExpirationDates 
}: DriverDocumentsProps) => {
  const {
    previews,
    fileInputRefs,
    handleFileChange,
    removeDocument,
    triggerFileInput
  } = useDocumentHandling({
    documents,
    setDocuments,
    expirationDates,
    setExpirationDates
  });

  const handleLicenseExpirationChange = (date: Date | null) => {
    if (setExpirationDates) {
      setExpirationDates(prev => ({
        ...prev,
        drivingLicense: date
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Documentos del Conductor</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documentFields.map((field) => (
          <DocumentCard
            key={field.key}
            documentKey={field.key}
            label={field.label}
            description={field.description}
            hasExpiration={field.hasExpiration}
            document={documents[field.key]}
            preview={previews[field.key]}
            expirationDate={field.key === 'drivingLicense' ? expirationDates.drivingLicense : undefined}
            onRemove={removeDocument}
            onTriggerFileInput={triggerFileInput}
            onExpirationChange={field.key === 'drivingLicense' ? handleLicenseExpirationChange : undefined}
            fileInputRef={fileInputRefs[field.key]}
            onFileChange={handleFileChange}
          />
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;
