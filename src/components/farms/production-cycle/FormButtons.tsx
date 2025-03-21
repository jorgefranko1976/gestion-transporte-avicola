
import { Button } from "@/components/ui/button";

interface FormButtonsProps {
  isSubmitDisabled: boolean;
}

const FormButtons = ({ isSubmitDisabled }: FormButtonsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline">
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitDisabled}>
        Crear Ciclo
      </Button>
    </div>
  );
};

export default FormButtons;
