
import { UseFormReturn } from "react-hook-form";
import { GrowthProfileFormValues } from "@/components/farms/farmFormSchema";
import { DailyConsumption } from "@/lib/types";
import DailyConsumptionTable from "../DailyConsumptionTable";

interface ProfileConsumptionSectionProps {
  form: UseFormReturn<GrowthProfileFormValues>;
  onUpdateConsumption: (items: DailyConsumption[]) => void;
}

const ProfileConsumptionSection = ({ form, onUpdateConsumption }: ProfileConsumptionSectionProps) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Consumo Diario</h4>
      <DailyConsumptionTable 
        items={form.watch("dailyConsumption") as DailyConsumption[]}
        onChange={onUpdateConsumption}
      />
    </div>
  );
};

export default ProfileConsumptionSection;
