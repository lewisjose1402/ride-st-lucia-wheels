
import { useState } from 'react';
import { Calendar, Upload, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
          <div>
            <Label htmlFor="pickupDate">Pickup Date</Label>
            <div className="relative mt-1">
              <Input
                id="pickupDate"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full"
                min={new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="dropoffDate">Dropoff Date</Label>
            <div className="relative mt-1">
              <Input
                id="dropoffDate"
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                className="w-full"
                min={pickupDate || new Date().toISOString().split('T')[0]}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1"
              />
            </div>
          </div>

          {/* Driver's License Upload */}
          <div>
            <Label htmlFor="driverLicense">Driver's License</Label>
            <div className="relative mt-1">
              <Input
                id="driverLicense"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="w-full"
              />
              <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {driverLicense && (
              <p className="text-sm text-green-600 mt-1">
                ✓ {driverLicense.name}
              </p>
            )}
          </div>

          {/* Driver Information */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="driverAge">Driver's Age</Label>
              <Input
                id="driverAge"
                type="number"
                value={driverAge}
                onChange={(e) => setDriverAge(e.target.value)}
                placeholder="25"
                min="18"
                max="100"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="drivingExperience">Years of Experience</Label>
              <Input
                id="drivingExperience"
                type="number"
                value={drivingExperience}
                onChange={(e) => setDrivingExperience(e.target.value)}
                placeholder="5"
                min="0"
                max="50"
                className="mt-1"
              />
            </div>
          </div>

          {/* Delivery Location */}
          <div>
            <Label htmlFor="deliveryLocation">Vehicle Delivery Location</Label>
            <div className="relative mt-1">
              <Input
                id="deliveryLocation"
                type="url"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full"
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Share a Google Maps link for vehicle delivery
            </p>
          </div>

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
