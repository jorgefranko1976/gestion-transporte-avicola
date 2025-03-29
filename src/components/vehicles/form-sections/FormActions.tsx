
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onReset: () => void;
  isSubmitting?: boolean;
}

const FormActions = ({ onReset, isSubmitting = false }: FormActionsProps) => {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onReset}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="min-w-[120px]"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
      </Button>
    </div>
  );
};

export default FormActions;
