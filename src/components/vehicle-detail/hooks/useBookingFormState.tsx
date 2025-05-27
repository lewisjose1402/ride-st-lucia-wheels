
import { useState } from 'react';

export const useBookingFormState = () => {
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+1');
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [driverAge, setDriverAge] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [isInternationalLicense, setIsInternationalLicense] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDriverLicense(file);
    }
  };

  return {
    // State values
    pickupDate,
    dropoffDate,
    firstName,
    lastName,
    email,
    phoneNumber,
    driverLicense,
    driverAge,
    drivingExperience,
    deliveryLocation,
    isInternationalLicense,
    
    // State setters
    setPickupDate,
    setDropoffDate,
    setFirstName,
    setLastName,
    setEmail,
    setPhoneNumber,
    setDriverLicense,
    setDriverAge,
    setDrivingExperience,
    setDeliveryLocation,
    setIsInternationalLicense,
    
    // Handlers
    handleFileUpload,
  };
};
