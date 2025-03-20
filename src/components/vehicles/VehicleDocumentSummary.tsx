
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from "@/lib/types";
import { format } from "date-fns";
import { CalendarCheck, FileText, Image, AlertTriangle, Check } from "lucide-react";

interface VehicleDocumentSummaryProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VehicleDocumentSummary = ({
  vehicle,
  open,
  onOpenChange,
}: VehicleDocumentSummaryProps) => {
  const { documents } = vehicle;
  
  const isDocumentExpired = (date: Date | null) => {
    if (!date) return false;
    return date < new Date();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Documentos del vehículo {vehicle.plate}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SOAT */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">SOAT</h3>
                </div>
                {documents.soat ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                }
              </div>
              
              {documents.soatExpiration && (
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarCheck className="h-4 w-4" />
                  <span className={isDocumentExpired(documents.soatExpiration) ? "text-red-500" : ""}>
                    Vence: {format(documents.soatExpiration, "dd/MM/yyyy")}
                  </span>
                </div>
              )}
              
              {!documents.soat && (
                <p className="text-sm text-muted-foreground mt-2">No cargado</p>
              )}
            </div>
            
            {/* Revisión Técnica */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Revisión Técnica</h3>
                </div>
                {documents.technicalInspection ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                }
              </div>
              
              {documents.technicalInspectionExpiration && (
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarCheck className="h-4 w-4" />
                  <span className={isDocumentExpired(documents.technicalInspectionExpiration) ? "text-red-500" : ""}>
                    Vence: {format(documents.technicalInspectionExpiration, "dd/MM/yyyy")}
                  </span>
                </div>
              )}
              
              {!documents.technicalInspection && (
                <p className="text-sm text-muted-foreground mt-2">No cargado</p>
              )}
            </div>
            
            {/* Póliza RC */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Póliza RC</h3>
                </div>
                {documents.rcPolicy ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                }
              </div>
              
              {documents.rcPolicyExpiration && (
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarCheck className="h-4 w-4" />
                  <span className={isDocumentExpired(documents.rcPolicyExpiration) ? "text-red-500" : ""}>
                    Vence: {format(documents.rcPolicyExpiration, "dd/MM/yyyy")}
                  </span>
                </div>
              )}
              
              {!documents.rcPolicy && (
                <p className="text-sm text-muted-foreground mt-2">No cargado</p>
              )}
            </div>
            
            {/* Contrato Empresa */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Contrato Empresa</h3>
                </div>
                {documents.companyContract ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                }
              </div>
              
              {!documents.companyContract && (
                <p className="text-sm text-muted-foreground mt-2">No cargado</p>
              )}
            </div>
            
            {/* Tarjeta de Propiedad */}
            <div className="p-4 border rounded-lg bg-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Tarjeta de Propiedad</h3>
                </div>
                {documents.propertyCard ? 
                  <Check className="h-5 w-5 text-green-500" /> : 
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                }
              </div>
              
              {!documents.propertyCard && (
                <p className="text-sm text-muted-foreground mt-2">No cargado</p>
              )}
            </div>
          </div>
          
          {/* Fotos */}
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Fotos del vehículo</h3>
            </div>
            
            {documents.photos && documents.photos.length > 0 ? (
              <div className="mt-2 text-sm">
                <p>{documents.photos.length} foto(s) cargada(s)</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No hay fotos cargadas</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDocumentSummary;
