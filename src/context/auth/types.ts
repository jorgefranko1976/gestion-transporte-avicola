
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/lib/types';

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    role: UserRole;
    identification_type: string;
    identification_number: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
};
