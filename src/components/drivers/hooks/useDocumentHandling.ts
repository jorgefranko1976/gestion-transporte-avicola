
import { useState, useRef } from 'react';

export type DocumentType = 'drivingLicense' | 'identification' | 'resume' | 'finesClearance' | 'references' | 'arl' | 'payroll';

export interface ExpirationDatesState {
  drivingLicense: Date | null;
  // Otros documentos con fechas de expiración pueden ser añadidos aquí
}

export interface DocumentHandlingProps {
  documents: Record<DocumentType, File | null>;
  setDocuments: React.Dispatch<React.SetStateAction<Record<DocumentType, File | null>>>;
  expirationDates?: ExpirationDatesState;
  setExpirationDates?: React.Dispatch<React.SetStateAction<ExpirationDatesState>>;
}

export const useDocumentHandling = (props?: DocumentHandlingProps) => {
  const [expirationDates, setExpirationDates] = useState<ExpirationDatesState>({
    drivingLicense: null,
  });

  const [observations, setObservations] = useState<string[]>([]);
  
  // Inicializar refs para cada tipo de documento
  const fileInputRefs = {
    drivingLicense: useRef<HTMLInputElement>(null),
    identification: useRef<HTMLInputElement>(null),
    resume: useRef<HTMLInputElement>(null),
    finesClearance: useRef<HTMLInputElement>(null),
    references: useRef<HTMLInputElement>(null),
    arl: useRef<HTMLInputElement>(null),
    payroll: useRef<HTMLInputElement>(null),
  };

  // Estado para previsualizaciones de archivos
  const [previews, setPreviews] = useState<Record<DocumentType, string | null>>({
    drivingLicense: null,
    identification: null,
    resume: null,
    finesClearance: null,
    references: null,
    arl: null,
    payroll: null,
  });

  const addObservation = (observation: string) => {
    setObservations(prev => [...prev, observation]);
  };

  const removeObservation = (index: number) => {
    setObservations(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Si se proporcionaron props, usar la función setDocuments de props
      if (props?.setDocuments) {
        props.setDocuments(prev => ({
          ...prev,
          [documentType]: file
        }));
      }
      
      // Crear URL para previsualización
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [documentType]: previewUrl
      }));
    }
  };

  const removeDocument = (documentType: DocumentType) => {
    // Si se proporcionaron props, usar la función setDocuments de props
    if (props?.setDocuments) {
      props.setDocuments(prev => ({
        ...prev,
        [documentType]: null
      }));
    }
    
    // Limpiar previsualización
    if (previews[documentType]) {
      URL.revokeObjectURL(previews[documentType]!);
      setPreviews(prev => ({
        ...prev,
        [documentType]: null
      }));
    }
  };

  const triggerFileInput = (documentType: DocumentType) => {
    fileInputRefs[documentType]?.current?.click();
  };

  return {
    expirationDates: props?.expirationDates || expirationDates,
    setExpirationDates: props?.setExpirationDates || setExpirationDates,
    observations,
    setObservations,
    addObservation,
    removeObservation,
    previews,
    fileInputRefs,
    handleFileChange,
    removeDocument,
    triggerFileInput
  };
};
