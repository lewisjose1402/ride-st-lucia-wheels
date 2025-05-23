
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

export function useAuthProvider() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRentalCompany, setIsRentalCompany] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsRentalCompany(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First check if user has company role from metadata
      const { data: userData } = await supabase.auth.getUser();
      const userMetadata = userData?.user?.user_metadata;
      
      console.log("User metadata:", userMetadata);
      
      // Check for company flag in metadata
      if (userMetadata && userMetadata.is_company) {
        console.log("User is a company from metadata");
        setIsRentalCompany(true);
      }
      
      // Also check company profile directly from rental_companies table
      const { data: companyData, error: companyError } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (companyError) {
        console.error('Error fetching company profile:', companyError);
      } else if (companyData) {
        console.log("Company profile data loaded:", companyData);
        setProfile(companyData);
        setIsRentalCompany(true);
        
        // Debug log to verify logo URL is being loaded correctly
        console.log("Company logo URL from fetch:", companyData.logo_url);
      } else {
        // Fallback to checking profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        } else if (profileData) {
          console.log("Profile data:", profileData);
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
          setIsRentalCompany(profileData.role === 'rental_company' || isRentalCompany);
        }
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata: Record<string, any> = {}) => {
    try {
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
            email: email
          };
          
          const { error: profileError } = await supabase
            .from('rental_companies')
            .insert([companyData]);
            
          if (profileError) {
            console.error("Error creating company profile:", profileError);
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
    session,
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isRentalCompany,
  };
}
