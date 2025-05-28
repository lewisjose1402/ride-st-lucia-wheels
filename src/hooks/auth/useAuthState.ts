
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
  const [isRenter, setIsRenter] = useState(false);

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
          setIsRenter(false);
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
      let userIsRenter = false;
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
        // If profile doesn't exist, create one with renter role (new default)
        console.log("Profile not found, creating renter profile");
        
        // Try to create profile with simplified approach
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            {
              id: userId,
              email: userData?.user?.email || '',
              role: userMetadata?.is_company ? 'rental_company' : 'renter',
              first_name: userMetadata?.first_name || '',
              last_name: userMetadata?.last_name || ''
            }
          ])
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating profile:', createError);
          // If we still can't create a profile, set basic user info
          profileToSet = {
            id: userId,
            email: userData?.user?.email || '',
            role: userMetadata?.is_company ? 'rental_company' : 'renter'
          };
          userIsRenter = !userMetadata?.is_company;
          userIsRentalCompany = !!userMetadata?.is_company;
        } else {
          console.log("Created new profile:", newProfile);
          profileToSet = newProfile;
          userIsAdmin = newProfile.role === 'admin';
          userIsRenter = newProfile.role === 'renter';
          userIsRentalCompany = newProfile.role === 'rental_company';
        }
      } else if (profileData) {
        console.log("Profile data from profiles table:", profileData);
        profileToSet = profileData;
        userIsAdmin = profileData.role === 'admin';
        userIsRenter = profileData.role === 'renter';
        userIsRentalCompany = profileData.role === 'rental_company';
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
        
        console.log("Company logo URL from fetch:", companyData.logo_url);
      }
      
      // Set all states at once to avoid race conditions
      setProfile(profileToSet);
      setIsAdmin(userIsAdmin);
      setIsRentalCompany(userIsRentalCompany);
      setIsRenter(userIsRenter);
      
      console.log("Final auth state - isAdmin:", userIsAdmin, "isRentalCompany:", userIsRentalCompany, "isRenter:", userIsRenter);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      // Set basic fallback state
      setProfile({
        id: userId,
        role: 'renter'
      });
      setIsRenter(true);
      setIsRentalCompany(false);
      setIsAdmin(false);
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
    isRenter,
  };
}
