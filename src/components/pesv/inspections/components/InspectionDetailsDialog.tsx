
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Inspection } from '../types/inspection-types';
import CheckItem from './CheckItem';

interface InspectionDetailsDialogProps {
  inspection: Inspection;
  onClose: () => void;
}

const InspectionDetailsDialog = ({ inspection, onClose }: InspectionDetailsDialogProps) => {
  return (
    <Dialog open={!!inspection} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalles de Inspección</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Fecha de Inspección</h3>
              <p className="font-medium">
                {format(inspection.date, "PPP 'a las' HH:mm", { locale: es })}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Vehículo</h3>
              <p className="font-medium">{inspection.vehiclePlate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Conductor</h3>
              <p className="font-medium">{inspection.driverName}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Observaciones</h3>
              <p className="font-medium whitespace-pre-line">
                {inspection.observations || 'Sin observaciones'}
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Checklist de Seguridad</h3>
              <ul className="space-y-2">
                <CheckItem
                  label="Llantas en buen estado"
                  checked={inspection.tiresOk}
                />
                <CheckItem
                  label="Luces funcionando correctamente"
                  checked={inspection.lightsOk}
                />
                <CheckItem
                  label="Sistema de frenos operativo"
                  checked={inspection.brakesOk}
                />
                <CheckItem
                  label="Espejos completos y en buen estado"
                  checked={inspection.mirrorsOk}
                />
                <CheckItem
                  label="Nivel de aceite correcto"
                  checked={inspection.oilOk}
                />
                <CheckItem
                  label="Nivel de agua/refrigerante adecuado"
                  checked={inspection.waterOk}
                />
                <CheckItem
                  label="Kit de carretera completo"
                  checked={inspection.kitOk}
                />
              </ul>
            </div>
            
            {/* Fotos */}
            {(inspection.tirePhotoUrl || inspection.kitPhotoUrl) && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Evidencias Fotográficas</h3>
                <div className="grid grid-cols-2 gap-2">
                  {inspection.tirePhotoUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Llantas</p>
                      <img 
                        src={inspection.tirePhotoUrl} 
                        alt="Llantas" 
                        className="rounded-md w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  
                  {inspection.kitPhotoUrl && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Kit de Carretera</p>
                      <img 
                        src={inspection.kitPhotoUrl} 
                        alt="Kit de Carretera" 
                        className="rounded-md w-full h-32 object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button>Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDetailsDialog;
