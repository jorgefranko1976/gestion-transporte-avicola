
import { ExcelPreviewData, ReproductoraDespatch, EngordeDespatch } from '@/lib/types';

export interface ExcelState {
  showUploadModal: boolean;
  selectedFile: File | null;
  isUploading: boolean;
  previewData: ExcelPreviewData;
  excelData: any[];
  lastUpdateDate: string;
  setShowUploadModal: (show: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  setPreviewData: (data: ExcelPreviewData) => void;
  setExcelData: (data: any[]) => void;
  setLastUpdateDate: (date: string) => void;
}

export interface ExcelStateSetters {
  setShowUploadModal: (show: boolean) => void;
  setSelectedFile: (file: File | null) => void;
  setIsUploading: (isUploading: boolean) => void;
  setPreviewData: (data: ExcelPreviewData) => void;
  setExcelData: (data: any[]) => void;
  setLastUpdateDate: (date: string) => void;
}

export interface ExcelAction {
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (selectedFile: File | null, previewData: ExcelPreviewData) => void;
  handleRemoveFile: () => void;
}

export type ExcelHook = {
  showUploadModal: boolean;
  setShowUploadModal: (show: boolean) => void;
  selectedFile: File | null;
  isUploading: boolean;
  previewData: ExcelPreviewData;
  excelData: any[];
  lastUpdateDate: string;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  handleRemoveFile: () => void;
};
