
export interface VehicleReport {
  id: string;
  plate: string;
  type: string;
  brand: string;
  model: string;
  line: string;
  active: boolean;
  ownerName: string | null;
  soatExpiration: Date | null;
  techExpiration: Date | null;
  status: string;
}
