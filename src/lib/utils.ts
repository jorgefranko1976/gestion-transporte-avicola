import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { VehicleOwner } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFullName(owner: Partial<VehicleOwner>): string {
  if (owner.name) {
    return owner.name;
  } else if (owner.firstName || owner.lastName) {
    return `${owner.firstName || ''} ${owner.lastName || ''}`.trim();
  } else {
    return `${owner.identificationType || ''} ${owner.identificationNumber || ''}`.trim();
  }
}

/**
 * Calcula el consumo esperado de alimento para un día específico basado en la curva de alimentación
 * @param day Día del ciclo
 * @param curveFeed Curva de alimentación (dailyConsumption array)
 * @param birdCount Cantidad de aves
 * @returns Consumo esperado en kilogramos
 */
export const calculateExpectedConsumption = (
  day: number, 
  curveFeed: DailyConsumption[], 
  birdCount: number
): number => {
  // Buscar el consumo para el día específico
  const dayConsumption = curveFeed.find(item => item.day === day);
  
  if (dayConsumption) {
    // Convertir de gramos a kilogramos y multiplicar por la cantidad de aves
    return (dayConsumption.amountPerBird / 1000) * birdCount;
  }
  
  // Si no se encuentra el día exacto, interpolar entre los días más cercanos
  const lowerDay = curveFeed
    .filter(item => item.day < day)
    .sort((a, b) => b.day - a.day)[0];
    
  const upperDay = curveFeed
    .filter(item => item.day > day)
    .sort((a, b) => a.day - b.day)[0];
  
  if (lowerDay && upperDay) {
    // Interpolación lineal
    const ratio = (day - lowerDay.day) / (upperDay.day - lowerDay.day);
    const interpolatedAmount = 
      lowerDay.amountPerBird + ratio * (upperDay.amountPerBird - lowerDay.amountPerBird);
    
    // Convertir de gramos a kilogramos y multiplicar por la cantidad de aves
    return (interpolatedAmount / 1000) * birdCount;
  } else if (lowerDay) {
    // Si solo hay un día menor, usar ese valor
    return (lowerDay.amountPerBird / 1000) * birdCount;
  } else if (upperDay) {
    // Si solo hay un día mayor, usar ese valor
    return (upperDay.amountPerBird / 1000) * birdCount;
  }
  
  // Si no hay datos, devolver 0
  return 0;
};

/**
 * Calcula el consumo total esperado para un ciclo de producción
 * @param cycle Ciclo de producción
 * @param curveFeed Curva de alimentación (dailyConsumption array)
 * @returns Consumo total esperado en kilogramos
 */
export const calculateTotalExpectedConsumption = (
  cycle: ProductionCycle,
  curveFeed: DailyConsumption[]
): number => {
  const startDate = new Date(cycle.startDate);
  const endDate = cycle.endDate || cycle.estimatedEndDate;
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let totalConsumption = 0;
  
  for (let i = 1; i <= daysDiff; i++) {
    // Para cada día, calculamos el consumo esperado basado en la curva
    // Usamos la cantidad de aves del día anterior para ser más precisos
    // Esto es una simplificación, en un sistema real, se debería tener en cuenta la mortalidad diaria
    const currentBirdCount = i === 1 ? cycle.initialBirdCount : cycle.currentBirdCount;
    totalConsumption += calculateExpectedConsumption(i, curveFeed, currentBirdCount);
  }
  
  return totalConsumption;
};
