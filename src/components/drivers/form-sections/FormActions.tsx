
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { DriverFormValues } from '../schemas/driverFormSchema';

interface FormActionsProps {
  isSubmitting: boolean;
  form: UseFormReturn<DriverFormValues>;
}

const FormActions = ({ isSubmitting, form }: FormActionsProps) => {
  const handleSubmit = () => {
    if (!form.formState.isValid) {
      toast.error('Por favor, complete todos los campos requeridos correctamente');
    }
    
    form.handleSubmit(() => {})();
  };
  
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
        onClick={handleSubmit}
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
