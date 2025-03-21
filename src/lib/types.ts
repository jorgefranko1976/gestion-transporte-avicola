
// Vehicle types
export type VehicleType = 'camion' | 'camion liviano' | 'dobletroque' | 'camioneta' | 'tracto camion';

// Tipos de identificación
export type IdentificationType = 'CC' | 'NIT' | 'CE';

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
    soatExpiration: Date | null;
    technicalInspection: string | null;
    technicalInspectionExpiration: Date | null;
    rcPolicy: string | null;
    rcPolicyExpiration: Date | null;
    companyContract: string | null;
    propertyCard: string | null;
    photos: string[];
  };
  ownerId: string; // Ahora solo guardamos la referencia al propietario
  owner: VehicleOwner; // Para poder acceder a los datos completos
  active: boolean;
  createdAt: Date;
}

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
  farmId?: string; // Agregamos referencia a la granja por ID
  packages: number;
  concentrateAmount?: number; // Cantidad de alimento en toneladas
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

// Tipos para el módulo de Granjas
export type WaterSource = "acueducto" | "carrotanque" | "pozo" | "nacedero" | "rio" | "caño";

export interface Farm {
  id: string;
  name: string;
  department: string;
  zone: string;
  internalId: string;
  waterSource: WaterSource;
  contactPerson: string;
  contactPhone: string;
  chickenCapacity: number;
  concentrateCapacity: number;
  shedsCount: number;
  active: boolean;
  createdAt: Date;
  minConcentrateReserve?: number;
}

// Raza de pollos
export type ChickenBreed = "cobb500" | "ross308" | "hubbard" | "arbor_acres" | "otras";

// Sexo de las aves
export type ChickenSex = "macho" | "hembra" | "mixto";

// Perfil de crecimiento diario con curva de alimentación
export interface GrowthProfile {
  id: string;
  name: string;
  description?: string;
  breed: ChickenBreed;
  sex: ChickenSex;
  dailyConsumption: DailyConsumption[];
  createdAt: Date;
}

export interface DailyConsumption {
  day: number;
  amountPerBird: number; // en gramos de alimento
  waterPerBird?: number; // en mililitros de agua
  expectedWeight?: number; // peso esperado en gramos
}

// Ciclo de producción
export interface ProductionCycle {
  id: string;
  farmId: string;
  startDate: Date;
  estimatedEndDate: Date;
  endDate?: Date | null;
  initialBirdCount: number;
  currentBirdCount: number;
  growthProfileId: string;
  growthProfile?: GrowthProfile;
  breed: ChickenBreed;
  sex: ChickenSex;
  
  // Registro de consumo diario real
  dailyRecords: DailyRecord[];
  
  // Cantidades totales
  totalConcentrateReceived: number; // En toneladas
  totalConcentrateConsumed: number; // En toneladas
  concentrateReserve: number; // En toneladas
  
  // Despachos asociados
  dispatches?: Dispatch[];
  
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

// Registro diario
export interface DailyRecord {
  id: string;
  cycleId: string;
  day: number;
  date: Date;
  birdCount: number;
  mortality: number;
  expectedConsumption: number; // En kg
  actualConsumption: number; // En kg
  expectedWaterConsumption?: number; // En litros
  actualWaterConsumption?: number; // En litros
  birdWeight?: number; // Peso promedio en gramos
  concentrateReceived: number; // En kg
  notes?: string;
}
