
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DateFields from './DateFields';
import PersonalInfoFields from './PersonalInfoFields';
import DriverInfoFields from './DriverInfoFields';

interface BookingCardProps {
  vehicle: any;
}

const BookingCard = ({ vehicle }: BookingCardProps) => {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [driverAge, setDriverAge] = useState('');
  const [drivingExperience, setDrivingExperience] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDriverLicense(file);
    }
  };

  const isFormValid = () => {
    return pickupDate && 
           dropoffDate && 
           firstName.trim() && 
           lastName.trim() && 
           driverLicense && 
           driverAge && 
           drivingExperience && 
           deliveryLocation.trim();
  };

  const handleBooking = () => {
    const bookingData = {
      vehicleId: vehicle.id,
      pickupDate,
      dropoffDate,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      driverLicense,
      driverAge: parseInt(driverAge),
      drivingExperience: parseInt(drivingExperience),
      deliveryLocation: deliveryLocation.trim()
    };
    
    navigate('/booking', { state: bookingData });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          <span className="text-2xl font-bold">${vehicle.price_per_day}</span>
          <span className="text-gray-500 text-base font-normal"> / day</span>
        </CardTitle>
        <CardDescription>Inclusive of standard insurance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Date Selection */}
          <DateFields 
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            dropoffDate={dropoffDate}
            setDropoffDate={setDropoffDate}
          />

          {/* Personal Information */}
          <PersonalInfoFields 
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
          />

          {/* Driver Information */}
          <DriverInfoFields 
            driverLicense={driverLicense}
            handleFileUpload={handleFileUpload}
            driverAge={driverAge}
            setDriverAge={setDriverAge}
            drivingExperience={drivingExperience}
            setDrivingExperience={setDrivingExperience}
            deliveryLocation={deliveryLocation}
            setDeliveryLocation={setDeliveryLocation}
          />

          <Button 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={handleBooking}
            disabled={!isFormValid()}
          >
            Book Now
          </Button>
          
          <div className="text-center text-sm text-gray-500 mt-2">
            Only 10% deposit required to confirm
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
