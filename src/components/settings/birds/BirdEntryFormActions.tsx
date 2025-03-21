
import { Button } from "@/components/ui/button";
import { Bird } from "lucide-react";

interface BirdEntryFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

/**
 * Action buttons for the bird entry form
 * Includes cancel and submit buttons with appropriate styling and loading state
 */
const BirdEntryFormActions = ({ 
  onCancel, 
  isSubmitting = false 
}: BirdEntryFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="flex items-center gap-2"
        disabled={isSubmitting}
      >
        <Bird className="h-4 w-4" />
        {isSubmitting ? 'Registrando...' : 'Registrar Ingreso'}
      </Button>
    </div>
  );
};

export default BirdEntryFormActions;
