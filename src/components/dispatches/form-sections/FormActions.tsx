
import React from 'react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { DispatchFormValues } from '../schemas/dispatchFormSchema';

interface FormActionsProps {
  form: UseFormReturn<DispatchFormValues>;
  isCreating: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ form, isCreating }) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => form.reset()}
        disabled={isCreating}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isCreating}>
        {isCreating ? 'Creando...' : 'Crear Despacho'}
      </Button>
    </div>
  );
};
