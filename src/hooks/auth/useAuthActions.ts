
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export function useAuthActions() {
  const { toast } = useToast();

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    try {
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
        // If there's an error other than "no rows returned", handle it
        console.error("Error checking existing company:", checkError);
      }

      // Always set company flag for all signups
      if (!metadata.is_company) {
        metadata.is_company = true;
      }
      
      // Always set rental_company role for all signups
      if (!metadata.role) {
        metadata.role = 'rental_company';
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        // Handle specific Supabase Auth errors for duplicate emails
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
      
      // Create a rental company profile with the initial data
      if (data?.user) {
        try {
          const companyData = {
            user_id: data.user.id,
            company_name: metadata.company_name || '',
            email: email,
            phone: '000-000-0000' // Adding default phone as it's required
          };
          
          const { error: profileError } = await supabase
            .from('rental_companies')
            .insert(companyData);
            
          if (profileError) {
            console.error("Error creating company profile:", profileError);
            // If company profile creation fails, we should still consider the signup successful
            // since the user was created in Supabase Auth
          }
        } catch (profileError) {
          console.error("Error creating initial company profile:", profileError);
        }
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account before signing in.",
      });
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have successfully signed out."
    });
  };

  return {
    signUp,
    signIn,
    signOut,
  };
}
