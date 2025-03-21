
// Dispatch types
export interface Dispatch {
  id: string;
  orderId: string;
  driverId: string;
  vehiclePlate: string;
  loadingCompany: string;
  destination: string;
  zone: string;
  farm: string;
  farmId?: string; // Agregamos referencia a la granja por ID
  packages: number;
  concentrateAmount?: number; // Cantidad de alimento en toneladas
  status: 'pending' | 'accepted' | 'in_progress' | 'delayed' | 'completed' | 'cancelled';
  acceptedAt: Date | null;
  completedAt: Date | null;
  eta: Date | null;
  receiptImageUrl: string | null;
  createdAt: Date;
}
