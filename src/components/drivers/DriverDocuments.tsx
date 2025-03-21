
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Check } from "lucide-react";

export interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}

type DocumentKey = keyof DocumentsState;

interface DriverDocumentsProps {
  documents: DocumentsState;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentsState>>;
}

const DriverDocuments = ({ documents, setDocuments }: DriverDocumentsProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentKey) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: e.target.files![0]
      }));
    }
  };

  const removeDocument = (documentType: DocumentKey) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
  };

  const documentFields = [
    { key: 'drivingLicense' as DocumentKey, label: 'Licencia de Conducción', description: 'Licencia de conducción vigente' },
    { key: 'identification' as DocumentKey, label: 'Documento de Identidad', description: 'Cédula o documento de identidad' },
    { key: 'resume' as DocumentKey, label: 'Hoja de Vida', description: 'CV actualizado del conductor' },
    { key: 'finesClearance' as DocumentKey, label: 'Paz y Salvo Multas', description: 'Certificado SIMIT o paz y salvo de multas' },
    { key: 'references' as DocumentKey, label: 'Referencias', description: 'Referencias personales o laborales' },
    { key: 'arl' as DocumentKey, label: 'ARL', description: 'Certificado de afiliación a ARL' },
    { key: 'payroll' as DocumentKey, label: 'Nómina', description: 'Comprobante de pago o afiliación a seguridad social' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <h3 className="text-lg font-medium border-b pb-3">Documentos del Conductor</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {documentFields.map((field) => (
          <Card key={field.key} className="overflow-hidden">
            <CardContent className="p-0">
              {documents[field.key] ? (
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
                      onClick={() => removeDocument(field.key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground truncate max-w-[180px]">
                      {documents[field.key]?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-4 h-full cursor-pointer">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{field.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                    </div>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, field.key)}
                  />
                </label>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;
