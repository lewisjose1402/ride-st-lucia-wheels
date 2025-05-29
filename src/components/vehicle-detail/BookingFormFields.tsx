
import React from 'react';
import DateFields from './DateFields';
import DriverInfoFields from './DriverInfoFields';
import PersonalInfoFields from './PersonalInfoFields';

interface BookingFormFieldsProps {
  vehicleId: string;
  formState: {
    pickupDate: string;
    setPickupDate: (date: string) => void;
    dropoffDate: string;
    setDropoffDate: (date: string) => void;
    driverLicense: File | null;
    setDriverLicense: (file: File | null) => void;
    driverAge: string;
    setDriverAge: (age: string) => void;
    drivingExperience: string;
    setDrivingExperience: (experience: string) => void;
    isInternationalLicense: boolean;
    setIsInternationalLicense: (isInternational: boolean) => void;
    deliveryLocation: string;
    setDeliveryLocation: (location: string) => void;
    firstName: string;
    setFirstName: (name: string) => void;
    lastName: string;
    setLastName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
  };
  minimumRentalDays?: number;
}

const BookingFormFields = ({ vehicleId, formState, minimumRentalDays = 1 }: BookingFormFieldsProps) => {
  console.log('BookingFormFields: minimumRentalDays received:', minimumRentalDays);

  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <DateFields
        vehicleId={vehicleId}
        pickupDate={formState.pickupDate}
        setPickupDate={formState.setPickupDate}
        dropoffDate={formState.dropoffDate}
        setDropoffDate={formState.setDropoffDate}
        minimumRentalDays={minimumRentalDays}
      />

      {/* Personal Information */}
      <PersonalInfoFields formState={formState} />

      {/* Driver Information */}
      <DriverInfoFields formState={formState} />
    </div>
  );
};

export default BookingFormFields;
