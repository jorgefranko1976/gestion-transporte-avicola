
import { LineChart } from "lucide-react";

interface ProfileFormHeaderProps {
  isNewProfile: boolean;
}

const ProfileFormHeader = ({ isNewProfile }: ProfileFormHeaderProps) => {
  return (
    <div className="flex items-center gap-2 text-primary">
      <LineChart className="h-5 w-5" />
      <h3 className="text-lg font-semibold">
        {isNewProfile ? "Crear nuevo perfil de crecimiento" : "Editar perfil de crecimiento"}
      </h3>
    </div>
  );
};

export default ProfileFormHeader;
