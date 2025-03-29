
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Check, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DocumentType } from "../hooks/useDocumentHandling";

interface DocumentCardProps {
  documentKey: DocumentType;
  label: string;
  description: string;
  hasExpiration: boolean;
  document: File | null;
  preview: string | null;
  expirationDate?: Date | null;
  onRemove: (documentType: DocumentType) => void;
  onTriggerFileInput: (documentType: DocumentType) => void;
  onExpirationChange?: (date: Date | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentType) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  documentKey,
  label,
  description,
  hasExpiration,
  document,
  preview,
  expirationDate,
  onRemove,
  onTriggerFileInput,
  onExpirationChange,
  fileInputRef,
  onFileChange,
}) => {
  // Cálculo de límites para el calendario de vencimiento
  const currentYear = new Date().getFullYear();
  const toYear = currentYear + 10; // Permitir fechas hasta 10 años en el futuro
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {document ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="font-medium">Documento cargado</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(documentKey)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {preview && preview.includes('image') ? (
              <div className="w-full max-h-40 overflow-hidden mb-2">
                <img 
                  src={preview} 
                  alt={label}
                  className="w-full object-contain" 
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate max-w-[180px]">
                  {document?.name}
                </span>
              </div>
            )}
            
            {documentKey === 'drivingLicense' && hasExpiration && onExpirationChange && (
              <div className="mt-2">
                <div className="text-xs text-muted-foreground mb-1">
                  Fecha de vencimiento:
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full flex items-center justify-center gap-2 text-xs",
                        !expirationDate && "text-muted-foreground"
                      )}
                    >
                      {expirationDate ? (
                        format(expirationDate, "dd/MM/yyyy")
                      ) : (
                        <span>Seleccionar fecha de vencimiento</span>
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
                      captionLayout="dropdown-buttons"
                      fromYear={currentYear}
                      toYear={toYear}
                      classNames={{
                        caption_dropdowns: "flex justify-center gap-1",
                        caption_label: "text-sm font-medium hidden",
                        dropdown: "p-1",
                        dropdown_month: "text-sm py-1 px-2 rounded hover:bg-accent",
                        dropdown_year: "text-sm py-1 px-2 rounded hover:bg-accent",
                        vhidden: "sr-only",
                      }}
                      className={cn("p-3 pointer-events-auto")}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 h-full cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => onTriggerFileInput(documentKey)}
              >
                Seleccionar archivo
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileChange(e, documentKey)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
