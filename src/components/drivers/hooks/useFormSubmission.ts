import { supabase } from "@/integrations/supabase/client";
import { DriverFormValues } from "../schemas/driverFormSchema";
import { DocumentsState } from "./useDriverForm";
import { ExpirationDatesState } from "./useDocumentHandling";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface UseFormSubmissionProps {
  selectedVehicleId: string | null;
  documents: DocumentsState;
  expirationDates: ExpirationDatesState;
  observations: { content: string, document: File | null }[];
  resetFormState: () => void;
}

export const useFormSubmission = ({
  selectedVehicleId,
  documents,
  expirationDates,
  observations,
  resetFormState
}: UseFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (values: DriverFormValues) => {
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
          license_expiration: expirationDates.drivingLicense?.toISOString() || null,
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

      await uploadDocuments(driver.id, documents, observations);

      toast.success('Conductor registrado exitosamente');
      resetFormState();
      
    } catch (error) {
      console.error('Error registrando conductor:', error);
      toast.error('Error al registrar conductor. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadDocuments = async (
    driverId: string, 
    documents: DocumentsState,
    observations: { content: string, document: File | null }[]
  ) => {
    // Subir documentos si existen
    for (const [key, file] of Object.entries(documents)) {
      if (file) {
        // Subir archivo al bucket
        const fileName = `${driverId}/${key}_${Date.now()}`;
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
            driver_id: driverId,
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
        const fileName = `${driverId}/observation_${Date.now()}`;
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
          driver_id: driverId,
          content: obs.content,
          document_url: documentUrl
        });
    }
  };

  return {
    isSubmitting,
    submitForm
  };
};
