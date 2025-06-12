
import { useMemo } from 'react';
import { calculatePricing } from '@/utils/pricingCalculations';

interface UseBookingPricingProps {
  pickupDate: string;
  dropoffDate: string;
  pricePerDay: number;
  driverAge: string;
  isInternationalLicense: boolean;
  minimumDriverAge: number;
  requireDamageDeposit: boolean;
  damageDepositAmount: number;
}

export const useBookingPricing = (props: UseBookingPricingProps) => {
  const pricing = useMemo(() => {
    return calculatePricing({
      pickupDate: props.pickupDate,
      dropoffDate: props.dropoffDate,
      pricePerDay: props.pricePerDay,
      driverAge: props.driverAge,
      isInternationalLicense: props.isInternationalLicense,
      minimumDriverAge: props.minimumDriverAge,
      requireDamageDeposit: props.requireDamageDeposit,
      damageDepositAmount: props.damageDepositAmount
    });
  }, [
    props.pickupDate,
    props.dropoffDate,
    props.pricePerDay,
    props.driverAge,
    props.isInternationalLicense,
    props.minimumDriverAge,
    props.requireDamageDeposit,
    props.damageDepositAmount
  ]);

  return pricing;
};
