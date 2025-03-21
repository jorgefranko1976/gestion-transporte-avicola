
import { IdentificationType } from './common-types';

// Driver types
export type DriverIdentificationType = 'CC' | 'CE' | 'NIT' | 'TI' | 'OTRO';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  birthDate: Date;
  address: string;
  phone: string;
  emergencyContact: string;
  documents: {
    drivingLicense: string | null;
    identification: string | null;
    resume: string | null;
    finesClearance: string | null;
    references: string | null;
    arl: string | null;
    payroll: string | null;
  };
  assignedVehicle: string | null;
  observations: Observation[];
  active: boolean;
  hireDate: Date;
  terminationDate: Date | null;
}

export interface Observation {
  id: string;
  date: Date;
  content: string;
  documentUrl: string | null;
}
