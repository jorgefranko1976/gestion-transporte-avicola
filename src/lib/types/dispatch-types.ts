
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
  farmId: string; // Cambiamos a no opcional para asegurar que siempre tenga un valor
  packages: number;
  concentrateAmount: number | null; // Cantidad de alimento en toneladas
  status: 'pending' | 'accepted' | 'in_progress' | 'delayed' | 'completed' | 'cancelled';
  acceptedAt: Date | null;
  completedAt: Date | null;
  eta: Date | null;
  receiptImageUrl: string | null;
  createdAt: Date;
}

// Tipo para solicitud de creación de despacho
export interface CreateDispatchRequest {
  orderId: string;
  loadingCompany: string;
  destination: string;
  zone?: string;
  farm: string;
  farmId: string;
  packages: number;
  concentrateAmount?: number;
  eta?: Date | null;
}

// Tipo para respuesta cuando se asigna un conductor
export interface DriverAssignmentResponse {
  success: boolean;
  message: string;
  dispatchId?: string;
}
