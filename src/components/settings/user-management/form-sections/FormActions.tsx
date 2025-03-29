
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ isEditing, onCancel }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
      </Button>
    </div>
  );
};

export default FormActions;
