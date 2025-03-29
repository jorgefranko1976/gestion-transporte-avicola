
import { Button } from "@/components/ui/button";
import { Bird } from "lucide-react";

interface FormActionsProps {
  onCancel?: () => void;
}

const FormActions = ({ onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit" className="flex items-center gap-2">
        <Bird className="h-4 w-4" />
        Registrar Ingreso
      </Button>
    </div>
  );
};

export default FormActions;
