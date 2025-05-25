
import { useQuery } from '@tanstack/react-query';
import { getCompanySettings } from '@/services/companySettingsService';

interface BookingRequirements {
  requireDriverLicense: boolean;
  minimumDriverAge: number;
  minimumDrivingExperience: number;
  requireDamageDeposit: boolean;
  damageDepositAmount: number;
  damageDepositType: string;
}

export const useBookingRequirements = (companyId: string) => {
  const { data: companySettings, isLoading, error } = useQuery({
    queryKey: ['company-settings', companyId],
    queryFn: () => getCompanySettings(companyId),
    enabled: !!companyId,
  });

  const requirements: BookingRequirements = {
    requireDriverLicense: companySettings?.require_driver_license ?? true,
    minimumDriverAge: companySettings?.minimum_driver_age ?? 25,
    minimumDrivingExperience: companySettings?.minimum_driving_experience ?? 3,
    requireDamageDeposit: companySettings?.require_damage_deposit ?? false,
    damageDepositAmount: companySettings?.damage_deposit_amount ?? 250,
    damageDepositType: companySettings?.damage_deposit_type ?? 'Cash',
  };

  return {
    requirements,
    isLoading,
    error
  };
};
