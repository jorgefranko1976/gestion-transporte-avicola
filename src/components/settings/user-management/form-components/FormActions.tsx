
import React from 'react';
import { Button } from '@/components/ui/button';

interface FormActionsProps {
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ isEditing, onCancel }) => {
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
