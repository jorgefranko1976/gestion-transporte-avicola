
import { Form } from "@/components/ui/form";
import { useBirdEntryForm } from "./hooks/useBirdEntryForm";
import FarmAndCycleSection from "./sections/FarmAndCycleSection";
import DateAndBreedSection from "./sections/DateAndBreedSection";
import QuantityAndShedSection from "./sections/QuantityAndShedSection";
import NotesSection from "./sections/NotesSection";
import FormActions from "./sections/FormActions";

interface BirdEntryFormProps {
  onSuccess?: () => void;
}

const BirdEntryForm = ({ onSuccess }: BirdEntryFormProps) => {
  const {
    form,
    selectedFarmId,
    availableCycles,
    farms,
    handleFarmChange,
    onSubmit
  } = useBirdEntryForm({ onSuccess });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FarmAndCycleSection 
          form={form}
          farms={farms}
          availableCycles={availableCycles}
          selectedFarmId={selectedFarmId}
          onFarmChange={handleFarmChange}
        />
        
        <DateAndBreedSection form={form} />
        
        <QuantityAndShedSection form={form} />
        
        <NotesSection form={form} />
        
        <FormActions onCancel={onSuccess} />
      </form>
    </Form>
  );
};

export default BirdEntryForm;
