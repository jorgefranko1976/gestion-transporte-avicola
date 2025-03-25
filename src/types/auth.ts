
// Define los tipos de usuario y autenticación

export type UserRole = 'admin' | 'coordinator' | 'driver' | 'owner';

export type User = {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    identification_type?: string;
    identification_number?: string;
  };
};

export type AuthContextType = {
  user: User | null;
  session: import('@supabase/supabase-js').Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, userData: {
    first_name: string;
    last_name: string;
    role?: UserRole;
    identification_type?: string;
    identification_number?: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};
