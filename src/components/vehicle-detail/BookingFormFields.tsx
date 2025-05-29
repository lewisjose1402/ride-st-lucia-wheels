
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
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      <PersonalInfoFields 
        firstName={formState.firstName}
        setFirstName={formState.setFirstName}
        lastName={formState.lastName}
        setLastName={formState.setLastName}
        email={formState.email}
        setEmail={formState.setEmail}
        phoneNumber={formState.phoneNumber}
        setPhoneNumber={formState.setPhoneNumber}
      />

      {/* Driver Information */}
      <DriverInfoFields 
        driverLicense={formState.driverLicense}
        handleFileUpload={formState.handleFileUpload}
        driverAge={formState.driverAge}
        setDriverAge={formState.setDriverAge}
        drivingExperience={formState.drivingExperience}
        setDrivingExperience={formState.setDrivingExperience}
        deliveryLocation={formState.deliveryLocation}
        setDeliveryLocation={formState.setDeliveryLocation}
        isInternationalLicense={formState.isInternationalLicense}
        setIsInternationalLicense={formState.setIsInternationalLicense}
      />
    </div>
  );
};

export default BookingFormFields;
