
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

interface DateFieldsProps {
  pickupDate: string;
  setPickupDate: (value: string) => void;
  dropoffDate: string;
  setDropoffDate: (value: string) => void;
  vehicleId?: string;
}

const DateFields = ({ 
  pickupDate, 
  setPickupDate, 
  dropoffDate, 
  setDropoffDate,
  vehicleId 
}: DateFieldsProps) => {
  const { toast } = useToast();
  const { isDateRangeAvailable, getDateStatus } = useAvailabilityCheck({ 
    vehicleId: vehicleId || '' 
  });

  // Check availability when dates change
  useEffect(() => {
    if (pickupDate && dropoffDate && vehicleId) {
      const start = new Date(pickupDate);
      const end = new Date(dropoffDate);
      
      if (start <= end) {
        const isAvailable = isDateRangeAvailable(start, end);
        if (!isAvailable) {
          // Find the first blocked date in the range
          for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            const status = getDateStatus(date);
            if (status && status.status !== 'available') {
              toast({
                title: 'Date Unavailable',
                description: `${date.toLocaleDateString()} is ${status.status === 'booked-ical' ? 'booked via external calendar' : 'manually blocked'}${status.reason ? ': ' + status.reason : ''}`,
                variant: 'destructive',
              });
              break;
            }
          }
        }
      }
    }
  }, [pickupDate, dropoffDate, vehicleId, isDateRangeAvailable, getDateStatus, toast]);

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
