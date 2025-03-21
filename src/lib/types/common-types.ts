
// Tipos de identificación
export type IdentificationType = 'CC' | 'NIT' | 'CE';

// User roles
export type UserRole = 'admin' | 'coordinator' | 'driver' | 'owner';

// Tipo de configuración para el módulo
export type ConfigurationModule = 'growth-profiles' | 'breeds' | 'farms' | 'vehicles' | 'users';

// Estructura base para cualquier entidad de configuración
export interface ConfigurationItem {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
