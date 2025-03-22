
// Re-export all types from their respective files
export * from './vehicle-types';
export * from './driver-types';
export * from './dispatch-types';
export * from './file-types';
export * from './farm-types';
export * from './chicken-types';
export * from './production-types';
export * from './common-types';
export * from './owner-types';
// Explicitly re-export UserRole to resolve ambiguity
export type { UserRole } from './user-types';

// Add UserProfile type definition needed by user-management components
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  identificationType: string;
  identificationNumber: string;
  phone: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  driverId?: string;
  ownedVehicleIds?: string[];
}
