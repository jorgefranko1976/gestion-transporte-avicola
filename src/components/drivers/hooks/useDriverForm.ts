
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DriverFormValues, DocumentsState, driverFormSchema } from '../driver-form-schema';
import { TabId } from '../tabs/TabsContainer';

export const useDriverForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('basic');

  // Initialize the form
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
    },
  });

  // Submit form
  const onSubmit = async (values: DriverFormValues) => {
    setIsSubmitting(true);
    try {
      // Insert driver in the database
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .insert({
          first_name: values.firstName,
          last_name: values.lastName,
          identification_type: values.identificationType,
          identification_number: values.identificationNumber,
          birth_date: values.birthDate.toISOString(),
          address: values.address,
          phone: values.phone,
          emergency_contact: values.emergencyContact,
          hire_date: values.hireDate.toISOString(),
          assigned_vehicle_id: selectedVehicleId,
          license_expiration: values.licenseExpiration?.toISOString() || null,
          active: true
        })
        .select()
        .single();

      if (driverError) throw driverError;

      // Upload documents if they exist
      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          // Upload file to bucket
          const fileName = `${driver.id}/${key}_${Date.now()}`;
          const { data: fileData, error: storageError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

          if (storageError) throw storageError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Save reference in database
          await supabase
            .from('driver_documents')
            .insert({
              driver_id: driver.id,
              document_type: key,
              document_url: publicUrl
            });
        }
      }

      // Save observations if they exist
      for (const obs of observations) {
        let documentUrl = null;

        if (obs.document) {
          // Upload observation document
          const fileName = `${driver.id}/observation_${Date.now()}`;
          await supabase.storage
            .from('documents')
            .upload(fileName, obs.document);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
            
          documentUrl = publicUrl;
        }

        // Insert observation
        await supabase
          .from('driver_observations')
          .insert({
            driver_id: driver.id,
            content: obs.content,
            document_url: documentUrl
          });
      }

      toast.success('Conductor registrado exitosamente');
      
      // Reset form
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
      setObservations([]);
      setSelectedVehicleId(null);
      setActiveTab('basic');
      
    } catch (error) {
      console.error('Error registrando conductor:', error);
      toast.error('Error al registrar conductor');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    documents,
    setDocuments,
    observations,
    setObservations,
    selectedVehicleId,
    setSelectedVehicleId,
    activeTab,
    setActiveTab,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
