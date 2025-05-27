
import { isValidGoogleMapsUrl } from './pricingCalculations';

interface ValidationInputs {
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
    phoneNumber,
    pickupDate,
    dropoffDate,
    requireDriverLicense,
    minimumDriverAge,
    minimumDrivingExperience
  } = inputs;

  const errors: string[] = [];
  const blockingErrors: string[] = [];

  console.log('Validating booking form with inputs:', {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
    driverAge,
    drivingExperience,
    deliveryLocation: deliveryLocation.trim(),
    pickupDate,
    dropoffDate,
    requireDriverLicense,
    driverLicense: !!driverLicense
  });

  // Basic required fields
  if (!firstName.trim()) {
    errors.push('First name is required');
    console.log('First name validation failed');
  }
  if (!lastName.trim()) {
    errors.push('Last name is required');
    console.log('Last name validation failed');
  }
  if (!email.trim()) {
    errors.push('Email address is required');
    console.log('Email validation failed - empty');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address');
      console.log('Email validation failed - invalid format:', email.trim());
    }
  }
  
  // Phone number validation
  if (!phoneNumber.trim() || phoneNumber.trim() === '+1') {
    errors.push('Phone number is required');
    console.log('Phone number validation failed - empty or just +1');
  } else {
    // Validate phone number format (+1 followed by 10 digits)
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      errors.push('Please enter a valid phone number (+1 followed by 10 digits)');
      console.log('Phone number validation failed - invalid format:', phoneNumber.trim());
    }
  }
  
  // Date validation
  if (!pickupDate) {
    errors.push('Pickup date is required');
    console.log('Pickup date validation failed');
  }
  if (!dropoffDate) {
    errors.push('Dropoff date is required');
    console.log('Dropoff date validation failed');
  }

  // Driver's license validation
  if (requireDriverLicense && !driverLicense) {
    blockingErrors.push('Please upload a valid driver\'s license to proceed.');
    console.log('Driver license validation failed - required but not provided');
  }

  // Age validation
  if (!driverAge || driverAge.trim() === '') {
    errors.push('Driver age is required');
    console.log('Driver age validation failed - empty');
  } else {
    const ageNum = parseInt(driverAge);
    if (isNaN(ageNum) || ageNum < 18) {
      blockingErrors.push('Driver must be at least 18 years old');
      console.log('Driver age validation failed - under 18 or invalid:', ageNum);
    } else if (ageNum < minimumDriverAge) {
      console.log(`Driver age ${ageNum} is below minimum ${minimumDriverAge}, but this is handled in pricing, not blocking`);
      // Note: underage fee is handled in pricing, not blocking
    }
  }

  // Driving experience validation
  if (!drivingExperience || drivingExperience.trim() === '') {
    errors.push('Driving experience is required');
    console.log('Driving experience validation failed - empty');
  } else {
    const experienceNum = parseInt(drivingExperience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      errors.push('Please enter valid driving experience');
      console.log('Driving experience validation failed - invalid number:', experienceNum);
    } else if (experienceNum < minimumDrivingExperience) {
      blockingErrors.push(`Minimum ${minimumDrivingExperience} years of driving experience required`);
      console.log('Driving experience validation failed - below minimum:', experienceNum, 'vs', minimumDrivingExperience);
    }
  }

  // Google Maps URL validation
  if (!deliveryLocation.trim()) {
    blockingErrors.push('Please insert your google maps location to proceed.');
    console.log('Delivery location validation failed - empty');
  } else if (!isValidGoogleMapsUrl(deliveryLocation.trim())) {
    blockingErrors.push('Please provide a valid Google Maps URL for delivery location.');
    console.log('Delivery location validation failed - invalid URL:', deliveryLocation.trim());
  }

  const isValid = errors.length === 0 && blockingErrors.length === 0;

  console.log('Validation result:', {
    isValid,
    errorsCount: errors.length,
    blockingErrorsCount: blockingErrors.length,
    errors,
    blockingErrors
  });

  return {
    isValid,
    errors,
    blockingErrors
  };
};
