
import { IdentificationType } from './common-types';

export type UserRole = 'admin' | 'coordinator' | 'driver' | 'owner';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  identificationType: IdentificationType;
  identificationNumber: string;
  phone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  // For vehicle owners
  ownedVehicleIds?: string[];
  // For drivers
  driverId?: string;
}
