
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Save } from 'lucide-react';
import DriverDocuments from './DriverDocuments';
import DriverObservations from './DriverObservations';
import VehicleAssignment from './VehicleAssignment';
import BasicInformationTab from './tabs/BasicInformationTab';
import TabsContainer, { TabId } from './tabs/TabsContainer';
import { useDriverForm } from './hooks/useDriverForm';

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
    onSubmit,
  } = useDriverForm();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInformationTab form={form} />;
      case 'documents':
        return <DriverDocuments documents={documents} setDocuments={setDocuments} />;
      case 'observations':
        return <DriverObservations observations={observations} setObservations={setObservations} />;
      case 'vehicle':
        return (
          <VehicleAssignment
            selectedVehicleId={selectedVehicleId}
            setSelectedVehicleId={setSelectedVehicleId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {renderTabContent()}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">...</span>
                  <span>Guardando</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Conductor</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default DriverForm;
