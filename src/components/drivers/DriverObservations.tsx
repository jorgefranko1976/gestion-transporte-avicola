
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload, X, FileText, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface Observation {
  content: string;
  document: File | null;
}

interface DriverObservationsProps {
  observations: Observation[];
  setObservations: React.Dispatch<React.SetStateAction<Observation[]>>;
}

const DriverObservations = ({ observations, setObservations }: DriverObservationsProps) => {
  const [newObservation, setNewObservation] = useState<string>('');
  const [observationDocument, setObservationDocument] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddObservation = () => {
    if (newObservation.trim()) {
      setObservations(prev => [
        ...prev,
        { content: newObservation, document: observationDocument }
      ]);
      
      setNewObservation('');
      setObservationDocument(null);
      setIsDialogOpen(false);
    }
  };

  const handleRemoveObservation = (index: number) => {
    setObservations(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setObservationDocument(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-medium">Observaciones y Llamados de Atención</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Agregar Observación</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Observación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium block mb-2">Fecha</label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(), "PPP", { locale: es })}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Contenido</label>
                <Textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Escribe la observación o llamado de atención..."
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Documento (opcional)</label>
                {observationDocument ? (
                  <div className="flex items-center justify-between px-3 py-2 border rounded-md">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate max-w-[240px]">
                        {observationDocument.name}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => setObservationDocument(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center px-6 py-4 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Subir documento</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG o PNG</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button 
                type="button" 
                onClick={handleAddObservation}
                disabled={!newObservation.trim()}
              >
                Agregar Observación
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {observations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No hay observaciones agregadas</p>
          <p className="text-sm text-muted-foreground mt-1">
            Haz clic en "Agregar Observación" para crear la primera
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {observations.map((observation, index) => (
            <Card key={index} className="border border-border">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(), "PPP", { locale: es })}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemoveObservation(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm my-3 whitespace-pre-line">{observation.content}</p>
                {observation.document && (
                  <div className="flex items-center gap-2 text-sm mt-2 text-primary">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[240px]">
                      {observation.document.name}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverObservations;
