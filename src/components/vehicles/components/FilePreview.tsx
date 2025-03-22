
import React from 'react';
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface FilePreviewProps {
  file: File;
  preview: string | null;
  isPhoto?: boolean;
  onRemove: () => void;
  hasExpiration?: boolean;
  expirationDate?: Date | null;
}

export const FilePreview = ({
  file,
  preview,
  isPhoto = false,
  onRemove,
  hasExpiration = false,
  expirationDate = null,
}: FilePreviewProps) => {
  return (
    <div className="relative">
      {isPhoto && preview ? (
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={preview} 
            alt="Preview" 
            className="h-full w-full object-cover" 
          />
        </div>
      ) : preview && !isPhoto && preview.includes('image') ? (
        <div className="p-4">
          <div className="w-full h-40 overflow-hidden bg-muted flex items-center justify-center">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-full max-w-full object-contain" 
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-6 min-h-[160px] bg-muted/20">
          <div className="text-center space-y-2">
            <div className="bg-primary/10 rounded-full p-3 mx-auto">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium truncate max-w-[180px] mx-auto">{file.name}</h4>
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
        onClick={onRemove}
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
    </div>
  );
};
