
import { DocumentType } from "../hooks/useDocumentHandling";

export interface DocumentField {
  key: DocumentType;
  label: string;
  description: string;
  hasExpiration: boolean;
}

export const documentFields: DocumentField[] = [
  { 
    key: 'drivingLicense', 
    label: 'Licencia de Conducción', 
    description: 'Licencia de conducción vigente',
    hasExpiration: true 
  },
  { 
    key: 'identification', 
    label: 'Documento de Identidad', 
    description: 'Cédula o documento de identidad',
    hasExpiration: false 
  },
  { 
    key: 'resume', 
    label: 'Hoja de Vida', 
    description: 'CV actualizado del conductor',
    hasExpiration: false 
  },
  { 
    key: 'finesClearance', 
    label: 'Paz y Salvo Multas', 
    description: 'Certificado SIMIT o paz y salvo de multas',
    hasExpiration: false 
  },
  { 
    key: 'references', 
    label: 'Referencias', 
    description: 'Referencias personales o laborales',
    hasExpiration: false 
  },
  { 
    key: 'arl', 
    label: 'ARL', 
    description: 'Certificado de afiliación a ARL',
    hasExpiration: false 
  },
  { 
    key: 'payroll', 
    label: 'Nómina', 
    description: 'Comprobante de pago o afiliación a seguridad social',
    hasExpiration: false 
  },
];
