
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface CycleFinalizationProps {
  cycleId: string;
  onSuccess: () => void;
}

const CycleFinalization = ({ cycleId, onSuccess }: CycleFinalizationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [finalBirdCount, setFinalBirdCount] = useState<number>(0);
  const [finalWeight, setFinalWeight] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalize = async () => {
    if (!finalBirdCount || !finalWeight) {
      toast.error("Por favor complete todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('production_cycles')
        .update({
          status: 'completed',
          end_date: new Date().toISOString(),
          current_bird_count: finalBirdCount,
        })
        .eq('id', cycleId);

      if (error) throw error;

      toast.success("Ciclo finalizado exitosamente");
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error al finalizar ciclo:', error);
      toast.error("Error al finalizar el ciclo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive"
        onClick={() => setIsOpen(true)}
      >
        Finalizar Ciclo
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalizar Ciclo de Producción</DialogTitle>
            <DialogDescription>
              Ingrese los datos finales del ciclo de producción
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="birdCount">Cantidad Final de Aves</Label>
              <Input
                id="birdCount"
                type="number"
                placeholder="Ingrese la cantidad final de aves"
                value={finalBirdCount || ''}
                onChange={(e) => setFinalBirdCount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Peso Promedio Final (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                placeholder="Ingrese el peso promedio final"
                value={finalWeight || ''}
                onChange={(e) => setFinalWeight(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFinalize}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Finalizando...' : 'Finalizar Ciclo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CycleFinalization;
