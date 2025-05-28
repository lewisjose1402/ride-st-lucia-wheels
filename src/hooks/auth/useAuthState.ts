
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

  const createProfileForUser = async (user: User) => {
    try {
      console.log("Creating profile for user:", user.id);
      
      // Determine role based on user metadata with proper typing
      const userMetadata = user.user_metadata;
      let role: 'renter' | 'rental_company' | 'guest' | 'admin' = 'renter';
      
      if (userMetadata?.role === 'rental_company' || userMetadata?.is_company) {
        role = 'rental_company';
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || '',
          first_name: userMetadata?.first_name || userMetadata?.full_name?.split(' ')[0] || '',
          last_name: userMetadata?.last_name || userMetadata?.full_name?.split(' ').slice(1).join(' ') || '',
          role: role
        });
      
      if (error) {
        console.error("Error creating user profile:", error);
      } else {
        console.log("User profile created successfully");
      }
    } catch (error) {
      console.error("Failed to create user profile:", error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user);
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
          fetchProfile(session.user);
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

  const fetchProfile = async (user: User) => {
    try {
      console.log("Fetching profile for user:", user.id);
      setIsLoading(true);
      
      // Initialize role states
      let userIsAdmin = false;
      let userIsRentalCompany = false;
      let userIsRenter = false;
      let profileToSet = null;
      
      // Check for company flag in metadata
      const userMetadata = user.user_metadata;
      console.log("User metadata:", userMetadata);
      
      // First, check if user has a company profile in rental_companies table
      const { data: companyData, error: companyError } = await supabase
        .from('rental_companies')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (companyError) {
        console.log('No company profile found:', companyError.message);
      } else if (companyData) {
        console.log("Company profile data loaded:", companyData);
        // If we found company data, this user is definitely a rental company
        profileToSet = companyData;
        userIsRentalCompany = true;
        userIsRenter = false;
        userIsAdmin = false;
        
        console.log("User identified as rental company from company profile");
      } else {
        // No company profile found, check profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        if (!profileData) {
          console.log("No profile found, creating one for user");
          // Create profile if it doesn't exist
          await createProfileForUser(user);
          
          // Retry fetching the profile
          const { data: retryProfileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (retryProfileData) {
            profileToSet = retryProfileData;
            userIsAdmin = retryProfileData.role === 'admin';
            userIsRenter = retryProfileData.role === 'renter';
            userIsRentalCompany = retryProfileData.role === 'rental_company';
          } else {
            // Fallback if profile creation failed
            const fallbackRole = userMetadata?.is_company || userMetadata?.role === 'rental_company' ? 'rental_company' : 'renter';
            profileToSet = {
              id: user.id,
              email: user.email || '',
              role: fallbackRole
            };
            userIsRenter = fallbackRole === 'renter';
            userIsRentalCompany = fallbackRole === 'rental_company';
            userIsAdmin = false;
          }
        } else {
          console.log("Profile data from profiles table:", profileData);
          profileToSet = profileData;
          userIsAdmin = profileData.role === 'admin';
          userIsRenter = profileData.role === 'renter';
          userIsRentalCompany = profileData.role === 'rental_company';
        }
      }
      
      // Final check: if user metadata indicates company but we haven't detected it yet
      if (!userIsRentalCompany && (userMetadata?.is_company || userMetadata?.role === 'rental_company')) {
        console.log("User metadata indicates company role, setting as rental company");
        userIsRentalCompany = true;
        userIsRenter = false;
        userIsAdmin = false;
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
      const fallbackRole = user.user_metadata?.is_company || user.user_metadata?.role === 'rental_company' ? 'rental_company' : 'renter';
      setProfile({
        id: user.id,
        role: fallbackRole
      });
      setIsRenter(fallbackRole === 'renter');
      setIsRentalCompany(fallbackRole === 'rental_company');
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
