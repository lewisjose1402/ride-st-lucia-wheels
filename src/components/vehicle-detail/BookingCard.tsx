
import { useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import DateFields from './DateFields';
import PersonalInfoFields from './PersonalInfoFields';
import DriverInfoFields from './DriverInfoFields';
import PriceBreakdown from './PriceBreakdown';
import BookingRequirementsDisplay from './BookingRequirementsDisplay';
import BookingActions from './BookingActions';
import { useBookingRequirements } from '@/hooks/useBookingRequirements';
import { calculatePricing } from '@/utils/pricingCalculations';
import { useBookingFormState } from './hooks/useBookingFormState';
import { useBookingFormValidation } from './hooks/useBookingFormValidation';
import { useBookingFormActions } from './hooks/useBookingFormActions';

interface BookingCardProps {
  vehicle: any;
}

const BookingCard = ({ vehicle }: BookingCardProps) => {
  // Custom hooks for form management
  const formState = useBookingFormState();
  const { requirements, isLoading: requirementsLoading } = useBookingRequirements(vehicle.company_id);

  // Calculate pricing in real-time
  const pricing = useMemo(() => {
    return calculatePricing({
      pickupDate: formState.pickupDate,
      dropoffDate: formState.dropoffDate,
      pricePerDay: vehicle.price_per_day,
      driverAge: formState.driverAge,
      isInternationalLicense: formState.isInternationalLicense,
      minimumDriverAge: requirements.minimumDriverAge,
      requireDamageDeposit: requirements.requireDamageDeposit,
      damageDepositAmount: requirements.damageDepositAmount
    });
  }, [
    formState.pickupDate, 
    formState.dropoffDate, 
    vehicle.price_per_day, 
    formState.driverAge, 
    formState.isInternationalLicense,
    requirements.minimumDriverAge,
    requirements.requireDamageDeposit,
    requirements.damageDepositAmount
  ]);

  // Validate form
  const validation = useBookingFormValidation({
    driverLicense: formState.driverLicense,
    driverAge: formState.driverAge,
    drivingExperience: formState.drivingExperience,
    deliveryLocation: formState.deliveryLocation,
    firstName: formState.firstName,
    lastName: formState.lastName,
    email: formState.email,
    phoneNumber: formState.phoneNumber,
    pickupDate: formState.pickupDate,
    dropoffDate: formState.dropoffDate,
    requireDriverLicense: requirements.requireDriverLicense,
    minimumDriverAge: requirements.minimumDriverAge,
    minimumDrivingExperience: requirements.minimumDrivingExperience
  });

  // Form actions
  const { handleBooking, isProcessing } = useBookingFormActions({
    vehicle,
    formState,
    validation,
    pricing
  });

  if (requirementsLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <span className="text-2xl font-bold">${vehicle.price_per_day}</span>
          <span className="text-gray-500 text-base font-normal"> / day</span>
        </CardTitle>
        <CardDescription>Inclusive of standard insurance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Company Requirements Display */}
          <BookingRequirementsDisplay requirements={requirements} />

          {/* Date Selection */}
          <DateFields 
            vehicleId={vehicle.id}
            pickupDate={formState.pickupDate}
            setPickupDate={formState.setPickupDate}
            dropoffDate={formState.dropoffDate}
            setDropoffDate={formState.setDropoffDate}
          />

          {/* Personal Information */}
          <PersonalInfoFields 
            firstName={formState.firstName}
            setFirstName={formState.setFirstName}
            lastName={formState.lastName}
            setLastName={formState.setLastName}
            email={formState.email}
            setEmail={formState.setEmail}
            phoneNumber={formState.phoneNumber}
            setPhoneNumber={formState.setPhoneNumber}
          />

          {/* Driver Information */}
          <DriverInfoFields 
            driverLicense={formState.driverLicense}
            handleFileUpload={formState.handleFileUpload}
            driverAge={formState.driverAge}
            setDriverAge={formState.setDriverAge}
            drivingExperience={formState.drivingExperience}
            setDrivingExperience={formState.setDrivingExperience}
            deliveryLocation={formState.deliveryLocation}
            setDeliveryLocation={formState.setDeliveryLocation}
            isInternationalLicense={formState.isInternationalLicense}
            setIsInternationalLicense={formState.setIsInternationalLicense}
          />

          {/* Price Breakdown */}
          {(formState.pickupDate && formState.dropoffDate) && (
            <PriceBreakdown
              rentalDays={pricing.rentalDays}
              baseCost={pricing.baseCost}
              confirmationFee={pricing.confirmationFee}
              taxableAmount={pricing.taxableAmount}
              governmentTax={pricing.governmentTax}
              permitFee={pricing.permitFee}
              underageDeposit={pricing.underageDeposit}
              damageDeposit={pricing.damageDeposit}
              totalCost={pricing.totalCost}
              pricePerDay={vehicle.price_per_day}
              damageDepositType={requirements.damageDepositType}
            />
          )}

          {/* Booking Actions */}
          <BookingActions 
            onBooking={handleBooking}
            isValid={validation.isValid}
            vehicleId={vehicle.id}
            pickupDate={formState.pickupDate}
            dropoffDate={formState.dropoffDate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
