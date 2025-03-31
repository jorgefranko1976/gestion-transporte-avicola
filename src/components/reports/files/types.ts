
export interface FileReport {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
  uploadedById?: string | null;
  records: number | null;
  status: string;
  reproCount: number | null;
  engordeCount: number | null;
}

export interface FileReportState {
  files: FileReport[];
  filteredFiles: FileReport[];
  isLoading: boolean;
  error: string | null;
}
