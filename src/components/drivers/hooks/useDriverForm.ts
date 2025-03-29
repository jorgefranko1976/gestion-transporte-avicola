
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { driverFormSchema, DriverFormValues } from '../schemas/driverFormSchema';

export interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}

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
  const [activeTab, setActiveTab] = useState<'basic' | 'account' | 'documents' | 'observations' | 'vehicle'>('basic');

  // Inicializar el formulario
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

  // Calcular edad
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

  // Enviar formulario
  const onSubmit = async (values: DriverFormValues) => {
    setIsSubmitting(true);
    try {
      // Primero, crear el usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: 'driver',
            identification_type: values.identificationType,
            identification_number: values.identificationNumber,
            phone: values.phone
          }
        }
      });

      if (authError) {
        console.error('Error al crear la cuenta de usuario:', authError);
        if (authError.message.includes('already') || authError.message.includes('exist')) {
          toast.error('Error: Este correo electrónico ya está registrado');
        } else {
          toast.error('Error al crear la cuenta de usuario: ' + authError.message);
        }
        setIsSubmitting(false);
        return;
      }

      console.log('Usuario creado exitosamente:', authData.user?.id);
      
      // Si la creación del usuario fue exitosa, procedemos con la creación del conductor
      // Insertar el conductor en la base de datos
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

      if (driverError) {
        console.error('Error registrando conductor:', driverError);
        if (driverError.message.includes('unique') || driverError.message.includes('duplicate')) {
          toast.error('Error: Ya existe un conductor con este número de identificación');
        } else {
          toast.error('Error al registrar conductor: ' + driverError.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Subir documentos si existen
      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          // Subir archivo al bucket
          const fileName = `${driver.id}/${key}_${Date.now()}`;
          const { data: fileData, error: storageError } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

          if (storageError) {
            console.error('Error subiendo documento:', storageError);
            toast.error(`Error al subir el documento ${key}: ${storageError.message}`);
            continue;
          }

          // Obtener URL pública
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

          // Guardar referencia en la base de datos
          await supabase
            .from('driver_documents')
            .insert({
              driver_id: driver.id,
              document_type: key,
              document_url: publicUrl
            });
        }
      }

      // Guardar observaciones si existen
      for (const obs of observations) {
        let documentUrl = null;

        if (obs.document) {
          // Subir documento de observación
          const fileName = `${driver.id}/observation_${Date.now()}`;
          await supabase.storage
            .from('documents')
            .upload(fileName, obs.document);

          // Obtener URL pública
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);
            
          documentUrl = publicUrl;
        }

        // Insertar observación
        await supabase
          .from('driver_observations')
          .insert({
            driver_id: driver.id,
            content: obs.content,
            document_url: documentUrl
          });
      }

      toast.success('Conductor registrado exitosamente');
      
      // Reiniciar formulario
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
      toast.error('Error al registrar conductor. Intente nuevamente.');
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
    calculateAge,
    onSubmit
  };
};
