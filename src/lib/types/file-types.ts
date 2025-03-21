
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

export interface ExcelSheet {
  name: string;
  data: any[];
}

// Two different data structures for the spreadsheet types
export interface ReproductoraDespatch {
  ubicacion: string;
  granja: string;
  lote: string;
  planta: string;
  tipoAlimento: string;
  medicacion: string;
  dia: string;
  cantidad: number;
  ton: number;
  orden: string;
  conductor: string;
  placa: string;
  cedula: string;
  remisionPlanta: string;
  observaciones?: string;
}

export interface EngordeDespatch {
  granja: string;
  dia: string;
  planta: string;
  nomAlimento: string;
  cantidad: number;
  toneladas: number;
  confirmar?: string;
  ubicacion: string;
  tecnico: string;
  orden: string;
  conductor: string;
  placa: string;
  cedula: string;
  remision: string;
}

export interface ExcelPreviewData {
  reproductora: ReproductoraDespatch[];
  engorde: EngordeDespatch[];
  totalRecords: number;
}
