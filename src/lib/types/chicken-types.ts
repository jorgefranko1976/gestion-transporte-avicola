
import { ConfigurationItem } from './common-types';

// Raza de pollos (valores predefinidos)
export type ChickenBreedType = "cobb500" | "ross308" | "hubbard" | "arbor_acres" | "otras";

// Sexo de las aves
export type ChickenSex = "macho" | "hembra" | "mixto";

// Modelo para configuración de razas de pollo
export interface ChickenBreed extends ConfigurationItem {
  type: ChickenBreedType;
  properties?: {
    averageWeight?: number; // Peso promedio adulto en gramos
    growthRate?: number; // Tasa de crecimiento (1-10)
    feedEfficiency?: number; // Eficiencia en conversión de alimento
  };
}
