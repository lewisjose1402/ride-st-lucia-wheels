
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateFieldsProps {
  pickupDate: string;
  setPickupDate: (value: string) => void;
  dropoffDate: string;
  setDropoffDate: (value: string) => void;
}

const DateFields = ({ 
  pickupDate, 
  setPickupDate, 
  dropoffDate, 
  setDropoffDate 
}: DateFieldsProps) => {
  return (
    <>
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
    </>
  );
};

export default DateFields;
