
import { useState } from 'react';
import { DocumentsState } from './useDriverForm';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<DocumentsState>({
    drivingLicense: null,
    identification: null,
    resume: null,
    finesClearance: null,
    references: null,
    arl: null,
    payroll: null,
  });

  const [observations, setObservations] = useState<{ content: string, document: File | null }[]>([]);

  return {
    documents,
    setDocuments,
    observations,
    setObservations
  };
};
