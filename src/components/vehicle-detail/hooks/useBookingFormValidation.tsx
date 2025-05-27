
import { useMemo } from 'react';
import { validateBookingForm } from '@/utils/bookingValidation';

interface UseBookingFormValidationProps {
  driverLicense: File | null;
  driverAge: string;
  drivingExperience: string;
  deliveryLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pickupDate: string;
  dropoffDate: string;
  requireDriverLicense: boolean;
  minimumDriverAge: number;
  minimumDrivingExperience: number;
}

export const useBookingFormValidation = (props: UseBookingFormValidationProps) => {
  const validation = useMemo(() => {
    return validateBookingForm({
      driverLicense: props.driverLicense,
      driverAge: props.driverAge,
      drivingExperience: props.drivingExperience,
      deliveryLocation: props.deliveryLocation,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      phoneNumber: props.phoneNumber,
      pickupDate: props.pickupDate,
      dropoffDate: props.dropoffDate,
      requireDriverLicense: props.requireDriverLicense,
      minimumDriverAge: props.minimumDriverAge,
      minimumDrivingExperience: props.minimumDrivingExperience
    });
  }, [
    props.driverLicense,
    props.driverAge,
    props.drivingExperience,
    props.deliveryLocation,
    props.firstName,
    props.lastName,
    props.email,
    props.phoneNumber,
    props.pickupDate,
    props.dropoffDate,
    props.requireDriverLicense,
    props.minimumDriverAge,
    props.minimumDrivingExperience
  ]);

  return validation;
};
