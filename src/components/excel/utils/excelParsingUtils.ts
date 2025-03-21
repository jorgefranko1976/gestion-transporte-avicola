
import { ReproductoraDespatch, EngordeDespatch, ExcelPreviewData } from '@/lib/types';

/**
 * Generates sample preview data for an Excel file
 * This would be replaced with actual Excel parsing in a real application
 */
export const generatePreviewData = (file: File): ExcelPreviewData => {
  // Sample data based on the first image (Reproductora sheet)
  const reproData: ReproductoraDespatch[] = [
    {
      ubicacion: 'GARAGOA',
      granja: 'BARSAL 1',
      lote: 'E30',
      planta: 'ALBATEQ-ALBATEQ',
      tipoAlimento: 'FASE 2 COBB',
      medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
      dia: 'MARTES 25',
      cantidad: 275,
      ton: 11,
      orden: '224230',
      conductor: 'ANDRES SABOGAL',
      placa: 'WHK 426',
      cedula: '1,056,580,372',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '',
    },
    {
      ubicacion: 'GARAGOA',
      granja: 'SAN ESTEBAN 2',
      lote: 'E52',
      planta: 'ALBATEQ-ALBATEQ',
      tipoAlimento: 'LEVANTE',
      medicacion: 'SIN MEDICAR',
      dia: 'MIERCOLES 26',
      cantidad: 375,
      ton: 15,
      orden: '224231',
      conductor: 'FERNANDO VANEGAS',
      placa: 'SRD 194',
      cedula: '1048847155',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '',
    },
    {
      ubicacion: 'GUADUAS',
      granja: 'PORVENIR (UVE)',
      lote: 'E48',
      planta: 'ITALCOL-FUNZA',
      tipoAlimento: 'FASE 1 ROSS',
      medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
      dia: 'MARTES 25',
      cantidad: 137,
      ton: 5.48,
      orden: '1114252',
      conductor: 'JAROL DURAN',
      placa: 'GIT 950',
      cedula: '1073511288',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '6:00 p. m.',
    },
  ];
  
  // Sample data based on the second image (Engorde sheet)
  const engordeData: EngordeDespatch[] = [
    {
      granja: 'NARANJAL (NARANJ)',
      dia: 'MARTES 25',
      planta: 'ALBATEQ-ALBATEQ',
      nomAlimento: 'ENGORDE CORRIENTE',
      cantidad: 200,
      toneladas: 8,
      confirmar: '',
      ubicacion: 'SAN FRANCISCO',
      tecnico: 'CARLOS CASTIBLANCO',
      orden: '224248',
      conductor: 'OSWALDO RODRIGUEZ',
      placa: 'WNX 547',
      cedula: '79137559',
      remision: 'MIERCOLES 26',
    },
    {
      granja: 'MIREYAS',
      dia: 'MARTES 25',
      planta: 'ALBATEQ-ALBATEQ',
      nomAlimento: 'ENGORDE CORRIENTE',
      cantidad: 125,
      toneladas: 5,
      confirmar: '',
      ubicacion: 'LA MESA',
      tecnico: 'CARLOS CENEN',
      orden: '224249',
      conductor: 'HUGO VEGA',
      placa: 'WPT 526',
      cedula: '80311610',
      remision: 'MIERCOLES 26',
    },
    {
      granja: 'VILLA LORENA',
      dia: 'MIERCOLES 26',
      planta: 'ALBATEQ-ALBATEQ',
      nomAlimento: 'ENGORDE PIGMENTADO',
      cantidad: 150,
      toneladas: 6,
      confirmar: '',
      ubicacion: 'FUSAGASUGA',
      tecnico: 'SONIA',
      orden: '224226',
      conductor: 'NELSON GARAVITO',
      placa: 'USB 969',
      cedula: '1003558901',
      remision: 'MIERCOLES 26',
    },
  ];
  
  return {
    reproductora: reproData,
    engorde: engordeData,
    totalRecords: reproData.length + engordeData.length
  };
};

/**
 * Transforms preview data into application data for storage
 */
export const transformToApplicationData = (previewData: ExcelPreviewData): any[] => {
  // Combine data from both sheets but maintain their distinct formats
  return [
    ...previewData.reproductora.map(item => ({
      ...item,
      tipo: 'reproductora', // Add a type field to distinguish the data source
      fecha: item.dia,
      destino: item.planta,
      estado: 'pendiente'
    })),
    ...previewData.engorde.map(item => ({
      ...item, 
      tipo: 'engorde', // Add a type field to distinguish the data source
      fecha: item.dia,
      destino: item.planta,
      estado: 'pendiente'
    }))
  ];
};
