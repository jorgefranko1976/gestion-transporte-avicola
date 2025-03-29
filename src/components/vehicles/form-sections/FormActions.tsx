
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onReset: () => void;
}

const FormActions = ({ onReset }: FormActionsProps) => {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
      >
        Cancelar
      </Button>
      <Button type="submit">Guardar Vehículo</Button>
    </div>
  );
};

export default FormActions;
