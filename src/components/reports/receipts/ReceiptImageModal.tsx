
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';

interface ReceiptImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ReceiptImageModal = ({ imageUrl, onClose }: ReceiptImageModalProps) => {
  if (!imageUrl) return null;
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `remision_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={!!imageUrl} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Imagen de Remisión</DialogTitle>
          <DialogDescription>
            Visualización de comprobante de entrega
          </DialogDescription>
          <DialogClose className="absolute right-4 top-4" asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <div className="max-h-[60vh] overflow-auto my-4">
            <img 
              src={imageUrl} 
              alt="Remisión" 
              className="max-w-full h-auto"
            />
          </div>
          <Button 
            variant="outline" 
            className="mt-2 flex items-center gap-2 w-full sm:w-auto"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            <span>Descargar imagen</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
