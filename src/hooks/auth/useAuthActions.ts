import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useAuthActions() {
  const { toast } = useToast();

  const signUpAsRenter = async (email: string, password: string, firstName: string = '', lastName: string = '') => {
    try {
      console.log("Attempting renter sign-up:", { email, firstName, lastName });
      
      const metadata = {
        role: 'renter',
        first_name: firstName,
        last_name: lastName,
        is_company: false
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error("Supabase auth sign-up error:", error);
        
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please use a different email or try signing in.",
            variant: "destructive"
          });
          return { success: false, error: "Email already registered" };
        }
        
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      console.log("Renter sign-up successful:", data);
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account before signing in.",
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected error during renter sign-up:", error);
      const errorMessage = (error as Error).message;
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const signUpAsCompany = async (email: string, password: string, companyName: string) => {
    try {
      console.log("Attempting company sign-up:", { email, companyName });
      
      // Check if email already exists in rental_companies table
      const { data: existingCompany, error: checkError } = await supabase
        .from('rental_companies')
        .select('email')
        .eq('email', email)
        .single();
      
      if (existingCompany) {
        toast({
          title: "Email already registered",
          description: "This email is already in use by another company account.",
          variant: "destructive"
        });
        return { success: false, error: "Email already registered" };
      }
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing company:", checkError);
      }

      const metadata = {
        company_name: companyName,
        is_company: true,
        role: 'rental_company'
      };
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        console.error("Supabase auth sign-up error:", error);
        
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          toast({
            title: "Email already registered",
            description: "This email is already in use. Please use a different email or try signing in.",
            variant: "destructive"
          });
          return { success: false, error: "Email already registered" };
        }
        
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      console.log("Company sign-up successful:", data);
      
      // Create company profile after successful auth signup
      if (data?.user) {
        try {
          const companyData = {
            user_id: data.user.id,
            company_name: companyName,
            email: email,
            phone: '000-000-0000'
          };
          
          const { error: profileError } = await supabase
            .from('rental_companies')
            .insert(companyData);
            
          if (profileError) {
            console.error("Error creating company profile:", profileError);
          }
        } catch (profileError) {
          console.error("Company profile creation failed but auth succeeded:", profileError);
          // Don't fail the entire signup if profile creation fails
        }
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account before signing in.",
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected error during company sign-up:", error);
      const errorMessage = (error as Error).message;
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  // Default signUp method now defaults to renter
  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    // If no specific role is provided, default to renter
    if (!metadata.role) {
      return signUpAsRenter(email, password, metadata.first_name, metadata.last_name);
    }
    
    // If it's a company signup, use the company method
    if (metadata.role === 'rental_company') {
      return signUpAsCompany(email, password, metadata.company_name);
    }
    
    // Otherwise use renter signup
    return signUpAsRenter(email, password, metadata.first_name, metadata.last_name);
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign-in:", { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign-in error:", error);
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      console.log("Sign-in successful:", data);
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      const errorMessage = (error as Error).message;
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("Attempting Google sign-in");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error("Google sign-in error:", error);
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      console.log("Google sign-in initiated:", data);
      return { success: true, error: null };
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      const errorMessage = (error as Error).message;
      toast({
        title: "Google sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    console.log("Signing out user");
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have successfully signed out."
    });
  };

  return {
    signUp,
    signUpAsRenter,
    signUpAsCompany,
    signIn,
    signInWithGoogle,
    signOut,
  };
}
