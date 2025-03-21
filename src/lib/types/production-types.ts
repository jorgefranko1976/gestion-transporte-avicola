
import { ChickenBreed, ChickenSex } from './chicken-types';
import { Dispatch } from './dispatch-types';

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
