
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isRentalCompany: boolean;
};
