
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, X, Image } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploaderProps {
  title: string;
  description: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

const PhotoUploader = ({ title, description, file, onUpload, onRemove }: PhotoUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      onUpload(selectedFile);
      
      // Crear URL para previsualización
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
      toast.success(`Foto de ${title} cargada con éxito`);
    }
  };

  const handleRemove = () => {
    onRemove();
    setPreviewUrl(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 h-full">
        {file && previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt={title}
              className="w-full h-[180px] object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 w-8 h-8 rounded-full"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 h-[180px] cursor-pointer border-2 border-dashed border-muted-foreground/20 rounded-md hover:bg-muted/20 transition-colors">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                className="mt-2"
                onClick={triggerFileInput}
              >
                Tomar foto
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              capture="environment"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUploader;
