
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Check, Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface DocumentsState {
  drivingLicense: File | null;
  identification: File | null;
  resume: File | null;
  finesClearance: File | null;
  references: File | null;
  arl: File | null;
  payroll: File | null;
}

interface ExpirationDatesState {
  drivingLicense: Date | null;
}

type DocumentKey = keyof DocumentsState;

interface DriverDocumentsProps {
  documents: DocumentsState;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentsState>>;
  expirationDates?: ExpirationDatesState;
  setExpirationDates?: React.Dispatch<React.SetStateAction<ExpirationDatesState>>;
}

const DriverDocuments = ({ 
  documents, 
  setDocuments, 
  expirationDates = { drivingLicense: null }, 
  setExpirationDates 
}: DriverDocumentsProps) => {
  const [previews, setPreviews] = useState<Record<DocumentKey, string | null>>({
    drivingLicense: null,
    identification: null,
    resume: null,
    finesClearance: null,
    references: null,
    arl: null,
    payroll: null,
  });
  
  const fileInputRefs = {
    drivingLicense: useRef<HTMLInputElement>(null),
    identification: useRef<HTMLInputElement>(null),
    resume: useRef<HTMLInputElement>(null),
    finesClearance: useRef<HTMLInputElement>(null),
    references: useRef<HTMLInputElement>(null),
    arl: useRef<HTMLInputElement>(null),
    payroll: useRef<HTMLInputElement>(null),
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentType: DocumentKey) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
      
      // Generar vista previa
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviews(prev => ({
          ...prev,
          [documentType]: fileReader.result as string
        }));
      };
      fileReader.readAsDataURL(file);
      
      toast.success(`Documento ${documentType} cargado correctamente`);
    }
  };

  const removeDocument = (documentType: DocumentKey) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    setPreviews(prev => ({
      ...prev,
      [documentType]: null
    }));
    
    // Si es la licencia, también resetear su fecha de vencimiento
    if (documentType === 'drivingLicense' && setExpirationDates) {
      setExpirationDates(prev => ({
        ...prev,
        drivingLicense: null
      }));
    }
  };

  const handleLicenseExpirationChange = (date: Date | null) => {
    if (setExpirationDates) {
      setExpirationDates(prev => ({
        ...prev,
        drivingLicense: date
      }));
    }
  };

  const triggerFileInput = (documentType: DocumentKey) => {
    const inputRef = fileInputRefs[documentType];
    if (inputRef && inputRef.current) {
      inputRef.current.click();
    }
  };

  const documentFields = [
    { 
      key: 'drivingLicense' as DocumentKey, 
      label: 'Licencia de Conducción', 
      description: 'Licencia de conducción vigente',
      hasExpiration: true 
    },
    { 
      key: 'identification' as DocumentKey, 
      label: 'Documento de Identidad', 
      description: 'Cédula o documento de identidad',
      hasExpiration: false 
    },
    { 
      key: 'resume' as DocumentKey, 
      label: 'Hoja de Vida', 
      description: 'CV actualizado del conductor',
      hasExpiration: false 
    },
    { 
      key: 'finesClearance' as DocumentKey, 
      label: 'Paz y Salvo Multas', 
      description: 'Certificado SIMIT o paz y salvo de multas',
      hasExpiration: false 
    },
    { 
      key: 'references' as DocumentKey, 
      label: 'Referencias', 
      description: 'Referencias personales o laborales',
      hasExpiration: false 
    },
    { 
      key: 'arl' as DocumentKey, 
      label: 'ARL', 
      description: 'Certificado de afiliación a ARL',
      hasExpiration: false 
    },
    { 
      key: 'payroll' as DocumentKey, 
      label: 'Nómina', 
      description: 'Comprobante de pago o afiliación a seguridad social',
      hasExpiration: false 
    },
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
                  
                  {previews[field.key] && previews[field.key]?.includes('image') ? (
                    <div className="w-full max-h-40 overflow-hidden mb-2">
                      <img 
                        src={previews[field.key] || ''} 
                        alt={field.label}
                        className="w-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate max-w-[180px]">
                        {documents[field.key]?.name}
                      </span>
                    </div>
                  )}
                  
                  {field.key === 'drivingLicense' && setExpirationDates && (
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
                              !expirationDates.drivingLicense && "text-muted-foreground"
                            )}
                          >
                            {expirationDates.drivingLicense ? (
                              format(expirationDates.drivingLicense, "dd/MM/yyyy")
                            ) : (
                              <span>Seleccionar fecha de vencimiento</span>
                            )}
                            <Calendar className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <CalendarComponent
                            mode="single"
                            selected={expirationDates.drivingLicense || undefined}
                            onSelect={handleLicenseExpirationChange}
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
              ) : (
                <div className="flex flex-col items-center justify-center p-4 h-full cursor-pointer">
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
                      onClick={() => triggerFileInput(field.key)}
                    >
                      Seleccionar archivo
                    </Button>
                  </div>
                  <input
                    ref={fileInputRefs[field.key]}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, field.key)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverDocuments;
