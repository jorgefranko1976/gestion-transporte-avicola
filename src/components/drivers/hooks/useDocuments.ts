
import { useState } from 'react';
import { DocumentsState } from './useDriverForm';

export interface ExpirationDatesState {
  drivingLicense: Date | null;
}

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

  const [expirationDates, setExpirationDates] = useState<ExpirationDatesState>({
    drivingLicense: null,
  });

  const [observations, setObservations] = useState<{ content: string, document: File | null }[]>([]);

  return {
    documents,
    setDocuments,
    expirationDates,
    setExpirationDates,
    observations,
    setObservations
  };
};
