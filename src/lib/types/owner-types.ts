
import { IdentificationType } from './common-types';

export interface VehicleOwner {
  id: string;
  name: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  isCompany: boolean;
  firstName?: string; // Añadido para compatibilidad
  lastName?: string; // Añadido para compatibilidad
}
