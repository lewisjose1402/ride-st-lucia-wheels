
import { useMemo } from 'react';
import { validateBookingForm } from '@/utils/bookingValidation';

interface UseBookingFormValidationProps {
  formData: {
    driverLicense: File | null;
    driverAge: string;
    drivingExperience: string;
    deliveryLocation: string;
    deliveryLocationType: 'google_maps' | 'airport';
    selectedAirport: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    pickupDate: string;
    dropoffDate: string;
  };
  requirements: {
    requireDriverLicense: boolean;
    minimumDriverAge: number;
    minimumDrivingExperience: number;
    minimumRentalDays: number;
  } | null;
}

export const useBookingFormValidation = ({ formData, requirements }: UseBookingFormValidationProps) => {
  const validation = useMemo(() => {
    if (!requirements) {
      return {
        isValid: false,
        errors: [],
        blockingErrors: ['Loading requirements...']
      };
    }

    return validateBookingForm({
      driverLicense: formData.driverLicense,
      driverAge: formData.driverAge,
      drivingExperience: formData.drivingExperience,
      deliveryLocation: formData.deliveryLocation,
      deliveryLocationType: formData.deliveryLocationType,
      selectedAirport: formData.selectedAirport,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      pickupDate: formData.pickupDate,
      dropoffDate: formData.dropoffDate,
      requireDriverLicense: requirements.requireDriverLicense,
      minimumDriverAge: requirements.minimumDriverAge,
      minimumDrivingExperience: requirements.minimumDrivingExperience,
      minimumRentalDays: requirements.minimumRentalDays,
    });
  }, [formData, requirements]);

  return validation;
};
