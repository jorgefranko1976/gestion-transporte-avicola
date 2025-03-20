
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileX, Upload, X, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DocumentUploaderProps {
  title: string;
  description: string;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isPhoto?: boolean;
  hasExpiration?: boolean;
  expirationDate?: Date | null;
  onExpirationChange?: (date: Date | null) => void;
}

const DocumentUploader = ({
  title,
  description,
  file,
  onUpload,
  onRemove,
  isPhoto = false,
  hasExpiration = false,
  expirationDate = null,
  onExpirationChange,
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
              
              {hasExpiration && onExpirationChange && (
                <div className="mt-3 w-full">
                  <div className="text-xs text-muted-foreground mb-1 text-center">
                    Fecha de vencimiento:
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-full flex items-center justify-center gap-2",
                          !expirationDate && "text-muted-foreground"
                        )}
                      >
                        {expirationDate ? (
                          format(expirationDate, "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <CalendarComponent
                        mode="single"
                        selected={expirationDate || undefined}
                        onSelect={onExpirationChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
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
              
              {hasExpiration && expirationDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Vence: {format(expirationDate, "dd/MM/yyyy")}
                </p>
              )}
            </div>
            
            {hasExpiration && onExpirationChange && (
              <div className="p-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">
                  Fecha de vencimiento:
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2 h-8"
                    >
                      {expirationDate ? (
                        format(expirationDate, "dd/MM/yyyy")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      <Calendar className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <CalendarComponent
                      mode="single"
                      selected={expirationDate || undefined}
                      onSelect={onExpirationChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
