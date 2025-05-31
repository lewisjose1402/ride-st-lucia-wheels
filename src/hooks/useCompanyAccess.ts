
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyAccess() {
  const { user, isRentalCompany } = useAuth();
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCompanyProfile = async () => {
      if (!user) {
        setHasCompanyProfile(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data: companyData, error } = await supabase
          .from('rental_companies')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!error && companyData) {
          setHasCompanyProfile(true);
        } else {
          setHasCompanyProfile(false);
        }
      } catch (error) {
        console.error('Error checking company profile:', error);
        setHasCompanyProfile(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkCompanyProfile();
  }, [user]);

  return {
    hasCompanyProfile,
    isLoading,
    shouldShowCompanyDashboard: isRentalCompany || hasCompanyProfile
  };
}
