
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FarmFormValues } from "./farmFormSchema";
import FarmIdentificationSection from "./form-sections/FarmIdentificationSection";
import FarmContactSection from "./form-sections/FarmContactSection";
import FarmResourcesSection from "./form-sections/FarmResourcesSection";

interface FarmBasicInfoProps {
  form: UseFormReturn<FarmFormValues>;
}

const FarmBasicInfo = ({ form }: FarmBasicInfoProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Información de Identificación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FarmIdentificationSection form={form} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FarmContactSection form={form} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recursos de la Granja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FarmResourcesSection form={form} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmBasicInfo;
