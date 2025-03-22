import { ChickenBreedType, ChickenSex } from './chicken-types';
import { Dispatch } from './dispatch-types';
import { ConfigurationItem } from './common-types';

// Perfil de crecimiento diario con curva de alimentación
export interface GrowthProfile extends ConfigurationItem {
  breed: ChickenBreedType;
  sex: ChickenSex;
  dailyConsumption: DailyConsumption[];
  isDefault?: boolean;
}

export interface DailyConsumption {
  day: number;
  amountPerBird: number; // en gramos de alimento
  waterPerBird: number; // en mililitros de agua
  expectedWeight: number; // peso esperado en gramos
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
  breed: ChickenBreedType;
  sex: ChickenSex;
  
  // Registro de consumo diario real
  dailyRecords: DailyRecord[];
  
  // Cantidades totales
  totalConcentrateReceived: number; // En toneladas
  totalConcentrateConsumed: number; // En toneladas
  concentrateReserve: number; // En toneladas
  
  // Despachos asociados
  dispatches?: Dispatch[];
  
  // Registros de entrada de aves
  birdEntries?: BirdEntry[];
  
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

// Ingreso de aves a galpón
export interface BirdEntry {
  id: string;
  cycleId: string;
  farmId: string;
  entryDate: Date;
  quantity: number;
  shedNumber: number; // Número del galpón
  breed: ChickenBreedType;
  notes?: string;
  createdAt: Date;
  createdBy: string;
}
