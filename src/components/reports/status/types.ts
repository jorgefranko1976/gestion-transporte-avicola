
export interface Dispatch {
  id: string;
  orderId: string;
  vehiclePlate: string;
  driverName: string | null;
  destination: string;
  acceptedAt: Date | null;
  eta: Date | null;
  status: string;
  hoursRemaining: number | null;
  isDelayed: boolean;
}

export type StatusFilterType = 'all' | 'in_progress' | 'delayed' | 'cancelled';
