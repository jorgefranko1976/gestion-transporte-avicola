
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { DriverFormValues } from '../schemas/driverFormSchema';

interface FormActionsProps {
  isSubmitting: boolean;
  form: UseFormReturn<DriverFormValues>;
}

const FormActions = ({ isSubmitting, form }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => form.reset()}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin">...</span>
            <span>Guardando</span>
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            <span>Guardar Conductor</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
