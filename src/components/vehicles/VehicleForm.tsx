
import { Form } from "@/components/ui/form";
import { useVehicleForm } from "./hooks/useVehicleForm";
import VehicleFormTabs from "./form-tabs/VehicleFormTabs";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehicleDocuments from "./VehicleDocuments";
import VehicleOwnerInfo from "./VehicleOwnerInfo";
import OwnerSelector from "./OwnerSelector";
import FormActions from "./form-sections/FormActions";
import { TabsContent } from "@/components/ui/tabs";

const VehicleForm = () => {
  const {
    form,
    activeTab,
    setActiveTab,
    showOwnerInfo,
    documents,
    setDocuments,
    ownerDocuments,
    setOwnerDocuments,
    handleOwnerTypeChange,
    onSubmit,
    resetForm
  } = useVehicleForm();

  return (
    <div className="space-y-6">
      <VehicleFormTabs activeTab={activeTab} onTabChange={setActiveTab}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="info" className="mt-6">
              <VehicleBasicInfo form={form} />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <VehicleDocuments 
                documents={documents} 
                setDocuments={setDocuments} 
              />
            </TabsContent>
            
            <TabsContent value="owner" className="mt-6">
              <div className="space-y-6">
                <OwnerSelector 
                  form={form} 
                  onOwnerTypeChange={handleOwnerTypeChange}
                />
                
                {showOwnerInfo && (
                  <VehicleOwnerInfo 
                    form={form} 
                    ownerDocuments={ownerDocuments} 
                    setOwnerDocuments={setOwnerDocuments} 
                  />
                )}
              </div>
            </TabsContent>

            <FormActions onReset={resetForm} />
          </form>
        </Form>
      </VehicleFormTabs>
    </div>
  );
};

export default VehicleForm;
