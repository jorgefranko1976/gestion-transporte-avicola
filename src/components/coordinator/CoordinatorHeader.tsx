
import { Button } from "@/components/ui/button";
import { Eye, Upload } from "lucide-react";

interface CoordinatorHeaderProps {
  onViewExcel: () => void;
  onShowUploadModal: () => void;
}

const CoordinatorHeader = ({ onViewExcel, onShowUploadModal }: CoordinatorHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Sistema de Gestión Logística</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona vehículos, conductores y despachos de manera eficiente
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onViewExcel}
        >
          <Eye className="w-4 h-4" />
          <span>Ver Excel</span>
        </Button>
        
        <Button
          onClick={onShowUploadModal}
          className="flex items-center gap-2 btn-hover"
        >
          <Upload className="w-4 h-4" />
          <span>Cargar Excel</span>
        </Button>
      </div>
    </div>
  );
};

export default CoordinatorHeader;
