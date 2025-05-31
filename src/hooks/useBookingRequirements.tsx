
import { useState, useEffect } from 'react';
import { getCompanySettings } from '@/services/companySettingsService';

interface BookingRequirements {
  requireDriverLicense: boolean;
  minimumDriverAge: number;
  minimumDrivingExperience: number;
  minimumRentalDays: number;
  requireDamageDeposit: boolean;
  damageDepositAmount: number;
  damageDepositType: string;
}

export const useBookingRequirements = (companyId: string | null) => {
  const [requirements, setRequirements] = useState<BookingRequirements | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      if (!companyId) {
        console.log('useBookingRequirements: No company ID provided, companyId:', companyId);
        setRequirements(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('useBookingRequirements: Fetching requirements for company:', companyId);
        
        const settings = await getCompanySettings(companyId);
        console.log('useBookingRequirements: Raw settings from database:', settings);
        
        // Map the database fields correctly to match what the display component expects
        const mappedRequirements: BookingRequirements = {
          requireDriverLicense: settings?.require_driver_license ?? true,
          minimumDriverAge: settings?.minimum_driver_age ?? 25,
          minimumDrivingExperience: settings?.minimum_driving_experience ?? 3,
          minimumRentalDays: settings?.minimum_rental_days ?? 1,
          requireDamageDeposit: settings?.require_damage_deposit ?? false,
          damageDepositAmount: Number(settings?.damage_deposit_amount) ?? 250,
          damageDepositType: settings?.damage_deposit_type ?? 'Cash'
        };
        
        console.log('useBookingRequirements: Final mapped requirements:', mappedRequirements);
        setRequirements(mappedRequirements);
      } catch (error) {
        console.error('useBookingRequirements: Error fetching requirements:', error);
        // Set default requirements on error
        const defaultRequirements: BookingRequirements = {
          requireDriverLicense: true,
          minimumDriverAge: 25,
          minimumDrivingExperience: 3,
          minimumRentalDays: 1,
          requireDamageDeposit: false,
          damageDepositAmount: 250,
          damageDepositType: 'Cash'
        };
        console.log('useBookingRequirements: Using default requirements due to error:', defaultRequirements);
        setRequirements(defaultRequirements);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequirements();
  }, [companyId]);

  return {
    requirements,
    isLoading
  };
};
