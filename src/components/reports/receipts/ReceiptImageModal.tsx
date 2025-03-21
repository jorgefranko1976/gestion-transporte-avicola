
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReceiptImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ReceiptImageModal = ({ imageUrl, onClose }: ReceiptImageModalProps) => {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Imagen de Remisión</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt="Remisión" 
              className="max-h-[70vh] object-contain rounded-md"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
