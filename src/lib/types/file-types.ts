
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

export interface ExcelPreviewData {
  reproductora: any[];
  engorde: any[];
  totalRecords: number;
}
