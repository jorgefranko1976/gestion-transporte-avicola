import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverFormSchema, DriverFormValues } from '../schemas/driverFormSchema';
import { useDocuments } from './useDocuments';
import { useFormSubmission } from './useFormSubmission';
import { DocumentType } from './useDocumentHandling';

export type DocumentsState = Record<DocumentType, File | null>;

export const useDriverForm = () => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'account' | 'documents' | 'observations' | 'vehicle'>('basic');

  const {
    documents,
    setDocuments,
    expirationDates,
    setExpirationDates,
    observations,
    setObservations
  } = useDocuments();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      identificationType: 'CC',
      identificationNumber: '',
      birthDate: undefined,
      address: '',
      phone: '',
      emergencyContact: '',
      hireDate: new Date(),
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const resetFormState = () => {
    form.reset();
    setDocuments({
      drivingLicense: null,
      identification: null,
      resume: null,
      finesClearance: null,
      references: null,
      arl: null,
      payroll: null,
    });
    setExpirationDates({
      drivingLicense: null
    });
    setObservations([]);
    setSelectedVehicleId(null);
    setActiveTab('basic');
  };

  const {
    isSubmitting,
    submitForm
  } = useFormSubmission({
    selectedVehicleId,
    documents,
    expirationDates,
    observations,
    resetFormState
  });

  const calculateAge = (birthDate: Date | undefined) => {
    if (!birthDate) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} años`;
  };

  return {
    form,
    isSubmitting,
    documents,
    setDocuments,
    expirationDates,
    setExpirationDates,
    observations,
    setObservations,
    selectedVehicleId,
    setSelectedVehicleId,
    activeTab,
    setActiveTab,
    calculateAge,
    onSubmit: submitForm
  };
};
