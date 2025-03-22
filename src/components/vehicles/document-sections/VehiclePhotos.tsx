
import React from "react";
import DocumentUploader from "../DocumentUploader";
import { VehicleDocumentsState } from "../VehicleDocuments";

interface VehiclePhotosProps {
  photos: File[];
  onPhotoUpload: (file: File | null) => void;
  onPhotoRemove: (index: number) => void;
}

const VehiclePhotos: React.FC<VehiclePhotosProps> = ({
  photos,
  onPhotoUpload,
  onPhotoRemove
}) => {
  return (
    <div className="mt-8">
      <h4 className="text-md font-medium mb-4">Fotos del Vehículo</h4>
      <p className="text-sm text-muted-foreground mb-4">
        Sube hasta 3 fotos del interior de la carrocería del vehículo
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <DocumentUploader
            key={index}
            title={`Foto ${index + 1}`}
            description={`Interior de carrocería ${index + 1}`}
            file={photos[index] || null}
            onUpload={(file) => onPhotoUpload(file)}
            onRemove={() => onPhotoRemove(index)}
            isPhoto
          />
        ))}
      </div>
    </div>
  );
};

export default VehiclePhotos;
