
import { Button } from '@/components/ui/button';
import { useAvailabilityCheck } from '@/hooks/useAvailabilityCheck';

interface BookingActionsProps {
  onBooking: () => void;
  isValid: boolean;
  vehicleId?: string;
  pickupDate?: string;
  dropoffDate?: string;
  isProcessing?: boolean;
}

const BookingActions = ({
  onBooking,
  isValid,
  vehicleId,
  pickupDate,
  dropoffDate,
  isProcessing = false
}: BookingActionsProps) => {
  const { isDateRangeAvailable } = useAvailabilityCheck({ 
    vehicleId: vehicleId || '' 
  });

  const checkAvailability = () => {
    if (!pickupDate || !dropoffDate || !vehicleId) return true;
    
    const start = new Date(pickupDate);
    const end = new Date(dropoffDate);
    
    return isDateRangeAvailable(start, end);
  };

  const isAvailable = checkAvailability();
  const isBookingValid = isValid && isAvailable;

  console.log('BookingActions state:', {
    isValid,
    isAvailable,
    isBookingValid,
    isProcessing,
    pickupDate: pickupDate ? 'set' : 'not set',
    dropoffDate: dropoffDate ? 'set' : 'not set'
  });

  return (
    <>
      <Button 
        className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white" 
        onClick={onBooking} 
        disabled={!isBookingValid || isProcessing}
      >
        {isProcessing ? 'Processing...' : !isAvailable ? 'Dates Unavailable' : 'Book Now'}
      </Button>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        {isAvailable ? 'Only a 12% non-refundable fee is required to confirm your booking' : 'Selected dates are not available'}
      </div>
    </>
  );
};

export default BookingActions;
