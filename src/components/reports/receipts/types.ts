
export interface ReceiptReport {
  id: string;
  orderId: string;
  completedAt: Date;
  vehiclePlate: string;
  driverName: string | null;
  destination: string;
  receiptImageUrl: string | null;
}

export interface VehicleData {
  plate: string;
}

export interface DriverData {
  id: string;
  name: string;
}
