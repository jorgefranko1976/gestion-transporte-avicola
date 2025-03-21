
import { LineChart } from "lucide-react";

const CurveFeedInfo = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
      <h3 className="text-sm font-medium flex items-center gap-2 text-blue-800 mb-2">
        <LineChart className="h-4 w-4" />
        Información de Curva de Alimentación
      </h3>
      <p className="text-sm text-blue-700">
        La curva de alimentación determina el consumo diario esperado según la raza y sexo de las aves.
      </p>
    </div>
  );
};

export default CurveFeedInfo;
