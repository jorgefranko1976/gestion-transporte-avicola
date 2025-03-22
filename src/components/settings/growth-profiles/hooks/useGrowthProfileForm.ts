
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from 'uuid';
import { GrowthProfile, DailyConsumption, ChickenBreedType, ChickenSex } from "@/lib/types";
import { growthProfileFormSchema, GrowthProfileFormValues } from "@/components/farms/farmFormSchema";

interface UseGrowthProfileFormProps {
  profile: GrowthProfile | null;
  onSave: (profile: GrowthProfile, isNew: boolean) => void;
}

const useGrowthProfileForm = ({ profile, onSave }: UseGrowthProfileFormProps) => {
  const isNewProfile = !profile;
  
  // Create default daily consumption with required non-optional properties
  const defaultDailyConsumption: DailyConsumption[] = [
    { day: 1, amountPerBird: 12, waterPerBird: 25, expectedWeight: 55 },
    { day: 7, amountPerBird: 35, waterPerBird: 70, expectedWeight: 175 },
    { day: 14, amountPerBird: 68, waterPerBird: 140, expectedWeight: 430 },
    { day: 21, amountPerBird: 110, waterPerBird: 220, expectedWeight: 830 },
    { day: 28, amountPerBird: 155, waterPerBird: 310, expectedWeight: 1345 },
    { day: 35, amountPerBird: 190, waterPerBird: 380, expectedWeight: 1950 },
    { day: 42, amountPerBird: 205, waterPerBird: 410, expectedWeight: 2580 },
  ];
  
  const form = useForm<GrowthProfileFormValues>({
    resolver: zodResolver(growthProfileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      description: profile?.description || "",
      breed: profile?.breed || "cobb500",
      sex: profile?.sex || "mixto",
      isDefault: profile?.isDefault || false,
      active: profile?.active !== undefined ? profile.active : true,
      dailyConsumption: profile?.dailyConsumption || defaultDailyConsumption,
    },
  });

  const handleUpdateDailyConsumption = (updatedItems: DailyConsumption[]) => {
    form.setValue("dailyConsumption", updatedItems);
  };

  const onSubmit = (data: GrowthProfileFormValues) => {
    const savedProfile: GrowthProfile = {
      id: profile?.id || uuidv4(),
      name: data.name,
      description: data.description,
      breed: data.breed as ChickenBreedType,
      sex: data.sex as ChickenSex,
      dailyConsumption: data.dailyConsumption as DailyConsumption[],
      isDefault: data.isDefault || false,
      active: data.active,
      createdAt: profile?.createdAt || new Date(),
      updatedAt: profile ? new Date() : undefined,
    };
    
    onSave(savedProfile, isNewProfile);
  };

  return {
    form,
    isNewProfile,
    handleUpdateDailyConsumption,
    onSubmit
  };
};

export default useGrowthProfileForm;
