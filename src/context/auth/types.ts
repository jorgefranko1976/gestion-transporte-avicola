
import { UserRole } from '@/lib/types';
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

export type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (userData: {
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: UserRole, 
    identificationType: string, 
    identificationNumber: string,
    phone?: string
  }) => Promise<{success: boolean, error?: string}>;
};
