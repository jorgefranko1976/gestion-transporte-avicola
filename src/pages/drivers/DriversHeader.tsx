
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface DriversHeaderProps {
  activeTab: string;
  onRegisterClick: () => void;
}

const DriversHeader = ({ activeTab, onRegisterClick }: DriversHeaderProps) => {
  // Only show the button when we're on the list tab
  const rightContent = activeTab === "lista" && (
    <Button onClick={onRegisterClick} className="flex items-center gap-2">
      <UserPlus className="w-4 h-4" />
      <span>Registrar Conductor</span>
    </Button>
  );

  return rightContent;
};

export default DriversHeader;
