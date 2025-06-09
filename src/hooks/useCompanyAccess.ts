
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useCompanyAccess() {
  const { user, isRentalCompany, isAdmin } = useAuth();
  const [hasCompanyProfile, setHasCompanyProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkCompanyProfile = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    checkCompanyProfile();
  }, [checkCompanyProfile]);

  return {
    hasCompanyProfile,
    isLoading,
    // Allow company dashboard access for:
    // 1. Users with rental_company role
    // 2. Admin users who have company profiles
    shouldShowCompanyDashboard: isRentalCompany || (isAdmin && hasCompanyProfile)
  };
}
