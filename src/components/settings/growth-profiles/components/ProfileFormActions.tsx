
import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  isNewProfile: boolean;
  onCancel: () => void;
}

const ProfileFormActions = ({ isNewProfile, onCancel }: ProfileFormActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancelar
      </Button>
      <Button type="submit">
        {isNewProfile ? "Crear Perfil" : "Actualizar Perfil"}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
