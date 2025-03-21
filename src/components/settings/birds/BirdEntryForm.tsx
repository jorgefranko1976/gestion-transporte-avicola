
import { Form } from "@/components/ui/form";
import { useBirdEntryForm } from "./useBirdEntryForm";
import FarmCycleSelector from "./FarmCycleSelector";
import DateBreedSelector from "./DateBreedSelector";
import QuantityShedInputs from "./QuantityShedInputs";
import NotesInput from "./NotesInput";
import BirdEntryFormActions from "./BirdEntryFormActions";

interface BirdEntryFormProps {
  onSuccess?: () => void;
}

const BirdEntryForm = ({ onSuccess }: BirdEntryFormProps) => {
  const {
    form,
    selectedFarmId,
    setSelectedFarmId,
    availableCycles,
    setAvailableCycles,
    onSubmit,
    isSubmitting
  } = useBirdEntryForm({ onSuccess });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FarmCycleSelector 
          form={form}
          selectedFarmId={selectedFarmId}
          setSelectedFarmId={setSelectedFarmId}
          availableCycles={availableCycles}
          setAvailableCycles={setAvailableCycles}
        />
        
        <DateBreedSelector form={form} />
        
        <QuantityShedInputs form={form} />
        
        <NotesInput form={form} />
        
        <BirdEntryFormActions 
          onCancel={onSuccess || (() => {})} 
          isSubmitting={isSubmitting}
        />
      </form>
    </Form>
  );
};

export default BirdEntryForm;
