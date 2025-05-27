
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

  console.log('Validating booking form with inputs:', {
    firstName: firstName ? `"${firstName}"` : 'EMPTY',
    lastName: lastName ? `"${lastName}"` : 'EMPTY',
    email: email ? `"${email}"` : 'EMPTY',
    phoneNumber: phoneNumber ? `"${phoneNumber}"` : 'EMPTY',
    pickupDate: pickupDate ? `"${pickupDate}"` : 'EMPTY',
    dropoffDate: dropoffDate ? `"${dropoffDate}"` : 'EMPTY',
    driverAge: driverAge ? `"${driverAge}"` : 'EMPTY',
    drivingExperience: drivingExperience ? `"${drivingExperience}"` : 'EMPTY',
    deliveryLocation: deliveryLocation ? `"${deliveryLocation}"` : 'EMPTY',
    driverLicense: driverLicense ? 'FILE UPLOADED' : 'NO FILE',
    requireDriverLicense,
    minimumDriverAge,
    minimumDrivingExperience
  });

  const errors: string[] = [];
  const blockingErrors: string[] = [];

  // Basic required fields
  if (!firstName.trim()) {
    errors.push('First name is required');
    console.log('VALIDATION ERROR: First name is empty');
  }
  if (!lastName.trim()) {
    errors.push('Last name is required');
    console.log('VALIDATION ERROR: Last name is empty');
  }
  if (!email.trim()) {
    errors.push('Email address is required');
    console.log('VALIDATION ERROR: Email is empty');
  } else {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address');
      console.log('VALIDATION ERROR: Invalid email format');
    }
  }
  
  // Phone number validation
  if (!phoneNumber.trim() || phoneNumber.trim() === '+1') {
    errors.push('Phone number is required');
    console.log('VALIDATION ERROR: Phone number is empty or just +1');
  } else {
    // Validate phone number format (+1 followed by 10 digits)
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      errors.push('Please enter a valid phone number (+1 followed by 10 digits)');
      console.log('VALIDATION ERROR: Invalid phone number format');
    }
  }
  
  if (!pickupDate) {
    errors.push('Pickup date is required');
    console.log('VALIDATION ERROR: Pickup date is empty');
  }
  if (!dropoffDate) {
    errors.push('Dropoff date is required');
    console.log('VALIDATION ERROR: Dropoff date is empty');
  }

  // Driver's license validation
  if (requireDriverLicense && !driverLicense) {
    blockingErrors.push('Please upload a valid driver\'s license to proceed.');
    console.log('VALIDATION ERROR: Driver license required but not uploaded');
  }

  // Age validation
  if (!driverAge) {
    errors.push('Driver age is required');
    console.log('VALIDATION ERROR: Driver age is empty');
  } else {
    const ageNum = parseInt(driverAge);
    if (isNaN(ageNum) || ageNum < 18) {
      blockingErrors.push('Driver must be at least 18 years old');
      console.log('VALIDATION ERROR: Driver age is invalid or under 18');
    } else if (ageNum < minimumDriverAge) {
      blockingErrors.push(`Driver must be at least ${minimumDriverAge} years old for this vehicle`);
      console.log(`VALIDATION ERROR: Driver age ${ageNum} is below minimum required age ${minimumDriverAge}`);
    }
  }

  // Driving experience validation
  if (!drivingExperience) {
    errors.push('Driving experience is required');
    console.log('VALIDATION ERROR: Driving experience is empty');
  } else {
    const experienceNum = parseInt(drivingExperience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      errors.push('Please enter valid driving experience');
      console.log('VALIDATION ERROR: Driving experience is invalid');
    } else if (experienceNum < minimumDrivingExperience) {
      blockingErrors.push(`Minimum ${minimumDrivingExperience} years of driving experience required`);
      console.log(`VALIDATION ERROR: Experience ${experienceNum} is below minimum required ${minimumDrivingExperience}`);
    }
  }

  // Google Maps URL validation
  if (!deliveryLocation.trim()) {
    blockingErrors.push('Please insert your google maps location to proceed.');
    console.log('VALIDATION ERROR: Delivery location is empty');
  } else if (!isValidGoogleMapsUrl(deliveryLocation.trim())) {
    blockingErrors.push('Please provide a valid Google Maps URL for delivery location.');
    console.log('VALIDATION ERROR: Invalid Google Maps URL');
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
