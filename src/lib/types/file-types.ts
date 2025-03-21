
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
