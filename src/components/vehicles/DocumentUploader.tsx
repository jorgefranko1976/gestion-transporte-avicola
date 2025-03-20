
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileX, Upload, X } from "lucide-react";

interface DocumentUploaderProps {
  title: string;
  description: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isPhoto?: boolean;
}

const DocumentUploader = ({
  title,
  description,
  file,
  onUpload,
  onRemove,
  isPhoto = false,
}: DocumentUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onUpload(selectedFile);
      
      // Crear URL para vista previa
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    }
  };

  const handleRemove = () => {
    onRemove();
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {!file ? (
          <div className="p-6">
            <div className="flex flex-col items-center justify-center space-y-2 min-h-[160px]">
              <div className="bg-muted-foreground/10 rounded-full p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-medium">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <label className="cursor-pointer">
                <Input
                  type="file"
                  className="hidden"
                  accept={isPhoto ? "image/*" : ".pdf,.doc,.docx,image/*"}
                  onChange={handleFileChange}
                />
                <Button type="button" variant="outline" size="sm">
                  Seleccionar archivo
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="relative">
            {preview && isPhoto ? (
              <div className="aspect-square overflow-hidden bg-muted">
                <img 
                  src={preview} 
                  alt={title} 
                  className="h-full w-full object-cover" 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center p-6 min-h-[160px] bg-muted/20">
                <div className="text-center space-y-2">
                  <div className="bg-primary/10 rounded-full p-3 mx-auto">
                    <FileX className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium truncate max-w-[180px]">{file.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </Button>
            
            <div className="bg-muted/50 p-2 border-t">
              <p className="text-xs font-medium truncate">{file.name}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
