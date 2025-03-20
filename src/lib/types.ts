
// Vehicle types
export type VehicleType = 'camion' | 'camion liviano' | 'dobletroque' | 'camioneta' | 'tracto camion';

export interface Vehicle {
  id: string;
  plate: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  line: string;
  color: string;
  pbvRunt: string;
  emptyWeight: string;
  cargoLength: string;
  power: string;
  engineNumber: string;
  chassisNumber: string;
  documents: {
    soat: string | null;
    technicalInspection: string | null;
    rcPolicy: string | null;
    companyContract: string | null;
    propertyCard: string | null;
    photos: string[];
  };
  ownerInfo: string;
  active: boolean;
  createdAt: Date;
}

// Driver types
export type IdentificationType = 'CC' | 'CE' | 'NIT' | 'TI' | 'OTRO';

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

// Dispatch types
export interface Dispatch {
  id: string;
  orderId: string;
  driverId: string;
  vehiclePlate: string;
  loadingCompany: string;
  destination: string;
  zone: string;
  farm: string;
  packages: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'delayed' | 'completed' | 'cancelled';
  acceptedAt: Date | null;
  completedAt: Date | null;
  eta: Date | null;
  receiptImageUrl: string | null;
  createdAt: Date;
}

// File Upload types
export interface UploadedFile {
  id: string;
  name: string;
  uploadedAt: Date;
  uploadedBy: string;
  type: 'dispatch' | 'document';
  status: 'processing' | 'completed' | 'error';
  records?: number;
  previewUrl?: string;
}
