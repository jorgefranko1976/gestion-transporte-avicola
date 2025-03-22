
export interface Inspection {
  id: string;
  vehiclePlate: string;
  driverName: string;
  date: Date;
  tiresOk: boolean;
  lightsOk: boolean;
  brakesOk: boolean;
  mirrorsOk: boolean;
  oilOk: boolean;
  waterOk: boolean;
  kitOk: boolean;
  observations: string | null;
  tirePhotoUrl: string | null;
  kitPhotoUrl: string | null;
}

export type DateFilterType = 'all' | 'today' | 'week' | 'month';
