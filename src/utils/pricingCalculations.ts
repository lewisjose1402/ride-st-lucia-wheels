
interface PricingInputs {
  pickupDate: string;
  dropoffDate: string;
  pricePerDay: number;
  driverAge: string;
  isInternationalLicense: boolean;
  minimumDriverAge: number;
  requireDamageDeposit: boolean;
  damageDepositAmount: number;
}

interface PricingBreakdown {
  rentalDays: number;
  baseCost: number;
  confirmationFee: number;
  taxableAmount: number;
  governmentTax: number;
  permitFee: number;
  underageDeposit: number;
  damageDeposit: number;
  totalCost: number;
}

export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays || 1; // Minimum 1 day
};

export const calculatePricing = (inputs: PricingInputs): PricingBreakdown => {
  const {
    pickupDate,
    dropoffDate,
    pricePerDay,
    driverAge,
    isInternationalLicense,
    minimumDriverAge,
    requireDamageDeposit,
    damageDepositAmount
  } = inputs;

  const rentalDays = calculateDaysBetween(pickupDate, dropoffDate);
  const baseCost = rentalDays * pricePerDay;
  
  // Booking Confirmation Fee (12%) - paid now
  const confirmationFee = baseCost * 0.12;
  
  // Taxable Amount = Base Cost - Booking Confirmation Fee
  const taxableAmount = baseCost - confirmationFee;
  
  // Government Tax (25%) applied to taxable amount
  const governmentTax = taxableAmount * 0.25;
  
  // Permit fee applies if NOT international license
  const permitFee = !isInternationalLicense ? 23 : 0;
  
  // Underage deposit if driver is below minimum age
  const driverAgeNum = parseInt(driverAge);
  const underageDeposit = (driverAge && driverAgeNum < minimumDriverAge) ? 1000 : 0;
  
  // Damage deposit from company settings
  const damageDeposit = requireDamageDeposit ? damageDepositAmount : 0;
  
  const totalCost = baseCost + governmentTax + permitFee + underageDeposit + damageDeposit;

  return {
    rentalDays,
    baseCost,
    confirmationFee,
    taxableAmount,
    governmentTax,
    permitFee,
    underageDeposit,
    damageDeposit,
    totalCost
  };
};

export const isValidGoogleMapsUrl = (url: string): boolean => {
  if (!url) return false;
  const googleMapsPattern = /^https:\/\/(www\.)?(google\.com\/maps|maps\.google\.com|goo\.gl\/maps)/;
  return googleMapsPattern.test(url);
};
