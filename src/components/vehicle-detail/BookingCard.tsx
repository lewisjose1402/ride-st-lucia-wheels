
import { useState } from 'react';
import { Calendar } from 'lucide-react';
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

  const handleBooking = () => {
    navigate('/booking', { state: { vehicleId: vehicle.id, pickupDate, dropoffDate } });
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
          <Button 
            className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white"
            onClick={handleBooking}
            disabled={!pickupDate || !dropoffDate}
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
