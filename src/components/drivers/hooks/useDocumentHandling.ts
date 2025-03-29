
import { useState, useRef } from "react";
import { toast } from "sonner";

export type DocumentType = 
  | 'drivingLicense'
  | 'identification'
  | 'resume'
  | 'finesClearance'
  | 'references'
  | 'arl'
  | 'payroll';

export interface DocumentFile {
  file: File | null;
  preview: string | null;
}

export type DocumentsState = Record<DocumentType, File | null>;
export type PreviewsState = Record<DocumentType, string | null>;

export interface ExpirationDatesState {
  drivingLicense: Date | null;
}

interface UseDocumentHandlingProps {
  documents: DocumentsState;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentsState>>;
  expirationDates?: ExpirationDatesState;
  setExpirationDates?: React.Dispatch<React.SetStateAction<ExpirationDatesState>>;
}

export const useDocumentHandling = ({ 
  documents, 
  setDocuments, 
  expirationDates,
  setExpirationDates 
}: UseDocumentHandlingProps) => {
  const [previews, setPreviews] = useState<PreviewsState>({
    drivingLicense: null,
    identification: null,
    resume: null,
    finesClearance: null,
    references: null,
    arl: null,
    payroll: null,
  });
  
  const fileInputRefs = {
    drivingLicense: useRef<HTMLInputElement>(null),
    identification: useRef<HTMLInputElement>(null),
    resume: useRef<HTMLInputElement>(null),
    finesClearance: useRef<HTMLInputElement>(null),
    references: useRef<HTMLInputElement>(null),
    arl: useRef<HTMLInputElement>(null),
    payroll: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
      
      // Generate preview
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviews(prev => ({
          ...prev,
          [documentType]: fileReader.result as string
        }));
      };
      fileReader.readAsDataURL(file);
      
      toast.success(`Documento ${documentType} cargado correctamente`);
    }
  };

  const removeDocument = (documentType: DocumentType) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    setPreviews(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    // If it's a license, also reset its expiration date
    if (documentType === 'drivingLicense' && setExpirationDates) {
      setExpirationDates(prev => ({
        ...prev,
        drivingLicense: null
      }));
    }
  };

  const triggerFileInput = (documentType: DocumentType) => {
    const inputRef = fileInputRefs[documentType];
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  return {
    previews,
    fileInputRefs,
    handleFileChange,
    removeDocument,
    triggerFileInput
  };
};
