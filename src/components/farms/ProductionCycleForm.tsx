
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productionCycleFormSchema, ProductionCycleFormValues } from "./farmFormSchema";
import { Farm, ChickenBreed, ChickenSex } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { growthProfiles } from "./production-cycle/mock-data";

// Componentes refactorizados
import FarmSelector from "./production-cycle/FarmSelector";
import CurveFeedInfo from "./production-cycle/CurveFeedInfo";
import ChickenBreedSelector from "./production-cycle/ChickenBreedSelector";
import ChickenSexSelector from "./production-cycle/ChickenSexSelector";
import GrowthProfileSelector from "./production-cycle/GrowthProfileSelector";
import DateSelectors from "./production-cycle/DateSelectors";
import BirdAndConcentrateInputs from "./production-cycle/BirdAndConcentrateInputs";
import NotesInput from "./production-cycle/NotesInput";
import FormButtons from "./production-cycle/FormButtons";

interface ProductionCycleFormProps {
  farms: Farm[];
  onSuccess?: () => void;
}

const ProductionCycleForm = ({ farms, onSuccess }: ProductionCycleFormProps) => {
  const { toast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [filteredProfiles, setFilteredProfiles] = useState(growthProfiles);
  
  const form = useForm<ProductionCycleFormValues>({
    resolver: zodResolver(productionCycleFormSchema),
    defaultValues: {
      startDate: new Date(),
      estimatedEndDate: new Date(new Date().setDate(new Date().getDate() + 45)),
      initialBirdCount: 0,
      growthProfileId: "",
      breed: "cobb500",
      sex: "mixto",
      concentrateReserve: 0,
      notes: "",
    },
  });
  
  // Filtra los perfiles de crecimiento según la raza y sexo seleccionados
  const filterProfiles = (breed: ChickenBreed, sex: ChickenSex) => {
    return growthProfiles.filter(profile => 
      (profile.breed === breed || profile.breed === "otras") && 
      (profile.sex === sex || profile.sex === "mixto")
    );
  };
  
  // Actualiza los perfiles cuando cambia la raza o el sexo
  const handleBreedOrSexChange = () => {
    const breed = form.getValues("breed") as ChickenBreed;
    const sex = form.getValues("sex") as ChickenSex;
    
    const filtered = filterProfiles(breed, sex);
    setFilteredProfiles(filtered);
    
    // Si el perfil actual no está en la lista filtrada, resetea la selección
    const currentProfileId = form.getValues("growthProfileId");
    if (currentProfileId && !filtered.find(p => p.id === currentProfileId)) {
      form.setValue("growthProfileId", "");
    }
  };
  
  const onSubmit = (data: ProductionCycleFormValues) => {
    if (!selectedFarm) {
      toast({
        title: "Error",
        description: "Debes seleccionar una granja",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Datos del ciclo:", { 
      ...data, 
      farmId: selectedFarm.id,
      farmName: selectedFarm.name
    });
    
    toast({
      title: "Ciclo creado",
      description: `Se ha creado un nuevo ciclo de producción para la granja ${selectedFarm.name}.`,
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const handleFarmChange = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    setSelectedFarm(farm || null);
    
    if (farm) {
      form.setValue("initialBirdCount", farm.chickenCapacity);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FarmSelector farms={farms} onFarmChange={handleFarmChange} />
          
          {selectedFarm && (
            <div className="space-y-6">
              <CurveFeedInfo />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChickenBreedSelector form={form} onBreedChange={handleBreedOrSexChange} />
                <ChickenSexSelector form={form} onSexChange={handleBreedOrSexChange} />
                <GrowthProfileSelector form={form} profiles={filteredProfiles} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DateSelectors form={form} />
                <BirdAndConcentrateInputs form={form} selectedFarm={selectedFarm} />
                <NotesInput form={form} />
              </div>
            </div>
          )}
        </div>
        
        <FormButtons isSubmitDisabled={!selectedFarm} />
      </form>
    </Form>
  );
};

export default ProductionCycleForm;
