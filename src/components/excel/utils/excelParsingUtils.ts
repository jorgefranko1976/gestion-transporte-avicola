
import { ReproductoraDespatch, EngordeDespatch, ExcelPreviewData } from '@/lib/types';

/**
 * Generates more comprehensive preview data for an Excel file
 * This would be replaced with actual Excel parsing in a real application
 */
export const generatePreviewData = (file: File): ExcelPreviewData => {
  // Sample data based on the uploaded images - REPRODUCTORA sheet
  const reproData: ReproductoraDespatch[] = [
    // Original samples
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
      cedula: '1,056,580,224',
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
    // Additional entries from the image
    {
      ubicacion: 'GARAGOA',
      granja: 'SAN MIGUEL',
      lote: 'E17',
      planta: 'ALBATEQ-ALBATEQ',
      tipoAlimento: 'FASE 3 ROSS',
      medicacion: 'FINBIOX-HEPATOSTAR-OVOCLEAN',
      dia: 'MIERCOLES 26',
      cantidad: 350,
      ton: 14,
      orden: '224234',
      conductor: 'MARTIN CHAVEZ',
      placa: 'WPK 570',
      cedula: '73335175',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '',
    },
    {
      ubicacion: 'GARAGOA',
      granja: 'ZONA CENTRAL BAJA',
      lote: 'E18',
      planta: 'ITALCOL-FUNZA',
      tipoAlimento: 'FASE 2 COBB',
      medicacion: 'P/CROMICINA-FINBIOX-HEPATOSTAR-OVOCLEAN',
      dia: 'MIERCOLES 26',
      cantidad: 350,
      ton: 14,
      orden: '1114222',
      conductor: 'HENRY ESGUERRA',
      placa: 'XXB191',
      cedula: '74,335,566',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '7:00 p. m.',
    },
    {
      ubicacion: 'GARAGOA',
      granja: 'ZONA CENTRAL BAJA',
      lote: 'E18',
      planta: 'ITALCOL-FUNZA',
      tipoAlimento: 'MACHOS COBB',
      medicacion: 'SIN MEDICAR',
      dia: 'MIERCOLES 26',
      cantidad: 25,
      ton: 1,
      orden: '1114222',
      conductor: 'HENRY ESGUERRA',
      placa: 'XXB191',
      cedula: '74,335,566',
      remisionPlanta: 'MIERCOLES 25',
      observaciones: '',
    },
  ];
  
  // Sample data based on the image - ENGORDE sheet
  const engordeData: EngordeDespatch[] = [
    // Original samples
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
    // Additional entries from the image
    {
      granja: 'GUADUAS',
      dia: 'MARTES 25',
      planta: 'ITALCOL-FUNZA',
      nomAlimento: 'FASE 1 ROSS',
      cantidad: 137,
      toneladas: 5.48,
      confirmar: '',
      ubicacion: 'PORVENIR (UVE)',
      tecnico: 'TECNICO1',
      orden: '1114252',
      conductor: 'JAROL DURAN',
      placa: 'GIT 950',
      cedula: '1073511288',
      remision: 'MIERCOLES 25',
    },
    {
      granja: 'LA MESA',
      dia: 'MARTES 25',
      planta: 'ITALCOL-FUNZA',
      nomAlimento: 'FASE 2 ROSS',
      cantidad: 100,
      toneladas: 4,
      confirmar: '',
      ubicacion: 'LA MARIA 1',
      tecnico: 'TECNICO2',
      orden: '1114273',
      conductor: 'GERMAN CALDERON',
      placa: 'NOX 203',
      cedula: '79063368',
      remision: 'MIERCOLES 25',
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
