
import { IdentificationType } from './common-types';
import { VehicleOwner } from './owner-types';

// Vehicle types
export type VehicleType = 'camion' | 'camion liviano' | 'dobletroque' | 'camioneta' | 'tracto camion';

export interface Vehicle {
  id: string;
  plate: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  line: string;
  color: string;
  pbvRunt: string;
  emptyWeight: string;
  cargoLength: string;
  power: string;
  engineNumber: string;
  chassisNumber: string;
  documents: {
    soat: string | null;
    soatExpiration: Date | null;
    technicalInspection: string | null;
    technicalInspectionExpiration: Date | null;
    rcPolicy: string | null;
    rcPolicyExpiration: Date | null;
    companyContract: string | null;
    propertyCard: string | null;
    photos: string[];
  };
  ownerId: string; // Ahora solo guardamos la referencia al propietario
  owner: VehicleOwner; // Para poder acceder a los datos completos
  active: boolean;
  createdAt: Date;
}
