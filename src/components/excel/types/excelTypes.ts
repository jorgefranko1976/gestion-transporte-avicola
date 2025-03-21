
import { ExcelPreviewData, ReproductoraDespatch, EngordeDespatch } from '@/lib/types';

export interface ExcelState {
  showUploadModal: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  previewData: ExcelPreviewData;
  excelData: any[];
  lastUpdateDate: string;
}

export interface ExcelAction {
  setShowUploadModal: (show: boolean) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  handleRemoveFile: () => void;
}

export type ExcelHook = ExcelState & ExcelAction;
