
import { ExcelPreviewData } from "@/lib/types";

/**
 * Transforms preview data into application data for storage
 */
export const transformToApplicationData = (previewData: ExcelPreviewData): any[] => {
  return [
    ...transformReproductoraData(previewData.reproductora),
    ...transformEngordeData(previewData.engorde)
  ];
};

/**
 * Transforms reproductora data to application format
 */
const transformReproductoraData = (reproductora: any[]): any[] => {
  return reproductora.map(item => ({
    ...item,
    tipo: 'reproductora', // Add a type field to distinguish the data source
    fecha: item.dia,
    destino: item.planta,
    estado: 'pendiente'
  }));
};

/**
 * Transforms engorde data to application format
 */
const transformEngordeData = (engorde: any[]): any[] => {
  return engorde.map(item => ({
    ...item, 
    tipo: 'engorde', // Add a type field to distinguish the data source
    fecha: item.dia,
    destino: item.planta,
    estado: 'pendiente'
  }));
};
