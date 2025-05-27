
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UseBookingFormActionsProps {
  vehicle: any;
  formState: {
    pickupDate: string;
    dropoffDate: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    driverLicense: File | null;
    driverAge: string;
    drivingExperience: string;
    deliveryLocation: string;
    isInternationalLicense: boolean;
  };
  validation: {
    isValid: boolean;
    errors: string[];
    blockingErrors: string[];
  };
  pricing: any;
}

export const useBookingFormActions = ({
  vehicle,
  formState,
  validation,
  pricing
}: UseBookingFormActionsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
      pickupDate: formState.pickupDate,
      dropoffDate: formState.dropoffDate,
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      email: formState.email.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      driverLicense: formState.driverLicense,
      driverAge: parseInt(formState.driverAge),
      drivingExperience: parseInt(formState.drivingExperience),
      deliveryLocation: formState.deliveryLocation.trim(),
      isInternationalLicense: formState.isInternationalLicense,
      pricing
    };
    
    navigate('/booking', { state: bookingData });
  };

  return {
    handleBooking
  };
};
