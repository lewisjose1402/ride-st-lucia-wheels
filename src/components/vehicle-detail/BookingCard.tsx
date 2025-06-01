
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import BookingFormFields from './BookingFormFields';
import ValidationErrorDisplay from './ValidationErrorDisplay';
import PriceBreakdown from './PriceBreakdown';
import BookingActions from './BookingActions';
import AuthPrompt from './AuthPrompt';
import { useAuth } from '@/context/AuthContext';
import { useBookingRequirements } from '@/hooks/useBookingRequirements';
import { useBookingFormState } from './hooks/useBookingFormState';
import { useBookingFormValidation } from './hooks/useBookingFormValidation';
import { useBookingFormActions } from './hooks/useBookingFormActions';
import { useBookingPricing } from './hooks/useBookingPricing';

interface BookingCardProps {
  vehicle: any;
}

const BookingCard = ({ vehicle }: BookingCardProps) => {
  const { user } = useAuth();
  
  // If user is not authenticated, show auth prompt
  if (!user) {
    return <AuthPrompt />;
  }

  // Custom hooks for form management (only load when user is authenticated)
  const formState = useBookingFormState();
  const { requirements, isLoading: requirementsLoading } = useBookingRequirements(vehicle.company_id);

  console.log('BookingCard: requirements loaded:', requirements);

  // Calculate pricing in real-time
  const pricing = useBookingPricing({
    pickupDate: formState.pickupDate,
    dropoffDate: formState.dropoffDate,
    pricePerDay: vehicle.price_per_day,
    driverAge: formState.driverAge,
    isInternationalLicense: formState.isInternationalLicense,
    minimumDriverAge: requirements?.minimumDriverAge || 25,
    requireDamageDeposit: requirements?.requireDamageDeposit || false,
    damageDepositAmount: requirements?.damageDepositAmount || 250
  });

  // Validate form
  const validation = useBookingFormValidation({
    formData: {
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
    },
    requirements
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
          {/* Form Fields */}
          <BookingFormFields 
            vehicleId={vehicle.id} 
            formState={formState}
            minimumRentalDays={requirements?.minimumRentalDays || 1}
          />

          {/* Validation Errors Display */}
          <ValidationErrorDisplay 
            isValid={validation.isValid}
            errors={validation.errors}
            blockingErrors={validation.blockingErrors}
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
              damageDepositType={requirements?.damageDepositType || 'Cash'}
            />
          )}

          {/* Booking Actions */}
          <BookingActions 
            onBooking={handleBooking}
            isValid={validation.isValid}
            vehicleId={vehicle.id}
            pickupDate={formState.pickupDate}
            dropoffDate={formState.dropoffDate}
            isProcessing={isProcessing}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
