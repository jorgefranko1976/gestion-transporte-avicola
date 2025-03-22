
import React from 'react';
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploader } from './components/FileUploader';
import { ExpirationDatePicker } from './components/ExpirationDatePicker';
import { FilePreview } from './components/FilePreview';
import { useFilePreview } from './hooks/useFilePreview';

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
  const { preview } = useFilePreview({ file });

  const handleFileUpload = (selectedFile: File) => {
    onUpload(selectedFile);
    toast.success(`${title} cargado con éxito`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {!file ? (
          <div className="p-6">
            <FileUploader
              title={title}
              description={description}
              onUpload={handleFileUpload}
              isPhoto={isPhoto}
            />
            
            {hasExpiration && onExpirationChange && (
              <ExpirationDatePicker
                expirationDate={expirationDate}
                onExpirationChange={onExpirationChange}
                className="mt-3 w-full"
              />
            )}
          </div>
        ) : (
          <div>
            <FilePreview
              file={file}
              preview={preview}
              isPhoto={isPhoto}
              onRemove={onRemove}
              hasExpiration={hasExpiration}
              expirationDate={expirationDate}
            />
            
            {hasExpiration && onExpirationChange && (
              <div className="p-2 border-t">
                <ExpirationDatePicker
                  expirationDate={expirationDate}
                  onExpirationChange={onExpirationChange}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
