
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
      console.log("Initial session:", session);
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
        console.log("Auth state changed:", _event, session);
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
      console.log("Fetching profile for user:", userId);
      setIsLoading(true);
      
      // Initialize role states
      let userIsAdmin = false;
      let userIsRentalCompany = false;
      let profileToSet = null;
      
      // First check if user has company role from metadata
      const { data: userData } = await supabase.auth.getUser();
      const userMetadata = userData?.user?.user_metadata;
      
      console.log("User metadata:", userMetadata);
      
      // Check for company flag in metadata
      if (userMetadata && userMetadata.is_company) {
        console.log("User is a company from metadata");
        userIsRentalCompany = true;
      }
      
      // Check profiles table for role with improved error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If profile doesn't exist, create one with guest role
        console.log("Profile not found, creating guest profile");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: userData?.user?.email || '',
              role: 'guest'
            }
          ])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          console.log("Created new profile:", newProfile);
          profileToSet = newProfile;
          userIsAdmin = newProfile.role === 'admin';
        }
      } else if (profileData) {
        console.log("Profile data from profiles table:", profileData);
        profileToSet = profileData;
        userIsAdmin = profileData.role === 'admin';
        // If user has rental_company role in profiles, they are also a rental company
        if (profileData.role === 'rental_company') {
          userIsRentalCompany = true;
        }
      }
      
      // Also check company profile directly from rental_companies table
      const { data: companyData, error: companyError } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (companyError) {
        console.log('No company profile found:', companyError.message);
      } else if (companyData) {
        console.log("Company profile data loaded:", companyData);
        // If we found company data, use it as the profile and mark as rental company
        profileToSet = companyData;
        userIsRentalCompany = true;
        
        // Debug log to verify logo URL is being loaded correctly
        console.log("Company logo URL from fetch:", companyData.logo_url);
      }
      
      // Set all states at once to avoid race conditions
      setProfile(profileToSet);
      setIsAdmin(userIsAdmin);
      setIsRentalCompany(userIsRentalCompany);
      
      console.log("Final auth state - isAdmin:", userIsAdmin, "isRentalCompany:", userIsRentalCompany);
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
