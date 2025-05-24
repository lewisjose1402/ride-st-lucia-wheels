
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isRentalCompany, setIsRentalCompany] = useState(false);

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

  return {
    session,
    user,
    profile,
    isLoading,
    isAdmin,
    isRentalCompany,
  };
}
