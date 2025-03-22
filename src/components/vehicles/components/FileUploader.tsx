
import React, { useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploaderProps {
  title: string;
  description: string;
  onUpload: (file: File) => void;
  acceptTypes?: string;
  isPhoto?: boolean;
}

export const FileUploader = ({
  title,
  description,
  onUpload,
  acceptTypes = ".pdf,.doc,.docx,image/*",
  isPhoto = false
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      onUpload(selectedFile);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2 min-h-[160px]">
        <div className="bg-muted-foreground/10 rounded-full p-3">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="text-center space-y-1">
          <h4 className="text-sm font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div>
          <Input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={isPhoto ? "image/*" : acceptTypes}
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={triggerFileInput}
          >
            Seleccionar archivo
          </Button>
        </div>
      </div>
    </>
  );
};
