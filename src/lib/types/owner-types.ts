
import { IdentificationType } from './common-types';

// Información del propietario del vehículo
export interface VehicleOwner {
  id: string; // Agregamos un ID para referenciar al propietario
  firstName: string;
  lastName: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  address: string;
  city: string;
  phone: string;
  hasCredit: boolean;
  creditAmount?: string;
  creditTerm?: string;
  creditEndDate?: Date;
  isPaid?: boolean;
  documents: {
    identification: string | null;
    rut: string | null;
    bankCertification: string | null;
    dataProcessingConsent: string | null;
    settlementCertificate: string | null;
    signedPromissoryNote: string | null;
    blankPromissoryInstructions: string | null;
  };
}
