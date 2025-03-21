
import { IdentificationType } from './common-types';

export interface VehicleOwner {
  id: string;
  name?: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  isCompany?: boolean;
  firstName?: string;
  lastName?: string;
  hasCredit?: boolean;
  creditAmount?: string;
  creditTerm?: string;
  creditEndDate?: Date;
  isPaid?: boolean;
  documents?: {
    identification: string | null;
    rut: string | null;
    bankCertification: string | null;
    dataProcessingConsent: string | null;
    settlementCertificate: string | null;
    signedPromissoryNote: string | null;
    blankPromissoryInstructions: string | null;
  };
}
