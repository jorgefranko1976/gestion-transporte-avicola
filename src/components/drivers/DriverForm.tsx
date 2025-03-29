
import { useDriverForm } from './hooks/useDriverForm';
import { Form } from '@/components/ui/form';
import FormTabs from './form-sections/FormTabs';
import BasicInfoSection from './form-sections/BasicInfoSection';
import AccountSection from './form-sections/AccountSection';
import DriverDocuments from './DriverDocuments';
import DriverObservations from './DriverObservations';
import VehicleAssignment from './VehicleAssignment';
import FormActions from './form-sections/FormActions';
import { toast } from 'sonner';

const DriverForm = () => {
  const {
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
  } = useDriverForm();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await form.trigger();
    if (!isValid) {
      const errors = form.formState.errors;
      if (errors.firstName || errors.lastName || errors.identificationType || 
          errors.identificationNumber || errors.birthDate || errors.address ||
          errors.phone || errors.emergencyContact || errors.hireDate) {
        setActiveTab('basic');
        toast.error('Hay errores en la información básica');
        return;
      }
      
      if (errors.email || errors.password || errors.confirmPassword) {
        setActiveTab('account');
        toast.error('Hay errores en la información de cuenta');
        return;
      }
      
      toast.error('Por favor, complete todos los campos requeridos correctamente');
      return;
    }
    
    form.handleSubmit(onSubmit)(e);
  };

  return (
    <div>
      <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
          {activeTab === 'basic' && (
            <BasicInfoSection form={form} calculateAge={calculateAge} />
          )}
          
          {activeTab === 'account' && (
            <AccountSection form={form} />
          )}
          
          {activeTab === 'documents' && (
            <DriverDocuments documents={documents} setDocuments={setDocuments} />
          )}
          
          {activeTab === 'observations' && (
            <DriverObservations observations={observations} setObservations={setObservations} />
          )}
          
          {activeTab === 'vehicle' && (
            <VehicleAssignment 
              selectedVehicleId={selectedVehicleId} 
              setSelectedVehicleId={setSelectedVehicleId} 
            />
          )}
          
          <FormActions isSubmitting={isSubmitting} form={form} />
        </form>
      </Form>
    </div>
  );
};

export default DriverForm;
