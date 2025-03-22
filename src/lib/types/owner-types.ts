
export interface VehicleOwnerDocuments {
  identification: string | null;
  rut: string | null;
  bankCertification: string | null;
  dataProcessingConsent: string | null;
  settlementCertificate: string | null;
  signedPromissoryNote: string | null;
  blankPromissoryInstructions: string | null;
}

export interface VehicleOwner {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  identificationType: string;
  identificationNumber: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  hasCredit?: boolean;
  creditAmount?: number | string;
  creditTerm?: string | number;
  creditEndDate?: Date;
  isPaid?: boolean;
  documents?: VehicleOwnerDocuments;
  isCompany?: boolean;
}
