
import DateFields from './DateFields';
import PersonalInfoFields from './PersonalInfoFields';
import DriverInfoFields from './DriverInfoFields';

interface BookingFormFieldsProps {
  vehicleId: string;
  formState: any;
}

const BookingFormFields = ({ vehicleId, formState }: BookingFormFieldsProps) => {
  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <DateFields 
        vehicleId={vehicleId}
        pickupDate={formState.pickupDate}
        setPickupDate={formState.setPickupDate}
        dropoffDate={formState.dropoffDate}
        setDropoffDate={formState.setDropoffDate}
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
