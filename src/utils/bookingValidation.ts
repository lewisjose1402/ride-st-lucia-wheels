
import { isValidGoogleMapsUrl } from './pricingCalculations';

interface ValidationInputs {
  driverLicense: File | null;
  driverAge: string;
  drivingExperience: string;
  deliveryLocation: string;
  firstName: string;
  lastName: string;
  email: string;
  pickupDate: string;
  dropoffDate: string;
  requireDriverLicense: boolean;
  minimumDriverAge: number;
  minimumDrivingExperience: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  blockingErrors: string[];
}

export const validateBookingForm = (inputs: ValidationInputs): ValidationResult => {
  const {
    driverLicense,
    driverAge,
    drivingExperience,
    deliveryLocation,
    firstName,
    lastName,
    email,
    pickupDate,
    dropoffDate,
    requireDriverLicense,
    minimumDriverAge,
    minimumDrivingExperience
  } = inputs;

  const errors: string[] = [];
  const blockingErrors: string[] = [];

  // Basic required fields
  if (!firstName.trim()) errors.push('First name is required');
  if (!lastName.trim()) errors.push('Last name is required');
  if (!email.trim()) {
    errors.push('Email address is required');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address');
    }
  }
  if (!pickupDate) errors.push('Pickup date is required');
  if (!dropoffDate) errors.push('Dropoff date is required');

  // Driver's license validation
  if (requireDriverLicense && !driverLicense) {
    blockingErrors.push('Please upload a valid driver\'s license to proceed.');
  }

  // Age validation
  if (!driverAge) {
    errors.push('Driver age is required');
  } else {
    const ageNum = parseInt(driverAge);
    if (isNaN(ageNum) || ageNum < 18) {
      blockingErrors.push('Driver must be at least 18 years old');
    }
    // Note: underage fee is handled in pricing, not blocking
  }

  // Driving experience validation
  if (!drivingExperience) {
    errors.push('Driving experience is required');
  } else {
    const experienceNum = parseInt(drivingExperience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      errors.push('Please enter valid driving experience');
    } else if (experienceNum < minimumDrivingExperience) {
      blockingErrors.push(`Minimum ${minimumDrivingExperience} years of driving experience required`);
    }
  }

  // Google Maps URL validation
  if (!deliveryLocation.trim()) {
    blockingErrors.push('Please insert your google maps location to proceed.');
  } else if (!isValidGoogleMapsUrl(deliveryLocation.trim())) {
    blockingErrors.push('Please provide a valid Google Maps URL for delivery location.');
  }

  const isValid = errors.length === 0 && blockingErrors.length === 0;

  return {
    isValid,
    errors,
    blockingErrors
  };
};
