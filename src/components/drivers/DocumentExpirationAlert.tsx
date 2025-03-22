
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Document {
  type: string;
  expiration: Date;
  daysUntilExpiration: number;
}

const DocumentExpirationAlert = () => {
  const [expiringDocuments, setExpiringDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const checkDocumentExpirations = async () => {
      // Obtener documentos próximos a vencer (30 días o menos)
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select(`
          soat_expiration,
          technical_inspection_expiration,
          drivers(license_expiration)
        `)
        .not('soat_expiration', 'is', null)
        .not('technical_inspection_expiration', 'is', null)
        .not('drivers.license_expiration', 'is', null);

      if (vehicleError) {
        console.error('Error al obtener documentos:', vehicleError);
        return;
      }

      const today = new Date();
      const documents: Document[] = [];

      vehicleData?.forEach(vehicle => {
        const soatExp = new Date(vehicle.soat_expiration!);
        const techExp = new Date(vehicle.technical_inspection_expiration!);
        
        // Accedemos correctamente a la licencia del conductor
        const driver = vehicle.drivers as unknown as { license_expiration: string };
        const licenseExp = new Date(driver.license_expiration);

        const checkExpiration = (date: Date, type: string) => {
          const diffTime = date.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 30 && diffDays > 0) {
            documents.push({
              type,
              expiration: date,
              daysUntilExpiration: diffDays
            });
          }
        };

        checkExpiration(soatExp, 'SOAT');
        checkExpiration(techExp, 'Técnico-mecánica');
        checkExpiration(licenseExp, 'Licencia de conducción');
      });

      setExpiringDocuments(documents);
    };

    checkDocumentExpirations();
  }, []);

  if (expiringDocuments.length === 0) return null;

  return (
    <div className="space-y-4">
      {expiringDocuments.map((doc, index) => (
        <Alert key={index} variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Documento próximo a vencer</AlertTitle>
          <AlertDescription>
            Tu {doc.type} vence en {doc.daysUntilExpiration} días ({new Date(doc.expiration).toLocaleDateString()})
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default DocumentExpirationAlert;
