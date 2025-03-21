
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
