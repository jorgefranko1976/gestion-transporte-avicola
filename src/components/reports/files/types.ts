
export interface FileReport {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  records: number | null;
  status: string;
  reproCount: number | null;
  engordeCount: number | null;
}
