
import { Form } from "@/components/ui/form";
import { GrowthProfile } from "@/lib/types";
import ProfileFormHeader from "./components/ProfileFormHeader";
import ProfileBasicFields from "./components/ProfileBasicFields";
import ProfileStatusFields from "./components/ProfileStatusFields";
import ProfileConsumptionSection from "./components/ProfileConsumptionSection";
import ProfileFormActions from "./components/ProfileFormActions";
import useGrowthProfileForm from "./hooks/useGrowthProfileForm";

interface GrowthProfileFormProps {
  profile: GrowthProfile | null;
  onSave: (profile: GrowthProfile, isNew: boolean) => void;
  onCancel: () => void;
}

const GrowthProfileForm = ({ profile, onSave, onCancel }: GrowthProfileFormProps) => {
  const { form, isNewProfile, handleUpdateDailyConsumption, onSubmit } = useGrowthProfileForm({
    profile,
    onSave
  });

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-card">
      <ProfileFormHeader isNewProfile={isNewProfile} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ProfileBasicFields form={form} />
          <ProfileStatusFields form={form} />
          <ProfileConsumptionSection 
            form={form} 
            onUpdateConsumption={handleUpdateDailyConsumption} 
          />
          <ProfileFormActions isNewProfile={isNewProfile} onCancel={onCancel} />
        </form>
      </Form>
    </div>
  );
};

export default GrowthProfileForm;
