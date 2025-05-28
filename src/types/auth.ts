
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
  signUpAsRenter: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signUpAsCompany: (email: string, password: string, companyName: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signInWithGoogle: () => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isRentalCompany: boolean;
  isRenter: boolean;
};
