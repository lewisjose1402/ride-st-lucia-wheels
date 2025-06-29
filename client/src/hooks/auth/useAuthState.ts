
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
        
        // Send welcome email for new renter
        if (role === 'renter') {
          try {
            const response = await fetch('/api/emails/welcome', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                firstName: userMetadata?.first_name || userMetadata?.full_name?.split(' ')[0] || '',
                lastName: userMetadata?.last_name || userMetadata?.full_name?.split(' ').slice(1).join(' ') || ''
              })
            });
            
            if (response.ok) {
              console.log('Welcome email sent successfully');
            } else {
              console.error('Failed to send welcome email:', response.statusText);
            }
          } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
          }
        }
      }
    } catch (error) {
      console.error("Failed to create user profile:", error);
    }
  };

  const createCompanyProfileForUser = async (user: User, userMetadata: any) => {
    try {
      if (userMetadata?.company_name || userMetadata?.is_company) {
        console.log("Creating company profile for user:", user.id);
        
        const { error } = await supabase
          .from('rental_companies')
          .insert({
            user_id: user.id,
            company_name: userMetadata.company_name || 'Company Name Required',
            email: user.email || '',
            phone: userMetadata.phone || '000-000-0000'
          });
        
        if (error && !error.message.includes('duplicate key')) {
          console.error("Error creating company profile:", error);
        } else {
          console.log("Company profile created successfully");
        }
      }
    } catch (error) {
      console.error("Failed to create company profile:", error);
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
      
      let userIsAdmin = false;
      let userIsRentalCompany = false;
      let userIsRenter = false;
      let profileToSet = null;
      
      const userMetadata = user.user_metadata;
      console.log("User metadata:", userMetadata);
      
      // First: Check the profiles table for authoritative role
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
      }

      if (!profileData) {
        console.log("No profile found, creating one for user");
        await createProfileForUser(user);
        
        // Retry fetching the profile
        const { data: retryProfileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (retryProfileData) {
          profileData = retryProfileData;
        }
      }

      if (profileData) {
        console.log("Profile data from profiles table:", profileData);
        userIsAdmin = profileData.role === 'admin';
        userIsRenter = profileData.role === 'renter';
        userIsRentalCompany = profileData.role === 'rental_company';
        
        profileToSet = profileData;
        
        console.log("Roles set from profiles table - isAdmin:", userIsAdmin, "isRentalCompany:", userIsRentalCompany, "isRenter:", userIsRenter);
      }
      
      // Second: If user is a rental company or admin, check/create company data
      if (userIsRentalCompany || userIsAdmin) {
        const { data: companyData, error: companyError } = await supabase
          .from('rental_companies')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (companyError) {
          console.log('No company profile found:', companyError.message);
          // Try to create company profile if user has company metadata
          await createCompanyProfileForUser(user, userMetadata);
          
          // Retry fetching company data
          const { data: retryCompanyData } = await supabase
            .from('rental_companies')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
            
          if (retryCompanyData) {
            console.log("Company profile data loaded after creation:", retryCompanyData);
            profileToSet = {
              ...profileData,
              ...retryCompanyData,
              role: profileData?.role
            };
          }
        } else if (companyData) {
          console.log("Company profile data loaded:", companyData);
          profileToSet = {
            ...profileData,
            ...companyData,
            role: profileData?.role
          };
        }
      }
      
      // Fallback handling
      if (!profileData && (userMetadata?.is_company || userMetadata?.role === 'rental_company')) {
        console.log("No profile but metadata indicates company, setting fallback role");
        profileToSet = {
          id: user.id,
          email: user.email || '',
          role: 'rental_company'
        };
        userIsRentalCompany = true;
        userIsRenter = false;
        userIsAdmin = false;
      }
      
      if (!profileToSet) {
        console.log("Setting final fallback profile");
        profileToSet = {
          id: user.id,
          email: user.email || '',
          role: 'renter'
        };
        userIsRenter = true;
        userIsRentalCompany = false;
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
