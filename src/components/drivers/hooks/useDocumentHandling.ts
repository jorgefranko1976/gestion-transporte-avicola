
import { useState } from 'react';

export interface ExpirationDatesState {
  drivingLicense: Date | null;
  // Otros documentos con fechas de expiración pueden ser añadidos aquí
}

export const useDocumentHandling = () => {
  const [expirationDates, setExpirationDates] = useState<ExpirationDatesState>({
    drivingLicense: null,
  });

  const [observations, setObservations] = useState<string[]>([]);

  const addObservation = (observation: string) => {
    setObservations(prev => [...prev, observation]);
  };

  const removeObservation = (index: number) => {
    setObservations(prev => prev.filter((_, i) => i !== index));
  };

  return {
    expirationDates,
    setExpirationDates,
    observations,
    setObservations,
    addObservation,
    removeObservation
  };
};
