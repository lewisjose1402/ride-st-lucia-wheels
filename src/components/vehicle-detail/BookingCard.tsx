
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import DateFields from './DateFields';
import PersonalInfoFields from './PersonalInfoFields';
import DriverInfoFields from './DriverInfoFields';
import PriceBreakdown from './PriceBreakdown';
import BookingRequirementsDisplay from './BookingRequirementsDisplay';
import BookingActions from './BookingActions';
import { useBookingRequirements } from '@/hooks/useBookingRequirements';
import { calculatePricing } from '@/utils/pricingCalculations';
import { validateBookingForm } from '@/utils/bookingValidation';

interface BookingCardProps {
  vehicle: any;
}

const BookingCard = ({ vehicle }: BookingCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [driverAge, setDriverAge] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [isInternationalLicense, setIsInternationalLicense] = useState(false);

  // Fetch company requirements
  const { requirements, isLoading: requirementsLoading } = useBookingRequirements(vehicle.company_id);

  // Calculate pricing in real-time
  const pricing = useMemo(() => {
    return calculatePricing({
      pickupDate,
      dropoffDate,
      pricePerDay: vehicle.price_per_day,
      driverAge,
      isInternationalLicense,
      minimumDriverAge: requirements.minimumDriverAge,
      requireDamageDeposit: requirements.requireDamageDeposit,
      damageDepositAmount: requirements.damageDepositAmount
    });
  }, [
    pickupDate, 
    dropoffDate, 
    vehicle.price_per_day, 
    driverAge, 
    isInternationalLicense,
    requirements.minimumDriverAge,
    requirements.requireDamageDeposit,
    requirements.damageDepositAmount
  ]);

  // Validate form
  const validation = useMemo(() => {
    return validateBookingForm({
      driverLicense,
      driverAge,
      drivingExperience,
      deliveryLocation,
      firstName,
      lastName,
      pickupDate,
      dropoffDate,
      requireDriverLicense: requirements.requireDriverLicense,
      minimumDriverAge: requirements.minimumDriverAge,
      minimumDrivingExperience: requirements.minimumDrivingExperience
    });
  }, [
    driverLicense,
    driverAge,
    drivingExperience,
    deliveryLocation,
    firstName,
    lastName,
    pickupDate,
    dropoffDate,
    requirements.requireDriverLicense,
    requirements.minimumDriverAge,
    requirements.minimumDrivingExperience
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDriverLicense(file);
    }
  };

  const handleBooking = () => {
    // Show blocking errors as toast notifications
    if (validation.blockingErrors.length > 0) {
      validation.blockingErrors.forEach(error => {
        toast({
          title: "Booking Requirements Not Met",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    // Show non-blocking errors as warnings
    if (validation.errors.length > 0) {
      validation.errors.forEach(error => {
        toast({
          title: "Please Complete",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    const bookingData = {
      vehicleId: vehicle.id,
      pickupDate,
      dropoffDate,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      driverLicense,
      driverAge: parseInt(driverAge),
      drivingExperience: parseInt(drivingExperience),
      deliveryLocation: deliveryLocation.trim(),
      isInternationalLicense,
      pricing
    };
    
    navigate('/booking', { state: bookingData });
  };

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
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            dropoffDate={dropoffDate}
            setDropoffDate={setDropoffDate}
          />

          {/* Personal Information */}
          <PersonalInfoFields 
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
          />

          {/* Driver Information */}
          <DriverInfoFields 
            driverLicense={driverLicense}
            handleFileUpload={handleFileUpload}
            driverAge={driverAge}
            setDriverAge={setDriverAge}
            drivingExperience={drivingExperience}
            setDrivingExperience={setDrivingExperience}
            deliveryLocation={deliveryLocation}
            setDeliveryLocation={setDeliveryLocation}
            isInternationalLicense={isInternationalLicense}
            setIsInternationalLicense={setIsInternationalLicense}
          />

          {/* Price Breakdown */}
          {(pickupDate && dropoffDate) && (
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
            pickupDate={pickupDate}
            dropoffDate={dropoffDate}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
