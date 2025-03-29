
import { useDriverForm } from './hooks/useDriverForm';
import { Form } from '@/components/ui/form';
import FormTabs from './form-sections/FormTabs';
import BasicInfoSection from './form-sections/BasicInfoSection';
import AccountSection from './form-sections/AccountSection';
import DriverDocuments from './DriverDocuments';
import DriverObservations from './DriverObservations';
import VehicleAssignment from './VehicleAssignment';
import FormActions from './form-sections/FormActions';

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

  return (
    <div>
      <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
